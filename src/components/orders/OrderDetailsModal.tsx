import React from 'react';
import { Order, OrderType, OrderStatus } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  User, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Package 
} from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  if (!order) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'default';
      case OrderStatus.PENDING:
        return 'secondary';
      case OrderStatus.CANCELLED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return '已完成';
      case OrderStatus.PENDING:
        return '处理中';
      case OrderStatus.PAID:
        return '已支付';
      case OrderStatus.CANCELLED:
        return '已取消';
      case OrderStatus.REFUNDED:
        return '已退款';
      default:
        return status;
    }
  };

  const getOrderTypeText = (type: OrderType) => {
    switch (type) {
      case OrderType.ACTIVATION:
        return '会员卡激活';
      case OrderType.SUBSCRIPTION:
        return '用户订阅';
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            订单详情 - {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 订单基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">订单号:</span>
                  <span className="font-mono">{order.orderNumber}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">类型:</span>
                  <Badge variant="outline">
                    {getOrderTypeText(order.type)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">金额:</span>
                  <span className="font-semibold text-green-600">
                    ¥{order.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">状态:</span>
                  <Badge variant={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">用户ID:</span>
                  <span className="font-mono text-sm">{order.userId}</span>
                </div>
                
                {order.cardId && (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">关联卡片:</span>
                    <span className="font-mono text-sm">{order.cardId}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">创建时间:</span>
                  <span className="text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                
                {order.paymentTime && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">支付时间:</span>
                    <span className="text-sm">
                      {new Date(order.paymentTime).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 分账记录 */}
          {order.sharingRecords && order.sharingRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  分账记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.sharingRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {record.fromPartnerId} → {record.toPartnerId}
                        </p>
                        <p className="text-sm text-gray-600">
                          分账比例: {(record.rate * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ¥{record.amount.toLocaleString()}
                        </p>
                        <Badge 
                          variant={record.status === 'COMPLETED' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {record.status === 'COMPLETED' ? '已完成' : '处理中'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end">
            <Button onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};