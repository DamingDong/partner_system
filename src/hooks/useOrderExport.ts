import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  OrderExportRequest, 
  ExportTask, 
  ExportTaskStatus, 
  ExportColumn,
  OrderFilters 
} from '../types/order';
import { OrderService } from '../services/orderService';
import { useToast } from './use-toast';

// 导出状态类型
export type ExportStep = 'config' | 'processing' | 'completed' | 'error';

// 默认导出列配置
const DEFAULT_EXPORT_COLUMNS: ExportColumn[] = [
  { field: 'orderNumber', title: '订单号', required: true, width: 160 },
  { field: 'orderType', title: '订单类型', required: true, width: 100 },
  { field: 'partnerName', title: '合作伙伴', required: false, width: 120 },
  { field: 'cardNumber', title: '会员卡号', required: false, width: 140 },
  { field: 'phone', title: '手机号', required: false, width: 120 },
  { field: 'orderAmount', title: '订单金额', required: true, width: 120, format: 'currency' },
  { field: 'commissionRate', title: '分成比例', required: false, width: 100, format: 'percent' },
  { field: 'commissionAmount', title: '分成金额', required: true, width: 120, format: 'currency' },
  { field: 'actualAmount', title: '实际到账', required: true, width: 120, format: 'currency' },
  { field: 'status', title: '订单状态', required: true, width: 100 },
  { field: 'createdAt', title: '创建时间', required: true, width: 160, format: 'date' },
  { field: 'completedAt', title: '完成时间', required: false, width: 160, format: 'date' }
];

