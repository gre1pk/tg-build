import { env } from '@/config/env';
import { createApiRepository } from '@/data/api/apiRepository';
import { createMockRepository } from '@/data/mock/mockRepository';
import type { DataRepository } from '@/data/repository';

export function createRepository(): DataRepository {
  if (env.useMockData) {
    return createMockRepository();
  }
  return createApiRepository();
}
