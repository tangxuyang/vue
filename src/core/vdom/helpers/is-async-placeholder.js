/* @flow */
/**
 * 是否是异步组件的占位符
 * @param {*} node
 */
export function isAsyncPlaceholder (node: VNode): boolean {
  return node.isComment && node.asyncFactory
}
