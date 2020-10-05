import { Vdom } from './vdom'
import { RENDER_TO_DOM, RENDER_V_CHILDREN } from './consts'

export class ComponentVdom extends Vdom {
    
    constructor(type) {
        super()
        this.$instance = null
        this.$type = type
    }
    [RENDER_V_CHILDREN]() {
        if (this.$instance === null) {
            this.createInstance()
        }
        this.$vchildren = [this.$instance.render()]
    }
    createInstance() {
        const type = this.$type
        if (type === null) {
            throw new Error(`Instance of ComponentVdom shouldn't be null`)
        }
        // 组件实例 与 vdom 双向绑定
        this.$instance = new type(this.props)
        this.$instance.$vdom = this
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
        console.log('update')
        if (this.$vdom === null) {
            throw new Error(`vdom of Instance is null`)
        }
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
