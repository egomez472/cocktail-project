import { CommonModule, Location } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LanguageConfigService } from '@app/features/drink-detail/language-config/language-config';
import { CategoriesConfigService } from '@app/features/header/categories-config/categories-config';
import { DrinkService } from '@core/services/drinks/drink.service';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import { LanguageOption } from '@core/services/language/interfaces/language.interface';
import { LanguageService } from '@core/services/language/language.service';
import { DrinkStore } from '@core/store/drink.store';
import { InputFieldComponent } from '@shared/components/input-field/input-field';
import { InputFieldSelectConfig } from '@shared/components/input-field/interfaces/input-field.interface';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-drink-detail',
  standalone: true,
  imports: [CommonModule, Card, Tag, ButtonModule, InputFieldComponent],
  templateUrl: './drink-detail.component.html',
})
export class DrinkDetailComponent implements OnInit, OnDestroy {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly location: Location = inject(Location);
  private readonly drinkSvc: DrinkService = inject(DrinkService);
  private readonly drinkStore: DrinkStore = inject(DrinkStore);
  public readonly langSvc: LanguageService = inject(LanguageService);
  private readonly langCfg: LanguageConfigService = inject(
    LanguageConfigService
  );
  private sub: Subscription = new Subscription();

  public letters: string[] = CategoriesConfigService.ALPHABET;

  public readonly id: Signal<string> = computed(
    () => this.route.snapshot.paramMap.get('id') ?? ''
  );

  public drink: Drink | null = null;
  public loading: boolean = true;

  ngOnInit(): void {
    const routeSub: Subscription = this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.drink = null;
        }),
        switchMap((pm: ParamMap): Observable<Drink | null> => {
          const id: string | null = pm.get('id');
          if (!id) return of(null);
          return this.drinkSvc.loadDrinkById(id);
        })
      )
      .subscribe((d: Drink | null) => {
        this.drink = d;
        this.loading = false;
      });
    this.sub.add(routeSub);
  }

  public get languageSelectConfig(): InputFieldSelectConfig<LanguageOption> {
    const selected: LanguageOption | null =
      this.langSvc
        .options()
        .find((o: LanguageOption) => o.code === this.langSvc.selected()) ||
      null;
    return {
      ...this.langCfg.languageSelectBaseConfig,
      selected,
    } as InputFieldSelectConfig<LanguageOption>;
  }

  public onLanguageChange(option: LanguageOption | null): void {
    if (option) this.langSvc.setLang(option.code);
  }

  public get instructions(): string {
    if (!this.drink) return '';
    return this.drinkStore.getInstructionByLanguage(
      this.drink,
      this.langSvc.selected()
    );
  }

  public ingredients(d: Drink): { ingredient: string; measure?: string }[] {
    return this.drinkStore.ingredientsWithMeasures(d);
  }

  public goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      void this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
