import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EffectRef,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { Drink } from '@core/services/drinks/interfaces/drink.interface';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: `./category-slider.component.html`,
})
export class CategorySliderComponent {
  // Inputs como signals
  public readonly drinks: InputSignal<Drink[]> = input<Drink[]>([]);
  public readonly resetTrigger: InputSignal<number> = input<number>(0);

  @Output() public selectCategory: EventEmitter<Drink> =
    new EventEmitter<Drink>();

  public page: number = 0;

  // Resetea la página cuando cambia resetTrigger
  private readonly sync: EffectRef = effect(() => {
    void this.resetTrigger();
    this.page = 0;
  });

  public onCarouselPage(event: { page?: number } | undefined): void {
    this.page = typeof event?.page === 'number' ? event.page : 0;
  }
}
