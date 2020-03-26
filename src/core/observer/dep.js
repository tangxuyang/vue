/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * Dep大概是dependency的简写吧，依赖的意思
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // 添加订阅
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 移除订阅
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  //
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 通知订阅这个dep的所有Watcher更新
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

/**
 * 把target放到栈顶，并且作为当前Dep.target
 * @param {*} target
 */
export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

/**
 * 出栈
 * 把栈顶的元素作为Dep.target
 */
export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
