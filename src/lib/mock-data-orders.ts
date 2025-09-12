// 订单管理相关测试数据
import { Order, OrderType, OrderStatus, SharingRecord } from '@/types';

// 订单测试数据
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD20240115001',
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
    id: 'order-002',
    orderNumber: 'ORD20240116002',
    type: OrderType.SUBSCRIPTION,
    partnerId: 'partner-001',
    userId: 'user-002',
    amount: 599.00,
    status: OrderStatus.COMPLETED,
    paymentTime: '2024-01-16T14:20:00Z',
    sharingRecords: [],
    createdAt: '2024-01-16T14:00:00Z',
  },
  {
    id: 'order-003',
    orderNumber: 'ORD20240117003',
    type: OrderType.ACTIVATION,
    partnerId: 'partner-001',
    cardId: 'card-003',
    userId: 'user-003',
    amount: 199.00,
    status: OrderStatus.COMPLETED,
    paymentTime: '2024-01-17T09:15:00Z',
    sharingRecords: [],
    createdAt: '2024-01-17T09:00:00Z',
  },
  {
    id: 'order-004',
    orderNumber: 'ORD20240118004',
    type: OrderType.SUBSCRIPTION,
    partnerId: 'partner-001',
    userId: 'user-004',
    amount: 899.00,
    status: OrderStatus.PENDING,
    sharingRecords: [],
    createdAt: '2024-01-18T16:30:00Z',
  },
  {
    id: 'order-005',
    orderNumber: 'ORD20240119005',
    type: OrderType.ACTIVATION,
    partnerId: 'partner-001',
    cardId: 'card-005',
    userId: 'user-005',
    amount: 399.00,
    status: OrderStatus.COMPLETED,
    paymentTime: '2024-01-19T11:45:00Z',
    sharingRecords: [],
    createdAt: '2024-01-19T11:30:00Z',
  },
];

// 订单统计数据
export const mockOrderStats = {
  'partner-001': {
    totalOrders: 12,
    activationOrders: 8,
    subscriptionOrders: 4,
    totalAmount: 4580.00,
    activationAmount: 2790.00,
    subscriptionAmount: 1790.00,
  },
  default: {
    totalOrders: 0,
    activationOrders: 0,
    subscriptionOrders: 0,
    totalAmount: 0,
    activationAmount: 0,
    subscriptionAmount: 0,
  },
};

// 获取合作伙伴的订单列表
export const getOrdersForPartner = (partnerId: string, type?: OrderType) => {
  let filtered = mockOrders.filter(order => order.partnerId === partnerId);
  
  if (type) {
    filtered = filtered.filter(order => order.type === type);
  }
  
  return filtered;
};

// 获取合作伙伴的订单统计
export const getOrderStatsForPartner = (partnerId: string) => {
  return mockOrderStats[partnerId as keyof typeof mockOrderStats] || mockOrderStats.default;
};

// 根据ID获取订单详情
export const getOrderById = (orderId: string) => {
  return mockOrders.find(order => order.id === orderId);
};