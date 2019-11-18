const { wrap } = require('./index')

beforeEach(() => {
    wrap()

    console.log = jest.fn()
})

describe('apply function test suites', () => {

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

    test('applied by undefined', () => {
        toConsoleArray.customApply(undefined, testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by null', () => {
        toConsoleArray.customApply(null, testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by null with extra args', () => {
        toConsoleArray.customApply(null, testArr, 1, 2, 3)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by "objA"', () => {
        toConsoleArray.customApply(objA, testArr)
        expect(console.log).toHaveBeenCalledWith("name: ", objA.name)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by "objB"', () => {
        toConsoleArray.customApply(objB, testArr)
        expect(console.log).toHaveBeenCalledWith("name: ", objB.name)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by number', () => {
        toConsoleArray.customApply(0, testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by NaN', () => {
        toConsoleArray.customApply(NaN, testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by string', () => {
        toConsoleArray.customApply('123', testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by boolean', () => {
        toConsoleArray.customApply(true, testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
    
    test('applied by arrow fn', () => {
        toConsoleArray.customApply(() => {}, testArr)
        expect(console.log).toHaveBeenCalledWith(...testArr)
    })
})



