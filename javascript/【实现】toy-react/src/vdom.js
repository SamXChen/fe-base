import { RENDER_TO_DOM } from './consts'

export class Vdom {
    constructor() {
        this.props = Object.create(null)
        this.$type = null
        this.$range = null

        // vdom children
        //// 初始 children
        this.children = []
        //// 实际 children
        this.$vchildren = []        
    }
    setAttribute(name, value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    renderVdom() {
        return this
    }
    [RENDER_TO_DOM]() {
        throw new Error(`Pure Vdom shouldn't be rendered to DOM`)
    }
    replaceContent() {
        if (this.$range === null) {
            return
        }        
        replaceRangeContent(this.$range, this.$node)
    }
}

function replaceRangeContent(range, node) {
    range.insertNode(node)
    range.setStartAfter(node)
    range.deleteContents()

    range.setStartBefore(node)
    range.setEndAfter(node)
}
