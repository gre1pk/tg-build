import type { UserProfile } from '@/data/types';

const STORAGE_KEY = 'tg-build-auth';

interface StoredSession {
  token: string;
  user: UserProfile;
}

export function getStoredSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function storeSession(token: string, user: UserProfile) {
  const payload: StoredSession = { token, user };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getAuthToken(): string | null {
  return getStoredSession()?.token ?? null;
}
