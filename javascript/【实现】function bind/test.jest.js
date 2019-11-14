const { wrap } = require('./index')

function init() {
    wrap()
    console.log = jest.fn()
}

init()

describe('bind function test suites', async () => {

    async function delayTask() {
        return new Promise(resolve => {
            setTimeout(() => { resolve() }, 500)
        })
    }
    
    async function task1(...args) {
    
        if(this && this.name) {
            console.log('task owner: ', this.name)
        }
    
        await delayTask()
    
        console.log(...args)
    }
    
    const objA = {
        name: 'objA'
    }
    
    const bindedTask1 = task1.customBind(objA, 1, 2, 3)
    const bindedTask2 = task1.customBind(objA, 10, 20, 30)
    
    
    const bindedTask3 = function() {
        const syncFn = function() {
            console.log('run sync fn')
        }
    
        const syncFnA = syncFn.customBind(null)
    
        const objA = new syncFnA()
        
        console.log(objA instanceof syncFn)
    }

    test('should log "objA" and 1, 2, 3, 4', async () => {
        await bindedTask1(4)
        expect(console.log).toHaveBeenCalledWith('task owner: ', 'objA')
        expect(console.log).toHaveBeenCalledWith(1, 2, 3, 4)
    })


    test('should log "objA" and 10, 20, 30, 40', async () => {
        await bindedTask2(40)
        expect(console.log).toHaveBeenCalledWith('task owner: ', 'objA')
        expect(console.log).toHaveBeenCalledWith(10, 20, 30, 40)
    })

    test('should correctly judge binded consturctor', async () => {
        bindedTask3()
        expect(console.log).toHaveBeenCalledWith('run sync fn')
        expect(console.log).toHaveBeenCalledWith(true)
    })
})

