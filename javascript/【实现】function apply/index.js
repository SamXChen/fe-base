function customApply(target, args) {
    const fn = this;
    const tmpFnName = '__custom_apply_fn_name__';

    if(target === undefined || target === null) {
        return fn(...args);
    }
    target.__proto__[tmpFnName] = fn;
    const result = target[tmpFnName](...args);

    delete target.__proto__[tmpFnName];

    return result;
}

function wrap() {
    Function.prototype.customApply = customApply;
}

module.exports = {
    wrap,
};