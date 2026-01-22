import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { Dashboard } from '@/pages/Dashboard'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { generateTestUser } from '@/test/test-utils'

// Mock hooks
vi.mock('@/hooks/useDashboardStats', () => ({
  useDashboardStats: vi.fn()
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: generateTestUser({ role: 'admin' }),
    isAuthenticated: true
  })
}))

describe('Dashboard Page', () => {
  const mockStats = {
    totalOrders: 150,
    totalRevenue: 50000,
    activePartners: 25,
    pendingOrders: 12,
    recentOrders: [
      {
        id: 'order-001',
        orderNumber: 'ORD001',
        partnerName: 'Test Partner',
        status: 'PENDING',
        totalAmount: 1000,
        createdAt: new Date().toISOString()
      }
    ],
    revenueTrend: [
      { month: '1月', revenue: 10000 },
      { month: '2月', revenue: 15000 },
      { month: '3月', revenue: 20000 }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock useDashboardStats hook
    ;(useDashboardStats as vi.Mock).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })
  })

  it('应该正确渲染仪表板标题', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('仪表板')).toBeInTheDocument()
    expect(screen.getByText('概览')).toBeInTheDocument()
  })

  it('应该显示关键指标卡片', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('总订单数')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
    
    expect(screen.getByText('总收入')).toBeInTheDocument()
    expect(screen.getByText('¥50,000.00')).toBeInTheDocument()
    
    expect(screen.getByText('活跃合作伙伴')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    
    expect(screen.getByText('待处理订单')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('应该显示收入趋势图表', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('收入趋势')).toBeInTheDocument()
    expect(screen.getByText('最近3个月收入')).toBeInTheDocument()
  })

  it('应该显示最近订单列表', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('最近订单')).toBeInTheDocument()
    expect(screen.getByText('ORD001')).toBeInTheDocument()
    expect(screen.getByText('Test Partner')).toBeInTheDocument()
    expect(screen.getByText('待处理')).toBeInTheDocument()
  })

  it('应该显示加载状态', () => {
    ;(useDashboardStats as vi.Mock).mockReturnValue({
      stats: null,
      isLoading: true,
      error: null,
      refetch: vi.fn()
    })

    render(<Dashboard />)
    
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('应该显示错误状态', () => {
    ;(useDashboardStats as vi.Mock).mockReturnValue({
      stats: null,
      isLoading: false,
      error: new Error('获取统计数据失败'),
      refetch: vi.fn()
    })

    render(<Dashboard />)
    
    expect(screen.getByText('获取统计数据失败')).toBeInTheDocument()
    expect(screen.getByText('重试')).toBeInTheDocument()
  })

  it('应该处理合作伙伴角色视图', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: generateTestUser({ role: 'partner' }),
      isAuthenticated: true
    })

    render(<Dashboard />)
    
    expect(screen.getByText('仪表板')).toBeInTheDocument()
    expect(screen.getByText('我的概览')).toBeInTheDocument()
  })

  it('应该处理数据刷新功能', async () => {
    const mockRefetch = vi.fn()
    ;(useDashboardStats as vi.Mock).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
      refetch: mockRefetch
    })

    render(<Dashboard />)
    
    const refreshButton = screen.getByLabelText('刷新数据')
    refreshButton.click()
    
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1)
    })
  })
})