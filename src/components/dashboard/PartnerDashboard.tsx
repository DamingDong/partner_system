import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  TrendingUp,
  Package,
  Gift,
  Plus,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';

interface PartnerDashboardProps {
  dashboardData: any;
  onRefresh: () => void;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({
  dashboardData,
  onRefresh
}) => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* 合作伙伴专用欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">欢迎回来，{user?.name}</h1>
            <p className="text-blue-100">合作伙伴控制面板</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">我的等级</p>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {user?.role === UserRole.PARTNER ? '合作伙伴' : '管理员'}
            </Badge>
          </div>
        </div>
      </div>

      {/* 核心业务数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">我的会员卡</p>
                <p className="text-2xl font-bold text-green-700">
                  {dashboardData?.totalCards || 0}
                </p>
                <p className="text-xs text-green-500">总计</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">活跃卡片</p>
                <p className="text-2xl font-bold text-blue-700">
                  {dashboardData?.activeCards || 0}
                </p>
                <p className="text-xs text-blue-500">已激活</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">积分余额</p>
                <p className="text-2xl font-bold text-purple-700">
                  {dashboardData?.pointsBalance || 0}
                </p>
                <p className="text-xs text-purple-500">可兑换</p>
              </div>
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">本月收入</p>
                <p className="text-2xl font-bold text-orange-700">
                  ¥{(dashboardData?.monthlyRevenue || 0).toLocaleString()}
                </p>
                <p className="text-xs text-orange-500">分账收入</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            快速操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/cards'}
            >
              <Plus className="h-6 w-6" />
              <span>导入卡片</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/cards?tab=redemptions'}
            >
              <Gift className="h-6 w-6" />
              <span>积分兑换</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/revenue-sharing'}
            >
              <TrendingUp className="h-6 w-6" />
              <span>查看分账</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/cards?tab=batches'}
            >
              <Package className="h-6 w-6" />
              <span>批次管理</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};