# EPIC: 会员卡代理商管理系统

## 📋 EPIC概述

### EPIC标识
- **EPIC编号**: EPIC-CARD-AGENT
- **EPIC名称**: 会员卡代理商业务管理系统
- **业务领域**: 会员卡代理业务全流程管理
- **优先级**: P0 (核心功能)
- **关联角色**: 会员卡代理商

### 业务价值
为会员卡代理商提供完整的会员卡业务管理能力，包括卡池导入、设备绑定、激活跟踪、权益回收和兑换，支持代理商独立开展会员卡业务。

### 成功指标
- 卡池导入成功率 ≥ 99.5%
- 设备绑定准确率 ≥ 99.9%
- 权益回收操作成功率 ≥ 98%
- 系统响应时间 ≤ 2秒

## 🎯 功能范围

### 包含的功能
- 会员卡池管理（F005）
- MAC地址绑定管理（F006）
- 激活订单管理（F007）
- 设备管理（F008）
- 会员权益回收池管理（F009-F010）

### 用户故事映射

#### 核心用户故事 (P0)
| 用户故事 | 验收标准 | 优先级 |
|---------|----------|--------|
| **US-CA-001**: 作为会员卡代理商，我希望能够导入和管理会员卡池，以便建立会员卡库存 | - Excel模板批量导入（1000张/次）<br>- 会员卡库存状态监控<br>- 自有卡池基础信息管理 | P0 |
| **US-CA-002**: 作为会员卡代理商，我希望能够绑定MAC地址到设备，以便完成设备激活准备 | - 标准Excel模板下载和导入<br>- MAC地址格式校验和重复检查<br>- 绑定失败错误报告 | P0 |
| **US-CA-003**: 作为会员卡代理商，我希望能够查看激活订单，以便了解业务运营情况 | - 查看自有激活订单<br>- 按时间、渠道、MAC等条件筛选<br>- 激活状态跟踪 | P0 |
| **US-CA-004**: 作为会员卡代理商，我希望能够管理自有设备，以便监控设备状态 | - 查看已绑定设备激活状态<br>- 设备绑定历史记录查询<br>- 设备异常状态告警 | P0 |
| **US-CA-005**: 作为会员卡代理商，我希望能够回收会员权益，以便重新利用未使用权益 | - 自有设备的权益回收操作<br>- 单个和批量MAC地址回收<br>- 回收次数限制验证（最多3次） | P0 |
| **US-CA-006**: 作为会员卡代理商，我希望能够兑换会员卡，以便基于回收池余额生成新卡 | - 基于自有回收池余额的兑换<br>- 兑换数量配置和余额验证<br>- 新会员卡生成和分配 | P0 |

## 🔧 技术实现

### 数据模型设计
```typescript
interface CardAgentBusiness {
  id: string;
  partnerId: string;
  // 卡池管理
  cardPool: CardPoolInfo;
  // 设备绑定管理
  deviceBindings: DeviceBinding[];
  // 激活订单管理
  activationOrders: ActivationOrder[];
  // 回收池管理
  recoveryPool: RecoveryPool;
  // 权限范围
  dataScope: DataScope;
}

interface DataScope {
  // 数据权限范围
  cardPoolIds: string[];
  deviceIds: string[];
  orderIds: string[];
  // 操作权限
  permissions: string[];
}
```

### API接口规范
```typescript
// 卡池管理API
interface CardPoolAPI {
  // 导入会员卡池
  POST /api/agents/card-pool/import
  // 获取卡池列表
  GET /api/agents/card-pool
  // 获取卡池统计
  GET /api/agents/card-pool/stats
}

// 设备绑定API
interface DeviceBindingAPI {
  // 导入MAC地址绑定
  POST /api/agents/device-binding/import
  // 获取设备绑定列表
  GET /api/agents/device-binding
  // 获取绑定错误报告
  GET /api/agents/device-binding/errors
}

// 回收池管理API
interface RecoveryPoolAPI {
  // 权益回收操作
  POST /api/agents/recovery-pool/recover
  // 兑换申请
  POST /api/agents/recovery-pool/exchange
  // 获取回收池状态
  GET /api/agents/recovery-pool/status
}
```

## 🚀 实施计划

### 阶段一：卡池和设备绑定 (3周)
- 会员卡池导入功能
- MAC地址绑定管理
- 数据权限隔离实现

### 阶段二：激活和订单管理 (2周)
- 激活订单查看功能
- 设备状态跟踪
- 业务数据统计

### 阶段三：权益回收池 (2周)
- 权益回收操作功能
- 兑换管理功能
- 回收池状态监控

---

**EPIC状态**: 待开发  
**优先级**: P0  
**预计工时**: 7周  
**关联功能**: F005-F010