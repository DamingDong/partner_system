# 权益回收池管理EPIC - 合作伙伴管理系统

## 📋 EPIC概述

### EPIC标识
- **EPIC编号**: EPIC-004
- **EPIC名称**: 权益回收池管理系统
- **业务领域**: 会员权益回收和批量兑换管理
- **优先级**: P0 (核心功能)

### 业务价值
构建完整的权益回收池管理系统，实现会员权益回收天数的池化管理，为合作伙伴提供灵活的批量兑换能力，提升资源利用效率和业务灵活性。

### 成功指标
- 回收池数据准确率 ≥ 99.99%
- 回收审批处理时效 ≤ 30秒
- 批量兑换成功率 ≥ 99.5%
- 合作伙伴满意度 ≥ 4.7/5.0

## 🎯 功能范围

### 包含的功能
- 权益回收申请和审批管理
- 回收池状态监控和统计
- 批量兑换申请和处理
- 回收池操作记录审计
- 回收限制和业务规则管理

### 排除的功能
- 会员卡激活和基础管理（已在CARD_LIFECYCLE EPIC中）
- 分账计算和结算（已在REVENUE_SHARING EPIC中）
- 硬件设备管理（外部系统集成）

## 📊 用户故事映射

### 核心用户故事
| 用户故事 | 优先级 | 状态 | 验收标准 |
|---------|--------|------|----------|
| US-011: 查看回收池状态 | P0 | 待开发 | 实时显示可用天数、使用率等信息 |
| US-012: 权益回收审批 | P0 | 待开发 | 支持单个和批量权益回收审批 |
| US-013: 批量兑换申请 | P1 | 待分析 | 基于回收池天数的会员卡批量生成 |

### 衍生用户故事
| 用户故事 | 优先级 | 状态 | 描述 |
|---------|--------|------|------|
| US-014: 回收池统计报表 | P1 | 待分析 | 回收池使用趋势和统计分析 |
| US-015: 回收限制管理 | P1 | 待分析 | MAC地址回收次数限制管理 |
| US-016: 回收池调整记录 | P2 | 待分析 | 手动调整回收池天数的记录管理 |

## 🔧 技术需求

### 数据模型设计

#### 回收池核心模型
```typescript
interface RecoveryPool {
  id: string;
  partnerId: string;
  totalDays: number;        // 总天数
  usedDays: number;         // 已使用天数
  availableDays: number;    // 可用天数
  status: RecoveryPoolStatus;
  lastUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 回收池状态枚举
enum RecoveryPoolStatus {
  ACTIVE = 'ACTIVE',        // 活跃
  SUSPENDED = 'SUSPENDED',  // 暂停
  CLOSED = 'CLOSED'         // 关闭
}
```

#### 回收池记录模型
```typescript
interface RecoveryPoolRecord {
  id: string;
  poolId: string;
  partnerId: string;
  type: RecoveryPoolRecordType;
  days: number;
  description: string;
  sourceId?: string;        // 关联源ID（如回收申请ID）
  sourceType?: string;      // 关联源类型
  operatorId?: string;      // 操作人ID
  createdAt: string;
}

// 回收池记录类型枚举
enum RecoveryPoolRecordType {
  RECOVERY = 'RECOVERY',      // 权益回收入池
  EXCHANGE = 'EXCHANGE',      // 批量兑换消耗
  ADJUSTMENT = 'ADJUSTMENT'   // 手动调整
}
```

#### 批量兑换申请模型
```typescript
interface BatchExchangeRequest {
  id: string;
  partnerId: string;
  requestedDays: number;     // 申请兑换天数
  cardCount: number;         // 申请生成卡数量
  status: ExchangeRequestStatus;
  approvedDays?: number;     // 批准兑换天数
  actualUsedDays?: number;  // 实际使用天数
  operatorId: string;
  approvalNotes?: string;    // 审批备注
  approvedAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 兑换申请状态枚举
enum ExchangeRequestStatus {
  PENDING = 'PENDING',        // 待审批
  APPROVED = 'APPROVED',      // 已批准
  PROCESSED = 'PROCESSED',    // 已处理
  REJECTED = 'REJECTED',      // 已拒绝
  CANCELLED = 'CANCELLED'     // 已取消
}
```

### API接口规范

#### 回收池管理API
```typescript
// GET /api/recovery-pool/{partnerId}
interface GetRecoveryPoolResponse {
  pool: RecoveryPool;
  stats: {
    totalRecoveryCount: number;
    totalExchangeCount: number;
    monthlyUsage: number;
    utilizationRate: number;
  };
}

// GET /api/recovery-pool/{partnerId}/records
interface GetRecoveryPoolRecordsRequest {
  type?: RecoveryPoolRecordType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface GetRecoveryPoolRecordsResponse {
  records: RecoveryPoolRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

#### 权益回收审批API
```typescript
// POST /api/recovery-pool/process-recovery
interface ProcessRecoveryRequest {
  redemptionRequestId: string;
  partnerId: string;
  days: number;
  description: string;
  operatorId: string;
}

