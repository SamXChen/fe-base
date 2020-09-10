import { RENDER_TO_DOM } from './consts'

export class Vdom {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this.$vchildren = []
        this.$range = null
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
        const range = this.$range
        const node = this.$node
        
        replaceRangeContent(range, node)
    }
}

function replaceRangeContent(range, node) {
    range.insertNode(node)
    range.setStartAfter(node)
    range.deleteContents()

    range.setStartBefore(node)
    range.setEndAfter(node)
}
