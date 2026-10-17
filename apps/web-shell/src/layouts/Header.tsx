import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="app-header" style={headerStyles.container}>
      <div style={headerStyles.leftSection}>
        <button 
          onClick={onMenuClick} 
          style={headerStyles.menuButton}
          aria-label="Open mobile menu"
        >
          ☰
        </button>
        <div style={headerStyles.logo}>Business OS</div>
      </div>

      <div style={headerStyles.searchSection}>
        <input 
          type="text" 
          placeholder="Global search..." 
          style={headerStyles.searchInput} 
        />
      </div>

      <div style={headerStyles.rightSection}>
        <button style={headerStyles.iconButton} aria-label="Notifications">
          🔔
        </button>
        <div style={headerStyles.avatar} aria-label="User profile">
          US
        </div>
      </div>
    </header>
  );
}

const headerStyles = {
  container: {
    height: '64px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--color-neutral-200, #e5e7eb)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 10,
  },
  leftSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  menuButton: { display: 'block', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  logo: { fontWeight: 'bold', fontSize: '18px', color: 'var(--color-primary-900, #111827)' },
  searchSection: { flex: 1, maxWidth: '400px', margin: '0 24px' },
  searchInput: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' },
  rightSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  iconButton: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }
};