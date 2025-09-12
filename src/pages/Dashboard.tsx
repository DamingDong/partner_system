import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { DashboardService } from '@/services/dashboardService';
import { DashboardData, KPIMetrics, ChartData, UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/stats-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PartnerDashboard } from '@/components/dashboard/PartnerDashboard';
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardData', user?.partnerId],
    queryFn: () => DashboardService.getDashboardData(user!.partnerId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: kpiData } = useQuery({
    queryKey: ['kpiData', user?.partnerId],
    queryFn: () => DashboardService.getKPIMetrics(user!.partnerId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenueData', user?.partnerId],
    queryFn: () => DashboardService.getRevenueChart(user!.partnerId),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stats" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="table" count={5} />
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <EmptyState
        title="暂无数据"
        description="当前没有可显示的仪表板数据"
        actionLabel="重新加载"
        onAction={() => refetch()}
      />
    );
  }

  // 根据用户角色渲染不同的Dashboard
  if (user?.role === UserRole.PARTNER) {
    return (
      <PartnerDashboard 
        dashboardData={dashboardData}
        onRefresh={refetch}
      />
    );
  }

  // 管理员Dashboard保持原有逻辑
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600">欢迎回来，{user?.username}</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="总会员卡数"
          value={dashboardData?.totalCards || 0}
          icon={<CreditCard className="h-4 w-4" />}
          trend="+12%"
          trendUp={true}
          description="相比上月"
        />
        <StatsCard
          title="活跃会员卡"
          value={dashboardData?.activeCards || 0}
          icon={<Activity className="h-4 w-4" />}
          trend="+8%"
          trendUp={true}
          description="相比上月"
        />
        <StatsCard
          title="总收入"
          value={`¥${(dashboardData?.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="+15%"
          trendUp={true}
          description="相比上月"
        />
        <StatsCard
          title="本月收入"
          value={`¥${(dashboardData?.monthlyRevenue || 0).toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="-3%"
          trendUp={false}
          description="相比上月"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>收入趋势</CardTitle>
            <CardDescription>最近30天的收入变化</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData || dashboardData?.revenueChart || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="收入"
                />
                <Line
                  type="monotone"
                  dataKey="sharing"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="分账"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>最近交易</CardTitle>
            <CardDescription>最新的交易记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboardData?.recentTransactions || []).slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {transaction.metadata?.description || '交易'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ¥{transaction.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        transaction.status === 'COMPLETED'
                          ? 'default'
                          : transaction.status === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {transaction.status === 'COMPLETED'
                        ? '已完成'
                        : transaction.status === 'PENDING'
                        ? '处理中'
                        : '失败'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 新增：会员卡和分账数据卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 会员卡状态分布 */}
        <Card>
          <CardHeader>
            <CardTitle>会员卡状态</CardTitle>
            <CardDescription>各状态会员卡数量分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">待激活</span>
                <Badge variant="secondary">{dashboardData?.cardStats?.unactivated || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">已绑定</span>
                <Badge variant="default">{dashboardData?.cardStats?.bound || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">已过期</span>
                <Badge variant="outline">{dashboardData?.cardStats?.expired || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">已销卡</span>
                <Badge variant="destructive">{dashboardData?.cardStats?.cancelled || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 分账统计 */}
        <Card>
          <CardHeader>
            <CardTitle>分账统计</CardTitle>
            <CardDescription>本月分账数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">收到分账</span>
                <span className="font-medium text-green-600">
                  ¥{(dashboardData?.sharingStats?.totalReceived || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">支出分账</span>
                <span className="font-medium text-red-600">
                  ¥{(dashboardData?.sharingStats?.totalPaid || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">净收入</span>
                <span className="font-medium text-blue-600">
                  ¥{((dashboardData?.sharingStats?.totalReceived || 0) - (dashboardData?.sharingStats?.totalPaid || 0)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">分账笔数</span>
                <span className="font-medium">{dashboardData?.sharingStats?.sharingCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用功能快速访问</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/cards'}
              >
                <CreditCard className="h-4 w-4 mb-1" />
                <span className="text-xs">会员卡</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-12 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/revenue-sharing'}
              >
                <TrendingUp className="h-4 w-4 mb-1" />
                <span className="text-xs">分账管理</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-12 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/reconciliation'}
              >
                <Activity className="h-4 w-4 mb-1" />
                <span className="text-xs">对账管理</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-12 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/reports'}
              >
                <DollarSign className="h-4 w-4 mb-1" />
                <span className="text-xs">数据报表</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}