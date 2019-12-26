const nativeRule = {
    test: /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/,
    use: (match, comment, output, code) => {
        output = {
            '-': 'raw',
            '=': 'escape',
            '==': 'raw',
            '=#': 'raw',
        }[output]

        if (comment) {
            code = `/*${code}*/`
            output = false
        }

        return {
            code,
            output,
        }
    }
}

module.exports = nativeRule