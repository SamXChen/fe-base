function customBind(target, ...args) {

    if(target === undefined || target === null) {
        throw new Error('first parameter can not be undefined or null');
    }
    const fn = this;
    
    let fnIdx = 0;
    let fnName = `__custom_bind_fn_name__${fnIdx}`;
    while(target.__proto__[fnName] !== undefined) {
        fnIdx++;
        fnName = `__custom_bind_fn_name__${fnIdx}`;   
    }

    target.__proto__[fnName] = fn;

    return function(...args2) {
        return target[fnName](...args, ...args2);
    }
}

function wrap() {
    Function.prototype.customBind = customBind;
}

module.exports = {
    wrap,
};