import { apiClient } from '@/lib/api';
import { DashboardData, KPIMetrics, DateRange, ChartData } from '@/types';
import { CardService } from './cardService';
import { RevenueSharingService } from './revenueSharingService';
import { OrderService } from './orderService';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

// Mock数据
const mockDashboardData: DashboardData = {
  totalCards: 1250,
  activeCards: 980,
  totalRevenue: 125000,
  monthlyRevenue: 15800,
  totalSharing: 8500,
  monthlySharing: 1200,
  pointsBalance: 2850, // 新增积分余额
  recentTransactions: [],
  revenueChart: [
    { date: '2024-01-01', revenue: 12000, sharing: 800 },
    { date: '2024-01-02', revenue: 15000, sharing: 950 },
    { date: '2024-01-03', revenue: 13500, sharing: 850 },
    { date: '2024-01-04', revenue: 16800, sharing: 1100 },
    { date: '2024-01-05', revenue: 14200, sharing: 920 },
  ],
  cardStats: {
    unactivated: 150,
    bound: 850,
    expired: 180,
    cancelled: 70
  },
  sharingStats: {
    totalReceived: 8500,
    totalPaid: 3200,
    sharingCount: 45
  }
};

export class DashboardService {
  // 获取仪表板数据
  static async getDashboardData(partnerId: string): Promise<DashboardData> {
    if (USE_MOCK_DATA) {
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 获取实时数据
      try {
        const [cardStats, sharingStats] = await Promise.all([
          CardService.getCardStats(partnerId),
          RevenueSharingService.getSharingStats(partnerId, {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          })
        ]);
        
        return {
          ...mockDashboardData,
          totalCards: cardStats.totalCards,
          activeCards: cardStats.activeCards,
          cardStats: {
            unactivated: cardStats.totalCards - cardStats.activeCards - cardStats.expiredCards - cardStats.cancelledCards,
            bound: cardStats.activeCards,
            expired: cardStats.expiredCards,
            cancelled: cardStats.cancelledCards
          },
          sharingStats: {
            totalReceived: sharingStats.totalReceived,
            totalPaid: sharingStats.totalPaid,
            sharingCount: sharingStats.sharingCount
          }
        };
      } catch (error) {
        console.error('获取实时数据失败，使用模拟数据:', error);
        return mockDashboardData;
      }
    }

    const response = await apiClient.get<DashboardData>(`/dashboard/${partnerId}/data`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取仪表板数据失败');
  }

  // 获取KPI指标
  static async getKPIMetrics(partnerId: string, period?: DateRange): Promise<KPIMetrics> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        cardUtilizationRate: 78.5,
        averageTransactionAmount: 245.6,
        partnerGrowthRate: 12.3,
        reconciliationAccuracy: 99.2
      });
    }

    const response = await apiClient.get<KPIMetrics>(
      `/dashboard/${partnerId}/kpi`,
      period ? { startDate: period.startDate, endDate: period.endDate } : {}
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取KPI指标失败');
  }

  // 获取收入图表数据
  static async getRevenueChart(partnerId: string, period?: DateRange): Promise<ChartData[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockDashboardData.revenueChart);
    }

    const response = await apiClient.get<ChartData[]>(
      `/dashboard/${partnerId}/revenue-chart`,
      period ? { startDate: period.startDate, endDate: period.endDate } : {}
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取收入图表数据失败');
  }

  // 获取合作伙伴概览
  static async getPartnerOverview(partnerId: string): Promise<{
    totalSubPartners: number;
    activeSubPartners: number;
    monthlyGrowth: number;
    totalCommission: number;
  }> {
    const response = await apiClient.get<{
      totalSubPartners: number;
      activeSubPartners: number;
      monthlyGrowth: number;
      totalCommission: number;
    }>(`/dashboard/${partnerId}/overview`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '获取合作伙伴概览失败');
  }
}