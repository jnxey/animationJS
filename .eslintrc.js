module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    exclude: '/node_modules/**, dist/**',
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
    semi: [2, 'never'],
    'comma-dangle': 'off'
  }
}
