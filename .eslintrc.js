module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  plugins: ['prettier', 'import', 'security'],
  extends: [
    'standard',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:security/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022
  },
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    'import/no-unresolved': 'off'
  }
}
