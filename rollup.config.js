import commonjs from "@rollup/plugin-commonjs"

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.cjs.js',
    name: 'bundleName',
    format: 'iife'
  },
  plugins: [
    commonjs()
  ]
}