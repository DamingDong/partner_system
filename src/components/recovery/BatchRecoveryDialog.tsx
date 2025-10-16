import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { FileSpreadsheet, Loader2 } from 'lucide-react'
import { useRecoveryPool } from '../../hooks/useRecoveryPool'
import { RecoveryPoolService } from '../../services/recoveryPoolService'
import { useToast } from '../../hooks/useToast'

interface BatchRecoveryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  partnerId: string
}

export const BatchRecoveryDialog: React.FC<BatchRecoveryDialogProps> = ({
  open,
  onOpenChange,
  partnerId
}) => {
  const { toast } = useToast()
  const { refetch } = useRecoveryPool(partnerId)
  const [file, setFile] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: '错误',
        description: '请先选择文件',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      
      // 模拟处理 - 实际应解析文件并调用批量接口
      const formData = new FormData()
      formData.append('file', file)
      formData.append('partnerId', partnerId)

      await RecoveryPoolService.batchRecovery({
        partnerId,
        requests: [
          // 示例数据 - 实际应从文件解析
          { redemptionRequestId: 'req1', days: 30, description: '批量导入1' },
          { redemptionRequestId: 'req2', days: 15, description: '批量导入2' }
        ]
      })

      toast({
        title: '成功',
        description: '批量回收处理成功'
      })
      refetch()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '批量回收失败',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            批量权益回收
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              请上传包含回收请求的Excel文件
            </p>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
              disabled={loading}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            提交处理
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}