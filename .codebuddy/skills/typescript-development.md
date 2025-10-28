# TypeScript 开发技能

## 技能概述
为合作伙伴管理系统提供专业的 TypeScript 开发技能，包括类型定义、接口设计、类型安全等。

## 核心能力

### 1. 类型系统
- 接口和类型别名定义
- 泛型编程
- 联合类型和交叉类型
- 类型守卫和类型推断

### 2. 项目配置
- tsconfig.json 配置优化
- 严格模式设置
- 路径别名配置
- 类型检查规则

### 3. 错误处理
- 编译时错误检测
- 运行时类型安全
- 自定义错误类型
- 类型断言和转换

## 最佳实践

### 类型定义规范
- 使用接口定义数据模型
- 避免使用 any 类型
- 合理使用 unknown 类型
- 类型注释和文档

### 项目结构
- 类型定义集中管理
- 模块化类型导出
- 第三方库类型集成
- 自定义类型工具

## 项目特定类型

### 核心数据类型
```typescript
// 用户相关类型
interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  partnerId?: string;
}

// 合作伙伴类型
interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  commissionRate: number;
  status: PartnerStatus;
}

// 会员卡类型
interface MembershipCard {
  id: string;
  cardNumber: string;
  cardType: CardType;
  status: CardStatus;
  remainingAmount: number;
}

// 订单类型
interface Order {
  id: string;
  orderType: 'ACTIVATION' | 'SUBSCRIPTION';
  orderAmount: number;
  commissionAmount: number;
  status: OrderStatus;
}
```

### 枚举和常量
```typescript
// 用户角色
enum UserRole {
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  OPERATOR = 'OPERATOR'
}

// 会员卡状态
enum CardStatus {
  PENDING_BIND = 'PENDING_BIND',
  BOUND = 'BOUND',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

// 订单状态
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}
```

## 工具和配置

### 开发工具
- TypeScript 编译器配置
- ESLint TypeScript 规则
- Prettier TypeScript 支持
- 类型检查脚本

### 构建优化
- 类型声明生成
- 树摇优化
- 模块解析优化
- 打包配置