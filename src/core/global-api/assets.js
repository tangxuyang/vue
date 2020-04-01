/* @flow */
// 资源数组filter component directive
import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

/**
 * 给Vue添加注册全局资源的函数Vue.component Vue.filter Vue.directive
 * @param {*} Vue
 */
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 只有一个参数，get
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        // 非生产环境下，验证一下组件名的有效性
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 组件的注册最复杂了
        // 需要把传进来的组件options即definition转换成组件类，这个组件类都是
        // 继承Vue的，具体过程在extend方法中。这个_base就是Vue自己
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        // 指令标准化，保证最后存在directives中的都是对象格式
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // set
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
