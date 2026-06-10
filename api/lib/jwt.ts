import { createHmac, timingSafeEqual } from 'node:crypto';

export interface SessionUser {
  uid: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
}

export interface SessionPayload extends SessionUser {
  sub: string;
}

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

function getSecret(): string {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error('AUTH_JWT_SECRET is not configured');
  }
  return secret;
}

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string): Buffer {
  return Buffer.from(value, 'base64url');
}

function signSegment(header: string, payload: string, secret: string): string {
  return createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
}

export function createSessionToken(user: SessionUser): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: user.uid,
      telegramId: user.telegramId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      iat: now,
      exp: now + SESSION_TTL_SECONDS,
    }),
  );
  const signature = signSegment(header, payload, getSecret());
  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid session token');
  }

  const [header, payload, signature] = parts;
  const expected = signSegment(header, payload, getSecret());
  const sigBuffer = base64UrlDecode(signature);
  const expectedBuffer = base64UrlDecode(expected);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid session token');
  }

  const decoded = JSON.parse(base64UrlDecode(payload).toString('utf8')) as {
    sub?: string;
    telegramId?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    exp?: number;
  };

  if (!decoded.sub || typeof decoded.telegramId !== 'number') {
    throw new Error('Invalid session token');
  }

  if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Session expired');
  }

  return {
    uid: decoded.sub,
    telegramId: decoded.telegramId,
    firstName: String(decoded.firstName ?? 'User'),
    lastName: typeof decoded.lastName === 'string' ? decoded.lastName : undefined,
    username: typeof decoded.username === 'string' ? decoded.username : undefined,
    sub: decoded.sub,
  };
}
