/**
 * 简单的 EventEmitter，用于扩展组件
 */
export class EventEmitter {

    constructor() {
        this.events = Object.create(null);
    }

    removeAllListeners() {
        this.events = Object.create(null);
    }

    on(name, fn) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(fn);
        return this;
    }

    emit(name, ...args) {
        if (!this.events[name]) {
            return this;
        }
        // 这里的 slice 尤为重要
        // 对数组进行一次浅复制
        // 因为：无法保证 fn 的内容，也就无法保证 fn 执行时，会不会对 events[name] 进行修改 
        this.events[name].slice().forEach(fn => {
            fn.apply(this, args);
        });
        return this;
    }

    off(name, fn) {
        if (!this.events[name]) {
            return this;
        }
        const index = this.events[name].indexOf(fn);
        if (index >= 0) {
            this.events[name].splice(index, 1);
        }
        return this;
    }
}
