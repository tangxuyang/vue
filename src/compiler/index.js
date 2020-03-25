/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
/**
 * 创建编译器
 * 上面注释说有三种方法可以创建编译器parser、optimizer和codegen
 */
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 抽象语法树Abstract Syntax Tree
  const ast = parse(template.trim(), options)
  // 没有明确关闭优化，则优化
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  // 编译结果CompiledResult是一个对象有ast、render和staticRenderFns
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
