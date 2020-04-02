/* @flow */
/**
 * 对作用域插槽进行标准化
 * @param {Object} slots 每个属性是一个插槽，一个插槽是一个函数
 * @param {*} normalSlots
 */
export function normalizeScopedSlots (
  slots: { [key: string]: Function } | void,
  normalSlots: { [key: string]: Array<VNode> }
): any {
  let res
  if (!slots) {
    res = {}
  } else if (slots._normalized) {
    // 标准化过了，就返回了
    return slots
  } else {
    res = {}
    for (const key in slots) {
      if (slots[key]) {
        res[key] = normalizeScopedSlot(slots[key])
      }
    }
  }
  // expose normal slots on scopedSlots
  for (const key in normalSlots) {
    if (!(key in res)) {
      res[key] = proxyNormalSlot(normalSlots, key)
    }
  }
  res._normalized = true
  return res
}

// 标准化一个作用域插槽
// 传进来表示作用域插槽的函数，返回一个包装的函数
// 这个包装的函数会调用传进来的函数，然后对返回值进行处理，保证返回的是数组或null
function normalizeScopedSlot(fn: Function) {
  return scope => {
    const res = fn(scope)
    return Array.isArray(res) ? res : res ? [res] : res
  }
}

function proxyNormalSlot(slots, key) {
  return () => slots[key]
}
