import { defineConfig, importPlugin, js, ts } from '@rslint/core';

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ts.configs.recommended,
  {
    ...importPlugin.configs.recommended,
    files: ['**/*.{ts,mts,tsx,js,mjs,jsx}'],
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
        'eslint-import-resolver-custom-alias': {
          alias: {
            '@': './src',
            '~': './node_modules',
          },
          extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
        },
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,

      // Keep project lint behavior aligned with the previous baseline.
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/consistent-generic-constructors': [
        'error',
        'type-annotation',
      ],

      // Ignore intentionally unused identifiers with underscore prefix.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Using parent traversal is prohibited in app code. Use @/ alias instead.
      'import/no-relative-parent-imports': [
        'error',
        { ignore: ['^@/', '^~/'] },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
