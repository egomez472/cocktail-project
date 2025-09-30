import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  OnDestroy,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Ingredient,
  IngredientResponse,
  IngredientState,
} from '@core/services/ingredients/interfaces/ingredients.interface';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IngredientsService implements OnDestroy {
  private http: HttpClient = inject(HttpClient);
  private subscription: Subscription = new Subscription();

  public readonly state: WritableSignal<IngredientState> =
    signal<IngredientState>({ ingredients: [] });
  public readonly ingredients: Signal<string[]> = computed(
    () => this.state().ingredients
  );

  public getIngredients(): Observable<string[]> {
    return this.http
      .get<IngredientResponse>(
        'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'
      )
      .pipe(
        map((r: IngredientResponse) =>
          (r.drinks ?? [])
            .map((d: Ingredient) => d.strIngredient1)
            .filter(Boolean)
        )
      );
  }

  public loadIngredients(): void {
    const fallback: IngredientState = { ingredients: [] };
    this.subscription.add(
      this.getIngredients()
        .pipe(
          catchError(() => of<string[]>([])),
          tap((list: string[]) => this.state.set({ ingredients: list })),
          catchError(() => of(fallback.ingredients))
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
