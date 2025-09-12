import {
  RecoveryPool,
  RecoveryPoolRecord,
  RecoveryPoolRecordType,
  BatchExchangeRequest
} from '@/types';
import {
  getRecoveryPoolByPartnerId,
  getRecoveryPoolRecords,
  getRecoveryPoolStats,
  createRecoveryPoolRecord,
  initializeRecoveryPool
} from '@/lib/mock-data-recovery-pool';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

export class RecoveryPoolService {
  // 获取合作伙伴的回收池信息
  static async getRecoveryPool(partnerId: string): Promise<RecoveryPool | null> {
    if (USE_MOCK_DATA) {
      const pool = getRecoveryPoolByPartnerId(partnerId);
      return pool || initializeRecoveryPool(partnerId);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取回收池信息失败:', error);
      throw error;
    }
  }

  // 获取回收池记录列表
  static async getRecoveryPoolRecords(
    partnerId: string,
    type?: RecoveryPoolRecordType,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    data: RecoveryPoolRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    if (USE_MOCK_DATA) {
      const allRecords = getRecoveryPoolRecords(partnerId, type);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      return {
        data: allRecords.slice(startIndex, endIndex),
        total: allRecords.length,
        page,
        pageSize,
        totalPages: Math.ceil(allRecords.length / pageSize),
      };
    }
    
    try {
      const url = new URL(`${API_BASE_URL}/recovery-pool/records/${partnerId}`);
      if (type) url.searchParams.set('type', type);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('pageSize', pageSize.toString());
      
      const response = await fetch(url.toString());
      return response.json();
    } catch (error) {
      console.error('获取回收池记录失败:', error);
      throw error;
    }
  }

  // 获取回收池统计信息
  static async getRecoveryPoolStats(partnerId: string): Promise<{
    totalPools: number;
    totalDays: number;
    availableDays: number;
    usedDays: number;
    recoveryCount: number;
    exchangeCount: number;
  }> {
    if (USE_MOCK_DATA) {
      return getRecoveryPoolStats(partnerId);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/stats/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取回收池统计失败:', error);
      throw error;
    }
  }

  // 处理权益回收（审批通过后调用）
  static async processRecoveryApproval(
    redemptionRequestId: string,
    partnerId: string,
    days: number,
    description: string,
    operatorId: string
  ): Promise<RecoveryPoolRecord> {
    if (USE_MOCK_DATA) {
      return createRecoveryPoolRecord(
        partnerId,
        RecoveryPoolRecordType.RECOVERY,
        days,
        description,
        redemptionRequestId,
        'redemption_request',
        operatorId
      );
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/process-recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redemptionRequestId,
          partnerId,
          days,
          description,
          operatorId
        })
      });
      return response.json();
    } catch (error) {
      console.error('处理权益回收失败:', error);
      throw error;
    }
  }

  // 批量处理权益回收
  static async processBatchRecoveryApproval(
    batchId: string,
    partnerId: string,
    totalDays: number,
    count: number,
    operatorId: string
  ): Promise<RecoveryPoolRecord> {
    if (USE_MOCK_DATA) {
      return createRecoveryPoolRecord(
        partnerId,
        RecoveryPoolRecordType.RECOVERY,
        totalDays,
        `批量权益回收 - ${count}张会员卡`,
        batchId,
        'batch_redemption',
        operatorId
      );
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/process-batch-recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId,
          partnerId,
          totalDays,
          count,
          operatorId
        })
      });
      return response.json();
    } catch (error) {
      console.error('批量处理权益回收失败:', error);
      throw error;
    }
  }

  // 创建批量兑换申请
  static async createBatchExchangeRequest(request: Omit<BatchExchangeRequest, 'id' | 'requestedAt'>): Promise<BatchExchangeRequest> {
    if (USE_MOCK_DATA) {
      const newRequest: BatchExchangeRequest = {
        id: `batch-exchange-${Date.now()}`,
        ...request,
        requestedAt: new Date().toISOString(),
      };
      
      return Promise.resolve(newRequest);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/batch-exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      return response.json();
    } catch (error) {
      console.error('创建批量兑换申请失败:', error);
      throw error;
    }
  }

  // 处理批量兑换（扣除回收池天数）
  static async processBatchExchange(
    exchangeRequestId: string,
    partnerId: string,
    usedDays: number,
    cardCount: number,
    operatorId: string
  ): Promise<RecoveryPoolRecord> {
    if (USE_MOCK_DATA) {
      return createRecoveryPoolRecord(
        partnerId,
        RecoveryPoolRecordType.EXCHANGE,
        -usedDays, // 负数表示消耗
        `批量兑换会员卡 - ${cardCount}张`,
        exchangeRequestId,
        'batch_exchange',
        operatorId
      );
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/process-exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchangeRequestId,
          partnerId,
          usedDays,
          cardCount,
          operatorId
        })
      });
      return response.json();
    } catch (error) {
      console.error('处理批量兑换失败:', error);
      throw error;
    }
  }

  // 手动调整回收池天数
  static async adjustRecoveryPool(
    partnerId: string,
    days: number,
    reason: string,
    operatorId: string
  ): Promise<RecoveryPoolRecord> {
    if (USE_MOCK_DATA) {
      return createRecoveryPoolRecord(
        partnerId,
        RecoveryPoolRecordType.ADJUSTMENT,
        days,
        `手动调整: ${reason}`,
        undefined,
        'manual_adjustment',
        operatorId
      );
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          days,
          reason,
          operatorId
        })
      });
      return response.json();
    } catch (error) {
      console.error('调整回收池失败:', error);
      throw error;
    }
  }

  // 检查回收池余额是否足够
  static async checkPoolBalance(partnerId: string, requiredDays: number): Promise<{
    sufficient: boolean;
    availableDays: number;
    shortfall: number;
  }> {
    if (USE_MOCK_DATA) {
      const pool = getRecoveryPoolByPartnerId(partnerId);
      if (!pool) {
        return { sufficient: false, availableDays: 0, shortfall: requiredDays };
      }
      
      const sufficient = pool.availableDays >= requiredDays;
      const shortfall = sufficient ? 0 : requiredDays - pool.availableDays;
      
      return {
        sufficient,
        availableDays: pool.availableDays,
        shortfall
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/recovery-pool/check-balance/${partnerId}/${requiredDays}`);
      return response.json();
    } catch (error) {
      console.error('检查回收池余额失败:', error);
      throw error;
    }
  }
}