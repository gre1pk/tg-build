import { createHmac, timingSafeEqual } from 'node:crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface ValidatedInitData {
  user: TelegramUser;
  authDate: number;
  queryId?: string;
  chatInstance?: string;
  chatType?: string;
}

export function validateInitData(initData: string, botToken: string): ValidatedInitData {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');

  if (!hash) {
    throw new Error('Missing hash in init data');
  }

  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  const hashBuffer = Buffer.from(hash, 'hex');
  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

  if (hashBuffer.length !== calculatedBuffer.length || !timingSafeEqual(hashBuffer, calculatedBuffer)) {
    throw new Error('Invalid init data hash');
  }

  const authDate = Number(params.get('auth_date'));
  if (!authDate) {
    throw new Error('Missing auth_date in init data');
  }

  const maxAgeSeconds = 86400;
  if (Date.now() / 1000 - authDate > maxAgeSeconds) {
    throw new Error('Init data expired');
  }

  const userRaw = params.get('user');
  if (!userRaw) {
    throw new Error('Missing user in init data');
  }

  const user = JSON.parse(userRaw) as TelegramUser;

  return {
    user,
    authDate,
    queryId: params.get('query_id') ?? undefined,
    chatInstance: params.get('chat_instance') ?? undefined,
    chatType: params.get('chat_type') ?? undefined,
  };
}
