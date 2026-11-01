import { lazy } from 'react';

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any> | React.ComponentType<any>;
  requiredRoles?: string[];
  exact?: boolean;
}

const DashboardView = lazy(() =>
  Promise.resolve({ default: () => <div>Dashboard Module Placeholder</div> })
);

const CRMView = lazy(() => import('../modules/CRMModule'));
const InventoryView = lazy(() => import('../modules/InventoryModule'));

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
  },
];
