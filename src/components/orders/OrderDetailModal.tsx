import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  User, 
  CreditCard, 
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Building,
  Copy,
  Download,
  AlertCircle
} from 'lucide-react';
import { OrderDetail, OrderFee } from '../../types/order';
import { OrderStatus, OrderType } from '../../types';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { LoadingSkeleton } from '../ui/loading-skeleton';

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
  loading?: boolean;
  order?: OrderDetail;
  error?: string;
  onExport?: (orderId: string) => void;
  onRetry?: (orderId: string) => void;
}

// 获取订单状态样式
const getStatusVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return 'default';
    case OrderStatus.PROCESSING:
      return 'secondary';
    case OrderStatus.PENDING:
      return 'outline';
    case OrderStatus.FAILED:
    case OrderStatus.CANCELLED:
      return 'destructive';
    default:
      return 'outline';
  }
};

// 获取订单状态文本
const getStatusText = (status: OrderStatus): string => {
  const statusMap = {
    [OrderStatus.PENDING]: '待处理',
    [OrderStatus.PROCESSING]: '处理中',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.FAILED]: '失败',
    [OrderStatus.CANCELLED]: '已取消',
    [OrderStatus.REFUNDED]: '已退款'
  };
  return statusMap[status] || '未知';
};

// 获取订单类型文本
const getOrderTypeText = (type: OrderType): string => {
  switch (type) {
    case OrderType.ACTIVATION:
      return '激活订单';
    case OrderType.SUBSCRIPTION:
      return '订阅订单';
    default:
      return '未知类型';
  }
};

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('复制失败:', err);
  }
};

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  onOpenChange,
  orderId,
  loading = false,
  order,
  error,
  onExport,
  onRetry
}) => {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>订单详情</span>
            <div className="flex items-center space-x-2">
              {order && onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(order.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </Button>
              )}
              {order && order.status === OrderStatus.FAILED && onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRetry(order.id)}
                >
                  重试
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="space-y-4">
            <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-48 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-32 w-full bg-gray-200 animate-pulse rounded" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-lg font-medium mb-2">加载失败</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">订单号</label>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{order.orderNumber}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(order.orderNumber)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">订单类型</label>
                    <p>{getOrderTypeText(order.orderType)}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">订单状态</label>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                    <p>{formatDateTime(order.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 金额信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  金额信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">订单金额</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(order.orderAmount)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">分成金额</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(order.commissionAmount)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">分成比例</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {(order.commissionRate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">实际到账</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(order.actualAmount)}
                    </p>
                  </div>
                </div>

                {/* 费用明细 */}
                {order.fees && order.fees.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">费用明细</h4>
                    <div className="space-y-2">
                      {order.fees.map((fee, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                          <span className="text-sm">{fee.description || fee.type || '费用'}</span>
                          <span className="text-sm font-medium text-red-600">
                            -{formatCurrency(fee.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 合作伙伴信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  合作伙伴信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">合作伙伴</label>
                    <p>{order.partnerName}</p>
                  </div>
                  {order.partnerInfo && (
                    <>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">合作伙伴等级</label>
                        <p>L{order.partnerInfo.level}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">联系人</label>
                        <p>{order.partnerInfo.contactPerson}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">联系电话</label>
                        <p>{order.partnerInfo.contactPhone}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 用户信息 */}
            {order.userInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    用户信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">用户ID</label>
                      <p className="font-mono">{order.userInfo.userId}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">手机号</label>
                      <p>{order.userInfo.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">注册时间</label>
                      <p>{formatDateTime(order.userInfo.registeredAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 会员卡信息 */}
            {order.cardInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    会员卡信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">卡号</label>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{order.cardInfo.cardNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(order.cardInfo!.cardNumber)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">卡类型</label>
                      <p>{order.cardInfo.cardType}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">有效期</label>
                      <p>{order.cardInfo.validityPeriod}天</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">激活时间</label>
                      <p>{formatDateTime(order.cardInfo.activatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 状态历史 */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    状态历史
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant={getStatusVariant(history.status)}>
                              {getStatusText(history.status)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(history.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            操作人: {history.operator}
                          </p>
                          {history.remarks && (
                            <p className="text-sm mt-1">{history.remarks}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 备注信息 */}
            {order.remarks && (
              <Card>
                <CardHeader>
                  <CardTitle>备注信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.remarks}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};