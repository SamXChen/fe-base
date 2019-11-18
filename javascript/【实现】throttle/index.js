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
        const duration = currentTS - prevTS

        // 这里卡壳了，如果注释掉下面的 console.info，将不能通过单元测试
        // 否则，可以通过单元测试
        console.info(duration)

        if(duration >= delay) {
            toRun = true
        }
        if(toRun === true) {
            prevTS = currentTS
            fn(...args)
        }
    }
}

module.exports = throttle