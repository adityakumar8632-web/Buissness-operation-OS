import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={drawerStyles.overlay}>
      <div style={drawerStyles.backdrop} onClick={onClose} aria-hidden="true" />
      <div style={drawerStyles.drawer}>
        <div style={drawerStyles.header}>
          <span style={drawerStyles.title}>Menu</span>
          <button onClick={onClose} style={drawerStyles.closeButton} aria-label="Close menu">✕</button>
        </div>
        <div style={drawerStyles.content}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

const drawerStyles = {
  overlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: 'flex' },
  backdrop: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  drawer: { position: 'relative' as const, width: '280px', height: '100%', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' as const, boxShadow: '2px 0 8px rgba(0,0,0,0.1)' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #e5e7eb' },
  title: { fontWeight: 'bold', fontSize: '16px' },
  closeButton: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' },
  content: { flex: 1, overflowY: 'auto' as const }
};