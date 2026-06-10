import type { Fabric } from '@/data/types';
import type { DataRepository } from '@/data/repository';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function createApiRepository(): DataRepository {
  return {
    async getFabrics() {
      return fetchJson<Fabric[]>('/api/fabrics');
    },

    async getFabric(id: string) {
      try {
        return await fetchJson<Fabric>(`/api/fabrics/${encodeURIComponent(id)}`);
      } catch {
        return null;
      }
    },
  };
}
