import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Category,
  CategoryResponse,
  CategoryState,
} from '@core/services/categories/interfaces/categories.interface';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http: HttpClient = inject(HttpClient);
  private subscription: Subscription = new Subscription();

  public readonly categoryState: WritableSignal<CategoryState> =
    signal<CategoryState>({
      categories: [],
    });

  public readonly categories: Signal<Category[]> = computed(
    () => this.categoryState().categories
  );

  public getCategories(): Observable<CategoryResponse> {
    return this.http
      .get<CategoryResponse>(
        'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list'
      )
      .pipe(map((r: CategoryResponse) => r ?? []));
  }

  public loadCategories(): void {
    const fallback: CategoryState = {
      categories: [],
    };

    this.subscription.add(
      this.getCategories()
        .pipe(
          map((categories: CategoryResponse) => {
            return { categories: categories.drinks };
          }),
          catchError(() => of(fallback)),
          tap((state: CategoryState) => {
            this.categoryState.set(state);
          })
        )
        .subscribe()
    );
  }

  public destroyCategoriesSvc(): void {
    this.subscription.unsubscribe();
  }
}
