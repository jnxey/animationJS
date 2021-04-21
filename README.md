# animationJS
This is an animation plugin

### 项目依赖
```shell
npm i --save-dev rollup @babel/core @babel/preset-env rollup-plugin-babel rollup-plugin-serve @rollup/plugin-alias rollup-plugin-eslint prettier lint-staged husky eslint babel-eslint cross-env
npx husky install
npx husky add .husky/pre-commit "npm test"
```
- rollup javascript 打包工具，只打包 javascript，打包的结果相对简单

- @babel/core Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

- @babel/preset-env 这个 Babel 插件可以将高版本 Javascript 打包成低版本的 javascript

- rollup-plugin-babel 将 rollup 与 Babel 结合

- rollup-plugin-serve 利用 rollup 开启一个静态服务

- @rollup/plugin-alias 设置路径别名

- rollup-plugin-eslint 打包时进行 eslint 检查

- lint-staged 是一个在git暂存文件上运行linters的工具

- prettier 是一个代码美化工具

- husky 可以防止使用 Git hooks 的一些不好的 commit 或者 push

- eslint 代码质量检查 npm run lint

- babel-eslint eslint 解析器

- cross-env 设置环境变量

---
注意：使用 npm 安装 eslint 和 husky，在 windows 操作系统下, 用 yarn 安装依赖，不会触发 husky pre-commit 钩子命令。
注意：vscode 需要安装 prettier 与 eslint 插件，vscode 插件配置在.vscode/settings.json 文件中
---
安装依赖网速不好的情况，可以考虑切换淘宝镜像
npm config set registry https://registry.npm.taobao.org
npm config get registry
