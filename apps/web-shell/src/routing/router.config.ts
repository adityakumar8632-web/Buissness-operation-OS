import { lazy } from 'react';

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any> | React.ComponentType<any>;
  requiredRoles?: string[];
  exact?: boolean;
}

// Simulating lazy-loaded modules for the showcase monolith
const DashboardView = lazy(() => Promise.resolve({ default: () => <div>Dashboard Module Placeholder</div> }));
const CRMView = lazy(() => Promise.resolve({ default: () => <div>CRM Module Placeholder</div> }));
const InventoryView = lazy(() => Promise.resolve({ default: () => <div>Inventory Module Placeholder</div> }));

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: DashboardView,
    exact: true,
  },
  {
    path: '/crm',
    component: CRMView,
    requiredRoles: ['Sales', 'Admin'],
  },
  {
    path: '/inventory',
    component: InventoryView,
    requiredRoles: ['Operations', 'Admin'],
  }
];