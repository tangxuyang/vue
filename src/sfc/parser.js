/* @flow */

import deindent from 'de-indent'
import { parseHTML } from 'compiler/parser/html-parser'
import { makeMap } from 'shared/util'

const splitRE = /\r?\n/g
const replaceRE = /./g
const isSpecialTag = makeMap('script,style,template', true)

/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 * SFC Descriptor Object是啥？想想也知道，单文件组件有三部分组成template、script和style，所以
 * 不外乎这三个部分
 * {
 *  template
 *  script
 *  styles
 * }
 * 可以看出来，template和script都是只有一个，而style可以有多个
 * 同时还有customBlocks和errors
 */
export function parseComponent (
  content: string,
  options?: Object = {}
): SFCDescriptor {
  const sfc: SFCDescriptor = {
    template: null,
    script: null,
    styles: [],
    customBlocks: [],
    errors: []
  }
  let depth = 0
  let currentBlock: ?SFCBlock = null

  let warn = msg => {
    sfc.errors.push(msg)
  }

  if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
    warn = (msg, range) => {
      const data: WarningMessage = { msg }
      if (range.start != null) {
        data.start = range.start
      }
      if (range.end != null) {
        data.end = range.end
      }
      sfc.errors.push(data)
    }
  }

  function start (
    tag: string,
    attrs: Array<ASTAttr>,
    unary: boolean,
    start: number,
    end: number
  ) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        // attrs从数组，转换成键值对
        attrs: attrs.reduce((cumulated, { name, value }) => {
          cumulated[name] = value || true
          return cumulated
        }, {})
      }
      // 特殊处理template script style
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs)
        if (tag === 'style') {
          sfc.styles.push(currentBlock)
        } else {
          sfc[tag] = currentBlock
        }
      } else { // custom blocks
        sfc.customBlocks.push(currentBlock)
      }
    }
    if (!unary) {
      depth++
    }
  }

  // 根据attrs给SFCBlock的lang、scoped、module和src赋值
  // 可以知道ASTAttr是一个有name和value的对象
  function checkAttrs (block: SFCBlock, attrs: Array<ASTAttr>) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i]
      if (attr.name === 'lang') {
        block.lang = attr.value
      }
      if (attr.name === 'scoped') {
        block.scoped = true
      }
      if (attr.name === 'module') {
        block.module = attr.value || true
      }
      if (attr.name === 'src') {
        block.src = attr.value
      }
    }
  }

  function end (tag: string, start: number) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start
      let text = content.slice(currentBlock.start, currentBlock.end)
      if (options.deindent !== false) {
        text = deindent(text)
      }
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text
      }
      currentBlock.content = text
      currentBlock = null
    }
    depth--
  }

  function padContent (block: SFCBlock, pad: true | "line" | "space") {
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      const offset = content.slice(0, block.start).split(splitRE).length
      const padChar = block.type === 'script' && !block.lang
        ? '//\n'
        : '\n'
      return Array(offset).join(padChar)
    }
  }

  parseHTML(content, {
    warn,
    start,
    end,
    outputSourceRange: options.outputSourceRange
  })

  return sfc
}

// 这个文件提供的功能是借助compiler/parser/html-parser把单文件组件
// 用单文件组件描述符对象来表示
// 这个描述符包括了template script 和 styles，以及customBlocks和errors
// 太细节的逻辑我是没看懂的，比如start和end的交相呼应
