import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DeviceService } from '@/services/deviceService';
import { useAuthStore } from '@/store/authStore';
import { Device, DeviceStatus, DeviceRecoveryStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  ArrowLeft, 
  Monitor, 
  Calendar, 
  CreditCard,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Trash2
} from 'lucide-react';

const DeviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();

  const { data: device, isLoading, error } = useQuery({
    queryKey: ['device', id],
    queryFn: () => DeviceService.getDeviceById(id!),
    enabled: !!id,
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
        return 'secondary';
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
        return '未知';
    }
  };

  const getRecoveryStatusBadgeVariant = (status: DeviceRecoveryStatus) => {
    switch (status) {
      case DeviceRecoveryStatus.AVAILABLE:
        return 'default';
      case DeviceRecoveryStatus.LIMITED:
        return 'secondary';
      case DeviceRecoveryStatus.BLOCKED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getRecoveryStatusLabel = (status: DeviceRecoveryStatus) => {
    switch (status) {
      case DeviceRecoveryStatus.AVAILABLE:
        return '可回收';
      case DeviceRecoveryStatus.LIMITED:
        return '回收受限';
      case DeviceRecoveryStatus.BLOCKED:
        return '禁止回收';
      default:
        return '未知';
    }
  };

  const getRecoveryStatusDescription = (status: DeviceRecoveryStatus, recoveryCount: number) => {
    switch (status) {
      case DeviceRecoveryStatus.AVAILABLE:
        return '该设备可以正常进行权益回收操作';
      case DeviceRecoveryStatus.LIMITED:
        return `该设备已回收 ${recoveryCount} 次，回收操作受限`;
      case DeviceRecoveryStatus.BLOCKED:
        return `该设备已回收 ${recoveryCount} 次，达到最大回收次数限制，禁止继续回收`;
      default:
        return '回收状态未知';
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !device) {
    return (
      <EmptyState
        title="设备不存在"
        description="请检查设备ID是否正确"
        action={
          <Button onClick={() => navigate('/cards/devices')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回设备列表
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/devices')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">设备详情</h1>
            <p className="text-muted-foreground">查看设备的详细信息和管理操作</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusBadgeVariant(device.status)}>
            {getStatusLabel(device.status)}
          </Badge>
          <Badge variant={getRecoveryStatusBadgeVariant(device.recoveryStatus)}>
            {getRecoveryStatusLabel(device.recoveryStatus)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：基本信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 设备基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                设备基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">MAC地址</label>
                  <p className="text-lg font-mono">{device.macAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">设备名称</label>
                  <p>{device.deviceName || '未命名'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">设备型号</label>
                  <p>{device.deviceModel || '未知'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">系统版本</label>
                  <p>{device.systemVersion || '未知'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">设备状态</label>
                  <Badge variant={getStatusBadgeVariant(device.status)}>
                    {getStatusLabel(device.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                  <p>{new Date(device.createdAt).toLocaleString('zh-CN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 回收状态信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5" />
                回收状态
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">回收状态</label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRecoveryStatusBadgeVariant(device.recoveryStatus)}>
                      {getRecoveryStatusLabel(device.recoveryStatus)}
                    </Badge>
                    {device.recoveryStatus === DeviceRecoveryStatus.BLOCKED && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">回收次数</label>
                  <p className="text-lg font-semibold">{device.recoveryCount} 次</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">最后回收时间</label>
                  <p>{device.lastRecoveryDate ? new Date(device.lastRecoveryDate).toLocaleString('zh-CN') : '从未回收'}</p>
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {getRecoveryStatusDescription(device.recoveryStatus, device.recoveryCount)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 关联会员卡信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                关联会员卡
              </CardTitle>
            </CardHeader>
            <CardContent>
              {device.cardNumber ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">卡号</label>
                      <p className="font-mono">{device.cardNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">绑定时间</label>
                      <p>{device.boundAt ? new Date(device.boundAt).toLocaleString('zh-CN') : '未知'}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // 根据卡号跳转到会员卡详情页
                      navigate(`/cards/${device.cardNumber}`);
                    }}
                  >
                    查看会员卡详情
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">该设备未绑定任何会员卡</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：操作面板 */}
        <div className="space-y-6">
          {/* 操作按钮 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                操作
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {device.status === DeviceStatus.INACTIVE && (
                <Button className="w-full" variant="default">
                  激活设备
                </Button>
              )}
              
              {device.status === DeviceStatus.ACTIVE && (
                <Button className="w-full" variant="outline">
                  暂停设备
                </Button>
              )}
              
              {device.status === DeviceStatus.SUSPENDED && (
                <Button className="w-full" variant="default">
                  恢复设备
                </Button>
              )}
              
              {device.recoveryStatus !== DeviceRecoveryStatus.BLOCKED && (
                <Button className="w-full" variant="outline">
                  权益回收
                </Button>
              )}
              
              <Button className="w-full" variant="outline">
                查看回收历史
              </Button>
              
              {hasPermission('devices:delete') && (
                <Button className="w-full" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除设备
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 状态信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                时间信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                <p>{new Date(device.createdAt).toLocaleString('zh-CN')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">更新时间</label>
                <p>{new Date(device.updatedAt).toLocaleString('zh-CN')}</p>
              </div>
              {device.lastRecoveryDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">最后回收时间</label>
                  <p>{new Date(device.lastRecoveryDate).toLocaleString('zh-CN')}</p>
                </div>
              )}
              
              {/* 绑定历史记录 */}
              <div className="col-span-full">
                <label className="text-sm font-medium text-muted-foreground">绑定历史</label>
                <div className="mt-2 space-y-2">
                  {device.bindingHistory?.length ? (
                    device.bindingHistory.map((record, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">卡号: {record.cardNumber}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.boundAt).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        {record.unboundAt && (
                          <div className="mt-1 text-sm text-muted-foreground">
                            解绑时间: {new Date(record.unboundAt).toLocaleString('zh-CN')}
                          </div>
                        )}
                        {record.recoveryReason && (
                          <div className="mt-1 text-sm text-muted-foreground">
                            回收原因: {record.recoveryReason}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无绑定历史</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;