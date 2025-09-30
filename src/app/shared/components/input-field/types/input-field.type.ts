import {
  InputFieldMultiSelectConfig,
  InputFieldSelectConfig,
  InputFieldTextConfig,
} from '@shared/components/input-field/interfaces/input-field.interface';

export type InputFieldType = 'text' | 'select' | 'multi-select';

export type InputFieldConfig<T = unknown> =
  | InputFieldTextConfig
  | InputFieldSelectConfig<T>
  | InputFieldMultiSelectConfig<T>;
