import { useQuery, useQueryClient } from '@tanstack/react-query';

interface CacheOptions {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number | boolean;
}

const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  retry: 3,
};

export function useCache<T>(
  key: string[],
  fetcher: () => Promise<T>,
  options?: CacheOptions
) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: key,
    queryFn: fetcher,
    ...DEFAULT_CACHE_OPTIONS,
    ...options,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: key });
  };

  const refetch = () => {
    query.refetch();
  };

  return {
    ...query,
    invalidate,
    refetch,
  };
}

// 预加载数据
export function usePrefetch<T>(key: string[], fetcher: () => Promise<T>) {
  const queryClient = useQueryClient();
  
  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: fetcher,
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetch };
}