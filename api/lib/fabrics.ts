import fabricsData from '../../data/fabrics.json';

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

export function loadFabrics(): FabricRecord[] {
  return fabricsData as FabricRecord[];
}

export function getFabricById(id: string): FabricRecord | null {
  return loadFabrics().find((fabric) => fabric.id === id) ?? null;
}
