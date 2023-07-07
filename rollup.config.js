import commonjs from "@rollup/plugin-commonjs"
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm', // cjs, esm, iife, umd, amd
    name: 'bundleName', // iife, umd 要指定全局变量
  },
  plugins: [
    resolve(),
    commonjs()
  ]
}