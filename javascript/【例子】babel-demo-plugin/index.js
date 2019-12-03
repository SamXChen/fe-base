const t = require('babel-types')
const fileVisitor = {
    Program(path, state) {
        const filename = state.file.opts.filename;
        if(filename && filename.indexOf('action-type') < 0) {
            path.skip()
        }
        path.traverse(exportVisitor)
    }
}

const exportVisitor = {
    VariableDeclaration(path) {
        if(path.node.kind !== 'const') {
            path.skip()
        }
        path.traverse(variableDeclarationVisitor)
    }
}

const variableDeclarationVisitor = {
    VariableDeclarator(path) {
        const node = path.node
        const name = node.id.name
        path.traverse(literalDeclaratorVisitor, { name })
    }
}

const literalDeclaratorVisitor = {
    Literal(path) {
        const name = this.name
        path.replaceWith(t.stringLiteral(name))
        path.stop()
    }
}

// 入口
// 访问器模式
// 通过 visitor 遍历 ast
module.exports = function() {
    return {
        visitor: fileVisitor
    }
}