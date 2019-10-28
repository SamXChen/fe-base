function customCall(target, ...args) {
    const tmpFnName = '__custom_call_fn__';
    const fn = this;

    if(target === undefined || target === null) {
        return fn(...args);
    }
    
    target.__proto__[tmpFnName] = fn;
    const result = target[tmpFnName](...args);
    delete target.__proto__[tmpFnName];

    return result;
}


function wrap() {
    Function.prototype.customCall = customCall;
}

module.exports = {
    wrap,
};