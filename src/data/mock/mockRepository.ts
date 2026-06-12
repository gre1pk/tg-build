import { mockFabrics } from '@/data/mock/fabrics';
import { mockPortfolio } from '@/data/mock/portfolio';
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

    async getPortfolio() {
      await delay(200);
      return [...mockPortfolio];
    },
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
