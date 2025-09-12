import { useState, useCallback, useEffect } from 'react';

export interface SearchResult {
  id: string;
  type: 'partner' | 'card' | 'transaction';
  title: string;
  description: string;
  url?: string;
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'partner',
          title: `合作伙伴 - ${searchQuery}`,
          description: `找到包含 "${searchQuery}" 的合作伙伴`,
          url: '/partners'
        },
        {
          id: '2',
          type: 'card',
          title: `会员卡 - ${searchQuery}`,
          description: `找到包含 "${searchQuery}" 的会员卡`,
          url: '/cards'
        },
        {
          id: '3',
          type: 'transaction',
          title: `交易记录 - ${searchQuery}`,
          description: `找到包含 "${searchQuery}" 的交易记录`,
          url: '/reports'
        }
      ];

      setResults(mockResults);
      setLoading(false);
      setShowResults(true);
    }, 500);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    showResults,
    setShowResults,
    search,
    clearSearch
  };
};