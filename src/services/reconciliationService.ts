import {
  ReconciliationStatement,
  ReconciliationStatus,
  PaginatedResponse,
  DateRange
} from '@/types';
import {
  getReconciliationStatementsForPartner,
  getReconciliationStatsForPartner,
  getReconciliationStatementById
} from '@/lib/mock-data-reconciliation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

export class ReconciliationService {
  // 获取对账单列表
  static async getStatementList(
    partnerId: string,
    options: {
      period?: string;
      page: number;
      pageSize: number;
    }
  ): Promise<PaginatedResponse<ReconciliationStatement>> {
    if (USE_MOCK_DATA) {
      const statements = getReconciliationStatementsForPartner(partnerId, options.period);
      const startIndex = (options.page - 1) * options.pageSize;
      const endIndex = startIndex + options.pageSize;
      
      return {
        data: statements.slice(startIndex, endIndex),
        total: statements.length,
        page: options.page,
        pageSize: options.pageSize,
        totalPages: Math.ceil(statements.length / options.pageSize),
      };
    }
    
    try {
      const url = new URL(`${API_BASE_URL}/reconciliation/statements/${partnerId}`);
      if (options.period) url.searchParams.set('period', options.period);
      url.searchParams.set('page', options.page.toString());
      url.searchParams.set('pageSize', options.pageSize.toString());
      
      const response = await fetch(url.toString());
      return response.json();
    } catch (error) {
      console.error('获取对账单列表失败:', error);
      throw error;
    }
  }

  // 获取对账单详情
  static async getStatementDetail(statementId: string): Promise<ReconciliationStatement | null> {
    if (USE_MOCK_DATA) {
      return getReconciliationStatementById(statementId) || null;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/reconciliation/statements/detail/${statementId}`);
      return response.json();
    } catch (error) {
      console.error('获取对账单详情失败:', error);
      throw error;
    }
  }

  // 下载对账单
  static async downloadStatement(statementId: string, filename: string): Promise<void> {
    if (USE_MOCK_DATA) {
      // 模拟下载
      console.log(`模拟下载对账单: ${filename}`);
      return Promise.resolve();
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/reconciliation/statements/download/${statementId}`);
      const blob = await response.blob();
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载对账单失败:', error);
      throw error;
    }
  }

  // 标记对账单为已对账
  static async markStatementAsReconciled(statementId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log(`模拟标记对账单 ${statementId} 为已对账`);
      return Promise.resolve();
    }
    
    try {
      await fetch(`${API_BASE_URL}/reconciliation/statements/${statementId}/reconcile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ReconciliationStatus.RECONCILED })
      });
    } catch (error) {
      console.error('标记对账状态失败:', error);
      throw error;
    }
  }

  // 确认对账单
  static async confirmStatement(statementId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log(`模拟确认对账单 ${statementId}`);
      return Promise.resolve();
    }
    
    try {
      await fetch(`${API_BASE_URL}/reconciliation/statements/${statementId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ReconciliationStatus.CONFIRMED })
      });
    } catch (error) {
      console.error('确认对账单失败:', error);
      throw error;
    }
  }

  // 生成对账单
  static async generateStatement(
    partnerId: string,
    period: string,
    startDate: string,
    endDate: string
  ): Promise<ReconciliationStatement> {
    if (USE_MOCK_DATA) {
      const newStatement: ReconciliationStatement = {
        id: `stmt-${Date.now()}`,
        partnerId,
        period,
        startDate,
        endDate,
        totalRevenue: 0,
        totalSharing: 0,
        netAmount: 0,
        status: ReconciliationStatus.DRAFT,
        details: [],
        createdAt: new Date().toISOString(),
      };
      
      return Promise.resolve(newStatement);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/reconciliation/statements/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          period,
          startDate,
          endDate
        })
      });
      return response.json();
    } catch (error) {
      console.error('生成对账单失败:', error);
      throw error;
    }
  }

  // 获取对账统计
  static async getReconciliationStats(
    partnerId: string,
    period: {
      startDate: string;
      endDate: string;
    }
  ): Promise<{
    totalStatements: number;
    pendingStatements: number;
    reconciledStatements: number;
    totalAmount: number;
  }> {
    if (USE_MOCK_DATA) {
      return getReconciliationStatsForPartner(partnerId);
    }
    
    try {
      const url = new URL(`${API_BASE_URL}/reconciliation/stats/${partnerId}`);
      url.searchParams.set('startDate', period.startDate);
      url.searchParams.set('endDate', period.endDate);
      
      const response = await fetch(url.toString());
      return response.json();
    } catch (error) {
      console.error('获取对账统计失败:', error);
      throw error;
    }
  }
}