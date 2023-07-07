# rollup-source-code 


## 概览

[*rollupjs.org*](https://rollupjs.org/introduction/#overview)

rollup 是一个 JavaScript 模块打包器，把小块代码编译成体积更大更复杂的库和应用等。使用包含在 es6 中新标准格式的代码模块，取代之前的CommonJS和AMD。使用es模块，可自由、无缝的采用库中的单个方法。

### 背景

- webpack 打包非常繁琐，打包体积比较大
- rollup 主要打包 js 库
- vue/react/angular 都在用 rollup 作为打包工具
- 可以使用 es module 编写代码，rollup编译为回退为现有支持的代码格式：cjs, umd, amd 和esm.
- tree-shaking: statically analyze code; commonJS属于动态编译，做不了tree-shaking。后面会分析到的esbuild也没有做tree-shaking.

### 安装依赖

```cmd
pnpm i 
@babel/core
@babel/preset-env
@rollup/plugin-commonjs CommonJS 转为 ES6
@rollup/plugin-node-resolve
@rollup/plugin-typescript
lodash
rollup
rollup-plugin-babel
postcss
rollup-plugin-postcss
rollup-plugin-terser
tslib
typescript
rollup-plugin-serve
rollup-plugin-livereload
-D
```

- 以@开头的都是官方插件

### format 参数含义

- iife: 自执行函数，浏览器使用
- cjs：commonJS，Node使用
- umd：--name xxx 浏览器和Node都可以使用
- esm：es模块
- amd

> format 是 iife 和 umd 是需要指定 bundleName 

### acorn 用法

传入源码，可以生成node节点ast语法树，walk函数可以深度遍历ast语法树，访问每一个节点，进入离开时对应的钩子函数，进行操作，拿到对应的节点进行操作。



```js

const sourceCode = 'import $ from 'jquery''


const ast = acorn.parse(sourceCode)

[astexplorer.net](https://astexplorer.net/) 解析如下：
{
  "type": "Program",
  "start": 0,
  "end": 22,
  "body": [
    {
      "type": "ImportDeclaration",
      "start": 0,
      "end": 22,
      "specifiers": [
        {
          "type": "ImportDefaultSpecifier",
          "start": 7,
          "end": 8,
          "local": {
            "type": "Identifier",
            "start": 7,
            "end": 8,
            "name": "$"
          }
        }
      ],
      "source": {
        "type": "Literal",
        "start": 14,
        "end": 22,
        "value": "jquery",
        "raw": "'jquery'"
      }
    }
  ],
  "sourceType": "module"
}

```

实现 walk 方法
```js
function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave)
}

function visit(node, parent, enter, leave) {
  if (enter) {
    enter.call(null, node, parent)
  }

  const keys = Object.keys(node).filter(key => typeof node[key] === 'object')

  keys.forEach(key => {
    const value = node[key]
    if (Array.isArray(value)) {
      value.forEach(val => visit(val, node, enter, leave))
    } else if (value && value.type) {
      visit(value, node, enter, leave)
    }
  })

  if (leave) {
    leave.call(null, node, parent)
  }
}
```

walk调用输出结果：
```
enter--- Program undefined
enter--- ImportDeclaration Program
enter--- ImportDefaultSpecifier ImportDeclaration
enter--- Identifier ImportDefaultSpecifier
leave--- Identifier ImportDefaultSpecifier
leave--- ImportDefaultSpecifier ImportDeclaration
enter--- Literal ImportDeclaration
leave--- Literal ImportDeclaration
leave--- ImportDeclaration Program
leave--- Program undefined
```

### 作用域

#### 作用域

1. 在JS中，作用域是用来规定变量访问范围的规则
2. 有局部、全局、函数、块级作用域
3. 变量提升

#### 作用域链

作用域链是由当前执行环境与上层执行环境的一系列变量对象组成的，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。

```js
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

```

模拟代码执行，形成作用域
```js
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

```

## 实现 rollup

### 目录
```cmd
├── package.json
├── README.md
├── src
    ├── ast
    │   ├── analyse.js //分析AST节点的作用域和依赖项
    │   ├── Scope.js //有些语句会创建新的作用域实例
    │   └── walk.js //提供了递归遍历AST语法树的功能
    ├── Bundle//打包工具，在打包的时候会生成一个Bundle实例，并收集其它模块，最后把所有代码打包在一起输出
    │   └── index.js 
    ├── Module//每个文件都是一个模块
    │   └── index.js
    ├── rollup.js //打包的入口模块
    └── utils
        ├── map-helpers.js
        ├── object.js
        └── promise.js
```

