module.exports = {
  '@typescript-eslint/typedef': {
    rule: [
      'warn',
      {
        arrayDestructuring: true,
        arrowParameter: true,
        memberVariableDeclaration: true,
        objectDestructuring: false,
        parameter: true,
        propertyDeclaration: true,
        variableDeclaration: true,
        variableDeclarationIgnoreFunction: true,
      },
    ],
    meta: {
      description: 'Exigir tipos explícitos en TypeScript.',
      bad: `let x;`,
      good: `let x: number;`,
    },
  },
  '@typescript-eslint/explicit-function-return-type': {
    rule: 'warn',
    meta: {
      description: 'Exigir tipo de retorno explícito en funciones.',
      bad: `function foo() { return 1; }`,
      good: `function foo(): number { return 1; }`,
      suggestion: 'Agrega tipo de retorno a las funciones.',
    },
  },
  '@typescript-eslint/explicit-member-accessibility': {
    rule: [
      'warn',
      {
        ignoredMethodNames: [
          'constructor',
          'ngOnInit',
          'ngOnDestroy',
          'ngAfterViewInit',
          'intercept',
          'transform',
          'canLoad',
          'resolve',
        ],
      },
    ],
    meta: {
      description:
        'Exigir especificar public/private/protected en miembros de clase.',
      bad: `class Foo { bar() {} }`,
      good: `class Foo { public bar() {} }`,
    },
  },
  '@typescript-eslint/member-ordering': {
    rule: 0,
  },
  '@typescript-eslint/naming-convention': {
    rule: 0,
  },
  '@typescript-eslint/no-restricted-imports': {
    rule: [
      'warn',
      {
        patterns: [
          {
            group: ['./*', '../*'],
            message:
              "Usa paths absolutos con el alias '@' en lugar de imports relativos.",
          },
          {
            group: ['@angular/core/rxjs-interop'],
            message:
              'Considerar usar directamente Signals de Angular para la gestión de estado reactivo, si es aplicable',
          },
          {
            group: ['@ngrx/store'],
            message:
              'Considerar usar Angular Signals para estado local. NgRx Store es mejor para estado global complejo.',
            allowTypeImports: true,
          },
          {
            group: ['rxjs'],
            importNames: ['BehaviorSubject', 'Subject'],
            message:
              'Considerar usar Angular Signals en lugar de RxJS Subjects para estado local',
            allowTypeImports: true,
          },
        ],
      },
    ],
    meta: {
      description: 'Restringe ciertos imports en TypeScript.',
      bad: `import { BehaviorSubject } from 'rxjs';`,
      good: `// Usa Angular Signals para estado local`,
      suggestion: 'Evita los imports restringidos.',
    },
  },
  '@typescript-eslint/no-unused-vars': {
    rule: [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    meta: {
      description: 'No permite variables no usadas.',
      bad: `let x = 1;`,
    },
  },
  '@typescript-eslint/no-floating-promises': {
    rule: 'warn',
    meta: {
      description: 'Detecta promesas no manejadas.',
      bad: `doAsync();`,
      good: `await doAsync();`,
    },
  },
  '@typescript-eslint/no-inferrable-types': {
    rule: 'off',
    meta: {
      description: 'Permite anotaciones de tipo aunque sean inferibles.',
    },
  },
};
