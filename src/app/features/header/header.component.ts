import {
  Component,
  effect,
  EffectCleanupRegisterFn,
  EffectRef,
  inject,
  OnDestroy,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriesConfigService } from '@app/features/header/categories-config/categories-config';
import {
  InputFieldSelectConfig,
  InputFieldTextConfig,
} from '@app/shared/components/input-field/interfaces/input-field.interface';
import { Category } from '@core/services/categories/interfaces/categories.interface';
import { DrinkService } from '@core/services/drinks/drink.service';
import { InputFieldComponent } from '@shared/components/input-field/input-field';
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
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {
  /**
   * Services
   */
  private drinkSvc: DrinkService = inject(DrinkService);

  /**
   * Vars
   */
  public text: WritableSignal<string> = signal<string>('');
  public icon: string = 'pi pi-sun';
  public selectedLetter: WritableSignal<string | null> = signal<string | null>(
    null
  );

  /**
   * Configs serives
   */
  private categoryConfigSvc: CategoriesConfigService = inject(
    CategoriesConfigService
  );

  /**
   * Category config
   */
  public letters: string[] = CategoriesConfigService.ALPHABET;

  public readonly categories: Signal<Category[]> =
    this.categoryConfigSvc.categories;

  public categorySelectBaseConfig: Omit<
    InputFieldSelectConfig<Category>,
    'selected'
  > = this.categoryConfigSvc.categorySelectBaseConfig;

  public get categorySelectConfig(): InputFieldSelectConfig<Category> {
    return {
      ...this.categorySelectBaseConfig,
      selected: this.selectedCategory(),
    };
  }
  public selectedCategory: WritableSignal<Category | null> =
    signal<Category | null>(null);

  /**
   * Config input text
   */
  public searchInputConfig: InputFieldTextConfig = {
    type: 'text',
    icon: 'pi pi-search',
    placeholder: 'Cocktail name...',
    model: this.text,
  };

  /**
   * Sincronización de signals
   */
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

  /**
   * Methods
   */
  public onCategoryChange(category: Category | null): void {
    this.selectedCategory.set(category as Category);
    /**
     * @TODO aca se va a llamar al service con el filtro de categoria
     */
  }

  public selectLetter(letter: string): void {
    this.selectedLetter.set(this.selectedLetter() === letter ? null : letter);
    /**
     * @TODO aca se va a llamar al service con el filtro de primer letra
     */
  }

  public toggleDarkMode(): void {
    const element: HTMLHtmlElement | null = document.querySelector('html');
    this.icon = this.icon === 'pi pi-moon' ? 'pi pi-sun' : 'pi pi-moon';
    element?.classList.toggle('p-dark');
  }

  /**
   * Lifecycle end
   */
  ngOnDestroy(): void {
    this.categoryConfigSvc.destroySvc();
  }
}
