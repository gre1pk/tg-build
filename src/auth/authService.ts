import { initDataState as _initDataState, initDataRaw as _initDataRaw } from '@telegram-apps/sdk-react';

import { env } from '@/config/env';
import type { UserProfile } from '@/data/types';

import { clearSession, getStoredSession, storeSession } from './session';

interface AuthTelegramResponse {
  token: string;
  user: UserProfile;
}

interface AuthMeResponse {
  user: UserProfile;
}

export function getInitDataRaw(): string | undefined {
  return _initDataRaw() || undefined;
}

export function getTelegramUserProfile(): UserProfile | null {
  const state = _initDataState();
  if (!state?.user) {
    return null;
  }

  const { user } = state;
  return {
    uid: `tg_${user.id}`,
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  };
}

export async function signInMock(): Promise<UserProfile> {
  const profile = getTelegramUserProfile();
  if (!profile) {
    throw new Error('No Telegram user in init data (check mockEnv.ts)');
  }

  const response = await fetch('/api/auth/dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: profile }),
  });

  const data = (await response.json()) as AuthTelegramResponse & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'Dev authentication failed');
  }

  storeSession(data.token, data.user);
  return data.user;
}

export async function restoreSession(): Promise<UserProfile | null> {
  const stored = getStoredSession();
  if (!stored) {
    return null;
  }

  const response = await fetch('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${stored.token}`,
    },
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const data = (await response.json()) as AuthMeResponse;
  storeSession(stored.token, data.user);
  return data.user;
}

export async function signInWithTelegram(): Promise<UserProfile> {
  const initData = getInitDataRaw();
  if (!initData) {
    throw new Error('No init data available');
  }

  const response = await fetch('/api/auth/telegram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ initData }),
  });

  const data = (await response.json()) as AuthTelegramResponse & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'Authentication failed');
  }

  storeSession(data.token, data.user);
  return data.user;
}

export function isMockAuth(): boolean {
  return env.useMockAuth;
}
