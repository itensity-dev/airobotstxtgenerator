// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.astro/**',
      '**/node_modules/**',
      '**/coverage/**',
      'apps/web/src/generated/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
