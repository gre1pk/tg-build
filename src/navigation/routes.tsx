import type { ComponentType } from 'react';

import { AdminFabricFormPage } from '@/pages/admin/AdminFabricFormPage';
import { AdminFabricsPage } from '@/pages/admin/AdminFabricsPage';
import { AdminHomePage } from '@/pages/admin/AdminHomePage';
import { AdminPortfolioFormPage } from '@/pages/admin/AdminPortfolioFormPage';
import { AdminPortfolioPage } from '@/pages/admin/AdminPortfolioPage';
import { FabricDetailPage } from '@/pages/FabricDetailPage/FabricDetailPage';
import { FabricsPage } from '@/pages/FabricsPage/FabricsPage';
import { HomePage } from '@/pages/HomePage/HomePage';
import { OrderRequestPage } from '@/pages/OrderRequestPage/OrderRequestPage';

interface Route {
  path: string;
  Component: ComponentType;
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
  { path: '/fabrics', Component: FabricsPage },
  { path: '/fabrics/:id', Component: FabricDetailPage },
  { path: '/order', Component: OrderRequestPage },
  { path: '/admin', Component: AdminHomePage },
  { path: '/admin/fabrics', Component: AdminFabricsPage },
  { path: '/admin/fabrics/new', Component: AdminFabricFormPage },
  { path: '/admin/fabrics/:id/edit', Component: AdminFabricFormPage },
  { path: '/admin/portfolio', Component: AdminPortfolioPage },
  { path: '/admin/portfolio/new', Component: AdminPortfolioFormPage },
  { path: '/admin/portfolio/:id/edit', Component: AdminPortfolioFormPage },
];
