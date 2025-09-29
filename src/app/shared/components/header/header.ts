import {
  Component,
  effect,
  EffectCleanupRegisterFn,
  EffectRef,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '@core/services/categories/categories.service';
import { Category } from '@core/services/categories/interfaces/categories.interface';
import { DrinkService } from '@core/services/drinks/drink.service';
import {
  InputFieldComponent,
  InputFieldSelectConfig,
  InputFieldTextConfig,
} from '@shared/components/input-field/input-field';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FormsModule,
    Card,
    Tag,
    InputFieldComponent,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit {
  private drinkSvc: DrinkService = inject(DrinkService);
  private categorySvc: CategoriesService = inject(CategoriesService);

  public readonly categories: Signal<Category[]> = this.categorySvc.categories;
  public text: WritableSignal<string> = signal<string>('');
  public icon: string = 'pi pi-sun';
  public selectedCategory: WritableSignal<Category | null> =
    signal<Category | null>(null);

  // Config para el input de texto
  public searchInputConfig: InputFieldTextConfig = {
    type: 'text',
    icon: 'pi pi-search',
    placeholder: 'Cocktail name...',
    model: this.text,
  };

  // Config base para el select de categorías (sin selected, lo pasamos dinámico desde la plantilla)
  public categorySelectBaseConfig: Omit<
    InputFieldSelectConfig<Category>,
    'selected'
  > = {
    type: 'select',
    icon: 'pi pi-filter',
    placeholder: 'Category...',
    options: this.categories,
    optionLabel: 'strCategory',
    optionFilterBy: 'strCategory',
    showClear: true,
  };

  public get categorySelectConfig(): InputFieldSelectConfig<Category> {
    return {
      ...this.categorySelectBaseConfig,
      selected: this.selectedCategory(),
    };
  }

  public onCategoryChange(category: Category | null): void {
    this.selectedCategory.set(category);
  }

  // Nueva signal para gestionar la letra seleccionada en los tags
  public selectedLetter: WritableSignal<string | null> = signal<string | null>(
    null
  );

  public ALPHABET: string[] = [
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

  ngOnInit(): void {
    this.categorySvc.loadCategories();
  }

  private readonly sync: EffectRef = effect(
    (onCleanup: EffectCleanupRegisterFn) => {
      const q: string = this.text().trim();
      const delay: number = 300;
      const id: ReturnType<typeof setTimeout> = setTimeout(() => {
        this.drinkSvc.loadDrinks(q);
      }, delay);
      onCleanup(() => clearTimeout(id));
    }
  );

  // Maneja el click en un tag del alfabeto; permite deseleccionar si se vuelve a clicar
  public selectLetter(letter: string): void {
    this.selectedLetter.set(this.selectedLetter() === letter ? null : letter);
  }

  public toggleDarkMode(): void {
    const element: HTMLHtmlElement | null = document.querySelector('html');
    this.icon = this.icon === 'pi pi-moon' ? 'pi pi-sun' : 'pi pi-moon';
    element?.classList.toggle('p-dark');
  }
}
