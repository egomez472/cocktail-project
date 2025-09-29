import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  TableAction,
  TableColumn,
  TableConfig,
} from '@app/shared/components/table/config/table-config';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    CommonModule,
    CardModule,
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class TableComponent<T = unknown> {
  @Input({ required: true }) public config!: TableConfig<T>;

  public selection: T | T[] | null = null;

  private asRecord(obj: unknown): Record<string, unknown> | undefined {
    if (obj !== null && typeof obj === 'object')
      return obj as Record<string, unknown>;
    return undefined;
  }

  public getValue(row: T, field?: keyof T | string): unknown {
    if (!field) return row as unknown;
    if (typeof field === 'string') {
      const keys: string[] = field.split('.');
      return keys.reduce<unknown>((acc: unknown, key: string) => {
        const rec: Record<string, unknown> | undefined = this.asRecord(acc);
        return rec ? rec[key] : undefined;
      }, row as unknown);
    }
    const rec: Record<string, unknown> | undefined = this.asRecord(row);
    return rec ? rec[String(field)] : undefined;
  }

  public toDisplayString(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean')
      return String(value);
    return '';
  }

  public toNumber(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const n: number = Number(value);
      return Number.isNaN(n) ? null : n;
    }
    return null;
  }

  public toDateValue(value: unknown): string | number | Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') return value;
    return null;
  }

  public getIconClass(col: TableColumn<T>, row: T): string {
    const v: string | undefined = col.icon?.class?.(row);
    if (typeof v === 'string' && v.length) return v;
    const raw: unknown = this.getValue(row, col.field);
    return this.toDisplayString(raw);
  }

  public getIconTooltip(col: TableColumn<T>, row: T): string | undefined {
    const v: string | undefined = col.icon?.tooltip?.(row);
    return v || undefined;
  }

  public getImageSrc(row: T, col: TableColumn<T>): string {
    const v: unknown = this.getValue(row, col.field);
    return this.toDisplayString(v);
  }

  public getImageAlt(row: T, col: TableColumn<T>): string {
    if (col.image?.altField) {
      return this.toDisplayString(this.getValue(row, col.image.altField));
    }
    return this.getImageSrc(row, col);
  }

  public getTagValue(col: TableColumn<T>, row: T): string | undefined {
    const v: string | undefined = col.badge?.value?.(row);
    if (v !== undefined) return v;
    const raw: unknown = this.getValue(row, col.field);
    const s: string = this.toDisplayString(raw);
    return s || undefined;
  }

  public getTagSeverity(
    col: TableColumn<T>,
    row: T
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | null
    | undefined {
    return col.badge?.severity?.(row);
  }

  public onActionClick(actionIndex: number, row: T): void {
    const action: TableAction<T> | undefined =
      this.config.actions?.[actionIndex];
    if (action && (!action.disabled || !action.disabled(row))) {
      action.onClick(row);
    }
  }

  public isVisibleColumn(col: TableColumn<T>): boolean {
    return !col.hidden;
  }
}
