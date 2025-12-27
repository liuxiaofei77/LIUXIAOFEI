module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  parser: 'vue-eslint-parser', // 解析 .vue 文件
  extends: [
    'plugin:vue/recommended',
    "plugin:vue/vue3-essential",
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser', // 解析 .ts 文件
  },
  rules: {
    'prettier/prettier': 'off',
    // 使用 === 替代 ==
    "eqeqeq": 1, // 必须使用全等
    "semi": [2, "never"], // 不使用分号结尾
    "no-undef": 0, // 不能有未定义的变量
    'no-unused-vars': 0, // //不能有声明后未被使用的变量或参数
    "@typescript-eslint/no-unused-vars" : [ "error" ],
    // 设置 typescript-eslint 规则
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-empty-function': 0, // 不允许空函数
    '@typescript-eslint/no-var-requires': 0, // 除导入语句外，禁止使用require语句
    '@typescript-eslint/no-explicit-any': 0, // 禁止使用任何类型
  },
  // 忽略检查的文件
  ignorePatterns: ['node_modules/', 'dist/']
}
