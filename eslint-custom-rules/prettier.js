module.exports = {
  'prettier/prettier': {
    rule: [
      'error',
      {
        endOfLine: 'lf',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
    ],
    meta: {
      description:
        'Evitar estilos de código inconsistentes. Aplicar formato Prettier.',
      bad: `function foo( ) {return 1}`,
      good: `function foo() { return 1; }`,
      suggestion: 'Aplicar Prettier para mantener el formato consistente.',
    },
  },
};
