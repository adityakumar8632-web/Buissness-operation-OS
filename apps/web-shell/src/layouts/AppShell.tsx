import React, { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { PageContainer } from './PageContainer';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen((prev) => !prev);
  };

  return (
    <div className="app-shell-layout" style={shellStyles.layout}>
      <Header onMenuClick={toggleMobileDrawer} />
      
      <div className="app-shell-body" style={shellStyles.body}>
        <Sidebar />
        
        <main className="app-shell-main" style={shellStyles.main}>
          <PageContainer>
            {children}
          </PageContainer>
        </main>
      </div>

      {isMobileDrawerOpen && (
        <MobileDrawer 
          isOpen={isMobileDrawerOpen} 
          onClose={() => setIsMobileDrawerOpen(false)} 
        />
      )}
    </div>
  );
}

const shellStyles = {
  layout: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'var(--color-neutral-50, #f9fafb)',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflowY: 'auto' as const,
    position: 'relative' as const,
  }
};