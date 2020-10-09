import { RENDER_TO_DOM, RENDER_V_CHILDREN } from './consts'
import { isSame } from './diff'

export const TASK_TYPE = {
    ROOT_MOUNT:     'ROOT_MOUNT',
    RENDER_VDOM:    'RENDER_VDOM',
    RENDER_DOM:     'RENDER_DOM',
    PATCH_VDOM:     'PATCH_VDOM',
}

export function buildReconciler() {
    return new Reconciler()
}

class Reconciler {

    timer = null

    taskQueue = []

    pushTask(taskOpt = {}) {

        this.taskQueue.push(taskOpt)

        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.flushTaskQueue()
        })
    }

    flushTaskQueue() {
        // console.info('flush task queue')
        while(this.taskQueue.length > 0) {
            const task = this.taskQueue.shift()
            this.dispatchTask(task)
        }
    }

    dispatchTask(task) {
        console.info('dispatch task', task)
        switch(task.type) {
            case TASK_TYPE.ROOT_MOUNT:
                this.rootMount(task)
                break
            case TASK_TYPE.RENDER_VDOM:
                this.renderVdom(task)
                break
            case TASK_TYPE.RENDER_DOM:
                this.renderDom(task)
                break
            case TASK_TYPE.PATCH_VDOM:
                this.patchVdom(task)
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

    patchVdom(task) {
        const {
            oldVdom,
            newVdom,
        } = task

        newVdom.$parent = oldVdom.$parent

        // if vdom is abandoned, return directly
        if (isVdomAbandoned(newVdom)) {
            return
        }

        // oVdom equals nVdom
        if (isSame(oldVdom, newVdom)) {

            // newVdom inherit oldVdom component instance
            if (oldVdom.$instance) {
                newVdom.$instance = oldVdom.$instance
            }
            // newVdom inherit oldVdom dom range
            if (oldVdom.$range) {
                newVdom.$range = oldVdom.$range
            }
            
            // render new Vdom vchildren
            newVdom[RENDER_V_CHILDREN]()

            // patch newVdom vchildren and oldVdom vchildren
            // @todo, diff vchildren with key
            // 暂时只按顺序进行 vchildren 的 diff
            for (let idx = 0; idx < newVdom.$vchildren.length; ++idx) {
                this.pushTask({
                    type: TASK_TYPE.PATCH_VDOM,
                    oldVdom: oldVdom.$vchildren[idx],
                    newVdom: newVdom.$vchildren[idx],
                })
            }
            
            return
        }

        // oVdom not equals nVdom
        // render newVdom tree
        if (newVdom.$type === oldVdom.$type && typeof newVdom.$type !== 'string') {
            // update props and state for instance
            newVdom.$instance = oldVdom.$instance
            // @todo component will update hook
            newVdom.$instance.props = newVdom.props
            newVdom.$instance.$vdom = newVdom
        }
        this.pushTask({
            type: TASK_TYPE.RENDER_VDOM,
            level: 0,
            vdom: newVdom
        })

        this.flushTaskQueue()

        // render newVdom to dom tree
        if (oldVdom.$range) {
            oldVdom.$range.deleteContents()
        }

        oldVdom.$abandoned = true

        this.pushTask({
            type: TASK_TYPE.RENDER_DOM,
            vdom: newVdom,
            range: oldVdom.$range,
        })
    }

    renderDom(task) {
        const {
            vdom,
            el,
        } = task

        let { range } = task

        if (range === undefined) {
            range = document.createRange()

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

function isVdomAbandoned(vdom) {
    if (vdom.$abandoned === true) {
        return true
    }
    if (vdom.$parent) {
        return isVdomAbandoned(vdom.$parent)
    }
    return false
}