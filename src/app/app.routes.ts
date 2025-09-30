import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(
        (m: typeof import('@features/home/home.component')) => m.HomeComponent
      ),
  },
  {
    path: 'drinks/:id',
    loadComponent: () =>
      import('./features/drink-detail/drink-detail.component').then(
        (m: typeof import('@features/drink-detail/drink-detail.component')) =>
          m.DrinkDetailComponent
      ),
  },
];
