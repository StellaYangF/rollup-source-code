const a = 1

function one() {
  const b = 2

  return function two() {
    const c = 3

    console.log(a, b, c)
  }
}

const Scope = require('./5.scope.js')

const globalScope = new Scope({
  name: 'global',
  parent: null,
  names: ['a', 'one']
})

const oneScope = new Scope({
  name: 'one',
  parent: globalScope,
  names: ['b', 'two']
})


const twoScope = new Scope({
  name: 'two',
  parent: oneScope,
  names: ['c']
})

console.log(twoScope.findDefiningScope('a').name)

