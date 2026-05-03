module.exports = {
  extends: ['expo'],
  ignorePatterns: ['/dist/*', '/.expo/*'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