// POST /api/recovery-pool/batch-recovery
interface BatchRecoveryRequest {
  batchId: string;
  partnerId: string;
  totalDays: number;
  count: number;
  operatorId: string;
}
```

#### 批量兑换API
```typescript
// POST /api/recovery-pool/exchange-request
interface CreateExchangeRequest {
  partnerId: string;
  requestedDays: number;
  cardCount: number;
  operatorId: string;
}

// POST /api/recovery-pool/process-exchange
interface ProcessExchangeRequest {
  exchangeRequestId: string;
  partnerId: string;
  usedDays: number;
  cardCount: number;
  operatorId: string;
}
```

## 🎨 用户体验设计

### 回收池状态展示

#### 设计要点
- **实时状态卡片**: 在统计概览区域显示回收池关键指标
- **使用率可视化**: 进度条直观显示回收池使用情况
- **快速操作入口**: 一键跳转到回收池管理页面

#### 信息架构
```
回收池概览卡片
├── 可用天数（突出显示）
├── 总计天数
├── 已用天数和比例
└── 使用率进度条

回收池管理页面
├── 回收池状态区域
├── 操作记录列表
├── 批量兑换申请区域
└── 统计图表区域
```

### 权益回收审批界面

#### 交互规范
- **单个审批**: 模态框操作，显示详细回收信息
- **批量审批**: 多选功能，支持一键批量处理
- **状态标识**: 清晰的状态标识和操作反馈
- **回收限制提示**: 自动检查并提示回收限制

### 批量兑换申请流程

#### 业务流程
1. **申请提交**: 合作伙伴提交批量兑换申请
2. **余额检查**: 系统自动检查回收池余额是否充足
3. **审批流程**: 管理员审批兑换申请
4. **卡片生成**: 审批通过后自动生成会员卡
5. **天数扣除**: 从回收池扣除相应天数

## 🚀 实施计划

### 阶段一：回收池基础功能 (2周)
**目标**: 构建回收池核心管理能力
- 回收池数据模型和API
- 权益回收审批流程
- 基础的状态展示界面
- 操作记录审计功能

### 阶段二：批量兑换功能 (2周)
**目标**: 实现批量兑换完整流程
- 批量兑换申请管理
- 兑换审批流程
- 会员卡批量生成
- 回收池天数扣除

### 阶段三：高级功能 (1周)
**目标**: 完善回收池管理能力
- 统计报表和分析功能
- 回收限制管理
- 通知和告警机制
- 用户体验优化

## 📈 业务规则

### 核心业务规则

#### BR-031: 权益回收规则
- 每个MAC地址最多支持3次回收，超过后禁止回收
- 回收天数计算基于会员卡实际剩余有效天数
- 回收申请必须经过管理员审批
- 回收成功后自动入池，不可撤销

#### BR-032: 回收池管理规则
- 回收池天数只能通过权益回收增加
- 批量兑换是唯一的天数消耗方式
- 回收池状态变更需要权限控制
- 操作记录必须完整可追溯

#### BR-033: 批量兑换规则
- 兑换申请需要管理员审批
- 兑换天数必须小于等于回收池可用天数
- 生成的会员卡遵循标准会员卡规则
- 兑换成功后自动扣除相应天数

### 异常处理规则

#### BR-034: 回收异常处理
- 回收审批失败必须记录详细原因
- 回收池余额不足时禁止兑换
- 回收限制违规必须明确提示
- 异常操作需要人工审核

## 🔒 安全要求

### 权限控制
- 回收池查看权限：所有合作伙伴角色
- 权益回收审批权限：管理员角色
- 批量兑换审批权限：管理员角色
- 回收池调整权限：超级管理员角色

### 数据安全
- 回收池操作需要完整审计日志
- 敏感操作需要二次确认
- 数据导出需要权限控制
- 所有变更需要版本记录

## 🧪 测试策略

### 单元测试
- 回收池计算算法测试
- 回收限制验证测试
- 兑换申请流程测试
- 异常场景处理测试

### 集成测试
- API接口集成测试
- 回收池与会员卡服务集成
- 批量处理功能测试
- 权限控制验证测试

### 端到端测试
- 完整权益回收业务流程
- 批量兑换申请和审批流程
- 回收池状态同步测试
- 用户体验和性能测试

---

**EPIC版本**: v1.0  
**创建日期**: 2025-01-05  
**负责人**: 产品经理  
**技术负责人**: 待指定  
**预计完成时间**: 2025-02-28