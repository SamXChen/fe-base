
export function isSame(oldVdom, newVdom) {
    
    if (oldVdom.type !== newVdom.type) {
        return false
    }
    if (Object.keys(oldVdom.props).length !== Object.keys(newVdom.props).length) {
        return false
    }
    if (
        (Array.isArray(oldVdom.props.children) && Array.isArray(newVdom.props.children))
        &&
        (oldVdom.props.children.length !== newVdom.props.children.length)
    ) {
        return false
    }
    for (let name in oldVdom.props) {
        if (name === 'children') {
            continue
        }
        if (newVdom.props[name] !== oldVdom.props[name]) {
            return false
        }
    }
    if (newVdom.$type === '#text' && newVdom.content !== oldVdom.content) {
        return false
    }
    return true
}
