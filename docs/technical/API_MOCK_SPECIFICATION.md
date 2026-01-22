# API Mock 数据规范

## 📖 文档概述

本文档定义了合作伙伴管理系统中所有 Mock 数据的 API 接口规范，为前端开发和测试提供标准化的数据支持。所有接口设计遵循 RESTful 原则，确保与真实后端 API 的一致性。

## 🏗️ 接口架构设计

### 基础响应格式

所有 API 接口遵循统一的响应格式，确保前后端数据交互的一致性。

```typescript
interface ApiResponse<T> {
  success: boolean;      // 请求是否成功
  data: T;              // 返回的数据
  message?: string;     // 错误信息或提示信息
  code?: string;        // 错误代码
}
```

### 分页响应格式

需要分页的接口使用标准化的分页响应格式：

```typescript
interface PaginatedResponse<T> {
  data: T[];            // 数据列表
  total: number;        // 总数量
  page: number;         // 当前页码
  pageSize: number;     // 每页大小
  totalPages: number;   // 总页数
}
```

## 🔐 认证授权接口

### 1.1 用户登录

**接口路径**: `POST /auth/login`

**功能描述**: 用户登录认证，返回访问令牌和用户信息

**请求参数**:
```typescript
interface LoginRequest {
  username: string;     // 用户名或邮箱
  password: string;     // 密码
}
```

**响应数据**:
```typescript
interface AuthResponse {
  user: User;           // 用户信息
  accessToken: string;  // 访问令牌
  refreshToken: string; // 刷新令牌
  permissions: string[]; // 权限列表
}
```

**Mock 测试账号**:
- **管理员**: `admin@example.com` / `password`
- **合作伙伴**: `partner001@example.com` / `password`

### 1.2 用户登出

**接口路径**: `POST /auth/logout`

**功能描述**: 用户登出，清除会话信息

### 1.3 刷新Token

**接口路径**: `POST /auth/refresh`

**功能描述**: 使用刷新令牌获取新的访问令牌

## 📊 仪表板接口

### 2.1 获取仪表板数据

**接口路径**: `GET /dashboard/{partnerId}/data`

**功能描述**: 获取合作伙伴的仪表板概览数据

**响应数据**:
```typescript
interface DashboardData {
  totalCards: number;           // 总卡数
  activeCards: number;          // 活跃卡数
  totalRevenue: number;         // 总收入
  monthlyRevenue: number;       // 月收入
  totalSharing: number;         // 总分账
  monthlySharing: number;       // 月分账
  recentTransactions: Transaction[]; // 近期交易
  revenueChart: ChartData[];    // 收入图表数据
}
```

## 💳 会员卡管理接口

### 3.1 获取会员卡列表

**接口路径**: `GET /cards`

**功能描述**: 分页获取会员卡列表，支持多种筛选条件

**查询参数**:
```typescript
interface CardFilters {
  page: number;           // 页码
  pageSize: number;       // 每页大小
  cardType?: CardType;    // 卡类型筛选
  status?: CardStatus;    // 状态筛选
  partnerId?: string;     // 合作伙伴筛选
  keyword?: string;       // 关键字搜索
}
```

### 3.2 激活会员卡

**接口路径**: `POST /cards/{cardId}/activate`

**功能描述**: 激活指定的会员卡

## 📋 订单管理接口

### 4.1 获取订单列表

**接口路径**: `GET /orders`

**功能描述**: 分页获取订单列表，支持状态和类型筛选

## 💰 分账管理接口

### 5.1 获取分账记录

**接口路径**: `GET /sharing/records`

**功能描述**: 获取分账记录列表，支持接收和支付类型筛选

## 🔄 权益回收池接口

### 6.1 获取回收池信息

**接口路径**: `GET /recovery-pool/{partnerId}`

**功能描述**: 获取合作伙伴的权益回收池状态信息

**响应数据**:
```typescript
interface RecoveryPool {
  totalDays: number;        // 总天数
  availableDays: number;    // 可用天数
  usedDays: number;         // 已用天数
  recoveryCount: number;    // 回收次数
  exchangeCount: number;    // 兑换次数
}
```

## 🎫 兑换管理接口

### 7.1 创建兑换申请

**接口路径**: `POST /redemption/requests`

**功能描述**: 创建新的兑换申请

## 🤝 合作伙伴管理接口

### 8.1 获取合作伙伴列表

**接口路径**: `GET /partners`

**功能描述**: 获取合作伙伴列表，支持类型和状态筛选

## 🔧 核心系统对接接口

### 9.1 批量权益回收

**接口路径**: `POST /core-system/rights-recovery`

**功能描述**: 向核心系统提交批量权益回收请求

## 📈 报表接口

### 10.1 导出会员卡报表

**接口路径**: `GET /reports/cards/export`

**功能描述**: 导出会员卡相关报表数据

## 🛡️ 权限控制规范

### 权限验证机制

所有接口都会根据用户角色和权限进行访问控制验证：

- **管理员权限**: 全平台数据访问和操作权限
- **合作伙伴权限**: 仅限自己相关数据的查看和操作

### 错误代码定义

| 错误代码 | 错误信息 | 说明 |
|---------|---------|------|
| 401 | 未授权访问 | 用户未登录或token无效 |
| 403 | 禁止访问 | 用户权限不足 |
| 404 | 资源不存在 | 请求的资源未找到 |
| 400 | 请求参数错误 | 请求参数格式或内容错误 |

## 🚀 开发调试指南

### Mock 数据切换

在开发环境中，可以通过以下方式切换不同用户身份进行测试：

```javascript
// 切换到管理员账号
switchUser("admin")

// 切换到合作伙伴账号
switchUser("partner")

// 查看当前用户信息
getCurrentUser()
```

### 测试数据生成

系统提供标准化的测试数据生成器，确保数据的一致性和真实性：

```typescript
// 生成测试会员卡数据
const testCards = generateTestCards({
  count: 100,
  partnerId: 'test-partner-001',
  cardType: 'REGULAR'
});
```

## 📝 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2024-01-20 | 初始版本，完整的API接口规范 |

---

**文档维护**: 技术团队  
**最后更新**: 2024-01-20  
**版本**: v1.0.0