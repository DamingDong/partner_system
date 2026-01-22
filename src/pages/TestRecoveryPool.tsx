import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RecoveryPoolService } from '@/services/recoveryPoolService'

export const TestRecoveryPool = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testGetPoolInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await RecoveryPoolService.getPoolInfo('partner_123')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  const testProcessRecovery = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await RecoveryPoolService.processRecovery({
        redemptionRequestId: 'req_123',
        partnerId: 'partner_123',
        days: 30,
        description: '测试回收',
        operatorId: 'user_123'
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">权益回收池服务测试</h1>
      
      <div className="space-y-4">
        <Button 
          onClick={testGetPoolInfo}
          disabled={loading}
        >
          测试获取回收池信息
        </Button>

        <Button 
          onClick={testProcessRecovery}
          disabled={loading}
          variant="outline"
        >
          测试处理回收
        </Button>

        {loading && <div>加载中...</div>}
        {error && <div className="text-red-500">错误: {error}</div>}
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}