import { getAuthToken } from '@/auth/session';

export interface CreateOrderInput {
  comment: string;
  photo: File | null;
  fabricId?: string;
  fabricSnapshot?: string;
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  createdAt: string;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Нужна авторизация. Откройте приложение через Telegram.');
  }

  const body: Record<string, unknown> = {
    comment: input.comment.trim(),
  };

  if (input.fabricId) {
    body.fabricId = input.fabricId;
  }
  if (input.fabricSnapshot) {
    body.fabricSnapshot = input.fabricSnapshot;
  }
  if (input.photo) {
    body.photo = {
      fileName: input.photo.name,
      contentType: input.photo.type || 'application/octet-stream',
      dataBase64: await fileToBase64(input.photo),
    };
  }

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as CreateOrderResponse & {
    error?: string;
  };

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Нужна авторизация. Откройте приложение через Telegram.');
    }
    if (response.status === 400) {
      throw new Error(data.error ?? 'Добавьте фото или комментарий.');
    }
    throw new Error('Не удалось сохранить заявку. Попробуйте позже.');
  }

  return data;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Не удалось прочитать файл'));
        return;
      }
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error('Неверный формат файла'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
}
