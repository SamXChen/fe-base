const { wrap } = require('./index');

wrap();

async function delayTask() {
    return new Promise(resolve => {
        setTimeout(() => { resolve() }, 500);
    });
}

async function task1(...args) {

    if(this && this.name) {
        console.log('task ower: ', this.name);
    }

    await delayTask();

    console.log(...args);
}

const objA = {
    name: 'objA'
};

const bindedTask1 = task1.customBind(objA, 1, 2, 3);
const bindedTask2 = task1.customBind(objA, 10, 20, 30);


const bindedTask3 = function() {
    const syncFn = function() {
        console.log('run sync fn');
    }

    const syncFnA = syncFn.customBind(null);

    const objA = new syncFnA();
    
    console.log(objA instanceof syncFn);
}



async function test() {
    await bindedTask1(4);
    await bindedTask2(40);
    await bindedTask1(4);

    bindedTask3();
}

test();