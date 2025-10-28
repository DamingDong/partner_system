# 技术架构设计文档 - 合作伙伴管理系统

## 📋 架构概述

### 系统定位
合作伙伴管理系统是一个企业级的SaaS平台，专注于合作伙伴关系管理、订单处理、分账计算和业务数据分析。

### 架构原则
- **微服务架构**: 模块化设计，独立部署和扩展
- **云原生**: 容器化部署，弹性伸缩
- **API优先**: RESTful API设计，前后端分离
- **数据驱动**: 实时数据处理和分析能力

### 技术栈选型

#### 前端技术栈
- **框架**: React 18 + TypeScript
- **状态管理**: Zustand (轻量级状态管理)
- **路由**: React Router v6
- **UI组件**: shadcn/ui + Tailwind CSS
- **数据获取**: React Query (TanStack Query)
- **构建工具**: Vite
- **测试**: Vitest + React Testing Library

#### 后端技术栈
- **运行时**: Node.js 18+
- **框架**: Express.js + TypeScript
- **数据库**: PostgreSQL (主数据库) + Redis (缓存)
- **ORM**: Prisma (数据库ORM)
- **消息队列**: RabbitMQ (异步任务处理)
- **认证**: JWT + 角色权限控制
- **文档**: Swagger/OpenAPI

#### 基础设施
- **容器化**: Docker + Docker Compose
- **编排**: Kubernetes (生产环境)
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD**: GitHub Actions

## 🏗️ 系统架构设计

### 整体架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用层     │    │   API网关层     │    │   微服务层      │
│                 │    │                 │    │                 │
│ • React SPA     │◄──►│ • 请求路由      │◄──►│ • 用户服务      │
│ • 静态资源      │    │ • 认证鉴权     │    │ • 订单服务      │
│ • CDN加速       │    │ • 限流熔断     │    │ • 分账服务      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   客户端层       │    │  消息队列层     │    │   数据存储层    │
│                 │    │                 │    │                 │
│ • Web浏览器     │    │ • RabbitMQ      │    │ • PostgreSQL    │
│ • 移动端App     │    │ • 异步任务      │    │ • Redis缓存     │
│ • API客户端     │    │ • 事件驱动      │    │ • 文件存储      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 微服务拆分

#### 1. 用户服务 (User Service)
**职责**: 用户认证、权限管理、用户信息管理
```typescript
// 核心接口
interface UserService {
  // 用户认证
  login(credentials: LoginRequest): Promise<AuthResponse>;
  logout(token: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  
  // 用户管理
  createUser(userData: CreateUserRequest): Promise<User>;
  updateUser(userId: string, updates: UpdateUserRequest): Promise<User>;
  getUserProfile(userId: string): Promise<UserProfile>;
  
  // 权限管理
  assignRole(userId: string, role: string): Promise<void>;
  verifyPermission(userId: string, permission: string): Promise<boolean>;
}
```

#### 2. 合作伙伴服务 (Partner Service)
**职责**: 合作伙伴生命周期管理、等级管理、绩效评估
```typescript
// 核心接口
interface PartnerService {
  // 合作伙伴管理
  registerPartner(application: PartnerRegistration): Promise<Partner>;
  approvePartner(partnerId: string, approval: ApprovalRequest): Promise<Partner>;
  updatePartnerLevel(partnerId: string, level: string): Promise<Partner>;
  
  // 等级管理
  createLevel(levelData: CreateLevelRequest): Promise<PartnerLevel>;
  calculatePartnerLevel(partnerId: string): Promise<PartnerLevel>;
  
  // 绩效评估
  calculatePerformanceScore(partnerId: string): Promise<PerformanceScore>;
  generatePartnerReport(partnerId: string, period: ReportPeriod): Promise<PartnerReport>;
}
```

#### 3. 订单服务 (Order Service)
**职责**: 订单创建、状态管理、查询统计
```typescript
// 核心接口
interface OrderService {
  // 订单管理
  createOrder(orderData: CreateOrderRequest): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  getOrderDetails(orderId: string): Promise<OrderDetails>;
  
  // 订单查询
  searchOrders(query: OrderQuery): Promise<OrderList>;
  exportOrders(query: OrderQuery): Promise<ExportResult>;
  
  // 统计报表
  getOrderStatistics(period: StatisticsPeriod): Promise<OrderStatistics>;
  generateOrderReport(parameters: ReportParameters): Promise<OrderReport>;
}
```

