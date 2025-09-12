import axios from 'axios';
import {
  ImportCardsRequest,
  BatchImportResponse,
  RightsRecoveryRequest,
  RightsRecoveryResponse,
  ReplacementRequest,
  MembershipCard,
  CardType,
  CardStatus
} from '@/types';

const CORE_API_BASE_URL = import.meta.env.VITE_CORE_API_BASE_URL || 'http://localhost:3001/api/core';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

/**
 * 核心系统对接服务
 * 负责与核心系统的通信，包括会员卡批次导入、权益回收和补卡申请
 */
class CoreSystemServiceClass {
  private api = axios.create({
    baseURL: CORE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30秒超时
  });

  constructor() {
    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 添加请求ID用于追踪
        config.headers['X-Request-ID'] = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('核心系统请求:', config.method?.toUpperCase(), config.url, config.data);
        return config;
      },
      (error) => {
        console.error('核心系统请求拦截器错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        console.log('核心系统响应:', response.status, response.config.url, response.data);
        return response;
      },
      (error) => {
        console.error('核心系统响应错误:', error.response?.status, error.config?.url, error.response?.data);
        
        if (error.response?.status === 401) {
          // 处理认证失败
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * 会员卡批次导入接口
   * 将合作伙伴的会员卡批量导入到核心系统
   */
  async batchImportCards(importRequest: ImportCardsRequest): Promise<BatchImportResponse> {
    if (USE_MOCK_DATA) {
      // 模拟批次导入处理
      console.log('模拟核心系统批次导入:', importRequest);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // 模拟验证过程
          const successCount = importRequest.cards.length;
          const failedCount = 0;
          const errors: string[] = [];

          // 模拟部分失败的情况
          if (importRequest.cards.length > 100) {
            const failedCards = Math.floor(importRequest.cards.length * 0.05); // 5%失败率
            errors.push(`${failedCards}张卡片导入失败: 卡号重复`);
          }

          resolve({
            success: true,
            data: {
              batchId: `core-batch-${Date.now()}`,
              totalCards: importRequest.cards.length,
              successCount: successCount - errors.length,
              failedCount: errors.length,
              errors
            },
            message: '批次导入完成'
          });
        }, 2000); // 模拟2秒处理时间
      });
    }

