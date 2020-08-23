import { createElement, Component, render } from './src'

class MyComponent extends Component {
    render() {
        return (
            <div>
                <div>text</div>
                { this.children }
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