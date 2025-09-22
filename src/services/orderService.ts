import axios, { AxiosInstance } from 'axios';
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
  PermissionError,
  RateLimitError,
  ServiceError 
} from '../types/order';
import { OrderType } from '../types';
import { useAuthStore } from '../store/authStore';

// API响应包装类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

// 基础服务抽象类
abstract class BaseService {
  protected static apiClient: AxiosInstance;
  
  static {
    // 初始化API客户端
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 请求拦截器 - 添加认证头
    this.apiClient.interceptors.request.use((config) => {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    // 响应拦截器 - 错误处理
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 处理认证失效
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
  protected static handleError(error: any): never {
    // 统一错误处理逻辑
    console.error('Service Error:', error);
    
    if (error.response?.data?.code) {
      throw new ServiceError(error.response.data.message || '服务器错误');
    }
    
    throw new ServiceError(error.message || '网络请求失败');
  }
  
  protected static transformResponse<T>(response: any): T {
    // 统一响应转换逻辑
    if (response.data?.success === false) {
      throw new ServiceError(response.data.message || '请求失败');
    }
    
    return response.data?.data || response.data;
  }

  protected static checkPermission(permission: string): void {
    const { hasPermission } = useAuthStore.getState();
    if (!hasPermission(permission)) {
      throw new PermissionError(`缺少权限: ${permission}`);
    }
  }
}

/**
 * 订单管理服务类
 * 提供订单查询、详情、统计、导出等功能
 */
export class OrderService extends BaseService {
  
  /**
   * 获取订单列表 - 支持合作伙伴数据隔离
   * @param partnerId 合作伙伴ID
   * @param filters 筛选条件
   * @returns 分页订单结果
   */
  static async getOrders(partnerId: string, filters?: Partial<OrderQueryParams>): Promise<PaginatedOrderResult> {
    // 权限检查：管理员可以查看所有订单，合作伙伴只能查看自己的订单
    this.validatePartnerAccess(partnerId);
    
    const params: OrderQueryParams = {
      page: 1,
      limit: Math.min(filters?.limit || 20, 100), // 限制单次查询数量
      ...filters
    };

    try {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrders(partnerId, params);
      }

      const response = await this.apiClient.get(`/orders/${partnerId}`, {
        params
      });
      
      return this.transformResponse<PaginatedOrderResult>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 获取订单详情
   * @param orderId 订单ID
   * @returns 订单详细信息
   */
  static async getOrderDetail(orderId: string): Promise<OrderDetail> {
    try {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrderDetail(orderId);
      }

      const response = await this.apiClient.get(`/orders/detail/${orderId}`);
      const orderDetail = this.transformResponse<OrderDetail>(response);
      
      // 权限检查：确保用户只能查看自己相关的订单
      this.validateOrderAccess(orderDetail);
      
      return orderDetail;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 获取订单统计数据
   * @param partnerId 合作伙伴ID
   * @param period 统计周期
   * @returns 订单统计信息
   */
  static async getOrderStats(partnerId: string, period: StatsPeriod = 'month'): Promise<OrderStats> {
    // 权限检查：管理员可以查看所有订单，合作伙伴只能查看自己的订单
    this.validatePartnerAccess(partnerId);
    
    try {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrderStats(partnerId, period);
      }

      const response = await this.apiClient.get(`/orders/${partnerId}/stats`, {
        params: { period }
      });
      
      return this.transformResponse<OrderStats>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 导出订单数据 - 异步处理大数据量
   * @param partnerId 合作伙伴ID
   * @param exportRequest 导出请求参数
   * @returns 导出任务信息
   */
  static async exportOrders(partnerId: string, exportRequest: OrderExportRequest): Promise<ExportTask> {
    // 权限检查：管理员可以导出所有订单，合作伙伴只能导出自己的订单
    this.validatePartnerAccess(partnerId);
    this.validateExportPermission();
    
    try {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.exportOrders(partnerId, exportRequest);
      }

      const response = await this.apiClient.post(`/orders/${partnerId}/export`, exportRequest);
      
      // 记录导出时间（用于频率限制）
      localStorage.setItem('lastOrderExportTime', Date.now().toString());
      
      return this.transformResponse<ExportTask>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 获取导出任务状态
   * @param exportId 导出任务ID
   * @returns 导出任务状态
   */
  static async getExportStatus(exportId: string): Promise<ExportTaskStatus> {
    try {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getExportStatus(exportId);
      }

      const response = await this.apiClient.get(`/orders/export/${exportId}/status`);
      return this.transformResponse<ExportTaskStatus>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 创建订单 (内部接口)
   * 注意：这个接口通常由系统内部调用，不对外暴露
   */
  static async createOrder(orderData: Partial<Order>): Promise<Order> {
    this.checkPermission('orders:create');
    
    try {
      const response = await this.apiClient.post('/orders', orderData);
      return this.transformResponse<Order>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 更新订单状态 (内部接口)
   * 注意：这个接口通常由系统内部调用，不对外暴露
   */
  static async updateOrderStatus(
    orderId: string, 
    status: string, 
    remarks?: string
  ): Promise<Order> {
    this.checkPermission('orders:update');
    
    try {
      const response = await this.apiClient.put(`/orders/${orderId}/status`, {
        status,
        operator: useAuthStore.getState().user?.id || 'system',
        remarks: remarks || `订单状态更新为: ${status}`,
        updatedAt: new Date().toISOString()
      });
      
      return this.transformResponse<Order>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 获取激活订单
   * @param partnerId 合作伙伴ID
   * @param dateRange 日期范围
   * @param page 页码
   * @param limit 每页数量
   * @returns 分页订单结果
   */
  static async getActivationOrders(
    partnerId: string,
    dateRange?: { startDate?: string; endDate?: string },
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedOrderResult> {
    // 权限检查：管理员可以查看所有订单，合作伙伴只能查看自己的订单
    this.validatePartnerAccess(partnerId);
    
    const params: OrderQueryParams = {
      page,
      limit: Math.min(limit, 100),
      orderType: OrderType.ACTIVATION,
      startDate: dateRange?.startDate,
      endDate: dateRange?.endDate
    };

    try {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrders(partnerId, params);
      }

      const response = await this.apiClient.get(`/orders/${partnerId}`, {
        params
      });
      
      return this.transformResponse<PaginatedOrderResult>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  /**
   * 获取订阅订单
   * @param partnerId 合作伙伴ID
   * @param dateRange 日期范围
   * @param page 页码
   * @param limit 每页数量
   * @returns 分页订单结果
   */
  static async getSubscriptionOrders(
    partnerId: string,
    dateRange?: { startDate?: string; endDate?: string },
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedOrderResult> {
    // 权限检查：管理员可以查看所有订单，合作伙伴只能查看自己的订单
    this.validatePartnerAccess(partnerId);
    
    const params: OrderQueryParams = {
      page,
      limit: Math.min(limit, 100),
      orderType: OrderType.SUBSCRIPTION,
      startDate: dateRange?.startDate,
      endDate: dateRange?.endDate
    };

    try {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getOrders(partnerId, params);
      }

      const response = await this.apiClient.get(`/orders/${partnerId}`, {
        params
      });
      
      return this.transformResponse<PaginatedOrderResult>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  // ===== 私有方法 =====
  
  /**
   * 验证合作伙伴访问权限
   * @param partnerId 合作伙伴ID
   */
  private static validatePartnerAccess(partnerId: string): void {
    const { user, isAdmin } = useAuthStore.getState();
    
    // 管理员可以访问所有合作伙伴的数据，包括'all'标识
    if (isAdmin) {
      return;
    }
    
    // 合作伙伴只能访问自己的数据
    if (user?.partnerId !== partnerId) {
      throw new PermissionError('无权访问其他合作伙伴的订单数据');
    }
  }
  
  /**
   * 验证订单访问权限
   * @param orderDetail 订单详情
   */
  private static validateOrderAccess(orderDetail: OrderDetail): void {
    const { user, isAdmin } = useAuthStore.getState();
    
    if (!isAdmin && user?.partnerId !== orderDetail.partnerId) {
      throw new PermissionError('无权查看该订单详情');
    }
  }
  
  /**
   * 验证导出权限和频率限制
   */
  private static validateExportPermission(): void {
    // 检查基础权限
    this.checkPermission('orders:export');
    
    // 检查导出频率限制（每小时最多5次）
    const lastExportTime = localStorage.getItem('lastOrderExportTime');
    if (lastExportTime) {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      const timeSinceLastExport = now - parseInt(lastExportTime);
      
      if (timeSinceLastExport < oneHour) {
        // 获取用户今日导出次数（简化实现，实际应该从服务器获取）
        const exportCount = parseInt(localStorage.getItem('todayExportCount') || '0');
        if (exportCount >= 5) {
          throw new RateLimitError('导出频率过高，每小时最多可导出5次，请稍后再试');
        }
        
        // 更新导出次数
        localStorage.setItem('todayExportCount', (exportCount + 1).toString());
      } else {
        // 重置计数器
        localStorage.setItem('todayExportCount', '1');
      }
    } else {
      localStorage.setItem('todayExportCount', '1');
    }
  }
}

// 默认导出
export default OrderService;