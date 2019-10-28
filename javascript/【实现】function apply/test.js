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

toConsoleArray.customApply(undefined, testArr);

toConsoleArray.customApply(null, testArr);

toConsoleArray.customApply(null, testArr, 1, 2, 3);

toConsoleArray.customApply(objA, testArr);

toConsoleArray.customApply(objB, testArr);

toConsoleArray.customApply(0, testArr);

toConsoleArray.customApply(NaN, testArr);

toConsoleArray.customApply('123', testArr);

toConsoleArray.customApply(true, testArr);

toConsoleArray.customApply(() => {}, testArr);


