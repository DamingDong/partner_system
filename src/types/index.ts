// 用户角色枚举
export enum UserRole {
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  OPERATOR = 'OPERATOR'
}

// 合作伙伴类型
export enum PartnerType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY'
}

// 合作伙伴状态
export enum PartnerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// 会员卡类型
export enum CardType {
  REGULAR = 'REGULAR',  // 普通卡：只需卡密和手机号激活
  BOUND = 'BOUND'       // 绑定卡：需卡密、手机号、MAC地址、渠道包
}

// 会员卡状态
export enum CardStatus {
  UNACTIVATED = 'UNACTIVATED',  // 待激活（活跃）
  INACTIVE = 'INACTIVE',        // 未激活
  BOUND = 'BOUND',              // 已绑定
  EXPIRED = 'EXPIRED',          // 已过期
  CANCELLED = 'CANCELLED'       // 已销卡（用户退款后权益已回收）
}

// 绑定类型
export enum BindingType {
  MAC_ADDRESS = 'MAC_ADDRESS',
  CHANNEL_PACKAGE = 'CHANNEL_PACKAGE'
}

// 订单类型
export enum OrderType {
  ACTIVATION = 'ACTIVATION',     // 会员卡激活订单
  SUBSCRIPTION = 'SUBSCRIPTION'  // 用户自主订阅订单
}

// 订单状态
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// 交易类型
export enum TransactionType {
  PURCHASE = 'PURCHASE',
  CONSUMPTION = 'CONSUMPTION',
  REFUND = 'REFUND'
}

// 交易状态
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// 分账状态
export enum SharingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// 对账单状态
export enum ReconciliationStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  RECONCILED = 'RECONCILED'
}

// 用户信息
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  partnerId?: string;
  createdAt: string;
  updatedAt: string;
}

// 合作伙伴信息
export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  parentId?: string;
  level: number;
  commissionRate: number;
  status: PartnerStatus;
  contactInfo: ContactInfo;
  createdAt: string;
  updatedAt: string;
}

// 联系信息
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
}

// 会员卡信息
export interface MembershipCard {
  id: string;                    // 会员卡ID
  cardNumber: string;            // 卡号
  cardType: CardType;            // 卡类型
  status: CardStatus;            // 卡状态
  partnerId: string;             // 合作伙伴ID
  batchId: string;               // 批次ID
  activationDate?: string;       // 激活时间
  expiryDate?: string;           // 到期时间
  bindingInfo?: BindingInfo;     // 绑定信息
  remainingDays?: number;        // 剩余天数
  userId?: string;               // 用户ID
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
}

// 绑定信息
export interface BindingInfo {
  phoneNumber: string;           // 手机号
  macAddress?: string;           // MAC地址（绑定卡需要）
  channelPackage?: string;       // 渠道包（绑定卡需要）
  bindingTime: string;           // 绑定时间
  deviceInfo?: DeviceInfo;       // 设备信息
}

// 设备信息
export interface DeviceInfo {
  deviceName: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
}

// 分账规则
export interface RevenueSharingRule {
  id: string;
  partnerId: string;
  ruleType: string;
  commissionRate: number;
  conditions: RuleCondition[];
  priority: number;
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
}

// 规则条件
export interface RuleCondition {
  field: string;
  operator: string;
  value: string | number;
}

// 交易记录
export interface Transaction {
  id: string;
  cardId: string;
  partnerId: string;
  amount: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  metadata: TransactionMetadata;
  createdAt: string;
}

// 交易元数据
export interface TransactionMetadata {
  description: string;
  source: string;
  reference: string;
}

// 分账记录
export interface SharingRecord {
  id: string;
  transactionId: string;
  fromPartnerId: string;
  toPartnerId: string;
  amount: number;
  rate: number;
  ruleId: string;
  status: SharingStatus;
  settledAt?: string;
  createdAt: string;
}

// 对账单
export interface ReconciliationStatement {
  id: string;
  partnerId: string;
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalSharing: number;
  netAmount: number;
  status: ReconciliationStatus;
  details: ReconciliationDetail[];
  filePath?: string;
  createdAt: string;
}

// 对账单明细
export interface ReconciliationDetail {
  id: string;
  statementId: string;
  transactionId: string;
  sharingRecordId?: string;
  description: string;
  amount: number;
  type: string;
}

