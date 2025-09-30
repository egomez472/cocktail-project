export interface Ingredient {
  strIngredient1: string;
}

export interface IngredientResponse {
  drinks: Ingredient[];
}

export interface IngredientState {
  ingredients: string[];
}
