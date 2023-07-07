const Bundle = require('./bundle/index')

function rollup(entry, filename) {
  const bundle = new Bundle({ entry })
  bundle.build(filename)
}

module.exports = rollup