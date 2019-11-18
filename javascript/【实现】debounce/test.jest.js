const debounce = require('./index')

describe('debounce function test suites', () => {

    function consoleFunction(num) {
        console.log(num)
    }

    beforeEach(() => {
        console.log = jest.fn()
    })

    test('1s delay debounced function, should log 999 once', async () => {
        
        const total = 1000
        
        async function frequentlyCalledFunction() {

            const debouncedFn = debounce(consoleFunction, total)

            const delay = 1
            for(let idx = 0; idx < total; idx++) {
                setTimeout(() => {
                    debouncedFn(idx)
                }, delay)
            }
            
            await new Promise(resolve => {
                setTimeout(resolve, total * delay * 2)
            })
        }

        await frequentlyCalledFunction()

        expect(console.log).toHaveBeenCalledTimes(1)
        expect(console.log).toHaveBeenCalledWith(total - 1)
    })
})