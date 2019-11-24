const path = require('path')
const tplRender = require('../dist/join-str')

const fs = require('fs')
const TplPath = path.resolve(__dirname, './tpls/index.tpl')

describe('template engine test', () => {

    test('string join', () => {
        const data = {
            list: [
                { key: 1, val: 1 },
                { key: 2, val: 2 },
                { key: 3, val: 3 },
                { key: 4, val: 4 },
            ],
            str: '<div>template engine, html encoded test</div>',
            obj: {
                txt: '<div>innerHTML: obj txt</div>',
            }
        }

        const tpl = fs.readFileSync(TplPath).toString()
        const res = tplRender(tpl, data)

        const snapshot = fs.readFileSync(path.resolve(__dirname, './snapshots/htmls/test1.html')).toString()

        expect(res).not.toBe('')
        expect(res).toEqual(snapshot)
    })
    
})