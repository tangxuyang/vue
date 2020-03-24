/**
 * 这是core的入口文件
 * 各个移植(web和weex)都是引用的这个文件，并在这个文件导出的Vue上做了修改的
 */

import Vue from './instance/index' // 真正的Vue构造就在这个文件中，百闻不如见面
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue) // 这个名字起得，真不知道是干啥的，我猜测是直接在Vue上绑定一些函数，而不是在Vue.prototype上绑定

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__' // 构建的时候会使用rollup-plugin-replace插件替换掉__VERSION__的

export default Vue
