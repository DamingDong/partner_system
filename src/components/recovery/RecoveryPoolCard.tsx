import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { RecoveryPool } from '../../types/recoveryPool'
import { formatNumber } from '../../lib/utils'

interface RecoveryPoolCardProps {
  pool: RecoveryPool
  onRecover?: () => void
  onExchange?: () => void
}

export const RecoveryPoolCard: React.FC<RecoveryPoolCardProps> = ({
  pool,
  onRecover,
  onExchange
}) => {
  const utilizationRate = (pool.usedDays / pool.totalDays) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>权益回收池</span>
          <span className="text-sm font-normal text-muted-foreground">
            {pool.status === 'ACTIVE' ? '活跃' : '已暂停'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>总天数</span>
            <span className="font-medium">
              {formatNumber(pool.totalDays)} 天
            </span>
          </div>
          <Progress value={utilizationRate} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>已使用</span>
            <span className="font-medium">
              {formatNumber(pool.usedDays)} 天 ({utilizationRate.toFixed(1)}%)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>可用天数</span>
            <span className="font-medium text-green-600">
              {formatNumber(pool.availableDays)} 天
            </span>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onRecover}
            disabled={pool.status !== 'ACTIVE'}
          >
            权益回收
          </Button>
          <Button 
            onClick={onExchange}
            disabled={pool.status !== 'ACTIVE' || pool.availableDays <= 0}
          >
            批量兑换
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}