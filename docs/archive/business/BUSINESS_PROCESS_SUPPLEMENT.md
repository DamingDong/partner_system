# 三方合作伙伴系统 - 业务流程补充文档

## 📋 文档说明
本文档是对现有PRD的补充，详细描述了系统的核心业务流程、条件式分账规则、异常处理机制等关键业务细节。

---

## 🔄 核心业务流程详解

### 1. 条件式分账业务流程

#### 1.1 条件式分账规则类型
条件式分账是基于特定业务条件进行的分账计算，支持以下条件类型：

**时间条件**
- 工作日/周末分账比例不同
- 节假日特殊分账规则
- 特定时间段优惠分账

**用户条件**
- 新用户首次消费分账
- VIP用户特殊分账比例
- 用户等级分账差异

**交易条件**
- 交易金额区间分账
- 交易频次分账
- 交易类型分账

**渠道条件**
- 不同销售渠道分账差异
- 推广渠道分账奖励
- 直销vs分销分账区别

#### 1.2 条件判断流程图
```mermaid
flowchart TD
    A[交易触发] --> B[获取交易信息]
    B --> C{匹配条件规则}
    C --> D{时间条件?}
    D -->|是| E[检查时间范围]
    D -->|否| F{用户条件?}
    E --> G{时间匹配?}
    G -->|是| F
    G -->|否| H[跳过此规则]
    F -->|是| I[检查用户属性]
    F -->|否| J{交易条件?}
    I --> K{用户匹配?}
    K -->|是| J
    K -->|否| H
    J -->|是| L[检查交易属性]
    J -->|否| M{渠道条件?}
    L --> N{交易匹配?}
    N -->|是| M
    N -->|否| H
    M -->|是| O[检查渠道信息]
    M -->|否| P[应用默认规则]
    O --> Q{渠道匹配?}
    Q -->|是| R[计算分账金额]
    Q -->|否| H
    R --> S[生成分账记录]
    P --> S
    H --> T[记录未匹配日志]
    T --> U[结束]
    S --> U
```

#### 1.3 条件式分账配置示例
```typescript
// 条件式分账规则配置
interface ConditionalRevenueRule {
  id: string;
  name: string;
  description: string;
  conditions: ConditionGroup[];
  calculations: CalculationRule[];
  priority: number;
  isActive: boolean;
}

// 条件组定义
interface ConditionGroup {
  operator: 'AND' | 'OR';
  conditions: Condition[];
}

// 单个条件定义
interface Condition {
  type: 'time' | 'user' | 'transaction' | 'channel';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  field: string;
  value: any;
}

// 实际配置示例
const weekendPromotionRule: ConditionalRevenueRule = {
  id: "rule_weekend_promotion",
  name: "周末促销活动分账",
  description: "周末消费享受特殊分账比例",
  conditions: [
    {
      operator: 'AND',
      conditions: [
        {
          type: 'time',
          operator: 'in',
          field: 'day_of_week',
          value: [6, 0] // 周六、周日
        },
        {
          type: 'transaction',
          operator: 'greater_than',
          field: 'amount',
          value: 100
        }
      ]
    }
  ],
  calculations: [
    {
      partnerId: 'partner_001',
      percentage: 75, // 周末提升至75%
      minAmount: 0,
      maxAmount: 5000
    }
  ],
  priority: 80,
  isActive: true
};
```

### 2. 会员卡全生命周期业务流程

#### 2.1 会员卡创建流程
```mermaid
flowchart TD
    A[创建会员卡申请] --> B{验证创建权限}
    B -->|无权限| C[返回权限错误]
    B -->|有权限| D[填写会员卡信息]
    D --> E{信息验证}
    E -->|无效| F[返回验证错误]
    E -->|有效| G[生成会员卡号]
    G --> H[设置初始状态]
    H --> I[保存会员卡信息]
    I --> J[记录创建日志]
    J --> K[发送创建通知]
    K --> L[返回创建结果]
```

