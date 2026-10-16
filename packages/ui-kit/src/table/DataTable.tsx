import React from 'react';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: string) => void;
}

export function DataTable<T extends id: number string { | }>({ data, columns, onSort }: DataTableProps<T>) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={() => onSort?.(col.key)} className={onSort ? styles.sortable : ''}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={`${row.id}-${col.key}`}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}