const runtime = require('./runtime')
const extend = require('./adapter/extend')
const include = require('./adapter/include')
const onerror = require('./adapter/onerror')
const caches = require('./adapter/caches')
const loader = require('./adapter/loader')
const artRule = require('./adapter/rule.art')
const nativeRule = require('./adapter/rule.native')
const htmlMinifier = require('./adapter/html-minifier')
const resolveFilename = require('./adapter/resolve-filename')

const detectNode = typeof window === 'undefined'

const settings = {

    source: null,

    filename: null,

    // 模板语法规则列表
    rules: [nativeRule, artRule],

    // 是否开启渲染时 escape
    // 开启可以防止 xss 攻击
    escape: true,

    debug: detectNode ? process.env.NODE_ENV !== 'production' : false,

    // 如果为 true，编译错误与运行错误时会抛出异常
    bail: true,

    cache: true,

    minimize: true,

    compileDebug: false,

    // 模板路径转换器
    resolveFilename: resolveFilename,

    // 子模板编译适配器
    include: include,

    htmlMinifier: htmlMinifier,

    htmlMinifierOptions: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        ignoreCustomFragments: []
    },

    onerror: onerror,

    // 模板文件加载器
    loader: loader,

    caches: caches,

    // 模板根目录
    root: '/',

    // 默认后缀名
    extname: '.art',

    ignore: [],

    // 导入的模板变量
    imports: runtime
}

function Defaults() {
    this.$extend = function(options) {
        options = options || {}
        return extend(options, options instanceof Defaults ? options : this)
    }
}
Defaults.prototype = settings

module.exports = new Defaults()