import { Injectable, computed, inject } from '@angular/core';
import { Drink } from '../../../core/interfaces/drink.interface';
import { DrinkService } from '../../../core/services/drinks/drink.service';
import { TableConfig } from '../../../shared/components/table/config/table-config';

@Injectable({ providedIn: 'root' })
export class DrinksTableConfigService {
  private readonly drinkSvc = inject(DrinkService);

  private readonly ingredientKeys = [
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

  private readonly measureKeys = [
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
    return this.ingredientKeys.reduce((acc, key) => {
      const v = d[key];
      return acc + (v && v.trim() ? 1 : 0);
    }, 0);
  }

  readonly config = computed<TableConfig<Drink>>(() => ({
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
        onClick: (row) => alert(`View ${row.idDrink}`),
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
          value: (row) => row.strCategory ?? undefined,
          severity: () => 'info',
        },
      },
      {
        header: 'Alcoholic',
        field: 'strAlcoholic',
        type: 'badge',
        badge: {
          value: (row) => row.strAlcoholic ?? undefined,
          severity: (row) =>
            row.strAlcoholic === 'Alcoholic' ? 'danger' : 'success',
        },
      },
      {
        header: 'Ingredients',
        type: 'badge',
        align: 'center',
        badge: {
          value: (row) => String(this.countIngredients(row)),
          severity: () => 'secondary',
          onClick: (row) => {
            const lines: string[] = [];
            for (let i = 0; i < this.ingredientKeys.length; i++) {
              const ing = row[this.ingredientKeys[i]];
              if (ing && ing.trim()) {
                const mea = row[this.measureKeys[i]];
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
        onClick: (row) => alert(`View ${row.strDrink}`),
      },
    ],
  }));
}
