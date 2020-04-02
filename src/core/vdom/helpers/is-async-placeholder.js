/* @flow */
/**
 * 是否是异步组件的占位符
 * @param {*} node
 */
export function isAsyncPlaceholder (node: VNode): boolean {
  // 所以异步组件首先是一个注释，并且具有异步工厂函数
  return node.isComment && node.asyncFactory
}
