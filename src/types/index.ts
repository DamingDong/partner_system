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
  PENDING = 'PENDING',           // 待处理
  PROCESSING = 'PROCESSING',     // 处理中  
  COMPLETED = 'COMPLETED',       // 已完成
  FAILED = 'FAILED',             // 失败
  CANCELLED = 'CANCELLED',       // 已取消
  REFUNDED = 'REFUNDED'          // 已退款
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

// ===== 新增：订单管理相关类型 =====

// 订单费用明细
export interface OrderFee {
  type: 'platform' | 'payment' | 'tax' | 'other';
  amount: number;
  rate?: number;                 // 费率（可选）
  description: string;
  calculation?: string;          // 计算说明
}

// 支付信息模型
export interface PaymentInfo {
  paymentMethod: string;         // 支付方式：alipay, wechat, card等
  paymentChannel: string;        // 支付渠道：scan_pay, app_pay等
  transactionId?: string;        // 第三方交易ID
  paymentTime?: string;          // 支付时间
  paymentAmount?: number;        // 支付金额
  currency?: string;             // 货币类型，默认CNY
}

// 订单信息（更新版）
export interface Order {
  // 唯一标识
  id: string;                    // 订单内部ID
  orderNumber: string;           // 订单编号，格式：ORD + YYYYMMDD + 序号
  
  // 订单分类
  orderType: OrderType;          // 'ACTIVATION' | 'SUBSCRIPTION'
  businessType?: string;         // 业务类型扩展字段
  
  // 关联信息
  partnerId: string;             // 关联合作伙伴ID
  partnerName: string;           // 合作伙伴名称（冗余字段，优化查询）
  userId?: string;               // 关联用户ID（可选）
  cardId?: string;               // 关联会员卡ID（激活订单必填）
  cardNumber?: string;           // 会员卡号（冗余字段）
  phone?: string;                // 用户手机号
  
  // 金额信息
  orderAmount: number;           // 订单原始金额
  commissionRate: number;        // 分成比例 (0-1)
  commissionAmount: number;      // 计算分成金额
  actualAmount: number;          // 实际到账金额（扣除费用后）
  fees: OrderFee[];              // 费用明细
  
  // 状态信息
  status: OrderStatus;           // 订单状态
  statusDesc: string;            // 状态描述
  
  // 支付信息
  paymentInfo?: PaymentInfo;     // 支付相关信息
  
  // 时间戳
  createdAt: string;             // 创建时间 ISO8601
  completedAt?: string;          // 完成时间
  settlementAt?: string;         // 结算时间
  updatedAt: string;             // 更新时间
  
  // 扩展信息
  metadata?: Record<string, any>; // 元数据，支持扩展
  tags?: string[];               // 标签，便于分类
  remarks?: string;              // 备注信息
}

// 订单查询参数模型
export interface OrderQueryParams {
  // 分页参数
  page: number;                  // 页码，从1开始
  limit: number;                 // 每页数量，最大5000
  
  // 基础筛选
  orderType?: OrderType;         // 订单类型筛选
  status?: OrderStatus[];        // 状态筛选，支持多选
  
  // 时间筛选
  startDate?: string;            // 开始日期 YYYY-MM-DD
  endDate?: string;              // 结束日期 YYYY-MM-DD
  dateField?: 'createdAt' | 'completedAt' | 'settlementAt'; // 时间字段选择
  
  // 金额筛选
  minAmount?: number;            // 最小金额
  maxAmount?: number;            // 最大金额
  
  // 搜索条件
  cardNumber?: string;           // 会员卡号模糊搜索
  phone?: string;                // 手机号模糊搜索
  orderNumber?: string;          // 订单号精确搜索
  
  // 排序参数
  sortBy?: 'createdAt' | 'orderAmount' | 'commissionAmount';
  sortOrder?: 'asc' | 'desc';
  
  // 权限相关（后端自动填充）
  partnerId?: string;            // 合作伙伴ID，限制数据范围
}

// 分页查询结果模型
export interface PaginatedOrderResult {
  orders: Order[];               // 订单列表
  pagination: {
    page: number;                // 当前页码
    limit: number;               // 每页数量
    total: number;               // 总记录数
    totalPages: number;          // 总页数
    hasNext: boolean;            // 是否有下一页
    hasPrev: boolean;            // 是否有上一页
  };
  summary: {
    totalOrders: number;         // 查询范围内订单总数
    totalAmount: number;         // 订单总金额
    totalCommission: number;     // 分成总金额
    totalActualAmount: number;   // 实际到账总金额
  };
}

// 订单详情响应
export interface OrderDetailResponse {
  order: OrderDetail;
}

