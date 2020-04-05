/* @flow */

import config from '../config'
import { warn } from './debug'
import { inBrowser, inWeex } from './env'
import { isPromise } from 'shared/util'

/**
 * 处理错误
 * 沿着组件树往上，只要是有errorCaptured这个hook的都执行
 * 如果执行的结果是true，则停止，否则继续往上执行
 * @param {*} err 
 * @param {*} vm 
 * @param {*} info 
 */
export function handleError (err: Error, vm: any, info: string) {
  if (vm) {
    let cur = vm
    while ((cur = cur.$parent)) {
      const hooks = cur.$options.errorCaptured
      if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
          try {
            const capture = hooks[i].call(cur, err, vm, info) === false
            if (capture) return
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook')
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info)
}

/**
 * 带有错误处理的调用
 * @param {*} handler 被调用的函数
 * @param {*} context  执行上下文
 * @param {*} args 调用函数的参数
 * @param {*} vm 
 * @param {*} info 
 */
export function invokeWithErrorHandling (
  handler: Function,
  context: any,
  args: null | any[],
  vm: any,
  info: string
) {
  let res
  try {
    res = args ? handler.apply(context, args) : handler.call(context)
    if (isPromise(res)) {
      res.catch(e => handleError(e, vm, info + ` (Promise/async)`))
    }
  } catch (e) {
    handleError(e, vm, info)
  }
  return res
}

/**
 * 全局处理错误的方法
 * 调用Vue.config配置中的errorHandler方法
 * @param {*} err 
 * @param {*} vm 
 * @param {*} info 
 */
function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler')
    }
  }
  logError(err, vm, info)
}

/**
 * 记录错误
 * @param {*} err 
 * @param {*} vm 
 * @param {*} info 
 */
function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(`Error in ${info}: "${err.toString()}"`, vm)
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err)
  } else {
    throw err
  }
}
