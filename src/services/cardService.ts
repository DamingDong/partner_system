import axios from 'axios';
import { mockCards, mockBatches, mockRedemptionRequests, mockCardStats } from './cardMockData';
import {
  MembershipCard,
  CardBatch,
  RedemptionRequest,
  ImportCardsRequest,
  CreateRedemptionRequest,
  BatchImportResponse,
  RightsRecoveryRequest,
  RightsRecoveryResponse,
  ReplacementRequest,
  CardStatus,
  CardType,
  BindingData
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

class CardServiceClass {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/cards`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 设置认证token
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 获取会员卡列表
  async getCards(partnerId: string): Promise<MembershipCard[]> {
    if (USE_MOCK_DATA) {
      return mockCards.filter(card => card.partnerId === partnerId);
    }
    
    try {
      const response = await this.api.get(`/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error('获取会员卡失败:', error);
      throw error;
    }
  }

  // 获取批次列表
  async getBatches(partnerId: string): Promise<CardBatch[]> {
    if (USE_MOCK_DATA) {
      return mockBatches.filter(batch => batch.partnerId === partnerId);
    }
    
    try {
      const response = await this.api.get(`/batches/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error('获取批次失败:', error);
      throw error;
    }
  }

  // 批量导入会员卡
  async importCards(partnerId: string, file: File): Promise<void> {
    if (USE_MOCK_DATA) {
      // 模拟导入成功
      console.log('模拟导入会员卡:', file.name);
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('partnerId', partnerId);

      await this.api.post('/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('导入会员卡失败:', error);
      throw error;
    }
  }

  // 通过接口对接批量写入会员卡
  async createBatch(importRequest: ImportCardsRequest): Promise<CardBatch> {
    if (USE_MOCK_DATA) {
      // 模拟创建批次
      const newBatch: CardBatch = {
        id: `batch-${Date.now()}`,
        batchNumber: `BATCH${Date.now()}`,
        partnerId: importRequest.partnerId,
        name: importRequest.batchName,
        totalCards: importRequest.cards.length,
        activatedCards: 0,
        status: 'imported',
        importMethod: 'api',
        createdAt: new Date().toISOString(),
        createdBy: 'current-user',
      };
      
      // 添加新批次到mock数据
      mockBatches.push(newBatch);
      
      // 添加新卡片
      importRequest.cards.forEach((card, index) => {
        const newCard: MembershipCard = {
          id: `card-${Date.now()}-${index}`,
          cardNumber: card.cardNumber,
          cardType: card.cardType || CardType.REGULAR,
          status: CardStatus.UNACTIVATED,
          partnerId: importRequest.partnerId,
          batchId: newBatch.id,
          activationDate: undefined,
          expiryDate: card.expiryDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockCards.push(newCard);
      });
      
      return new Promise(resolve => setTimeout(() => resolve(newBatch), 800));
    }
    
    try {
      const response = await this.api.post('/batches', importRequest);
      return response.data;
    } catch (error) {
      console.error('创建批次失败:', error);
      throw error;
    }
  }

  // 按批次查询会员卡
  async getCardsByBatch(batchId: string): Promise<MembershipCard[]> {
    if (USE_MOCK_DATA) {
      return mockCards.filter(card => card.batchId === batchId);
    }
    
    try {
      const response = await this.api.get(`/batch/${batchId}`);
      return response.data;
    } catch (error) {
      console.error('获取批次会员卡失败:', error);
      throw error;
    }
  }

  // 激活会员卡
  async activateCard(cardId: string, activationData: BindingData): Promise<void> {
    if (USE_MOCK_DATA) {
      // 模拟激活过程
      const card = mockCards.find(c => c.id === cardId);
      if (card) {
        card.status = CardStatus.BOUND;
        card.activationDate = new Date().toISOString();
        card.bindingInfo = {
          phoneNumber: activationData.phoneNumber,
          macAddress: activationData.macAddress,
          channelPackage: activationData.channelPackage,
          bindingTime: new Date().toISOString(),
          deviceInfo: activationData.deviceInfo
        };
        card.updatedAt = new Date().toISOString();
      }
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    try {
      await this.api.post(`/${cardId}/activate`, activationData);
    } catch (error) {
      console.error('激活会员卡失败:', error);
      throw error;
    }
  }

  // 申请销卡
  async cancelCard(cardId: string, reason: string): Promise<void> {
    if (USE_MOCK_DATA) {
      const card = mockCards.find(c => c.id === cardId);
      if (card) {
        card.status = CardStatus.CANCELLED;
        card.updatedAt = new Date().toISOString();
      }
      return new Promise(resolve => setTimeout(resolve, 500));
    }
    
    try {
      await this.api.post(`/${cardId}/cancel`, { reason });
    } catch (error) {
      console.error('销卡申请失败:', error);
      throw error;
    }
  }

  // 获取积分兑换申请
  async getRedemptionRequests(partnerId: string): Promise<RedemptionRequest[]> {
    if (USE_MOCK_DATA) {
      return mockRedemptionRequests.filter(request => request.partnerId === partnerId);
    }
    
    try {
      const response = await this.api.get(`/redemptions/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error('获取兑换申请失败:', error);
      throw error;
    }
  }

  // 创建积分兑换申请
  async createRedemptionRequest(request: CreateRedemptionRequest): Promise<RedemptionRequest> {
    if (USE_MOCK_DATA) {
      const card = mockCards.find(c => c.id === request.cardId);
      if (!card) {
        throw new Error('会员卡不存在');
      }
      
      const newRequest: RedemptionRequest = {
        id: `redemption-${Date.now()}`,
        partnerId: request.partnerId,
        cardId: request.cardId,
        originalCardNumber: card.cardNumber,
        points: request.points,
        daysRemaining: request.daysRemaining,
        rewardType: request.rewardType,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        processedAt: undefined,
        processedBy: undefined,
        reason: request.requestReason,
      };
      
      mockRedemptionRequests.push(newRequest);
      return new Promise(resolve => setTimeout(() => resolve(newRequest), 600));
    }
    
    try {
      const response = await this.api.post('/redemptions', request);
      return response.data;
    } catch (error) {
      console.error('创建兑换申请失败:', error);
      throw error;
    }
  }

  // 计算销卡积分
  async calculateRedemptionPoints(cardId: string): Promise<{ points: number; days: number }> {
    if (USE_MOCK_DATA) {
      const card = mockCards.find(c => c.id === cardId);
      if (!card) {
        throw new Error('会员卡不存在');
      }
      
      // 模拟计算逻辑：根据剩余天数计算积分
      const expiryDate = new Date(card.expiryDate || Date.now() + 365 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const days = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      // 简单计算：每剩余10天得1积分
      const points = Math.floor(days / 10);
      
      return new Promise(resolve => 
        setTimeout(() => resolve({ points, days }), 300)
      );
    }
    
    try {
      const response = await this.api.get(`/cards/${cardId}/redemption-points`);
      return response.data;
    } catch (error) {
      console.error('计算积分失败:', error);
      throw error;
    }
  }

  // 获取会员卡统计信息
  async getCardStats(partnerId: string): Promise<{
    totalCards: number;
    activeCards: number;
    cancelledCards: number;
    expiredCards: number;
  }> {
    if (USE_MOCK_DATA) {
      const statsKey = partnerId.replace('-', '').toLowerCase();
      return mockCardStats[statsKey as keyof typeof mockCardStats] || {
        totalCards: 0,
        activeCards: 0,
        cancelledCards: 0,
        expiredCards: 0,
      };
    }
    
    try {
      const response = await this.api.get(`/stats/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      throw error;
    }
  }

  // ===== 新增：核心系统对接接口 =====

  // 批次导入接口（核心系统）
  async batchImportToCore(importRequest: ImportCardsRequest): Promise<BatchImportResponse> {
    if (USE_MOCK_DATA) {
      // 模拟核心系统批次导入
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              batchId: `core-batch-${Date.now()}`,
              totalCards: importRequest.cards.length,
              successCount: importRequest.cards.length,
              failedCount: 0,
              errors: []
            },
            message: '批次导入成功'
          });
        }, 1200);
      });
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/core/cards/batch-import`, importRequest);
      return response.data;
    } catch (error) {
      console.error('核心系统批次导入失败:', error);
      throw error;
    }
  }

  // 权益回收接口（核心系统）
  async batchRecoveryRights(recoveryRequest: RightsRecoveryRequest): Promise<RightsRecoveryResponse> {
    if (USE_MOCK_DATA) {
      // 模拟权益回收
      return new Promise(resolve => {
        setTimeout(() => {
          const totalPoints = recoveryRequest.cards.reduce((sum, card) => {
            return sum + Math.floor(card.remainingDays / 10); // 每10天=1积分
          }, 0);
          
          resolve({
            success: true,
            data: {
              recoveredCount: recoveryRequest.cards.length,
              totalPoints,
              failedCards: []
            },
            message: '权益回收成功'
          });
        }, 800);
      });
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/core/rights/batch-recovery`, recoveryRequest);
      return response.data;
    } catch (error) {
      console.error('权益回收失败:', error);
      throw error;
    }
  }

  // 批量申请补卡接口（核心系统）
  async batchReplacementRequest(replacementRequest: ReplacementRequest): Promise<{ success: boolean; newCards: MembershipCard[] }> {
    if (USE_MOCK_DATA) {
      // 模拟补卡申请
      return new Promise(resolve => {
        setTimeout(() => {
          const newCards: MembershipCard[] = replacementRequest.requests.map((req, index) => ({
            id: `new-card-${Date.now()}-${index}`,
            cardNumber: `NEW${Date.now()}${index.toString().padStart(3, '0')}`,
            cardType: CardType.REGULAR,
            status: CardStatus.UNACTIVATED,
            partnerId: replacementRequest.partnerId,
            batchId: `replacement-batch-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          
          resolve({
            success: true,
            newCards
          });
        }, 1000);
      });
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/core/cards/replacement-request`, replacementRequest);
      return response.data;
    } catch (error) {
      console.error('补卡申请失败:', error);
      throw error;
    }
  }
}

export const CardService = new CardServiceClass();