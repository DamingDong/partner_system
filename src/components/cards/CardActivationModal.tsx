import React from 'react';
import { MembershipCard, CardStatus } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CardActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: MembershipCard | null;
  onActivationSuccess: () => void;
}

export const CardActivationModal: React.FC<CardActivationModalProps> = ({
  isOpen,
  onClose,
  card,
  onActivationSuccess
}) => {
  if (!card) return null;

  const handleActivation = () => {
    // 会员卡激活在前端APK中完成，这里只提供信息展示
    toast.info('会员卡激活在前端APK中完成，请使用APK进行激活操作');
    onClose();
  };

  const getStatusBadge = (status: CardStatus) => {
    const statusConfig = {
      [CardStatus.PENDING_BIND]: { label: '待绑定', variant: 'secondary' as const },
      [CardStatus.BOUND]: { label: '已绑定', variant: 'default' as const },
      [CardStatus.ACTIVE]: { label: '已激活', variant: 'default' as const },
      [CardStatus.EXPIRED]: { label: '已过期', variant: 'outline' as const },
      [CardStatus.CANCELLED]: { label: '已销卡', variant: 'destructive' as const },
    };

    const config = statusConfig[status] || { label: status, variant: 'default' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>会员卡激活信息</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 会员卡信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">会员卡信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">卡号:</span>
                <span className="font-mono text-sm">{card.cardNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">状态:</span>
                {getStatusBadge(card.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">剩余天数:</span>
                <span className="text-sm">{card.remainingDays || 0} 天</span>
              </div>
            </CardContent>
          </Card>

          {/* 激活说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">激活说明</h4>
            <p className="text-xs text-blue-600">
              会员卡激活操作在前端APK中完成。请使用APK应用扫描会员卡二维码或输入卡号进行激活。
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
            <Button onClick={handleActivation}>
              查看激活指引
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};