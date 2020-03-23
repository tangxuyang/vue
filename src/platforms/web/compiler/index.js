/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

// 使用./options定义的编译器选项创建编译器对象
const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
