module.exports = {
  extends: ['./node_modules/gts', 'prettier/react', 'plugin:react/recommended'],
  plugins: ['prettier', 'react-hooks'],
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
  },
  ignorePatterns: ['webpack.config.js'],
}
