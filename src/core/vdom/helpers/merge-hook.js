/* @flow */

import VNode from '../vnode'
import { createFnInvoker } from './update-listeners'
import { remove, isDef, isUndef, isTrue } from 'shared/util'

// 合并虚拟节点的钩子
// 把新的hook跟老的hook合并
export function mergeVNodeHook (def: Object, hookKey: string, hook: Function) {
  // 如果是虚拟节点，从虚拟节点中抽出hook对象
  // 保证下面操作中def是hook对象
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {})
  }
  let invoker
  // 取出老的hook
  const oldHook = def[hookKey]

  // 包装hook函数
  // 到达调用了hook之后把它从invoker.fns中删除
  function wrappedHook () {
    hook.apply(this, arguments)
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook)
  }

  // 没有老的hook
  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook])
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook
      invoker.fns.push(wrappedHook)
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook])
    }
  }

  invoker.merged = true
  def[hookKey] = invoker
}
