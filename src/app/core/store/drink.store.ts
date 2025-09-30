import {
  EffectRef,
  Injectable,
  OnDestroy,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DrinkService } from '@core/services/drinks/drink.service';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import {
  Filters,
  FiltersService,
} from '@core/services/filters/filters.service';
import { Subscription } from 'rxjs';

export interface PaginationState {
  page: number; // 1-based
  size: number; // items per page
}

@Injectable({ providedIn: 'root' })
export class DrinkStore implements OnDestroy {
  private readonly drinkSvc: DrinkService = inject(DrinkService);
  private readonly filtersSvc: FiltersService = inject(FiltersService);
  private readonly sub: Subscription = new Subscription();

  // Resultado de la última búsqueda, por nombre o por primera letra
  private readonly sourceDrinks: WritableSignal<Drink[]> = signal<Drink[]>([]);

  private readonly pagination: WritableSignal<PaginationState> =
    signal<PaginationState>({ page: 1, size: 10 });

  public readonly disableNameInput: Signal<boolean> = computed(
    () => this.filtersSvc.filters().firstLetter !== null
  );

  private filterByCategory(drinks: Drink[], category: string | null): Drink[] {
    if (!category) return drinks;
    const c: string = category.toLowerCase();
    return drinks.filter(
      (d: Drink) => (d.strCategory ?? '').toLowerCase() === c
    );
  }

  private filterByAlcoholic(
    drinks: Drink[],
    alcoholic: Filters['alcoholic']
  ): Drink[] {
    if (!alcoholic) return drinks;
    const map: Record<string, string> = {
      Alcoholic: 'Alcoholic',
      Non_Alcoholic: 'Non alcoholic',
      Optional_Alcohol: 'Optional alcohol',
    };
    const expected: string = (map[alcoholic] ?? alcoholic).toLowerCase();
    return drinks.filter(
      (d: Drink) => (d.strAlcoholic ?? '').toLowerCase() === expected
    );
  }

  /**
   * @TODO filtro por copa
   */
  private filterByGlass(drinks: Drink[], glass: string | null): Drink[] {
    if (!glass) return drinks;
    const g: string = glass.toLowerCase();
    return drinks.filter((d: Drink) => (d.strGlass ?? '').toLowerCase() === g);
  }

  private ingredientSet(d: Drink): Set<string> {
    const s: Set<string> = new Set<string>();
    for (let i: number = 1; i <= 15; i++) {
      const key: keyof Drink = `strIngredient${i}` as keyof Drink;
      const raw: string | null = d[key];
      const val: string = typeof raw === 'string' ? raw : '';
      if (val && val.trim()) s.add(val.trim().toLowerCase());
    }
    return s;
  }

  private filterByIngredients(drinks: Drink[], ingredients: string[]): Drink[] {
    if (!ingredients?.length) return drinks;
    const wanted: string[] = ingredients.map((i: string) =>
      i.trim().toLowerCase()
    );
    return drinks.filter((d: Drink) => {
      const set: Set<string> = this.ingredientSet(d);
      return wanted.every((ing: string) => set.has(ing));
    });
  }

  private filterByName(
    drinks: Drink[],
    name: string | null,
    firstLetter: string | null
  ): Drink[] {
    if (firstLetter) return drinks; // si hay primera letra, no aplica filtro por nombre
    const q: string = (name ?? '').trim().toLowerCase();
    if (!q) return drinks;
    return drinks.filter((d: Drink) =>
      (d.strDrink ?? '').toLowerCase().includes(q)
    );
  }

  private applyFilters(drinks: Drink[], f: Filters): Drink[] {
    let out: Drink[] = drinks;
    out = this.filterByCategory(out, f.category);
    out = this.filterByAlcoholic(out, f.alcoholic);
    out = this.filterByGlass(out, f.glass);
    out = this.filterByIngredients(out, f.ingredients);
    out = this.filterByName(out, f.name, f.firstLetter);
    return out;
  }

  // Lista filtrada aplicando filtros actuales sobre la fuente base
  public readonly filteredDrinks: Signal<Drink[]> = computed(() => {
    const drinks: Drink[] = this.sourceDrinks();
    const f: Filters = this.filtersSvc.filters();
    return this.applyFilters(drinks, f);
  });

  // Totales derivados
  public readonly totalAlcoholic: Signal<number> = computed(
    () =>
      this.filteredDrinks().filter((d: Drink) => d.strAlcoholic === 'Alcoholic')
        .length
  );
  public readonly totalNonAlcoholic: Signal<number> = computed(
    () =>
      this.filteredDrinks().filter(
        (d: Drink) => d.strAlcoholic === 'Non alcoholic'
      ).length
  );
  public readonly total: Signal<number> = computed(
    () => this.filteredDrinks().length
  );

  // Datos paginados para tablas
  public readonly page: Signal<number> = computed(() => this.pagination().page);
  public readonly size: Signal<number> = computed(() => this.pagination().size);
  public readonly paginatedDrinks: Signal<Drink[]> = computed(() => {
    const page: number = this.pagination().page;
    const size: number = this.pagination().size;
    const start: number = (page - 1) * size;
    return this.filteredDrinks().slice(start, start + size);
  });

  private readonly sync: EffectRef = effect(() => {
    const f: Filters = this.filtersSvc.filters();

    // Si cambia la primera letra
    if (f.firstLetter) {
      this.fetchByFirstLetter(f.firstLetter);
      // Al cambiar de modo, reset de paginación
      this.resetPagination();
      return;
    }

    // Si no hay primera letra, y hay nombre (o vacío => vaciar fuente)
    if (f.name && f.name.trim()) {
      this.fetchByName(f.name.trim());
    } else {
      this.sourceDrinks.set([]);
    }
    this.resetPagination();
  });

  // Acciones públicas
  public setPage(page: number): void {
    this.pagination.update((p: PaginationState) => ({ ...p, page }));
  }
  public setSize(size: number): void {
    this.pagination.set({ page: 1, size });
  }

  public setFirstLetter(letter: string | null): void {
    this.filtersSvc.updateFilters({
      firstLetter: letter,
      name: letter ? null : '',
    });
  }
  public setName(name: string): void {
    this.filtersSvc.updateFilters({ name });
  }

  public fetchByName(name: string): void {
    const s: Subscription = this.drinkSvc
      .loadDrinks(name)
      .subscribe((drinks: Drink[]) => {
        this.sourceDrinks.set(drinks ?? []);
      });
    this.sub.add(s);
  }

  public fetchByFirstLetter(letter: string): void {
    const s: Subscription = this.drinkSvc
      .loadDrinksByFirstLetter(letter)
      .subscribe((drinks: Drink[]) => {
        this.sourceDrinks.set(drinks ?? []);
      });
    this.sub.add(s);
  }

  private resetPagination(): void {
    this.pagination.update((p: PaginationState) => ({ ...p, page: 1 }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
