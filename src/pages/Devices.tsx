import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import { Search, Monitor, TrendingUp, TrendingDown, RefreshCw, Eye } from 'lucide-react';
import { DeviceService } from '@/services/deviceService';
import { Device, DeviceStatus } from '@/types/index';

export default function Devices() {
  const { hasPermission } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: devices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: () => DeviceService.getDevices(),
    staleTime: 5 * 60 * 1000,
  });

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.cardNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.ACTIVE:
        return 'default';
      case DeviceStatus.INACTIVE:
        return 'secondary';
      case DeviceStatus.SUSPENDED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.ACTIVE:
        return '活跃';
      case DeviceStatus.INACTIVE:
        return '未激活';
      case DeviceStatus.SUSPENDED:
        return '已暂停';
      default:
        return status;
    }
  };

  const stats = {
    total: devices.length,
    active: devices.filter(d => d.status === DeviceStatus.ACTIVE).length,
    inactive: devices.filter(d => d.status === DeviceStatus.INACTIVE).length,
    suspended: devices.filter(d => d.status === DeviceStatus.SUSPENDED).length,
  };

  if (isLoading) {
    return <LoadingSkeleton type="table" count={5} />;
  }

  if (error) {
    return (
      <EmptyState
        title="加载失败"
        description="加载设备数据失败"
        actionLabel="重新加载"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">设备列表</h1>
          <p className="text-muted-foreground">管理设备与会员卡的绑定关系</p>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="总设备数"
          value={stats.total}
          icon={<Monitor className="h-4 w-4" />}
        />
        <StatsCard
          title="活跃设备"
          value={stats.active}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="未激活设备"
          value={stats.inactive}
          icon={<Monitor className="h-4 w-4" />}
        />
        <StatsCard
          title="已暂停设备"
          value={stats.suspended}
          icon={<TrendingDown className="h-4 w-4" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>设备列表</CardTitle>
          <CardDescription>管理所有设备与会员卡的绑定关系</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索设备MAC地址、设备名称或会员卡号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="按状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="ACTIVE">活跃</SelectItem>
                <SelectItem value="INACTIVE">未激活</SelectItem>
                <SelectItem value="SUSPENDED">已暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Devices Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MAC地址</TableHead>
                  <TableHead>设备名称</TableHead>
                  <TableHead>设备型号</TableHead>
                  <TableHead>绑定会员卡</TableHead>
                  <TableHead>绑定时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-mono">{device.macAddress}</TableCell>
                    <TableCell>{device.deviceName || '-'}</TableCell>
                    <TableCell>{device.deviceModel || '-'}</TableCell>
                    <TableCell>{device.cardNumber || '未绑定'}</TableCell>
                    <TableCell>{device.boundAt ? new Date(device.boundAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(device.status)}>
                        {getStatusLabel(device.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {hasPermission('devices:read') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/devices/${device.id}`)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            详情
                          </Button>
                        )}
                        {hasPermission('cards.update') && (
                          <Button variant="ghost" size="sm">编辑</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDevices.length === 0 && (
            <EmptyState
              title="暂无设备"
              description="没有找到符合条件的设备"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}