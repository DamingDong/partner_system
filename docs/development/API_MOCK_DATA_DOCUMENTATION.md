# 合作伙伴管理系统 - Mock 数据 API 接口文档

## 📖 文档说明

本文档详细介绍了合作伙伴管理系统中所有 Mock 数据的 API 接口设计，按照后端服务接口的形式进行规范化整理。这些接口为前端开发和测试提供了完整的数据支持。

## 🏗️ 接口架构

### 基础响应格式

所有接口都遵循统一的响应格式：

```typescript
interface ApiResponse<T> {
  success: boolean;      // 请求是否成功
  data: T;              // 返回的数据
  message?: string;     // 错误信息或提示信息
  code?: string;        // 错误代码
}
```

### 分页响应格式

需要分页的接口使用以下格式：

```typescript
interface PaginatedResponse<T> {
  data: T[];            // 数据列表
  total: number;        // 总数量
  page: number;         // 当前页码
  pageSize: number;     // 每页大小
  totalPages: number;   // 总页数
}
```

---

## 🔐 1. 认证授权接口

### 1.1 用户登录

**接口路径：** `POST /auth/login`

**请求参数：**
```typescript
interface LoginRequest {
  username: string;     // 用户名或邮箱
  password: string;     // 密码
}
```

**响应数据：**
```typescript
interface AuthResponse {
  user: User;           // 用户信息
  accessToken: string;  // 访问令牌
  refreshToken: string; // 刷新令牌
  permissions: string[]; // 权限列表
}
```

**Mock 账号：**
- **管理员**: `admin@example.com` / `password`
- **合作伙伴**: `partner001@example.com` / `password`

### 1.2 用户登出

**接口路径：** `POST /auth/logout`

**请求参数：** 无

**响应数据：** `void`

### 1.3 刷新Token

**接口路径：** `POST /auth/refresh`

**请求参数：**
```typescript
{
  refreshToken: string;
}
```

### 1.4 获取当前用户信息

**接口路径：** `GET /auth/me`

**响应数据：** `User`

### 1.5 重置密码

**接口路径：** `POST /auth/reset-password`

**请求参数：**
```typescript
{
  email: string;
}
```

---

## 📊 2. 仪表板接口

### 2.1 获取仪表板数据

**接口路径：** `GET /dashboard/{partnerId}/data`

**路径参数：**
- `partnerId`: 合作伙伴ID

**响应数据：**
```typescript
interface DashboardData {
  totalCards: number;           // 总卡数
  activeCards: number;          // 活跃卡数
  totalRevenue: number;         // 总收入
  monthlyRevenue: number;       // 月收入
  totalSharing: number;         // 总分账
  monthlySharing: number;       // 月分账
  pointsBalance?: number;       // 积分余额
  recentTransactions: Transaction[]; // 近期交易
  revenueChart: ChartData[];    // 收入图表数据
  cardStats?: CardStats;        // 卡片统计
  sharingStats?: SharingStats;  // 分账统计
}
```

**Mock 数据差异：**
- **管理员视角**: 全平台数据汇总
- **合作伙伴视角**: 仅显示该合作伙伴相关数据

### 2.2 获取KPI指标

**接口路径：** `GET /dashboard/{partnerId}/kpi`

**查询参数：**
- `startDate`: 开始日期 (可选)
- `endDate`: 结束日期 (可选)

**响应数据：**
```typescript
interface KPIMetrics {
  cardUtilizationRate: number;      // 卡片利用率
  averageTransactionAmount: number; // 平均交易金额
  partnerGrowthRate: number;        // 合作伙伴增长率
  reconciliationAccuracy: number;   // 对账准确率
}
```

### 2.3 获取收入图表数据

**接口路径：** `GET /dashboard/{partnerId}/revenue-chart`

**查询参数：**
- `startDate`: 开始日期 (可选)
- `endDate`: 结束日期 (可选)

**响应数据：**
```typescript
interface ChartData {
  date: string;     // 日期
  revenue: number;  // 收入
  sharing: number;  // 分账
}
```

### 2.4 获取合作伙伴概览

**接口路径：** `GET /dashboard/{partnerId}/overview`

**响应数据：**
```typescript
{
  totalSubPartners: number;     // 子合作伙伴总数
  activeSubPartners: number;    // 活跃子合作伙伴数
  monthlyGrowth: number;        // 月增长率
  totalCommission: number;      // 总佣金
}
```

---

## 💳 3. 会员卡管理接口

### 3.1 获取会员卡列表

**接口路径：** `GET /cards`

**查询参数：**
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

**响应数据：** `PaginatedResponse<MembershipCard>`

### 3.2 获取单个会员卡详情

**接口路径：** `GET /cards/{cardId}`

**路径参数：**
- `cardId`: 会员卡ID

**响应数据：** `MembershipCard`

### 3.3 激活会员卡

**接口路径：** `POST /cards/{cardId}/activate`

**请求参数：**
```typescript
{
  phoneNumber: string;      // 手机号
  macAddress?: string;      // MAC地址 (绑定卡需要)
  channelPackage?: string;  // 渠道包 (绑定卡需要)
  deviceInfo?: DeviceInfo;  // 设备信息
}
```

