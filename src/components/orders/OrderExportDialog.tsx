import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Download, FileSpreadsheet, FileText, Info } from 'lucide-react';
import { OrderExportRequest, ExportColumn } from '../../types/order';
import { Order } from '../../types/order';

interface OrderExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (request: OrderExportRequest) => void;
  loading?: boolean;
  selectedOrders?: Order[];
  totalOrders?: number;
}

// 可导出的列配置
const EXPORTABLE_COLUMNS: ExportColumn[] = [
  { field: 'orderNumber', title: '订单号', required: true },
  { field: 'orderType', title: '订单类型', required: true },
  { field: 'partnerName', title: '合作伙伴', required: true },
  { field: 'cardNumber', title: '会员卡号', required: false },
  { field: 'phone', title: '手机号', required: false },
  { field: 'orderAmount', title: '订单金额', required: true },
  { field: 'commissionRate', title: '分成比例', required: true },
  { field: 'commissionAmount', title: '分成金额', required: true },
  { field: 'actualAmount', title: '实际到账', required: true },
  { field: 'status', title: '状态', required: true },
  { field: 'createdAt', title: '创建时间', required: true },
  { field: 'completedAt', title: '完成时间', required: false },
  { field: 'settlementAt', title: '结算时间', required: false },
];

export const OrderExportDialog: React.FC<OrderExportDialogProps> = ({
  open,
  onOpenChange,
  onExport,
  loading = false,
  selectedOrders,
  totalOrders = 0
}) => {
  const [format, setFormat] = React.useState<'excel' | 'csv'>('excel');
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(
    EXPORTABLE_COLUMNS.filter(col => col.required).map(col => col.field)
  );
  const [includeHeader, setIncludeHeader] = React.useState(true);
  const [includeStats, setIncludeStats] = React.useState(false);
  const [sheetName, setSheetName] = React.useState('订单数据');

  // 重置表单
  const resetForm = React.useCallback(() => {
    setFormat('excel');
    setSelectedColumns(
      EXPORTABLE_COLUMNS.filter(col => col.required).map(col => col.field)
    );
    setIncludeHeader(true);
    setIncludeStats(false);
    setSheetName('订单数据');
  }, []);

  // 关闭对话框时重置表单
  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  // 处理导出
  const handleExport = () => {
    const columns = EXPORTABLE_COLUMNS.filter(
      col => selectedColumns.includes(col.field)
    );
    
    const request: OrderExportRequest = {
      format,
      filters: {
        page: 1,
        limit: 10000, // 最大导出行数
        ...(selectedOrders && selectedOrders.length > 0
          ? { orderNumbers: selectedOrders.map(order => order.orderNumber) }
          : {})
      },
      columns,
      options: {
        includeHeader,
        includeStats,
        ...(format === 'excel' ? { sheetName } : {})
      }
    };
    
    onExport(request);
  };

  // 切换列选择
  const toggleColumn = (field: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, field]);
    } else {
      setSelectedColumns(prev => prev.filter(f => f !== field));
    }
  };

  // 全选/取消全选
  const toggleAllColumns = (checked: boolean) => {
    if (checked) {
      setSelectedColumns(EXPORTABLE_COLUMNS.map(col => col.field));
    } else {
      setSelectedColumns(
        EXPORTABLE_COLUMNS.filter(col => col.required).map(col => col.field)
      );
    }
  };

  // 检查是否所有可选列都被选中
  const allSelectableSelected = EXPORTABLE_COLUMNS.every(
    col => col.required || selectedColumns.includes(col.field)
  );

  // 检查是否有选中的可选列
  const hasSelectedOptional = selectedColumns.some(
    field => !EXPORTABLE_COLUMNS.find(col => col.field === field)?.required
  );

  const selectedCount = selectedOrders?.length || 0;
  const isExportAll = selectedCount === 0 || selectedCount === totalOrders;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            导出订单数据
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 导出范围 */}
          <div className="space-y-3">
            <h3 className="font-medium">导出范围</h3>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isExportAll ? (
                  <span>
                    将导出全部 <span className="font-medium">{totalOrders}</span> 条订单数据
                  </span>
                ) : (
                  <span>
                    将导出选中的 <span className="font-medium">{selectedCount}</span> 条订单数据
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </div>

          {/* 文件格式 */}
          <div className="space-y-3">
            <Label>文件格式</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={format === 'excel' ? 'default' : 'outline'}
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setFormat('excel')}
                disabled={loading}
              >
                <FileSpreadsheet className="h-8 w-8" />
                <span>Excel (.xlsx)</span>
              </Button>
              <Button
                variant={format === 'csv' ? 'default' : 'outline'}
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setFormat('csv')}
                disabled={loading}
              >
                <FileText className="h-8 w-8" />
                <span>CSV (.csv)</span>
              </Button>
            </div>
          </div>

          {/* Excel特定选项 */}
          {format === 'excel' && (
            <div className="space-y-3">
              <Label htmlFor="sheetName">工作表名称</Label>
              <input
                id="sheetName"
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="请输入工作表名称"
                disabled={loading}
              />
            </div>
          )}

          {/* 列选择 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>选择导出列</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={allSelectableSelected}
                  onCheckedChange={toggleAllColumns}
                  disabled={loading}
                />
                <Label htmlFor="selectAll" className="text-sm font-normal">
                  全选
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-md">
              {EXPORTABLE_COLUMNS.map((column) => (
                <div key={column.field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`column-${column.field}`}
                    checked={selectedColumns.includes(column.field)}
                    onCheckedChange={(checked) => toggleColumn(column.field, !!checked)}
                    disabled={column.required || loading}
                  />
                  <Label 
                    htmlFor={`column-${column.field}`} 
                    className={`text-sm ${column.required ? 'font-medium' : 'font-normal'}`}
                  >
                    {column.title}
                    {column.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 导出选项 */}
          <div className="space-y-3">
            <Label>导出选项</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeHeader"
                  checked={includeHeader}
                  onCheckedChange={(checked) => setIncludeHeader(!!checked)}
                  disabled={loading}
                />
                <Label htmlFor="includeHeader" className="text-sm font-normal">
                  包含表头
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeStats"
                  checked={includeStats}
                  onCheckedChange={(checked) => setIncludeStats(!!checked)}
                  disabled={loading}
                />
                <Label htmlFor="includeStats" className="text-sm font-normal">
                  包含统计信息
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:space-x-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            onClick={handleExport}
            disabled={loading || selectedColumns.length === 0}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                导出中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                开始导出
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};