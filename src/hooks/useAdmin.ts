import { useStaff } from '@/hooks/useStaff';

interface UseAdminResult {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

/** @deprecated Prefer useStaff for role-aware UI */
export function useAdmin(): UseAdminResult {
  const { isStaff, loading, error } = useStaff();
  return { isAdmin: isStaff, loading, error };
}
