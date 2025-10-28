# 合作伙伴管理系统

一个现代化的合作伙伴关系管理平台，专为企业和合作伙伴之间的业务协作而设计。

## 🚀 快速开始

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
打开浏览器访问: http://localhost:5177/
```

### 默认账号
- **管理员**: admin@example.com / admin123
- **测试用户**: user@example.com / user123

## ✨ 核心功能

### 📊 仪表板
- 实时数据概览
- 关键指标监控
- 业务趋势分析

### 💳 会员卡管理
- 会员卡批量导入
- 会员信息维护
- 会员等级管理
- 积分和余额管理

### 🤝 合作伙伴管理
- 合作伙伴档案管理
- 合作关系跟踪
- 业绩统计和佣金计算

### 📈 数据报表
- 销售数据分析
- 会员增长报告
- 合作伙伴业绩报表
- 自定义报表生成

### ⚙️ 系统设置
- 用户权限管理
- 系统参数配置

## 🏗️ 技术栈

### 前端技术
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **路由**: React Router v6

### 开发工具
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **图标**: Lucide React

## 📁 项目结构

```
partner_system/
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   ├── store/              # 状态管理
│   ├── lib/                # 工具函数和mock数据
│   ├── types/              # TypeScript类型定义
│   └── styles/             # 样式文件
├── public/                 # 静态资源
├── docs/                   # 项目文档
├── tests/                  # 测试文件
├── INSTALL.md             # 详细安装指南
└── README.md              # 项目说明
```

## 🔧 环境要求

### 必需环境
- **Node.js**: 18.0.0+
- **npm**: 9.0.0+

### 推荐环境
- **操作系统**: macOS 12+, Windows 11, Ubuntu 20.04+
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+

## 🎯 用户权限

### 管理员权限
- 完整系统访问权限
- 用户管理
- 系统配置
- 数据管理

### 合作伙伴权限
- 查看关联会员信息
- 业绩报表查看
- 佣金查询

### 普通用户权限
- 基础查看权限
- 个人资料管理

## 🛠️ 开发命令

### 基础命令
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 代码质量
```bash
# 代码检查
npm run lint

# 自动修复格式
npm run lint:fix

# 类型检查
npm run type-check
```

## 📦 部署

### 静态部署
项目构建后生成纯静态文件，可部署到任何静态托管服务：

```bash
# 构建生产版本
npm run build

# 部署dist/目录到您的Web服务器
```

### Docker部署（可选）
```bash
# 构建镜像
docker build -t partner-system .

# 运行容器
docker run -p 80:80 partner-system
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📚 文档资源

### 快速导航
- 📖 [安装配置指南](INSTALL.md) - 详细的环境搭建和配置说明
- 🌿 [Git分支策略](BRANCH_STRATEGY.md) - 代码提交规范和分支管理
- 📝 [版本更新日志](CHANGELOG.md) - 功能变更和版本历史
- 🧪 [测试指南](TESTING_GUIDE.md) - 测试覆盖率和组件测试规范

### 标准化文档体系

#### 💼 **业务文档** - [docs/business/](docs/business/)
- [业务需求文档](docs/business/BRD.md) - 核心业务需求和目标
- [市场需求文档](docs/business/MRD.md) - 市场分析和产品定位
- [业务规则](docs/business/BUSINESS_RULES.md) - 详细业务逻辑和约束条件

#### 🎯 **产品文档** - [docs/product/](docs/product/)
- [产品需求文档](docs/product/PRD.md) - 产品功能规格和需求
- [用户故事](docs/product/USER_STORIES.md) - 用户场景和功能需求
- [功能特性列表](docs/product/FEATURE_LIST.md) - 完整功能规划和优先级
- [MVP阶段性里程碑](docs/product/MVP_MILESTONES.md) - **MVP阶段详细规划和进度跟踪**
- [产品经理技能](docs/product/PRODUCT_MANAGER_SKILLS.md) - EPIC文档对齐方法论
- [协作框架](docs/product/COLLABORATION_FRAMEWORK.md) - 跨职能协作规范
- **EPIC文档** - [docs/product/EPICS/](docs/product/EPICS/)
  - [会员卡生命周期](docs/product/EPICS/CARD_LIFECYCLE.md)
  - [订单管理](docs/product/EPICS/ORDER_MANAGEMENT.md)
  - [合作伙伴管理](docs/product/EPICS/PARTNER_MANAGEMENT.md)
  - [权益回收池管理](docs/product/EPICS/RECOVERY_POOL_MANAGEMENT.md)
  - [收益分成](docs/product/EPICS/REVENUE_SHARING.md)

#### 🔧 **技术文档** - [docs/technical/](docs/technical/)
- [架构设计](docs/technical/ARCHITECTURE.md) - 系统架构和技术设计
- [开发指南](docs/technical/DEVELOPMENT_GUIDE.md) - 完整开发规范和技术栈使用
- [测试指南](docs/technical/TESTING_GUIDE.md) - 测试策略和最佳实践
- [API规范](docs/technical/API_SPECIFICATION.md) - 接口设计和数据格式
- [Mock API规范](docs/technical/API_MOCK_SPECIFICATION.md) - 开发环境接口模拟
- [系统集成](docs/technical/SYSTEM_INTEGRATION.md) - 第三方系统集成方案
- [架构边界](docs/technical/ARCHITECTURE_BOUNDARY.md) - 系统职责和边界定义

#### 🚀 **部署文档** - [docs/deployment/](docs/deployment/)
- [部署指南](docs/deployment/DEPLOYMENT_GUIDE.md) - 完整部署方案和运维指南

#### 📋 **GitHub文档** - [docs/github/](docs/github/)
- [GitHub仓库创建](docs/github/CREATE_GITHUB_REPO.md)
- [GitHub推送指南](docs/github/GITHUB_PUSH_GUIDE.md)
- [立即推送指南](docs/github/PUSH_IMMEDIATE.md)

#### 📚 **归档文档** - [docs/archive/](docs/archive/)
- 历史版本和过时文档存档，包含业务、开发等历史文档

#### 🤖 **技能定义** - [.codebuddy/skills/](.codebuddy/skills/)
- [产品管理技能](.codebuddy/skills/product-management.md)
- [API集成技能](.codebuddy/skills/api-integration.md)
- [React开发技能](.codebuddy/skills/react-development.md)
- [TypeScript开发技能](.codebuddy/skills/typescript-development.md)
- [测试策略技能](.codebuddy/skills/testing-strategy.md)
- [部署策略技能](.codebuddy/skills/deployment-strategy.md)

### 文档索引
完整的文档导航和使用指南请查看：[docs/README.md](docs/README.md)

## 📞 支持

### 技术支持
- 🐛 [问题反馈](https://github.com/DamingDong/partner_system/issues)
- 💬 技术讨论：damingdong@example.com
- 📋 [项目看板](https://github.com/DamingDong/partner_system/projects)

### 贡献指南
欢迎参与项目贡献！请查看[开发指南](docs/development/DEVELOPMENT_GUIDE.md)了解详细的开发规范。

---

**技术栈**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**维护者**: [Damingdong](https://github.com/DamingDong)  
**项目地址**: https://github.com/DamingDong/partner_system
