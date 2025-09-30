import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EffectCleanupRegisterFn,
  EffectRef,
  inject,
  input,
  OnDestroy,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { FiltersService } from '@app/core/services/filters/filters.service';
import { CategoriesConfigService } from '@app/features/header/categories-config/categories-config';
import { IngredientsConfigService } from '@app/features/header/ingredients-config/ingredients-config';
import {
  InputFieldMultiSelectConfig,
  InputFieldSelectConfig,
  InputFieldTextConfig,
} from '@app/shared/components/input-field/interfaces/input-field.interface';
import { Category } from '@core/services/categories/interfaces/categories.interface';
import { DrinkService } from '@core/services/drinks/drink.service';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import { LoadingService } from '@core/services/loading/loading.service';
import { DrinkStore } from '@core/store/drink.store';
import { InputFieldComponent } from '@shared/components/input-field/input-field';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
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
  /*
   * Services
   */
  private readonly drinkStore: DrinkStore = inject(DrinkStore);
  private readonly filtersSvc: FiltersService = inject(FiltersService);
  private readonly ingredientsConfigSvc: IngredientsConfigService = inject(
    IngredientsConfigService
  );
  private readonly loadingSvc: LoadingService = inject(LoadingService);
  private readonly router: Router = inject(Router);
  private readonly drinkSvc: DrinkService = inject(DrinkService);

  /*
   * Vars
   */
  public text: WritableSignal<string> = signal<string>(
    this.filtersSvc.filters().name ?? ''
  );
  public icon: string = 'pi pi-sun';
  public selectedLetter: WritableSignal<string | null> = signal<string | null>(
    this.filtersSvc.filters().firstLetter
  );

  public readonly isLoading: Signal<boolean> = computed(() =>
    this.loadingSvc.isLoading()
  );

  public readonly isDetailRoute: WritableSignal<boolean> = signal<boolean>(
    this.router.url.startsWith('/drinks/')
  );

  private readonly routeSub: Subscription = this.router.events.subscribe(
    (e: unknown) => {
      if (e instanceof NavigationEnd) {
        this.isDetailRoute.set(e.urlAfterRedirects.startsWith('/drinks/'));
      }
    }
  );

  /*
   * Configs services
   */
  private categoryConfigSvc: CategoriesConfigService = inject(
    CategoriesConfigService
  );

  /*
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
      disabled: this.isLoading(),
    };
  }
  public selectedCategory: WritableSignal<Category | null> =
    signal<Category | null>(null);

  /*
   * Config input text
   */
  public get searchInputConfig(): InputFieldTextConfig {
    return {
      type: 'text',
      icon: 'pi pi-search',
      placeholder: 'Cocktail name...',
      model: this.text,
      disabled: this.drinkStore.disableNameInput() || this.isLoading(),
    };
  }

  /*
   * Config input multiselect
   */
  public get ingredientsMultiConfig(): InputFieldMultiSelectConfig<string> {
    return {
      ...this.ingredientsConfigSvc.ingredientsMultiBaseConfig,
      selected: this.filtersSvc.filters().ingredients,
      disabled: this.isLoading(),
    };
  }

  /*
   * Sincronización de signals
   */
  private readonly sync: EffectRef = effect(
    (onCleanup: EffectCleanupRegisterFn) => {
      const q: string = this.text().trim();
      const delay: number = 300;
      const id: ReturnType<typeof setTimeout> = setTimeout(() => {
        const letter: string | null = this.selectedLetter();
        this.drinkStore.setFirstLetter(letter);
        if (!letter && q) {
          this.drinkStore.setName(q);
        }
      }, delay);
      onCleanup(() => clearTimeout(id));
    }
  );

  /*
   * Inputs configurables
   */
  public readonly showFilters: Signal<boolean> = input<boolean>(true);
  public readonly showCategory: Signal<boolean> = input<boolean>(true);
  public readonly showIngredients: Signal<boolean> = input<boolean>(true);
  public readonly showSearch: Signal<boolean> = input<boolean>(true);

  /*
   * Methods
   */
  public onCategoryChange(category: Category | null): void {
    this.selectedCategory.set(category as Category);
    this.filtersSvc.updateFilters({ category: category?.strCategory ?? null });
  }

  public onIngredientsChange(values: string[] | null): void {
    this.filtersSvc.updateFilters({ ingredients: values ?? [] });
  }

  public selectLetter(letter: string): void {
    if (this.isLoading()) return;
    const next: string | null =
      this.selectedLetter() === letter ? null : letter;
    this.selectedLetter.set(next);
    this.drinkStore.setFirstLetter(next);
    this.text.set('');
  }

  public toggleDarkMode(): void {
    const element: HTMLHtmlElement | null = document.querySelector('html');
    this.icon = this.icon === 'pi pi-moon' ? 'pi pi-sun' : 'pi pi-moon';
    element?.classList.toggle('p-dark');
  }

  public goToRandomDrink(): void {
    if (this.isLoading()) return;
    const s: Subscription = this.drinkSvc
      .loadRandomDrink()
      .subscribe((d: Drink | null) => {
        const id: string | undefined = d?.idDrink;
        if (id) {
          void this.router.navigate(['/drinks', id]);
        }
        s.unsubscribe();
      });
  }

  /*
   * Lifecycle end
   */
  ngOnDestroy(): void {
    this.categoryConfigSvc.destroySvc();
    this.ingredientsConfigSvc.destroySvc();
    this.routeSub.unsubscribe();
  }
}
