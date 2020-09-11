
import { RENDER_TO_DOM } from './consts'

export function patch(oldVdom, newVdom) {

    if (!isSame(oldVdom, newVdom)) {
        newVdom[RENDER_TO_DOM](oldVdom.$range)
        return
    }

    newVdom.$range = oldVdom.$range

    const newChildren = newVdom.$vchildren
    const oldChildren = oldVdom.$vchildren

    if (!newChildren || !newChildren.length) {
        return
    }

    let tailRange = oldChildren[oldChildren.length - 1].$range
    for (let idx = 0; idx < newChildren.length; ++idx) {
        const newChild = newChildren[idx]
        const oldChild = oldChildren[idx]
        if (idx < oldChildren.length) {
            patch(oldChild, newChild)
        } else {
            const range = document.createRange()
            range.setStart(tailRange.endContainer, tailRange.endOffset)
            range.setEnd(tailRange.endContainer, tailRange.endOffset)
            newChild[RENDER_TO_DOM](range)
            tailRange = range
        }
    }
}

export function isSame(oldVdom, newVdom) {
    
    if (oldVdom.type !== newVdom.type) {
        return false
    }
    if (oldVdom.$vchildren.length !== newVdom.$vchildren.length) {
        return false
    }
    if (Object.keys(oldVdom.props).length !== Object.keys(newVdom.props).length) {
        return false
    }
    for (let name in oldVdom.props) {
        if (newVdom.props[name] !== oldVdom.props[name]) {
            return false
        }
    }
    if (newVdom.type === '#text' && newVdom.content !== oldVdom.content) {
        return false
    }
    return true
}
