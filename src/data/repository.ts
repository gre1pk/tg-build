import type { Fabric } from '@/data/types';

export interface DataRepository {
  getFabrics(): Promise<Fabric[]>;
  getFabric(id: string): Promise<Fabric | null>;
}
