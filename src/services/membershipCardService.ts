import { apiClient } from '@/lib/api';
import {
  MembershipCard,
  CardFilters,
  PaginatedResponse,
  BindingData,
  UsageRecord,
  DateRange,
} from '@/types';

export class MembershipCardService {
  // 获取会员卡列表
  static async getCardList(
    filters: CardFilters
  ): Promise<PaginatedResponse<MembershipCard>> {
    const response = await apiClient.get<PaginatedResponse<MembershipCard>>(
      '/cards',
      filters
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取会员卡列表失败');
  }

  // 获取会员卡详情
  static async getCardDetail(cardId: string): Promise<MembershipCard> {
    const response = await apiClient.get<MembershipCard>(`/cards/${cardId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取会员卡详情失败');
  }

  // 绑定会员卡
  static async bindCard(cardId: string, bindingData: BindingData): Promise<boolean> {
    const response = await apiClient.post<boolean>(`/cards/${cardId}/bind`, bindingData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '绑定会员卡失败');
  }

  // 解绑会员卡
  static async unbindCard(cardId: string): Promise<boolean> {
    const response = await apiClient.post<boolean>(`/cards/${cardId}/unbind`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '解绑会员卡失败');
  }

  // 获取会员卡使用记录
  static async getCardUsage(
    cardId: string,
    period: DateRange
  ): Promise<UsageRecord[]> {
    const response = await apiClient.get<UsageRecord[]>(`/cards/${cardId}/usage`, period);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取使用记录失败');
  }

  // 批量更新会员卡
  static async batchUpdateCards(updates: Array<{ id: string; [key: string]: unknown }>): Promise<boolean> {
    const response = await apiClient.post<boolean>('/cards/batch-update', { updates });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '批量更新失败');
  }

  // 创建会员卡
  static async createCard(cardData: Omit<MembershipCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<MembershipCard> {
    const response = await apiClient.post<MembershipCard>('/cards', cardData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '创建会员卡失败');
  }

  // 更新会员卡
  static async updateCard(cardId: string, updates: Partial<MembershipCard>): Promise<MembershipCard> {
    const response = await apiClient.put<MembershipCard>(`/cards/${cardId}`, updates);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '更新会员卡失败');
  }

  // 删除会员卡
  static async deleteCard(cardId: string): Promise<boolean> {
    const response = await apiClient.delete<boolean>(`/cards/${cardId}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '删除会员卡失败');
  }
}