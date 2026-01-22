// 订单管理相关类型定义

import { OrderType, OrderStatus, PartnerType, CardType } from './index';

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

// 订单信息（完整版）
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
  limit: number;                 // 每页数量，最大100
  
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

// 错误类型定义
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceError';
  }
}