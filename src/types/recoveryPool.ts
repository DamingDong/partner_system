export interface RecoveryPool {
  id: string
  partnerId: string
  totalDays: number
  usedDays: number
  availableDays: number
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'
  lastUpdatedAt: string
  createdAt: string
}

export interface RecoveryRequest {
  redemptionRequestId: string
  partnerId: string
  days: number
  description: string
  operatorId: string
}

export interface BatchRecoveryRequest {
  partnerId: string
  requests: Array<{
    redemptionRequestId: string
    days: number
    description: string
  }>
}

export interface BatchExchangeRequest {
  partnerId: string
  requestedCards: number
  daysPerCard: number
  description: string
}

export interface RecoveryPoolStats {
  totalRecoveries: number
  totalExchanges: number
  avgDaysPerRecovery: number
  utilizationRate: number
}