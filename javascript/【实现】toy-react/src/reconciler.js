import { RENDER_TO_DOM, RENDER_V_CHILDREN } from './consts'

export const TASK_TYPE = {
    ROOT_MOUNT:     1,
    RENDER_VDOM:    5,
    RENDER_DOM:     6,
}

export function buildReconciler() {
    return new Reconciler()
}

class Reconciler {

    taskQueue = []

    pushTask(taskOpt = {}) {

        this.taskQueue.push(taskOpt)

        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.flushTaskQueue()
        })
    }

    flushTaskQueue() {
        console.log('flush task queue')
        while(this.taskQueue.length > 0) {
            const task = this.taskQueue.shift()
            this.dispatchTask(task)
        }
    }

    dispatchTask(task) {
        console.log('dispatch task', task)
        switch(task.type) {
            case TASK_TYPE.ROOT_MOUNT:
                this.rootMount(task)
                break
            case TASK_TYPE.RENDER_VDOM:
                this.renderVdom(task)
                break
            case TASK_TYPE.RENDER_DOM:
                this.renderDom(task)
            default:
                break
        }
    }

    rootMount(task) {
        const {
            el,
            vdom,
        } = task

        // push render task
        this.pushTask({
            type: TASK_TYPE.RENDER_VDOM,
            level: 0,
            vdom,
        })
        
        this.flushTaskQueue()

        console.log(vdom)

        // push mount dom task
        this.pushTask({
            type: TASK_TYPE.RENDER_DOM,
            vdom,
            el,
        })
    }

    renderVdom(task) {
        const {
            level,
            vdom,
            parentVdom,
        } = task

        const nextLevel = level + 1
        if (parentVdom) {
            vdom.$parent = parentVdom
        }
        vdom[RENDER_V_CHILDREN]()
        if (vdom.$vchildren.length) {
            for (const child of vdom.$vchildren) {
                this.pushTask({
                    type: TASK_TYPE.RENDER_VDOM,
                    level: nextLevel,
                    vdom: child,
                    parentVdom: vdom,
                })
            }
        }
    }

    renderDom(task) {
        const {
            vdom,
            el,
        } = task

        let range = document.createRange()

        if (el) {
            range.setStart(el, 0)
            range.setEnd(el, el.childNodes.length)
            range.deleteContents()
        } else if (vdom.$parent.$node) {
            const node = vdom.$parent.$node
            range.setStart(node, node.childNodes.length)
            range.setEnd(node, node.childNodes.length)
        } else {
            range = vdom.$parent.$range
        }
        
        vdom[RENDER_TO_DOM](range)

        if (vdom.$vchildren.length) {
            for (const child of vdom.$vchildren) {
                this.pushTask({
                    type: TASK_TYPE.RENDER_DOM,
                    vdom: child,
                })
            }
        }
    }
}