import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="page-container" style={containerStyles.wrapper}>
      <div style={containerStyles.inner}>
        {title && <h1 style={containerStyles.title}>{title}</h1>}
        <div style={containerStyles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const containerStyles = {
  wrapper: {
    width: '100%',
    height: '100%',
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: '1200px', // Standardizing max-width bounds[cite: 3]
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--color-neutral-900, #111827)',
    margin: 0,
  },
  content: {
    flex: 1,
  }
};