import { Drink } from '@core/services/drinks/interfaces/drink.interface';

export interface DrinkState {
  drinks: Drink[];
  totalAlcoholic: number;
  totalNonAlcoholic: number;
  total: number;
}
