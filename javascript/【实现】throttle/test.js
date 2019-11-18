const throttle = require('./index')

const total = 1000

function consoleFunction(num) {
    console.log(num)
}

async function frequentlyCalledFunction() {

    const throttledFn = throttle(consoleFunction, total / 20)

    const delay = 1
    for(let idx = 0; idx < total; idx++) {
        setTimeout(() => {
            throttledFn(idx)
        }, delay)
    }
    
    await new Promise(resolve => {
        setTimeout(resolve, total * delay * 2)
    })
}

async function test() {
    await frequentlyCalledFunction()

}

test()