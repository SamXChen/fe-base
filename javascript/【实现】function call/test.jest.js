const { wrap } = require('./index')

beforeEach(() => {
    wrap()

    console.log = jest.fn()
})

describe('call function test suites', () => {

    function toConsoleArray(...args) {
        if(this && this.name) {
            console.log('name: ', this.name)
        }
        console.log(...args)
    }
    
    
    const objA = {
        name: 'objA'
    }
    
    const objB = {
        name: 'objB'
    }
    
    const testArr = [1, 2, 3]

    test('called by undefined', () => {
        toConsoleArray.customCall(undefined, ...testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by null', () => {
        toConsoleArray.customCall(null, ...testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by null with extra params', () => {
        toConsoleArray.customCall(null, ...testArr, 1, 2, 3)
        expect(console.log).toHaveBeenCalledWith(...testArr, 1, 2, 3)
    })

    test('called by objA with testArr', () => {
        toConsoleArray.customCall(objA, ...testArr)
        expect(console.log).toHaveBeenCalledWith('name: ', objA.name)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by objB with testArr', () => {
        toConsoleArray.customCall(objB, ...testArr)
        expect(console.log).toHaveBeenCalledWith('name: ', objB.name)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by Number', () => {
        toConsoleArray.customCall(0, ...testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by NaN', () => {
        toConsoleArray.customCall(NaN, ...testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by string', () => {
        toConsoleArray.customCall('123', ...testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by Boolean', () => {
        toConsoleArray.customCall(true, ...testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })

    test('called by a function', () => {
        toConsoleArray.customCall(() => {}, ...testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
})