### 3.4 绑定会员卡

**接口路径：** `POST /cards/{cardId}/bind`

**请求参数：** `BindingData`

### 3.5 取消会员卡

**接口路径：** `POST /cards/{cardId}/cancel`

**请求参数：**
```typescript
{
  reason: string;  // 取消原因
}
```

### 3.6 批量导入会员卡

**接口路径：** `POST /cards/batch-import`

**请求参数：**
```typescript
interface ImportCardsRequest {
  partnerId: string;        // 合作伙伴ID
  batchName: string;        // 批次名称
  cards: CardImportData[];  // 会员卡数据
}
```

**响应数据：** `BatchImportResponse`

### 3.7 获取会员卡批次列表

**接口路径：** `GET /cards/batches`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `page`: 页码
- `pageSize`: 每页大小

**响应数据：** `PaginatedResponse<CardBatch>`

### 3.8 获取会员卡统计

**接口路径：** `GET /cards/stats`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)

**响应数据：**
```typescript
{
  totalCards: number;       // 总卡数
  activeCards: number;      // 活跃卡数
  expiredCards: number;     // 过期卡数
  cancelledCards: number;   // 已取消卡数
}
```

---

## 📋 4. 订单管理接口

### 4.1 获取订单列表

**接口路径：** `GET /orders`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `type`: 订单类型 (可选)
- `status`: 订单状态 (可选)
- `page`: 页码
- `pageSize`: 每页大小

**响应数据：** `PaginatedResponse<Order>`

### 4.2 获取订单详情

**接口路径：** `GET /orders/{orderId}`

**响应数据：** `Order`

### 4.3 获取订单统计

**接口路径：** `GET /orders/stats`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)

**响应数据：**
```typescript
{
  totalOrders: number;          // 总订单数
  activationOrders: number;     // 激活订单数
  subscriptionOrders: number;   // 订阅订单数
  totalAmount: number;          // 总金额
  activationAmount: number;     // 激活订单金额
  subscriptionAmount: number;   // 订阅订单金额
}
```

---

## 💰 5. 分账管理接口

### 5.1 获取分账记录列表

**接口路径：** `GET /sharing/records`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `type`: 记录类型 (`received` | `paid`)
- `status`: 分账状态 (可选)
- `page`: 页码
- `pageSize`: 每页大小

**响应数据：** `PaginatedResponse<SharingRecord>`

### 5.2 获取分账规则列表

**接口路径：** `GET /sharing/rules`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)

**响应数据：** `SharingRule[]`

### 5.3 创建分账规则

**接口路径：** `POST /sharing/rules`

**请求参数：** `SharingRule`

### 5.4 更新分账规则

**接口路径：** `PUT /sharing/rules/{ruleId}`

**请求参数：** `Partial<SharingRule>`

### 5.5 获取分账统计

**接口路径：** `GET /sharing/stats`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `startDate`: 开始日期 (可选)
- `endDate`: 结束日期 (可选)

**响应数据：**
```typescript
{
  totalSharing: number;     // 总分账金额
  totalReceived: number;    // 总收到金额
  totalPaid: number;        // 总支付金额
  sharingCount: number;     // 分账笔数
}
```

---

## 📄 6. 对账管理接口

### 6.1 获取对账单列表

**接口路径：** `GET /reconciliation/statements`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `period`: 对账期间 (可选)
- `status`: 对账状态 (可选)
- `page`: 页码
- `pageSize`: 每页大小

**响应数据：** `PaginatedResponse<ReconciliationStatement>`

### 6.2 获取对账单详情

**接口路径：** `GET /reconciliation/statements/{statementId}`

**响应数据：** `ReconciliationStatement`

### 6.3 确认对账单

**接口路径：** `POST /reconciliation/statements/{statementId}/confirm`

### 6.4 下载对账单

**接口路径：** `GET /reconciliation/statements/{statementId}/download`

**响应：** 文件下载

### 6.5 获取对账统计

**接口路径：** `GET /reconciliation/stats`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)

**响应数据：**
```typescript
{
  totalStatements: number;      // 总对账单数
  pendingStatements: number;    // 待处理对账单数
  reconciledStatements: number; // 已对账对账单数
  totalAmount: number;          // 总金额
}
```

---

## 🔄 7. 权益回收池接口

### 7.1 获取回收池信息

**接口路径：** `GET /recovery-pool/{partnerId}`

**响应数据：** `RecoveryPool`

### 7.2 获取回收池记录

**接口路径：** `GET /recovery-pool/{partnerId}/records`

**查询参数：**
- `type`: 记录类型 (可选)
- `limit`: 限制数量 (可选)
- `page`: 页码
- `pageSize`: 每页大小

**响应数据：** `PaginatedResponse<RecoveryPoolRecord>`

### 7.3 创建回收池记录

**接口路径：** `POST /recovery-pool/{partnerId}/records`

**请求参数：**
```typescript
{
  type: RecoveryPoolRecordType; // 记录类型
  days: number;                 // 天数
  description: string;          // 描述
  sourceId?: string;            // 来源ID
  sourceType?: string;          // 来源类型
}
```

