import { CommonModule } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './global-loading.component.html',
  styleUrl: './global-loading.component.scss',
})
export class GlobalLoadingComponent {
  private readonly loading: LoadingService = inject(LoadingService);
  public readonly isLoading: Signal<boolean> = this.loading.isLoading;
}
