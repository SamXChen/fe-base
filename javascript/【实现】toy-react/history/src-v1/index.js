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
        if (child === null) {
            continue
        }
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

function exchangeAttribute(raw) {
    if (raw === 'className') {
        return 'class'
    }
    return raw
}

export function render(component, parentEl) {
    if (component === null || !component[RENDER_TO_DOM]) {
        return
    }
    const range = document.createRange()
    // setStart 设置 parentEl.childNodes.length，可以避免把已有的 root children 删除
    range.setStart(parentEl, parentEl.childNodes.length)
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
            this.root.setAttribute(exchangeAttribute(name), value)
        }
    }
    appendChild(component) {
        if (component === null || !component[RENDER_TO_DOM]) {
            return
        }
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
        this.state = null
    }
    setAttribute(name, value) {
        // component will receive props
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        // component will mount
        this._range = range
        this.render()[RENDER_TO_DOM](range)
        // component mounted
    }
    rerender() {
        // should component update
        // component will update
        const range = this._range
        range.deleteContents()
        this[RENDER_TO_DOM](range)
        // component did updated
    }
    setState(newState) {

        if (this.state === null || typeof this.state !== 'object') {
            this.state = newState
            this.rerender()
            return
        }
        
        merge(this.state, newState)
        this.rerender()

        function merge(oldState, newState) {
            for (const key in newState) {
                if (oldState[key] === null || typeof oldState[key] !== 'object') {
                    oldState[key] = newState[key]
                } else if (newState[key] === undefined || newState[key] === null || typeof newState[key] !== 'object') {
                    oldState[key] = newState[key]
                } else {
                    merge(oldState[key], newState[key])
                }
            }
        }
    }
}