// 订单导出Hook
export const useOrderExport = (partnerId: string) => {
  const { toast } = useToast();
  
  // 导出状态
  const [exportStep, setExportStep] = useState<ExportStep>('config');
  const [currentExportId, setCurrentExportId] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<ExportColumn[]>(
    DEFAULT_EXPORT_COLUMNS.filter(col => col.required)
  );
  
  // 导出配置
  const [exportConfig, setExportConfig] = useState({
    format: 'excel' as 'excel' | 'csv',
    includeHeader: true,
    includeStats: true,
    sheetName: '订单数据'
  });

  // 启动导出任务
  const exportMutation = useMutation({
    mutationFn: async (exportRequest: OrderExportRequest) => {
      // 使用Mock数据
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.exportOrders(partnerId, exportRequest);
      }
      return OrderService.exportOrders(partnerId, exportRequest);
    },
    onSuccess: (data: ExportTask) => {
      setCurrentExportId(data.exportId);
      setExportStep('processing');
      toast({
        title: '导出任务已启动',
        description: `预计需要 ${data.estimatedTime} 秒完成`,
      });
    },
    onError: (error) => {
      setExportStep('error');
      toast({
        title: '导出失败',
        description: error.message || '启动导出任务时发生错误',
        variant: 'destructive',
      });
    }
  });

  // 查询导出状态
  const { data: exportStatus, refetch: refetchStatus } = useQuery<ExportTaskStatus>({
    queryKey: ['exportStatus', currentExportId],
    queryFn: async () => {
      if (!currentExportId) throw new Error('导出ID不存在');
      
      // 使用Mock数据
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MockOrderService } = await import('../lib/mock-order-service');
        return MockOrderService.getExportStatus(currentExportId);
      }
      return OrderService.getExportStatus(currentExportId);
    },
    enabled: !!currentExportId && exportStep === 'processing',
    refetchInterval: (data) => {
      // 如果任务完成或失败，停止轮询
      const queryData = data?.state?.data as ExportTaskStatus | undefined;
      if (queryData?.status === 'COMPLETED' || queryData?.status === 'FAILED') {
        return false;
      }
      return 2000; // 每2秒轮询一次
    },
    refetchOnWindowFocus: false
  });

  // 监听导出状态变化
  useEffect(() => {
    if (exportStatus) {
      if (exportStatus.status === 'COMPLETED') {
        setExportStep('completed');
        toast({
          title: '导出完成',
          description: '文件已准备就绪，请点击下载',
        });
      } else if (exportStatus.status === 'FAILED') {
        setExportStep('error');
        toast({
          title: '导出失败',
          description: exportStatus.error || '导出过程中发生错误',
          variant: 'destructive',
        });
      }
    }
  }, [exportStatus, toast]);

  // 开始导出
  const startExport = useCallback((filters: OrderFilters) => {
    const exportRequest: OrderExportRequest = {
      format: exportConfig.format,
      filters: {
        page: 1,
        limit: 50000, // 导出时设置较大的限制
        partnerId,
        ...filters
      },
      columns: selectedColumns,
      options: {
        includeHeader: exportConfig.includeHeader,
        includeStats: exportConfig.includeStats,
        sheetName: exportConfig.sheetName,
        maxRows: 50000
      }
    };

    exportMutation.mutate(exportRequest);
  }, [partnerId, selectedColumns, exportConfig, exportMutation]);

  // 下载文件
  const downloadFile = useCallback(() => {
    if (exportStatus?.downloadUrl) {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = exportStatus.downloadUrl;
      link.download = `orders_export_${new Date().toISOString().slice(0, 10)}.${exportConfig.format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: '开始下载',
        description: '文件下载已开始',
      });
    }
  }, [exportStatus, exportConfig.format, toast]);

  // 重置导出状态
  const resetExport = useCallback(() => {
    setExportStep('config');
    setCurrentExportId(null);
    setSelectedColumns(DEFAULT_EXPORT_COLUMNS.filter(col => col.required));
  }, []);

  // 更新列选择
  const updateSelectedColumns = useCallback((columns: ExportColumn[]) => {
    // 确保必选列始终被选中
    const requiredColumns = DEFAULT_EXPORT_COLUMNS.filter(col => col.required);
    const optionalColumns = columns.filter(col => !col.required);
    setSelectedColumns([...requiredColumns, ...optionalColumns]);
  }, []);

  // 更新导出配置
  const updateExportConfig = useCallback((config: Partial<typeof exportConfig>) => {
    setExportConfig(prev => ({ ...prev, ...config }));
  }, []);

  // 获取可选列（排除已选中的必选列）
  const availableColumns = DEFAULT_EXPORT_COLUMNS.filter(
    col => !col.required || !selectedColumns.some(selected => selected.field === col.field)
  );

  return {
    // 状态
    exportStep,
    isExporting: exportMutation.isPending,
    exportProgress: exportStatus?.progress || 0,
    exportError: exportMutation.error?.message,
    
    // 数据
    exportStatus,
    selectedColumns,
    availableColumns,
    exportConfig,
    
    // 操作
    startExport,
    downloadFile,
    resetExport,
    updateSelectedColumns,
    updateExportConfig,
    
    // 工具方法
    canDownload: exportStep === 'completed' && !!exportStatus?.downloadUrl,
    isProcessing: exportStep === 'processing',
    hasError: exportStep === 'error'
  };
};

// 批量操作Hook
export const useBatchOrderActions = (partnerId: string) => {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const { toast } = useToast();

  // 选择/取消选择订单
  const toggleOrderSelection = useCallback((orderId: string) => {
    setSelectedOrderIds(prev => {
      const isSelected = prev.includes(orderId);
      if (isSelected) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback((orderIds: string[]) => {
    if (isAllSelected) {
      setSelectedOrderIds([]);
      setIsAllSelected(false);
    } else {
      setSelectedOrderIds(orderIds);
      setIsAllSelected(true);
    }
  }, [isAllSelected]);

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelectedOrderIds([]);
    setIsAllSelected(false);
  }, []);

  // 批量导出选中的订单
  const exportSelectedOrders = useCallback((filters: OrderFilters) => {
    if (selectedOrderIds.length === 0) {
      toast({
        title: '请选择订单',
        description: '请先选择要导出的订单',
        variant: 'destructive',
      });
      return;
    }

    // 这里可以实现批量导出逻辑
    // 例如：将选中的订单ID添加到筛选条件中
    const exportFilters = {
      ...filters,
      orderIds: selectedOrderIds // 假设API支持按订单ID筛选
    };

    toast({
      title: '开始导出',
      description: `正在导出 ${selectedOrderIds.length} 个订单`,
    });

    // 实际的导出逻辑需要配合 useOrderExport Hook
  }, [selectedOrderIds, toast]);

  return {
    selectedOrderIds,
    selectedCount: selectedOrderIds.length,
    isAllSelected,
    toggleOrderSelection,
    toggleSelectAll,
    clearSelection,
    exportSelectedOrders,
    hasSelection: selectedOrderIds.length > 0
  };
};