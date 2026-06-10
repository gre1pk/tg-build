import { createSessionToken, verifySessionToken, type SessionUser } from './jwt';
import { getFabricById, loadFabrics } from './fabrics';
import { validateInitData } from './validateInitData';

export interface ApiResult {
  status: number;
  body: unknown;
}

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }
  return token;
}

export function handleAuthTelegram(body: unknown): ApiResult {
  const initData =
    typeof body === 'object' && body !== null && 'initData' in body
      ? (body as { initData?: unknown }).initData
      : undefined;

  if (!initData || typeof initData !== 'string') {
    return { status: 400, body: { error: 'initData is required' } };
  }

  try {
    const validated = validateInitData(initData, getBotToken());
    const { user } = validated;
    const uid = `tg_${user.id}`;
    const sessionUser: SessionUser = {
      uid,
      telegramId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
    };

    const token = createSessionToken(sessionUser);

    return {
      status: 200,
      body: {
        token,
        user: sessionUser,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Validation failed';
    return { status: 401, body: { error: message } };
  }
}

export function handleAuthMe(authHeader: string | undefined): ApiResult {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { status: 401, body: { error: 'Missing authorization token' } };
  }

  try {
    const user = verifySessionToken(token);
    return { status: 200, body: { user } };
  } catch {
    return { status: 401, body: { error: 'Invalid or expired session' } };
  }
}

export function handleFabricsList(): ApiResult {
  return { status: 200, body: loadFabrics() };
}

export function handleFabricById(id: string): ApiResult {
  const fabric = getFabricById(id);
  if (!fabric) {
    return { status: 404, body: { error: 'Fabric not found' } };
  }
  return { status: 200, body: fabric };
}
