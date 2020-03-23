/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * Query an element selector if it's not an element already.
 * 最后还是调用document.querySelector来查询的
 */
export function query (el: string | Element): Element {
  // 接收String或Element
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      // 找不到就创建一个div
      return document.createElement('div')
    }
    return selected
  } else { // 是Element，直接返回
    return el
  }
}
