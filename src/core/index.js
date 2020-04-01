/**
 * 这是core的入口文件
 * 各个移植(web和weex)都是引用的这个文件，并在这个文件导出的Vue上做了修改的
 *
 * 这里我要说一下core不提供$mount方法，这个方法是各个移植自己实现的，但是core里面
 * Vue.prototype._init会调用这个方法
 */

import Vue from './instance/index' // 真正的Vue构造就在这个文件中，百闻不如见面
// globalAPI这个名字刚开始让人摸不到头脑，熟悉了之后就会知道这个是在Vue上添加方法
// 如果是标准的面向对象的编程语言，就可以理解成是类的静态方法
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue)

// 这个字段你哪里会用我暂时还不知道，猜测是服务器端渲染时用，这个只能看server目录的代码后
// 才能知道了
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

// 看名字也是服务器端渲染的
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
