module.exports = {
  'no-restricted-properties': {
    rule: [
      'warn',
      {
        object: 'Observable',
        property: 'pipe',
        message:
          'Para la gestión de estado reactivo local en componentes, considerar usar Signals de Angular en lugar de Observables y el pipe() de RxJS, si la complejidad lo permite.',
      },
      {
        object: 'BehaviorSubject',
        property: 'next',
        message:
          'Cuando se gestiona estado mutable en componentes, un Sig de Angular podría simplificar el código y la reactividad comparado con BehaviorSubject. Considerar si signal() es una mejor opción.',
      },
      {
        object: 'Store',
        property: 'select',
        message:
          'Para estado local, considerar usar Signals en lugar de Store.select(). NgRx Store es mejor para estado global complejo.',
      },
    ],
    meta: {
      description: 'Evitar el uso de ciertas propiedades restringidas.',
      bad: `observable.pipe(map(x => x))`,
      good: `// Usar Signals de Angular si es posible`,
      suggestion:
        'Buscar alternativas recomendadas en vez de propiedades restringidas.',
    },
  },
};
