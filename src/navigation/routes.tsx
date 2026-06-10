import type { ComponentType } from 'react';

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
];
