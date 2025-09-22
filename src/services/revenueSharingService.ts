import { 
  SharingRecord, 
  SharingRule, 
  PaginatedResponse, 
  DateRange,
  OrderType
} from '@/types';
import { 
  mockSharingRecords,
  mockSharingRules,
  mockSharingStats,
  getSharingRecordsForPartner,
  getSharingRulesForPartner,
  getSharingStatsForPartner
} from '@/lib/mock-data-sharing';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export class RevenueSharingService {
  // 获取我的分账记录（收到的分账）
  static async getMySharing(
    partnerId: string, 
    dateRange?: DateRange,
    page: number = 1, 
    pageSize: number = 20
  ): Promise<PaginatedResponse<SharingRecord>> {
    if (USE_MOCK_DATA) {
      let records: SharingRecord[] = [];
      if (partnerId === 'all') {
        // 管理员可以看到所有分账记录
        records = [...mockSharingRecords];
      } else {
        // 合作伙伴只能看到自己的分账记录
        records = mockSharingRecords.filter(record => record.toPartnerId === partnerId);
      }
      return {
        data: records.slice((page - 1) * pageSize, page * pageSize),
        total: records.length,
        page,
        pageSize,
        totalPages: Math.ceil(records.length / pageSize),
      };
    }
    
    try {
      // 在实际环境中，这里会调用真实的API
      const response = await fetch(`${API_BASE_URL}/revenue-sharing/my-sharing/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取我的分账记录失败:', error);
      throw error;
    }
  }

  // 获取下游分账记录（支付的分账）
  static async getDownstreamSharing(
    partnerId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<SharingRecord>> {
    if (USE_MOCK_DATA) {
      let records: SharingRecord[] = [];
      if (partnerId === 'all') {
        // 管理员可以看到所有分账记录
        records = [...mockSharingRecords];
      } else {
        // 合作伙伴只能看到自己的分账记录
        records = mockSharingRecords.filter(record => record.fromPartnerId === partnerId);
      }
      return {
        data: records.slice((page - 1) * pageSize, page * pageSize),
        total: records.length,
        page,
        pageSize,
        totalPages: Math.ceil(records.length / pageSize),
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/revenue-sharing/downstream-sharing/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取下游分账记录失败:', error);
      throw error;
    }
  }

  // 获取分账规则
  static async getSharingRules(partnerId: string): Promise<SharingRule[]> {
    if (USE_MOCK_DATA) {
      if (partnerId === 'all') {
        // 管理员可以看到所有分账规则
        return [...mockSharingRules];
      } else {
        // 合作伙伴只能看到自己的分账规则
        return mockSharingRules.filter(rule => rule.partnerId === partnerId);
      }
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/revenue-sharing/rules/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取分账规则失败:', error);
      throw error;
    }
  }

  // 创建分账规则
  static async createSharingRule(rule: Partial<SharingRule>): Promise<SharingRule> {
    if (USE_MOCK_DATA) {
      const newRule: SharingRule = {
        id: `rule-${Date.now()}`,
        partnerId: rule.partnerId!,
        orderType: rule.orderType || OrderType.ACTIVATION,
        commissionRate: rule.commissionRate || 0,
        conditions: rule.conditions || [],
        priority: rule.priority || 1,
        effectiveDate: rule.effectiveDate || new Date().toISOString(),
        isActive: rule.isActive ?? true,
      };
      
      return Promise.resolve(newRule);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/revenue-sharing/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      return response.json();
    } catch (error) {
      console.error('创建分账规则失败:', error);
      throw error;
    }
  }

  // 更新分账规则
  static async updateSharingRule(ruleId: string, updates: Partial<SharingRule>): Promise<SharingRule> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ id: ruleId, ...updates } as SharingRule);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/revenue-sharing/rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return response.json();
    } catch (error) {
      console.error('更新分账规则失败:', error);
      throw error;
    }
  }

  // 删除分账规则
  static async deleteSharingRule(ruleId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      return Promise.resolve();
    }
    
    try {
      await fetch(`${API_BASE_URL}/revenue-sharing/rules/${ruleId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('删除分账规则失败:', error);
      throw error;
    }
  }

  // 获取分账统计
  static async getSharingStats(partnerId: string, period?: DateRange): Promise<{
    totalSharing: number;
    totalReceived: number;
    totalPaid: number;
    sharingCount: number;
  }> {
    if (USE_MOCK_DATA) {
      if (partnerId === 'all') {
        // 管理员可以看到所有分账统计的汇总
        const allStats = Object.values(mockSharingStats).filter(stat => stat !== mockSharingStats.default);
        return {
          totalSharing: allStats.reduce((sum, stat) => sum + stat.totalSharing, 0),
          totalReceived: allStats.reduce((sum, stat) => sum + stat.totalReceived, 0),
          totalPaid: allStats.reduce((sum, stat) => sum + stat.totalPaid, 0),
          sharingCount: allStats.reduce((sum, stat) => sum + stat.sharingCount, 0),
        };
      } else {
        // 合作伙伴只能看到自己的分账统计
        return getSharingStatsForPartner(partnerId);
      }
    }
    
    try {
      const url = new URL(`${API_BASE_URL}/revenue-sharing/stats/${partnerId}`);
      if (period?.startDate) url.searchParams.set('startDate', period.startDate);
      if (period?.endDate) url.searchParams.set('endDate', period.endDate);
      
      const response = await fetch(url.toString());
      return response.json();
    } catch (error) {
      console.error('获取分账统计失败:', error);
      throw error;
    }
  }
}