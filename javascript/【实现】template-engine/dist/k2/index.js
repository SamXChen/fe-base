const htmlEncoder = require('../common/html-encode')

let tpl = ''
let match = ''

const cache = new Map()

const add = (str, result, js, raw) => {
    str = str.replace(/[\r\n\t]/g, '')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")

    if(js) {
        if(/<%=\s*([^%>]+)\s*%>/.test(raw)) {
            result += `result.push(htmlEncode(${str}.toString()));`
        }else if(/<%-\s*([^%>]+)\s*%>/.test(raw)) {
            result += `result.push(${str});`
        }else {
            result += `${str}`
        }
    }else {
        result += `result.push('${str}');`
    }

    return result
}

const buildFnStr = (str) => {
    let cursor = 0
    let result = 'let result = [];'

    const tpl = str

    // 匹配 js 语句或变量
    const tplReg = /<%[=-]?\s*([^%>]+?)\s*%>/g

    // 使用 exec 函数，动态改变 index 的值
    while(match = tplReg.exec(tpl)) {

        const targetStr = tpl.slice(cursor, match.index)
        // 添加 <% %> 前面的字符串
        result = add(targetStr, result)
        // 添加 <% %> 里面的字符串
        result = add(match[1], result, true, match[0])

        cursor = match.index + match[0].length
    }
    result = add(tpl.slice(cursor), result)
    result += `return result.join('')`
    return result
}

const render = (str, data) => {

    const argKeys = []
    const argVals = []
    for(let key in data) {
        argKeys.push(key)
        argVals.push(data[key])
    }
    argKeys.push('htmlEncode')
    argVals.push(htmlEncoder.htmlEncode)

    let fn

    const fnKeyArr = [...argKeys, str]
    const fnKey = fnKeyArr.join('')

    if(cache.has(fnKey)) {
        fn = cache.get(fnKeyArr)
    }else {
        fn = new Function(...argKeys, buildFnStr(str))
        cache.set(fnKey, fn)
    }

    return fn.apply({}, argVals)
}

module.exports = render
module.exports.cache = cache