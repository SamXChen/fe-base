function customBind(target, ...args) {

    if(target === undefined || target === null) {
        throw new Error('the first parameter can not be undefined or null');
    }

    const fn = this;

    return function(...args2) {
        return fn.call(target, ...args, ...args2);
    }
}

function wrap() {
    Function.prototype.customBind = customBind;
}

module.exports = {
    wrap,
};