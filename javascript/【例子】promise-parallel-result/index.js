// 查看 promise 的具体实现后，按照实现标准，可以推理获得以下例子

const p1 = new Promise(resolve => {
    setTimeout(() => {
        resolve(1)
    })
})


const p2 = new Promise(resolve => {
    setTimeout(() => {
        resolve(2)
    })
})

p1.then(res => {
    console.log('print 1st, supposed 1: ', res)
    return p2
}).then(res => {
    // 这里相当于是新 promise 的 then 区域
    // 新 promise 和 p2 又不是同一个对象
    console.log('print 3rd, supposed 2: ', res)
})

// 这里的结果不受 上面的 p2 影响
p1.then(res => { 
    console.log('print 2nd, supposed 1: ', res)
})