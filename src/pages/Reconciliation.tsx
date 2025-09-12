import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ReconciliationService } from '@/services/reconciliationService';
import { ReconciliationStatement, ReconciliationStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Check, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Plus,
  Eye,
  Calendar,
} from 'lucide-react';

export default function Reconciliation() {
  const [statements, setStatements] = useState<ReconciliationStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [stats, setStats] = useState({
    totalStatements: 0,
    pendingStatements: 0,
    reconciledStatements: 0,
    totalAmount: 0,
  });
  
  const { user } = useAuthStore();
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 如果是管理员，使用默认的partnerId
      const partnerId = user?.partnerId || 'partner-001';
      
      // 加载对账单列表
      const response = await ReconciliationService.getStatementList(partnerId, {
        period: selectedPeriod === 'all' ? '' : selectedPeriod,
        page: 1,
        pageSize: 50,
      });
      setStatements(response.data);

      // 加载统计数据
      const statsResponse = await ReconciliationService.getReconciliationStats(
        partnerId,
        {
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
        }
      );
      setStats(statsResponse || {
        totalStatements: 0,
        pendingStatements: 0,
        reconciledStatements: 0,
        totalAmount: 0,
      });

    } catch (error: unknown) {
      toast({
        title: '加载失败',
        description: error instanceof Error ? error.message : '加载失败',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const handleDownloadStatement = async (statementId: string, period: string) => {
    try {
      await ReconciliationService.downloadStatement(statementId, `对账单_${period}.pdf`);
      toast({
        title: '下载成功',
        description: '对账单已开始下载',
      });
    } catch (error: unknown) {
      toast({
        title: '下载失败',
        description: error instanceof Error ? error.message : '下载失败',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsReconciled = async (statementId: string) => {
    try {
      await ReconciliationService.markStatementAsReconciled(statementId);
      toast({
        title: '操作成功',
        description: '对账单已标记为已对账',
      });
      loadData();
    } catch (error: unknown) {
      toast({
        title: '操作失败',
        description: error instanceof Error ? error.message : '操作失败',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: ReconciliationStatus) => {
    const statusMap = {
      DRAFT: { label: '草稿', variant: 'secondary' as const, icon: Clock },
      CONFIRMED: { label: '已确认', variant: 'default' as const, icon: Check },
      RECONCILED: { label: '已对账', variant: 'outline' as const, icon: FileText },
    };
    
    const statusInfo = statusMap[status];
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const statCards = [
    {
      title: '总对账单数',
      value: stats.totalStatements || 0,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: '待处理',
      value: stats.pendingStatements || 0,
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: '已对账',
      value: stats.reconciledStatements || 0,
      icon: Check,
      color: 'text-green-600',
    },
    {
      title: '总金额',
      value: `¥${(stats.totalAmount || 0).toLocaleString()}`,
      icon: AlertCircle,
      color: 'text-purple-600',
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
          <h1 className="text-3xl font-bold text-gray-900">对账管理</h1>
          <p className="text-gray-600">管理月度对账单和对账流程</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            生成对账单
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
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">对账期间</label>
              <Select value={selectedPeriod || 'all'} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="选择对账期间" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部期间</SelectItem>
                  <SelectItem value="2024-01">2024年1月</SelectItem>
                  <SelectItem value="2024-02">2024年2月</SelectItem>
                  <SelectItem value="2024-03">2024年3月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statements Table */}
      <Card>
        <CardHeader>
          <CardTitle>对账单列表</CardTitle>
          <CardDescription>查看和管理对账单</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>对账期间</TableHead>
                <TableHead>开始日期</TableHead>
                <TableHead>结束日期</TableHead>
                <TableHead>总收入</TableHead>
                <TableHead>总分账</TableHead>
                <TableHead>净金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {statement.period}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(statement.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(statement.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>¥{(statement.totalRevenue || 0).toLocaleString()}</TableCell>
                  <TableCell>¥{(statement.totalSharing || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={statement.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ¥{(statement.netAmount || 0).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(statement.status)}</TableCell>
                  <TableCell>
                    {new Date(statement.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadStatement(statement.id, statement.period)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {statement.status === ReconciliationStatus.CONFIRMED && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsReconciled(statement.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}