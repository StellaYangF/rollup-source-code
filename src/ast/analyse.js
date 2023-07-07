function analyse(ast, code, module) {
  ast.body.forEach(statement => {
    Object.defineProperties(statement, {
      // 给每句话加上额外的值
      _module: { value: module },
      _source: { value: code.snip(statement.statement, statement.end) },
      _included: { value: false, writable: true }
    })
  })
}

module.exports = analyse