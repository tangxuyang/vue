/* @flow */

/**
 * 看到platform/web/runtine/index.js，让我想到了Vue的大致封装思路
 * core是平台无关的，封装虚拟DOM相关的内容。真正平台相关的就放到了platform中
 * 想在哪个平台运行，就开发哪个平台的移植就行了，只要能满足预先定义好的接口就行
 * 
 * 这个思路让我想到了webkit的架构，它本身也是不涉及到具体的绘图逻辑，而是使用移植
 * 提供给它的接口，真是妙！！！
 * 
 * 思路的开阔让我对Vue源码更感兴趣了:)
 */

import Vue from 'core/index' // 这就是平台无关的Vue
import config from 'core/config'
// 导入extend和noop函数，前者是简单的把对象b的属性拷贝到a上；后者是一个空函数
import { extend, noop } from 'shared/util'
// 
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

// 导入几个函数
import {
  query, // 查询dom，接收string或Element，底层使用document.querySelector
  mustUseProp,
  isReservedTag, // 判断是否是保留的标签
  isReservedAttr, // 判断是否是保留的属性
  getTagNamespace, // 获取标签的命名空间，只有svg和math两个
  isUnknownElement // 判断标签是否是未知元素
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components
// 把平台相关的指令和组件合并到Vue.options中
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue
