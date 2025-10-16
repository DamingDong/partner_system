import { useState, useEffect } from 'react'
import { RecoveryPoolService } from '../services/recoveryPoolService'
import { RecoveryPool } from '../types/recoveryPool'
import { useToast } from '../hooks/useToast'

export function useRecoveryPool(partnerId: string) {
  const [pool, setPool] = useState<RecoveryPool | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPool = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await RecoveryPoolService.getPoolInfo(partnerId)
      setPool(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取回收池信息失败')
      toast({
        title: '错误',
        description: '获取回收池信息失败',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPool()
  }, [partnerId])

  const refetch = () => {
    fetchPool()
  }

  return {
    pool,
    loading,
    error,
    refetch
  }
}