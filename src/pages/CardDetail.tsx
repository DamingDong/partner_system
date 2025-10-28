import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CardService } from '@/services/cardService';
import { useAuthStore } from '@/store/authStore';
import { MembershipCard, CardStatus, CardType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  User, 
  Monitor,
  Phone,
  MapPin,
  Activity,
  Settings,
  Trash2
} from 'lucide-react';

const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => CardService.getCardById(id!),
    enabled: !!id,
  });

  const getStatusBadgeVariant = (status: CardStatus) => {
    switch (status) {
      case CardStatus.ACTIVE:
        return 'default';
      case CardStatus.BOUND:
        return 'secondary';
      case CardStatus.PENDING_BIND:
        return 'outline';
      case CardStatus.EXPIRED:
        return 'destructive';
      case CardStatus.CANCELLED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: CardStatus) => {
    switch (status) {
      case CardStatus.ACTIVE:
        return '已激活';
      case CardStatus.BOUND:
        return '已绑定';
      case CardStatus.PENDING_BIND:
        return '待绑定';
      case CardStatus.EXPIRED:
        return '已过期';
      case CardStatus.CANCELLED:
        return '已销卡';
      default:
        return '未知';
    }
  };

  const getTypeLabel = (type: CardType) => {
    return type === CardType.REGULAR ? '普通卡' : '绑定卡';
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !card) {
    return (
      <EmptyState
        title="会员卡不存在"
        description="请检查会员卡ID是否正确"
        action={
          <Button onClick={() => navigate('/cards')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回会员卡列表
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
            onClick={() => navigate('/cards')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">会员卡详情</h1>
            <p className="text-muted-foreground">查看会员卡的详细信息和管理操作</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusBadgeVariant(card.status)}>
            {getStatusLabel(card.status)}
          </Badge>
          <Badge variant="outline">
            {getTypeLabel(card.cardType)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：基本信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 核心信息卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                核心信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">卡号</label>
                  <p className="text-lg font-mono">{card.cardNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">卡类型</label>
                  <p>{getTypeLabel(card.cardType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">状态</label>
                  <Badge variant={getStatusBadgeVariant(card.status)}>
                    {getStatusLabel(card.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                  <p>{new Date(card.createdAt).toLocaleString('zh-CN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 有效期信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                有效期信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">激活时间</label>
                  <p>{card.activationDate ? new Date(card.activationDate).toLocaleString('zh-CN') : '未激活'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">到期时间</label>
                  <p>{card.expiryDate ? new Date(card.expiryDate).toLocaleString('zh-CN') : '未设置'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">剩余天数</label>
                  <p className="text-lg font-semibold">{card.remainingDays || 0} 天</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 绑定信息 */}
          {card.bindingInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  绑定信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <Phone className="inline mr-1 h-4 w-4" />
                      手机号
                    </label>
                    <p>{card.bindingInfo.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <Monitor className="inline mr-1 h-4 w-4" />
                      MAC地址
                    </label>
                    <p className="font-mono">{card.bindingInfo.macAddress || '未绑定'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <MapPin className="inline mr-1 h-4 w-4" />
                      渠道包
                    </label>
                    <p>{card.bindingInfo.channelPackage || '未设置'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <Calendar className="inline mr-1 h-4 w-4" />
                      绑定时间
                    </label>
                    <p>{new Date(card.bindingInfo.bindingTime).toLocaleString('zh-CN')}</p>
                  </div>
                </div>
                
                {/* 设备信息 */}
                {card.bindingInfo.deviceInfo && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">设备信息</label>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">设备名称：</span>
                          <span>{card.bindingInfo.deviceInfo.deviceName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">设备型号：</span>
                          <span>{card.bindingInfo.deviceInfo.deviceModel}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">系统版本：</span>
                          <span>{card.bindingInfo.deviceInfo.osVersion}</span>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        size="sm"
                        className="mt-2 px-0"
                        onClick={() => {
                          // 根据设备ID跳转到设备详情页
                          navigate(`/devices/${card.bindingInfo.deviceInfo.deviceId}`);
                        }}
                      >
                        查看设备详情
                      </Button>
                    </div>
                  </>
                )}
                
                {/* 绑定历史记录 */}
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">绑定历史</label>
                  <div className="mt-2 space-y-2">
                    {card.bindingHistory?.length ? (
                      card.bindingHistory.map((record, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">设备ID: {record.deviceId}</span>
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
          )}
          
          {/* 状态变化历史 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                状态变化历史
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {card.statusHistory?.length ? (
                  card.statusHistory.map((record, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <Badge variant={getStatusBadgeVariant(record.status)}>
                          {getStatusLabel(record.status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.changedAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      {record.changedBy && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          操作人: {record.changedBy}
                        </div>
                      )}
                      {record.reason && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          原因: {record.reason}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">暂无状态变化历史</p>
                )}
              </div>
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
              {card.status === CardStatus.PENDING_BIND && (
                <Button className="w-full" variant="default">
                  激活会员卡
                </Button>
              )}
              
              {card.status === CardStatus.BOUND && (
                <Button className="w-full" variant="outline">
                  解绑设备
                </Button>
              )}
              
              {card.status === CardStatus.ACTIVE && (
                <Button className="w-full" variant="destructive">
                  销卡回收
                </Button>
              )}
              
              <Button className="w-full" variant="outline">
                查看分账记录
              </Button>
              
              <Button className="w-full" variant="outline">
                查看订单历史
              </Button>
              
              {hasPermission('cards:delete') && (
                <Button className="w-full" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除会员卡
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 关联信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                关联信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">合作伙伴</label>
                <p>{card.partnerId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">批次ID</label>
                <p>{card.batchId}</p>
              </div>
              {card.userId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">用户ID</label>
                  <p>{card.userId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;