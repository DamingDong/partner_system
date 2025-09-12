import axios from 'axios';
import { 
  Order, 
  OrderType, 
  OrderStatus,
  SharingRecord,
  PaginatedResponse,
  DateRange
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

// Mock数据
const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD20240101001',
    type: OrderType.ACTIVATION,
    partnerId: 'partner-001',
    cardId: 'card-001',
    userId: 'user-001',
    amount: 299.00,
    status: OrderStatus.COMPLETED,
    paymentTime: '2024-01-15T10:30:00Z',
    sharingRecords: [],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD20240101002',
    type: OrderType.SUBSCRIPTION,
    partnerId: 'partner-001',
    userId: 'user-002',
    amount: 599.00,
    status: OrderStatus.COMPLETED,
    paymentTime: '2024-01-16T14:20:00Z',
    sharingRecords: [],
    createdAt: '2024-01-16T14:00:00Z',
  },
];

class OrderServiceClass {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/orders`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 设置认证token
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 获取激活订单列表
  async getActivationOrders(
    partnerId: string,
    period?: DateRange,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK_DATA) {
      const filtered = mockOrders.filter(order => 
        order.partnerId === partnerId && 
        order.type === OrderType.ACTIVATION &&
        (!period || (
          new Date(order.createdAt) >= new Date(period.startDate) &&
          new Date(order.createdAt) <= new Date(period.endDate)
        ))
      );
      
      const start = (page - 1) * pageSize;
      const data = filtered.slice(start, start + pageSize);
      
      return Promise.resolve({
        data,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      });
    }

    try {
      const response = await this.api.get(`/activation/${partnerId}`, {
        params: { ...period, page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('获取激活订单失败:', error);
      throw error;
    }
  }

  // 获取订阅订单列表
  async getSubscriptionOrders(
    partnerId: string,
    period?: DateRange,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK_DATA) {
      const filtered = mockOrders.filter(order => 
        order.partnerId === partnerId && 
        order.type === OrderType.SUBSCRIPTION &&
        (!period || (
          new Date(order.createdAt) >= new Date(period.startDate) &&
          new Date(order.createdAt) <= new Date(period.endDate)
        ))
      );
      
      const start = (page - 1) * pageSize;
      const data = filtered.slice(start, start + pageSize);
      
      return Promise.resolve({
        data,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      });
    }

    try {
      const response = await this.api.get(`/subscription/${partnerId}`, {
        params: { ...period, page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('获取订阅订单失败:', error);
      throw error;
    }
  }

  // 获取所有订单
  async getAllOrders(
    partnerId: string,
    period?: DateRange,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK_DATA) {
      const filtered = mockOrders.filter(order => 
        order.partnerId === partnerId &&
        (!period || (
          new Date(order.createdAt) >= new Date(period.startDate) &&
          new Date(order.createdAt) <= new Date(period.endDate)
        ))
      );
      
      const start = (page - 1) * pageSize;
      const data = filtered.slice(start, start + pageSize);
      
      return Promise.resolve({
        data,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      });
    }

    try {
      const response = await this.api.get(`/partner/${partnerId}`, {
        params: { ...period, page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  }

  // 获取订单详情
  async getOrderDetail(orderId: string): Promise<Order> {
    if (USE_MOCK_DATA) {
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('订单不存在');
      }
      return Promise.resolve(order);
    }

    try {
      const response = await this.api.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('获取订单详情失败:', error);
      throw error;
    }
  }

  // 获取订单统计
  async getOrderStats(partnerId: string, period?: DateRange): Promise<{
    totalOrders: number;
    activationOrders: number;
    subscriptionOrders: number;
    totalAmount: number;
    activationAmount: number;
    subscriptionAmount: number;
  }> {
    if (USE_MOCK_DATA) {
      const filtered = mockOrders.filter(order => 
        order.partnerId === partnerId &&
        (!period || (
          new Date(order.createdAt) >= new Date(period.startDate) &&
          new Date(order.createdAt) <= new Date(period.endDate)
        ))
      );

      const activationOrders = filtered.filter(o => o.type === OrderType.ACTIVATION);
      const subscriptionOrders = filtered.filter(o => o.type === OrderType.SUBSCRIPTION);

      return Promise.resolve({
        totalOrders: filtered.length,
        activationOrders: activationOrders.length,
        subscriptionOrders: subscriptionOrders.length,
        totalAmount: filtered.reduce((sum, o) => sum + o.amount, 0),
        activationAmount: activationOrders.reduce((sum, o) => sum + o.amount, 0),
        subscriptionAmount: subscriptionOrders.reduce((sum, o) => sum + o.amount, 0),
      });
    }

    try {
      const response = await this.api.get(`/stats/${partnerId}`, {
        params: period
      });
      return response.data;
    } catch (error) {
      console.error('获取订单统计失败:', error);
      throw error;
    }
  }
}

export const OrderService = new OrderServiceClass();