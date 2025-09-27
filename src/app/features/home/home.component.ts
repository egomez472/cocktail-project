import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Drink } from '../../core/interfaces/drink.interface';
import { DrinkService } from '../../core/services/drinks/drink.service';
import { Header } from '../../shared/components/header/header';
import { TableConfig } from '../../shared/components/table/config/table-config';
import { TableComponent } from '../../shared/components/table/table';
import { DrinksTableConfigService } from './configs/table-config';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CommonModule, TableComponent, ButtonModule, Header],
})
export class HomeComponent implements OnInit {
  private drinkSvc: DrinkService = inject(DrinkService);
  private cfgSvc = inject(DrinksTableConfigService);

  data: Drink[] = [];
  config: TableConfig<Drink> = this.cfgSvc.config();

  ngOnInit(): void {
    this.drinkSvc.loadDrinks();
  }

  private readonly sync = effect(() => {
    const c = this.cfgSvc.config();
    this.config = c;
    this.data = c.data;
  });
}
