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
    parentEl.appendChild(component.root)
}


class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(component) {
        // 在此处对 component 进行数组判断以及展开，也能实现 this.children 这个数组的支持
        // if (Array.isArray(component)) {
        //     for (const com of component) {
        //         this.root.appendChild(com.root)
        //     }
        //     return
        // } 
        this.root.appendChild(component.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
    }
    setAttribute(name, value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    get root() {
        if (!this._root) {
            this._root = this.render().root
        }
        return this._root
    }
}