#### 4. 分账服务 (Revenue Sharing Service)
**职责**: 分账规则管理、分账计算、分账记录管理
```typescript
// 核心接口
interface RevenueSharingService {
  // 规则管理
  createSharingRule(ruleData: CreateRuleRequest): Promise<RevenueSharingRule>;
  updateSharingRule(ruleId: string, updates: UpdateRuleRequest): Promise<RevenueSharingRule>;
  getApplicableRules(order: Order): Promise<RevenueSharingRule[]>;
  
  // 分账计算
  calculateRevenueSharing(orderId: string): Promise<RevenueSharingRecord>;
  batchCalculateSharing(orderIds: string[]): Promise<BatchCalculationResult>;
  recalculateSharing(recordId: string): Promise<RevenueSharingRecord>;
  
  // 记录管理
  getSharingRecords(query: RecordQuery): Promise<SharingRecordList>;
  exportSharingRecords(query: RecordQuery): Promise<ExportResult>;
}
```

#### 5. 对账服务 (Reconciliation Service)
**职责**: 对账单生成、对账状态管理、差异处理
```typescript
// 核心接口
interface ReconciliationService {
  // 对账单管理
  generateReconciliation(period: ReconciliationPeriod): Promise<Reconciliation>;
  getReconciliationDetails(reconciliationId: string): Promise<ReconciliationDetails>;
  markReconciliationAsVerified(reconciliationId: string, verification: VerificationData): Promise<void>;
  
  // 差异处理
  identifyDiscrepancies(reconciliationId: string): Promise<Discrepancy[]>;
  resolveDiscrepancy(discrepancyId: string, resolution: ResolutionData): Promise<void>;
}
```

## 📊 数据架构设计

### 数据库设计原则
- **规范化设计**: 第三范式，减少数据冗余
- **性能优化**: 合理索引，查询优化
- **数据安全**: 敏感数据加密，访问控制
- **扩展性**: 分表分库策略，读写分离

### 核心数据模型

#### 用户相关表
```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    partner_id UUID REFERENCES partners(id),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户会话表
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    access_token VARCHAR(512) NOT NULL,
    refresh_token VARCHAR(512) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 合作伙伴相关表
```sql
-- 合作伙伴表
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL, -- INDIVIDUAL/ENTERPRISE
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    level_id UUID REFERENCES partner_levels(id),
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    performance_score DECIMAL(5,2) DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 合作伙伴等级表
CREATE TABLE partner_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_code VARCHAR(20) UNIQUE NOT NULL,
    level_name VARCHAR(50) NOT NULL,
    description TEXT,
    min_revenue DECIMAL(15,2) NOT NULL,
    min_orders INTEGER NOT NULL,
    min_performance_score DECIMAL(5,2) NOT NULL,
    base_commission_rate DECIMAL(5,4) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 订单相关表
```sql
-- 订单表
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type VARCHAR(20) NOT NULL, -- ACTIVATION/SUBSCRIPTION
    partner_id UUID NOT NULL REFERENCES partners(id),
    order_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    
    -- 分账相关字段（仅订阅订单）
    commission_rate DECIMAL(5,4),
    commission_amount DECIMAL(15,2),
    actual_amount DECIMAL(15,2),
    revenue_sharing_rule_id UUID REFERENCES revenue_sharing_rules(id),
    
    -- 激活订单特有字段
    card_id UUID REFERENCES cards(id),
    card_number VARCHAR(50),
    activation_time TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分账规则表
CREATE TABLE revenue_sharing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_type VARCHAR(20) NOT NULL, -- FIXED/TIERED/CONDITIONAL
    rule_name VARCHAR(100) NOT NULL,
    description TEXT,
    priority INTEGER NOT NULL DEFAULT 100,
    
    -- 适用条件
    applicable_order_types VARCHAR(20)[] DEFAULT '{SUBSCRIPTION}',
    applicable_partners UUID[],
    
    -- 规则参数
    fixed_rate DECIMAL(5,4),
    
    is_active BOOLEAN DEFAULT true,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ,
    
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 安全架构设计

### 认证和授权

#### JWT认证流程
```typescript
// 认证流程
1. 用户登录 → 验证凭证 → 生成JWT Token
2. API请求 → 验证JWT Token → 提取用户信息
3. 权限验证 → 检查用户角色和权限 → 执行操作
4. Token刷新 → 使用Refresh Token获取新Access Token
```

#### 权限控制模型
```typescript
// 基于角色的访问控制 (RBAC)
interface Permission {
  resource: string;    // 资源类型（orders, partners, etc.）
  action: string;     // 操作类型（read, write, delete, etc.）
  conditions?: any;   // 条件限制
}

