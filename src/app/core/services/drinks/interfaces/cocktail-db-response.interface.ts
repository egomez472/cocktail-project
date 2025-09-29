import { Drink } from '@core/services/drinks/interfaces/drink.interface';

export interface CocktailDbResponse {
  drinks: Drink[] | null;
}
