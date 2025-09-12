// 合作伙伴相关类型定义

export enum PartnerType {
  DISTRIBUTOR = 'DISTRIBUTOR',
  AGENT = 'AGENT',
  RESELLER = 'RESELLER'
}

export enum PartnerStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

// 合作伙伴接口 - 用于合作伙伴管理页面
export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: PartnerType;
  status: PartnerStatus;
  commissionRate: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

// 仪表板数据接口
export interface DashboardData {
  totalCards: number;
  activeCards: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentTransactions: Transaction[];
  revenueChart: ChartData[];
}

export interface KPIMetrics {
  totalCards: number;
  activeCards: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  sharing: number;
}

export interface Transaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  metadata?: {
    description?: string;
  };
}