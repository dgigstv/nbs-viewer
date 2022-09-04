module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    project: ['tsconfig.lint.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest'],
  root: true,
}
