const toString = Object.prototype.toString
const toType = value => {
    // 兼容 IE8
    return value === null ? 'Null' : toString.call(value).slice(8, -1)
}

const extend = function(target, defaults) {
    let object
    const type = toType(target)

    if (type === 'Object') {
        object = Object.create(defaults || {})
    } else if (type === 'Array') {
        object = [].concat(defaults || [])
    }

    if (object) {
        for (let index in target) {
            if (Object.hasOwnProperty.call(target, index)) {
                // 递归扩展，实现 对象、数组 的继承目的
                object[index] = extend(target[index], object[index])
            }
        }
        return object
    } else {
        return target
    }
}

module.exports = extend