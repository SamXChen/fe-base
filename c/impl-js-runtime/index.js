// 注意，这里不是 uv.so，所以不是动态加载的
import { setTimeout } from 'uv'

console.log('start')

setTimeout(() => console.log(`B`), 0)
Promise.resolve().then(() => console.log(`A`))

setTimeout(() => {
    setTimeout(() => console.log(`D`), 0)
    Promise.resolve().then(() => console.log(`C`))
}, 1000)

