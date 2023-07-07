import MagicString, { Bundle } from "magic-string";

const sourceCode = `export const name = "Vivian"`

// 处理源码
const ms = new MagicString(sourceCode)

console.log(ms.snip(0, 6).toString(), '---', ms.toString())
console.log(ms.remove(0, 7).toString(), '---', ms.toString())

// 合并代码
const bundle = new Bundle()
bundle.addSource({
  content: `let a = 'a'`
})
bundle.addSource({
  content: `let b = 'b'`
})

console.log(bundle.toString())
