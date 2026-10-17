import React from 'react';

// In a full implementation, these would be driven by the route registry and user permissions.
const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'crm', label: 'CRM & Sales', icon: '🤝' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'finance', label: 'Finance', icon: '💵' },
  { id: 'workforce', label: 'Workforce', icon: '👥' },
];

export function Sidebar() {
  return (
    <aside className="app-sidebar" style={sidebarStyles.container}>
      <nav style={sidebarStyles.nav}>
        <ul style={sidebarStyles.list}>
          {MODULES.map((mod) => (
            <li key={mod.id} style={sidebarStyles.listItem}>
              <a href={`/${mod.id}`} style={sidebarStyles.link}>
                <span style={sidebarStyles.icon}>{mod.icon}</span>
                <span className="sidebar-label">{mod.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

const sidebarStyles = {
  container: {
    width: '240px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid var(--color-neutral-200, #e5e7eb)',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'width 0.2s',
  },
  nav: { padding: '16px 8px', flex: 1, overflowY: 'auto' as const },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '4px' },
  listItem: { width: '100%' },
  link: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#4b5563', transition: 'background 0.1s' },
  icon: { fontSize: '18px' },
};