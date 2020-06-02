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
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
          },
        ],
      },
    ],
    'object-curly-spacing': ['error', 'always'],
  },
  ignorePatterns: ['webpack.config.js'],
}
