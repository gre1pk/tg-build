import type { Fabric, PortfolioItem } from '@/data/types';

export interface DataRepository {
  getFabrics(): Promise<Fabric[]>;
  getFabric(id: string): Promise<Fabric | null>;
  getPortfolio(): Promise<PortfolioItem[]>;
}
