import { Vdom } from './vdom'
import { RENDER_TO_DOM } from './consts'
import { patch } from './diff'

export class ComponentVdom extends Vdom {
    
    constructor() {
        super()
        this.$instance = null
    }
    renderVdom() {
        if (this.$instance === null) {
            this.createInstance()
        }
        const instance = this.$instance
        this.$vchildren = [instance.render().renderVdom()]
        return this
    }
    createInstance() {
        const type = this.$type
        if (type === null) {
            throw new Error(`Instance of ComponentVdom shouldn't be null`)
        }
        // 组件实例 与 vdom 双向绑定
        this.$instance = new type(this.props)
        // 将 vdom 的 props 与 children 赋值给 instance
        this.$instance.bindVdom(this, this.children)
    }
    [RENDER_TO_DOM](range) {
        this.$range = range
        this.$vchildren[0][RENDER_TO_DOM](range)
    }
}

export class Component {

    constructor(props) {
        this.$vdom = null
        this.props = props
        this.children = []
    }
    bindVdom(vdom, children) {
        this.$vdom = vdom
        this.children = children
    }
    setState(newState) {
        if (this.state === null || typeof this.state !== 'object') {
            this.state = newState
            this.update()
            return
        }        
        merge(this.state, newState)
        this.update()
    }
    update() {
        if (this.$vdom === null) {
            throw new Error(`vdom of Instance is null`)
        }
        // @todo
        const oldVdom = this.$vdom.$vchildren[0]

        const newVdom = this.render()
        newVdom.$vchildren = newVdom.children
        patch(oldVdom, newVdom)
        this.$vdom.$vchildren = [newVdom]
    }
}

function merge(oldState, newState) {
    for (const key in newState) {
        if (oldState[key] === null || typeof oldState[key] !== 'object') {
            oldState[key] = newState[key]
        } else if (newState[key] === undefined || newState[key] === null || typeof newState[key] !== 'object') {
            oldState[key] = newState[key]
        } else if (typeof newState[key] === 'object' && newState[key] instanceof Array) {
            oldState[key] = newState[key]
        } else {
            merge(oldState[key], newState[key])
        }
    }
}
