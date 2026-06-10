import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface FabricRecord {
  id: string;
  name: string;
  material: string;
  color: string;
  pricePerMeter: number;
  imageUrl: string;
  description?: string;
  petFriendly?: boolean;
}

let cachedFabrics: FabricRecord[] | null = null;

export function loadFabrics(): FabricRecord[] {
  if (cachedFabrics) {
    return cachedFabrics;
  }

  const filePath = join(process.cwd(), 'data', 'fabrics.json');
  const raw = readFileSync(filePath, 'utf8');
  cachedFabrics = JSON.parse(raw) as FabricRecord[];
  return cachedFabrics;
}

export function getFabricById(id: string): FabricRecord | null {
  return loadFabrics().find((fabric) => fabric.id === id) ?? null;
}
