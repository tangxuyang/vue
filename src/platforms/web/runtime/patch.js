/* @flow */

/**
 * 定义了平台相关的打补丁的方法
 * 要跟core中的内容衔接的，core/vdom/path提供了创建patch方法的函数
 * 允许平台相关的移植把依赖平台的功能注入进去
 */

import * as nodeOps from 'web/runtime/node-ops' // 名字就能看出来，节点操作的函数
import { createPatchFunction } from 'core/vdom/patch' // 创建patch函数的函数
import baseModules from 'core/vdom/modules/index' // 核心的模块
import platformModules from 'web/runtime/modules/index' // 平台支持的模块

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })


/**
 * 节点操作的函数有：
 * - createElement
 * - createElementNS
 * - createTextNode
 * - createComment
 * - insertBefore
 * - removeChild
 * - appendChild
 * - parentNode
 * - nextSilbing
 * - tagName
 * - setTextContent
 * - setStyleScope
 * 
 * 
 * weex平台的移植也提供了一套
 */