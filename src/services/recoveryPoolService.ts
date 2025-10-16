import { BaseService } from './BaseService'
import type { 
  RecoveryPool,
  RecoveryRequest,
  BatchRecoveryRequest,
  BatchExchangeRequest,
  RecoveryPoolStats
} from '../types/recoveryPool'

export class RecoveryPoolService extends BaseService {
  static async getPoolInfo(partnerId: string): Promise<RecoveryPool> {
    try {
      const response = await this.apiClient.get(`/recovery-pool/${partnerId}`)
      return this.transformResponse<RecoveryPool>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  static async processRecovery(data: RecoveryRequest): Promise<RecoveryPool> {
    try {
      const response = await this.apiClient.post('/recovery-pool/process-recovery', data)
      return this.transformResponse<RecoveryPool>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  static async batchRecovery(data: BatchRecoveryRequest): Promise<RecoveryPool> {
    try {
      const response = await this.apiClient.post('/recovery-pool/batch-recovery', data)
      return this.transformResponse<RecoveryPool>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  static async batchExchange(data: BatchExchangeRequest): Promise<{
    pool: RecoveryPool
    newCards: string[]
  }> {
    try {
      const response = await this.apiClient.post('/recovery-pool/batch-exchange', data)
      return this.transformResponse<{
        pool: RecoveryPool
        newCards: string[]
      }>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  static async getPoolStats(partnerId: string): Promise<RecoveryPoolStats> {
    try {
      const response = await this.apiClient.get(`/recovery-pool/${partnerId}/stats`)
      return this.transformResponse<RecoveryPoolStats>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}