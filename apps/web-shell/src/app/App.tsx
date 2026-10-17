import React from 'react';
import { Providers } from './Providers';
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