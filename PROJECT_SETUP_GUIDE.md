# 合作伙伴系统 - 项目配置指南

## 项目概述

- **项目名称**: partner_system
- **技术栈**: React + TypeScript + Vite + TailwindCSS
- **包管理器**: pnpm 8.10.0
- **开发服务器**: Vite Dev Server (端口: 5179)

## 核心配置文件

### 1. package.json

- 项目名称已修复为 `partner_system`
- 包含所有必要的依赖项
- 脚本配置完整

### 2. Vite 配置 (vite.config.ts)

```typescript
// 路径别名配置
resolve: {
  alias: {
    '@': resolve(__dirname, './src')
  }
}
```

### 3. TypeScript 配置

- **tsconfig.json**: 基础配置，引用 tsconfig.app.json 和 tsconfig.node.json
- **tsconfig.app.json**: 应用配置，包含路径映射 `@/*: ["./src/*"]`
- **tsconfig.node.json**: Node.js 配置

### 4. TailwindCSS 配置

- 已优化 content 路径：`["./src/**/*.{ts,tsx}", "./index.html"]`
- 包含完整的主题配置和插件

### 5. ESLint 配置

- 使用 TypeScript ESLint
- 包含 React Hooks 和 React Refresh 插件
- 合理的规则配置

## 环境要求

### 系统要求

- Node.js 18+
- pnpm 8.10.0+

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd partner_system

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 项目结构

```
partner_system/
├── src/                    # 源代码目录
│   ├── components/        # React 组件
│   ├── pages/            # 页面组件
│   ├── services/         # API 服务
│   ├── hooks/            # 自定义 Hooks
│   ├── store/            # 状态管理
│   ├── types/            # TypeScript 类型定义
│   └── lib/              # 工具库
├── public/               # 静态资源
├── docs/                 # 项目文档
└── scripts/              # 构建脚本
```

## 路径别名说明

项目使用 `@` 作为 `src` 目录的别名，确保导入路径一致：

```typescript
// 正确导入方式
import { OrderService } from '@/services/orderService';
import { useOrders } from '@/hooks/useOrders';
```

## 开发注意事项

### 1. 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 最佳实践
- 使用 Prettier 格式化代码

### 2. 测试

```bash
# 运行测试
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage
```

### 3. 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 问题排查

### 常见问题

1. **路径别名不工作**: 检查 vite.config.ts 和 tsconfig.app.json 中的配置
2. **样式不生效**: 确认 tailwind.config.ts 中的 content 路径正确
3. **TypeScript 错误**: 检查 tsconfig 配置和类型定义

### 开发服务器

- 默认运行在 http://localhost:5179/
- 支持热重载
- 自动打开浏览器

## 版本控制

- 使用 Git 进行版本控制
- .gitignore 已配置忽略不必要的文件
- 包含标准的 Git 提交信息模板

## 许可证

项目遵循相关开源协议，具体参见 LICENSE 文件。

---

_最后更新: 2025-10-16_
