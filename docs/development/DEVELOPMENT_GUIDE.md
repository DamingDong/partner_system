# 开发指南

本文档为合作伙伴管理系统的详细开发指南。

## 🏗️ 项目架构

### 技术栈
- **前端框架**: React 18.3.1 + TypeScript
- **构建工具**: Vite
- **样式系统**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand 4.5.7
- **路由管理**: React Router DOM 6.26.2
- **图表组件**: Recharts 2.12.7
- **HTTP客户端**: Axios 1.11.0
- **测试框架**: Vitest

### 目录结构
```
src/
├── components/          # 可复用组件
│   ├── auth/           # 认证相关组件
│   ├── cards/          # 会员卡组件
│   ├── dashboard/      # 仪表板组件
│   ├── layout/         # 布局组件
│   ├── orders/         # 订单组件
│   └── ui/             # 基础UI组件
├── pages/              # 页面组件
├── services/           # 业务服务层
├── store/              # 状态管理
├── hooks/              # 自定义Hook
├── lib/                # 工具函数和Mock数据
├── types/              # TypeScript类型定义
└── __tests__/          # 测试文件
```

## 🔧 开发环境配置

### 环境要求
- Node.js 18.0.0+
- pnpm 8.10.0+

### 快速开始
```bash
# 克隆项目
git clone https://github.com/DamingDong/partner_system.git
cd partner_system

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问应用
# http://localhost:5177/
```

### 开发命令
```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 类型检查
npm run type-check  # 需要添加此脚本

# 运行测试
npm run test        # 需要添加此脚本
```

## 📝 编码规范

### 代码风格
- 使用TypeScript严格模式
- 组件使用函数式组件 + Hooks
- 遵循ESLint规则
- 使用Prettier格式化代码

### 命名规范
```typescript
// 组件：PascalCase
const UserProfile = () => {}

// 函数：camelCase
const getUserData = () => {}

// 常量：UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000'

// 接口：PascalCase + I前缀
interface IUser {
  id: string;
  name: string;
}

// 类型：PascalCase
type UserStatus = 'active' | 'inactive'
```

### 文件组织
```typescript
// 组件文件结构
import React from 'react'
import { useState, useEffect } from 'react'

// 第三方库导入
import { Button } from '@/components/ui/button'

// 项目内部导入
import { useAuthStore } from '@/store/authStore'
import { userService } from '@/services/userService'

// 类型定义
interface ComponentProps {
  id: string
  onAction: () => void
}

// 组件实现
export const ComponentName: React.FC<ComponentProps> = ({ id, onAction }) => {
  // ... 组件逻辑
}
```

## 🧪 测试策略

### 测试分类
- **单元测试**: 服务层和工具函数
- **组件测试**: React组件测试
- **集成测试**: 页面级别测试

### 测试规范
```typescript
// 服务测试示例
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from '@/services/userService'

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get user data correctly', async () => {
    // 测试逻辑
  })
})
```

## 🔐 权限控制

### 权限设计
基于角色的访问控制(RBAC)系统：

```typescript
// 权限定义
const PERMISSIONS = {
  // 仪表板权限
  'dashboard:read': '查看仪表板',
  
  // 会员卡权限
  'cards:read': '查看会员卡',
  'cards:write': '编辑会员卡',
  'cards:import': '导入会员卡', // 仅管理员
  
  // 合作伙伴权限
  'partners:read': '查看合作伙伴',
  'partners:write': '编辑合作伙伴',
}

// 角色权限配置
const ROLE_PERMISSIONS = {
  admin: [
    'dashboard:read',
    'cards:read',
    'cards:write',
    'cards:import',  // 重要：仅管理员拥有导入权限
    'partners:read',
    'partners:write',
  ],
  partner: [
    'dashboard:read',
    'cards:read',
    'partners:read',
    // 注意：合作伙伴没有cards:import权限
  ],
  user: [
    'dashboard:read',
  ]
}
```

