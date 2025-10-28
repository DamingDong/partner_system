import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@/test/test-utils'
import { useOrders } from '@/hooks/useOrders'
import { orderService } from '@/services/orderService'
import { generateTestOrder } from '@/test/test-utils'

// Mock services
vi.mock('@/services/orderService', () => ({
  orderService: {
    getOrders: vi.fn(),
    getOrder: vi.fn(),
    createOrder: vi.fn(),
    updateOrder: vi.fn(),
    deleteOrder: vi.fn()
  }
}))

// Mock auth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { role: 'admin', partnerId: null },
    isAuthenticated: true
  })
}))

describe('useOrders Hook', () => {
  const mockOrders = [
    generateTestOrder({
      id: 'order-001',
      orderNumber: 'ORD001',
      partnerName: 'Test Partner 1',
      status: 'PENDING',
      totalAmount: 1000
    }),
    generateTestOrder({
      id: 'order-002',
      orderNumber: 'ORD002',
      partnerName: 'Test Partner 2',
      status: 'COMPLETED',
      totalAmount: 2000
    })
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful API response
    ;(orderService.getOrders as vi.Mock).mockResolvedValue({
      data: mockOrders,
      totalCount: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确初始化并获取订单数据', async () => {
    const { result } = renderHook(() => useOrders())

    // 初始状态
    expect(result.current.orders).toEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()

    // 等待数据加载完成
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // 验证数据
    expect(result.current.orders).toHaveLength(2)
    expect(result.current.orders[0].orderNumber).toBe('ORD001')
    expect(result.current.orders[1].orderNumber).toBe('ORD002')
    expect(result.current.pagination.totalCount).toBe(2)
  })

  it('应该处理搜索功能', async () => {
    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // 设置搜索条件
    result.current.setFilters({ search: 'ORD001' })

    await waitFor(() => {
      expect(orderService.getOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'ORD001'
        })
      )
    })
  })

  it('应该处理状态筛选', async () => {
    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // 设置状态筛选
    result.current.setFilters({ status: 'PENDING' })

    await waitFor(() => {
      expect(orderService.getOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'PENDING'
        })
      )
    })
  })

  it('应该处理分页', async () => {
    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // 设置分页
    result.current.setPagination({
      currentPage: 2,
      pageSize: 10,
      totalPages: 3,
      totalCount: 25
    })

    await waitFor(() => {
      expect(orderService.getOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          pageSize: 10
        })
      )
    })
  })

  it('应该处理日期范围筛选', async () => {
    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const startDate = '2024-01-01'
    const endDate = '2024-01-31'
    
    result.current.setFilters({ startDate, endDate })

    await waitFor(() => {
      expect(orderService.getOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate,
          endDate
        })
      )
    })
  })

  it('应该处理API错误', async () => {
    const errorMessage = '获取订单失败'
    ;(orderService.getOrders as vi.Mock).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe(errorMessage)
  })

  it('应该处理合作伙伴角色', async () => {
    // Mock partner user
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'partner', partnerId: 'partner-001' },
      isAuthenticated: true
    })

    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(orderService.getOrders).toHaveBeenCalledWith(
      expect.objectContaining({
        partnerId: 'partner-001'
      })
    )
  })

  it('应该支持数据刷新', async () => {
    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const initialCallCount = (orderService.getOrders as vi.Mock).mock.calls.length

    // 刷新数据
    result.current.refetch()

    await waitFor(() => {
      expect(orderService.getOrders).toHaveBeenCalledTimes(initialCallCount + 1)
    })
  })

  it('应该合并多个筛选条件', async () => {
    const { result } = renderHook(() => useOrders())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    result.current.setFilters({
      search: 'ORD001',
      status: 'PENDING',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    })

    await waitFor(() => {
      expect(orderService.getOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'ORD001',
          status: 'PENDING',
          startDate: '2024-01-01',
          endDate: '2024-01-31'
        })
      )
    })
  })
})