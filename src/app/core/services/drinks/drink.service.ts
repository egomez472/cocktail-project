import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Drink } from '../../interfaces/drink.interface';
import { CocktailDbResponse } from './interfaces/cocktail-db-response.interface';
import { DrinkState } from './interfaces/drink-state.interface';

@Injectable({
  providedIn: 'root',
})
export class DrinkService {
  private http: HttpClient = inject(HttpClient);
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

  public getDrinks(): Observable<Drink[]> {
    return this.http
      .get<CocktailDbResponse>(
        'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a'
      )
      .pipe(map((r) => r.drinks ?? []));
  }

  public loadDrinks(): void {
    const fallback: DrinkState = {
      drinks: [],
      totalAlcoholic: 0,
      totalNonAlcoholic: 0,
      total: 0,
    };

    this.getDrinks()
      .pipe(
        map((drinks) => {
          const totalAlcoholic = drinks.filter(
            (d) => d.strAlcoholic === 'Alcoholic'
          ).length;
          const totalNonAlcoholic = drinks.filter(
            (d) => d.strAlcoholic === 'Non alcoholic'
          ).length;
          return {
            drinks,
            totalAlcoholic,
            totalNonAlcoholic,
            total: drinks.length,
          } as DrinkState;
        }),
        catchError(() => of(fallback)),
        tap((state) => this.drinkState.set(state))
      )
      .subscribe();
  }
}
