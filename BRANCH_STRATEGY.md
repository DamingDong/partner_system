# 分支管理策略文档

## 🌳 分支结构

### 主要分支
- **main**: 生产环境分支，只包含稳定的发布版本
- **develop**: 开发环境分支，集成所有新功能

### 支持分支
- **feature/***: 功能开发分支
- **hotfix/***: 紧急修复分支
- **release/***: 发布准备分支

## 📋 分支命名规范

### Feature分支
```bash
feature/功能模块-具体功能
# 示例：
feature/auth-login-system
feature/cards-batch-import
feature/dashboard-statistics
```

### Hotfix分支
```bash
hotfix/版本号-修复内容
# 示例：
hotfix/v1.0.1-login-bug
hotfix/v1.0.2-memory-leak
```

### Release分支
```bash
release/版本号
# 示例：
release/v1.1.0
release/v2.0.0
```

## 🔄 工作流程

### 1. 新功能开发
```bash
# 从develop创建feature分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 开发完成后提交
git add .
git commit -m "feat(module): 功能描述"
git push origin feature/your-feature-name

# 创建PR到develop分支
```

### 2. 发布流程
```bash
# 从develop创建release分支
git checkout develop
git checkout -b release/v1.1.0

# 完成发布准备后合并到main
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# 同时合并回develop
git checkout develop
git merge release/v1.1.0
```

### 3. 紧急修复
```bash
# 从main创建hotfix分支
git checkout main
git checkout -b hotfix/v1.0.1-critical-fix

# 修复完成后合并到main和develop
git checkout main
git merge hotfix/v1.0.1-critical-fix
git tag v1.0.1
git push origin main --tags

git checkout develop
git merge hotfix/v1.0.1-critical-fix
```

## ✅ 代码提交规范

### Commit Message格式
```
<类型>[可选 scope]: <描述>

[可选 正文]

[可选 脚注]
```

### 类型说明
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 重构代码
- **test**: 测试相关
- **chore**: 构建/工具/依赖等
- **perf**: 性能优化

### 示例
```bash
feat(auth): 添加用户登录功能
fix(cards): 修复会员卡激活状态错误
docs: 更新README安装指南
test(services): 添加cardService单元测试
```

## 🔒 分支保护规则

### main分支保护
- 禁止直接推送
- 要求通过PR合并
- 要求代码审查
- 要求CI检查通过

### develop分支保护
- 要求通过PR合并
- 要求CI检查通过
- 允许管理员强制推送

## 🚀 快速开始

### 配置提交模板
```bash
git config commit.template .gitmessage
```

### 创建新功能分支
```bash
# 快速创建脚本
./scripts/create-feature.sh feature-name
```

### 常用Git别名
```bash
git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.st status
git config alias.unstage 'reset HEAD --'
git config alias.last 'log -1 HEAD'
git config alias.visual '!gitk'
```