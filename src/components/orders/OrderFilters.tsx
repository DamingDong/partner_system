import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,  
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { DatePickerWithRange } from '../ui';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  Filter, 
  RefreshCw, 
  Search,
  X 
} from 'lucide-react';
import { OrderType, OrderStatus } from '../../types';
import { OrderQueryParams } from '../../types/order';
import { Badge } from '../ui/badge';

interface OrderFiltersProps {
  filters: Partial<OrderQueryParams>;
  onFiltersChange: (filters: Partial<OrderQueryParams>) => void;
  onReset: () => void;
  loading?: boolean;
  className?: string;
}

// 订单状态选项
const ORDER_STATUS_OPTIONS = [
  { value: OrderStatus.PENDING, label: '待处理' },
  { value: OrderStatus.PROCESSING, label: '处理中' },
  { value: OrderStatus.COMPLETED, label: '已完成' },
  { value: OrderStatus.FAILED, label: '失败' },
  { value: OrderStatus.CANCELLED, label: '已取消' },
  { value: OrderStatus.REFUNDED, label: '已退款' }
];

// 订单类型选项
const ORDER_TYPE_OPTIONS = [
  { value: OrderType.ACTIVATION, label: '激活订单' },
  { value: OrderType.SUBSCRIPTION, label: '订阅订单' }
];

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
  className
}) => {
  const [expanded, setExpanded] = React.useState(false);

  // 更新单个筛选条件
  const updateFilter = (key: keyof OrderQueryParams, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  // 获取活跃筛选条件数量
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.orderNumber || filters.cardNumber || filters.phone) count++;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.orderType) count++;
    if (filters.startDate || filters.endDate) count++;
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            筛选条件
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '收起' : '展开'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-1" />
                清空
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 基础筛选 - 始终显示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索框 */}
          <div className="space-y-2">
            <Label htmlFor="orderNumber">搜索</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="orderNumber"
                placeholder="订单号、会员卡号、手机号"
                value={filters.orderNumber || filters.cardNumber || filters.phone || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // 简单的判断逻辑，实际可以更复杂
                  if (value.startsWith('ORD')) {
                    updateFilter('orderNumber', value);
                    updateFilter('cardNumber', undefined);
                    updateFilter('phone', undefined);
                  } else if (/^\d{11}$/.test(value)) {
                    updateFilter('phone', value);
                    updateFilter('orderNumber', undefined);
                    updateFilter('cardNumber', undefined);
                  } else {
                    updateFilter('cardNumber', value);
                    updateFilter('orderNumber', undefined);
                    updateFilter('phone', undefined);
                  }
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* 订单状态 */}
          <div className="space-y-2">
            <Label htmlFor="status">订单状态</Label>
            <Select
              value={filters.status && filters.status.length > 0 ? filters.status[0] : '__all__'}
              onValueChange={(value) => updateFilter('status', value && value !== '__all__' ? [value as OrderStatus] : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部状态</SelectItem>
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 订单类型 */}
          <div className="space-y-2">
            <Label htmlFor="orderType">订单类型</Label>
            <Select
              value={filters.orderType || '__all__'}
              onValueChange={(value) => updateFilter('orderType', value && value !== '__all__' ? value : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部类型</SelectItem>
                {ORDER_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 高级筛选 - 展开时显示 */}
        {expanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 日期范围 */}
              <div className="space-y-2">
                <Label>创建时间</Label>
                <DatePickerWithRange
                  from={filters.startDate ? new Date(filters.startDate) : undefined}
                  to={filters.endDate ? new Date(filters.endDate) : undefined}
                  onSelect={(range) => {
                    updateFilter('startDate', range?.from?.toISOString());
                    updateFilter('endDate', range?.to?.toISOString());
                  }}
                  placeholder="选择日期范围"
                />
              </div>

              {/* 金额范围 */}
              <div className="space-y-2">
                <Label>订单金额范围</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="最小金额"
                    value={filters.minAmount || ''}
                    onChange={(e) => updateFilter('minAmount', e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <span className="flex items-center px-2 text-muted-foreground">至</span>
                  <Input
                    type="number"
                    placeholder="最大金额"
                    value={filters.maxAmount || ''}
                    onChange={(e) => updateFilter('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>

            {/* 排序选项 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>排序方式</Label>
                <Select
                  value={filters.sortBy || 'createdAt'}
                  onValueChange={(value) => updateFilter('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">创建时间</SelectItem>
                    <SelectItem value="orderAmount">订单金额</SelectItem>
                    <SelectItem value="commissionAmount">分成金额</SelectItem>
                    <SelectItem value="actualAmount">实际到账</SelectItem>
                    <SelectItem value="orderNumber">订单号</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>排序顺序</Label>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">降序</SelectItem>
                    <SelectItem value="asc">升序</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={loading || activeFiltersCount === 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};