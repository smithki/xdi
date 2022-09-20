module.exports = {
  root: true,
  extends: [require.resolve('@internal/config/lint/eslint')],
  ignorePatterns: ['/src/commands/plop/templates/**/*'],
};
