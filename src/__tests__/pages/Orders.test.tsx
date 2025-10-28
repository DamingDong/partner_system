import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import { Orders } from '@/pages/Orders'
import { useOrders } from '@/hooks/useOrders'
import { generateTestOrder, generateTestUser } from '@/test/test-utils'

// Mock hooks
vi.mock('@/hooks/useOrders', () => ({
  useOrders: vi.fn()
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: generateTestUser({ role: 'admin' }),
    isAuthenticated: true
  })
}))

describe('Orders Page', () => {
  const mockOrders = [
    generateTestOrder({
      id: 'order-001',
      orderNumber: 'ORD001',
      partnerName: 'Test Partner',
      status: 'PENDING',
      totalAmount: 1000
    }),
    generateTestOrder({
      id: 'order-002',
      orderNumber: 'ORD002',
      partnerName: 'Another Partner',
      status: 'COMPLETED',
      totalAmount: 2000
    })
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock useOrders hook
    ;(useOrders as vi.Mock).mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      filters: {},
      setFilters: vi.fn(),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 2,
        pageSize: 10
      },
      setPagination: vi.fn()
    })
  })

  it('应该正确渲染订单页面标题', () => {
    render(<Orders />)
    
    expect(screen.getByText('订单管理')).toBeInTheDocument()
    expect(screen.getByText('订单列表')).toBeInTheDocument()
  })

  it('应该显示订单列表', () => {
    render(<Orders />)
    
    expect(screen.getByText('ORD001')).toBeInTheDocument()
    expect(screen.getByText('Test Partner')).toBeInTheDocument()
    expect(screen.getByText('待处理')).toBeInTheDocument()
    expect(screen.getByText('¥1,000.00')).toBeInTheDocument()
  })

  it('应该显示搜索和筛选功能', () => {
    render(<Orders />)
    
    expect(screen.getByPlaceholderText('搜索订单号或合作伙伴')).toBeInTheDocument()
    expect(screen.getByText('全部状态')).toBeInTheDocument()
    expect(screen.getByText('开始日期')).toBeInTheDocument()
    expect(screen.getByText('结束日期')).toBeInTheDocument()
  })

  it('应该处理搜索功能', async () => {
    const mockSetFilters = vi.fn()
    ;(useOrders as vi.Mock).mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      filters: {},
      setFilters: mockSetFilters,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 2,
        pageSize: 10
      },
      setPagination: vi.fn()
    })

    render(<Orders />)
    
    const searchInput = screen.getByPlaceholderText('搜索订单号或合作伙伴')
    fireEvent.change(searchInput, { target: { value: 'ORD001' } })
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        search: 'ORD001'
      })
    })
  })

  it('应该显示加载状态', () => {
    ;(useOrders as vi.Mock).mockReturnValue({
      orders: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      filters: {},
      setFilters: vi.fn(),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 10
      },
      setPagination: vi.fn()
    })

    render(<Orders />)
    
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('应该显示错误状态', () => {
    ;(useOrders as vi.Mock).mockReturnValue({
      orders: [],
      isLoading: false,
      error: new Error('获取订单失败'),
      refetch: vi.fn(),
      filters: {},
      setFilters: vi.fn(),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 10
      },
      setPagination: vi.fn()
    })

    render(<Orders />)
    
    expect(screen.getByText('获取订单失败')).toBeInTheDocument()
    expect(screen.getByText('重试')).toBeInTheDocument()
  })

  it('应该处理分页功能', async () => {
    const mockSetPagination = vi.fn()
    ;(useOrders as vi.Mock).mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      filters: {},
      setFilters: vi.fn(),
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalCount: 25,
        pageSize: 10
      },
      setPagination: mockSetPagination
    })

    render(<Orders />)
    
    const nextPageButton = screen.getByLabelText('下一页')
    fireEvent.click(nextPageButton)
    
    await waitFor(() => {
      expect(mockSetPagination).toHaveBeenCalledWith({
        currentPage: 2,
        totalPages: 3,
        totalCount: 25,
        pageSize: 10
      })
    })
  })
})