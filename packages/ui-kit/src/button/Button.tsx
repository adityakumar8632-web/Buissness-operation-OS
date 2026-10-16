import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'solid', size = 'md', isLoading, disabled, className = '', ...props }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      isLoading ? styles.loading : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} disabled={disabled || isLoading} {...props}>
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}
        <span className={styles.content}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';