import axios from 'axios';
import { mockCards, mockBatches, mockRedemptionRequests, mockCardStats } from './cardMockData';
import { RecoveryPoolService } from './recoveryPoolService';
import { PermissionService } from './permissionService';
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
  BindingData,
  BatchExchangeRequest,
  Device,
  DeviceStatus,
  DeviceRecoveryStatus
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
    // 检查权限，只有管理员才能导入会员卡
    PermissionService.enforcePermission('cards:import');
    
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
    // 检查权限，只有管理员才能导入会员卡
    PermissionService.enforcePermission('cards:import');
    
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

  // 审批权益回收申请（新增）
  async approveRedemptionRequest(
    requestId: string, 
    operatorId: string, 
    processReason?: string
  ): Promise<{ request: RedemptionRequest; poolRecord: any }> {
    if (USE_MOCK_DATA) {
      const request = mockRedemptionRequests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('兑换申请不存在');
      }
      
      // 更新申请状态
      request.status = 'approved';
      request.processedAt = new Date().toISOString();
      request.processedBy = operatorId;
      request.reason = processReason;
      
      // 处理回收池
      const poolRecord = await RecoveryPoolService.processRecoveryApproval(
        requestId,
        request.partnerId,
        request.daysRemaining,
        `会员卡权益回收 - ${request.originalCardNumber}`,
        operatorId
      );
      
      request.recoveryPoolRecordId = poolRecord.id;
      
      // 更新卡状态为已销卡
      const card = mockCards.find(c => c.id === request.cardId);
      if (card) {
        card.status = CardStatus.CANCELLED;
        card.updatedAt = new Date().toISOString();
      }
      
      return Promise.resolve({ request, poolRecord });
    }
    
    try {
      const response = await this.api.post(`/redemptions/${requestId}/approve`, {
        operatorId,
        processReason
      });
      return response.data;
    } catch (error) {
      console.error('审批权益回收申请失败:', error);
      throw error;
    }
  }

  // 批量审批权益回收申请（新增）
  async batchApproveRedemptionRequests(
    requestIds: string[], 
    operatorId: string, 
    processReason?: string
  ): Promise<{ approvedCount: number; totalDays: number; poolRecord: any }> {
    if (USE_MOCK_DATA) {
      let totalDays = 0;
      let approvedCount = 0;
      let partnerId = '';
      
      for (const requestId of requestIds) {
        const request = mockRedemptionRequests.find(r => r.id === requestId);
        if (request && request.status === 'pending') {
          request.status = 'approved';
          request.processedAt = new Date().toISOString();
          request.processedBy = operatorId;
          request.reason = processReason;
          
          totalDays += request.daysRemaining;
          approvedCount++;
          partnerId = request.partnerId;
          
          // 更新卡状态
          const card = mockCards.find(c => c.id === request.cardId);
          if (card) {
            card.status = CardStatus.CANCELLED;
            card.updatedAt = new Date().toISOString();
          }
        }
      }
      
      // 处理批量回收池
      const poolRecord = await RecoveryPoolService.processBatchRecoveryApproval(
        `batch-${Date.now()}`,
        partnerId,
        totalDays,
        approvedCount,
        operatorId
      );
      
      return Promise.resolve({ approvedCount, totalDays, poolRecord });
    }
    
    try {
      const response = await this.api.post('/redemptions/batch-approve', {
        requestIds,
        operatorId,
        processReason
      });
      return response.data;
    } catch (error) {
      console.error('批量审批权益回收申请失败:', error);
      throw error;
    }
  }

  // 拒绝权益回收申请（新增）
  async rejectRedemptionRequest(
    requestId: string, 
    operatorId: string, 
    processReason: string
  ): Promise<RedemptionRequest> {
    if (USE_MOCK_DATA) {
      const request = mockRedemptionRequests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('兑换申请不存在');
      }
      
      request.status = 'rejected';
      request.processedAt = new Date().toISOString();
      request.processedBy = operatorId;
      request.reason = processReason;
      
      return Promise.resolve(request);
    }
    
    try {
      const response = await this.api.post(`/redemptions/${requestId}/reject`, {
        operatorId,
        processReason
      });
      return response.data;
    } catch (error) {
      console.error('拒绝权益回收申请失败:', error);
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

  // 获取设备列表
  async getDevices(): Promise<Device[]> {
    if (USE_MOCK_DATA) {
      // 模拟设备数据
      const mockDevices: Device[] = [
        {
          id: 'device-1',
          macAddress: '00:1B:44:11:3A:B7',
          deviceName: '会议室设备',
          deviceModel: 'TP-Link Router',
          status: DeviceStatus.ACTIVE,
          cardNumber: 'CARD001234',
          boundAt: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'device-2',
          macAddress: '08:00:27:3A:5B:9C',
          deviceName: '前台设备',
          deviceModel: 'Huawei Switch',
          status: DeviceStatus.INACTIVE,
          cardNumber: undefined,
          boundAt: undefined,
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-12T09:00:00Z'
        },
        {
          id: 'device-3',
          macAddress: 'A0:1B:2C:3D:4E:5F',
          deviceName: '办公室设备',
          deviceModel: 'Cisco Router',
          status: DeviceStatus.SUSPENDED,
          cardNumber: 'CARD005678',
          boundAt: '2024-01-08T14:30:00Z',
          createdAt: '2024-01-05T11:00:00Z',
          updatedAt: '2024-01-18T16:00:00Z'
        }
      ];
      
      return new Promise(resolve => setTimeout(() => resolve(mockDevices), 500));
    }
    
    try {
      const response = await this.api.get('/devices');
      return response.data;
    } catch (error) {
      console.error('获取设备列表失败:', error);
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

  // 获取批量兑换申请列表
  static async getBatchExchangeRequests(partnerId: string): Promise<BatchExchangeRequest[]> {
    if (USE_MOCK_DATA) {
      // 返回mock数据
      return [
        {
          id: 'exchange-001',
          partnerId,
          totalDaysRequired: 365,
          cardCount: 1,
          cardType: 'yearly',
          status: 'pending',
          reason: '补充年卡库存',
          requestedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 'exchange-002',
          partnerId,
          totalDaysRequired: 150,
          cardCount: 5,
          cardType: 'monthly',
          status: 'approved',
          reason: '月度批量兑换',
          requestedAt: '2024-01-19T14:30:00Z',
          processedAt: '2024-01-19T16:00:00Z',
          operatorId: 'admin',
          generatedCards: ['card-new-001', 'card-new-002', 'card-new-003', 'card-new-004', 'card-new-005']
        }
      ];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/cards/batch-exchange-requests/${partnerId}`);
      return response.json();
    } catch (error) {
      console.error('获取批量兑换申请失败:', error);
      throw error;
    }
  }

  // 审批批量兑换申请
  static async processBatchExchangeRequest(
    requestId: string,
    approved: boolean,
    processReason?: string,
    operatorId?: string
  ): Promise<void> {
    if (USE_MOCK_DATA) {
      return Promise.resolve();
    }
    
    try {
      await fetch(`${API_BASE_URL}/cards/batch-exchange-requests/${requestId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved,
          processReason,
          operatorId
        })
      });
    } catch (error) {
      console.error('处理批量兑换申请失败:', error);
      throw error;
    }
  }

  // 获取单个会员卡详情
  async getCardById(cardId: string): Promise<MembershipCard> {
    if (USE_MOCK_DATA) {
      // 模拟当前激活的会员卡 CARD003456 的完整数据
      const mockCardData: Record<string, MembershipCard> = {
        'CARD003456': {
          id: 'card-3',
          cardNumber: 'CARD003456',
          cardType: CardType.BOUND,
          status: CardStatus.ACTIVE,
          partnerId: 'partner-1',
          batchId: 'batch-2024-03',
          activationDate: '2024-03-01T09:00:00Z',
          expiryDate: '2025-03-01T09:00:00Z',
          bindingInfo: {
            phoneNumber: '13800138000',
            macAddress: '00:1B:44:11:3A:B7',
            channelPackage: 'VIP_PACKAGE',
            bindingTime: '2024-03-01T09:00:00Z',
            deviceInfo: {
              deviceId: 'device-1',
              deviceName: '会议室设备',
              deviceModel: 'TP-Link Router',
              osVersion: 'v1.0.0'
            }
          },
          remainingDays: 365,
          userId: 'user-1001',
          createdAt: '2024-03-01T08:00:00Z',
          updatedAt: '2024-03-01T09:00:00Z',
          bindingHistory: [
            {
              deviceId: 'device-1',
              boundAt: '2024-03-01T09:00:00Z',
              unboundAt: undefined,
              recoveryReason: undefined
            }
          ],
          statusHistory: [
            {
              status: CardStatus.UNACTIVATED,
              changedAt: '2024-03-01T08:00:00Z',
              changedBy: 'system',
              reason: '会员卡创建'
            },
            {
              status: CardStatus.BOUND,
              changedAt: '2024-03-01T09:00:00Z',
              changedBy: 'user-1001',
              reason: '会员卡激活并绑定设备'
            },
            {
              status: CardStatus.ACTIVE,
              changedAt: '2024-03-01T10:00:00Z',
              changedBy: 'system',
              reason: '会员卡激活完成'
            }
          ]
        }
      };
      
      const card = mockCardData[cardId] || mockCards.find(c => c.id === cardId);
      if (!card) {
        throw new Error('会员卡不存在');
      }
      
      return new Promise(resolve => setTimeout(() => resolve(card), 300));
    }
    
    try {
      const response = await this.api.get(`/${cardId}`);
      return response.data;
    } catch (error) {
      console.error('获取会员卡详情失败:', error);
      throw error;
    }
  }

  // 获取单个设备详情
  async getDeviceById(deviceId: string): Promise<Device> {
    if (USE_MOCK_DATA) {
      // 模拟设备数据
      const mockDevices: Device[] = [
        {
          id: 'device-1',
          macAddress: '00:1B:44:11:3A:B7',
          deviceName: '会议室设备',
          deviceModel: 'TP-Link Router',
          status: DeviceStatus.ACTIVE,
          cardNumber: 'CARD001234',
          boundAt: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          recoveryCount: 1,
          recoveryStatus: DeviceRecoveryStatus.LIMITED,
          lastRecoveryDate: '2024-01-20T14:30:00Z'
        },
        {
          id: 'device-2',
          macAddress: '08:00:27:3A:5B:9C',
          deviceName: '前台设备',
          deviceModel: 'Huawei Switch',
          status: DeviceStatus.INACTIVE,
          cardNumber: undefined,
          boundAt: undefined,
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-12T09:00:00Z',
          recoveryCount: 0,
          recoveryStatus: DeviceRecoveryStatus.AVAILABLE,
          lastRecoveryDate: undefined
        },
        {
          id: 'device-3',
          macAddress: 'A0:1B:2C:3D:4E:5F',
          deviceName: '办公室设备',
          deviceModel: 'Cisco Router',
          status: DeviceStatus.SUSPENDED,
          cardNumber: 'CARD005678',
          boundAt: '2024-01-08T14:30:00Z',
          createdAt: '2024-01-05T11:00:00Z',
          updatedAt: '2024-01-18T16:00:00Z',
          recoveryCount: 3,
          recoveryStatus: DeviceRecoveryStatus.BLOCKED,
          lastRecoveryDate: '2024-01-25T09:15:00Z'
        }
      ];
      
      const device = mockDevices.find(d => d.id === deviceId);
      if (!device) {
        throw new Error('设备不存在');
      }
      
      return new Promise(resolve => setTimeout(() => resolve(device), 300));
    }
    
    try {
      const response = await this.api.get(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('获取设备详情失败:', error);
      throw error;
    }
  }
}

export const CardService = new CardServiceClass();