/**
 * 为什么这里要引入一个没有被使用的 createElement 方法，
 * 因为 babel 的 jsx 插件中，设置了 jsx 解析后的输出入口，方法名是 createElement
 * 当 babel 将文本内容翻译后，createElement 这个方法的引用就有着落了
 * 接着，createElement 的模块引用，就会被 webpack 接管处理
 */
import { createElement, Component, render } from './src'

class MyComponent extends Component {

    constructor() {
        super()
        this.state = {
            a: 1,
            b: 2,
        }
    }

    add = () => {
        this.state.a++
        this.rerender()
    }

    render() {
        return (
            <div>
                <div>text</div>
                <div>{ this.state.a.toString() }</div>
                { this.children }
                <button onClick={ this.add }>add</button>
            </div>
        )
    }
}

render(
    <div id='a' class='c'>
        <MyComponent>
            <div>
                component children
                <div>text</div>
                {
                    ['123', '456'].map(val => {
                        return (<div>{val}</div>)
                    })
                }
            </div>
        </MyComponent>
        <span>abc</span>
    </div>
, document.body)