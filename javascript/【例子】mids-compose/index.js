const compose = window.__compose__

async function domCtrl(ctx = {}, next) {

    const dom = document.createElement('div')
    const mainPanel = document.querySelector('#main-panel')

    ctx.dom = dom
    mainPanel.appendChild(dom)

    await next()

    mainPanel.removeChild(dom)
    delete ctx.dom    
}

function delay(delayTS) {
    return async function(ctx, next) {
        await new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, delayTS)
        })
        await next()

        await new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, delayTS)
        })
    }
}

async function animationCtrl(ctx = {}, next) {
    const { dom } = ctx

    if(dom === undefined) {
        return next()
    }

    const rawClass = dom.className || ''

    dom.className = `${rawClass} custom-animation`

    // 往洋葱模型深处走
    await next()

    // 暂停动画
    dom.className = `${dom.className} animation-paused`
}

async function detectDom(ctx = {}, next) {

    const { dom } = ctx

    function realDetect(resolve) {

        const rect = dom.getBoundingClientRect()

        if (rect.left > 600 & rect.top > 600) {
            resolve()
        } else {
            setTimeout(() => {
                realDetect(resolve)
            }, 300)
        }
    }

    await new Promise(resolve => {
        realDetect(resolve)
    })

    await next()
}



async function start() {

    const startAmination = compose([
        domCtrl,
        delay(1000),
        animationCtrl,
        detectDom,
    ])

    const ctx = {}
    await startAmination(ctx)
}

start()