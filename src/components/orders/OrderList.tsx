import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  Download,
  CreditCard,
  Repeat
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { Order } from '../../types/order';
import { OrderType, OrderStatus } from '../../types';
import { formatCurrency, formatDateTime, maskPhone } from '../../lib/utils';

interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  selectedOrderIds?: string[];
  onOrderSelect?: (orderId: string) => void;
  onSelectAll?: (orderIds: string[]) => void;
  onOrderDetail?: (orderId: string) => void;
  onOrderExport?: () => void;
  className?: string;
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

// 获取订单类型图标
const getOrderTypeIcon = (type: OrderType) => {
  switch (type) {
    case OrderType.ACTIVATION:
      return <CreditCard className="h-4 w-4" />;
    case OrderType.SUBSCRIPTION:
      return <Repeat className="h-4 w-4" />;
    default:
      return null;
  }
};

// 获取订单类型文本
const getOrderTypeText = (type: OrderType): string => {
  switch (type) {
    case OrderType.ACTIVATION:
      return '激活';
    case OrderType.SUBSCRIPTION:
      return '订阅';
    default:
      return '未知';
  }
};

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading = false,
  selectedOrderIds = [],
  onOrderSelect,
  onSelectAll,
  onOrderDetail,
  onOrderExport,
  className
}) => {
  const isAllSelected = orders.length > 0 && selectedOrderIds.length === orders.length;
  const isSomeSelected = selectedOrderIds.length > 0 && selectedOrderIds.length < orders.length;

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(isAllSelected ? [] : orders.map(order => order.id));
    }
  };

  const handleOrderSelect = (orderId: string) => {
    if (onOrderSelect) {
      onOrderSelect(orderId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="order-list-loading">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">加载中...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-muted-foreground mb-4">
          <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg font-medium">暂无订单数据</p>
          <p className="text-sm">请尝试调整筛选条件或创建新订单</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} data-testid="order-list">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {(onOrderSelect || onSelectAll) && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(ref) => {
                      if (ref && typeof ref !== 'function') {
                        // 类型断言为 HTMLInputElement 以访问 indeterminate 属性
                        (ref as HTMLInputElement).indeterminate = isSomeSelected;
                      }
                    }}
                    onCheckedChange={handleSelectAll}
                    aria-label="全选订单"
                  />
                </TableHead>
              )}
              <TableHead className="min-w-[160px]">订单号</TableHead>
              <TableHead className="w-[100px]">类型</TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">合作伙伴</TableHead>
              <TableHead className="min-w-[140px] hidden lg:table-cell">会员卡号</TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">手机号</TableHead>
              <TableHead className="min-w-[120px] text-right">订单金额</TableHead>
              <TableHead className="min-w-[100px] text-right hidden sm:table-cell">分成比例</TableHead>
              <TableHead className="min-w-[120px] text-right">分成金额</TableHead>
              <TableHead className="min-w-[120px] text-right">实际到账</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="min-w-[160px] hidden md:table-cell">创建时间</TableHead>
              <TableHead className="w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                {(onOrderSelect || onSelectAll) && (
                  <TableCell>
                    <Checkbox
                      checked={selectedOrderIds.includes(order.id)}
                      onCheckedChange={() => handleOrderSelect(order.id)}
                      aria-label={`选择订单 ${order.orderNumber}`}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => onOrderDetail?.(order.id)}
                  >
                    {order.orderNumber}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getOrderTypeIcon(order.orderType)}
                    <span className="text-sm">{getOrderTypeText(order.orderType)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm">{order.partnerName}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm font-mono">
                    {order.cardNumber || '-'}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm font-mono">
                    {order.phone ? maskPhone(order.phone) : '-'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">{formatCurrency(order.orderAmount)}</span>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  <span className="text-sm">{(order.commissionRate * 100).toFixed(1)}%</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium text-green-600">
                    {formatCurrency(order.commissionAmount)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">
                    {formatCurrency(order.actualAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">打开菜单</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onOrderDetail?.(order.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      {order.status === OrderStatus.FAILED && (
                        <DropdownMenuItem>
                          <Repeat className="mr-2 h-4 w-4" />
                          重试处理
                        </DropdownMenuItem>
                      )}
                      {onOrderExport && (
                        <DropdownMenuItem onClick={onOrderExport}>
                          <Download className="mr-2 h-4 w-4" />
                          导出此订单
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};