interface Role {
  name: string;       // 角色名称
  permissions: Permission[];
  inherits?: string[]; // 继承其他角色权限
}

// 系统角色定义
const ROLES = {
  ADMIN: {
    permissions: ['*:*'], // 所有资源的全部操作
  },
  PARTNER: {
    permissions: [
      'orders:read', 'orders:read:self',
      'partners:read:self', 'revenue-sharing:read:self'
    ],
  },
  OPERATOR: {
    permissions: [
      'orders:*', 'partners:read', 'revenue-sharing:read'
    ],
  },
};
```

### 数据安全

#### 敏感数据加密
```typescript
// 数据加密策略
interface EncryptionConfig {
  algorithm: 'aes-256-gcm';
  key: Buffer; // 从环境变量获取
  ivLength: 16;
  authTagLength: 16;
}

// 需要加密的字段
const ENCRYPTED_FIELDS = {
  users: ['password_hash', 'email'],
  partners: ['phone', 'email', 'id_card', 'business_license'],
  orders: ['card_number'],
};
```

#### 数据传输安全
```typescript
// HTTPS配置
interface SecurityConfig {
  ssl: {
    cert: string;    // SSL证书路径
    key: string;     // SSL私钥路径
    ca?: string;     // CA证书路径（可选）
  };
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };
}
```

## 📈 性能优化策略

### 缓存策略
```typescript
// Redis缓存配置
interface CacheConfig {
  // 缓存时间（秒）
  ttl: {
    userProfile: 3600,        // 用户信息：1小时
    partnerInfo: 1800,        // 合作伙伴信息：30分钟
    orderList: 300,           // 订单列表：5分钟
    revenueSharingRules: 3600, // 分账规则：1小时
  };
  
