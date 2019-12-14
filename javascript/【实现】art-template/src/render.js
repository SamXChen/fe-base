const compile = require('./compile')

const render = (source, data, options) => compile(source, options)(data)

module.exports = render