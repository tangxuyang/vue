import model from './model'
import show from './show'

// 作为指令的入口文件，把当前目录下的指令暴露出去
// v-model和v-show
// 这样看来model和show只是web支持的，weex中不支持
export default {
  model,
  show
}
