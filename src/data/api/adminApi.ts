import { getAuthToken } from '@/auth/session';
import type { Fabric, PortfolioItem, StaffMeResponse } from '@/data/types';

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

export type { StaffMeResponse } from '@/data/types';

export async function fetchAdminMe(): Promise<StaffMeResponse> {
  return adminFetch<StaffMeResponse>('/api/admin/me');
}

export async function uploadAdminImage(
  bucket: 'fabric-images' | 'portfolio-images',
  file: File,
): Promise<string> {
  const dataBase64 = await fileToBase64(file);
  const result = await adminFetch<{ url: string }>('/api/admin/upload', {
    method: 'POST',
    body: JSON.stringify({
      bucket,
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
      dataBase64,
    }),
  });
  return result.url;
}

export type FabricInput = Omit<Fabric, 'id'>;

export async function createFabric(input: FabricInput): Promise<Fabric> {
  return adminFetch<Fabric>('/api/admin/fabrics', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateFabric(id: string, input: FabricInput): Promise<Fabric> {
  return adminFetch<Fabric>(`/api/admin/fabrics/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deleteFabric(id: string): Promise<void> {
  await adminFetch(`/api/admin/fabrics/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export type PortfolioInput = Omit<PortfolioItem, 'id'>;

export async function createPortfolioItem(input: PortfolioInput): Promise<PortfolioItem> {
  return adminFetch<PortfolioItem>('/api/admin/portfolio', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updatePortfolioItem(
  id: string,
  input: PortfolioInput,
): Promise<PortfolioItem> {
  return adminFetch<PortfolioItem>(`/api/admin/portfolio/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deletePortfolioItem(id: string): Promise<void> {
  await adminFetch(`/api/admin/portfolio/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Не удалось прочитать файл'));
        return;
      }
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error('Неверный формат файла'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
}
