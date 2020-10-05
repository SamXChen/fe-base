import { RENDER_TO_DOM, RENDER_V_CHILDREN } from './consts'
import { Vdom } from './vdom'

export class ElementWrapper extends Vdom {
    constructor(type) {
        super()
        this.$type = type
    }
    [RENDER_V_CHILDREN]() {
        const { children = [] } = this.props
        this.$vchildren = [...children]
    }
    [RENDER_TO_DOM](range) {

        this.$range = range

        const node = document.createElement(this.$type)
        this.$node = node

        for (let name in this.props) {

            const value = this.props[name]

            if (name.match(/^on([\s\S]+)/)) {
                node.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
            } else {
                node.setAttribute(exchangeAttribute(name), value)
            }
        }
        this.replaceContent()
    }
}

export class TextWrapper extends Vdom {
    constructor(content) {
        super()
        this.$type = '#text'
        this.content = content
    }
    [RENDER_TO_DOM](range) {
        this.$range = range
        this.$node = document.createTextNode(this.content)
        this.replaceContent()
    }
}

function exchangeAttribute(raw) {
    if (raw === 'className') {
        return 'class'
    }
    return raw
}
