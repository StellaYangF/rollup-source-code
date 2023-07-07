const MagicString = require('magic-string')
const { parse } = require('acorn')
const analyse = require('../ast/analyse')
const { result } = require('lodash')

class Module {
  constructor({
    code,
    path,
    bundle
  }) {
    this.code = new MagicString(code, { filename: path })
    this.path = path
    this.bundle = bundle
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: "module"
    })
    analyse(this.ast, this.code, this)
  }

  expandAllStatements() {
    const allStatements = []

    this.ast.body.forEach(statement => {
      const statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })

    return allStatements
  }

  expandStatement(statement) {
    statement.included = true
    const result = []
    result.push(statement)
    return result
  }

}

module.exports = Module