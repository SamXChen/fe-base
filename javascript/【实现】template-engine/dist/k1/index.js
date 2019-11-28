const htmlEncoder = require('../common/html-encode')

const cache = new Map()

const buildFn = (argKeys, tpl) => {
    let result = `let p = []; p.push('`
    result += `${
        tpl.replace(/[\r\n\t]/g, '')
            .replace(/\\/, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/<%=\s*([^%>]+?)\s*%>/g, "'); p.push(htmlEncode($1.toString())); p.push('")
            .replace(/<%-\s*([^%>]+?)\s*%>/g, "'); p.push($1); p.push('")
            .replace(/<%/g, "');")
            .replace(/%>/g, "p.push('")
    }`
    result += "'); return p.join('');"

    return new Function(...argKeys, result)
}

const render = (str, data) => {

    const tpl = str

    const argVals = []
    const argKeys = []
    for(let key in data) {
        argKeys.push(key.toString())
        argVals.push(data[key])
    }

    argKeys.push('htmlEncode')
    argVals.push(htmlEncoder.htmlEncode)

    let fn

    const fnKeyArr = [...argKeys, tpl]
    const fnKey = fnKeyArr.join('')
    
    if(cache.has(fnKey)) {
        fn = cache.get(fnKey)
    }else {
        fn = buildFn(argKeys, tpl)
        cache.set(fnKey, fn)
    }

    const result = fn.apply({}, argVals)
    return result
}

module.exports = render
module.exports.cache = cache 