#### 2.2 会员卡绑定详细流程
```mermaid
flowchart TD
    A[发起绑卡请求] --> B{验证会员卡状态}
    B -->|已绑定| C[返回已绑定错误]
    B -->|未绑定| D[选择绑定方式]
    D --> E{绑定方式}
    E -->|MAC地址| F[输入MAC地址]
    E -->|渠道包| G[选择渠道包]
    E -->|设备ID| H[获取设备信息]
    F --> I{验证MAC唯一性}
    G --> J{验证渠道包有效性}
    H --> K{验证设备ID唯一性}
    I -->|已存在| L[返回重复错误]
    J -->|无效| M[返回无效错误]
    K -->|已存在| L
    I -->|唯一| N[输入手机号]
    J -->|有效| N
    K -->|唯一| N
    N --> O{验证手机号}
    O -->|无效| P[返回手机错误]
    O -->|有效| Q[确认绑定信息]
    Q --> R[执行绑定操作]
    R --> S[更新会员卡状态]
    S --> T[记录绑定日志]
    T --> U[发送绑定通知]
    U --> V[返回绑定成功]
```

### 3. 分账计算完整流程

#### 3.1 实时分账计算流程
```mermaid
flowchart TD
    A[交易完成] --> B[获取交易详情]
    B --> C{识别交易类型}
    C --> D[获取相关会员卡]
    D --> E[确定合作伙伴]
    E --> F[加载分账规则]
    F --> G{规则排序}
    G --> H[应用最高优先级规则]
    H --> I{检查条件}
    I -->|满足| J[计算分账金额]
    I -->|不满足| K[检查下一条规则]
    K --> H
    J --> L[验证金额合法性]
    L -->|不合法| M[记录异常]
    L -->|合法| N[生成分账记录]
    N --> O[更新账户余额]
    O --> P[触发对账更新]
    P --> Q[发送分账通知]
    Q --> R[记录操作日志]
```

#### 3.2 分账金额计算逻辑
```typescript
// 分账计算引擎
class RevenueCalculationEngine {
  calculateSharing(transaction: Transaction): SharingResult {
    const rules = this.getApplicableRules(transaction);
    const sortedRules = this.sortRulesByPriority(rules);
    
    for (const rule of sortedRules) {
      if (this.evaluateConditions(rule.conditions, transaction)) {
        return this.applyCalculation(rule.calculations, transaction);
      }
    }
    
    return this.applyDefaultCalculation(transaction);
  }

  private evaluateConditions(conditions: ConditionGroup[], transaction: Transaction): boolean {
    return conditions.every(group => 
      group.operator === 'AND' 
        ? group.conditions.every(c => this.evaluateCondition(c, transaction))
        : group.conditions.some(c => this.evaluateCondition(c, transaction))
    );
  }

  private evaluateCondition(condition: Condition, transaction: Transaction): boolean {
    const value = this.getFieldValue(transaction, condition.field);
    
    switch (condition.operator) {
      case 'equals': return value === condition.value;
      case 'not_equals': return value !== condition.value;
      case 'greater_than': return value > condition.value;
      case 'less_than': return value < condition.value;
      case 'in': return condition.value.includes(value);
      case 'not_in': return !condition.value.includes(value);
      default: return false;
    }
  }
}
```

### 4. 对账业务流程

#### 4.1 自动对账生成流程
```mermaid
flowchart TD
    A[到达对账周期] --> B{检查对账状态}
    B -->|已生成| C[跳过生成]
    B -->|未生成| D[收集交易数据]
    D --> E[收集分账数据]
    E --> F[计算汇总信息]
    F --> G{数据校验}
    G -->|异常| H[记录异常日志]
    G -->|正常| I[生成对账单]
    I --> J[生成PDF文件]
    J --> K[保存对账记录]
    K --> L[发送对账通知]
    L --> M[更新对账状态]
```

#### 4.2 手动对账触发流程
```mermaid
flowchart TD
    A[用户发起对账] --> B{验证用户权限}
    B -->|无权限| C[返回权限错误]
    B -->|有权限| D[选择对账周期]
    D --> E{选择合作伙伴}
    E --> F{确认对账信息}
    F --> G[触发对账计算]
    G --> H{计算完成?}
    H -->|失败| I[返回计算错误]
    H -->|成功| J[生成对账单]
    J --> K[预览对账单]
    K --> L{用户确认?}
    L -->|否| M[取消操作]
    L -->|是| N[保存对账单]
    N --> O[发送确认通知]
```

### 5. 异常处理与补偿机制

