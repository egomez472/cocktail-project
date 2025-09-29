module.exports = {
  '@angular-eslint/prefer-standalone': {
    rule: 'warn',
    meta: {
      description: 'Sugerir componentes standalone.',
      bad: `@Component({ /* sin standalone */ })`,
      good: `@Component({ standalone: true })`,
    },
  },
  '@angular-eslint/component-class-suffix': {
    rule: [
      'error',
      {
        suffixes: ['Page', 'Component'],
      },
    ],
  },
  '@angular-eslint/use-lifecycle-interface': {
    rule: ['error'],
    meta: {
      description: 'Exigir uso de interfaces de ciclo de vida.',
      bad: `ngOnInit() {}`,
      good: `class Foo implements OnInit { ngOnInit() {} }`,
      suggestion: 'Implementar la interfaz correspondiente.',
    },
  },
  '@angular-eslint/no-output-native': {
    rule: 'error',
    meta: {
      description: 'Evitar outputs con nombres nativos del DOM.',
      bad: `@Output() click = new EventEmitter();`,
      good: `@Output() customClick = new EventEmitter();`,
    },
  },
  '@angular-eslint/no-empty-lifecycle-method': {
    rule: 'error',
    meta: {
      description: 'Evitar métodos de ciclo de vida vacíos.',
      bad: `ngOnInit() {}`,
      good: `ngOnInit() { this.init(); }`,
    },
  },
};
