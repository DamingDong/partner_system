import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { RevenueSharingService } from '@/services/revenueSharingService';
import { OrderService } from '@/services/orderService';
import { 
  SharingRecord, 
  SharingRule, 
  Order, 
  OrderType, 
  DateRange,
  PaginatedResponse 
} from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  RefreshCw,
  Plus,
  Settings,
  Eye,
  Filter,
  Download,
  Search,
  Calendar as CalendarIcon,
  BarChart3,
  CreditCard,
  ShoppingCart
} from 'lucide-react';

export default function RevenueSharing() {
  // 状态管理
  const [mySharing, setMySharing] = useState<SharingRecord[]>([]);
  const [downstreamSharing, setDownstreamSharing] = useState<SharingRecord[]>([]);
  const [sharingRules, setSharingRules] = useState<SharingRule[]>([]);
  const [activationOrders, setActivationOrders] = useState<Order[]>([]);
  const [subscriptionOrders, setSubscriptionOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSharing: 0,
    totalReceived: 0,
    totalPaid: 0,
    sharingCount: 0,
  });
  
  // 筛选和分页状态
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [activeTab, setActiveTab] = useState<'overview' | 'my-sharing' | 'downstream' | 'orders' | 'rules'>('overview');
  
  // 模态框状态
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SharingRecord | null>(null);
  
  const { user } = useAuthStore();

  // 数据加载函数
  const loadData = useCallback(async () => {
    if (!user?.partnerId) return;

    try {
      setLoading(true);
      
      // 并行加载所有数据
      const [myResponse, downstreamResponse, rulesResponse, statsResponse, activationResponse, subscriptionResponse] = await Promise.all([
        RevenueSharingService.getMySharing(user.partnerId, dateRange, currentPage, pageSize),
        RevenueSharingService.getDownstreamSharing(user.partnerId, currentPage, pageSize),
        RevenueSharingService.getSharingRules(user.partnerId),
        RevenueSharingService.getSharingStats(user.partnerId, dateRange),
        OrderService.getActivationOrders(user.partnerId, dateRange, 1, 10),
        OrderService.getSubscriptionOrders(user.partnerId, dateRange, 1, 10)
      ]);
      
      setMySharing(myResponse.data || []);
      setDownstreamSharing(downstreamResponse.data || []);
      setSharingRules(rulesResponse || []);
      setActivationOrders(activationResponse.data || []);
      setSubscriptionOrders(subscriptionResponse.data || []);
      setStats({
        totalSharing: statsResponse.totalSharing || 0,
        totalReceived: statsResponse.totalReceived || 0,
        totalPaid: statsResponse.totalPaid || 0,
        sharingCount: statsResponse.sharingCount || 0,
      });

    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  }, [user?.partnerId, dateRange, currentPage, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: '待处理', variant: 'secondary' as const },
      COMPLETED: { label: '已完成', variant: 'default' as const },
      FAILED: { label: '失败', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const statCards = [
    {
      title: '总分账金额',
      value: `¥${stats.totalSharing.toLocaleString()}`,
      icon: DollarSign,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: '收到分账',
      value: `¥${stats.totalReceived.toLocaleString()}`,
      icon: TrendingUp,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: '支出分账',
      value: `¥${stats.totalPaid.toLocaleString()}`,
      icon: TrendingDown,
      trend: '-3%',
      trendUp: false,
    },
    {
      title: '分账笔数',
      value: stats.sharingCount.toString(),
      icon: Users,
      trend: '+15%',
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分账管理</h1>
          <p className="text-gray-600">管理收入分账和下游合作伙伴分账</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            分账设置
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span
                  className={`text-xs ${
                    stat.trendUp ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.trend}
                </span>
                <span className="text-xs text-gray-500 ml-1">相比上月</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="my-sharing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-sharing">我的分账</TabsTrigger>
          <TabsTrigger value="downstream">下游分账</TabsTrigger>
          <TabsTrigger value="rules">分账规则</TabsTrigger>
        </TabsList>

        {/* My Sharing Tab */}
        <TabsContent value="my-sharing">
          <Card>
            <CardHeader>
              <CardTitle>我的分账记录</CardTitle>
              <CardDescription>最近30天的分账收入记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易ID</TableHead>
                    <TableHead>来源合作伙伴</TableHead>
                    <TableHead>分账金额</TableHead>
                    <TableHead>分账比例</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>结算时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mySharing.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.transactionId?.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{record.fromPartnerId || '-'}</TableCell>
                      <TableCell>¥{(record.amount || 0).toLocaleString()}</TableCell>
                      <TableCell>{((record.rate || 0) * 100).toFixed(1)}%</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        {record.settledAt ? new Date(record.settledAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Downstream Sharing Tab */}
        <TabsContent value="downstream">
          <Card>
            <CardHeader>
              <CardTitle>下游分账记录</CardTitle>
              <CardDescription>支付给下游合作伙伴的分账记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易ID</TableHead>
                    <TableHead>目标合作伙伴</TableHead>
                    <TableHead>分账金额</TableHead>
                    <TableHead>分账比例</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>结算时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downstreamSharing.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.transactionId?.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{record.toPartnerId || '-'}</TableCell>
                      <TableCell>¥{(record.amount || 0).toLocaleString()}</TableCell>
                      <TableCell>{((record.rate || 0) * 100).toFixed(1)}%</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        {record.settledAt ? new Date(record.settledAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>分账规则</CardTitle>
                  <CardDescription>配置和管理分账规则</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  添加规则
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>规则名称</TableHead>
                    <TableHead>分账比例</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>生效日期</TableHead>
                    <TableHead>到期日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sharingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.orderType || '-'}</TableCell>
                      <TableCell>{((rule.commissionRate || 0) * 100).toFixed(1)}%</TableCell>
                      <TableCell>{rule.priority || 0}</TableCell>
                      <TableCell>
                        {rule.effectiveDate ? new Date(rule.effectiveDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {rule.expiryDate ? new Date(rule.expiryDate).toLocaleDateString() : '永久'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? '启用' : '禁用'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}