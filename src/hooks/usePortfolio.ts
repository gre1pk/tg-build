import { useContext, useEffect, useState } from 'react';

import { DataContext } from '@/data/DataProvider';
import type { PortfolioItem } from '@/data/types';

interface UsePortfolioResult {
  items: PortfolioItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePortfolio(): UsePortfolioResult {
  const repository = useContext(DataContext);
  const [items, setItems] = useState<PortfolioItem[]>([]);
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
      .getPortfolio()
      .then((data) => {
        if (!cancelled) {
          setItems(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить портфолио');
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
    items,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
