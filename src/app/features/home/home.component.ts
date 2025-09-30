import { CommonModule } from '@angular/common';
import { Component, effect, EffectRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategorySliderComponent } from '@app/features/home/category-slider/category-slider.component';
import { DrinksTableConfigService } from '@app/features/home/configs/table-config';
import { IngredientsModalContentComponent } from '@app/features/home/ingredients-modal/ingredients-modal.component';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import { TableConfig } from '@shared/components/table/config/table-config';
import { TableComponent } from '@shared/components/table/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    TableComponent,
    ButtonModule,
    ModalComponent,
    CategorySliderComponent,
    IngredientsModalContentComponent,
  ],
})
export class HomeComponent {
  public cfgSvc: DrinksTableConfigService = inject(DrinksTableConfigService);
  private readonly router: Router = inject(Router);

  public data: Drink[] = [];
  public config: TableConfig<Drink> = this.cfgSvc.config();
  public resetTrigger: number = 0;

  private readonly sync: EffectRef = effect(() => {
    const c: TableConfig<Drink> = this.cfgSvc.config();
    this.config = c;
    this.data = c.data;
  });

  public onSelectFromSlider(d: Drink): void {
    this.cfgSvc.isCategoryModalOpen.set(false);
    void this.router.navigate(['drinks', d.idDrink]);
  }

  public onModalVisibleChange(val: boolean): void {
    this.cfgSvc.isCategoryModalOpen.set(val);
    if (!val) {
      this.resetTrigger++;
      this.cfgSvc.categoryDrinks.set([]);
      this.cfgSvc.categoryTitle.set('');
    }
  }
}
