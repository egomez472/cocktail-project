import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TableColumn, TableConfig } from './config/table-config';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, TooltipModule, CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class TableComponent<T = unknown> {
  @Input({ required: true }) config!: TableConfig<T>;

  selection: T | T[] | null = null;

  private asRecord(obj: unknown): Record<string, unknown> | undefined {
    if (obj !== null && typeof obj === 'object')
      return obj as Record<string, unknown>;
    return undefined;
  }

  getValue(row: T, field?: keyof T | string): unknown {
    if (!field) return row as unknown;
    // soporte a paths: "user.name"
    if (typeof field === 'string') {
      const keys = field.split('.');
      return keys.reduce<unknown>((acc, key) => {
        const rec = this.asRecord(acc);
        return rec ? rec[key] : undefined;
      }, row as unknown);
    }
    const rec = this.asRecord(row);
    return rec ? rec[String(field)] : undefined;
  }

  // Helpers de vista
  toDisplayString(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean')
      return String(value);
    return '';
  }

  toNumber(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const n = Number(value);
      return Number.isNaN(n) ? null : n;
    }
    return null;
  }

  toDateValue(value: unknown): string | number | Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') return value;
    return null;
  }

  getIconClass(col: TableColumn<T>, row: T): string {
    const v = col.icon?.class?.(row);
    if (typeof v === 'string' && v.length) return v;
    const raw = this.getValue(row, col.field);
    return this.toDisplayString(raw);
  }

  getIconTooltip(col: TableColumn<T>, row: T): string | undefined {
    const v = col.icon?.tooltip?.(row);
    return v || undefined;
  }

  getImageSrc(row: T, col: TableColumn<T>): string {
    const v = this.getValue(row, col.field);
    return this.toDisplayString(v);
  }

  getImageAlt(row: T, col: TableColumn<T>): string {
    if (col.image?.altField) {
      return this.toDisplayString(this.getValue(row, col.image.altField));
    }
    return this.getImageSrc(row, col);
  }

  getTagValue(col: TableColumn<T>, row: T): string | undefined {
    const v = col.badge?.value?.(row);
    if (v !== undefined) return v;
    const raw = this.getValue(row, col.field);
    const s = this.toDisplayString(raw);
    return s || undefined;
  }

  getTagSeverity(col: TableColumn<T>, row: T) {
    return col.badge?.severity?.(row);
  }

  onActionClick(actionIndex: number, row: T) {
    const action = this.config.actions?.[actionIndex];
    if (action && (!action.disabled || !action.disabled(row))) {
      action.onClick(row);
    }
  }

  isVisibleColumn(col: TableColumn<T>): boolean {
    return !col.hidden;
  }
}
