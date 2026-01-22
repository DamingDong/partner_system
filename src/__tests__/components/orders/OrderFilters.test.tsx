import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import { OrderFilters } from '@/components/orders/OrderFilters'

describe('OrderFilters Component', () => {
  const mockOnFiltersChange = vi.fn()
  const defaultProps = {
    filters: {},
    onFiltersChange: mockOnFiltersChange
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染筛选组件', () => {
    render(<OrderFilters {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('搜索订单号或合作伙伴')).toBeInTheDocument()
    expect(screen.getByText('全部状态')).toBeInTheDocument()
    expect(screen.getByText('开始日期')).toBeInTheDocument()
    expect(screen.getByText('结束日期')).toBeInTheDocument()
  })

  it('应该处理搜索输入', async () => {
    render(<OrderFilters {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('搜索订单号或合作伙伴')
    fireEvent.change(searchInput, { target: { value: 'ORD001' } })
    
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'ORD001'
      })
    })
  })

  it('应该处理状态筛选', async () => {
    render(<OrderFilters {...defaultProps} />)
    
    const statusFilter = screen.getByText('全部状态')
    fireEvent.click(statusFilter)
    
    // 等待下拉菜单出现
    await waitFor(() => {
      expect(screen.getByText('待处理')).toBeInTheDocument()
      expect(screen.getByText('处理中')).toBeInTheDocument()
      expect(screen.getByText('已完成')).toBeInTheDocument()
      expect(screen.getByText('已取消')).toBeInTheDocument()
    })
    
    const pendingOption = screen.getByText('待处理')
    fireEvent.click(pendingOption)
    
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        status: 'PENDING'
      })
    })
  })

  it('应该处理日期范围筛选', async () => {
    render(<OrderFilters {...defaultProps} />)
    
    const startDateInput = screen.getByPlaceholderText('开始日期')
    const endDateInput = screen.getByPlaceholderText('结束日期')
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } })
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } })
    
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      })
    })
  })

  it('应该显示当前筛选条件', () => {
    const filters = {
      search: 'ORD001',
      status: 'PENDING',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    }
    
    render(<OrderFilters filters={filters} onFiltersChange={mockOnFiltersChange} />)
    
    const searchInput = screen.getByPlaceholderText('搜索订单号或合作伙伴')
    expect(searchInput).toHaveValue('ORD001')
    
    expect(screen.getByText('待处理')).toBeInTheDocument()
    
    const startDateInput = screen.getByPlaceholderText('开始日期')
    const endDateInput = screen.getByPlaceholderText('结束日期')
    expect(startDateInput).toHaveValue('2024-01-01')
    expect(endDateInput).toHaveValue('2024-01-31')
  })

  it('应该处理筛选条件重置', async () => {
    const filters = {
      search: 'ORD001',
      status: 'PENDING',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    }
    
    render(<OrderFilters filters={filters} onFiltersChange={mockOnFiltersChange} />)
    
    const resetButton = screen.getByText('重置')
    fireEvent.click(resetButton)
    
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({})
    })
  })

  it('应该验证日期范围逻辑', async () => {
    render(<OrderFilters {...defaultProps} />)
    
    const startDateInput = screen.getByPlaceholderText('开始日期')
    const endDateInput = screen.getByPlaceholderText('结束日期')
    
    // 设置结束日期早于开始日期
    fireEvent.change(endDateInput, { target: { value: '2024-01-01' } })
    fireEvent.change(startDateInput, { target: { value: '2024-01-31' } })
    
    // 组件应该处理这种无效情况
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        startDate: '2024-01-31',
        endDate: '2024-01-01'
      })
    })
  })

  it('应该处理空搜索值', async () => {
    render(<OrderFilters {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('搜索订单号或合作伙伴')
    
    // 输入值然后清空
    fireEvent.change(searchInput, { target: { value: 'ORD001' } })
    fireEvent.change(searchInput, { target: { value: '' } })
    
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: ''
      })
    })
  })
})