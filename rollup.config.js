import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import alias from '@rollup/plugin-alias'
import { eslint } from 'rollup-plugin-eslint'
import path from 'path'

const rootPath = path.resolve(__dirname)

export default {
  // 入口
  input: 'src/index.js',
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  // 出口
  output: {
    // 出口目录
    file:
      process.env.NODE_ENV === 'development' ? 'dist/animationJS.dev.js' : 'dist/animationJS.js',
    // 全局变量名字
    name: 'AnimationJS',
    // 模块规范
    format: 'umd',
    // sourcemap
    sourcemap: false
  },
  plugins: [
    babel({
      include: 'src/**'
    }),
    process.env.NODE_ENV === 'development'
      ? serve({
          open: true,
          openPage: '/public/index.html',
          port: 3000,
          contentBase: ''
        })
      : null,
    alias({
      entries: [{ find: '@', replacement: path.resolve(rootPath, 'src') }]
    }),
    eslint()
  ]
}
