module.exports = {
  'no-console': {
    rule: 'warn',
    meta: {
      description: 'Evitar el uso de console.log en producción.',
      bad: `console.log('debug info');`,
    },
  },
  'no-debugger': {
    rule: 'error',
    meta: {
      description: 'No user debugger en código final.',
      bad: `debugger;`,
    },
  },
  'no-var': {
    rule: 'error',
    meta: {
      description: 'No user var, prefiere let o const.',
    },
  },
  'prefer-const': {
    rule: 'warn',
    meta: {
      description: 'Usar const si la variable no se reasigna.',
    },
  },
  'no-restricted-syntax': {
    rule: [
      'error',
      {
        selector:
          'CallExpression[callee.property.name="subscribe"] CallExpression[callee.property.name="subscribe"]',
        message:
          'Evitar suscripciones anidadas. Usar operadores RxJS como switchMap, mergeMap, o concatMap para encadenar Observables.',
      },
      {
        selector:
          'ExpressionStatement > CallExpression[callee.property.name="subscribe"]',
        message:
          'Guardar las suscripciones en una variable para poder desuscribirse en ngOnDestroy. Usar Subscription.add() o guardar la referencia.',
      },
    ],
    meta: {
      description: 'Evitar patrones peligrosos con suscripciones RxJS.',
      bad: `foo$.subscribe(() => { bar$.subscribe(() => {}); });`,
      good: `foo$.pipe(switchMap(() => bar$)).subscribe();`,
      suggestion:
        'Encadenar observables con operadores en vez de anidar suscripciones.',
    },
  },
  complexity: {
    rule: ['warn', 10],
    meta: {
      description: 'Limitar la complejidad ciclomática.',
      bad: `// Función con muchos if/else anidados`,
      good: `// Divide en funciones más pequeñas`,
    },
  },
  'max-depth': {
    rule: ['warn', 4],
    meta: {
      description: 'Limitar el anidamiento de bloques.',
      bad: `if (a) { if (b) { if (c) { if (d) { ... }}}}`,
    },
  },
  'max-lines-per-function': {
    rule: ['warn', 50],
    meta: {
      description: 'Limitar líneas por función.',
      bad: `function foo() { /* 100 líneas */ }`,
    },
  },
  'max-params': {
    rule: ['warn', 3],
    meta: {
      description: 'Limitar parámetros por función.',
      bad: `function foo(a, b, c, d) { ... }`,
      good: `function foo(props: Object(a,b,c)) { ... }`,
      suggestion: 'Reduce la cantidad de parámetros.',
    },
  },
  'max-statements': {
    rule: ['warn', 20],
    meta: {
      description: 'Limitar declaraciones por función.',
      bad: `function foo() { let a; let b; ... /* 30 declaraciones */ }`,
      good: `// Divide en funciones más pequeñas`,
      suggestion: 'Divide funciones con muchas declaraciones.',
    },
  },
  'no-loop-func': {
    rule: 'error',
    meta: {
      description:
        'Evitar funciones dentro de bucles que capturen variables por referencia.',
      bad: `for (var i = 0; i < 10; i++) { setTimeout(function() { console.log(i); }, 100); }`,
      good: `for (let i = 0; i < 10; i++) { setTimeout(function() { console.log(i); }, 100); }`,
      suggestion: 'Usar let o crear una función para capturar el valor.',
    },
  },
};
