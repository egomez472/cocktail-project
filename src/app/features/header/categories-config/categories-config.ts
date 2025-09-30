import { effect, EffectRef, inject, Injectable, Signal } from '@angular/core';
import { CategoriesService } from '@app/core/services/categories/categories.service';
import { Category } from '@app/core/services/categories/interfaces/categories.interface';
import { InputFieldSelectConfig } from '@app/shared/components/input-field/interfaces/input-field.interface';

@Injectable({ providedIn: 'root' })
export class CategoriesConfigService {
  public categorySvc: CategoriesService = inject(CategoriesService);

  public categories: Signal<Category[]> = this.categorySvc.categories;

  public static ALPHABET: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  public categorySelectBaseConfig: Omit<
    InputFieldSelectConfig<Category>,
    'selected'
  > = {
    type: 'select',
    icon: 'pi pi-filter',
    placeholder: 'Category...',
    options: this.categorySvc.categories,
    optionLabel: 'strCategory',
    optionFilterBy: 'strCategory',
    showClear: true,
  };

  private readonly sync: EffectRef = effect(() => {
    this.categorySvc.loadCategories();
  });

  public destroySvc(): void {
    this.categorySvc.destroyCategoriesSvc();
  }
}
