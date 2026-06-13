import { getAuthToken } from '@/auth/session';
import type { Order, OrderStatus } from '@/data/types';

async function adminFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Нужна авторизация');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...init, headers });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  return body;
}

export async function fetchAdminOrders(statuses?: OrderStatus[]): Promise<Order[]> {
  const query =
    statuses && statuses.length > 0
      ? `?status=${encodeURIComponent(statuses.join(','))}`
      : '';
  return adminFetch<Order[]>(`/api/admin/orders${query}`);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return adminFetch<Order>(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteOrderPhoto(id: string): Promise<Order> {
  return adminFetch<Order>(`/api/admin/orders/${encodeURIComponent(id)}/photo`, {
    method: 'DELETE',
  });
}
