function resolvePromise(promise2, x, resolve, reject) {
    let then
    let thenCalledOrThrow = false

    if(promise2 === x) {
        reject(new TypeError('Chaining cycle detected for promise!'))
        return
    }

    if(x instanceof myPromise) {
        if(x.status === 'pending') {
            x.then(value => {
                resolvePromise(promise2, value, resolve, reject)
            }, err => {
                reject(err)
            }) 
        } else {
            x.then(resolve, reject)
        }
        return
    }

    if((x !== null) && ((typeof x === 'function') || (typeof x === 'object'))) {
        try {
            then = x.then
            if(typeof then === 'function') {
                then.call(x, value => {
                    if(thenCalledOrThrow) return
                    thenCalledOrThrow = true 
                    resolvePromise(promise2, value, resolve, reject)
                    return
                }, err => {
                    if(thenCalledOrThrow) return
                    thenCalledOrThrow = true
                    reject(err)
                    return
                })
            } else {
                resolve(x)
            }
        } catch(e) {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            reject(e)
            return
        }
    } else {
        resolve(x)
    }
}


function myPromise(exec) {

    const vm = this

    // Promise 当前的状态
    this.status = 'pending'
    // Promise 值
    this.data = undefined

    // resolve 回调函数集
    this.onResolvedCallback = []
    // reject 回调函数集
    this.onRejectedCallback = []

    function resolve(val) {

        if(val instanceof myPromise) {
            val.then(resolve, reject)
            return
        }

        setTimeout(function() {
            if(vm.status === 'pending') {
                vm.status = 'fulfilled'
                vm.data = val
                // 回调 callback 链
                vm.onResolvedCallback.forEach(cb => cb(val))
            }
        })
    }

    function reject(reason) {
        
        setTimeout(function() {
            if(vm.status === 'pending') {
                vm.status = 'rejected'
                vm.data = reason
                // 回调 callback 链
                vm.onRejectedCallback.forEach(cb => cb(reason))
            }
        })
    }

    try {
        exec(resolve, reject)
    } catch(e) {
        reject(e)
    }
}

myPromise.prototype.then = function(onResolve, onReject) {

    const vm = this

    let newPromise

    onResolve = typeof onResolve === 'function' ? onResolve: function(val) { return val }
    onReject = typeof onReject === 'function' ? onReject: function(reason) { throw reason } 

    const data = vm.data

    switch(vm.status) {
        case 'pending':
            newPromise = new myPromise((resolve, reject) => {
                vm.onResolvedCallback.push(function(val) {
                    try {
                        const res = onResolve(val)
                        resolvePromise(newPromise, res, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })

                vm.onRejectedCallback.push(function(reason) {
                    try {
                        const res = onReject(reason)
                        resolvePromise(newPromise, res, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            })
            break
        case 'fulfilled':
            newPromise = new myPromise((resolve, reject) => {
                setTimeout(function() {
                    try {
                        const res = onResolve(data)
                        resolvePromise(newPromise, res, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            })
            break
        case 'rejected':
            newPromise = new myPromise((resolve, reject) => {
                setTimeout(function() {
                    try {
                        const res = onReject(data)
                        resolvePromise(newPromise, res, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            })
            break
        default:
            break
    }

    return newPromise
}

myPromise.prototype.catch = function(onReject) {
    return this.then(null, onReject)
}

myPromise.resolve = function(val) {
    return new myPromise(function(resolve){ resolve(value) })
}

myPromise.reject = function(reason) {
    return new myPromise(function(resolve, reject){ reject(reason) })
}

myPromise.all = function(promises) {
    return new myPromise((resolve, reject) => {
        let values = []
        let count = 0
        promises.forEach((promise, index) => {
            promise.then(val => {
                values[index] = value
                count++
                if(count === promises.length) {
                    resolve(values)
                }
            }, reject)
        })
    })
}

myPromise.race = function(promises) {
    return new myPromise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then(resolve, reject)
        })
    })
}

myPromise.deferred = myPromise.defer = function() {
    const defer = {}
    defer.promise = new myPromise((resolve, reject) => {
        defer.resolve = resolve
        defer.reject = reject
    })
    return defer
}

try {
    module.exports = myPromise
} catch(e) {
    // do nothing
}