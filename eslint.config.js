/* eslint-env node */
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const configPrettier = require('eslint-config-prettier');

module.exports = [
  // Ignorar salidas y deps
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  // Reglas para TypeScript + Angular (incluye templates inline)
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // No usar "project" para evitar errores al resolver referencias TS
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2020
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
      '@angular-eslint/template': angularTemplate
    },
    // Procesa templates inline en componentes (flat config)
    processor: '@angular-eslint/template/extract-inline-html',
    rules: {
      // Recomendadas
      ...(tsPlugin.configs.recommended?.rules || {}),
      ...(angularPlugin.configs.recommended?.rules || {}),

      // Custom rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      curly: ['error', 'multi-line', 'consistent']
    }
  },
  // Reglas para Templates HTML
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser
    },
    plugins: {
      '@angular-eslint/template': angularTemplate
    },
    rules: {
      ...(angularTemplate.configs.recommended?.rules || {})
    }
  },
  // Desactiva reglas que chocan con Prettier
  (configPrettier && typeof configPrettier === 'object') ? configPrettier : {}
];
