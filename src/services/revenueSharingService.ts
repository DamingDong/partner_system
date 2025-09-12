import { apiClient } from '@/lib/api';
import {
  SharingRecord,
  RevenueSharingRule,
  SharingRule,
  OrderType,
  DateRange,
  PaginatedResponse,
} from '@/types';

// Mock数据
const mockSharingRecords: SharingRecord[] = [
  {
    id: 'sharing-1',
    transactionId: 'txn-001',
    fromPartnerId: 'partner-001',
    toPartnerId: 'partner-002',
    amount: 29.9,
    rate: 0.1,
    ruleId: 'rule-001',
    status: 'COMPLETED',
    settledAt: '2024-01-15T10:35:00Z',
    createdAt: '2024-01-15T10:30:00Z',
  },
];

const mockSharingRules: SharingRule[] = [
  {
    id: 'rule-001',
    partnerId: 'partner-001',
    orderType: OrderType.ACTIVATION,
    commissionRate: 0.1,
    conditions: [],
    priority: 1,
    effectiveDate: '2024-01-01T00:00:00Z',
    isActive: true,
  },
];

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

export class RevenueSharingService {
  // 获取我的分账信息
  static async getMySharing(
    partnerId: string,
    period: DateRange,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<SharingRecord>> {
    if (USE_MOCK_DATA) {
      const filtered = mockSharingRecords.filter(record => 
        record.toPartnerId === partnerId &&
        new Date(record.createdAt) >= new Date(period.startDate) &&
        new Date(record.createdAt) <= new Date(period.endDate)
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

    const response = await apiClient.get<PaginatedResponse<SharingRecord>>(
      `/sharing/my/${partnerId}`,
      { ...period, page, pageSize }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取分账信息失败');
  }

  // 获取下游分账信息
  static async getDownstreamSharing(
    partnerId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<SharingRecord>> {
    if (USE_MOCK_DATA) {
      const filtered = mockSharingRecords.filter(record => 
        record.fromPartnerId === partnerId
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

    const response = await apiClient.get<PaginatedResponse<SharingRecord>>(
      `/sharing/downstream/${partnerId}`,
      { page, pageSize }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取下游分账信息失败');
  }

  // 配置分账规则
  static async configureSharingRule(rule: SharingRule): Promise<boolean> {
    if (USE_MOCK_DATA) {
      mockSharingRules.push({ ...rule, id: `rule-${Date.now()}` });
      return Promise.resolve(true);
    }

    const response = await apiClient.post<boolean>('/sharing/rules', rule);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '配置分账规则失败');
  }

  // 获取分账规则列表
  static async getSharingRules(partnerId: string): Promise<SharingRule[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(
        mockSharingRules.filter(rule => rule.partnerId === partnerId)
      );
    }

    const response = await apiClient.get<SharingRule[]>(
      `/sharing/rules/${partnerId}`
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取分账规则失败');
  }

  // 更新分账规则
  static async updateSharingRule(
    ruleId: string,
    updates: Partial<SharingRule>
  ): Promise<boolean> {
    if (USE_MOCK_DATA) {
      const ruleIndex = mockSharingRules.findIndex(rule => rule.id === ruleId);
      if (ruleIndex >= 0) {
        mockSharingRules[ruleIndex] = { ...mockSharingRules[ruleIndex], ...updates };
      }
      return Promise.resolve(true);
    }

    const response = await apiClient.put<boolean>(`/sharing/rules/${ruleId}`, updates);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '更新分账规则失败');
  }

  // 删除分账规则
  static async deleteSharingRule(ruleId: string): Promise<boolean> {
    if (USE_MOCK_DATA) {
      const ruleIndex = mockSharingRules.findIndex(rule => rule.id === ruleId);
      if (ruleIndex >= 0) {
        mockSharingRules.splice(ruleIndex, 1);
      }
      return Promise.resolve(true);
    }

    const response = await apiClient.delete<boolean>(`/sharing/rules/${ruleId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '删除分账规则失败');
  }

  // 手动执行分账
  static async processManualSharing(sharingData: {
    transactionId: string;
    partnerId: string;
    amount: number;
    ruleId: string;
  }): Promise<boolean> {
    if (USE_MOCK_DATA) {
      // 模拟手动分账
      return Promise.resolve(true);
    }

    const response = await apiClient.post<boolean>('/sharing/manual', sharingData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '手动分账失败');
  }

  // 获取分账统计
  static async getSharingStats(partnerId: string, period?: DateRange): Promise<{
    totalSharing: number;
    totalReceived: number;
    totalPaid: number;
    sharingCount: number;
  }> {
    if (USE_MOCK_DATA) {
      const filtered = mockSharingRecords.filter(record => 
        (record.fromPartnerId === partnerId || record.toPartnerId === partnerId) &&
        (!period || (
          new Date(record.createdAt) >= new Date(period.startDate) &&
          new Date(record.createdAt) <= new Date(period.endDate)
        ))
      );

      const received = filtered.filter(r => r.toPartnerId === partnerId);
      const paid = filtered.filter(r => r.fromPartnerId === partnerId);

      return Promise.resolve({
        totalSharing: filtered.reduce((sum, r) => sum + r.amount, 0),
        totalReceived: received.reduce((sum, r) => sum + r.amount, 0),
        totalPaid: paid.reduce((sum, r) => sum + r.amount, 0),
        sharingCount: filtered.length,
      });
    }

    const response = await apiClient.get<{
      totalSharing: number;
      totalReceived: number;
      totalPaid: number;
      sharingCount: number;
    }>(`/sharing/stats/${partnerId}`, period || {});
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取分账统计失败');
  }
}