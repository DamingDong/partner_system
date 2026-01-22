import { 
  Order, 
  OrderQueryParams, 
  PaginatedOrderResult, 
  OrderDetail, 
  OrderStats, 
  OrderExportRequest, 
  ExportTask, 
  ExportTaskStatus,
  StatsPeriod,
  OrderStatusHistory
} from '../types/order';
import { OrderType, OrderStatus, PartnerType, CardType } from '../types';

// 生成随机订单号
const generateOrderNumber = (index: number): string => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  return `ORD${dateStr}${String(index).padStart(3, '0')}`;
};

// 生成随机手机号
const generatePhoneNumber = (): string => {
  const prefixes = ['138', '139', '186', '188', '199'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return prefix + suffix;
};

// 生成随机卡号
const generateCardNumber = (): string => {
  return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
};

// 生成状态历史
const generateStatusHistory = (status: OrderStatus): OrderStatusHistory[] => {
  const history: OrderStatusHistory[] = [
    {
      status: OrderStatus.PENDING,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      operator: 'system',
      remarks: '订单创建，等待处理'
    }
  ];

  if (status !== OrderStatus.PENDING) {
    history.push({
      status: OrderStatus.PROCESSING,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      operator: 'system',
      remarks: '开始处理订单'
    });
  }

  if (status === OrderStatus.COMPLETED) {
    history.push({
      status: OrderStatus.COMPLETED,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      operator: 'system',
      remarks: '订单处理完成'
    });
  } else if (status === OrderStatus.FAILED) {
    history.push({
      status: OrderStatus.FAILED,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      operator: 'system',
      remarks: '订单处理失败，请联系客服'
    });
  } else if (status === OrderStatus.CANCELLED) {
    history.push({
      status: OrderStatus.CANCELLED,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      operator: 'user_456',
      remarks: '用户主动取消订单'
    });
  }

  return history;
};

// 生成Mock订单数据
const generateMockOrder = (index: number, partnerId: string): Order => {
  const orderTypes = [OrderType.ACTIVATION, OrderType.SUBSCRIPTION];
  const statuses = [OrderStatus.COMPLETED, OrderStatus.FAILED, OrderStatus.CANCELLED, OrderStatus.PENDING, OrderStatus.PROCESSING];
  
  const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const orderAmount = Math.floor(Math.random() * 500) + 50; // 50-550元
  const commissionRate = 0.10 + Math.random() * 0.10; // 10%-20%
  const commissionAmount = orderAmount * commissionRate;
  const platformFee = commissionAmount * 0.05; // 平台费5%
  const actualAmount = commissionAmount - platformFee;

  const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // 最近30天
  const completedAt = status === 'COMPLETED' ? new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000) : undefined;

  return {
    id: `order_${index}`,
    orderNumber: generateOrderNumber(index),
    orderType,
    partnerId,
    partnerName: `合作伙伴${partnerId.slice(-2)}`,
    userId: `user_${Math.floor(Math.random() * 1000)}`,
    cardId: orderType === OrderType.ACTIVATION ? `card_${Math.floor(Math.random() * 10000)}` : undefined,
    cardNumber: orderType === OrderType.ACTIVATION ? generateCardNumber() : undefined,
    phone: generatePhoneNumber(),
    orderAmount,
    commissionRate,
    commissionAmount: Math.round(commissionAmount * 100) / 100,
    actualAmount: Math.round(actualAmount * 100) / 100,
    fees: [
      {
        type: 'platform',
        amount: Math.round(platformFee * 100) / 100,
        rate: 0.05,
        description: '平台服务费 5%'
      }
    ],
    status,
    statusDesc: getStatusDescription(status),
    paymentInfo: status === 'COMPLETED' ? {
      paymentMethod: 'alipay',
      paymentChannel: 'scan_pay',
      transactionId: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      paymentTime: completedAt?.toISOString(),
      paymentAmount: orderAmount,
      currency: 'CNY'
    } : undefined,
    createdAt: createdAt.toISOString(),
    completedAt: completedAt?.toISOString(),
    settlementAt: completedAt ? new Date(completedAt.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
    updatedAt: new Date().toISOString(),
    metadata: {
      deviceInfo: 'iPhone 15',
      appVersion: '1.0.0',
      source: 'mobile_app'
    },
    tags: [orderType.toLowerCase(), status.toLowerCase()],
    remarks: `${orderType === OrderType.ACTIVATION ? '激活' : '订阅'}订单`
  };
};

// 获取状态描述
const getStatusDescription = (status: OrderStatus): string => {
  const statusMap = {
    [OrderStatus.PENDING]: '待处理',
    [OrderStatus.PROCESSING]: '处理中',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.FAILED]: '失败',
    [OrderStatus.CANCELLED]: '已取消',
    [OrderStatus.REFUNDED]: '已退款'
  };
  return statusMap[status] || '未知状态';
};

