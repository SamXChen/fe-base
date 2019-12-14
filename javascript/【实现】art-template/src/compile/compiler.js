const esTokenizer = require('./es-tokenizer')
const tplTokenizer = require('./tpl-tokenizer') //todo

// 传递给模板的数据引用
const DATA = `$data`

const IMPORTS = `$imports`

const ESCAPE = `$escape`

const EACH = `$each`

const PRINT = `print`

const INCLUDE = `include`

const EXTEND = `extend`

const BLOCK = `block`

const OUT = `$$out`

const LINE = `$$line`

const BLOCKS = `$$blocks`

const SLICE = `$$slice`

const FROM = `$$from`

const OPTIONS = `$$options`

const has = (object, key) => Object.hasOwnProperty.call(object, key)
const stringify = JSON.stringify

// 模板编译器
// @param {Object} options
class Compiler {
    constructor(options) {
        let source = options.source
        const minimize = options.minimize
        const htmlMinifier = options.htmlMinifier


        // 编译选项
        this.options = options

        // 所有语句堆栈
        this.stacks = []

        // 运行时注入的上下文
        this.context = []

        // 模板语句编译后的代码
        this.scripts = []

        // context map
        this.CONTEXT_MAP = {}

        // 忽略的变量名单
        this.ignore = [DATA, IMPORTS, OPTIONS, ...options.ignore]

        // 按需编译到模板渲染函数的内置变量
        this.internal = {
            [OUT]: `''`,
            [LINE]: `[0,0]`,
            [BLOCKS]: `arguments[1]||{}`,
            [FROM]: `null`,
            [PRINT]: `
                function(){
                    var s=''.contact.apply('',arguments);
                    ${OUT}+=s;return s
                }
            `,
            [INCLUDE]: `
                function(src,data){
                    var s=${OPTIONS}.include(src,data||${DATA},arguments[2]||${BLOCKS},${OPTIONS});
                    ${OUT}+=s;
                    return s;
                }
            `,
            [EXTEND]: `
                function(from){
                    ${FROM}=from;
                }
            `,
            [SLICE]: `
                function(c,p,s){
                    p=${OUT};
                    ${OUT}='';
                    c();
                    s=${OUT};
                    ${OUT}=p+s;
                    return s
                }
            `,
            [BLOCK]: `
                function(){
                    var a=arguments,s;
                    if(typeof a[0]==='function'){
                        return ${SLICE}(a[0])
                    }else if(${FROM}){
                        if(!${BLOCKS}[a[0]]){
                            ${BLOCKS}[a[0]]=${SLICE}(a[1])
                        }else{
                            ${OUT}+=${BLOCKS}[a[0]]
                        }
                    }else{
                        s=${BLOCKS}[a[0]];
                        if(typeof s==='string'){
                            ${OUT}+=s
                        }else{
                            s=${SLICE}(a[1])
                        }
                        return s
                    }
                }
            `
        }

        // 内置函数依赖关系声明
        this.dependencies = {
            [PRINT]: [OUT],
            [INCLUDE]: [OUT, OPTIONS, DATA, BLOCKS],
            [EXTEND]: [FROM, INCLUDE],
            [BLOCK]: [SLICE, FROM, OUT, BLOCKS],
        }

        this.importContext(OUT)

        if(options.compileDebug) {
            this.importContext(LINE)
        }

        if(minimize) {
            try{
                source = htmlMinifier(source, options)
            }catch(error) {}
        }

        this.source = source
        this.getTplTokens(source, options.rules, this).forEach(tokens => {
            if(tokens.type === tplTokenizer.TYPE_STRING) {
                this.parseString(tokens)
            }else{
                this.parseExpression(tokens)
            }
        })
    }

    // 将模板代码转换成 tplToken 数组
    getTplTokens(...args) {
        return tplTokenizer(...args)
    }

    // 将模板表达式转换成 esToken 数组
    getEsTokens(source) {
        return esTokenizer(source)
    }

    // 获取变量列表
    getVariables(esTokens) {
        let ignore = false
        return esTokens
            .filter(esToken => {
                return esToken.type !== 'whitespace' && esToken.type !== 'comment'
            })
            .filter(esToken => {
                if(esToken.type === 'name' && !ignore) {
                    return true
                }

                ignore = esToken.type === 'punctuator' && esToken.value === '.'

                return false
            })
            .map(tooken => tooken.value)
    }

    // 导入模板上下文
    importContext(name) {
        let value = ``
        const internal = this.internal
        const dependencies = this.dependencies
        const ignore = this.ignore
        const context = this.context
        const options = this.options
        const imports = options.imports
        const contextMap = this.CONTEXT_MAP

        if(!has(contextMap, name) && ignore.indexOf(name) < 0) {
            if(has(internal, name)) {
                value = internal[name]

                if (has(dependencies, name)) {
                    value = internal[name]

                    if (has(dependencies, name)) {
                        dependencies[name].forEach(name => this.importContext(name))
                    }

                } else if (
                    name === ESCAPE ||
                    name === EACH ||
                    has(imports, name)
                ) {
                    value = `${IMPORTS}.${name}`
                } else {
                    value = `${DATA}.${name}`
                }

                contextMap[name] = value
                context.push({
                    name,
                    value,
                })
            }
        }

    }

