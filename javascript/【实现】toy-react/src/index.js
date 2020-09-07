import { RENDER_TO_DOM } from './consts'
import { ElementWrapper, TextWrapper } from './elements'
import { Component } from './component'

export function createElement(type, attributes, ...children) {

    let vdom

    if (typeof type === 'string') {
        vdom = new ElementWrapper(type)
    } else {
        vdom = new type()
    }

    for (let key in attributes) {
        vdom.setAttribute(key, attributes[key])
    }
    inserChildren(vdom, children)
    return vdom    
}

export function render(vdom, parentEl) {
    if (vdom === null || !vdom[RENDER_TO_DOM]) {
        return
    }
    const range = document.createRange()
    range.setStart(parentEl, parentEl.childNodes.length)
    range.setEnd(parentEl, parentEl.childNodes.length)
    range.deleteContents()
    vdom[RENDER_TO_DOM](range)
}

function inserChildren(vdom, children) {
    for (let child of children) {
        if (child === null) {
            continue
        }
        if (typeof child === 'string') {
            child = new TextWrapper(child)
        }
        if (typeof child === 'object' && child instanceof Array) {
            inserChildren(vdom, child)
        } else {
            vdom.appendChild(child)
        }
    }
}

export { 
    Component,
}