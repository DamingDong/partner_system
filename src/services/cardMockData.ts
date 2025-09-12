// 会员卡管理测试数据
import { MembershipCard, CardBatch, RedemptionRequest, CardStatus, CardType } from '@/types';

// 测试会员卡数据
export const mockCards: MembershipCard[] = [
  {
    id: '1',
    cardNumber: 'CARD001',
    cardType: CardType.REGULAR,
    status: CardStatus.UNACTIVATED,
    partnerId: 'partner-001',
    batchId: 'batch-1',
    activationDate: undefined,
    expiryDate: '2025-01-15T00:00:00Z',
    remainingDays: 365,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    cardNumber: 'CARD002',
    cardType: CardType.REGULAR,
    status: CardStatus.BOUND,
    partnerId: 'partner-001',
    batchId: 'batch-1',
    activationDate: '2024-01-20T10:00:00Z',
    expiryDate: '2025-01-20T10:00:00Z',
    remainingDays: 300,
    bindingInfo: {
      phoneNumber: '13800138001',
      bindingTime: '2024-01-20T10:00:00Z',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    cardNumber: 'CARD003',
    cardType: CardType.REGULAR,
    status: CardStatus.EXPIRED,
    partnerId: 'partner-001',
    batchId: 'batch-2',
    activationDate: '2023-01-01T10:00:00Z',
    expiryDate: '2024-01-01T10:00:00Z',
    remainingDays: 0,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '4',
    cardNumber: 'CARD004',
    cardType: CardType.REGULAR,
    status: CardStatus.CANCELLED,
    partnerId: 'partner-001',
    batchId: 'batch-2',
    activationDate: undefined,
    expiryDate: '2025-01-15T00:00:00Z',
    remainingDays: 0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '5',
    cardNumber: 'CARD005',
    cardType: CardType.BOUND,
    status: CardStatus.UNACTIVATED,
    partnerId: 'partner-001',
    batchId: 'batch-3',
    activationDate: undefined,
    expiryDate: '2025-06-15T00:00:00Z',
    remainingDays: 180,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '6',
    cardNumber: 'CARD006',
    cardType: CardType.BOUND,
    status: CardStatus.BOUND,
    partnerId: 'partner-001',
    batchId: 'batch-3',
    activationDate: '2024-01-20T10:00:00Z',
    expiryDate: '2025-01-20T10:00:00Z',
    remainingDays: 250,
    bindingInfo: {
      phoneNumber: '13800138002',
      macAddress: '00:11:22:33:44:55',
      channelPackage: 'premium',
      bindingTime: '2024-01-20T10:00:00Z',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
];

// 测试批次数据
export const mockBatches: CardBatch[] = [
  {
    id: 'batch-1',
    batchNumber: 'BATCH001',
    name: '2024年第一批会员卡',
    partnerId: 'partner-001',
    totalCards: 100,
    activatedCards: 50,
    status: 'completed',
    importMethod: 'file',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
  },
  {
    id: 'batch-2',
    batchNumber: 'BATCH002',
    name: '2024年第二批会员卡',
    partnerId: 'partner-001',
    totalCards: 200,
    activatedCards: 120,
    status: 'completed',
    importMethod: 'file',
    createdAt: '2024-01-20T10:00:00Z',
    createdBy: 'admin',
  },
  {
    id: 'batch-3',
    batchNumber: 'BATCH003',
    name: '2024年第三批会员卡',
    partnerId: 'partner-001',
    totalCards: 150,
    activatedCards: 30,
    status: 'processing',
    importMethod: 'api',
    createdAt: '2024-02-01T10:00:00Z',
    createdBy: 'admin',
  },
];

// 测试兑换申请数据
export const mockRedemptionRequests: RedemptionRequest[] = [
  {
    id: 'redemption-1',
    cardId: '2',
    partnerId: 'partner-001',
    originalCardNumber: 'CARD002',
    points: 36,
    daysRemaining: 365,
    rewardType: 'yearly',
    status: 'pending',
    requestedAt: '2024-01-25T10:00:00Z',
    processedAt: undefined,
    processedBy: undefined,
  },
  {
    id: 'redemption-2',
    cardId: '3',
    partnerId: 'partner-001',
    originalCardNumber: 'CARD003',
    points: 0,
    daysRemaining: 0,
    rewardType: 'monthly',
    status: 'approved',
    requestedAt: '2024-01-26T10:00:00Z',
    processedAt: '2024-01-27T10:00:00Z',
    processedBy: 'admin',
    newCardId: 'new-card-001',
  },
];

// 测试统计信息
export const mockCardStats = {
  partner001: {
    totalCards: 6,
    activeCards: 2,
    cancelledCards: 1,
    expiredCards: 1,
  },
};

// 导出所有测试数据
export const mockData = {
  cards: mockCards,
  batches: mockBatches,
  redemptionRequests: mockRedemptionRequests,
  stats: mockCardStats,
};