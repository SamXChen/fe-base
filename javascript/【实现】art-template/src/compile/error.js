const LineExtendNum = 3

class TemplateError extends Error {
    constructor(options) {
        super(options.message)
        this.name = 'TemplateError'
        this.message = formatMessage(options)
        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, this.contructor)
        }
    }
}

function formatMessage({
    name,
    source,
    path,
    line,
    column,
    generated,
    message,
}) {
    if(!source) {
        return message
    }

    const lines = source.split(/\n/)
    const start = Math.max(line - LineExtendNum, 0)
    const end = Math.min(lines.length, line + LineExtendNum)

    const context = lines
        .slice(start, end)
        .map((code, index) => {
            const number = index + start + 1
            const left = number === line ? ' >> ' : '    '
            return `${left}${number}| ${code}`
        })
        .join('\n')

    return (
        `${path || 'anonymous'}:${line}:${column}\n` +
        `${context}\n\n` +
        `${name}: ${message}` +
        (generated ? `\n    generated: ${generated}` : '')
    )
}

module.exports = TemplateError