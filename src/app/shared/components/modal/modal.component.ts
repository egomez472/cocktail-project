import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';

export interface ModalConfig {
  header?: string;
  width?: string;
  closable?: boolean;
  dismissableMask?: boolean;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, Dialog],
  templateUrl: `./modal.component.html`,
})
export class ModalComponent {
  public readonly config: InputSignal<ModalConfig | undefined> = input<
    ModalConfig | undefined
  >(undefined);
  public readonly visible: InputSignal<boolean> = input<boolean>(false);

  @Output() public visibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public emitVisible(val: boolean): void {
    this.visibleChange.emit(val);
  }
}