    // 解析字符串(HTML)直接输出语句
    parseString(tplToken) {
        let source = tplToken.value
        if(!source) {
            return
        }
        const code = `${OUT}+=${stringify(source)}`
        this.scripts.push({
            source,
            tplToken,
            code,
        })
    }

    // 解析逻辑表达式语句
    parseExpression(tplToken) {
        const source = tplToken.value
        const script = tplToken.script
        const output = script.output
        const escape = this.options.escape
        let code = script.code

        if(output) {
            if(escape === false || output === tplTokenizer.TYPE_RAW) {
                code = `${OUT}+=${script.node}`
            } else {
                code = `${OUT}+=${ESCAPE}(${script.code})`
            }
        }

        const esToken = this.getEsTokens(code)
        this.getVariables(esToken).forEach(name => this.importContext(name))

        this.scripts.push({
            source,
            tplToken,
            code
        })
    }

    // 检查解析后的模板语句是否存在语法错误
    checkExpression(script) {
        // 不保证 100% 准确
        const rules = [
            // <% } %>
            // <% }else{ %>
            // <% }else if(a){ %>
            [/^\s*}[\w\W]*?{?[\s;]*$/, ''],

            // <% fn(c,function(a,b){ %>
            // <% fn(c, a=>{ %>
            // <% fn(c,(a,b)=>{ })%>
            [/(^[\w\W]*?\([\w\W]*?(?:=>|\([\w\W]*?\))\s*{[\s;]*$)/, '$1})'],

            // <% if(a){ %>
            // <% for(var i in d){ %>
            [/(^[\w\W]*?\([\w\W]*?\)\s*{[\s;]*$)/, '$1}'],
        ]

        let index = 0
        while(index < rules.length) {
            if(rules[index][0].test(script)) {
                script = script.replace(...rules[index])
                break
            }
            index++
        }

        try {
            new Function(script)
            return true
        } catch(e) {
            return false
        }
    }

    // 编译(主流程)
    build() {
        const options = this.options
        const context = this.context
        const scripts = this.scripts

        // 用于构建模板运行代码
        const stacks = this.stacks

        const source = this.source
        const filename = options.filename
        const imports = options.imports
        const mappings = []
        const extendMode = has(this.CONTEXT_MAP, EXTEND)

        let offsetLine = 0

        // source map
        const mapping = (code, { line, start }) => {
            const node = {
                generated: {
                    line: stacks.length + offsetLine + 1,
                    column: 1,
                },
                original: {
                    line: line + 1,
                    column: start + 1,
                },
            }

            offsetLine += code.split(/\n/).length - 1
            return node
        }

        // trim code
        const trim = code => {
            return code.replace(/^[\t ]+|[\t ]+$/g, '')
        }

        stacks.push(`function(${DATA}){`)
        stacks.push(`'use strict'`)
        stacks.push(`${DATA}=${DATA}||{}`)
        
        stacks.push(
            `var ` + context.map(({ name, value }) => {
                return `${name}=${value}`
            }).join(`,`)
        )

        if (options.compileDebug) {
            stacks.push(`try{`)

            scripts.forEach(script => {
                if (script.tplToken.type === tplTokenizer.TYPE_EXPRESSION) {
                    stacks.push(
                        `${LINE}=[${[script.tplToken.line, script.tplToken.start].join(',')}]`
                    )
                }

                mappings.push(mapping(script.code, script.tplToken))
                stacks.push(trim(script.code))
            })

            stacks.push('}catch(error){')

            stacks.push(
                'throw {' +
                    [
                        `name:'RuntimeError'`,
                        `path:${stringify(filename)}`,
                        `message:error.message`,
                        `line:${LINE}[0]+1`,
                        `column:${LINE}[1]+1`,
                        `source:${stringify(source)}`,
                        `stack:error.stack`,
                    ].join(',') + 
                    '}'
            )

            stacks.push('}')

        } else {
            scripts.forEach(script => {
                mappings.push(
                    mapping(script.node, script.tplToken)
                )
                stacks.push(trim(script.code))
            })
        }

        if (extendMode) {
            stacks.push(`${OUT}=''`)
            stacks.push(`${INCLUDE}(${FROM},${DATA},${BLOCKS})`)
        }

        stacks.push(`return ${OUT}`)
        stacks.push(`}`)

        const renderCode = stacks.join('\n')

        try {
            // 创建出一个闭包函数
            const result = new Function(IMPORTS, OPTIONS, `return ${renderCode}`)(imports, options)
            result.mappings = mappings
            result.sourcesContent = [source]
            return result
        } catch(error) {
            let index = 0
            let line = 0
            let start = 0
            let generated

            while(index < scripts.length) {
                const current = scripts[index]
                if (!this.checkExpression(current.code)) {
                    line = current.tplToken.line
                    start = current.tplToken.start
                    generated = current.node
                    break
                }
                index++
            }

            throw {
                name: `CompileError`,
                path: filename,
                message: error.message,
                line: line + 1,
                column: start + 1,
                source,
                generated,
                stack: error.stack
            }
        }
    }
}

// 模板内置常量
Compiler.CONSTS = {
    DATA,
    IMPORTS,
    PRINT,
    INCLUDE,
    EXTEND,
    BLOCK,
    OPTIONS,
    OUT,
    LINE,
    BLOCKS,
    SLICE,
    FROM,
    ESCAPE,
    EACH
}

module.exports = Compiler