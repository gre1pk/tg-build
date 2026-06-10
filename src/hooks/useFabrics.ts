import { useContext, useEffect, useState } from 'react';

import { DataContext } from '@/data/DataProvider';
import type { Fabric } from '@/data/types';

interface UseFabricsResult {
  fabrics: Fabric[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFabrics(): UseFabricsResult {
  const repository = useContext(DataContext);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!repository) {
      setError('DataProvider is not mounted');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    repository
      .getFabrics()
      .then((data) => {
        if (!cancelled) {
          setFabrics(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить каталог');
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
  }, [repository, tick]);

  return {
    fabrics,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}

export function useFabric(id: string | undefined) {
  const repository = useContext(DataContext);
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repository || !id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    repository
      .getFabric(id)
      .then((data) => {
        if (!cancelled) {
          setFabric(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить ткань');
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
  }, [repository, id]);

  return { fabric, loading, error };
}
