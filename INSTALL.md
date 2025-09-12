# 合作伙伴系统安装指南

## 系统要求

### 环境要求
- **Node.js**: 18.0.0 或更高版本
- **npm**: 9.0.0 或更高版本
- **操作系统**: macOS, Windows 10+, Ubuntu 18.04+
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 推荐配置
- **内存**: 8GB RAM 或更多
- **存储**: 至少 2GB 可用磁盘空间
- **网络**: 稳定的互联网连接用于依赖下载

## 快速开始

### 1. 克隆项目
```bash
git clone [项目仓库地址]
cd partner_system
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问应用
打开浏览器访问: http://localhost:5177/

## 详细安装步骤

### 环境检查
在安装前，请确保您的系统满足以下要求：

```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version
```

如果版本不满足要求，请访问 [Node.js官网](https://nodejs.org/) 下载最新版本。

### 项目安装

#### 步骤1: 获取项目代码
```bash
# 从Git仓库克隆
git clone https://github.com/your-org/partner-system.git

# 进入项目目录
cd partner-system
```

#### 步骤2: 安装项目依赖
```bash
# 安装所有依赖包
npm install

# 如果遇到权限问题，可以使用：
sudo npm install
```

#### 步骤3: 环境配置
项目使用默认配置即可运行，如需自定义配置：

1. 复制环境变量文件（可选）
```bash
cp .env.example .env.local
```

2. 编辑配置文件
```bash
# 编辑环境变量
nano .env.local
```

#### 步骤4: 启动服务
```bash
# 启动开发服务器
npm run dev

# 启动生产构建
npm run build
npm run preview
```

## 部署指南

### 生产环境部署

#### 构建生产版本
```bash
npm run build
```

构建完成后，静态文件将位于 `dist/` 目录。

#### 部署到Web服务器

##### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/partner_system/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-server:port;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

##### Apache配置示例
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/partner_system/dist
    ServerName your-domain.com

    <Directory /path/to/partner_system/dist>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>

    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>
```

## 故障排除

### 常见问题

#### 1. 端口占用问题
```bash
# 查找占用端口的进程
lsof -i :5177

# 终止占用端口的进程
kill -9 [PID]
```

#### 2. 依赖安装失败
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules并重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 3. 权限问题
```bash
# 修复npm权限（macOS/Linux）
sudo chown -R $(whoami) ~/.npm

# Windows管理员权限运行
# 右键点击终端，选择"以管理员身份运行"
```

#### 4. 网络问题
```bash
# 使用国内镜像源（中国用户）
npm config set registry https://registry.npmmirror.com
npm install
```

### 浏览器兼容性

#### 支持的浏览器版本
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### 移动端支持
- iOS Safari 14+
- Android Chrome 90+
- 微信内置浏览器（最新版本）

## 配置说明

### 环境变量

#### 开发环境 (.env.development)
```bash
# API基础URL
VITE_API_BASE_URL=http://localhost:3000/api

# 应用名称
VITE_APP_NAME=合作伙伴系统

# 调试模式
VITE_DEBUG=true
```

#### 生产环境 (.env.production)
```bash
# API基础URL
VITE_API_BASE_URL=https://api.your-domain.com/api

# 应用名称
VITE_APP_NAME=合作伙伴系统

# 调试模式
VITE_DEBUG=false
```

### 功能配置

#### 用户权限配置
系统支持基于角色的权限控制，权限配置位于 `src/store/authStore.ts`。

#### 主题配置
主题配置位于 `tailwind.config.ts`，支持自定义颜色、字体等。

## 测试

### 运行测试
```bash
# 运行所有测试
npm run test

# 运行特定测试文件
npm run test -- --testNamePattern="用户登录"
```

### 代码质量检查
```bash
# 运行ESLint
npm run lint

# 自动修复代码格式
npm run lint:fix

# 类型检查
npm run type-check
```

## 更新和维护

### 更新项目
```bash
# 拉取最新代码
git pull origin main

# 更新依赖
npm update

# 重新构建
npm run build
```

### 备份建议
- 定期备份 `src/` 目录下的源代码
- 备份配置文件（`.env.*`）
- 备份数据库（如使用本地存储）

## 技术支持

### 获取帮助
- **文档**: 查看 `docs/` 目录下的详细文档
- **问题反馈**: [提交Issue](https://github.com/your-org/partner-system/issues)
- **社区支持**: [加入讨论组](https://github.com/your-org/partner-system/discussions)

### 联系信息
- **邮箱**: support@your-domain.com
- **官网**: https://your-domain.com
- **文档**: https://docs.your-domain.com

## 版本历史

### v1.0.0 (2025-01-05)
- 初始版本发布
- 包含基础功能：会员卡管理、合作伙伴管理、数据报表
- 支持管理员权限控制
- 响应式设计，支持桌面和移动端

---

**注意**: 本安装指南适用于合作伙伴系统 v1.0.0 版本。如有更新，请参考最新文档。