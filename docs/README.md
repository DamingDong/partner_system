# 项目文档目录

合作伙伴管理系统的完整文档体系，按功能和用途分类组织。

## 📁 根目录文档

### 项目介绍与快速开始
- **[README.md](../README.md)** - 项目概述、快速开始、技术栈介绍
- **[INSTALL.md](../INSTALL.md)** - 详细安装配置指南、环境要求
- **[CHANGELOG.md](../CHANGELOG.md)** - 版本更新日志、功能变更记录
- **[TESTING_GUIDE.md](../TESTING_GUIDE.md)** - 测试覆盖率和组件测试规范

### Git工作流程
- **[BRANCH_STRATEGY.md](../BRANCH_STRATEGY.md)** - Git分支策略、代码提交规范

### 许可证
- **LICENSE** - 项目许可证（待添加）

## 📂 docs/ 文档目录

### 💼 **业务文档** (business/)
- **[业务需求文档](./business/BRD.md)** - 核心业务需求和目标
- **[市场需求文档](./business/MRD.md)** - 市场分析和产品定位
- **[业务规则](./business/BUSINESS_RULES.md)** - 详细业务逻辑和约束条件

### 🎯 **产品文档** (product/)
- **[产品需求文档](./product/PRD.md)** - 产品功能规格和需求
- **[用户故事](./product/USER_STORIES.md)** - 用户场景和功能需求
- **[产品经理技能](./product/PRODUCT_MANAGER_SKILLS.md)** - EPIC文档对齐方法论
- **[协作框架](./product/COLLABORATION_FRAMEWORK.md)** - 跨职能协作规范
- **EPIC文档** (product/EPICS/)
  - [会员卡生命周期](./product/EPICS/CARD_LIFECYCLE.md)
  - [订单管理](./product/EPICS/ORDER_MANAGEMENT.md)
  - [合作伙伴管理](./product/EPICS/PARTNER_MANAGEMENT.md)
  - [权益回收池管理](./product/EPICS/RECOVERY_POOL_MANAGEMENT.md)
  - [收益分成](./product/EPICS/REVENUE_SHARING.md)

### 🔧 **技术文档** (technical/)
- **[架构设计](./technical/ARCHITECTURE.md)** - 系统架构和技术设计
- **[开发指南](./technical/DEVELOPMENT_GUIDE.md)** - 完整开发规范和技术栈使用
- **[测试指南](./technical/TESTING_GUIDE.md)** - 测试策略和最佳实践
- **[API规范](./technical/API_SPECIFICATION.md)** - 接口设计和数据格式
- **[Mock API规范](./technical/API_MOCK_SPECIFICATION.md)** - 开发环境接口模拟
- **[系统集成](./technical/SYSTEM_INTEGRATION.md)** - 第三方系统集成方案
- **[架构边界](./technical/ARCHITECTURE_BOUNDARY.md)** - 系统职责和边界定义

### 🚀 **部署文档** (deployment/)
- **[部署指南](./deployment/DEPLOYMENT_GUIDE.md)** - 完整部署方案和运维指南

### 📋 **GitHub文档** (github/)
- **[GitHub仓库创建](./github/CREATE_GITHUB_REPO.md)**
- **[GitHub推送指南](./github/GITHUB_PUSH_GUIDE.md)**
- **[立即推送指南](./github/PUSH_IMMEDIATE.md)**

### 📚 **归档文档** (archive/)
- 历史版本和过时文档存档，包含业务、开发等历史文档

### 🤖 **技能定义** (.codebuddy/skills/)
- **[产品管理技能](../.codebuddy/skills/product-management.md)**
- **[API集成技能](../.codebuddy/skills/api-integration.md)**
- **[React开发技能](../.codebuddy/skills/react-development.md)**
- **[TypeScript开发技能](../.codebuddy/skills/typescript-development.md)**
- **[测试策略技能](../.codebuddy/skills/testing-strategy.md)**
- **[部署策略技能](../.codebuddy/skills/deployment-strategy.md)**

## 📖 文档使用指南