  // 缓存键前缀
  prefix: {
    user: 'user:',
    partner: 'partner:',
    order: 'order:',
    rule: 'rule:',
  };
}
```

### 数据库优化
```sql
-- 关键索引设计
CREATE INDEX idx_orders_partner_status ON orders(partner_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_partners_level_status ON partners(level_id, status);
CREATE INDEX idx_revenue_sharing_effective ON revenue_sharing_rules(effective_from, effective_to, is_active);

-- 分区策略（按时间分区）
CREATE TABLE orders_2025q1 PARTITION OF orders 
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
```

### 异步处理
```typescript
// 异步任务队列
interface AsyncTask {
  // 需要异步处理的任务
  tasks: {
    'order.creation': {
      handler: 'orderService.createOrderAsync',
      queue: 'order-queue',
      retry: 3,
    },
    'revenue.calculation': {
      handler: 'revenueService.calculateRevenueSharingAsync',
      queue: 'revenue-queue',
      retry: 5,
    },
    'report.generation': {
      handler: 'reportService.generateReportAsync',
      queue: 'report-queue',
      retry: 2,
    },
  };
}
```

## 🚀 部署架构

### 开发环境
```yaml
# docker-compose.yml
version: '3.8'
services:
  # 前端应用
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    
  # API网关
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    
  # 微服务
  user-service:
    build: ./services/user-service
  order-service:
    build: ./services/order-service
  revenue-service:
    build: ./services/revenue-service
    
  # 基础设施
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: partner_system
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    
  redis:
    image: redis:7-alpine
    
  rabbitmq:
    image: rabbitmq:3-management
```

### 生产环境
```yaml
# kubernetes部署配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: partner-system
spec:
  replicas: 3
  selector:
    matchLabels:
      app: partner-system
  template:
    metadata:
      labels:
        app: partner-system
    spec:
      containers:
      - name: frontend
        image: partner-system/frontend:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        
      - name: api-gateway
        image: partner-system/api-gateway:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

## 🚀 MVP阶段性技术实现规划

### 里程碑1：硬件销售闭环 (第8周)
**技术目标**: 构建核心业务数据模型和基础服务

#### 核心数据模型实现
```typescript
// 会员卡核心模型
interface Card {
  id: string;
  cardNumber: string;
  status: 'PENDING_BIND' | 'BOUND' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  partnerId: string;
  macAddress?: string;
  activationTime?: Date;
  expiryTime?: Date;
}

// 订单核心模型
interface Order {
  id: string;
  orderNumber: string;
  orderType: 'ACTIVATION' | 'SUBSCRIPTION';
  partnerId: string;
  cardId?: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}
```

#### 基础服务架构
- **前端架构**: React + TypeScript + Vite + TailwindCSS
- **状态管理**: Zustand轻量级状态管理
- **数据获取**: React Query实现数据缓存和同步
- **路由管理**: React Router v6实现SPA路由

### 里程碑2：业务数据透明化 (第10周)
**技术目标**: 实现数据权限隔离和高级查询功能

#### 权限控制实现
```typescript
// 基于角色的权限控制
interface Permission {
  resource: 'cards' | 'orders' | 'partners';
  action: 'read' | 'write' | 'delete';
  scope: 'all' | 'self';
}

// 权限验证中间件
const checkPermission = (resource: string, action: string, scope: string) => {
  // 实现数据权限过滤逻辑
  return (req, res, next) => {
    // 根据用户角色和权限过滤数据
  };
};
```

#### 高级查询优化
- **数据库索引优化**: 关键查询字段建立索引
- **查询缓存**: Redis实现热点数据缓存
- **分页优化**: 游标分页替代传统分页
- **批量导出**: 流式导出避免内存溢出

### 里程碑3：系统稳定性和性能 (第12周)
**技术目标**: 系统性能优化和稳定性保障

#### 性能监控体系
```typescript
// 性能监控配置
interface PerformanceConfig {
  // 前端性能监控
  frontend: {
    pageLoad: { threshold: 3000 }, // 3秒阈值
    apiResponse: { threshold: 2000 }, // 2秒阈值
    userInteraction: { threshold: 100 } // 100ms阈值
  };
  
  // 后端性能监控
  backend: {
    database: { queryThreshold: 100 }, // 100ms阈值
    api: { responseThreshold: 500 }, // 500ms阈值
    memory: { usageThreshold: 80 } // 80%内存使用率
  };
}
```

#### 错误处理和监控
- **前端错误监控**: 全局错误捕获和上报
- **后端日志系统**: 结构化日志和错误追踪
- **健康检查**: 服务健康状态监控
- **告警机制**: 关键指标异常告警

### 技术风险控制策略

#### 技术选型风险控制
- **成熟技术栈**: 选择React、Node.js等成熟技术
- **渐进式架构**: 微服务架构支持渐进式开发
- **容器化部署**: Docker容器化降低部署风险

#### 性能风险控制
- **性能基准测试**: 每个里程碑进行性能测试
- **容量规划**: 基于业务量进行容量规划
- **负载测试**: 模拟真实用户负载测试

#### 安全风险控制
- **数据加密**: 敏感数据AES-256加密存储
- **权限验证**: 基于角色的细粒度权限控制
- **审计日志**: 完整操作审计和追踪

---

**文档版本**: v1.1  
**创建日期**: 2025-01-05  
**更新日期**: 2025-10-28  
**架构师**: AI助手  
**技术栈**: React + Node.js + PostgreSQL  
**部署环境**: Docker + Kubernetes  
**MVP里程碑**: 硬件销售闭环→业务数据透明化→系统稳定性