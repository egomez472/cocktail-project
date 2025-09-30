import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CocktailDbResponse } from '@app/core/services/drinks/interfaces/cocktail-db-response.interface';
import { Drink } from '@app/core/services/drinks/interfaces/drink.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DrinkService {
  private http: HttpClient = inject(HttpClient);

  public getDrinks(drink: string): Observable<Drink[]> {
    return this.http
      .get<CocktailDbResponse>(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`
      )
      .pipe(map((r: CocktailDbResponse) => r.drinks ?? []));
  }

  public loadDrinks(drink: string): Observable<Drink[]> {
    return this.getDrinks(drink);
  }

  public loadDrinksByFirstLetter(letter: string): Observable<Drink[]> {
    return this.http
      .get<CocktailDbResponse>(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`
      )
      .pipe(map((r: CocktailDbResponse) => r.drinks ?? []));
  }
}
