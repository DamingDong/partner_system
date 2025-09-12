import {
  Order,
  OrderType,
  OrderStatus,
  PaginatedResponse,
  DateRange
} from '@/types';
import {
  getOrdersForPartner,
  getOrderStatsForPartner,
  getOrderById
} from '@/lib/mock-data-orders';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

export class OrderService {
  // 获取激活订单
  static async getActivationOrders(
    partnerId: string,
    dateRange?: DateRange,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK_DATA) {
      const orders = getOrdersForPartner(partnerId, OrderType.ACTIVATION);
      return {
        data: orders.slice((page - 1) * pageSize, page * pageSize),
        total: orders.length,
        page,
        pageSize,
        totalPages: Math.ceil(orders.length / pageSize),
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/activation/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取激活订单失败:', error);
      throw error;
    }
  }

  // 获取订阅订单
  static async getSubscriptionOrders(
    partnerId: string,
    dateRange?: DateRange,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK_DATA) {
      const orders = getOrdersForPartner(partnerId, OrderType.SUBSCRIPTION);
      return {
        data: orders.slice((page - 1) * pageSize, page * pageSize),
        total: orders.length,
        page,
        pageSize,
        totalPages: Math.ceil(orders.length / pageSize),
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/subscription/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取订阅订单失败:', error);
      throw error;
    }
  }

  // 获取所有订单
  static async getAllOrders(
    partnerId: string,
    dateRange?: DateRange,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK_DATA) {
      const orders = getOrdersForPartner(partnerId);
      return {
        data: orders.slice((page - 1) * pageSize, page * pageSize),
        total: orders.length,
        page,
        pageSize,
        totalPages: Math.ceil(orders.length / pageSize),
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/all/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  }

  // 根据ID获取订单详情
  static async getOrderById(orderId: string): Promise<Order | null> {
    if (USE_MOCK_DATA) {
      return getOrderById(orderId) || null;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      return response.json();
    } catch (error) {
      console.error('获取订单详情失败:', error);
      throw error;
    }
  }

  // 创建订单
  static async createOrder(orderData: Partial<Order>): Promise<Order> {
    if (USE_MOCK_DATA) {
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: `ORD${Date.now()}`,
        type: orderData.type || OrderType.ACTIVATION,
        partnerId: orderData.partnerId!,
        userId: orderData.userId!,
        amount: orderData.amount || 0,
        status: OrderStatus.PENDING,
        sharingRecords: [],
        createdAt: new Date().toISOString(),
        ...orderData,
      };
      
      return Promise.resolve(newOrder);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return response.json();
    } catch (error) {
      console.error('创建订单失败:', error);
      throw error;
    }
  }

  // 更新订单状态
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ id: orderId, status } as Order);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return response.json();
    } catch (error) {
      console.error('更新订单状态失败:', error);
      throw error;
    }
  }

  // 获取订单统计
  static async getOrderStats(partnerId: string, period?: DateRange): Promise<{
    totalOrders: number;
    activationOrders: number;
    subscriptionOrders: number;
    totalAmount: number;
    activationAmount: number;
    subscriptionAmount: number;
  }> {
    if (USE_MOCK_DATA) {
      return getOrderStatsForPartner(partnerId);
    }
    
    try {
      const url = new URL(`${API_BASE_URL}/orders/stats/${partnerId}`);
      if (period?.startDate) url.searchParams.set('startDate', period.startDate);
      if (period?.endDate) url.searchParams.set('endDate', period.endDate);
      
      const response = await fetch(url.toString());
      return response.json();
    } catch (error) {
      console.error('获取订单统计失败:', error);
      throw error;
    }
  }
}