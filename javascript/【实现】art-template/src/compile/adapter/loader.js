const detectNode = typeof window === 'undefined'
// 读取模板内容
const loader = (filename) => {
    if (detectNode) {
        const fs = require('fs')
        return fs.readFileSync(filename, 'utf8')
    } else {
        const elem = document.getElementById(filename)
        return elem.value || elem.innerHTML
    }
}

module.exports = loader