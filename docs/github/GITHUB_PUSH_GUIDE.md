# GitHub代码推送指南

## 问题诊断

当前推送失败原因：
1. HTTPS方式：需要GitHub个人访问令牌(PAT)
2. SSH方式：需要配置SSH密钥

## 解决方案一：HTTPS + 个人访问令牌

### 1. 创建个人访问令牌
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选以下权限：
   - `repo` (完整仓库权限)
   - `write:packages` (如果需要)
4. 点击生成并复制令牌

### 2. 配置Git凭据
```bash
# 移除现有凭据缓存
git credential-cache exit

# 使用令牌推送
git push origin master
# 当提示输入用户名时，输入你的GitHub用户名
# 当提示输入密码时，输入生成的个人访问令牌
```

## 解决方案二：SSH密钥配置

### 1. 生成SSH密钥
```bash
# 检查现有密钥
ls ~/.ssh/id_*

# 如果没有，生成新的密钥对
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按回车使用默认文件位置
# 设置安全的passphrase
```

### 2. 添加SSH密钥到SSH代理
```bash
# 启动SSH代理
eval "$(ssh-agent -s)"

# 添加私钥
ssh-add ~/.ssh/id_ed25519
```

### 3. 添加公钥到GitHub
```bash
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 在GitHub上：
# 1. 访问 https://github.com/settings/keys
# 2. 点击 "New SSH key"
# 3. 粘贴公钥内容，设置标题
```

### 4. 测试SSH连接
```bash
ssh -T git@github.com
# 应该看到：Hi username! You've successfully authenticated...
```

### 5. 修改远程URL为SSH
```bash
git remote set-url origin git@github.com:DamingDong/partner_system.git
git push -u origin master
```

## 立即推送代码

选择任一方案后，执行：
```bash
# 强制推送当前代码到master分支
git push -u origin master --force

# 如果master分支被保护，先推送其他分支
git checkout -b main
git push -u origin main
```

## 验证推送结果

```bash
# 检查远程分支
git remote -v
git branch -r

# 查看GitHub仓库
# 访问 https://github.com/DamingDong/partner_system
```

## 常见问题

### 403错误
- 检查是否有仓库写入权限
- 确认令牌权限包含`repo`

### 仓库不存在
- 确认仓库URL正确
- 检查仓库是否为私有且你有访问权限

### 认证失败
- HTTPS：使用个人访问令牌而非密码
- SSH：确保公钥已添加到GitHub账户