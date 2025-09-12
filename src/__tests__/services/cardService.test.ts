import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CardService } from '@/services/cardService';
import { CardType, ImportCardsRequest } from '@/types';

// Mock环境变量
vi.mock('meta.env', () => ({ VITE_USE_MOCK: 'true' }));

describe('CardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCards', () => {
    it('应该正确获取会员卡列表', async () => {
      const partnerId = 'test-partner-id';
      const cards = await CardService.getCards(partnerId);
      
      expect(Array.isArray(cards)).toBe(true);
      if (cards.length > 0) {
        expect(cards[0]).toHaveProperty('id');
        expect(cards[0]).toHaveProperty('cardNumber');
        expect(cards[0].partnerId).toBe(partnerId);
      }
    });
  });

  describe('createBatch', () => {
    it('应该正确创建新批次', async () => {
      const importRequest: ImportCardsRequest = {
        partnerId: 'test-partner-id',
        batchName: '测试批次',
        cards: [{
          cardNumber: 'TEST001',
          cardType: CardType.REGULAR,
          batchNumber: 'BATCH001'
        }]
      };

      const result = await CardService.createBatch(importRequest);
      
      expect(result).toHaveProperty('id');
      expect(result.partnerId).toBe(importRequest.partnerId);
      expect(result.totalCards).toBe(importRequest.cards.length);
    });
  });

  describe('calculateRedemptionPoints', () => {
    it('应该正确计算销卡积分', async () => {
      const result = await CardService.calculateRedemptionPoints('test-card-id');
      
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('days');
      expect(result.points).toBeGreaterThanOrEqual(0);
    });
  });
});