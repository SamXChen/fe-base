const isKeyword = require('is-keyword-js')
const jsTokens = require('js-tokens').default
const matchToToken = require('js-tokens').matchToToken

// 将逻辑表达式解释为 Tokens
const esTokenizer = code => {
    const tokens = code
        .match(jsTokens)
        .map(value => {
            jsTokens.lastIndex = 0
            return matchToToken(jsTokens.exec(value))
        })
        .map(token => {
            if (token.type === 'name' && isKeyword(token.value)) {
                token.type = 'keyword'
            }
            return token
        })
        
    return tokens
}

module.exports = esTokenizer