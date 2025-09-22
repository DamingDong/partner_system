// Mock data for development and testing
import { 
  User, 
  MembershipCard, 
  SharingRecord, 
  ReconciliationStatement,
  DashboardData,
  UserRole,
  PartnerType,
  PartnerStatus,
  CardType,
  CardStatus,
  SharingStatus,
  ReconciliationStatus,
  TransactionType,
  TransactionStatus,
  BindingType,
  Order,
  OrderType,
  OrderStatus,
  OrderFee
} from '@/types';

// Mock user data - 管理员账号
export const mockAdminUser: User = {
  id: 'admin-001',
  name: '系统管理员',
  username: 'admin',
  email: 'admin@example.com',
  phone: '13800138000',
  role: UserRole.ADMIN,
  partnerId: undefined, // 管理员不需要partnerId
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock user data - 一级代理伙伴账号
export const mockPartnerUser: User = {
  id: 'partner-001',
  name: '王代理',
  username: 'partner001',
  email: 'partner001@example.com',
  phone: '13800138001',
  role: UserRole.PARTNER,
  partnerId: 'partner-001',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// 默认用户（可通过环境变量或其他方式切换）
export const mockUser: User = mockPartnerUser;

// Mock membership cards
export const mockMembershipCards: MembershipCard[] = [
  {
    id: '1',
    cardNumber: 'MC001234567890',
    cardType: CardType.REGULAR,
    partnerId: 'partner-001',
    batchId: 'batch-001',
    remainingDays: 365,
    status: CardStatus.UNACTIVATED,
    activationDate: '2024-01-01T00:00:00Z',
    expiryDate: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    cardNumber: 'MC001234567891',
    cardType: CardType.BOUND,
    partnerId: 'partner-001',
    batchId: 'batch-001',
    remainingDays: 300,
    status: CardStatus.BOUND,
    activationDate: '2024-01-15T00:00:00Z',
    expiryDate: '2024-12-31T23:59:59Z',
    bindingInfo: {
      phoneNumber: '13800138001',
      macAddress: '00:11:22:33:44:55',
      channelPackage: 'package-001',
      bindingTime: '2024-01-15T00:00:00Z',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

// Mock sharing records
export const mockSharingRecords: SharingRecord[] = [
  {
    id: '1',
    transactionId: 'tx-001',
    fromPartnerId: 'partner-002',
    toPartnerId: 'partner-001',
    amount: 500,
    rate: 0.1,
    ruleId: 'rule-001',
    status: SharingStatus.COMPLETED,
    settledAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    transactionId: 'tx-002',
    fromPartnerId: 'partner-001',
    toPartnerId: 'partner-003',
    amount: 300,
    rate: 0.05,
    ruleId: 'rule-002',
    status: SharingStatus.PENDING,
    createdAt: '2024-01-16T00:00:00Z',
  },
];

// Mock reconciliation statements
export const mockReconciliationStatements: ReconciliationStatement[] = [
  {
    id: '1',
    partnerId: 'partner-001',
    period: '2024-01',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    totalRevenue: 50000,
    totalSharing: 5000,
    netAmount: 45000,
    status: ReconciliationStatus.CONFIRMED,
    details: [],
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '2',
    partnerId: 'partner-001',
    period: '2024-02',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-29T23:59:59Z',
    totalRevenue: 60000,
    totalSharing: 6000,
    netAmount: 54000,
    status: ReconciliationStatus.DRAFT,
    details: [],
    createdAt: '2024-03-01T00:00:00Z',
  },
];

// Mock dashboard data
export const mockDashboardData: DashboardData = {
  totalCards: 150,
  activeCards: 120,
  totalRevenue: 500000,
  monthlyRevenue: 60000,
  totalSharing: 50000,
  monthlySharing: 6000,
  recentTransactions: [
    {
      id: '1',
      cardId: '1',
      partnerId: 'partner-001',
      amount: 1000,
      transactionType: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      metadata: {
        description: '会员卡充值',
        source: 'web',
        reference: 'ref-001',
      },
      createdAt: '2024-01-15T00:00:00Z',
    },
  ],
  revenueChart: [
    { date: '2024-01-01', revenue: 10000, sharing: 1000 },
    { date: '2024-01-02', revenue: 12000, sharing: 1200 },
    { date: '2024-01-03', revenue: 15000, sharing: 1500 },
    { date: '2024-01-04', revenue: 11000, sharing: 1100 },
    { date: '2024-01-05', revenue: 13000, sharing: 1300 },
  ],
};

// Mock orders data for partner
export const mockPartnerOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD20240115001',
    orderType: OrderType.ACTIVATION,
    partnerId: 'partner-001',
    partnerName: '王代理',
    cardId: '1',
    cardNumber: 'MC001234567890',
    phone: '13800138001',
    orderAmount: 199.00,
    commissionRate: 0.1,
    commissionAmount: 19.90,
    actualAmount: 179.10,
    fees: [
      {
        type: 'platform',
        amount: 5.00,
        description: '平台服务费'
      },
      {
        type: 'payment',
        amount: 3.00,
        description: '支付手续费'
      }
    ],
    status: OrderStatus.COMPLETED,
    statusDesc: '已完成',
    paymentInfo: {
      paymentMethod: 'alipay',
      paymentChannel: 'scan_pay',
      transactionId: 'tx-20240115001',
      paymentTime: '2024-01-15T10:30:00Z',
      paymentAmount: 199.00
    },
    createdAt: '2024-01-15T10:25:00Z',
    completedAt: '2024-01-15T10:30:00Z',
    settlementAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'order-002',
    orderNumber: 'ORD20240116001',
    orderType: OrderType.ACTIVATION,
    partnerId: 'partner-001',
    partnerName: '王代理',
    cardId: '2',
    cardNumber: 'MC001234567891',
    phone: '13800138002',
    orderAmount: 299.00,
    commissionRate: 0.1,
    commissionAmount: 29.90,
    actualAmount: 269.10,
    fees: [
      {
        type: 'platform',
        amount: 5.00,
        description: '平台服务费'
      },
      {
        type: 'payment',
        amount: 3.00,
        description: '支付手续费'
      }
    ],
    status: OrderStatus.PROCESSING,
    statusDesc: '处理中',
    paymentInfo: {
      paymentMethod: 'wechat',
      paymentChannel: 'app_pay',
      transactionId: 'tx-20240116001',
      paymentTime: '2024-01-16T14:20:00Z',
      paymentAmount: 299.00
    },
    createdAt: '2024-01-16T14:15:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'order-003',
    orderNumber: 'ORD20240117001',
    orderType: OrderType.SUBSCRIPTION,
    partnerId: 'partner-001',
    partnerName: '王代理',
    userId: 'user-001',
    phone: '13800138003',
    orderAmount: 99.00,
    commissionRate: 0.1,
    commissionAmount: 9.90,
    actualAmount: 89.10,
    fees: [
      {
        type: 'platform',
        amount: 3.00,
        description: '平台服务费'
      },
      {
        type: 'payment',
        amount: 2.00,
        description: '支付手续费'
      }
    ],
    status: OrderStatus.COMPLETED,
    statusDesc: '已完成',
    paymentInfo: {
      paymentMethod: 'alipay',
      paymentChannel: 'scan_pay',
      transactionId: 'tx-20240117001',
      paymentTime: '2024-01-17T09:45:00Z',
      paymentAmount: 99.00
    },
    createdAt: '2024-01-17T09:40:00Z',
    completedAt: '2024-01-17T09:45:00Z',
    settlementAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-17T09:45:00Z'
  }
];

// Mock orders data for admin (includes all partners' orders)
export const mockAdminOrders: Order[] = [
  ...mockPartnerOrders,
  {
    id: 'order-004',
    orderNumber: 'ORD20240118001',
    orderType: OrderType.ACTIVATION,
    partnerId: 'partner-002',
    partnerName: '李代理',
    cardId: '3',
    cardNumber: 'MC001234567892',
    phone: '13800138004',
    orderAmount: 199.00,
    commissionRate: 0.15,
    commissionAmount: 29.85,
    actualAmount: 169.15,
    fees: [
      {
        type: 'platform',
        amount: 5.00,
        description: '平台服务费'
      },
      {
        type: 'payment',
        amount: 3.00,
        description: '支付手续费'
      }
    ],
    status: OrderStatus.COMPLETED,
    statusDesc: '已完成',
    paymentInfo: {
      paymentMethod: 'alipay',
      paymentChannel: 'scan_pay',
      transactionId: 'tx-20240118001',
      paymentTime: '2024-01-18T11:30:00Z',
      paymentAmount: 199.00
    },
    createdAt: '2024-01-18T11:25:00Z',
    completedAt: '2024-01-18T11:30:00Z',
    settlementAt: '2024-01-19T00:00:00Z',
    updatedAt: '2024-01-18T11:30:00Z'
  },
  {
    id: 'order-005',
    orderNumber: 'ORD20240119001',
    orderType: OrderType.SUBSCRIPTION,
    partnerId: 'partner-003',
    partnerName: '张代理',
    userId: 'user-002',
    phone: '13800138005',
    orderAmount: 199.00,
    commissionRate: 0.08,
    commissionAmount: 15.92,
    actualAmount: 183.08,
    fees: [
      {
        type: 'platform',
        amount: 5.00,
        description: '平台服务费'
      },
      {
        type: 'payment',
        amount: 3.00,
        description: '支付手续费'
      }
    ],
    status: OrderStatus.FAILED,
    statusDesc: '支付失败',
    createdAt: '2024-01-19T16:20:00Z',
    updatedAt: '2024-01-19T16:25:00Z'
  }
];

// 管理员权限配置
export const adminPermissions = [
  'admin:all',           // 管理员全权限
  'dashboard:read',
  'dashboard:write',
  'cards:read',
  'cards:write',
  'cards:delete',
  'cards:import',
  'sharing:read',
  'sharing:write',
  'sharing:manage',
  'reconciliation:read',
  'reconciliation:write',
  'reconciliation:approve',
  'partners:read',
  'partners:write',
  'partners:delete',
  'partners:manage',
  'reports:read',
  'reports:export',
  'settings:read',
  'settings:write',
  'users:read',
  'users:write',
  'users:delete'
];

// 一级代理伙伴权限配置
export const partnerPermissions = [
  'dashboard:read',      // 仪表盘查看
  'cards:read',          // 会员卡查看
  'cards:write',         // 会员卡编辑（仅自己的）
  // 'cards:import',        // 会员卡导入权限已移除 - 仅管理员可导入
  'orders:read',         // 订单查看（仅自己的）
  'sharing:read',        // 分账查看（仅自己的）
  'reconciliation:read', // 对账单查看（仅自己的）
  'partners:read',       // 合作伙伴查看（仅自己的子伙伴）
  'reports:read',        // 报表查看（仅自己的数据）
  'settings:read'        // 基础设置查看
];

// 权限检查工具函数
export const hasPermission = (userRole: string, permission: string): boolean => {
  if (userRole === 'ADMIN') {
    return adminPermissions.includes(permission) || adminPermissions.includes('admin:all');
  }
  
  if (userRole === 'PARTNER') {
    return partnerPermissions.includes(permission);
  }
  
  return false;
};

// 检查导入权限
export const canImportCards = (userRole: string): boolean => {
  return hasPermission(userRole, 'cards:import');
};

// 检查权益回收权限
export const canRecoverRights = (userRole: string): boolean => {
  return userRole === 'ADMIN' || userRole === 'PARTNER';
};

// 检查批量审批权限
export const canBatchApprove = (userRole: string): boolean => {
  return userRole === 'ADMIN';
};

// 管理员Dashboard数据
export const mockAdminDashboardData: DashboardData = {
  totalCards: 1500,        // 全平台会员卡总数
  activeCards: 1200,       // 全平台活跃卡片
  totalRevenue: 5000000,   // 全平台总收入
  monthlyRevenue: 600000,  // 全平台月收入
  totalSharing: 500000,    // 全平台分账总额
  monthlySharing: 60000,   // 全平台月分账
  recentTransactions: [
    {
      id: '1',
      cardId: '1',
      partnerId: 'partner-001',
      amount: 10000,
      transactionType: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      metadata: {
        description: '合作伙伴充值',
        source: 'admin',
        reference: 'admin-ref-001',
      },
      createdAt: '2024-01-15T00:00:00Z',
    },
  ],
  revenueChart: [
    { date: '2024-01-01', revenue: 100000, sharing: 10000 },
    { date: '2024-01-02', revenue: 120000, sharing: 12000 },
    { date: '2024-01-03', revenue: 150000, sharing: 15000 },
    { date: '2024-01-04', revenue: 110000, sharing: 11000 },
    { date: '2024-01-05', revenue: 130000, sharing: 13000 },
  ],
};

// 一级代理伙伴Dashboard数据
export const mockPartnerDashboardData: DashboardData = {
  totalCards: 150,         // 该伙伴的会员卡总数
  activeCards: 120,        // 该伙伴的活跃卡片
  totalRevenue: 500000,    // 该伙伴的总收入
  monthlyRevenue: 60000,   // 该伙伴的月收入
  totalSharing: 50000,     // 该伙伴的分账收入
  monthlySharing: 6000,    // 该伙伴的月分账收入
  recentTransactions: [
    {
      id: '1',
      cardId: '1',
      partnerId: 'partner-001',
      amount: 1000,
      transactionType: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      metadata: {
        description: '会员卡充值',
        source: 'partner',
        reference: 'partner-ref-001',
      },
      createdAt: '2024-01-15T00:00:00Z',
    },
  ],
  revenueChart: [
    { date: '2024-01-01', revenue: 10000, sharing: 1000 },
    { date: '2024-01-02', revenue: 12000, sharing: 1200 },
    { date: '2024-01-03', revenue: 15000, sharing: 1500 },
    { date: '2024-01-04', revenue: 11000, sharing: 1100 },
    { date: '2024-01-05', revenue: 13000, sharing: 1300 },
  ],
};

// Mock API responses
export const mockApiResponses = {
  // 管理员登录响应
  adminLogin: {
    success: true,
    data: {
      user: mockAdminUser,
      accessToken: 'mock-admin-token',
      refreshToken: 'mock-admin-refresh-token',
      permissions: adminPermissions,
    },
  },
  
  // 一级代理伙伴登录响应
  partnerLogin: {
    success: true,
    data: {
      user: mockPartnerUser,
      accessToken: 'mock-partner-token',
      refreshToken: 'mock-partner-refresh-token',
      permissions: partnerPermissions,
    },
  },
  
  // 默认登录响应（根据当前用户）
  login: {
    success: true,
    data: {
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      permissions: mockUser.role === UserRole.ADMIN ? adminPermissions : partnerPermissions,
    },
  },
  
  cardsList: {
    success: true,
    data: {
      data: mockMembershipCards,
      total: mockMembershipCards.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    },
  },
  
  sharingRecords: {
    success: true,
    data: {
      data: mockSharingRecords,
      total: mockSharingRecords.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    },
  },
  
  reconciliationStatements: {
    success: true,
    data: {
      data: mockReconciliationStatements,
      total: mockReconciliationStatements.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    },
  },
  
  // 订单列表响应 - 合作伙伴视角
  partnerOrders: {
    success: true,
    data: {
      orders: mockPartnerOrders,
      pagination: {
        page: 1,
        limit: 20,
        total: mockPartnerOrders.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      summary: {
        totalOrders: mockPartnerOrders.length,
        totalAmount: mockPartnerOrders.reduce((sum, order) => sum + order.orderAmount, 0),
        totalCommission: mockPartnerOrders.reduce((sum, order) => sum + order.commissionAmount, 0),
        totalActualAmount: mockPartnerOrders.reduce((sum, order) => sum + order.actualAmount, 0),
      }
    }
  },
  
  // 订单列表响应 - 管理员视角
  adminOrders: {
    success: true,
    data: {
      orders: mockAdminOrders,
      pagination: {
        page: 1,
        limit: 20,
        total: mockAdminOrders.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      summary: {
        totalOrders: mockAdminOrders.length,
        totalAmount: mockAdminOrders.reduce((sum, order) => sum + order.orderAmount, 0),
        totalCommission: mockAdminOrders.reduce((sum, order) => sum + order.commissionAmount, 0),
        totalActualAmount: mockAdminOrders.reduce((sum, order) => sum + order.actualAmount, 0),
      }
    }
  },
  
  // 管理员Dashboard数据
  adminDashboardData: {
    success: true,
    data: mockAdminDashboardData,
  },
  
  // 一级代理伙伴Dashboard数据
  partnerDashboardData: {
    success: true,
    data: mockPartnerDashboardData,
  },
  
  // 默认Dashboard数据（根据当前用户角色）
  dashboardData: {
    success: true,
    data: mockUser.role === UserRole.ADMIN ? mockAdminDashboardData : mockPartnerDashboardData,
  },
};

// 开发环境用户切换工具
export const switchMockUser = (userType: 'admin' | 'partner') => {
  // 获取authStore实例（如果在浏览器环境中）
  let authStore: any = null;
  if (typeof window !== 'undefined') {
    // 尝试从全局获取authStore
    authStore = (window as any).__authStore;
  }
  
  if (userType === 'admin') {
    const userData = {
      user: mockAdminUser,
      permissions: adminPermissions,
      dashboardData: mockAdminDashboardData
    };
    
    // 如果有authStore，更新它的状态
    if (authStore) {
      authStore.getState().login({
        user: mockAdminUser,
        accessToken: 'mock-admin-token',
        refreshToken: 'mock-admin-refresh-token',
        permissions: adminPermissions,
      });
    }
    
    return userData;
  } else {
    const userData = {
      user: mockPartnerUser,
      permissions: partnerPermissions,
      dashboardData: mockPartnerDashboardData
    };
    
    // 如果有authStore，更新它的状态
    if (authStore) {
      authStore.getState().login({
        user: mockPartnerUser,
        accessToken: 'mock-partner-token',
        refreshToken: 'mock-partner-refresh-token',
        permissions: partnerPermissions,
      });
    }
    
    return userData;
  }
};

// 获取当前用户信息
export const getCurrentUserInfo = () => {
  return {
    user: mockUser,
    permissions: mockUser.role === UserRole.ADMIN ? adminPermissions : partnerPermissions,
    dashboardData: mockUser.role === UserRole.ADMIN ? mockAdminDashboardData : mockPartnerDashboardData
  };
};

// 在浏览器控制台中使用的全局切换函数
if (typeof window !== 'undefined') {
  (window as any).switchUser = switchMockUser;
  (window as any).getCurrentUser = getCurrentUserInfo;
  
  // 导出authStore到全局，供switchUser使用
  import('@/store/authStore').then(({ useAuthStore }) => {
    (window as any).__authStore = useAuthStore;
  });
  
  console.log('🚀 开发工具已加载：');
  console.log('  - switchUser("admin") // 切换到管理员账号');
  console.log('  - switchUser("partner") // 切换到一级代理伙伴账号');
  console.log('  - getCurrentUser() // 查看当前用户信息');
  console.log('  - 切换用户后刷新页面以生效');
  console.log('\n📝 测试账号信息：');
  console.log('  - 管理员: admin@example.com / password');
  console.log('  - 合作伙伴: partner001@example.com / password');
}