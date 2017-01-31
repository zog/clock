// import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'app/scripts/main.es6',
  dest: '.tmp/scripts/main.js',
  plugins: [
    // includePaths({
    //   paths: ,
    //   extensions: ['.js', '.json', '.es6']
    // }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json', '.es6']
    }),
    commonjs()
  ],
  format: 'iife',
  moduleName: "main",
  sourceMap: true
}
