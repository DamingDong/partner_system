// Mock API implementation for development
import { mockApiResponses, mockAdminUser, mockPartnerUser, adminPermissions, partnerPermissions, mockDashboardData } from './mock-data';
import { LoginRequest, AuthResponse } from '@/types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiClient {
  private isLoggedIn = false;

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(1000);
    
    // 管理员登录（支持邮箱或用户名）
    if ((credentials.username === 'admin@example.com' || credentials.username === 'admin') && credentials.password === 'password') {
      this.isLoggedIn = true;
      return {
        user: mockAdminUser,
        accessToken: 'mock-admin-token',
        refreshToken: 'mock-admin-refresh-token',
        permissions: adminPermissions,
      };
    }
    
    // 合作伙伴登录（支持邮箱或用户名）
    if ((credentials.username === 'partner001@example.com' || credentials.username === 'partner001') && credentials.password === 'password') {
      this.isLoggedIn = true;
      return {
        user: mockPartnerUser,
        accessToken: 'mock-partner-token',
        refreshToken: 'mock-partner-refresh-token',
        permissions: partnerPermissions,
      };
    }
    
    throw new Error('邮箱地址或密码错误');
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<{ success: boolean; data: T }> {
    await delay(500);
    
    // 开发环境绕过登录检查
    if (!this.isLoggedIn && !url.includes('/auth/') && !import.meta.env.DEV) {
      throw new Error('未授权访问');
    }

    // Route mock responses based on URL
    if (url.includes('/dashboard/')) {
      if (url.includes('/kpi')) {
        return {
          success: true,
          data: {
            totalCards: mockDashboardData.totalCards,
            activeCards: mockDashboardData.activeCards,
            totalRevenue: mockDashboardData.totalRevenue,
            monthlyRevenue: mockDashboardData.monthlyRevenue,
            totalSharing: mockDashboardData.totalSharing,
            monthlySharing: mockDashboardData.monthlySharing,
          }
        } as { success: boolean; data: T };
      } else if (url.includes('/revenue-chart')) {
        return { success: true, data: mockDashboardData.revenueChart } as { success: boolean; data: T };
      } else if (url.includes('/overview')) {
        return {
          success: true,
          data: {
            totalSubPartners: 25,
            activeSubPartners: 20,
            monthlyGrowth: 15.5,
            totalCommission: 15000
          }
        } as { success: boolean; data: T };
      } else {
        return mockApiResponses.dashboardData as { success: boolean; data: T };
      }
    }
    
    // 开发环境特殊处理
    if (import.meta.env.DEV && url.includes('/dashboard')) {
      return mockApiResponses.dashboardData as { success: boolean; data: T };
    }
    
    // 匹配 /dashboard/:partnerId 格式
    if (url.match(/\/dashboard\/[^\/]+$/)) {
      return mockApiResponses.dashboardData as { success: boolean; data: T };
    }
    
    if (url.includes('/cards')) {
      return mockApiResponses.cardsList as { success: boolean; data: T };
    }
    
    if (url.includes('/sharing/')) {
      return mockApiResponses.sharingRecords as { success: boolean; data: T };
    }
    
    if (url.includes('/reconciliation/')) {
      return mockApiResponses.reconciliationStatements as { success: boolean; data: T };
    }

    // Default response
    return { success: true, data: {} as T };
  }

  async post<T>(url: string, data?: unknown): Promise<{ success: boolean; data: T }> {
    await delay(500);
    
    if (url.includes('/auth/login')) {
      const authData = await this.login(data as LoginRequest);
      return { success: true, data: authData as T };
    }
    
    if (url.includes('/auth/logout')) {
      this.isLoggedIn = false;
      return { success: true, data: {} as T };
    }

    // Default success response for POST requests
    return { success: true, data: true as T };
  }

  async put<T>(url: string, data?: unknown): Promise<{ success: boolean; data: T }> {
    await delay(500);
    return { success: true, data: true as T };
  }

  async delete<T>(url: string): Promise<{ success: boolean; data: T }> {
    await delay(500);
    return { success: true, data: true as T };
  }

  async downloadFile(url: string, filename: string): Promise<void> {
    await delay(1000);
    
    // Create a mock PDF blob
    const content = `Mock PDF content for ${filename}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Export mock client instance
export const mockApiClient = new MockApiClient();