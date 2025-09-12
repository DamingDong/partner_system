import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatsCard } from '@/components/ui/stats-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, Users, TrendingUp, TrendingDown, User, RefreshCw } from 'lucide-react';
import { PartnerService } from '@/services/partnerService';
import { Partner, PartnerType, PartnerStatus } from '@/types/index';

export default function Partners() {
  const { hasPermission } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: partners = [], isLoading, error, refetch } = useQuery({
    queryKey: ['partners'],
    queryFn: () => PartnerService.getPartners(),
    staleTime: 5 * 60 * 1000,
  });

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || partner.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeVariant = (status: PartnerStatus) => {
    switch (status) {
      case PartnerStatus.ACTIVE:
        return 'default';
      case PartnerStatus.INACTIVE:
        return 'secondary';
      case PartnerStatus.SUSPENDED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: PartnerType) => {
    switch (type) {
      case PartnerType.PRIMARY:
        return '一级伙伴';
      case PartnerType.SECONDARY:
        return '二级伙伴';
      case PartnerType.TERTIARY:
        return '三级伙伴';
      default:
        return type;
    }
  };

  const stats = {
      total: partners.length,
      active: partners.filter(p => p.status === PartnerStatus.ACTIVE).length,
      inactive: partners.filter(p => p.status === PartnerStatus.INACTIVE).length,
      totalRevenue: partners.reduce((sum, p) => sum + (p.commissionRate * 100000), 0),
    };

  if (isLoading) {
    return <LoadingSkeleton type="table" count={5} />;
  }

  if (error) {
    return (
      <EmptyState
        title="加载失败"
        description="加载合作伙伴数据失败"
        actionLabel="重新加载"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">合作伙伴管理</h1>
          <p className="text-muted-foreground">管理您的合作伙伴关系</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          {hasPermission('partners.create') && (
            <Button>
              <Users className="mr-2 h-4 w-4" />
              添加合作伙伴
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              title="总合作伙伴"
              value={partners.length}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="活跃合作伙伴"
              value={partners.filter((p: Partner) => p.status === PartnerStatus.ACTIVE).length}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatsCard
              title="已停用"
              value={partners.filter((p: Partner) => p.status === PartnerStatus.INACTIVE).length}
              icon={<User className="h-4 w-4" />}
            />
            <StatsCard
              title="预计总收入"
              value={`¥${partners.reduce((sum: number, p: Partner) => sum + (p.commissionRate * 100000), 0).toLocaleString()}`}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>合作伙伴列表</CardTitle>
          <CardDescription>管理您的所有合作伙伴</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索合作伙伴..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="按类型筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="PRIMARY">一级伙伴</SelectItem>
            <SelectItem value="SECONDARY">二级伙伴</SelectItem>
            <SelectItem value="TERTIARY">三级伙伴</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="按状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="ACTIVE">活跃</SelectItem>
            <SelectItem value="INACTIVE">已停用</SelectItem>
            <SelectItem value="SUSPENDED">已暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Partners Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>公司名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>电话</TableHead>
                  <TableHead>佣金比例</TableHead>
                  <TableHead>总收入</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{getTypeLabel(partner.type)}</TableCell>
                    <TableCell>{partner.contactInfo.email}</TableCell>
                    <TableCell>{partner.contactInfo.phone}</TableCell>
                    <TableCell>{(partner.commissionRate * 100).toFixed(1)}%</TableCell>
                    <TableCell>¥{(partner.commissionRate * 100000).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(partner.status)}>
                        {partner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {hasPermission('partners.read') && (
                          <Button variant="ghost" size="sm">查看</Button>
                        )}
                        {hasPermission('partners.update') && (
                          <Button variant="ghost" size="sm">编辑</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPartners.length === 0 && (
            <EmptyState
              title="暂无合作伙伴"
              description="没有找到符合条件的合作伙伴"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}