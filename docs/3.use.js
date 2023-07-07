const acorn = require('acorn')
const walk = require('./2.acorn.js')

const sourceCode = `import $ from 'jquery'`
const ast = acorn.parse(sourceCode, {
  sourceType: 'module'
  , ecmaVersion: 8
})

console.log(JSON.stringify(ast))

walk(ast, {
  enter(node, parent) {
    console.log('enter---', node.type, parent?.type)
  },
  leave(node, parent) {
    console.log('leave---', node.type, parent?.type)
  }
})


