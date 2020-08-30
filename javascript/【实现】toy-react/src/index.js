const RENDER_TO_DOM = Symbol('render to dom')

export function createElement(type, attributes, ...children) {

    let el

    if (typeof type === 'string') {
        el = new ElementWrapper(type)
    } else {
        el = new type()
    }

    for (let key in attributes) {
        el.setAttribute(key, attributes[key])
    }
    inserChildren(el, children)
    return el    
}

function inserChildren(el, children) {
    for (let child of children) {
        if (typeof child === 'string') {
            child = new TextWrapper(child)
        }
        if (typeof child === 'object' && child instanceof Array) {
            inserChildren(el, child)
        } else {
            el.appendChild(child)
        }
    }
}

export function render(component, parentEl) {
    const range = document.createRange()
    range.setStart(parentEl, 0)
    range.setEnd(parentEl, parentEl.childNodes.length)
    range.deleteContents()
    component[RENDER_TO_DOM](range)
}


class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)/)) {
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
        } else {
            this.root.setAttribute(name, value)
        }
    }
    appendChild(component) {
        const range = document.createRange()
        const root = this.root
        range.setStart(root, root.childNodes.length)
        range.setEnd(root, root.childNodes.length)
        component[RENDER_TO_DOM](range)
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
        this._range = null
    }
    setAttribute(name, value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        this._range = range
        this.render()[RENDER_TO_DOM](range)
    }
    rerender() {
        const range = this._range
        range.deleteContents()
        this[RENDER_TO_DOM](range)
    }
}
