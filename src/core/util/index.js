/* @flow */

export * from 'shared/util'
export * from './lang' // 我不是很明白这个文件的名字为什么是lang，难道是language?那又是啥意思呢？
export * from './env' // 运行环境相关的内容。既然把core和平台分离出来了，是不是不应该把环境相关的内容放在core里呢？当然了既然放在这里已经有它的理由。
export * from './options' // 组件选项的合并逻辑和策略都在这里
export * from './debug' // 看名字也能猜出个大概
export * from './props' //
export * from './error'
export * from './next-tick' // 代码不难，思路很难，你不知道他为什么这么写
export { defineReactive } from '../observer/index'