// 使用记录
export interface UsageRecord {
  id: string;
  cardId: string;
  amount: number;
  description: string;
  metadata: UsageMetadata;
  createdAt: string;
}

// 使用元数据
export interface UsageMetadata {
  deviceInfo?: DeviceInfo;
  location?: string;
  source: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  permissions: string[];
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 日期范围
export interface DateRange {
  startDate: string;
  endDate: string;
}

// 卡片筛选条件
export interface CardFilters extends PaginationParams {
  cardType?: CardType;
  status?: CardStatus;
  partnerId?: string;
  keyword?: string;
}

// 绑定数据
export interface BindingData {
  phoneNumber: string;
  macAddress?: string;
  channelPackage?: string;
  bindingType: BindingType;
  deviceInfo?: DeviceInfo;
}

// 仪表板数据
export interface DashboardData {
  totalCards: number;
  activeCards: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalSharing: number;
  monthlySharing: number;
  pointsBalance?: number;        // 积分余额
  recentTransactions: Transaction[];
  revenueChart: ChartData[];
  cardStats?: {
    unactivated: number;
    bound: number;
    expired: number;
    cancelled: number;
  };
  sharingStats?: {
    totalReceived: number;
    totalPaid: number;
    sharingCount: number;
  };
}

// 图表数据
export interface ChartData {
  date: string;
  revenue: number;
  sharing: number;
}

// KPI指标
export interface KPIMetrics {
  cardUtilizationRate: number;
  averageTransactionAmount: number;
  partnerGrowthRate: number;
  reconciliationAccuracy: number;
}

// ===== 新增：会员卡批次管理相关类型 =====

// 会员卡批次
export interface CardBatch {
  id: string;                    // 批次ID
  batchNumber: string;           // 批次号
  name: string;                  // 批次名称
  partnerId: string;             // 合作伙伴ID
  totalCards: number;            // 总卡数
  activatedCards: number;        // 已激活卡数
  status: 'imported' | 'processing' | 'completed';  // 批次状态
  importMethod: 'file' | 'api';  // 导入方式
  createdAt: string;             // 创建时间
  createdBy: string;             // 创建人
}

// 会员卡导入请求
export interface ImportCardsRequest {
  partnerId: string;             // 合作伙伴ID
  batchName: string;             // 批次名称
  cards: CardImportData[];       // 会员卡数据
}

// 会员卡导入数据
export interface CardImportData {
  cardNumber: string;            // 卡号
  cardType: CardType;            // 卡类型
  expiryDate?: string;           // 到期时间
  batchNumber: string;           // 批次号
}

// 兑换请求
export interface RedemptionRequest {
  id: string;                    // 兑换ID
  cardId: string;                // 原卡ID
  partnerId: string;             // 合作伙伴ID
  originalCardNumber: string;    // 原卡号
  points: number;                // 使用积分
  daysRemaining: number;         // 剩余天数
  rewardType: 'monthly' | 'yearly'; // 兑换类型
  status: 'pending' | 'approved' | 'rejected'; // 状态
  requestReason?: string;        // 申请原因
  requestedAt: string;           // 申请时间
  processedAt?: string;          // 处理时间
  processedBy?: string;          // 处理人
  newCardId?: string;            // 新卡ID（批准后）
  reason?: string;               // 处理原因
  recoveryPoolRecordId?: string; // 回收池记录ID（批准后）
}

// 回收池状态
export enum RecoveryPoolStatus {
  ACTIVE = 'ACTIVE',       // 活跃
  FROZEN = 'FROZEN',       // 冻结
  EXHAUSTED = 'EXHAUSTED'  // 已用完
}

// 回收池记录类型
export enum RecoveryPoolRecordType {
  RECOVERY = 'RECOVERY',     // 权益回收
  EXCHANGE = 'EXCHANGE',     // 兑换使用
  ADJUSTMENT = 'ADJUSTMENT'  // 调整
}

// 回收池
export interface RecoveryPool {
  id: string;                    // 回收池ID
  partnerId: string;             // 合作伙伴ID
  totalDays: number;             // 总天数
  usedDays: number;              // 已使用天数
  availableDays: number;         // 可用天数
  status: RecoveryPoolStatus;    // 状态
  lastUpdatedAt: string;         // 最后更新时间
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
}

// 回收池记录
export interface RecoveryPoolRecord {
  id: string;                    // 记录ID
  poolId: string;                // 回收池ID
  partnerId: string;             // 合作伙伴ID
  type: RecoveryPoolRecordType;  // 记录类型
  days: number;                  // 天数（正数为增加，负数为减少）
  description: string;           // 描述
  sourceId?: string;             // 来源ID（兑换申请ID或兑换订单ID）
  sourceType?: string;           // 来源类型
  operatorId?: string;           // 操作员ID
  createdAt: string;             // 创建时间
}

// 批量兑换申请
export interface BatchExchangeRequest {
  id: string;                    // 申请ID
  partnerId: string;             // 合作伙伴ID
  totalDaysRequired: number;     // 需要的总天数
  cardCount: number;             // 申请卡数量
  cardType: 'monthly' | 'yearly'; // 卡类型（月卡/年卡）
  status: 'pending' | 'approved' | 'rejected'; // 状态
  reason?: string;               // 申请原因
  processReason?: string;        // 处理原因
  requestedAt: string;           // 申请时间
  processedAt?: string;          // 处理时间
  operatorId?: string;           // 操作员ID
  generatedCards?: string[];     // 生成的卡片ID列表
}

// 创建兑换请求
export interface CreateRedemptionRequest {
  cardId: string;                // 原卡ID
  partnerId: string;             // 合作伙伴ID
  points: number;                // 使用积分
  daysRemaining: number;         // 剩余天数
  rewardType: 'monthly' | 'yearly'; // 兑换类型
  requestReason: string;         // 申请原因
}

// ===== 新增：核心系统对接接口类型 =====

// 批次导入响应
export interface BatchImportResponse {
  success: boolean;
  data: {
    batchId: string;             // 批次ID
    totalCards: number;          // 总卡数
    successCount: number;        // 成功导入数量
    failedCount: number;         // 失败数量
    errors: string[];            // 错误信息
  };
  message: string;
}

// 权益回收请求
export interface RightsRecoveryRequest {
  partnerId: string;             // 合作伙伴ID
  cards: RightsRecoveryCard[];   // 待回收权益的卡
}

// 权益回收卡信息
export interface RightsRecoveryCard {
  cardId: string;                // 会员卡ID
  cardNumber: string;            // 卡号
  remainingDays: number;         // 剩余天数
  reason: string;                // 回收原因
}

// 权益回收响应
export interface RightsRecoveryResponse {
  success: boolean;
  data: {
    recoveredCount: number;      // 回收成功数量
    totalPoints: number;         // 总积分
    failedCards: string[];       // 失败的卡号
  };
  message: string;
}

// 补卡申请请求
export interface ReplacementRequest {
  partnerId: string;             // 合作伙伴ID
  requests: ReplacementCardData[];
}

// 补卡数据
export interface ReplacementCardData {
  originalCardId: string;        // 原卡ID
  points: number;                // 使用积分
  rewardType: 'monthly' | 'yearly'; // 兑换类型
  requestReason: string;         // 申请原因
}

// ===== 新增：订单和分账相关类型 =====

// 订单信息
export interface Order {
  id: string;                    // 订单ID
  orderNumber: string;           // 订单号
  type: OrderType;               // 订单类型
  partnerId: string;             // 关联合作伙伴
  cardId?: string;               // 关联会员卡（激活订单）
  userId: string;                // 用户ID
  amount: number;                // 订单金额
  status: OrderStatus;           // 订单状态
  paymentTime?: string;          // 支付时间
  sharingRecords: SharingRecord[]; // 分账记录
  createdAt: string;             // 创建时间
}

// 分账计算规则
export interface SharingRule {
  id: string;                    // 规则ID
  partnerId: string;             // 合作伙伴ID
  orderType: OrderType;          // 适用订单类型
  commissionRate: number;        // 分账比例
  conditions: RuleCondition[];   // 分账条件
  priority: number;              // 优先级
  effectiveDate: string;         // 生效时间
  expiryDate?: string;           // 失效时间
  isActive: boolean;             // 是否启用
}// 分账计算规则
export interface SharingRule {
  id: string;                    // 规则ID
  partnerId: string;             // 合作伙伴ID
  orderType: OrderType;          // 适用订单类型
  commissionRate: number;        // 分账比例
  conditions: RuleCondition[];   // 分账条件
  priority: number;              // 优先级
  effectiveDate: string;         // 生效时间
  expiryDate?: string;           // 失效时间
  isActive: boolean;             // 是否启用
}