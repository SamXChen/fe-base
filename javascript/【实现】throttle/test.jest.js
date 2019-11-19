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

            const promises = []
            for(let idx = 0; idx < total; idx++) {
                promises.push(new Promise(resolve => {
                    setTimeout(() => {
                        throttledFn(idx)
                        resolve()
                    }, delay + idx)
                }))
            }
            
            await Promise.all(promises)
        }

        await frequentlyCalledFunction()
        
        expect(console.log.mock.calls.length).toBeGreaterThan(0)
        expect(console.log.mock.calls.length).toBeLessThan(total / 20)
    })

    test('1s throttled function, should log number only once', async () => {

        const total = 1000

        async function frequentlyCalledFunction() {

            const throttledFn = throttle(consoleFunction, total / 20, true)

            const delay = 1

            const promises = []
            for(let idx = 0; idx < total; idx++) {
                promises.push(new Promise(resolve => {
                    setTimeout(() => {
                        throttledFn(idx)
                        resolve()
                    }, delay)
                }))
            }
            
            await Promise.all(promises)
        }

        await frequentlyCalledFunction()

        expect(console.log.mock.calls.length).toBe(1)
    })
})