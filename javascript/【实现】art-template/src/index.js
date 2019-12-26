const render = require('./render')
const compile = require('./compile')
const defaults = require('./defaults')

const template = (filename, content) => {
    let res
    if(content instanceof Object) {
        res = render({ filename }, content)
    }else {
        res = compile({ filename, source: content })
    }
    return res
}

template.render = render
template.compile = compile
template.defaults = defaults

module.exports = template