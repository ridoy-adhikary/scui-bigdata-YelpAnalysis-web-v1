import { useState, useEffect } from 'react';

export function useDataLoader<T = any>(
  loaderFn: () => Promise<T[]>
): {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loaderFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: loadData
  };
}
