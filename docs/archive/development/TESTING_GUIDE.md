# 测试配置指南

本文档说明项目的测试配置和使用方法。

## 🧪 测试框架

### 技术栈
- **测试框架**: Vitest 3.2.4
- **测试工具**: @testing-library/react + @testing-library/jest-dom  
- **覆盖率工具**: @vitest/coverage-v8
- **测试UI**: @vitest/ui
- **DOM环境**: jsdom

### 测试脚本
```bash
# 运行所有测试
pnpm test

# 监视模式运行测试
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage

# 启动测试UI界面
pnpm test:ui

# TypeScript类型检查
pnpm type-check
```

## ⚙️ 配置文件

### vite.config.ts测试配置
```typescript
test: {
  globals: true,                    // 启用全局测试函数
  environment: "jsdom",             // 使用jsdom环境
  setupFiles: ["./src/test/setup.ts"], // 测试设置文件
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html", "lcov"],
    exclude: [
      "node_modules/",
      "src/test/",
      "**/*.d.ts",
      "**/*.config.{js,ts}",
      "**/index.{js,ts}",
      "src/main.tsx",
      "src/vite-env.d.ts"
    ],
    thresholds: {
      global: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
}
```

### 覆盖率阈值
- **语句覆盖率**: 80%
- **分支覆盖率**: 80%  
- **函数覆盖率**: 80%
- **行覆盖率**: 80%

## 📁 测试文件结构

```
src/
├── __tests__/              # 测试文件目录
│   ├── components/         # 组件测试
│   │   └── Button.test.tsx
│   └── services/           # 服务测试
│       ├── authService.test.ts
│       ├── cardService.test.ts
│       └── revenueSharingService.test.ts
└── test/                   # 测试工具和配置
    ├── setup.ts            # 测试环境设置
    ├── test-utils.tsx      # 测试工具函数
    └── vitest.d.ts         # TypeScript类型声明
```

## 🛠️ 测试工具函数

### 自定义render函数
```typescript
import { render, screen } from '@/test/test-utils'

// 自动包含必要的Provider
render(<YourComponent />)
```

### 测试数据生成器
```typescript
import { generateTestUser, generateTestCard } from '@/test/test-utils'

const user = generateTestUser({ role: 'admin' })
const card = generateTestCard({ status: 'ACTIVE' })
```

### 环境模拟
- **localStorage/sessionStorage**: 完全模拟
- **matchMedia**: 响应式查询模拟
- **ResizeObserver**: 尺寸观察器模拟
- **IntersectionObserver**: 交叉观察器模拟

## 📋 测试规范

### 命名规范
- 测试文件：`*.test.ts` 或 `*.test.tsx`
- 测试套件：使用 `describe()` 描述模块或组件
- 测试用例：使用 `it()` 或 `test()` 描述具体场景

### 测试结构
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // 每个测试前的设置
  })

  describe('功能模块', () => {
    it('应该正确处理正常情况', () => {
      // 测试正常流程
    })

    it('应该正确处理异常情况', () => {
      // 测试异常流程
    })
  })
})
```

### 断言规范
```typescript
// 基本断言
expect(result).toBe(expected)
expect(result).toEqual(expected)
expect(result).toBeTruthy()
expect(result).toBeFalsy()

// DOM断言
expect(element).toBeInTheDocument()
expect(element).toHaveClass('className')
expect(element).toBeDisabled()

// 数组/对象断言
expect(array).toHaveLength(3)
expect(object).toHaveProperty('key')
expect(fn).toHaveBeenCalledWith(args)
```

## 🎯 测试覆盖率

### 当前状态
根据测试运行结果：
- ✅ **Button组件**: 5个测试通过
- ✅ **AuthService**: 5个测试通过（占位测试）
- ⚠️ **CardService**: 2/3个测试通过
- ⚠️ **RevenueSharingService**: 2/3个测试通过

### 需要完善的测试
1. **服务层测试**：
   - `CardService.calculateRedemptionPoints` 方法测试
   - `RevenueSharingService.configureSharingRule` 方法实现
   - 缺失的服务测试：
     - `DashboardService`
     - `PartnerService`
     - `ReconciliationService`
     - `RecoveryPoolService`

2. **组件测试**：
   - 页面组件测试（Dashboard、Cards、Partners等）
   - 布局组件测试（Header、Sidebar、Layout）
   - 业务组件测试（CardActivationModal、OrderDetailsModal等）

3. **集成测试**：
   - 用户工作流程测试
   - API集成测试

## 🚀 下一步计划

### 短期目标（1-2周）
1. **完善现有测试**：修复失败的测试用例
2. **添加服务层测试**：为所有服务类编写测试
3. **提高覆盖率**：达到80%的覆盖率阈值

### 中期目标（2-4周）
1. **组件测试**：为所有核心组件编写测试
2. **集成测试**：添加端到端的用户流程测试
3. **性能测试**：添加性能基准测试

### 长期目标（1-2月）
1. **自动化测试**：集成到CI/CD流水线
2. **测试报告**：自动生成测试报告和覆盖率趋势
3. **测试策略**：建立完整的测试策略和最佳实践

## 📚 参考资源

- [Vitest官方文档](https://vitest.dev/)
- [Testing Library文档](https://testing-library.com/)
- [Jest DOM匹配器](https://github.com/testing-library/jest-dom)
- [React测试最佳实践](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**维护者**: Damingdong  
**最后更新**: 2024-09-16  
**配置版本**: v1.0