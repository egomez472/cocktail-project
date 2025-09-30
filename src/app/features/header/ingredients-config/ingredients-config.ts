import { effect, EffectRef, inject, Injectable, Signal } from '@angular/core';
import { IngredientsService } from '@app/core/services/ingredients/ingredients.service';
import { InputFieldMultiSelectConfig } from '@app/shared/components/input-field/interfaces/input-field.interface';

@Injectable({ providedIn: 'root' })
export class IngredientsConfigService {
  public readonly ingredientsSvc: IngredientsService =
    inject(IngredientsService);

  public readonly ingredients: Signal<string[]> =
    this.ingredientsSvc.ingredients;

  public readonly ingredientsMultiBaseConfig: Omit<
    InputFieldMultiSelectConfig<string>,
    'selected'
  > = {
    type: 'multi-select',
    icon: 'pi pi-filter',
    placeholder: 'Ingredients...',
    options: this.ingredientsSvc.ingredients,
    optionLabel: undefined,
    optionFilterBy: undefined,
    showClear: true,
  };

  private readonly sync: EffectRef = effect(() => {
    this.ingredientsSvc.loadIngredients();
  });

  public destroySvc(): void {
    // por si luego necesitamos cancelar fetches
  }
}
