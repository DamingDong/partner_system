# 分账管理EPIC - 合作伙伴管理系统

## 📋 EPIC概述

### EPIC标识
- **EPIC编号**: EPIC-003
- **EPIC名称**: 分账管理系统
- **业务领域**: 收益分配和结算管理
- **优先级**: P0 (核心功能)

### 业务价值
构建透明、准确、灵活的分账计算引擎，确保合作伙伴收益分配的公平性和可追溯性，提升合作伙伴信任度和业务合作效率。

### 成功指标
- 分账计算准确率 ≥ 99.99%
- 分账处理时效 ≤ 5分钟
- 系统可用性 ≥ 99.9%
- 合作伙伴满意度 ≥ 4.8/5.0

## 🎯 功能范围

### 包含的功能
- 分账规则配置和管理
- 实时分账计算引擎
- 分账明细查询和展示
- 分账数据导出和报表
- 分账异常处理和重算

### 排除的功能
- 支付处理（外部支付网关）
- 资金结算（银行/第三方支付）
- 税务计算（外部税务系统）

## 📊 用户故事映射

### 核心用户故事
| 用户故事 | 优先级 | 状态 | 验收标准 |
|---------|--------|------|----------|
| US-005: 查看分账明细 | P0 | 待开发 | 明确分账规则和计算过程 |
| US-013: 分账规则配置 | P0 | 待开发 | 支持多种分账规则类型配置 |

### 衍生用户故事
| 用户故事 | 优先级 | 状态 | 描述 |
|---------|--------|------|------|
| US-006: 分账规则查询 | P1 | 待开发 | 显示生效规则和适用条件 |
| US-014: 分账异常处理 | P1 | 待开发 | 处理分账计算失败和重算 |
| US-015: 分账报表生成 | P1 | 待开发 | 生成分账统计和分析报表 |
| US-016: 分账数据导出 | P1 | 待开发 | 支持分账数据批量导出 |

## 🔧 技术需求

### 数据模型设计

#### 分账规则模型（扩展）
```typescript
interface RevenueSharingRule {
  id: string;
  ruleType: 'FIXED' | 'TIERED' | 'CONDITIONAL';
  ruleName: string;
  description: string;
  priority: number; // 规则优先级（数字越小优先级越高）
  
  // 适用条件
  applicableOrderTypes: OrderType[]; // ['SUBSCRIPTION']
  applicablePartners?: string[]; // 特定合作伙伴，空表示所有
  applicableProducts?: string[]; // 特定产品，空表示所有
  
  // 固定比例规则
  fixedRate?: number; // 0.7 表示70%
  
  // 阶梯式规则
  tiers?: Array<{
    tierName: string;
    minAmount: number;
    maxAmount?: number; // 不设置表示无上限
    rate: number;
    description?: string;
  }>;
  
  // 条件式规则
  conditions?: Array<{
    conditionId: string;
    field: 'orderAmount' | 'partnerLevel' | 'productType' | 'timePeriod';
    operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
    value: any;
    rate: number;
    description: string;
  }>;
  
  // 状态管理
  isActive: boolean;
  effectiveFrom: string; // 生效时间
  effectiveTo?: string; // 失效时间
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 分账记录模型
```typescript
interface RevenueSharingRecord {
  id: string;
  orderId: string;
  partnerId: string;
  ruleId: string;
  
  // 分账计算基础
  orderAmount: number;
  applicableRule: RevenueSharingRule;
  
  // 分账计算结果
  commissionRate: number; // 实际应用的分账比例
  commissionAmount: number; // 分账金额
  actualAmount: number; // 平台实际收入
  
  // 计算详情
  calculationDetails: {
    appliedTier?: string; // 应用的阶梯名称
    appliedConditions?: string[]; // 应用的条件ID
    calculationFormula?: string; // 计算公式描述
    intermediateSteps?: any[]; // 中间计算步骤
  };
  
  // 状态和审计
  status: 'PENDING' | 'CALCULATED' | 'CONFIRMED' | 'CANCELLED' | 'ERROR';
  errorMessage?: string;
  calculatedAt?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  
  createdAt: string;
  updatedAt: string;
}
```

### API接口规范

#### 分账规则管理API
```typescript
// GET /api/revenue-sharing/rules
interface RuleQueryParams {
  isActive?: boolean;
  ruleType?: RevenueSharingRuleType;
  partnerId?: string;
  page?: number;
  limit?: number;
}

// POST /api/revenue-sharing/rules
interface CreateRuleRequest {
  ruleType: RevenueSharingRuleType;
  ruleName: string;
  description: string;
  priority: number;
  applicableOrderTypes: OrderType[];
  // ... 其他规则参数
}

// PUT /api/revenue-sharing/rules/{ruleId}
interface UpdateRuleRequest {
  ruleName?: string;
  description?: string;
  isActive?: boolean;
  effectiveTo?: string;
}
```

#### 分账计算API
```typescript
// POST /api/revenue-sharing/calculate
interface CalculateRevenueSharingRequest {
  orderId: string;
  forceRecalculation?: boolean; // 强制重新计算
}

