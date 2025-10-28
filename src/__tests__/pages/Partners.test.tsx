import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import { Partners } from '@/pages/Partners'
import { usePartners } from '@/hooks/usePartners'
import { generateTestPartner, generateTestUser } from '@/test/test-utils'

// Mock hooks
vi.mock('@/hooks/usePartners', () => ({
  usePartners: vi.fn()
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: generateTestUser({ role: 'admin' }),
    isAuthenticated: true
  })
}))

describe('Partners Page', () => {
  const mockPartners = [
    generateTestPartner({
      id: 'partner-001',
      name: 'Test Partner 1',
      email: 'partner1@example.com',
      phone: '13800138001',
      status: 'ACTIVE'
    }),
    generateTestPartner({
      id: 'partner-002',
      name: 'Test Partner 2',
      email: 'partner2@example.com',
      phone: '13800138002',
      status: 'INACTIVE'
    })
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock usePartners hook
    ;(usePartners as vi.Mock).mockReturnValue({
      partners: mockPartners,
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

  it('应该正确渲染合作伙伴页面标题', () => {
    render(<Partners />)
    
    expect(screen.getByText('合作伙伴管理')).toBeInTheDocument()
    expect(screen.getByText('合作伙伴列表')).toBeInTheDocument()
  })

  it('应该显示合作伙伴列表', () => {
    render(<Partners />)
    
    expect(screen.getByText('Test Partner 1')).toBeInTheDocument()
    expect(screen.getByText('partner1@example.com')).toBeInTheDocument()
    expect(screen.getByText('13800138001')).toBeInTheDocument()
    expect(screen.getByText('活跃')).toBeInTheDocument()
    
    expect(screen.getByText('Test Partner 2')).toBeInTheDocument()
    expect(screen.getByText('非活跃')).toBeInTheDocument()
  })

  it('应该显示搜索和筛选功能', () => {
    render(<Partners />)
    
    expect(screen.getByPlaceholderText('搜索合作伙伴名称或邮箱')).toBeInTheDocument()
    expect(screen.getByText('全部状态')).toBeInTheDocument()
  })

  it('应该处理搜索功能', async () => {
    const mockSetFilters = vi.fn()
    ;(usePartners as vi.Mock).mockReturnValue({
      partners: mockPartners,
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

    render(<Partners />)
    
    const searchInput = screen.getByPlaceholderText('搜索合作伙伴名称或邮箱')
    fireEvent.change(searchInput, { target: { value: 'Test Partner 1' } })
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        search: 'Test Partner 1'
      })
    })
  })

  it('应该处理状态筛选功能', async () => {
    const mockSetFilters = vi.fn()
    ;(usePartners as vi.Mock).mockReturnValue({
      partners: mockPartners,
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

    render(<Partners />)
    
    const statusFilter = screen.getByText('全部状态')
    fireEvent.click(statusFilter)
    
    // 等待下拉菜单出现
    await waitFor(() => {
      expect(screen.getByText('活跃')).toBeInTheDocument()
    })
    
    const activeOption = screen.getByText('活跃')
    fireEvent.click(activeOption)
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        status: 'ACTIVE'
      })
    })
  })

  it('应该显示加载状态', () => {
    ;(usePartners as vi.Mock).mockReturnValue({
      partners: [],
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

    render(<Partners />)
    
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('应该显示错误状态', () => {
    ;(usePartners as vi.Mock).mockReturnValue({
      partners: [],
      isLoading: false,
      error: new Error('获取合作伙伴失败'),
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

    render(<Partners />)
    
    expect(screen.getByText('获取合作伙伴失败')).toBeInTheDocument()
    expect(screen.getByText('重试')).toBeInTheDocument()
  })

  it('应该显示添加合作伙伴按钮', () => {
    render(<Partners />)
    
    expect(screen.getByText('添加合作伙伴')).toBeInTheDocument()
  })

  it('应该显示编辑和操作按钮', () => {
    render(<Partners />)
    
    // 检查操作列中的按钮
    const editButtons = screen.getAllByLabelText('编辑')
    expect(editButtons).toHaveLength(2)
    
    const moreButtons = screen.getAllByLabelText('更多操作')
    expect(moreButtons).toHaveLength(2)
  })
})