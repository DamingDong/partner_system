import { 
  Order, 
  OrderQueryParams, 
  PaginatedOrderResult, 
  OrderDetail, 
  OrderStats, 
  OrderExportRequest, 
  ExportTask, 
  ExportTaskStatus, 
  StatsPeriod 
} from '@/types/order';
import { OrderStatus, OrderType, PartnerType } from '@/types'; // 修复导入
import { mockAdminOrders, mockPartnerOrders } from './mock-data';
import { mockAdminUser, mockPartnerUser } from './mock-data';

/**
 * Mock订单服务类
 * 用于在开发环境中模拟订单相关的API调用
 */
export class MockOrderService {
  
  /**
   * 获取订单列表 - 支持合作伙伴数据隔离
   * @param partnerId 合作伙伴ID
   * @param filters 筛选条件
   * @returns 分页订单结果
   */
  static getOrders(partnerId: string, filters?: Partial<OrderQueryParams>): PaginatedOrderResult {
    // 根据partnerId确定数据源
    let orders: Order[] = [];
    if (partnerId === 'all') {
      // 管理员可以看到所有订单
      orders = [...mockAdminOrders];
    } else {
      // 合作伙伴只能看到自己的订单
      orders = mockPartnerOrders.filter(order => order.partnerId === partnerId);
    }
    
    // 应用筛选条件
    if (filters) {
      // 订单类型筛选
      if (filters.orderType) {
        orders = orders.filter(order => order.orderType === filters.orderType);
      }
      
      // 状态筛选
      if (filters.status && filters.status.length > 0) {
        orders = orders.filter(order => filters.status!.includes(order.status));
      }
      
      // 时间筛选
      if (filters.startDate) {
        orders = orders.filter(order => order.createdAt >= filters.startDate!);
      }
      
      if (filters.endDate) {
        // 将结束日期调整为当天的结束时间
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        orders = orders.filter(order => new Date(order.createdAt) <= endDate);
      }
      
      // 金额筛选
      if (filters.minAmount !== undefined) {
        orders = orders.filter(order => order.orderAmount >= filters.minAmount!);
      }
      
      if (filters.maxAmount !== undefined) {
        orders = orders.filter(order => order.orderAmount <= filters.maxAmount!);
      }
      
      // 搜索条件
      if (filters.cardNumber) {
        orders = orders.filter(order => 
          order.cardNumber && order.cardNumber.includes(filters.cardNumber)
        );
      }
      
      if (filters.phone) {
        orders = orders.filter(order => 
          order.phone && order.phone.includes(filters.phone)
        );
      }
      
      if (filters.orderNumber) {
        orders = orders.filter(order => order.orderNumber === filters.orderNumber);
      }
    }
    
    // 应用分页
    const page = filters?.page || 1;
    const limit = Math.min(filters?.limit || 20, 100);
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(startIndex, startIndex + limit);
    
    // 计算统计信息
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + order.orderAmount, 0);
    const totalCommission = orders.reduce((sum, order) => sum + order.commissionAmount, 0);
    const totalActualAmount = orders.reduce((sum, order) => sum + order.actualAmount, 0);
    
