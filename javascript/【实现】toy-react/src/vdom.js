import { RENDER_TO_DOM, RENDER_V_CHILDREN } from './consts'

export class Vdom {
    constructor() {
        this.props = Object.create(null)
        this.$type = null
        this.$range = null
        this.$vchildren = []        
    }
    setAttribute(name, value) {
        this.props[name] = value
    }
    appendChild(component) {
        let children
        if (this.props['children'] === undefined) {
            this.props['children'] = []
        }
        children = this.props['children']
        children.push(component)
    }
    [RENDER_V_CHILDREN]() {
        return this
    }
    [RENDER_TO_DOM](range) {
        this.$range = range
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
