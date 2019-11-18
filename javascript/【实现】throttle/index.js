function throttle(fn, delay, trailing = false) {
    let prevTS = Date.now()
    let firstRun = true
    return function(...args) {
        const currentTS = Date.now()
        let toRun = false
        if(trailing === true && firstRun === true) {
            firstRun = false
            toRun = true
        }
        if(currentTS - prevTS >= delay) {
            toRun = true
        }
        if(toRun === true) {
            fn(...args)
            prevTS = currentTS
        }
    }
}

module.exports = throttle