### 权限使用
```typescript
// 在组件中使用权限
import { useAuthStore } from '@/store/authStore'

const Component = () => {
  const { hasPermission } = useAuthStore()
  
  return (
    <div>
      {hasPermission('cards:import') && (
        <Button>导入会员卡</Button>
      )}
    </div>
  )
}
```

## 📊 状态管理

### Zustand Store设计
```typescript
// authStore示例
interface AuthState {
  user: User | null
  accessToken: string | null
  permissions: string[]
  isAuthenticated: boolean
  
  // Actions
  login: (authData: AuthResponse) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 状态初始值
      user: null,
      accessToken: null,
      permissions: [],
      isAuthenticated: false,
      
      // Actions实现
      login: (authData) => set({
        user: authData.user,
        accessToken: authData.accessToken,
        permissions: authData.permissions,
        isAuthenticated: true
      }),
      
      logout: () => set({
        user: null,
        accessToken: null,
        permissions: [],
        isAuthenticated: false
      }),
      
      hasPermission: (permission) => {
        const { permissions } = get()
        return permissions.includes(permission)
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
```

## 🔄 API集成

### 服务层设计
```typescript
// 服务层基类
class BaseService {
  protected static apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
  })
  
  protected static handleError(error: any) {
    // 统一错误处理
  }
}

// 具体服务实现
export class CardService extends BaseService {
  static async getCards(partnerId: string): Promise<Card[]> {
    try {
      const response = await this.apiClient.get(`/cards/${partnerId}`)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}
```

## 🎨 UI组件开发

### shadcn/ui使用
```typescript
// 使用shadcn/ui组件
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CustomComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>标题</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline">按钮</Button>
      </CardContent>
    </Card>
  )
}
```

### 自定义组件规范
```typescript
// 组件Props接口
interface ComponentProps {
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

// 使用cn工具函数处理样式
import { cn } from '@/lib/utils'

const Component: React.FC<ComponentProps> = ({
  className,
  children,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  return (
    <div
      className={cn(
        'base-styles',
        {
          'variant-styles': variant === 'secondary',
          'size-styles': size === 'lg'
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

## 🚀 性能优化

### React性能优化
```typescript
// 使用React.memo避免不必要的重渲染
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})

// 使用useMemo缓存计算结果
const Component = () => {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data)
  }, [data])
  
  return <div>{expensiveValue}</div>
}

// 使用useCallback缓存函数
const Component = () => {
  const handleClick = useCallback(() => {
    // 处理点击
  }, [dependency])
  
  return <Button onClick={handleClick}>点击</Button>
}
```

### 代码分割
```typescript
// 路由级别的代码分割
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Cards = lazy(() => import('@/pages/Cards'))

// 在路由中使用Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/cards" element={<Cards />} />
  </Routes>
</Suspense>
```

## 🔍 调试技巧

### 开发工具
- React Developer Tools
- Redux DevTools (for Zustand)
- Network面板监控API请求
- Console面板查看日志

### 调试方法
```typescript
// 使用console.log调试
console.log('调试信息:', data)

// 使用debugger断点
debugger

// 使用React DevTools Profiler分析性能
```

## 📦 构建和部署

### 构建配置
Vite配置文件 `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button']
        }
      }
    }
  }
})
```

### 环境变量
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG=true

# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_DEBUG=false
```

## 🐛 常见问题

### 1. 类型错误
```typescript
// 问题：Property 'x' does not exist on type 'unknown'
// 解决：明确类型断言
const data = response.data as ExpectedType
```

### 2. 状态更新问题
```typescript
// 问题：状态不更新
// 解决：检查依赖数组
useEffect(() => {
  fetchData()
}, [dependency]) // 确保依赖项正确
```

### 3. 路由问题
```typescript
// 问题：路由跳转不工作
// 解决：使用navigate函数
const navigate = useNavigate()
navigate('/path')
```

## 📚 学习资源

- [React官方文档](https://react.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [shadcn/ui文档](https://ui.shadcn.com/)
- [Zustand文档](https://zustand-demo.pmnd.rs/)
- [Vite文档](https://vitejs.dev/)

---

**维护者**: Damingdong  
**最后更新**: 2024-09-16