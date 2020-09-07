import { RENDER_TO_DOM } from './consts'
import { Vdom } from './vdom'

export class ElementWrapper extends Vdom {
    constructor(type) {
        super()
        this.type = type
    }
    [RENDER_TO_DOM](range) {

        this.$range = range

        const node = document.createElement(this.type)
        this.$node = node

        for (let name in this.props) {

            const value = this.props[name]

            if (name.match(/^on([\s\S]+)/)) {
                node.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
            } else {
                node.setAttribute(exchangeAttribute(name), value)
            }
        }

        for (let vchild of this.$vchildren) {
            const childRange = document.createRange()
            childRange.setStart(node, node.childNodes.length)
            childRange.setEnd(node, node.childNodes.length)
            vchild[RENDER_TO_DOM](childRange)
        }

        this.replaceConent()
    }
}

export class TextWrapper extends Vdom {
    constructor(content) {
        super()
        this.type = '#text'
        this.content = content
    }
    [RENDER_TO_DOM](range) {
        this.$range = range
        this.$node = document.createTextNode(this.content)
        this.replaceConent()
    }
}

function exchangeAttribute(raw) {
    if (raw === 'className') {
        return 'class'
    }
    return raw
}
