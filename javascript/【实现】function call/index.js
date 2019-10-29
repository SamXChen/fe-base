function customCall(target, ...args) {
    const fn = this;
    const tmpFnName = '__custom_call_fn__name__';

    if(target === undefined || target === null) {
        try {
            target = window;
        } catch(err) {
            return fn(...args);
        }
    }

    // search object proto
    let proto = target;
    while(typeof proto !== 'object') {
        proto = proto.__proto__;
    }
    
    proto[tmpFnName] = fn;
    const result = target[tmpFnName](...args);
    delete proto[tmpFnName];

    return result;
}


function wrap() {
    Function.prototype.customCall = Function.prototype.customCall || customCall;
}

module.exports = {
    wrap,
};