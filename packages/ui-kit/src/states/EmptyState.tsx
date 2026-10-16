import React from 'react';
import { Button } from '../button/Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionText, onAction }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
    <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>{title}</h3>
    <p style={{ margin: '0 0 24px 0', color: '#6b7280' }}>{description}</p>
    {actionText && onAction && (
      <Button onClick="{onAction}">{actionText}</Button>
    )}
  </div>
);