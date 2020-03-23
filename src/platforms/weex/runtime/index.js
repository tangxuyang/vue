/* @flow */

/**
 * 这个文件的结构跟platforms/web/runtime/index.js是一样的
 * 都是个自己对应的平台提供支持，都是基于core/index中的Vue
 * Vue的core是跟平台无关的，这样做，跨平台容易做
 * 
 * 通过这个两个文件的对比，可以很容易的知道要做一个新的平台来支持Vue
 * 只需要这两个文件中提到的这些东西就行了，其中我觉得最重要的就是
 * __patch__和$mount，这两个从名字上就能知道是平台相关的，需要实际的跟平台上的元素打交道了
 * web的是dom，weex的是啥我还不知道
 */

import Vue from 'core/index'
import { patch } from 'weex/runtime/patch'
import { mountComponent } from 'core/instance/lifecycle'
import platformDirectives from 'weex/runtime/directives/index'
import platformComponents from 'weex/runtime/components/index'

// 跟platforms/web/runtime/index.js比少了getTagNamespace
// 这说明根本不支持math和svg呗
// 还缺少isReservedAttr
// 多了isRuntimeComponent
import {
  query,
  mustUseProp,
  isReservedTag,
  isRuntimeComponent,
  isUnknownElement
} from 'weex/util/element'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isRuntimeComponent = isRuntimeComponent
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives and components
Vue.options.directives = platformDirectives
Vue.options.components = platformComponents

// install platform patch function
Vue.prototype.__patch__ = patch

// wrap mount
Vue.prototype.$mount = function (
  el?: any,
  hydrating?: boolean
): Component {
  return mountComponent(
    this,
    el && query(el, this.$document),
    hydrating
  )
}

export default Vue
