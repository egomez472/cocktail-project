import { Injectable, Signal, computed, inject } from '@angular/core';
import { DrinkService } from '@core/services/drinks/drink.service';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import { TableConfig } from '@shared/components/table/config/table-config';

@Injectable({ providedIn: 'root' })
export class DrinksTableConfigService {
  private readonly drinkSvc: DrinkService = inject(DrinkService);

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

  public readonly config: Signal<TableConfig<Drink>> = computed<
    TableConfig<Drink>
    // eslint-disable-next-line max-lines-per-function
  >(() => ({
    title: 'Cocktails',
    data: this.drinkSvc.drinks(),
    paginator: true,
    rows: 5,
    rowsPerPageOptions: [5, 10, 20],
    showTotal: true,
    otherTotal: [
      { label: 'Alcoholic drinks:', value: this.drinkSvc.totalAlcoholic() },
      {
        label: 'Non alcoholic drinks:',
        value: this.drinkSvc.totalNonAlcoholic(),
      },
    ],
    columns: [
      {
        header: 'ID',
        field: 'idDrink',
        type: 'text-click',
        width: '120px',
        onClick: (row: Drink) => alert(`View ${row.idDrink}`),
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
            const lines: string[] = [];
            for (let i: number = 0; i < this.ingredientKeys.length; i++) {
              const dict: Record<string, unknown> = row as unknown as Record<
                string,
                unknown
              >;
              const ing: string | undefined =
                typeof dict[this.ingredientKeys[i]] === 'string'
                  ? (dict[this.ingredientKeys[i]] as string)
                  : undefined;
              if (ing && ing.trim()) {
                const mea: string | undefined =
                  typeof dict[this.measureKeys[i]] === 'string'
                    ? (dict[this.measureKeys[i]] as string)
                    : undefined;
                lines.push(`${ing}${mea ? ' - ' + mea : ''}`);
              }
            }
            alert(`${row.strDrink}:\n` + lines.join('\n'));
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
        onClick: (row: Drink) => alert(`View ${row.strDrink}`),
      },
    ],
  }));
}