interface CalculateRevenueSharingResponse {
  success: boolean;
  data?: {
    record: RevenueSharingRecord;
    calculationLog: string[]; // 计算过程日志
    validationWarnings?: string[]; // 验证警告
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// GET /api/revenue-sharing/records/{orderId}
interface GetRevenueSharingRecordResponse {
  record: RevenueSharingRecord;
  order: Order;
  partner: Partner;
}
```

#### 批量分账计算API
```typescript
// POST /api/revenue-sharing/batch-calculate
interface BatchCalculateRequest {
  orderIds: string[];
  batchSize?: number; // 每批处理数量，默认100
}

interface BatchCalculateResponse {
  batchId: string;
  totalOrders: number;
  processedOrders: number;
  successCount: number;
  errorCount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  results?: Array<{
    orderId: string;
    success: boolean;
    record?: RevenueSharingRecord;
    error?: string;
  }>;
}

// GET /api/revenue-sharing/batch/{batchId}
interface GetBatchStatusResponse {
  batchId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: {
    total: number;
    processed: number;
    percentage: number;
  };
  summary: {
    successCount: number;
    errorCount: number;
    totalAmount: number;
    totalCommission: number;
  };
}
```

## 🎨 用户体验设计

### 分账规则配置页面

#### 设计要点
- **规则类型选择**: 清晰的三类规则选择界面
- **条件配置可视化**: 图形化的条件配置界面
- **实时预览**: 配置过程中实时显示计算效果
- **规则测试**: 支持使用测试数据验证规则

#### 交互规范
- 规则优先级自动排序和冲突检测
- 条件配置支持拖拽和可视化编辑
- 规则生效时间范围验证
- 规则变更历史记录

### 分账明细查询页面

#### 信息架构
```
分账概览
├── 分账统计卡片（总金额、分账金额、订单数）
├── 时间趋势图表
└── 合作伙伴分布

分账明细列表
├── 多维度筛选（时间、合作伙伴、订单类型）
├── 分账状态筛选（待计算、已计算、异常）
└── 批量操作（导出、重算）

分账详情面板
├── 订单基本信息
├── 分账规则应用详情
├── 计算过程明细
└── 分账状态和历史
```

#### 数据可视化
- **分账比例饼图**: 显示不同规则类型的分布
- **时间趋势折线图**: 分账金额随时间变化
- **合作伙伴柱状图**: 各合作伙伴分账对比
- **规则效果热力图**: 规则应用效果分析

## 🚀 实施计划

### 阶段一：分账规则引擎 (3周)
**目标**: 构建核心分账计算能力
- 分账规则数据模型和API
- 分账计算算法实现
- 规则优先级和冲突解决
- 基础的分账记录管理

### 阶段二：分账管理界面 (2周)
**目标**: 提供规则配置和查询界面
- 规则配置页面开发
- 分账明细查询界面
- 分账状态管理功能
- 基础的数据可视化

### 阶段三：批量处理和优化 (2周)
**目标**: 提升处理能力和用户体验
- 批量分账计算功能
- 性能优化和缓存策略
- 高级筛选和搜索功能
- 异常处理和完善

### 阶段四：高级功能 (1周)
**目标**: 完善分账管理能力
- 分账报表和分析功能
- 数据导出和集成能力
- 监控和告警机制
- 用户体验优化

## 📈 业务规则

### 核心业务规则

#### BR-021: 分账规则适用性规则
- 分账规则仅适用于订阅订单（SUBSCRIPTION）
- 激活订单（ACTIVATION）不参与分账计算
- 规则生效时间必须有效且不重叠（同一优先级）
- 规则优先级数字越小优先级越高

#### BR-022: 分账计算规则
- 分账金额计算精度保留2位小数
- 计算过程必须可追溯和验证
- 分账比例必须在合理范围内（0-100%）
- 阶梯式规则必须连续且不重叠

#### BR-023: 规则冲突解决规则
- 高优先级规则覆盖低优先级规则
- 相同优先级规则按创建时间先后应用
- 条件式规则的条件必须互斥或明确优先级
- 规则冲突必须记录和告警

### 异常处理规则

#### BR-024: 分账异常处理规则
- 分账计算失败必须记录详细错误信息
- 支持手动重算和自动重试机制
- 异常记录需要人工审核和处理
- 分账异常必须及时通知相关人员

#### BR-025: 数据一致性规则
- 分账记录必须与订单数据一致
- 规则变更不影响已确认的分账记录
- 分账重算必须生成新的版本记录
- 审计日志必须完整记录所有变更

## 🔒 安全要求

### 数据安全
- 分账规则配置需要权限验证
- 分账计算记录需要数据权限控制
- 敏感操作需要二次确认
- 所有变更需要审计日志

### 业务安全
- 分账规则变更需要审批流程
- 重要分账计算需要复核机制
- 分账数据导出需要权限控制
- 系统需要防止重复计算和漏算

## 🧪 测试策略

### 单元测试
- 分账计算算法测试
- 规则优先级和冲突测试
- 数据验证规则测试
- 异常场景测试

### 集成测试
- API接口集成测试
- 规则引擎集成测试
- 数据库事务测试
- 批量处理测试

### 端到端测试
- 完整分账业务流程测试
- 规则配置和计算验证
- 性能和安全测试
- 用户体验测试

### 性能测试
- 单订单分账计算性能
- 批量分账处理性能
- 高并发场景测试
- 大数据量查询性能

---

**EPIC版本**: v1.0  
**创建日期**: 2025-01-05  
**负责人**: 产品经理  
**技术负责人**: 待指定  
**预计完成时间**: 2025-03-15