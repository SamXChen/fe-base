const htmlEncoder = require('../common/html-encode')

const tmpl = (str, data) => {
    if(!/[\s\W]/g.test(str)) {
        tpl = document.getElementById(str).innerHTML
    } else {
        tpl = str
    }

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

    const argVals = []
    const argKeys = []
    for(let key in data) {
        argKeys.push(key.toString())
        argVals.push(data[key])
    }

    argKeys.push('htmlEncode')
    argVals.push(htmlEncoder.htmlEncode)

    const fn = new Function(...argKeys, result)
    const resultStr = fn.apply({}, argVals)
    return resultStr
}

module.exports = tmpl