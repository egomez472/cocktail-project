// @ts-nocheck
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-plugin-prettier');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

const { extractRulesWithMeta } = require('./eslint-custom-rules/utils');
const { rules: allRulesWithMetaData } = require('./eslint-custom-rules');
const templateRules = require('./eslint-custom-rules/template');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['projects/**/*'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
    ],
    plugins: {
      '@angular-eslint': angular.tsPlugin,
      prettier: prettier,
    },
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    rules: {
      ...extractRulesWithMeta(allRulesWithMetaData),
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    plugins: {
      '@angular-eslint': angular.tsPlugin,
      prettier: prettier,
      '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template'),
    },
    rules: {
      ...extractRulesWithMeta(templateRules),
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/elements-content': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      'max-lines-per-function': 'off',
    },
  }
);
