import {
  createContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react';

import {
  isMockAuth,
  restoreSession,
  signInMock,
  signInWithTelegram,
} from '@/auth/authService';
import type { UserProfile } from '@/data/types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isMock: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  isMock: false,
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMock = isMockAuth();

  useEffect(() => {
    let cancelled = false;

    async function authenticate() {
      try {
        if (isMock) {
          const profile = await signInMock();
          if (!cancelled) {
            setUser(profile);
            setLoading(false);
          }
          return;
        }

        const restored = await restoreSession();
        if (restored && !cancelled) {
          setUser(restored);
          setLoading(false);
          return;
        }

        const profile = await signInWithTelegram();
        if (!cancelled) {
          setUser(profile);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Authentication failed');
          setLoading(false);
        }
      }
    }

    void authenticate();

    return () => {
      cancelled = true;
    };
  }, [isMock]);

  return (
    <AuthContext.Provider value={{ user, loading, error, isMock }}>
      {children}
    </AuthContext.Provider>
  );
};
