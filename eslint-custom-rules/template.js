module.exports = {
  '@angular-eslint/template/no-negated-async': {
    rule: 'warn',
    meta: {
      description: 'Evitar el uso de async pipe negado en plantillas.',
      bad: `*ngIf="!(foo$ | async)"`,
      good: `*ngIf="foo$ | async as foo; else loading"`,
    },
  },
  '@angular-eslint/template/prefer-control-flow': {
    rule: 'warn',
    meta: {
      description: 'Evitar estructuras de control obsoletas en plantillas.',
      bad: `*ngIf="condición; else otra"`,
      good: `@if (condición) { ... } @else { ... }`,
      suggestion: 'Usar las nuevas directivas de control de flujo.',
    },
  },
  '@angular-eslint/template/no-interpolation-in-attributes': {
    rule: 'warn',
    meta: {
      description: 'Evitar interpolación en atributos HTML.',
      bad: `<div class="{{ myClass }}"></div>`,
      good: `<div [class]="myClass"></div>`,
      suggestion: 'Usar binding de atributos en vez de interpolación.',
    },
  },
  '@angular-eslint/template/use-track-by-function': {
    rule: 'error',
    meta: {
      description: 'Evitar *ngFor sin función trackBy.',
      bad: `<div *ngFor="let item of items">{{item}}</div>`,
      good: `<div *ngFor="let item of items; trackBy: trackByFn">{{item}}</div>`,
      suggestion: 'Agregar una función trackBy para mejorar el rendimiento.',
    },
  },
};
