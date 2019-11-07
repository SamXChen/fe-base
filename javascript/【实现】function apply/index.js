function customApply(target, args) {
    const fn = this;
    const tmpFnName = '__custom_apply_fn_name__';

    if(target === undefined || target === null) {
        try {
            target = window;
        } catch(err) {
            return fn(...args);
        }
    }

    // search object proto
    // number 等类型无法直接添加属性（函数）上去
    let proto = target;
    while(typeof proto !== 'object') {
        proto = proto.__proto__;
    }

    proto[tmpFnName] = fn;

    try {
        const result = target[tmpFnName](...args);
        delete proto[tmpFnName];
        return result;
    } catch(err) {
        delete proto[tmpFnName];
        throw err;
    }
}

function wrap() {
    Function.prototype.customApply = Function.prototype.customApply || customApply;
}

module.exports = {
    wrap,
};