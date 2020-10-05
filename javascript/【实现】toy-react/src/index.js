import { RENDER_TO_DOM, RENDER_V_CHILDREN } from './consts'
import { ElementWrapper, TextWrapper } from './elements'
import { Component, ComponentVdom } from './component'
import { buildReconciler, TASK_TYPE } from './reconciler'

export function render(vdom, parentEl) {
    
    if (vdom === null || !vdom[RENDER_TO_DOM]) {
        return
    }

    buildReconciler().pushTask({
        type: TASK_TYPE.ROOT_MOUNT,
        el: parentEl,
        vdom: vdom,
    })
}

export function createElement(type, attributes, ...children) {    
    
    const vdomClass = typeof type === 'string' ? ElementWrapper : ComponentVdom
    const vdom = new vdomClass(type)

    for (const key in attributes) {
        vdom.setAttribute(key, attributes[key])
    }
    for (const child of children) {
        insertChild(vdom, child)
    }

    return vdom    
}

function insertChild(vdom, child) {
    if (child === null) {
        return
    }
    if (typeof child === 'string' || typeof child === 'number') {
        return vdom.appendChild(new TextWrapper(child))
    }
    if (Array.isArray(child)) {
        const children = child
        for (const child of children) {
            insertChild(vdom, child)
        }
        return
    }
    vdom.appendChild(child)
}

export { 
    Component,
}