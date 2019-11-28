const path = require('path')
const htmlDomParser = require('htmlparser')
const diff = require('deep-diff')

const tplRenderV1 = require('../dist/k1')
const tplRenderV2 = require('../dist/k2')

const fs = require('fs')
const TplPath = path.resolve(__dirname, './tpls/index.tpl')

const domHandler = new htmlDomParser.DefaultHandler()
const domParser = new htmlDomParser.Parser(domHandler)

describe('template engine test', () => {

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
    const snapshot = fs.readFileSync(path.resolve(__dirname, './snapshots/htmls/test1.html')).toString()

    domParser.parseComplete(snapshot)
    const snapshotDom = domHandler.dom[0]

    
    test('k1', () => {
        
        const res = tplRenderV1(tpl, data)
        expect(res).not.toBe('')

        domParser.parseComplete(res)
        const resDom = domHandler.dom[0]

        const difs = diff(resDom, snapshotDom)
        expect(difs).toBe(undefined)

        // 缓存检查
        expect(tplRenderV1.cache).not.toBe(undefined)
        expect(tplRenderV1.cache.size).toBe(1)

        const argKeys = []
        for(let key in data) {
            argKeys.push(key)
        }
        const fnKey = [...argKeys, 'htmlEncode', tpl].join('')
        expect(tplRenderV1.cache.get(fnKey)).not.toBe(undefined)
    })

    test('k2', () => {

        const res = tplRenderV2(tpl, data)

        expect(res).not.toBe('')

        domParser.parseComplete(res)
        const resDom = domHandler.dom[0]

        const difs = diff(resDom, snapshotDom)
        expect(difs).toBe(undefined)

        // 缓存检查
        expect(tplRenderV2.cache).not.toBe(undefined)
        expect(tplRenderV2.cache.size).toBe(1)

        const argKeys = []
        for(let key in data) {
            argKeys.push(key)
        }
        const fnKey = [...argKeys, 'htmlEncode', tpl].join('')
        expect(tplRenderV2.cache.get(fnKey)).not.toBe(undefined)
    })
})