import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DrinkService } from '@core/services/drinks/drink.service';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import { LoadingService } from '@core/services/loading/loading.service';
import { DrinkStore } from '@core/store/drink.store';
import { TableConfig } from '@shared/components/table/config/table-config';
import { finalize, Subscription } from 'rxjs';

export interface IngredientItem {
  name: string;
  measure?: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class DrinksTableConfigService {
  private readonly drinkStore: DrinkStore = inject(DrinkStore);
  private readonly router: Router = inject(Router);
  private readonly drinkSvc: DrinkService = inject(DrinkService);
  private readonly loadingSvc: LoadingService = inject(LoadingService);

  public readonly isCategoryModalOpen: WritableSignal<boolean> = signal(false);
  public readonly categoryDrinks: WritableSignal<Drink[]> = signal<Drink[]>([]);
  public readonly categoryTitle: WritableSignal<string> = signal('');

  public readonly isIngredientsModalOpen: WritableSignal<boolean> =
    signal(false);
  public readonly ingredientsItems: WritableSignal<IngredientItem[]> = signal<
    IngredientItem[]
  >([]);
  public readonly ingredientsTitle: WritableSignal<string> =
    signal('Ingredients');

  private buildIngredientImageUrl(
    name: string | undefined
  ): string | undefined {
    const n: string = (name ?? '').trim();
    if (!n) return undefined;
    return `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(n)}-Small.png`;
  }

  private readonly ingredientKeys: string[] = [
    'strIngredient1',
    'strIngredient2',
    'strIngredient3',
    'strIngredient4',
    'strIngredient5',
    'strIngredient6',
    'strIngredient7',
    'strIngredient8',
    'strIngredient9',
    'strIngredient10',
    'strIngredient11',
    'strIngredient12',
    'strIngredient13',
    'strIngredient14',
    'strIngredient15',
  ] as const;

  private readonly measureKeys: string[] = [
    'strMeasure1',
    'strMeasure2',
    'strMeasure3',
    'strMeasure4',
    'strMeasure5',
    'strMeasure6',
    'strMeasure7',
    'strMeasure8',
    'strMeasure9',
    'strMeasure10',
    'strMeasure11',
    'strMeasure12',
    'strMeasure13',
    'strMeasure14',
    'strMeasure15',
  ] as const;

  private countIngredients(d: Drink): number {
    const dict: Record<string, unknown> = d as unknown as Record<
      string,
      unknown
    >;
    return this.ingredientKeys.reduce((acc: number, key: string) => {
      const v: unknown = dict[key];
      return acc + (typeof v === 'string' && v.trim() ? 1 : 0);
    }, 0);
  }

  private static readonly ROWS_PER_PAGE: number[] = [5, 10, 20];

  private async openWhenIdle(openFn: () => void): Promise<void> {
    await this.loadingSvc.waitUntilIdle();
    openFn();
  }

  public readonly config: Signal<TableConfig<Drink>> = computed<
    TableConfig<Drink>
    // eslint-disable-next-line max-lines-per-function
  >(() => ({
    title: 'Cocktails',
    data: this.drinkStore.filteredDrinks(),
    paginator: true,
    rows: 5,
    rowsPerPageOptions: [5, 10, 20],
    loading: this.loadingSvc.isLoading(),
    showTotal: true,
    otherTotal: [
      { label: 'Alcoholic drinks:', value: this.drinkStore.totalAlcoholic() },
      {
        label: 'Non alcoholic drinks:',
        value: this.drinkStore.totalNonAlcoholic(),
      },
    ],
    columns: [
      {
        header: 'ID',
        field: 'idDrink',
        type: 'text-click',
        width: '120px',
        onClick: (row: Drink) => this.router.navigate(['drinks', row.idDrink]),
      },
      {
        header: 'Thumb',
        field: 'strDrinkThumb',
        type: 'image',
        image: {
          width: '64px',
          height: '64px',
          rounded: true,
          altField: 'strDrink',
        },
      },
      {
        header: 'Name',
        field: 'strDrink',
        type: 'text',
      },
      {
        header: 'Category',
        field: 'strCategory',
        type: 'badge',
        badge: {
          value: (row: Drink) => row.strCategory ?? undefined,
          severity: () => 'info',
          onClick: (row: Drink): void => {
            const category: string = row.strCategory || '';
            this.categoryTitle.set(category);
            const _sub: Subscription = this.drinkSvc
              .loadDrinksByCategory(category)
              .pipe(
                finalize(
                  () =>
                    void this.openWhenIdle(() =>
                      this.isCategoryModalOpen.set(true)
                    )
                )
              )
              .subscribe((list: Drink[]) => {
                this.categoryDrinks.set(list || []);
              });
            void _sub;
          },
        },
      },
      {
        header: 'Alcoholic',
        field: 'strAlcoholic',
        type: 'badge',
        badge: {
          value: (row: Drink) => row.strAlcoholic ?? undefined,
          severity: (row: Drink) =>
            row.strAlcoholic === 'Alcoholic' ? 'danger' : 'success',
        },
      },
      {
        header: 'Ingredients',
        type: 'badge',
        align: 'center',
        badge: {
          value: (row: Drink) => String(this.countIngredients(row)),
          severity: () => 'secondary',
          onClick: (row: Drink): void => {
            const items: IngredientItem[] = this.drinkStore
              .ingredientsWithMeasures(row)
              .map(
                (x: { ingredient: string; measure?: string | undefined }) => ({
                  name: x.ingredient,
                  measure: x.measure,
                  imageUrl: this.buildIngredientImageUrl(x.ingredient),
                })
              );
            this.ingredientsItems.set(items);
            this.ingredientsTitle.set(row.strDrink || 'Ingredients');
            void this.openWhenIdle(() => this.isIngredientsModalOpen.set(true));
          },
        },
      },
      {
        header: 'Modified',
        field: 'dateModified',
        type: 'date',
        width: '160px',
      },
      {
        header: 'Glass',
        field: 'strGlass',
        type: 'text',
      },
    ],
    actions: [
      {
        icon: 'pi pi-eye',
        severity: 'secondary',
        onClick: (row: Drink) => this.router.navigate(['drinks', row.idDrink]),
      },
    ],
  }));
}
