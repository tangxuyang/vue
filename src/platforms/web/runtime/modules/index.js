import attrs from './attrs'
import klass from './class'
import events from './events'
import domProps from './dom-props'
import style from './style'
import transition from './transition'

// 模块的入口文件，把这个目录下的模块都暴露出去
export default [
  attrs,
  klass,
  events,
  domProps, // 比weex平台多了这个模块
  style,
  transition
]
