const { wrap } = require('./index'); 

wrap();

function toConsoleArray(...args) {
    if(this && this.name) {
        console.log('name: ', this.name);
    }
    console.log(...args);
}


const objA = {
    name: 'objA'
};

const objB = {
    name: 'objB'
};

const testArr = [1, 2, 3];

toConsoleArray.customCall(undefined, ...testArr);

toConsoleArray.customCall(null, ...testArr);

toConsoleArray.customCall(null, testArr, 1, 2, 3);

toConsoleArray.customCall(objA, ...testArr);

toConsoleArray.customCall(objB, ...testArr);

toConsoleArray.customCall(0, ...testArr);

toConsoleArray.customCall(NaN, ...testArr);

toConsoleArray.customCall('123', ...testArr);

toConsoleArray.customCall(true, ...testArr);

toConsoleArray.customCall(() => {}, ...testArr);
