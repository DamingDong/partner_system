import React from 'react'
import { RecoveryPoolCard } from '../components/recovery/RecoveryPoolCard'
import { RecoveryForm } from '../components/recovery/RecoveryForm'
import { BatchRecoveryDialog } from '../components/recovery/BatchRecoveryDialog'
import { useRecoveryPool } from '../hooks/useRecoveryPool'
import { Button } from '../components/ui/button'
import { useToast } from '../hooks/useToast'

export const RecoveryPoolPage = () => {
  const partnerId = 'partner_123' // 实际应从store或路由获取
  const { pool, loading, refetch } = useRecoveryPool(partnerId)
  const { toast } = useToast()
  const [showRecoveryForm, setShowRecoveryForm] = React.useState(false)
  const [showBatchDialog, setShowBatchDialog] = React.useState(false)

  const handleRecover = async (values: any) => {
    try {
      // 实际应调用RecoveryPoolService.processRecovery
      toast({
        title: '成功',
        description: '权益回收处理成功'
      })
      refetch()
      setShowRecoveryForm(false)
    } catch (error) {
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '回收处理失败',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">权益回收池管理</h1>
        
        {loading && !pool ? (
          <div>加载中...</div>
        ) : pool ? (
          <>
            <RecoveryPoolCard 
              pool={pool}
              onRecover={() => setShowRecoveryForm(true)}
              onExchange={() => setShowBatchDialog(true)}
            />

            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={() => setShowBatchDialog(true)}
              >
                批量回收
              </Button>
            </div>

            {showRecoveryForm && (
              <div className="p-6 border rounded-lg">
                <RecoveryForm 
                  onSubmit={handleRecover}
                  onCancel={() => setShowRecoveryForm(false)}
                />
              </div>
            )}
          </>
        ) : (
          <div>无法加载回收池数据</div>
        )}
      </div>

      <BatchRecoveryDialog 
        open={showBatchDialog}
        onOpenChange={setShowBatchDialog}
        partnerId={partnerId}
      />
    </div>
  )
}