import { mockFabrics } from '@/data/mock/fabrics';
import type { DataRepository } from '@/data/repository';

export function createMockRepository(): DataRepository {
  return {
    async getFabrics() {
      await delay(300);
      return [...mockFabrics];
    },

    async getFabric(id: string) {
      await delay(200);
      return mockFabrics.find((f) => f.id === id) ?? null;
    },
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
