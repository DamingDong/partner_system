// 分账管理相关测试数据
import { SharingRecord, SharingRule, OrderType, SharingStatus } from '@/types';

// 分账记录测试数据
export const mockSharingRecords: SharingRecord[] = [
  {
    id: 'sharing-001',
    transactionId: 'txn-20240115001',
    fromPartnerId: 'partner-002',
    toPartnerId: 'partner-001',
    amount: 299.90,
    rate: 0.15,
    ruleId: 'rule-001',
    status: SharingStatus.COMPLETED,
    settledAt: '2024-01-15T15:30:00Z',
    createdAt: '2024-01-15T15:00:00Z',
  },
  {
    id: 'sharing-002',
    transactionId: 'txn-20240116002',
    fromPartnerId: 'partner-003',
    toPartnerId: 'partner-001',
    amount: 599.80,
    rate: 0.12,
    ruleId: 'rule-002',
    status: SharingStatus.COMPLETED,
    settledAt: '2024-01-16T10:20:00Z',
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'sharing-003',
    transactionId: 'txn-20240117003',
    fromPartnerId: 'partner-001',
    toPartnerId: 'partner-004',
    amount: 199.95,
    rate: 0.08,
    ruleId: 'rule-003',
    status: SharingStatus.PENDING,
    createdAt: '2024-01-17T14:30:00Z',
  },
  {
    id: 'sharing-004',
    transactionId: 'txn-20240118004',
    fromPartnerId: 'partner-001',
    toPartnerId: 'partner-005',
    amount: 899.70,
    rate: 0.10,
    ruleId: 'rule-001',
    status: SharingStatus.COMPLETED,
    settledAt: '2024-01-18T09:15:00Z',
    createdAt: '2024-01-18T09:00:00Z',
  },
];

// 分账规则测试数据
export const mockSharingRules: SharingRule[] = [
  {
    id: 'rule-001',
    partnerId: 'partner-001',
    orderType: OrderType.ACTIVATION,
    commissionRate: 0.15,
    conditions: [
      { field: 'amount', operator: '>=', value: 100 },
    ],
    priority: 1,
    effectiveDate: '2024-01-01T00:00:00Z',
    expiryDate: '2024-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'rule-002',
    partnerId: 'partner-001',
    orderType: OrderType.SUBSCRIPTION,
    commissionRate: 0.12,
    conditions: [
      { field: 'amount', operator: '>=', value: 200 },
    ],
    priority: 2,
    effectiveDate: '2024-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'rule-003',
    partnerId: 'partner-001',
    orderType: OrderType.ACTIVATION,
    commissionRate: 0.08,
    conditions: [
      { field: 'amount', operator: '<', value: 100 },
    ],
    priority: 3,
    effectiveDate: '2024-01-01T00:00:00Z',
    isActive: true,
  },
];

// 分账统计数据
export const mockSharingStats = {
  'partner-001': {
    totalSharing: 125000,
    totalReceived: 89950,
    totalPaid: 35050,
    sharingCount: 24,
  },
  default: {
    totalSharing: 0,
    totalReceived: 0,
    totalPaid: 0,
    sharingCount: 0,
  },
};

// 获取合作伙伴的分账记录
export const getSharingRecordsForPartner = (partnerId: string, type: 'received' | 'paid' = 'received') => {
  if (type === 'received') {
    return mockSharingRecords.filter(record => record.toPartnerId === partnerId);
  } else {
    return mockSharingRecords.filter(record => record.fromPartnerId === partnerId);
  }
};

// 获取合作伙伴的分账规则
export const getSharingRulesForPartner = (partnerId: string) => {
  return mockSharingRules.filter(rule => rule.partnerId === partnerId);
};

// 获取合作伙伴的分账统计
export const getSharingStatsForPartner = (partnerId: string) => {
  return mockSharingStats[partnerId as keyof typeof mockSharingStats] || mockSharingStats.default;
};