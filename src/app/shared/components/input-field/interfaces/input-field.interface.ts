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
  disabled?: boolean;
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
  disabled?: boolean;
}

export interface InputFieldTextConfig {
  type: 'text';
  icon?: string;
  placeholder?: string;
  model: WritableSignal<string>;
  disabled?: boolean;
}
