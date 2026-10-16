import React from 'react';
import styles from './Table.module.css';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.pagination}>
      <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  );
};