// 订单详细信息
export interface OrderDetail extends Order {
  partnerInfo: {
    level: number;
    type: PartnerType;
    contactPerson: string;
    contactPhone: string;
  };
  userInfo?: {
    userId: string;
    phone: string;
    registeredAt: string;
  };
  cardInfo?: {
    cardId: string;
    cardNumber: string;
    cardType: CardType;
    validityPeriod: number;
    activatedAt: string;
  };
  commissionCalculation: {
    baseAmount: number;
    commissionRate: number;
    commissionAmount: number;
    fees: OrderFee[];
    actualAmount: number;
  };
  statusHistory: OrderStatusHistory[];
}

// 订单状态历史
export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  operator: string;
  remarks: string;
}

// 订单统计查询参数
export interface StatsQueryParams {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  year: number;
  month?: number;
  week?: number;
}

// 订单统计响应
export interface OrderStatsResponse {
  period: string;
  summary: {
    totalOrders: number;
    activationOrders: number;
    subscriptionOrders: number;
    totalAmount: number;
    totalCommission: number;
    averageOrderAmount: number;
    successRate: number;
  };
  trends: Array<{
    date: string;
    orders: number;
    amount: number;
    commission: number;
  }>;
  statusDistribution: Record<OrderStatus, number>;
  typeDistribution: Record<OrderType, number>;
}

// 订单导出请求
export interface OrderExportRequest {
  // 导出格式
  format: 'excel' | 'csv';       // 支持的导出格式
  
  // 筛选条件
  filters: OrderQueryParams;     // 复用查询参数模型
  
  // 列配置
  columns: ExportColumn[];       // 自定义导出列
  
  // 导出选项
  options: {
    includeHeader: boolean;      // 是否包含表头
    includeStats: boolean;       // 是否包含统计信息
    sheetName?: string;          // Excel工作表名称
    maxRows?: number;            // 最大导出行数，默认50000
  };
  
  // 通知设置
  notification?: {
    email?: string;              // 完成后邮件通知
    webhook?: string;            // 完成后回调通知
  };
}

// 导出列配置
export interface ExportColumn {
  field: keyof Order;            // 字段名
  title: string;                 // 列标题
  width?: number;                // 列宽度
  format?: 'currency' | 'date' | 'percent' | 'text'; // 格式化类型
  required: boolean;             // 是否必选
}

// 导出任务响应
export interface ExportTaskResponse {
  exportId: string;              // 导出任务ID
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  estimatedTime: number;         // 预估完成时间（秒）
  createdAt: string;             // 任务创建时间
  message: string;               // 状态描述
}

// 导出状态响应
export interface ExportStatusResponse {
  exportId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;              // 进度百分比 0-100
  processedRows: number;         // 已处理行数
  totalRows: number;             // 总行数
  downloadUrl?: string;          // 下载地址（完成后）
  fileSize?: number;             // 文件大小（字节）
  expiresAt?: string;            // 下载链接过期时间
  error?: string;                // 错误信息（失败时）
  createdAt: string;
  completedAt?: string;
}

// 统计周期类型
export type StatsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

// 订单统计数据
export interface OrderStats {
  period: string;
  summary: {
    totalOrders: number;
    activationOrders: number;
    subscriptionOrders: number;
    totalAmount: number;
    totalCommission: number;
    averageOrderAmount: number;
    successRate: number;
  };
  trends: Array<{
    date: string;
    orders: number;
    amount: number;
    commission: number;
  }>;
  statusDistribution: Record<OrderStatus, number>;
  typeDistribution: Record<OrderType, number>;
}

// 订单筛选器接口
export interface OrderFilters {
  orderType?: OrderType;
  status?: OrderStatus[];
  startDate?: string;
  endDate?: string;
  dateField?: 'createdAt' | 'completedAt' | 'settlementAt';
  minAmount?: number;
  maxAmount?: number;
  cardNumber?: string;
  phone?: string;
  orderNumber?: string;
}

// 订单表格列定义
export interface OrderTableColumn {
  dataIndex: keyof Order;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: Order) => React.ReactNode;
  responsive?: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[];
}

// 导出任务类型
export interface ExportTask {
  exportId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  estimatedTime: number;
  createdAt: string;
  message: string;
}

// 导出任务状态
export interface ExportTaskStatus {
  exportId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  processedRows: number;
  totalRows: number;
  downloadUrl?: string;
  fileSize?: number;
  expiresAt?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// ===== 以下为原有类型定义 =====

// 注意：TransactionType, TransactionStatus, SharingStatus, ReconciliationStatus 枚举已在文件前面定义，避免重复定义

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
}
