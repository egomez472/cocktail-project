import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Tag } from 'primeng/tag';

export interface IngredientItemVM {
  name: string;
  measure?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-ingredients-modal-content',
  standalone: true,
  imports: [CommonModule, ImageModule, Tag],
  templateUrl: './ingredients-modal.component.html',
})
export class IngredientsModalContentComponent {
  @Input() public items: IngredientItemVM[] = [];
}
