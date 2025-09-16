// 测试工具函数
import { render, type RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 创建测试用的QueryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

// 测试提供者组件
const TestProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

// 自定义render函数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestProviders, ...options })

// 重新导出所有testing-library函数
export * from '@testing-library/react'
export { customRender as render }

// 测试数据生成器
export const generateTestUser = (overrides = {}) => ({
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'partner',
  partnerId: 'partner-001',
  ...overrides,
})

export const generateTestCard = (overrides = {}) => ({
  id: 'card-001',
  cardNumber: '1234567890',
  cardSecret: 'secret123',
  status: 'UNACTIVATED',
  cardType: 'NORMAL',
  partnerId: 'partner-001',
  validityPeriod: 365,
  pointsBalance: 0,
  cashBalance: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const generateTestPartner = (overrides = {}) => ({
  id: 'partner-001',
  name: 'Test Partner',
  email: 'partner@example.com',
  phone: '13800138000',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

// 等待异步操作的辅助函数
export const waitForPromises = () => new Promise(resolve => setTimeout(resolve, 0))

// 模拟网络延迟
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))