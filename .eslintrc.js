module.exports = {
  extends: ['./node_modules/gts', 'prettier/react', 'plugin:react/recommended'],
  plugins: ['prettier', 'react-hooks', 'import'],
  globals: {
    FIREBASE: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/order': 'error',
  },
  ignorePatterns: ['webpack.config.js'],
}
