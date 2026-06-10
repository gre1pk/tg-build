import type { Fabric } from '@/data/types';

interface BuildOrderMessageOptions {
  comment?: string;
  fabric?: Pick<Fabric, 'name' | 'material' | 'color'> | null;
  hasPhoto: boolean;
}

export function buildOrderMessage({
  comment,
  fabric,
  hasPhoto,
}: BuildOrderMessageOptions): string {
  const lines = ['Здравствуйте! Хочу перетянуть мебель.'];

  if (fabric) {
    lines.push(`Ткань: ${fabric.name} (${fabric.material}, ${fabric.color}).`);
  }

  const trimmedComment = comment?.trim();
  if (trimmedComment) {
    lines.push(`Комментарий: ${trimmedComment}`);
  }

  if (hasPhoto) {
    lines.push('Фото мебели прикреплю к этому сообщению.');
  } else {
    lines.push('Фото мебели пришлю отдельным сообщением.');
  }

  return lines.join('\n');
}
