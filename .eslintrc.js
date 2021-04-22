module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    include: '/src/**',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  root: true,
  rules: {
    camelcase: 'off',
    semi: 0, // 语句可以不需要分号结尾
    'comma-dangle': 'off'
  }
}