    try {
      const response = await this.api.post('/cards/batch-import', importRequest);
      return response.data;
    } catch (error) {
      console.error('核心系统批次导入失败:', error);
      throw new Error(`批次导入失败: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * 用户权益批量回收接口
   * 当用户申请销卡时，回收其剩余权益并转换为积分
   */
  async batchRecoveryRights(recoveryRequest: RightsRecoveryRequest): Promise<RightsRecoveryResponse> {
    if (USE_MOCK_DATA) {
      // 模拟权益回收处理
      console.log('模拟核心系统权益回收:', recoveryRequest);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // 计算总积分：每10天=1积分
          const totalPoints = recoveryRequest.cards.reduce((sum, card) => {
            return sum + Math.floor(card.remainingDays / 10);
          }, 0);

          // 模拟失败的卡片
          const failedCards: string[] = [];
          if (recoveryRequest.cards.length > 50) {
            failedCards.push(recoveryRequest.cards[0].cardNumber); // 模拟第一张卡失败
          }

          resolve({
            success: true,
            data: {
              recoveredCount: recoveryRequest.cards.length - failedCards.length,
              totalPoints,
              failedCards
            },
            message: '权益回收完成'
          });
        }, 1500); // 模拟1.5秒处理时间
      });
    }

    try {
      const response = await this.api.post('/rights/batch-recovery', recoveryRequest);
      return response.data;
    } catch (error) {
      console.error('核心系统权益回收失败:', error);
      throw new Error(`权益回收失败: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * 批量申请补卡接口
   * 使用积分申请新的会员卡（月卡或年卡）
   */
  async batchReplacementRequest(replacementRequest: ReplacementRequest): Promise<{
    success: boolean;
    newCards: MembershipCard[];
    failedRequests: string[];
    message: string;
  }> {
    if (USE_MOCK_DATA) {
      // 模拟补卡申请处理
      console.log('模拟核心系统补卡申请:', replacementRequest);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newCards: MembershipCard[] = replacementRequest.requests.map((req, index) => {
            const now = new Date();
            const expiryDate = new Date(now);
            
            // 根据兑换类型设置到期时间
            if (req.rewardType === 'monthly') {
              expiryDate.setMonth(expiryDate.getMonth() + 1);
            } else {
              expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            }

            return {
              id: `new-card-${Date.now()}-${index}`,
              cardNumber: `NEW${Date.now().toString().slice(-6)}${index.toString().padStart(3, '0')}`,
              cardType: CardType.REGULAR,
              status: CardStatus.UNACTIVATED,
              partnerId: replacementRequest.partnerId,
              batchId: `replacement-batch-${Date.now()}`,
              activationDate: undefined,
              expiryDate: expiryDate.toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

          // 模拟部分失败的情况
          const failedRequests: string[] = [];
          if (replacementRequest.requests.length > 20) {
            failedRequests.push(replacementRequest.requests[0].originalCardId);
          }

          resolve({
            success: true,
            newCards: newCards.slice(0, newCards.length - failedRequests.length),
            failedRequests,
            message: '补卡申请处理完成'
          });
        }, 2500); // 模拟2.5秒处理时间
      });
    }

    try {
      const response = await this.api.post('/cards/replacement-request', replacementRequest);
      return response.data;
    } catch (error) {
      console.error('核心系统补卡申请失败:', error);
      throw new Error(`补卡申请失败: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * 查询批次导入状态
   */
  async getBatchImportStatus(batchId: string): Promise<{
    batchId: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    totalCards: number;
    processedCards: number;
    failedCards: number;
    errors: string[];
  }> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        batchId,
        status: 'completed',
        progress: 100,
        totalCards: 100,
        processedCards: 98,
        failedCards: 2,
        errors: ['2张卡片导入失败: 卡号重复']
      });
    }

    try {
      const response = await this.api.get(`/cards/batch-import/${batchId}/status`);
      return response.data;
    } catch (error) {
      console.error('查询批次导入状态失败:', error);
      throw error;
    }
  }

  /**
   * 查询权益回收状态
   */
  async getRightsRecoveryStatus(requestId: string): Promise<{
    requestId: string;
    status: 'processing' | 'completed' | 'failed';
    recoveredCount: number;
    totalCards: number;
    totalPoints: number;
    errors: string[];
  }> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        requestId,
        status: 'completed',
        recoveredCount: 48,
        totalCards: 50,
        totalPoints: 245,
        errors: ['2张卡片回收失败: 卡片状态异常']
      });
    }

    try {
      const response = await this.api.get(`/rights/batch-recovery/${requestId}/status`);
      return response.data;
    } catch (error) {
      console.error('查询权益回收状态失败:', error);
      throw error;
    }
  }

  /**
   * 查询补卡申请状态
   */
  async getReplacementStatus(requestId: string): Promise<{
    requestId: string;
    status: 'processing' | 'completed' | 'failed';
    successCount: number;
    totalRequests: number;
    newCards: MembershipCard[];
    errors: string[];
  }> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        requestId,
        status: 'completed',
        successCount: 18,
        totalRequests: 20,
        newCards: [],
        errors: ['2个申请失败: 积分不足']
      });
    }

    try {
      const response = await this.api.get(`/cards/replacement-request/${requestId}/status`);
      return response.data;
    } catch (error) {
      console.error('查询补卡申请状态失败:', error);
      throw error;
    }
  }

  /**
   * 测试核心系统连接
   */
  async testConnection(): Promise<{
    connected: boolean;
    latency: number;
    version: string;
    message: string;
  }> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        connected: true,
        latency: 45,
        version: '1.0.0',
        message: '连接正常'
      });
    }

    const startTime = Date.now();
    try {
      const response = await this.api.get('/health');
      const latency = Date.now() - startTime;
      
      return {
        connected: true,
        latency,
        version: response.data.version || 'unknown',
        message: '连接正常'
      };
    } catch (error) {
      return {
        connected: false,
        latency: -1,
        version: 'unknown',
        message: `连接失败: ${error.message}`
      };
    }
  }
}

export const CoreSystemService = new CoreSystemServiceClass();