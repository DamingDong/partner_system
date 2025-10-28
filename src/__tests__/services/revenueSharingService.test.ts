import { describe, it, expect, vi } from 'vitest';
import { RevenueSharingService } from '@/services/revenueSharingService';
import { OrderType } from '@/types';

vi.mock('meta.env', () => ({ VITE_USE_MOCK: 'true' }));

describe('RevenueSharingService', () => {
  const mockDateRange = {
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z'
  };

  describe('getMySharing', () => {
    it('应该正确获取分账记录', async () => {
      const result = await RevenueSharingService.getMySharing('test-partner-id', mockDateRange);
      
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('getSharingStats', () => {
    it('应该正确获取分账统计', async () => {
      const stats = await RevenueSharingService.getSharingStats('test-partner-id', mockDateRange);
      
      expect(stats).toHaveProperty('totalSharing');
      expect(stats).toHaveProperty('totalReceived');
      expect(stats).toHaveProperty('totalPaid');
      expect(stats).toHaveProperty('sharingCount');
      expect(typeof stats.totalSharing).toBe('number');
    });
  });

  describe('createSharingRule', () => {
    it('应该正确创建分账规则', async () => {
      const rule = {
        partnerId: 'test-partner-id',
        orderType: OrderType.ACTIVATION,
        commissionRate: 0.1,
        conditions: [],
        priority: 1,
        effectiveDate: '2024-01-01T00:00:00Z',
        isActive: true
      };

      const result = await RevenueSharingService.createSharingRule(rule);
      expect(result).toHaveProperty('id');
      expect(result.partnerId).toBe('test-partner-id');
      expect(result.commissionRate).toBe(0.1);
    });
  });
});