### 新开发者入门路径
1. **快速了解** → [README.md](../README.md)
2. **环境搭建** → [INSTALL.md](../INSTALL.md) 
3. **开发规范** → [DEVELOPMENT_GUIDE.md](./technical/DEVELOPMENT_GUIDE.md)
4. **业务理解** → [业务需求文档](./business/BRD.md)
5. **架构学习** → [架构设计](./technical/ARCHITECTURE.md)

### 不同角色的文档重点

#### 🧑‍💻 前端开发者
- [开发指南](./technical/DEVELOPMENT_GUIDE.md) - 开发环境、编码规范
- [API规范](./technical/API_SPECIFICATION.md) - API接口使用
- [架构设计](./technical/ARCHITECTURE.md) - 前端架构设计

#### 🏗️ 架构师
- [架构设计](./technical/ARCHITECTURE.md) - 系统架构设计
- [架构边界](./technical/ARCHITECTURE_BOUNDARY.md) - 系统边界定义
- [业务需求文档](./business/BRD.md) - 业务需求分析

#### ⚙️ 运维工程师  
- [部署指南](./deployment/DEPLOYMENT_GUIDE.md) - 部署运维指南
- [INSTALL.md](../INSTALL.md) - 环境配置要求

#### 📊 产品经理
- [业务需求文档](./business/BRD.md) - 业务需求与规则
- [产品需求文档](./product/PRD.md) - 产品功能规格
- [用户故事](./product/USER_STORIES.md) - 用户场景需求
- [EPIC文档](./product/EPICS/) - 产品功能模块
- [协作框架](./product/COLLABORATION_FRAMEWORK.md) - 跨职能协作

#### 🧪 测试工程师
- [测试指南](./technical/TESTING_GUIDE.md) - 测试策略和最佳实践
- [API规范](./technical/API_SPECIFICATION.md) - API测试用例
- [业务规则](./business/BUSINESS_RULES.md) - 业务规则验证

#### 🤖 AI助手技能定义
- [产品管理技能](../.codebuddy/skills/product-management.md) - EPIC文档对齐
- [API集成技能](../.codebuddy/skills/api-integration.md) - 接口开发规范
- [React开发技能](../.codebuddy/skills/react-development.md) - 组件开发标准
- [TypeScript开发技能](../.codebuddy/skills/typescript-development.md) - 类型安全规范
- [测试策略技能](../.codebuddy/skills/testing-strategy.md) - 测试覆盖要求
- [部署策略技能](../.codebuddy/skills/deployment-strategy.md) - 部署最佳实践

## 🔄 文档维护

### 更新频率
- **README.md** - 每个主要版本发布时更新
- **CHANGELOG.md** - 每次版本发布时更新
- **API_DOCUMENTATION.md** - API变更时实时更新
- **DEVELOPMENT_GUIDE.md** - 技术栈或规范变更时更新
- **DEPLOYMENT_GUIDE.md** - 部署流程变更时更新

### 维护责任
| 文档类型 | 主要维护者 | 更新触发条件 |
|----------|------------|--------------|
| 项目介绍 | 项目负责人 | 功能发布 |
| 开发文档 | 技术负责人 | 技术变更 |
| 业务文档 | 产品经理 | 需求变更 |
| 部署文档 | 运维工程师 | 环境变更 |
| API文档 | 后端开发者 | 接口变更 |

### 文档质量标准
- ✅ **准确性** - 内容与实际实现保持一致
- ✅ **完整性** - 覆盖所有重要功能和流程
- ✅ **可读性** - 结构清晰，语言通俗易懂
- ✅ **实用性** - 提供具体的操作步骤和示例
- ✅ **时效性** - 及时更新过时信息

## 🔗 相关链接

### 项目资源
- **GitHub仓库**: https://github.com/DamingDong/partner_system
- **在线演示**: https://partner.example.com (待部署)
- **API接口**: https://api.example.com (待配置)

### 技术文档
- [React官方文档](https://react.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [shadcn/ui文档](https://ui.shadcn.com/)
- [Vite文档](https://vitejs.dev/)

### 工具与资源
- [VS Code配置指南](https://code.visualstudio.com/docs/languages/typescript)
- [Git工作流程](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [代码审查规范](https://google.github.io/eng-practices/review/)

---

**文档管理员**: Damingdong  
**最后更新**: 2024-09-16  
**文档版本**: v1.0