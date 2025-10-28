import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { RecoveryPoolCard } from '@/components/recovery/RecoveryPoolCard'
import { generateTestRecoveryPool } from '@/test/test-utils'

describe('RecoveryPoolCard Component', () => {
  const mockRecoveryPool = generateTestRecoveryPool({
    id: 'recovery-001',
    orderNumber: 'ORD001',
    partnerName: 'Test Partner',
    customerName: 'Test Customer',
    productName: 'Test Product',
    totalAmount: 1000,
    recoveredAmount: 500,
    status: 'PENDING',
    reason: '客户退款'
  })

  const defaultProps = {
    pool: mockRecoveryPool,
    onRecover: vi.fn(),
    onExchange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染恢复池卡片', () => {
    render(<RecoveryPoolCard {...defaultProps} />)
    
    expect(screen.getByText('ORD001')).toBeInTheDocument()
    expect(screen.getByText('Test Partner')).toBeInTheDocument()
    expect(screen.getByText('Test Customer')).toBeInTheDocument()
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('¥1,000.00')).toBeInTheDocument()
    expect(screen.getByText('¥500.00')).toBeInTheDocument()
    expect(screen.getByText('客户退款')).toBeInTheDocument()
  })

  it('应该正确显示状态徽章', () => {
    render(<RecoveryPoolCard {...defaultProps} />)
    
    const statusBadge = screen.getByText('待处理')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('应该处理恢复按钮点击', () => {
    render(<RecoveryPoolCard {...defaultProps} />)
    
    const recoverButton = screen.getByText('恢复')
    fireEvent.click(recoverButton)
    
    expect(defaultProps.onRecover).toHaveBeenCalledWith(mockRecoveryPool)
  })

  it('应该处理兑换按钮点击', () => {
    render(<RecoveryPoolCard {...defaultProps} />)
    
    const exchangeButton = screen.getByText('兑换')
    fireEvent.click(exchangeButton)
    
    expect(defaultProps.onExchange).toHaveBeenCalled()
  })

  it('应该正确显示不同状态', () => {
    const completedRecovery = generateTestRecoveryPool({
      status: 'COMPLETED',
      recoveredAmount: 1000
    })
    
    render(
      <RecoveryPoolCard 
        pool={completedRecovery}
        onRecover={vi.fn()}
        onExchange={vi.fn()}
      />
    )
    
    const statusBadge = screen.getByText('已完成')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('应该显示进度条', () => {
    render(<RecoveryPoolCard {...defaultProps} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('value', '50') // 500/1000 = 50%
  })

  it('应该处理金额格式化', () => {
    const recoveryWithLargeAmount = generateTestRecoveryPool({
      totalAmount: 1234567,
      recoveredAmount: 654321
    })
    
    render(
      <RecoveryPoolCard 
        pool={recoveryWithLargeAmount}
        onRecover={vi.fn()}
        onExchange={vi.fn()}
      />
    )
    
    expect(screen.getByText('¥1,234,567.00')).toBeInTheDocument()
    expect(screen.getByText('¥654,321.00')).toBeInTheDocument()
  })

  it('应该在已完成状态下禁用恢复按钮', () => {
    const completedRecovery = generateTestRecoveryPool({
      status: 'COMPLETED'
    })
    
    render(
      <RecoveryPoolCard 
        pool={completedRecovery}
        onRecover={vi.fn()}
        onExchange={vi.fn()}
      />
    )
    
    const recoverButton = screen.getByText('恢复')
    expect(recoverButton).toBeDisabled()
  })

  it('应该处理空恢复金额', () => {
    const recoveryWithZeroRecovery = generateTestRecoveryPool({
      recoveredAmount: 0
    })
    
    render(
      <RecoveryPoolCard 
        pool={recoveryWithZeroRecovery}
        onRecover={vi.fn()}
        onExchange={vi.fn()}
      />
    )
    
    expect(screen.getByText('¥0.00')).toBeInTheDocument()
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('value', '0')
  })
})