// 生成大量Mock数据
const generateMockOrders = (count: number, partnerId: string): Order[] => {
  return Array.from({ length: count }, (_, index) => generateMockOrder(index + 1, partnerId));
};

// Mock订单服务
export class MockOrderService {
  private static orders: Map<string, Order[]> = new Map();
  private static exportTasks: Map<string, ExportTaskStatus> = new Map();

  /**
   * 获取订单列表
   */
  static getOrders(partnerId: string, params: OrderQueryParams): PaginatedOrderResult {
    // 如果没有该合作伙伴的数据，生成一些
    if (!this.orders.has(partnerId)) {
      this.orders.set(partnerId, generateMockOrders(200, partnerId));
    }

    let orders = this.orders.get(partnerId) || [];

    // 应用筛选条件
    if (params.orderType) {
      orders = orders.filter(order => order.orderType === params.orderType);
    }

    if (params.status && params.status.length > 0) {
      orders = orders.filter(order => params.status!.includes(order.status));
    }

    if (params.startDate) {
      const startDate = new Date(params.startDate);
      orders = orders.filter(order => new Date(order.createdAt) >= startDate);
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate + 'T23:59:59.999Z');
      orders = orders.filter(order => new Date(order.createdAt) <= endDate);
    }

    if (params.minAmount) {
      orders = orders.filter(order => order.orderAmount >= params.minAmount!);
    }

    if (params.maxAmount) {
      orders = orders.filter(order => order.orderAmount <= params.maxAmount!);
    }

    if (params.cardNumber) {
      orders = orders.filter(order => 
        order.cardNumber?.includes(params.cardNumber!) || false
      );
    }

    if (params.phone) {
      orders = orders.filter(order => 
        order.phone?.includes(params.phone!) || false
      );
    }

    if (params.orderNumber) {
      orders = orders.filter(order => 
        order.orderNumber.includes(params.orderNumber!)
      );
    }

    // 排序
    if (params.sortBy) {
      orders.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Order] as number;
        const bValue = b[params.sortBy as keyof Order] as number;
        
