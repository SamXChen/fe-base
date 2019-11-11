const myPromise = require('./index')
const promisesTests = require('promises-aplus-tests')

promisesTests(myPromise, function(err) {
    if(err) {
        throw err
    }
})