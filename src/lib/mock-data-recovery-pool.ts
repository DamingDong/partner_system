// 回收池管理相关测试数据
import { 
  RecoveryPool, 
  RecoveryPoolRecord, 
  RecoveryPoolStatus, 
  RecoveryPoolRecordType 
} from '@/types';

// 回收池测试数据
export const mockRecoveryPools: RecoveryPool[] = [
  {
    id: 'pool-partner-001',
    partnerId: 'partner-001',
    totalDays: 2580,        // 总天数
    usedDays: 365,          // 已使用天数
    availableDays: 2215,    // 可用天数
    status: RecoveryPoolStatus.ACTIVE,
    lastUpdatedAt: '2024-01-20T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'pool-partner-002',
    partnerId: 'partner-002',
    totalDays: 1200,
    usedDays: 0,
    availableDays: 1200,
    status: RecoveryPoolStatus.ACTIVE,
    lastUpdatedAt: '2024-01-15T14:20:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
];

// 回收池记录测试数据
export const mockRecoveryPoolRecords: RecoveryPoolRecord[] = [
  {
    id: 'record-001',
    poolId: 'pool-partner-001',
    partnerId: 'partner-001',
    type: RecoveryPoolRecordType.RECOVERY,
    days: 365,
    description: '会员卡权益回收 - CARD001',
    sourceId: 'redemption-001',
    sourceType: 'redemption_request',
    operatorId: 'admin',
    createdAt: '2024-01-15T15:30:00Z',
  },
  {
    id: 'record-002',
    poolId: 'pool-partner-001',
    partnerId: 'partner-001',
    type: RecoveryPoolRecordType.RECOVERY,
    days: 298,
    description: '会员卡权益回收 - CARD002',
    sourceId: 'redemption-002',
    sourceType: 'redemption_request',
    operatorId: 'admin',
    createdAt: '2024-01-16T10:20:00Z',
  },
  {
    id: 'record-003',
    poolId: 'pool-partner-001',
    partnerId: 'partner-001',
    type: RecoveryPoolRecordType.RECOVERY,
    days: 180,
    description: '会员卡权益回收 - CARD005',
    sourceId: 'redemption-003',
    sourceType: 'redemption_request',
    operatorId: 'admin',
    createdAt: '2024-01-17T14:30:00Z',
  },
  {
    id: 'record-004',
    poolId: 'pool-partner-001',
    partnerId: 'partner-001',
    type: RecoveryPoolRecordType.EXCHANGE,
    days: -365,
    description: '批量兑换会员卡 - 1张年卡',
    sourceId: 'batch-exchange-001',
    sourceType: 'batch_exchange',
    operatorId: 'admin',
    createdAt: '2024-01-18T09:15:00Z',
  },
  {
    id: 'record-005',
    poolId: 'pool-partner-001',
    partnerId: 'partner-001',
    type: RecoveryPoolRecordType.RECOVERY,
    days: 1737,
    description: '批量权益回收 - 5张会员卡',
    sourceId: 'batch-redemption-001',
    sourceType: 'batch_redemption',
    operatorId: 'partner001',
    createdAt: '2024-01-20T10:30:00Z',
  },
];

// 回收池统计数据
export const mockRecoveryPoolStats = {
  'partner-001': {
    totalPools: 1,
    totalDays: 2580,
    availableDays: 2215,
    usedDays: 365,
    recoveryCount: 8,    // 回收次数
    exchangeCount: 1,    // 兑换次数
  },
  'partner-002': {
    totalPools: 1,
    totalDays: 1200,
    availableDays: 1200,
    usedDays: 0,
    recoveryCount: 4,
    exchangeCount: 0,
  },
  default: {
    totalPools: 0,
    totalDays: 0,
    availableDays: 0,
    usedDays: 0,
    recoveryCount: 0,
    exchangeCount: 0,
  },
};

// 获取合作伙伴的回收池
export const getRecoveryPoolByPartnerId = (partnerId: string): RecoveryPool | null => {
  return mockRecoveryPools.find(pool => pool.partnerId === partnerId) || null;
};

// 获取合作伙伴的回收池记录
export const getRecoveryPoolRecords = (
  partnerId: string, 
  type?: RecoveryPoolRecordType,
  limit?: number
): RecoveryPoolRecord[] => {
  let records = mockRecoveryPoolRecords.filter(record => record.partnerId === partnerId);
  
  if (type) {
    records = records.filter(record => record.type === type);
  }
  
  // 按创建时间降序排列
  records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (limit) {
    records = records.slice(0, limit);
  }
  
  return records;
};

// 获取回收池统计信息
export const getRecoveryPoolStats = (partnerId: string) => {
  return mockRecoveryPoolStats[partnerId as keyof typeof mockRecoveryPoolStats] || mockRecoveryPoolStats.default;
};

// 创建新的回收池记录
export const createRecoveryPoolRecord = (
  partnerId: string,
  type: RecoveryPoolRecordType,
  days: number,
  description: string,
  sourceId?: string,
  sourceType?: string,
  operatorId?: string
): RecoveryPoolRecord => {
  const pool = getRecoveryPoolByPartnerId(partnerId);
  if (!pool) {
    throw new Error('合作伙伴回收池不存在');
  }

  const newRecord: RecoveryPoolRecord = {
    id: `record-${Date.now()}`,
    poolId: pool.id,
    partnerId,
    type,
    days,
    description,
    sourceId,
    sourceType,
    operatorId,
    createdAt: new Date().toISOString(),
  };

  // 更新回收池天数
  pool.totalDays += days;
  if (days < 0) {
    pool.usedDays += Math.abs(days);
  }
  pool.availableDays = pool.totalDays - pool.usedDays;
  pool.lastUpdatedAt = new Date().toISOString();
  pool.updatedAt = new Date().toISOString();

  // 添加记录
  mockRecoveryPoolRecords.push(newRecord);

  return newRecord;
};

// 初始化合作伙伴回收池
export const initializeRecoveryPool = (partnerId: string): RecoveryPool => {
  const existingPool = getRecoveryPoolByPartnerId(partnerId);
  if (existingPool) {
    return existingPool;
  }

  const newPool: RecoveryPool = {
    id: `pool-${partnerId}`,
    partnerId,
    totalDays: 0,
    usedDays: 0,
    availableDays: 0,
    status: RecoveryPoolStatus.ACTIVE,
    lastUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockRecoveryPools.push(newPool);
  return newPool;
};