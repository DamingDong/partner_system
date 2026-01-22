# 部署策略技能

## 技能概述
为合作伙伴管理系统提供专业的部署策略技能，包括环境配置、构建优化、监控告警等。

## 核心能力

### 1. 多环境部署
- 开发环境（Development）
- 测试环境（Staging）
- 生产环境（Production）
- 环境特定配置管理

### 2. 构建优化
- 代码分割和懒加载
- 资源压缩和优化
- 缓存策略配置
- 性能监控集成

### 3. 部署流程
- 自动化构建和部署
- 蓝绿部署策略
- 回滚机制
- 健康检查

## 最佳实践

### 环境配置
```typescript
// 环境变量管理
interface EnvironmentConfig {
  apiBaseUrl: string;
  enableDebug: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  featureFlags: Record<string, boolean>;
}

// 环境特定配置
const developmentConfig: EnvironmentConfig = {
  apiBaseUrl: 'http://localhost:3001/api',
  enableDebug: true,
  logLevel: 'debug',
  featureFlags: {
    enableExperimentalFeatures: true,
    enableBetaTesting: true,
  },
};

const productionConfig: EnvironmentConfig = {
  apiBaseUrl: 'https://api.partner-system.com/api',
  enableDebug: false,
  logLevel: 'error',
  featureFlags: {
    enableExperimentalFeatures: false,
    enableBetaTesting: false,
  },
};
```

### Docker 配置
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 项目特定部署

### 构建配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@/components/ui'],
          charts: ['recharts'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### 部署清单
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    ports:
      - "80:80"
    depends_on:
      - frontend
```

## 监控和告警

### 性能监控
```typescript
// 性能监控集成
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // 发送到监控系统
  console.log(metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 错误监控
```typescript
// 错误边界组件
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // 发送错误到监控系统
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}
```

## 安全部署

### 安全最佳实践
- HTTPS 强制使用
- 安全头配置
- CSP 策略
- 定期安全扫描

### 访问控制
- 权限验证
- API 速率限制
- 敏感数据保护
- 审计日志记录