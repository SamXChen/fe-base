import { Vdom } from './vdom'
import { RENDER_TO_DOM } from './consts'
import { patch } from './diff'


export class Component extends Vdom {
    
    constructor() {
        super()
        this.$vdom = null
    }
    renderVdom() {
        return this.render().renderVdom()
    }
    [RENDER_TO_DOM](range) {
        this.$range = range
        this.$vdom = this.renderVdom()
        this.$vdom[RENDER_TO_DOM](range)
    }
    setState(newState) {
        if (this.state === null || typeof this.state !== 'object') {
            this.state = newState
            this.update()
            return
        }        
        merge(this.state, newState)
        this.update()
        
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
    update() {
        const newVdom = this.renderVdom()
        const oldVdom = this.$vdom
        patch(oldVdom, newVdom)
        this.$vdom = newVdom
    }
}
