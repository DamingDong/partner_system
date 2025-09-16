# 项目文档目录

合作伙伴管理系统的完整文档体系，按功能和用途分类组织。

## 📁 根目录文档

### 项目介绍与快速开始
- **[README.md](../README.md)** - 项目概述、快速开始、技术栈介绍
- **[INSTALL.md](../INSTALL.md)** - 详细安装配置指南、环境要求
- **[CHANGELOG.md](../CHANGELOG.md)** - 版本更新日志、功能变更记录

### Git工作流程
- **[BRANCH_STRATEGY.md](../BRANCH_STRATEGY.md)** - Git分支策略、代码提交规范

### 许可证
- **LICENSE** - 项目许可证（待添加）

## 📂 docs/ 文档目录

### 🔧 开发文档 (development/)
- **[DEVELOPMENT_GUIDE.md](./development/DEVELOPMENT_GUIDE.md)** - 完整开发指南
  - 项目架构说明
  - 技术栈详解
  - 编码规范
  - 权限控制系统
  - 性能优化指南
  - 调试技巧

- **[API_DOCUMENTATION.md](./development/API_DOCUMENTATION.md)** - API接口文档
  - 认证授权接口
  - 会员卡管理接口
  - 合作伙伴管理接口
  - 分账管理接口
  - 权益回收池接口
  - 错误码说明

### 💼 业务文档 (business/)
- **[BUSINESS_REQUIREMENTS.md](./business/BUSINESS_REQUIREMENTS.md)** - 业务需求文档
  - 项目背景与目标
  - 核心业务流程
  - 用户界面设计需求
  - 会员卡业务规则
  - 权益回收池业务规则
  - 报表系统需求

- **[ARCHITECTURE_DESIGN.md](./business/ARCHITECTURE_DESIGN.md)** - 系统架构设计
  - 整体架构概览
  - 技术栈选型
  - 分层架构设计
  - 模块化设计
  - 安全架构设计
  - 性能架构设计

- **[权益回收池功能开发总结_2024_工作记忆.md](./business/权益回收池功能开发总结_2024_工作记忆.md)** - 权益回收池功能开发总结
  - 核心功能实现
  - 技术实现细节
  - 开发成果统计
  - 下阶段开发计划

### 🚀 部署文档 (deployment/)
- **[DEPLOYMENT_GUIDE.md](./deployment/DEPLOYMENT_GUIDE.md)** - 部署指南
  - 本地开发环境
  - 构建流程
  - 静态部署配置
  - Docker容器化
  - 云平台部署
  - CI/CD流水线
  - 监控与日志

### 📋 GitHub相关文档 (github/)
- **[CREATE_GITHUB_REPO.md](./github/CREATE_GITHUB_REPO.md)** - GitHub仓库创建指南
- **[GITHUB_PUSH_GUIDE.md](./github/GITHUB_PUSH_GUIDE.md)** - GitHub推送指南
- **[PUSH_IMMEDIATE.md](./github/PUSH_IMMEDIATE.md)** - 立即推送指南

## 📖 文档使用指南

### 新开发者入门路径
1. **快速了解** → [README.md](../README.md)
2. **环境搭建** → [INSTALL.md](../INSTALL.md) 
3. **开发规范** → [DEVELOPMENT_GUIDE.md](./development/DEVELOPMENT_GUIDE.md)
4. **业务理解** → [BUSINESS_REQUIREMENTS.md](./business/BUSINESS_REQUIREMENTS.md)
5. **架构学习** → [ARCHITECTURE_DESIGN.md](./business/ARCHITECTURE_DESIGN.md)

### 不同角色的文档重点

#### 🧑‍💻 前端开发者
- [DEVELOPMENT_GUIDE.md](./development/DEVELOPMENT_GUIDE.md) - 开发环境、编码规范
- [API_DOCUMENTATION.md](./development/API_DOCUMENTATION.md) - API接口使用
- [ARCHITECTURE_DESIGN.md](./business/ARCHITECTURE_DESIGN.md) - 前端架构设计

#### 🏗️ 架构师
- [ARCHITECTURE_DESIGN.md](./business/ARCHITECTURE_DESIGN.md) - 系统架构设计
- [BUSINESS_REQUIREMENTS.md](./business/BUSINESS_REQUIREMENTS.md) - 业务需求分析
- [权益回收池功能开发总结_2024_工作记忆.md](./business/权益回收池功能开发总结_2024_工作记忆.md) - 核心功能设计

#### ⚙️ 运维工程师  
- [DEPLOYMENT_GUIDE.md](./deployment/DEPLOYMENT_GUIDE.md) - 部署运维指南
- [INSTALL.md](../INSTALL.md) - 环境配置要求

#### 📊 产品经理
- [BUSINESS_REQUIREMENTS.md](./business/BUSINESS_REQUIREMENTS.md) - 业务需求与规则
- [README.md](../README.md) - 产品功能概览
- [CHANGELOG.md](../CHANGELOG.md) - 版本迭代记录

#### 🧪 测试工程师
- [DEVELOPMENT_GUIDE.md](./development/DEVELOPMENT_GUIDE.md) - 测试策略部分
- [API_DOCUMENTATION.md](./development/API_DOCUMENTATION.md) - API测试用例
- [BUSINESS_REQUIREMENTS.md](./business/BUSINESS_REQUIREMENTS.md) - 业务规则验证

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