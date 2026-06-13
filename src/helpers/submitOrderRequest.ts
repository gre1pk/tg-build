import { createOrder } from '@/data/api/orderApi';
import type { Fabric } from '@/data/types';

interface SubmitOrderRequestOptions {
  photo: File | null;
  comment: string;
  fabric?: Pick<Fabric, 'id' | 'name' | 'material' | 'color'> | null;
}

function buildFabricSnapshot(fabric: Pick<Fabric, 'name' | 'material' | 'color'>): string {
  return `${fabric.name} · ${fabric.material}, ${fabric.color}`;
}

export async function submitOrderRequest({
  photo,
  comment,
  fabric,
}: SubmitOrderRequestOptions): Promise<void> {
  await createOrder({
    comment,
    photo,
    fabricId: fabric?.id,
    fabricSnapshot: fabric ? buildFabricSnapshot(fabric) : undefined,
  });
}
