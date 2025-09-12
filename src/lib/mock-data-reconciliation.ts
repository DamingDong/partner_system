// 对账管理相关测试数据
import { ReconciliationStatement, ReconciliationStatus, ReconciliationDetail } from '@/types';

// 对账单测试数据
export const mockReconciliationStatements: ReconciliationStatement[] = [
  {
    id: 'stmt-202401',
    partnerId: 'partner-001',
    period: '2024-01',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    totalRevenue: 12500.00,
    totalSharing: 1875.00,
    netAmount: 10625.00,
    status: ReconciliationStatus.RECONCILED,
    details: [
      {
        id: 'detail-001',
        statementId: 'stmt-202401',
        transactionId: 'txn-20240115001',
        description: '会员卡激活收入',
        amount: 299.00,
        type: 'revenue',
      },
      {
        id: 'detail-002',
        statementId: 'stmt-202401',
        transactionId: 'txn-20240115001',
        sharingRecordId: 'sharing-001',
        description: '分账支出',
        amount: -44.85,
        type: 'sharing',
      },
    ],
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'stmt-202402',
    partnerId: 'partner-001',
    period: '2024-02',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-29T23:59:59Z',
    totalRevenue: 15800.00,
    totalSharing: 2370.00,
    netAmount: 13430.00,
    status: ReconciliationStatus.CONFIRMED,
    details: [],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'stmt-202403',
    partnerId: 'partner-001',
    period: '2024-03',
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    totalRevenue: 18200.00,
    totalSharing: 2730.00,
    netAmount: 15470.00,
    status: ReconciliationStatus.DRAFT,
    details: [],
    createdAt: '2024-04-01T10:00:00Z',
  },
];

// 对账统计数据
export const mockReconciliationStats = {
  'partner-001': {
    totalStatements: 6,
    pendingStatements: 2,
    reconciledStatements: 3,
    totalAmount: 89650.00,
  },
  default: {
    totalStatements: 0,
    pendingStatements: 0,
    reconciledStatements: 0,
    totalAmount: 0,
  },
};

// 获取合作伙伴的对账单列表
export const getReconciliationStatementsForPartner = (partnerId: string, period?: string) => {
  let filtered = mockReconciliationStatements.filter(statement => statement.partnerId === partnerId);
  
  if (period && period !== 'all') {
    filtered = filtered.filter(statement => statement.period === period);
  }
  
  return filtered;
};

// 获取合作伙伴的对账统计
export const getReconciliationStatsForPartner = (partnerId: string) => {
  return mockReconciliationStats[partnerId as keyof typeof mockReconciliationStats] || mockReconciliationStats.default;
};

// 根据ID获取对账单详情
export const getReconciliationStatementById = (statementId: string) => {
  return mockReconciliationStatements.find(statement => statement.id === statementId);
};