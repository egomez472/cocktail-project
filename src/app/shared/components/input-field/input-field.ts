import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InputFieldMultiSelectConfig,
  InputFieldSelectConfig,
  InputFieldTextConfig,
} from '@shared/components/input-field/interfaces/input-field.interface';
import { InputFieldConfig } from '@shared/components/input-field/types/input-field.type';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FormsModule,
    Select,
    MultiSelect,
  ],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputFieldComponent<T = unknown> {
  @Input({ required: true }) public config!: InputFieldConfig<T>;

  public get textCfg(): InputFieldTextConfig {
    return this.config as InputFieldTextConfig;
  }

  public get selectCfg(): InputFieldSelectConfig<T> {
    return this.config as InputFieldSelectConfig<T>;
  }

  public get multiSelectCfg(): InputFieldMultiSelectConfig<T> {
    return this.config as InputFieldMultiSelectConfig<T>;
  }

  @Output() public selectedChange: EventEmitter<T | null | T[]> =
    new EventEmitter<T | null | T[]>();

  public onSelectChange(val: T | null): void {
    this.selectedChange.emit(val);
  }

  public onMultiSelectChange(val: T[] | null): void {
    this.selectedChange.emit(val ?? []);
  }
}
