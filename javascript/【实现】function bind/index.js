function customBind(target, ...args) {

    if(target === undefined || target === null) {
        target = {}
    }

    if(typeof this !== 'function') {
        throw new Error('must be a function');
    }

    const fn = this;

    // 这个闭包内的函数很重要，用于区分被 bind 的函数是否被 new 调用
    const nop = function() {}
    
    const resFn = function(...args2) {
        // 从这里开始 this 指的是该函数运行时的 this，和外面没有关联
        // this instanceof nop 成立时，表明 resFn 被 new 调用
        // 被 new 调用时，把当前函数当成 constructor 运行，this 还是 this
        // 被直接调用时，由于 nop 在闭包中，外部的 this 不可能是 nop 的对象
        // 所以还是使用输入的 target 进行调用
        const finalTarget = this instanceof nop ? this : target;
        return fn.call(finalTarget, ...args, ...args2);
    }

    if (this.prototype) {
        nop.prototype = this.prototype;
    }
    // 原型链继承
    resFn.prototype = new nop();

    return resFn;
}

function wrap() {
    Function.prototype.customBind = customBind;
}

module.exports = {
    wrap,
};