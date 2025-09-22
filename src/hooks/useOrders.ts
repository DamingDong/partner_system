import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Order, 
  OrderQueryParams, 
  PaginatedOrderResult, 
  OrderFilters, 
  OrderStats,
  StatsPeriod 
} from '../types/order';
import { OrderService } from '../services/orderService';
import { useAuthStore } from '../store/authStore';

// 订单查询Hook
export const useOrders = (partnerId: string, initialFilters?: Partial<OrderFilters>) => {
  const [filters, setFilters] = useState<OrderFilters>({
    orderType: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    dateField: 'createdAt',
    ...initialFilters
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20
  });

  // 构建查询参数
  const queryParams: OrderQueryParams = useMemo(() => ({
    ...pagination,
    ...filters,
    partnerId
  }), [pagination, filters, partnerId]);

  // 使用React Query进行数据获取
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery<PaginatedOrderResult>({
    queryKey: ['orders', partnerId, queryParams],
    queryFn: async () => {
      // 使用Mock数据
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrders(partnerId, queryParams);
      }
      return OrderService.getOrders(partnerId, queryParams);
    },
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000, // 5分钟内认为数据是新鲜的
    refetchOnWindowFocus: false
  });

  // 更新筛选条件
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // 重置到第一页
  }, []);

  // 更新分页
  const updatePagination = useCallback((newPagination: Partial<typeof pagination>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // 重置筛选条件
  const resetFilters = useCallback(() => {
    setFilters({
      orderType: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      dateField: 'createdAt'
    });
    setPagination({ page: 1, limit: 20 });
  }, []);

  return {
    // 数据
    orders: data?.orders || [],
    pagination: data?.pagination,
    summary: data?.summary,
    
    // 状态
    isLoading,
    isFetching,
    error,
    
    // 筛选和分页
    filters,
    updateFilters,
    resetFilters,
    currentPage: pagination.page,
    pageSize: pagination.limit,
    updatePagination,
    
    // 操作
    refetch
  };
};

// 订单统计Hook
export const useOrderStats = (partnerId: string, period: StatsPeriod = 'month') => {
  return useQuery<OrderStats>({
    queryKey: ['orderStats', partnerId, period],
    queryFn: async () => {
      // 使用Mock数据
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrderStats(partnerId, period);
      }
      return OrderService.getOrderStats(partnerId, period);
    },
    enabled: !!partnerId,
    staleTime: 10 * 60 * 1000, // 10分钟缓存
    refetchOnWindowFocus: false
  });
};

// 订单详情Hook
export const useOrderDetail = (orderId: string | null) => {
  return useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('订单ID不能为空');
      
      // 使用Mock数据
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrderDetail(orderId);
      }
      return OrderService.getOrderDetail(orderId);
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// 订单筛选Hook - 提供预设的筛选选项
export const useOrderFilters = () => {
  const { user } = useAuthStore();
  
  // 时间范围预设选项
  const dateRangeOptions = useMemo(() => [
    {
      label: '今天',
      value: 'today',
      getRange: () => {
        const today = new Date();
        return {
          startDate: today.toISOString().slice(0, 10),
          endDate: today.toISOString().slice(0, 10)
        };
      }
    },
    {
      label: '最近7天',
      value: 'last7days',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return {
          startDate: start.toISOString().slice(0, 10),
          endDate: end.toISOString().slice(0, 10)
        };
      }
    },
    {
      label: '最近30天',
      value: 'last30days',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        return {
          startDate: start.toISOString().slice(0, 10),
          endDate: end.toISOString().slice(0, 10)
        };
      }
    },
    {
      label: '最近3个月',
      value: 'last3months',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        return {
          startDate: start.toISOString().slice(0, 10),
          endDate: end.toISOString().slice(0, 10)
        };
      }
    }
  ], []);

  // 订单状态选项
  const statusOptions = useMemo(() => [
    { label: '已完成', value: 'COMPLETED' },
    { label: '处理中', value: 'PROCESSING' },
    { label: '待处理', value: 'PENDING' },
    { label: '失败', value: 'FAILED' },
    { label: '已取消', value: 'CANCELLED' },
    { label: '已退款', value: 'REFUNDED' }
  ], []);

  // 订单类型选项
  const typeOptions = useMemo(() => [
    { label: '激活订单', value: 'ACTIVATION' },
    { label: '订阅订单', value: 'SUBSCRIPTION' }
  ], []);

  return {
    dateRangeOptions,
    statusOptions,
    typeOptions,
    currentPartnerId: user?.partnerId
  };
};

// 防抖Hook - 用于搜索输入
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 订单搜索Hook - 结合防抖功能
export const useOrderSearch = (partnerId: string, searchTerm: string, delay: number = 500) => {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  
  const [searchType, setSearchType] = useState<'orderNumber' | 'cardNumber' | 'phone'>('orderNumber');

  const filters = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return {};
    
    return {
      [searchType]: debouncedSearchTerm.trim()
    };
  }, [debouncedSearchTerm, searchType]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['orderSearch', partnerId, searchType, debouncedSearchTerm],
    queryFn: async () => {
      const params: OrderQueryParams = {
        page: 1,
        limit: 10, // 搜索结果限制数量
        partnerId,
        ...filters
      };

      // 使用Mock数据
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrders(partnerId, params);
      }
      return OrderService.getOrders(partnerId, params);
    },
    enabled: !!partnerId && !!debouncedSearchTerm.trim(),
    staleTime: 2 * 60 * 1000 // 2分钟缓存
  });

  return {
    searchResults: data?.orders || [],
    isSearching: isLoading,
    searchError: error,
    searchType,
    setSearchType,
    hasResults: (data?.orders.length || 0) > 0
  };
};

// 订单操作Hook - 处理订单相关的操作
export const useOrderActions = () => {
  const queryClient = useQueryClient();

  // 刷新订单数据
  const refreshOrders = useCallback((partnerId: string) => {
    queryClient.invalidateQueries({ queryKey: ['orders', partnerId] });
    queryClient.invalidateQueries({ queryKey: ['orderStats', partnerId] });
  }, [queryClient]);

  // 刷新单个订单详情
  const refreshOrderDetail = useCallback((orderId: string) => {
    queryClient.invalidateQueries({ queryKey: ['orderDetail', orderId] });
  }, [queryClient]);

  // 预取订单详情数据
  const prefetchOrderDetail = useCallback((orderId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['orderDetail', orderId],
      queryFn: async () => {
        // 使用Mock数据
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
          const { MockOrderService } = await import('../lib/mock-order-service');
          return MockOrderService.getOrderDetail(orderId);
        }
        return OrderService.getOrderDetail(orderId);
      },
      staleTime: 5 * 60 * 1000
    });
  }, [queryClient]);

  return {
    refreshOrders,
    refreshOrderDetail,
    prefetchOrderDetail
  };
};