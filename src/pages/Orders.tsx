import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { useOrderExport } from '../hooks/useOrderExport';
import { useAuthStore } from '../store/authStore';
import { OrderList } from '../components/orders/OrderList';
import { OrderFilters } from '../components/orders/OrderFilters';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { OrderExportDialog } from '../components/orders/OrderExportDialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Download, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { OrderQueryParams, OrderExportRequest, OrderFilters as OrderFiltersType } from '../types/order';
import { formatCurrency } from '../lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useOrderDetail } from '../hooks/useOrders';

export const Orders: React.FC = () => {
  const { user, isAdmin } = useAuthStore();
  const [selectedOrderIds, setSelectedOrderIds] = React.useState<string[]>([]);
  const [detailOrderId, setDetailOrderId] = React.useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<Partial<OrderFiltersType>>({
    orderType: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    dateField: 'createdAt',
    minAmount: undefined,
    maxAmount: undefined,
    cardNumber: undefined,
    phone: undefined,
    orderNumber: undefined
  });

  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 20
  });

  // 确定要查询的合作伙伴ID
  // 管理员可以查看所有订单，合作伙伴只能查看自己的订单
  const targetPartnerId = isAdmin ? 'all' : (user?.partnerId || '');

  // 构建完整的查询参数
  const queryParams = {
    ...filters,
    page: pagination.page,
    limit: pagination.limit
  };

  // 获取订单数据
  const {
    orders,
    pagination: orderPagination,
    summary,
    isLoading,
    error,
    refetch
  } = useOrders(targetPartnerId, queryParams);

  // 获取订单详情
  const {
    data: detailOrder,
    isLoading: detailLoading,
    error: detailError
  } = useOrderDetail(detailOrderId);

  // 导出功能
  const {
    startExport,
    isExporting,
    exportError,
    resetExport
  } = useOrderExport(targetPartnerId);

  // 选中的订单
  const selectedOrders = orders.filter(order => 
    selectedOrderIds.includes(order.id)
  );

  // 处理筛选条件变化
  const handleFiltersChange = (newFilters: Partial<OrderFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // 重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 重置筛选条件
  const handleResetFilters = () => {
    setFilters({
      orderType: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      dateField: 'createdAt',
      minAmount: undefined,
      maxAmount: undefined,
      cardNumber: undefined,
      phone: undefined,
      orderNumber: undefined
    });
    setPagination({ page: 1, limit: 20 });
  };

  // 处理订单选择
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // 全选/取消全选
  const handleSelectAll = (orderIds: string[]) => {
    setSelectedOrderIds(orderIds);
  };

  // 查看订单详情
  const handleViewDetail = async (orderId: string) => {
    setDetailOrderId(orderId);
  };

  // 导出订单
  const handleExport = async (request: OrderExportRequest) => {
    try {
      startExport(request.filters);
      setShowExportDialog(false);
    } catch (err) {
      console.error('导出失败:', err);
    }
  };

  // 重试处理失败的订单
  const handleRetryOrder = (orderId: string) => {
    // 实现重试逻辑
    console.log('重试订单:', orderId);
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // 处理每页数量变化
  const handleLimitChange = (limit: number) => {
    setPagination({ page: 1, limit });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">订单管理</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button
            onClick={() => setShowExportDialog(true)}
            disabled={orders.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>
            {error.message || '加载订单数据时发生错误'}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总订单数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalOrders?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">订单总金额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.totalAmount || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">分成总金额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary?.totalCommission || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">实际到账</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(summary?.totalActualAmount || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选器 */}
      <OrderFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        loading={isLoading}
      />

      {/* 订单列表 */}
      <OrderList
        orders={orders}
        loading={isLoading}
        selectedOrderIds={selectedOrderIds}
        onOrderSelect={handleOrderSelect}
        onSelectAll={handleSelectAll}
        onOrderDetail={handleViewDetail}
        onOrderExport={() => setShowExportDialog(true)}
      />

      {/* 分页 */}
      {orderPagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            显示第 {(orderPagination.page - 1) * orderPagination.limit + 1} 到{' '}
            {Math.min(orderPagination.page * orderPagination.limit, orderPagination.total)} 条，
            共 {orderPagination.total} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(orderPagination.page - 1)}
              disabled={orderPagination.page <= 1 || isLoading}
            >
              上一页
            </Button>
            <span className="text-sm">
              第 {orderPagination.page} 页，共 {orderPagination.totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(orderPagination.page + 1)}
              disabled={orderPagination.page >= orderPagination.totalPages || isLoading}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 订单详情模态框 */}
      <OrderDetailModal
        open={!!detailOrderId}
        onOpenChange={(open) => !open && setDetailOrderId(null)}
        orderId={detailOrderId || undefined}
        loading={detailLoading}
        order={detailOrder || undefined}
        error={detailError?.message}
        onExport={() => setShowExportDialog(true)}
        onRetry={handleRetryOrder}
      />

      {/* 导出对话框 */}
      <OrderExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
        loading={isExporting}
        selectedOrders={selectedOrders}
        totalOrders={orderPagination?.total || 0}
      />
    </div>
  );
};