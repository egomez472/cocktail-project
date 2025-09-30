import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/features/header/header.component';
import { GlobalLoadingComponent } from '@shared/components/global-loading/global-loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [RouterOutlet, GlobalLoadingComponent, HeaderComponent],
})
export class AppComponent {}
