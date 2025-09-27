import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public text1: string | undefined;
  public icon = 'pi pi-moon';

  toggleDarkMode() {
    const element = document.querySelector('html');
    this.icon = this.icon === 'pi pi-moon' ? 'pi pi-sun' : 'pi pi-moon';
    element?.classList.toggle('p-dark');
  }
}
