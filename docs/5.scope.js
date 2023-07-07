class Scope {
  constructor({ name, parent, names = [] }) {
    //作用域的名称
    this.name = name
    //父作用域
    this.parent = parent
    //此作用域内定义的变量
    this.names = names
  }

  add(name) {
    this.names.push(name)
  }

  findDefiningScope(name) {
    if (this.names.includes(name)) {
      // 先找自己的
      return this
    } else if (this.parent) {
      // 自己没有，找父级的
      return this.parent.findDefiningScope(name)
    } else {
      // 都没有就没有了
      return null
    }
  }
}

module.exports = Scope