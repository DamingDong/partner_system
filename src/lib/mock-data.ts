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
  BindingType
} from '@/types';

// Mock user data
export const mockUser: User = {
  id: 'user-001',
  name: '管理员',
  username: 'admin',
  email: 'admin@example.com',
  phone: '13800138000',
  role: UserRole.ADMIN,
  partnerId: 'partner-001',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock membership cards
export const mockMembershipCards: MembershipCard[] = [
  {
    id: '1',
    cardNumber: 'MC001234567890',
    cardType: CardType.REGULAR,
    partnerId: 'partner-001',
    remainingAmount: 5000,
    totalAmount: 10000,
    status: CardStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    cardNumber: 'MC001234567891',
    cardType: CardType.BOUND,
    partnerId: 'partner-001',
    remainingAmount: 3000,
    totalAmount: 8000,
    status: CardStatus.BOUND,
    bindingInfo: {
      id: '1',
      cardId: '2',
      bindingType: BindingType.MAC_ADDRESS,
      macAddress: '00:11:22:33:44:55',
      phoneNumber: '13800138001',
      bindingTime: '2024-01-15T00:00:00Z',
      isActive: true,
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

// Mock API responses
export const mockApiResponses = {
  login: {
    success: true,
    data: {
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      permissions: [
        'dashboard:read', 
        'cards:read', 
        'cards:write', 
        'sharing:read', 
        'reconciliation:read',
        'partners:read',
        'reports:read',
        'settings:read'
      ],
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
  
  dashboardData: {
    success: true,
    data: mockDashboardData,
  },
};