### 7.4 获取回收池统计

**接口路径：** `GET /recovery-pool/{partnerId}/stats`

**响应数据：**
```typescript
{
  totalPools: number;       // 回收池总数
  totalDays: number;        // 总天数
  availableDays: number;    // 可用天数
  usedDays: number;         // 已用天数
  recoveryCount: number;    // 回收次数
  exchangeCount: number;    // 兑换次数
}
```

---

## 🎫 8. 兑换管理接口

### 8.1 创建兑换申请

**接口路径：** `POST /redemption/requests`

**请求参数：** `CreateRedemptionRequest`

### 8.2 获取兑换申请列表

**接口路径：** `GET /redemption/requests`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `status`: 申请状态 (可选)
- `page`: 页码
- `pageSize`: 每页大小

**响应数据：** `PaginatedResponse<RedemptionRequest>`

### 8.3 审批兑换申请

**接口路径：** `POST /redemption/requests/{requestId}/approve`

**请求参数：**
```typescript
{
  reason?: string;  // 审批原因
}
```

### 8.4 拒绝兑换申请

**接口路径：** `POST /redemption/requests/{requestId}/reject`

**请求参数：**
```typescript
{
  reason: string;   // 拒绝原因
}
```

### 8.5 批量兑换申请

**接口路径：** `POST /redemption/batch-exchange`

**请求参数：** `BatchExchangeRequest`

---

## 🤝 9. 合作伙伴管理接口

### 9.1 获取合作伙伴列表

**接口路径：** `GET /partners`

**查询参数：**
- `type`: 合作伙伴类型 (可选)
- `status`: 状态 (可选)
- `parentId`: 上级合作伙伴ID (可选)
- `page`: 页码
- `pageSize`: 每页大小

**响应数据：** `PaginatedResponse<Partner>`

### 9.2 获取合作伙伴详情

**接口路径：** `GET /partners/{partnerId}`

**响应数据：** `Partner`

### 9.3 创建合作伙伴

**接口路径：** `POST /partners`

**请求参数：** `Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>`

### 9.4 更新合作伙伴

**接口路径：** `PUT /partners/{partnerId}`

**请求参数：** `Partial<Partner>`

### 9.5 删除合作伙伴

**接口路径：** `DELETE /partners/{partnerId}`

---

## 🔧 10. 核心系统对接接口

### 10.1 批量权益回收

**接口路径：** `POST /core-system/rights-recovery`

**请求参数：** `RightsRecoveryRequest`

**响应数据：** `RightsRecoveryResponse`

### 10.2 补卡申请

**接口路径：** `POST /core-system/replacement`

**请求参数：** `ReplacementRequest`

---

## 📈 11. 报表接口

### 11.1 导出会员卡报表

**接口路径：** `GET /reports/cards/export`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `format`: 导出格式 (`excel` | `pdf`)
- `startDate`: 开始日期 (可选)
- `endDate`: 结束日期 (可选)

**响应：** 文件下载

### 11.2 导出分账报表

**接口路径：** `GET /reports/sharing/export`

**查询参数：**
- `partnerId`: 合作伙伴ID (可选)
- `format`: 导出格式 (`excel` | `pdf`)
- `startDate`: 开始日期 (可选)
- `endDate`: 结束日期 (可选)

---

## 🛡️ 权限控制

### 管理员权限
- 全平台数据访问
- 所有功能模块操作
- 用户和合作伙伴管理
- 系统设置和配置

### 合作伙伴权限
- 仅限自己相关数据
- 会员卡管理 (查看、编辑)
- 分账记录查看
- 对账单查看
- 子合作伙伴管理 (如果有)

### 权限验证
所有接口都会根据用户角色和权限进行访问控制验证。

---

## 🔍 错误代码

| 错误代码 | 错误信息 | 说明 |
|---------|---------|------|
| 401 | 未授权访问 | 用户未登录或token无效 |
| 403 | 禁止访问 | 用户权限不足 |
| 404 | 资源不存在 | 请求的资源未找到 |
| 400 | 请求参数错误 | 请求参数格式或内容错误 |
| 500 | 服务器内部错误 | 服务器处理异常 |

---

## 🚀 开发调试

### Mock 数据切换
在开发环境中，可以通过浏览器控制台使用以下命令切换不同用户身份：

```javascript
// 切换到管理员账号
switchUser("admin")

// 切换到合作伙伴账号
switchUser("partner")

// 查看当前用户信息
getCurrentUser()
```

### 测试账号
- **管理员**: `admin@example.com` / `password`
- **合作伙伴**: `partner001@example.com` / `password`

---

## 📝 更新日志

### v1.0.0 (2024-01-20)
- 初始版本，包含完整的API接口设计
- 支持用户认证、会员卡管理、订单管理、分账管理等核心功能
- 完整的权益回收池和兑换管理功能
- 详细的权限控制和错误处理

---

**文档维护**: 开发团队  
**最后更新**: 2024-01-20  
**版本**: v1.0.0