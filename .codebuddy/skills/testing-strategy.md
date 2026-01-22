# 测试策略技能

## 技能概述
为合作伙伴管理系统提供全面的测试策略技能，包括单元测试、集成测试、E2E 测试等。

## 核心能力

### 1. 测试金字塔
- 单元测试（基础）
- 集成测试（中间层）
- E2E 测试（顶层）
- 测试覆盖率目标

### 2. 测试工具链
- Vitest：单元测试框架
- React Testing Library：组件测试
- Playwright：E2E 测试
- MSW：API 模拟

### 3. 测试数据管理
- 测试数据工厂
- 模拟数据生成
- 测试数据库管理
- 数据清理策略

## 最佳实践

### 测试文件组织
```
src/
├── __tests__/
│   ├── components/          # 组件测试
│   ├── pages/               # 页面测试
│   ├── services/            # 服务测试
│   ├── hooks/               # 钩子测试
│   └── utils/               # 工具函数测试
├── test-utils.tsx           # 测试工具
└── mocks/                   # 模拟数据
```

### 测试配置
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

## 项目特定测试

### 组件测试示例
```typescript
// OrderFilters.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderFilters } from '../OrderFilters';

describe('OrderFilters', () => {
  it('应该正确渲染过滤器', () => {
    render(<OrderFilters onFilterChange={jest.fn()} />);
    
    expect(screen.getByLabelText('订单类型')).toBeInTheDocument();
    expect(screen.getByLabelText('订单状态')).toBeInTheDocument();
  });
  
  it('应该触发过滤回调', () => {
    const mockOnFilterChange = jest.fn();
    render(<OrderFilters onFilterChange={mockOnFilterChange} />);
    
    fireEvent.change(screen.getByLabelText('订单类型'), {
      target: { value: 'SUBSCRIPTION' }
    });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      orderType: 'SUBSCRIPTION'
    });
  });
});
```

### 服务测试示例
```typescript
// revenueSharingService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revenueSharingService } from './revenueSharingService';

describe('RevenueSharingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('应该正确计算分账金额', () => {
    const order = {
      orderType: 'SUBSCRIPTION',
      orderAmount: 1000,
      commissionRate: 0.7
    };
    
    const result = revenueSharingService.calculateCommission(order);
    
    expect(result.commissionAmount).toBe(700);
    expect(result.actualAmount).toBe(300);
  });
  
  it('激活订单不应该参与分账', () => {
    const order = {
      orderType: 'ACTIVATION',
      orderAmount: 1000,
      commissionRate: 0.7
    };
    
    const result = revenueSharingService.calculateCommission(order);
    
    expect(result.commissionAmount).toBe(0);
    expect(result.actualAmount).toBe(1000);
  });
});
```

### E2E 测试示例
```typescript
// orders.e2e.ts
import { test, expect } from '@playwright/test';

test('订单管理流程', async ({ page }) => {
  // 登录
  await page.goto('/login');
  await page.fill('[data-testid="username"]', 'admin');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');
  
  // 导航到订单页面
  await page.click('[data-testid="orders-link"]');
  
  // 验证页面加载
  await expect(page.locator('h1')).toContainText('订单管理');
  
  // 测试筛选功能
  await page.selectOption('[data-testid="order-type-filter"]', 'SUBSCRIPTION');
  await expect(page.locator('[data-testid="order-table"]')).toBeVisible();
  
  // 测试导出功能
  await page.click('[data-testid="export-button"]');
  await expect(page.locator('[data-testid="export-success"]')).toBeVisible();
});
```

## 测试覆盖率目标

### 覆盖率指标
- 语句覆盖率：≥ 80%
- 分支覆盖率：≥ 75%
- 函数覆盖率：≥ 85%
- 行覆盖率：≥ 80%

### 关键模块覆盖率要求
- 核心业务逻辑：≥ 90%
- 用户认证和权限：≥ 95%
- 数据计算服务：≥ 95%
- UI 组件：≥ 70%

## 持续集成

### 测试流水线
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run test:coverage
```

### 质量门禁
- 单元测试必须全部通过
- E2E 测试关键流程必须通过
- 覆盖率不低于阈值
- 无严重安全漏洞