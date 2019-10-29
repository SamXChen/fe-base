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

async function test() {
    await bindedTask1(4);
    await bindedTask2(40);
    await bindedTask1(4);
}

test();