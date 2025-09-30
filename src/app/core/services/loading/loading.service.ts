import {
  computed,
  effect,
  EffectRef,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly counter: WritableSignal<number> = signal(0);

  public readonly isLoading: Signal<boolean> = computed(
    () => this.counter() > 0
  );

  public start(): void {
    this.counter.update((c: number) => c + 1);
  }

  public stop(): void {
    this.counter.update((c: number) => Math.max(0, c - 1));
  }

  public reset(): void {
    this.counter.set(0);
  }

  public waitUntilIdle(): Promise<void> {
    if (!this.isLoading()) return Promise.resolve();
    return new Promise<void>((resolve: () => void) => {
      const ref: EffectRef = effect(() => {
        if (!this.isLoading()) {
          ref.destroy();
          resolve();
        }
      });
    });
  }
}
