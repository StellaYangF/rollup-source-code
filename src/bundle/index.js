const fs = require('fs')

const path = require('path')

const Module = require('../module/index')
const MagicString = require('magic-string')

class Bundle {
  constructor(options) {
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, '') + 'js')
    this.module = {}
  }

  build(filename) {
    const entryModule = this.fetchModule(this.entryPath)
    this.statements = entryModule.expandAllStatements(true)
    const { code } = this.generate()
    fs.writeFileSync(filename, code)
  }

  fetchModule(importee) {
    if (importee) {
      const code = fs.readFileSync(importee, 'utf8')
      const module = new Module({
        code,
        path: importee,
        bundle: this
      })
      return module
    }
  }

  generate() {
    const magicString = new MagicString.Bundle()
    this.statements.forEach(statement => {
      const source = statement._source.clone()
      magicString.addSource({
        content: source
      })
    })

    return {
      code: magicString.toString()
    }
  }
}

module.exports = Bundle