function debounce(fn, wait) {
    let timeout
    return function(...args) {
        if(timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            fn(...args)
        }, wait)
    }
}

module.exports = debounce