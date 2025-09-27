import { TemplateRef } from '@angular/core';

export type TableFieldType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'image'
  | 'icon'
  | 'badge'
  | 'text-click'
  | 'custom';

export interface TableAction<T = unknown> {
  label?: string;
  icon?: string;
  severity?:
    | 'primary'
    | 'success'
    | 'info'
    | 'warn'
    | 'help'
    | 'danger'
    | 'secondary'
    | 'contrast';
  tooltip?: string;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface TableColumn<T = unknown> {
  header: string;
  field?: keyof T | string;
  type?: TableFieldType;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  format?: (value: unknown, row: T) => string;
  template?: TemplateRef<unknown>;
  image?: {
    width?: number | string;
    height?: number | string;
    rounded?: boolean;
    altField?: keyof T | string;
  };
  icon?: {
    class?: (row: T) => string;
    tooltip?: (row: T) => string | undefined;
  };
  badge?: {
    value?: (row: T) => string | undefined;
    severity?: (
      row: T
    ) =>
      | 'success'
      | 'info'
      | 'warn'
      | 'danger'
      | 'secondary'
      | 'contrast'
      | undefined;
    onClick?: (row: T) => void;
  };
  onClick?: (row: T) => void;
}

export interface TableConfig<T = unknown> {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  selectionMode?: 'single' | 'multiple' | 'none';
  rowStyleClass?: (row: T) => string | undefined;
  loading?: boolean;
  tableStyle?: Record<string, unknown>;
  paginator?: boolean;
  rows?: number;
  rowsPerPageOptions?: number[];
  showTotal?: boolean;
  otherTotal?: Array<{
    label: string;
    value: number;
  }>;
}
