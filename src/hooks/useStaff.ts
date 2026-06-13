import { useEffect, useState } from 'react';

import { useAuth } from '@/auth/useAuth';
import { fetchAdminMe } from '@/data/api/adminApi';
import type { StaffRole } from '@/data/types';

interface UseStaffResult {
  role: StaffRole | null;
  isStaff: boolean;
  loading: boolean;
  error: string | null;
}

export function useStaff(): UseStaffResult {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<StaffRole | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setRole(null);
      setIsStaff(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAdminMe()
      .then((result) => {
        if (!cancelled) {
          setRole(result.role);
          setIsStaff(result.isStaff);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось проверить доступ');
          setRole(null);
          setIsStaff(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { role, isStaff, loading: authLoading || loading, error };
}
