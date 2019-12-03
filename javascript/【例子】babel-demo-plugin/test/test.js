const fs = require('fs')
const path = require('path')
const { default: pluginTester } = require('babel-plugin-tester')

const plugin = require('../index')

const rawCodeStr = fs.readFileSync(path.resolve(__dirname, './test-code', 'action-types.js')).toString()
const exptectedCodeStr = fs.readFileSync(path.resolve(__dirname, './test-code', 'expected.js')).toString()
pluginTester({
    plugin,
    snapshot: false,
    pluginName: 'test plugin name',
    tests: {
        'change vals': {
            code : rawCodeStr,
            output: exptectedCodeStr,
        }
    }
})