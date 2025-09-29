import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CocktailDbResponse } from '@app/core/services/drinks/interfaces/cocktail-db-response.interface';
import { Drink } from '@app/core/services/drinks/interfaces/drink.interface';
import { DrinkState } from '@core/services/drinks/interfaces/drink-state.interface';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrinkService {
  private http: HttpClient = inject(HttpClient);
  private subscription: Subscription = new Subscription();
  public drinkState: WritableSignal<DrinkState> = signal<DrinkState>({
    drinks: [],
    totalAlcoholic: 0,
    totalNonAlcoholic: 0,
    total: 0,
  });

  // Señales derivadas para consumo directo desde componentes/plantillas
  public readonly drinks: Signal<Drink[]> = computed(
    () => this.drinkState().drinks
  );
  public readonly totalAlcoholic: Signal<number> = computed(
    () => this.drinkState().totalAlcoholic
  );
  public readonly totalNonAlcoholic: Signal<number> = computed(
    () => this.drinkState().totalNonAlcoholic
  );
  public readonly total: Signal<number> = computed(
    () => this.drinkState().total
  );

  public getDrinks(drink: string): Observable<Drink[]> {
    return this.http
      .get<CocktailDbResponse>(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`
      )
      .pipe(map((r: CocktailDbResponse) => r.drinks ?? []));
  }

  public loadDrinks(drink: string): void {
    const fallback: DrinkState = {
      drinks: [],
      totalAlcoholic: 0,
      totalNonAlcoholic: 0,
      total: 0,
    };

    this.subscription.add(
      this.getDrinks(drink)
        .pipe(
          map((drinks: Drink[]) => {
            return this.handleDrinkInformation(drinks);
          }),
          catchError(() => of(fallback)),
          tap((state: DrinkState) => this.drinkState.set(state))
        )
        .subscribe()
    );
  }

  private handleDrinkInformation(drinks: Drink[]): DrinkState {
    const totalAlcoholic: number = drinks.filter(
      (d: Drink) => d.strAlcoholic === 'Alcoholic'
    ).length;
    const totalNonAlcoholic: number = drinks.filter(
      (d: Drink) => d.strAlcoholic === 'Non alcoholic'
    ).length;
    return {
      drinks,
      totalAlcoholic,
      totalNonAlcoholic,
      total: drinks.length,
    } as DrinkState;
  }
}
