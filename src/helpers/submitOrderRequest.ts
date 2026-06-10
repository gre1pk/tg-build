import { buildOrderMessage } from '@/helpers/buildOrderMessage';
import { openMasterContact } from '@/helpers/openMasterContact';
import type { Fabric } from '@/data/types';

export type OrderSubmitResult = 'shared' | 'telegram';

interface SubmitOrderRequestOptions {
  photo: File | null;
  comment: string;
  fabric?: Pick<Fabric, 'name' | 'material' | 'color'> | null;
}

export async function submitOrderRequest({
  photo,
  comment,
  fabric,
}: SubmitOrderRequestOptions): Promise<OrderSubmitResult> {
  const message = buildOrderMessage({
    comment,
    fabric,
    hasPhoto: photo !== null,
  });

  if (photo && typeof navigator.share === 'function') {
    try {
      const shareData: ShareData = { text: message, files: [photo] };
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return 'shared';
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
    }
  }

  openMasterContact(message);
  return 'telegram';
}
