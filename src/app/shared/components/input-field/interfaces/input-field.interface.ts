import { Signal, WritableSignal } from '@angular/core';

export interface InputFieldSelectConfig<T = unknown> {
  type: 'select';
  icon?: string;
  placeholder?: string;
  options: Signal<T[]>;
  optionLabel?: string;
  optionFilterBy?: string;
  showClear?: boolean;
  selected?: T | null;
}

export interface InputFieldMultiSelectConfig<T = unknown> {
  type: 'multi-select';
  icon?: string;
  placeholder?: string;
  options: Signal<T[]>;
  optionLabel?: string;
  optionFilterBy?: string;
  showClear?: boolean;
  selected?: T[];
}

export interface InputFieldTextConfig {
  type: 'text';
  icon?: string;
  placeholder?: string;
  model: WritableSignal<string>;
  disabled?: boolean;
}
