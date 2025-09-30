import { Injectable, WritableSignal, signal } from '@angular/core';

export type Alcoholic =
  | 'Alcoholic'
  | 'Non_Alcoholic'
  | 'Optional_Alcohol'
  | null;

export interface Filters {
  name: string | null;
  firstLetter: string | null;
  category: string | null;
  alcoholic: Alcoholic;
  glass: string | null;
  ingredients: string[];
}

@Injectable({ providedIn: 'root' })
export class FiltersService {
  public readonly filters: WritableSignal<Filters> = signal<Filters>({
    name: '',
    firstLetter: null,
    category: null,
    alcoholic: null,
    glass: null,
    ingredients: [],
  });

  public updateFilters(patch: Partial<Filters>): void {
    this.filters.update((f: Filters) => ({ ...f, ...patch }));
  }

  public reset(): void {
    this.filters.set({
      name: '',
      firstLetter: null,
      category: null,
      alcoholic: null,
      glass: null,
      ingredients: [],
    });
  }
}
