import { apiClient } from '@/lib/api';
import {
  ReconciliationStatement,
  PaginatedResponse,
  DateRange,
} from '@/types';

export class ReconciliationService {
  // 生成对账单
  static async generateStatement(
    partnerId: string,
    period: string
  ): Promise<ReconciliationStatement> {
    const response = await apiClient.post<ReconciliationStatement>(
      '/reconciliation/generate',
      { partnerId, period }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '生成对账单失败');
  }

  // 获取对账单列表
  static async getStatementList(
    partnerId: string,
    filters: {
      period?: string;
      status?: string;
      page: number;
      pageSize: number;
    }
  ): Promise<PaginatedResponse<ReconciliationStatement>> {
    const response = await apiClient.get<PaginatedResponse<ReconciliationStatement>>(
      `/reconciliation/statements/${partnerId}`,
      filters
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取对账单列表失败');
  }

  // 获取对账单详情
  static async getStatementDetail(statementId: string): Promise<ReconciliationStatement> {
    const response = await apiClient.get<ReconciliationStatement>(
      `/reconciliation/statements/detail/${statementId}`
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取对账单详情失败');
  }

  // 下载对账单
  static async downloadStatement(statementId: string, filename?: string): Promise<void> {
    try {
      const downloadFilename = filename || `对账单_${statementId}.pdf`;
      await apiClient.downloadFile(
        `/reconciliation/statements/${statementId}/download`,
        downloadFilename
      );
    } catch (error) {
      throw new Error('下载对账单失败');
    }
  }

  // 标记对账单为已对账
  static async markStatementAsReconciled(statementId: string): Promise<boolean> {
    const response = await apiClient.post<boolean>(
      `/reconciliation/statements/${statementId}/reconcile`
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '标记对账状态失败');
  }

  // 获取对账统计
  static async getReconciliationStats(
    partnerId: string,
    period: DateRange
  ): Promise<{
    totalStatements: number;
    pendingStatements: number;
    reconciledStatements: number;
    totalAmount: number;
  }> {
    const response = await apiClient.get<{
      totalStatements: number;
      pendingStatements: number;
      reconciledStatements: number;
      totalAmount: number;
    }>(
      `/reconciliation/stats/${partnerId}`,
      period
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取对账统计失败');
  }

  // 批量生成对账单
  static async batchGenerateStatements(
    partnerIds: string[],
    period: string
  ): Promise<ReconciliationStatement[]> {
    const response = await apiClient.post<ReconciliationStatement[]>(
      '/reconciliation/batch-generate',
      { partnerIds, period }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '批量生成对账单失败');
  }
}