        if (params.sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    // 分页
    const total = orders.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    // 计算汇总信息
    const summary = {
      totalOrders: total,
      totalAmount: Math.round(orders.reduce((sum, order) => sum + order.orderAmount, 0) * 100) / 100,
      totalCommission: Math.round(orders.reduce((sum, order) => sum + order.commissionAmount, 0) * 100) / 100,
      totalActualAmount: Math.round(orders.reduce((sum, order) => sum + order.actualAmount, 0) * 100) / 100
    };

    return {
      orders: paginatedOrders,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
        hasNext: endIndex < total,
        hasPrev: params.page > 1
      },
      summary
    };
  }

  /**
   * 获取订单详情
   */
  static getOrderDetail(orderId: string): OrderDetail {
    // 从所有合作伙伴中查找订单
    for (const orders of this.orders.values()) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const detail: OrderDetail = {
          ...order,
          partnerInfo: {
            level: 1,
            type: PartnerType.PRIMARY,
            contactPerson: '张三',
            contactPhone: '13900139000'
          },
          userInfo: order.userId ? {
            userId: order.userId,
            phone: order.phone || '',
            registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
          } : undefined,
          cardInfo: order.cardId ? {
            cardId: order.cardId,
            cardNumber: order.cardNumber || '',
            cardType: CardType.REGULAR,
            validityPeriod: 365,
            activatedAt: order.completedAt || order.createdAt
          } : undefined,
          commissionCalculation: {
            baseAmount: order.orderAmount,
            commissionRate: order.commissionRate,
            commissionAmount: order.commissionAmount,
            fees: order.fees,
            actualAmount: order.actualAmount
          },
          statusHistory: generateStatusHistory(order.status)
        };
        return detail;
      }
    }
    
    throw new Error('订单不存在');
  }

  /**
   * 获取订单统计
   */
  static getOrderStats(partnerId: string, period: StatsPeriod): OrderStats {
    const orders = this.orders.get(partnerId) || [];
    const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED);
    const activationOrders = completedOrders.filter(o => o.orderType === OrderType.ACTIVATION);
    const subscriptionOrders = completedOrders.filter(o => o.orderType === OrderType.SUBSCRIPTION);

    // 生成趋势数据（简化版）
    const trends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dayOrders = Math.floor(Math.random() * 10) + 1;
      const dayAmount = dayOrders * (100 + Math.random() * 200);
      const dayCommission = dayAmount * 0.15;

      return {
        date: date.toISOString().slice(0, 10),
        orders: dayOrders,
        amount: Math.round(dayAmount * 100) / 100,
        commission: Math.round(dayCommission * 100) / 100
      };
    });

    return {
      period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      summary: {
        totalOrders: orders.length,
        activationOrders: activationOrders.length,
        subscriptionOrders: subscriptionOrders.length,
        totalAmount: Math.round(orders.reduce((sum, o) => sum + o.orderAmount, 0) * 100) / 100,
        totalCommission: Math.round(orders.reduce((sum, o) => sum + o.commissionAmount, 0) * 100) / 100,
        averageOrderAmount: orders.length > 0 ? Math.round((orders.reduce((sum, o) => sum + o.orderAmount, 0) / orders.length) * 100) / 100 : 0,
        successRate: orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) / 100 : 0
      },
      trends,
      statusDistribution: {
        [OrderStatus.PENDING]: orders.filter(o => o.status === OrderStatus.PENDING).length,
        [OrderStatus.PROCESSING]: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
        [OrderStatus.COMPLETED]: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
        [OrderStatus.FAILED]: orders.filter(o => o.status === OrderStatus.FAILED).length,
        [OrderStatus.CANCELLED]: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
        [OrderStatus.REFUNDED]: orders.filter(o => o.status === OrderStatus.REFUNDED).length
      },
      typeDistribution: {
        [OrderType.ACTIVATION]: activationOrders.length,
        [OrderType.SUBSCRIPTION]: subscriptionOrders.length
      }
    };
  }

  /**
   * 导出订单
   */
  static exportOrders(partnerId: string, exportRequest: OrderExportRequest): ExportTask {
    const exportId = `export_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // 模拟异步导出处理
    setTimeout(() => {
      this.exportTasks.set(exportId, {
        exportId,
        status: 'PROCESSING',
        progress: 0,
        processedRows: 0,
        totalRows: 1000,
        createdAt: new Date().toISOString()
      });

      // 模拟进度更新
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          this.exportTasks.set(exportId, {
            exportId,
            status: 'COMPLETED',
            progress: 100,
            processedRows: 1000,
            totalRows: 1000,
            downloadUrl: `/api/files/orders_export_${exportId}.xlsx`,
            fileSize: 2048576,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          });
          clearInterval(interval);
        } else {
          this.exportTasks.set(exportId, {
            exportId,
            status: 'PROCESSING',
            progress: Math.floor(progress),
            processedRows: Math.floor((progress / 100) * 1000),
            totalRows: 1000,
            createdAt: new Date().toISOString()
          });
        }
      }, 1000);
    }, 100);

    return {
      exportId,
      status: 'QUEUED',
      estimatedTime: 30,
      createdAt: new Date().toISOString(),
      message: '导出任务已加入队列，预计需要 30 秒'
    };
  }

  /**
   * 获取导出状态
   */
  static getExportStatus(exportId: string): ExportTaskStatus {
    const task = this.exportTasks.get(exportId);
    if (!task) {
      throw new Error('导出任务不存在');
    }
    return task;
  }
}

// 导出默认实例
export const mockOrderService = MockOrderService;