    return {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        hasNext: startIndex + limit < totalOrders,
        hasPrev: page > 1,
      },
      summary: {
        totalOrders,
        totalAmount,
        totalCommission,
        totalActualAmount,
      }
    };
  }
  
  /**
   * 获取订单详情
   * @param orderId 订单ID
   * @returns 订单详细信息
   */
  static getOrderDetail(orderId: string): OrderDetail {
    // 查找订单
    const order = [...mockAdminOrders, ...mockPartnerOrders].find(o => o.id === orderId);
    
    if (!order) {
      throw new Error(`订单未找到: ${orderId}`);
    }
    
    // 构造订单详情
    const orderDetail: OrderDetail = {
      ...order,
      partnerInfo: {
        level: 1,
        type: PartnerType.PRIMARY, // 修复类型错误，但需要检查是否正确
        contactPerson: '联系人',
        contactPhone: '13800138000'
      },
      commissionCalculation: {
        baseAmount: order.orderAmount,
        commissionRate: order.commissionRate,
        commissionAmount: order.commissionAmount,
        fees: order.fees,
        actualAmount: order.actualAmount
      },
      statusHistory: [
        {
          status: OrderStatus.PENDING,
          timestamp: order.createdAt,
          operator: 'system',
          remarks: '订单创建'
        }
      ]
    };
    
    // 添加更多状态历史（如果订单已完成）
    if (order.status === OrderStatus.COMPLETED) {
      orderDetail.statusHistory.push({
        status: OrderStatus.PROCESSING,
        timestamp: order.createdAt,
        operator: 'system',
        remarks: '订单处理中'
      });
      
      orderDetail.statusHistory.push({
        status: OrderStatus.COMPLETED,
        timestamp: order.completedAt || new Date().toISOString(),
        operator: 'system',
        remarks: '订单完成'
      });
    }
    
    return orderDetail;
  }
  
  /**
   * 获取订单统计数据
   * @param partnerId 合作伙伴ID
   * @param period 统计周期
   * @returns 订单统计信息
   */
  static getOrderStats(partnerId: string, period: StatsPeriod = 'month'): OrderStats {
    // 根据partnerId确定数据源
    let orders: Order[] = [];
    if (partnerId === 'all') {
      // 管理员可以看到所有订单
      orders = [...mockAdminOrders];
    } else {
      // 合作伙伴只能看到自己的订单
      orders = mockPartnerOrders.filter(order => order.partnerId === partnerId);
    }
    
    // 计算统计数据
    const totalOrders = orders.length;
    const activationOrders = orders.filter(o => o.orderType === OrderType.ACTIVATION).length;
    const subscriptionOrders = orders.filter(o => o.orderType === OrderType.SUBSCRIPTION).length;
    const totalAmount = orders.reduce((sum, order) => sum + order.orderAmount, 0);
    const totalCommission = orders.reduce((sum, order) => sum + order.commissionAmount, 0);
    
    // 计算平均订单金额
    const averageOrderAmount = totalOrders > 0 ? totalAmount / totalOrders : 0;
    
    // 计算成功率
    const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
    const successRate = totalOrders > 0 ? completedOrders / totalOrders : 0;
    
    // 按状态分布
    const statusDistribution = {
      [OrderStatus.PENDING]: orders.filter(o => o.status === OrderStatus.PENDING).length,
      [OrderStatus.PROCESSING]: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
      [OrderStatus.COMPLETED]: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
      [OrderStatus.FAILED]: orders.filter(o => o.status === OrderStatus.FAILED).length,
      [OrderStatus.CANCELLED]: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      [OrderStatus.REFUNDED]: orders.filter(o => o.status === OrderStatus.REFUNDED).length,
    };
    
    // 按类型分布
    const typeDistribution = {
      [OrderType.ACTIVATION]: orders.filter(o => o.orderType === OrderType.ACTIVATION).length,
      [OrderType.SUBSCRIPTION]: orders.filter(o => o.orderType === OrderType.SUBSCRIPTION).length,
    };
    
    return {
      period: period,
      summary: {
        totalOrders,
        activationOrders,
        subscriptionOrders,
        totalAmount,
        totalCommission,
        averageOrderAmount,
        successRate,
      },
      trends: [], // 简化处理，实际应该按日期分组统计
      statusDistribution,
      typeDistribution,
    };
  }
  
  /**
   * 导出订单数据 - 异步处理大数据量
   * @param partnerId 合作伙伴ID
   * @param exportRequest 导出请求参数
   * @returns 导出任务信息
   */
  static exportOrders(partnerId: string, exportRequest: OrderExportRequest): ExportTask {
    // 模拟异步导出任务
    const exportId = `export-${Date.now()}`;
    
    return {
      exportId,
      status: 'QUEUED',
      estimatedTime: 30, // 预估30秒
      createdAt: new Date().toISOString(),
      message: '导出任务已创建，正在排队中'
    };
  }
  
  /**
   * 获取导出任务状态
   * @param exportId 导出任务ID
   * @returns 导出任务状态
   */
  static getExportStatus(exportId: string): ExportTaskStatus {
    // 模拟导出进度
    const now = Date.now();
    const exportTime = parseInt(exportId.split('-')[1]);
    const elapsed = (now - exportTime) / 1000; // 已过去秒数
    
    // 模拟导出过程
    if (elapsed < 10) {
      return {
        exportId,
        status: 'QUEUED',
        progress: 0,
        processedRows: 0,
        totalRows: 1000,
        createdAt: new Date(exportTime).toISOString(),
      };
    } else if (elapsed < 20) {
      return {
        exportId,
        status: 'PROCESSING',
        progress: 50,
        processedRows: 500,
        totalRows: 1000,
        createdAt: new Date(exportTime).toISOString(),
      };
    } else {
      return {
        exportId,
        status: 'COMPLETED',
        progress: 100,
        processedRows: 1000,
        totalRows: 1000,
        downloadUrl: 'https://example.com/download/orders.xlsx',
        fileSize: 102400, // 100KB
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时后过期
        createdAt: new Date(exportTime).toISOString(),
        completedAt: new Date().toISOString(),
      };
    }
  }
}

// 默认导出
export default MockOrderService;