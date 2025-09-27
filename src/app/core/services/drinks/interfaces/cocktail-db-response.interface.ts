import { Drink } from '../../../interfaces/drink.interface';

export interface CocktailDbResponse {
  drinks: Drink[] | null;
}
