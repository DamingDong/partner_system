# 测试覆盖完善指南

## 概述

本文档记录了合作伙伴管理系统的测试覆盖完善工作，确保代码质量和可维护性。

## 测试架构

### 测试框架配置
- **测试框架**: Vitest 3.2.4
- **测试环境**: jsdom (浏览器环境模拟)
- **断言库**: Vitest内置断言 + @testing-library/jest-dom
- **覆盖率工具**: @vitest/coverage-v8

### 配置文件
- `vitest.config.ts` - Vitest主配置文件
- `src/test/setup.ts` - 测试环境设置
- `src/test/vitest.d.ts` - TypeScript类型定义

## 测试覆盖范围

### ✅ 已完成的测试覆盖

#### 1. 页面组件测试
- **Orders Page** (`src/__tests__/pages/Orders.test.tsx`)
  - 订单列表渲染
  - 搜索和筛选功能
  - 分页功能
  - 加载和错误状态处理

- **Dashboard Page** (`src/__tests__/pages/Dashboard.test.tsx`)
  - 关键指标卡片显示
  - 收入趋势图表
  - 最近订单列表
  - 权限角色适配

- **Partners Page** (`src/__tests__/pages/Partners.test.tsx`)
  - 合作伙伴列表显示
  - 搜索和状态筛选
  - 操作按钮功能
  - 分页和错误处理

#### 2. UI组件测试
- **Button Component** (`src/__tests__/components/Button.test.tsx`)
  - 基础渲染和点击事件
  - 禁用状态处理
  - 样式变体应用

- **Card Components** (`src/__tests__/components/ui/Card.test.tsx`)
  - Card、CardHeader、CardTitle等完整结构
  - 样式类名应用
  - 组合使用场景

- **Input Component** (`src/__tests__/components/ui/Input.test.tsx`)
  - 输入事件处理
  - 不同类型支持
  - 状态属性验证

- **Table Components** (`src/__tests__/components/ui/Table.test.tsx`)
  - 完整表格结构
  - 表头、表体、表脚
  - 单元格和行渲染

#### 3. 业务组件测试
- **OrderFilters Component** (`src/__tests__/components/orders/OrderFilters.test.tsx`)
  - 搜索功能
  - 状态筛选
  - 日期范围筛选
  - 重置功能

- **RecoveryPoolCard Component** (`src/__tests__/components/recovery/RecoveryPoolCard.test.tsx`)
  - 恢复池信息显示
  - 状态徽章
  - 进度条
  - 操作按钮

#### 4. Hooks测试
- **useOrders Hook** (`src/__tests__/hooks/useOrders.test.ts`)
  - 数据获取和状态管理
  - 筛选条件处理
  - 分页功能
  - 错误处理

#### 5. 服务测试
- **AuthService** (`src/__tests__/services/authService.test.ts`)
- **CardService** (`src/__tests__/services/cardService.test.ts`)
- **RevenueSharingService** (`src/__tests__/services/revenueSharingService.test.ts`)

### 🔄 测试工具和基础设施

#### 测试工具函数 (`src/test/test-utils.tsx`)
```typescript
// 自定义渲染函数
const customRender = (ui, options) => render(ui, { wrapper: TestProviders, ...options })

// 测试数据生成器
export const generateTestUser = (overrides) => ({ ... })
export const generateTestOrder = (overrides) => ({ ... })
export const generateTestPartner = (overrides) => ({ ... })
export const generateTestDashboardStats = (overrides) => ({ ... })

// 异步工具
export const waitForPromises = () => new Promise(resolve => setTimeout(resolve, 0))
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
```

#### 测试环境设置 (`src/test/setup.ts`)
- localStorage和sessionStorage模拟
- matchMedia和ResizeObserver模拟
- 控制台输出优化
- 测试超时配置

## 测试最佳实践

### 1. 测试结构
```typescript
describe('Component Name', () => {
  beforeEach(() => {
    // 清理模拟和状态
    vi.clearAllMocks()
  })
  
  it('应该正确渲染基础元素', () => {
    // 测试渲染
  })
  
  it('应该处理用户交互', () => {
    // 测试事件处理
  })
  
  it('应该显示加载状态', () => {
    // 测试状态管理
  })
})
```

### 2. 模拟策略
- 使用`vi.mock()`模拟外部依赖
- 为每个测试清理模拟状态
- 使用测试数据生成器保持一致性

### 3. 异步测试
- 使用`waitFor`处理异步操作
- 使用`act`包装状态更新
- 合理设置测试超时时间

## 覆盖率目标

### 当前覆盖率目标
- **行覆盖率**: 70%
- **分支覆盖率**: 70%
- **函数覆盖率**: 70%
- **语句覆盖率**: 70%

### 优先级排序
1. **核心业务逻辑** - 订单管理、合作伙伴管理
2. **UI组件** - 可复用组件
3. **工具函数** - 通用工具和工具函数
4. **配置和类型** - 类型定义和配置

## 测试运行

### 可用命令
```bash
# 运行测试
pnpm test

# 监听模式
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage

# 运行测试UI
pnpm test:ui

# 分析测试覆盖率
node scripts/test-coverage.js

# 仅分析覆盖率（不运行测试）
node scripts/test-coverage.js --analyze-only
```

### 持续集成
测试配置已优化，支持在CI/CD环境中运行：
- 使用V8覆盖率收集器
- 支持HTML、文本和LCOV格式报告
- 自动排除测试文件和配置文件

## 下一步计划

### 短期目标（1-2周）
1. **完善剩余页面测试**
   - 会员卡管理页面
   - 收益分成页面
   - 对账页面

2. **增加Hook测试覆盖**
   - useDashboardStats
   - usePartners
   - useRecoveryPool

3. **集成测试**
   - 用户流程测试
   - 端到端测试场景

### 中期目标（1个月）
1. **性能测试**
   - 大数据量渲染测试
   - 内存泄漏检测

2. **安全测试**
   - XSS防护测试
   - 权限验证测试

3. **可视化测试**
   - 截图对比测试
   - 视觉回归测试

## 质量保证

### 代码审查清单
- [ ] 所有新功能都有对应的测试
- [ ] 测试覆盖了主要业务逻辑
- [ ] 模拟数据真实有效
- [ ] 错误场景得到充分测试
- [ ] 测试运行时间合理

### 维护指南
- 定期运行测试覆盖率分析
- 更新测试数据生成器以匹配业务变化
- 保持测试代码与产品代码同步更新
- 使用测试驱动开发(TDD)方法

---

**最后更新**: 2025-10-20  
**测试状态**: ✅ 基础覆盖完善  
**下一步**: 持续完善测试覆盖，提升代码质量