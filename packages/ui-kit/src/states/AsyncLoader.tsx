import React from 'react';

export const AsyncLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
    <div style={{
      width: '24px', height: '24px', borderRadius: '50%',
      border: '3px solid #f3f4f6', borderTopColor: '#2563eb',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px' }}>{message}</p>
  </div>
);