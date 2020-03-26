/* @flow */

import { warn, extend, isPlainObject } from 'core/util/index'

/**
 * 跟它的名字一样
 * 绑定对象事件监听器v-on="object"
 * @param {*} data
 * @param {*} value
 *
 * 所以说VNodeData有一个on字段咯，on是一个对象，是一个键值对，每个代表一个类型的事件监听器
 */
export function bindObjectListeners (data: any, value: any): VNodeData {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      )
    } else {
      const on = data.on = data.on ? extend({}, data.on) : {}
      for (const key in value) {
        const existing = on[key]
        const ours = value[key]
        on[key] = existing ? [].concat(existing, ours) : ours
      }
    }
  }
  return data
}
