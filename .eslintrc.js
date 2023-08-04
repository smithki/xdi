const javascriptRules = {
  // Core ESLint
  'no-console': 'off',
  'func-names': 'off',
  'guard-for-in': 'off',
  'prefer-const': 'off',
  'no-multi-assign': 'off',
  'no-return-assign': 'off',
  'no-param-reassign': 'off',
  'no-nested-ternary': 'off',
  'no-underscore-dangle': 'off',
  'no-restricted-globals': 'off',
  'no-useless-constructor': 'off',
  'class-methods-use-this': 'off',

  // Imports
  'import/no-extraneous-dependencies': 'off',
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': 'off',

  // Prettier
  'prettier/prettier': ['error', {}, { usePrettierrc: true }],
};

const typescriptRules = {
  ...javascriptRules,
  'no-shadow': 'off', // Breaks with enums :(
  '@typescript-eslint/no-shadow': 'error',

  'consistent-return': 'off', // TypeScript effectively obsoletes this rule with static type inference
  '@typescript-eslint/comma-dangle': 'off', // Avoid conflict between ESLint and Prettier

  // Disable TypeScript rules that are too strict, too opinionated, or just noisy...
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-redeclare': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-for-in-array': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
};

module.exports = {
  // JavaScript configuration
  plugins: ['unused-imports'],
  extends: [
    require.resolve('eslint-config-turbo'),
    require.resolve('@ikscodes/eslint-config/rules/airbnb'),
    require.resolve('@ikscodes/eslint-config/rules/eslint'),
    require.resolve('@ikscodes/eslint-config/rules/prettier'),
  ],
  rules: javascriptRules,

  overrides: [
    // TypeScript configuration
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'unused-imports'],
      extends: [
        require.resolve('eslint-config-turbo'),
        require.resolve('@ikscodes/eslint-config/rules/airbnb'),
        require.resolve('@ikscodes/eslint-config/rules/typescript'),
        require.resolve('@ikscodes/eslint-config/rules/eslint'),
        require.resolve('@ikscodes/eslint-config/rules/prettier'),
      ],
      parserOptions: { project: '**/tsconfig.json' },
      settings: {
        'import/resolver': {
          typescript: {
            project: '**/tsconfig.json',
          },
        },
      },
      rules: typescriptRules,
    },
  ],
};
