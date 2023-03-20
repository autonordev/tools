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
    'import/no-unresolved': 'off',

    'security/detect-object-injection': 'off',
    'security/detect-child-process': 'off',
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-unsafe-regex': 'off'
  }
}
