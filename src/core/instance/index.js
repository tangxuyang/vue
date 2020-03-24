import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue构造器
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 创建Vue（包括子组件）实例时调用_init方法
  this._init(options)
}

// 这个起名，都是用mixin结尾
initMixin(Vue) // 给Vue.prototype添加_init方法,Vue._init
stateMixin(Vue) // 给Vue.prototype添加了$props $data $set $del $watch
eventsMixin(Vue) // 给Vue.prototype添加$on $off $once $emit，支持事件机制
lifecycleMixin(Vue) // 给Vue.prototype添加 _update $destroy $forceUpdate
renderMixin(Vue) // 给Vue.prototype添加$nextTick, _render 还有一些运行时的帮助方法

export default Vue


/**
 * Vue万物始祖
 * 这个文件定义了Vue的构造函数，给Vue的原型上添加了好多成员
 * 我列举一下吧，全不全的先不说
 * - _init 下划线开头的我们理解成是私有成员函数，这是调用new Vue时Vue内部调用的函数，用来初始化Vue实例的
 * - $data 这是一个访问器，其实它最后读取的是Vue实例上的_data
 * - $props 这也是一个访问器，最后读取的是Vue实例上的_props
 * - $set
 * - $delete
 * - $watch
 * - $on
 * - $off
 * - $once
 * - $emit
 * - _update
 * - $forceUpdate
 * - $destroy
 * - $nextTick
 * - _render
 */