#### 5.1 分账计算异常处理
```mermaid
flowchart TD
    A[分账计算异常] --> B{异常类型识别}
    B --> C[数据异常]
    B --> D[计算异常]
    B --> E[系统异常]
    C --> F[记录数据异常]
    D --> G[记录计算异常]
    E --> H[记录系统异常]
    F --> I[标记待处理]
    G --> J[重试计算]
    H --> K[发送告警通知]
    J --> L{重试成功?}
    L -->|是| M[更新状态]
    L -->|否| I
    M --> N[发送成功通知]
    I --> O[人工介入处理]
```

#### 5.2 补偿机制设计
```typescript
// 分账补偿机制
interface CompensationService {
  // 检测需要补偿的交易
  detectCompensationNeeds(): Promise<CompensationItem[]>;
  
  // 执行补偿计算
  executeCompensation(items: CompensationItem[]): Promise<CompensationResult>;
  
  // 记录补偿日志
  recordCompensationLog(result: CompensationResult): Promise<void>;
}

// 补偿项目定义
interface CompensationItem {
  originalTransactionId: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
  compensationReason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}
```

### 6. 业务规则引擎

#### 6.1 规则优先级系统
```typescript
// 规则优先级管理
class RulePriorityManager {
  private static readonly PRIORITY_LEVELS = {
    EMERGENCY: 100,    // 紧急规则
    HIGH: 80,         // 高优先级
    NORMAL: 50,       // 普通优先级
    LOW: 20,          // 低优先级
    DEFAULT: 0        // 默认规则
  };

  calculatePriority(rule: RevenueRule): number {
    let priority = rule.basePriority || this.PRIORITY_LEVELS.NORMAL;
    
    // 时间敏感性调整
    if (this.isTimeSensitive(rule)) {
      priority += 10;
    }
    
    // 合作伙伴等级调整
    priority += this.getPartnerLevelBonus(rule.partnerId);
    
    // 交易金额调整
    priority += this.getAmountBonus(rule.minAmount);
    
    return Math.min(priority, this.PRIORITY_LEVELS.EMERGENCY);
  }
}
```

### 7. 业务监控指标

#### 7.1 关键业务指标(KBI)
| 指标名称 | 定义 | 目标值 | 监控频率 |
|---------|------|--------|----------|
| 分账准确率 | 正确分账交易数/总交易数 | ≥99.9% | 实时 |
| 对账及时率 | 按时完成对账周期数/总周期数 | ≥99% | 每日 |
| 绑卡成功率 | 成功绑卡数/总绑卡申请数 | ≥95% | 实时 |
| 异常处理率 | 已处理异常数/总异常数 | ≥98% | 每小时 |
| 业务响应时间 | 业务流程平均完成时间 | ≤5秒 | 实时 |

#### 7.2 业务健康检查
```typescript
// 业务健康检查服务
class BusinessHealthCheck {
  async checkRevenueAccuracy(): Promise<HealthStatus> {
    const stats = await this.calculateRevenueStats();
    return {
      status: stats.accuracy >= 0.999 ? 'HEALTHY' : 'UNHEALTHY',
      metrics: stats,
      recommendations: this.generateRecommendations(stats)
    };
  }

  async checkReconciliationHealth(): Promise<HealthStatus> {
    const overdue = await this.findOverdueReconciliations();
    return {
      status: overdue.length === 0 ? 'HEALTHY' : 'WARNING',
      overdueCount: overdue.length,
      overdueDetails: overdue
    };
  }
}
```

---

## 📊 实施路线图

### Phase 1: 基础业务流程 (1-2周)
- [ ] 实现条件式分账规则引擎
- [ ] 完善会员卡生命周期管理
- [ ] 建立异常处理机制

### Phase 2: 高级业务功能 (2-3周)
- [ ] 实现业务规则优先级系统
- [ ] 增加补偿机制
- [ ] 完善业务监控体系

### Phase 3: 优化与扩展 (1-2周)
- [ ] 性能优化
- [ ] 业务规则可视化配置
- [ ] 高级报表功能

---

## 🔗 相关文档
- [主PRD文档](./prd.md)
- [API接口规范](./api-spec.md)
- [数据模型设计](./data-model.md)
- [测试用例文档](./test-cases.md)

**文档版本**: v1.0  
**最后更新**: 2025-01-05  
**文档作者**: AI助手