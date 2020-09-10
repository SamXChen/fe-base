import { Vdom } from './vdom'
import { RENDER_TO_DOM } from './consts'
import { patch } from './diff'


export class Component extends Vdom {

    constructor() {
        super()
    }
    renderVdom() {
        this.$vchildren = [this.render().renderVdom()]
        return this
    }
    [RENDER_TO_DOM](range) {
        const prevRange = this.$range
        this.$range = range

        if (prevRange === null) {
            this.componentWillMount()
        } else {
            // componentWillUpdate
        }
        
        const vdom = this.$vchildren[0]
        vdom[RENDER_TO_DOM](range)

        if (prevRange === null) {
            this.componentDidMount()
        } else {
            // componentDidUpdate
        }
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
        const oldVdom = this.$vchildren[0]
        this.renderVdom()
        const newVdom = this.$vchildren[0]
        // @todo
        // diff patch
        patch(oldVdom, newVdom)
    }
    
    // 组件生命周期 -- start
    componentWillMount() {}
    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}
    shouldComponentUpdate(nextProps, nextState) {}

    componentWillUpdate(nextProps, nextState) {}
    componentDidUpdate(prevProps, prevState) {}

    componentWillUnmount() {}
    // 组件生命周期 -- end
}

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
