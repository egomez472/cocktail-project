import { Drink } from '../../../interfaces/drink.interface';

export interface DrinkState {
  drinks: Drink[];
  totalAlcoholic: number;
  totalNonAlcoholic: number;
  total: number;
}
