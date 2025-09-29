import { CommonModule } from '@angular/common';
import { Component, effect, EffectRef, inject } from '@angular/core';
import { DrinksTableConfigService } from '@app/features/home/configs/table-config';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import { HeaderComponent } from '@shared/components/header/header';
import { TableConfig } from '@shared/components/table/config/table-config';
import { TableComponent } from '@shared/components/table/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CommonModule, TableComponent, ButtonModule, HeaderComponent],
})
export class HomeComponent {
  private cfgSvc: DrinksTableConfigService = inject(DrinksTableConfigService);

  public data: Drink[] = [];
  public config: TableConfig<Drink> = this.cfgSvc.config();

  private readonly sync: EffectRef = effect(() => {
    const c: TableConfig<Drink> = this.cfgSvc.config();
    this.config = c;
    this.data = c.data;
  });
}
