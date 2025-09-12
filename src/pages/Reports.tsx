import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, Users, DollarSign, CreditCard } from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  type: 'revenue' | 'partners' | 'cards' | 'sharing';
  dateRange: string;
  data: any[];
  total: number;
  growth: number;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for reports
  const mockReports: ReportData[] = [
    {
      id: '1',
      title: '收入报表',
      type: 'revenue',
      dateRange: '2024年1月',
      data: [
        { name: '1月', revenue: 4000, profit: 2400 },
        { name: '2月', revenue: 3000, profit: 1398 },
        { name: '3月', revenue: 2000, profit: 9800 },
        { name: '4月', revenue: 2780, profit: 3908 },
        { name: '5月', revenue: 1890, profit: 4800 },
        { name: '6月', revenue: 2390, profit: 3800 },
      ],
      total: 14060,
      growth: 12.5,
    },
    {
      id: '2',
      title: '合作伙伴统计',
      type: 'partners',
      dateRange: '2024年1月',
      data: [
        { name: '活跃伙伴', value: 400, color: '#0088FE' },
        { name: '新注册', value: 300, color: '#00C49F' },
        { name: '待审核', value: 300, color: '#FFBB28' },
        { name: '已暂停', value: 200, color: '#FF8042' },
      ],
      total: 1200,
      growth: 8.3,
    },
    {
      id: '3',
      title: '会员卡销售',
      type: 'cards',
      dateRange: '2024年1月',
      data: [
        { name: '基础卡', sales: 120, amount: 12000 },
        { name: '高级卡', sales: 80, amount: 24000 },
        { name: '尊享卡', sales: 40, amount: 20000 },
        { name: '至尊卡', sales: 20, amount: 20000 },
      ],
      total: 260, // 总销售数量
      growth: 15.7,
    },
    {
      id: '4',
      title: '分润统计',
      type: 'sharing',
      dateRange: '2024年1月',
      data: [
        { name: '直接分润', amount: 5000, count: 50 },
        { name: '间接分润', amount: 3000, count: 30 },
        { name: '团队分润', amount: 2000, count: 20 },
      ],
      total: 10000,
      growth: 22.1,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
    // Implementation for export functionality
  };

  const renderRevenueChart = () => {
    const revenueData = reports.find(r => r.type === 'revenue')?.data || [];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#8884d8" />
          <Bar dataKey="profit" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPartnersChart = () => {
    const partnersData = reports.find(r => r.type === 'partners')?.data || [];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={partnersData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {partnersData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderCardsChart = () => {
    const cardsData = reports.find(r => r.type === 'cards')?.data || [];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={cardsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderSharingChart = () => {
    const sharingData = reports.find(r => r.type === 'sharing')?.data || [];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sharingData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">数据报表</h1>
          <p className="text-muted-foreground">查看和分析系统各项数据指标</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">今日</SelectItem>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExport('all')}>
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{reports.find(r => r.type === 'revenue')?.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{reports.find(r => r.type === 'revenue')?.growth}% 较上期
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">合作伙伴</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.find(r => r.type === 'partners')?.total}</div>
            <p className="text-xs text-muted-foreground">
              +{reports.find(r => r.type === 'partners')?.growth}% 较上期
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">会员卡销售</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.find(r => r.type === 'cards')?.total}张</div>
            <p className="text-xs text-muted-foreground">
              +{reports.find(r => r.type === 'cards')?.growth}% 较上期
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">分润总额</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{reports.find(r => r.type === 'sharing')?.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{reports.find(r => r.type === 'sharing')?.growth}% 较上期
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="revenue">收入分析</TabsTrigger>
          <TabsTrigger value="partners">伙伴分析</TabsTrigger>
          <TabsTrigger value="cards">卡片销售</TabsTrigger>
          <TabsTrigger value="sharing">分润分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>收入趋势</CardTitle>
                <CardDescription>最近6个月收入变化</CardDescription>
              </CardHeader>
              <CardContent>{renderRevenueChart()}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>合作伙伴分布</CardTitle>
                <CardDescription>合作伙伴状态统计</CardDescription>
              </CardHeader>
              <CardContent>{renderPartnersChart()}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>收入详细分析</CardTitle>
              <CardDescription>收入构成和趋势分析</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRevenueChart()}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>总收入:</span>
                  <span className="font-bold">¥{reports.find(r => r.type === 'revenue')?.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>增长率:</span>
                  <span className="font-bold text-green-600">+{reports.find(r => r.type === 'revenue')?.growth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>合作伙伴分析</CardTitle>
              <CardDescription>合作伙伴增长和分布</CardDescription>
            </CardHeader>
            <CardContent>
              {renderPartnersChart()}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>总伙伴数:</span>
                  <span className="font-bold">{reports.find(r => r.type === 'partners')?.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>活跃率:</span>
                  <span className="font-bold text-blue-600">33.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>会员卡销售分析</CardTitle>
              <CardDescription>各类型卡片销售情况</CardDescription>
            </CardHeader>
            <CardContent>
              {renderCardsChart()}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>总销售量:</span>
                  <span className="font-bold">{reports.find(r => r.type === 'cards')?.total}张</span>
                </div>
                <div className="flex justify-between">
                  <span>销售额:</span>
                  <span className="font-bold">¥{76000}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>分润统计分析</CardTitle>
              <CardDescription>分润来源和趋势</CardDescription>
            </CardHeader>
            <CardContent>
              {renderSharingChart()}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>总分润:</span>
                  <span className="font-bold">¥{reports.find(r => r.type === 'sharing')?.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>分润笔数:</span>
                  <span className="font-bold">100笔</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;