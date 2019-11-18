const throttle = require('./index')

describe('throttle function test suites', () => {

    function consoleFunction(num) {
        console.log(num)
    }

    beforeEach(() => {
        console.log = jest.fn()
    })

    test('1s throttled function, should log number less then 999 times', async () => {

        const total = 1000

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

        await frequentlyCalledFunction()

        expect(console.log.mock.calls.length).toBeGreaterThan(0)
        expect(console.log.mock.calls.length).toBeLessThan(total / 20)
    })
})