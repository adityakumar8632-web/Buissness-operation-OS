import React from 'react';
import { Providers } from './providers';
import { AppShell } from '../layouts/AppShell';
import { Router } from '../routing/Router';

export function App() {
  return (
    <Providers>
      <AppShell>
        <Router />
      </AppShell>
    </Providers>
  );
}