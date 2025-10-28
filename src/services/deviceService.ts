import axios from 'axios';
import { PermissionService } from './permissionService';
import { Device, DeviceStatus, DeviceRecoveryStatus } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

class DeviceServiceClass {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/devices`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 设置认证token
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 获取设备列表
  async getDevices(): Promise<Device[]> {
    if (USE_MOCK_DATA) {
      // 模拟设备数据
      const mockDevices: Device[] = [
        {
          id: 'device-1',
          macAddress: '00:1B:44:11:3A:B7',
          deviceName: '会议室设备',
          deviceModel: 'TP-Link Router',
          systemVersion: 'v1.0.0',
          status: DeviceStatus.ACTIVE,
          cardNumber: 'CARD001234',
          boundAt: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          recoveryCount: 1,
          recoveryStatus: DeviceRecoveryStatus.LIMITED,
          lastRecoveryDate: '2024-01-20T14:30:00Z'
        },
        {
          id: 'device-2',
          macAddress: '08:00:27:3A:5B:9C',
          deviceName: '前台设备',
          deviceModel: 'Huawei Switch',
          systemVersion: 'v1.2.0',
          status: DeviceStatus.INACTIVE,
          cardNumber: undefined,
          boundAt: undefined,
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-12T09:00:00Z',
          recoveryCount: 0,
          recoveryStatus: DeviceRecoveryStatus.AVAILABLE,
          lastRecoveryDate: undefined
        },
        {
          id: 'device-3',
          macAddress: 'A0:1B:2C:3D:4E:5F',
          deviceName: '办公室设备',
          deviceModel: 'Cisco Router',
          systemVersion: 'v2.0.1',
          status: DeviceStatus.SUSPENDED,
          cardNumber: 'CARD005678',
          boundAt: '2024-01-08T14:30:00Z',
          createdAt: '2024-01-05T11:00:00Z',
          updatedAt: '2024-01-18T16:00:00Z',
          recoveryCount: 3,
          recoveryStatus: DeviceRecoveryStatus.BLOCKED,
          lastRecoveryDate: '2024-01-25T09:15:00Z'
        }
      ];
      
      return new Promise(resolve => setTimeout(() => resolve(mockDevices), 500));
    }
    
    try {
      const response = await this.api.get('/');
      return response.data;
    } catch (error) {
      console.error('获取设备列表失败:', error);
      throw error;
    }
  }

  // 获取单个设备详情
  async getDeviceById(deviceId: string): Promise<Device> {
    if (USE_MOCK_DATA) {
      // 模拟设备数据（绑定过2次会员卡，回收过两次，当前是第三次绑定且激活中）
      const mockDevices: Device[] = [
        {
          id: 'device-1',
          macAddress: '00:1B:44:11:3A:B7',
          deviceName: '会议室设备',
          deviceModel: 'TP-Link Router',
          systemVersion: 'v1.0.0',
          status: DeviceStatus.ACTIVE,
          cardNumber: 'CARD003456',  // 当前绑定的第三次会员卡
          boundAt: '2024-03-01T09:00:00Z',  // 当前绑定时间
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-03-01T09:00:00Z',
          recoveryCount: 2,  // 已回收两次
          recoveryStatus: DeviceRecoveryStatus.LIMITED,  // 回收受限状态
          lastRecoveryDate: '2024-02-25T16:45:00Z',  // 最后一次回收时间
          bindingHistory: [
            // 第一次绑定（已回收）
            {
              cardNumber: 'CARD001234',
              boundAt: '2024-01-15T10:00:00Z',
              unboundAt: '2024-01-20T14:30:00Z',
              recoveryReason: '用户主动解绑'
            },
            // 第二次绑定（已回收）
            {
              cardNumber: 'CARD002345',
              boundAt: '2024-02-01T11:30:00Z',
              unboundAt: '2024-02-25T16:45:00Z',
              recoveryReason: '设备故障回收'
            },
            // 当前绑定（激活中）
            {
              cardNumber: 'CARD003456',
              boundAt: '2024-03-01T09:00:00Z',
              unboundAt: undefined,
              recoveryReason: undefined
            }
          ]
        },
        {
          id: 'device-2',
          macAddress: '08:00:27:3A:5B:9C',
          deviceName: '前台设备',
          deviceModel: 'Huawei Switch',
          systemVersion: 'v1.2.0',
          status: DeviceStatus.INACTIVE,
          cardNumber: undefined,
          boundAt: undefined,
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-12T09:00:00Z',
          recoveryCount: 0,
          recoveryStatus: DeviceRecoveryStatus.AVAILABLE,
          lastRecoveryDate: undefined
        },
        {
          id: 'device-3',
          macAddress: 'A0:1B:2C:3D:4E:5F',
          deviceName: '办公室设备',
          deviceModel: 'Cisco Router',
          systemVersion: 'v2.0.1',
          status: DeviceStatus.SUSPENDED,
          cardNumber: 'CARD005678',
          boundAt: '2024-01-08T14:30:00Z',
          createdAt: '2024-01-05T11:00:00Z',
          updatedAt: '2024-01-18T16:00:00Z',
          recoveryCount: 3,
          recoveryStatus: DeviceRecoveryStatus.BLOCKED,
          lastRecoveryDate: '2024-01-25T09:15:00Z'
        }
      ];
      
      const device = mockDevices.find(d => d.id === deviceId);
      if (!device) {
        throw new Error('设备不存在');
      }
      
      return new Promise(resolve => setTimeout(() => resolve(device), 300));
    }
    
    try {
      const response = await this.api.get(`/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('获取设备详情失败:', error);
      throw error;
    }
  }

  // 绑定设备到会员卡
  async bindDevice(deviceId: string, cardNumber: string): Promise<void> {
    // 检查权限
    PermissionService.enforcePermission('devices:manage');
    
    if (USE_MOCK_DATA) {
      // 模拟绑定过程，更新绑定历史
      const device = mockDevices.find(d => d.id === deviceId);
      if (device) {
        device.bindingHistory.push({
          cardNumber,
          boundAt: new Date().toISOString(),
          unboundAt: undefined,
          recoveryReason: undefined
        });
      }
      return new Promise(resolve => setTimeout(resolve, 800));
    }
    
    try {
      await this.api.post(`/${deviceId}/bind`, { cardNumber });
    } catch (error) {
      console.error('绑定设备失败:', error);
      throw error;
    }
  }

  // 解绑设备
  async unbindDevice(deviceId: string): Promise<void> {
    // 检查权限
    PermissionService.enforcePermission('devices:manage');
    
    if (USE_MOCK_DATA) {
      // 模拟解绑过程
      return new Promise(resolve => setTimeout(resolve, 500));
    }
    
    try {
      await this.api.post(`/${deviceId}/unbind`);
    } catch (error) {
      console.error('解绑设备失败:', error);
      throw error;
    }
  }

  // 更新设备状态
  async updateDeviceStatus(deviceId: string, status: DeviceStatus): Promise<void> {
    // 检查权限
    PermissionService.enforcePermission('devices:manage');
    
    if (USE_MOCK_DATA) {
      // 模拟状态更新
      return new Promise(resolve => setTimeout(resolve, 400));
    }
    
    try {
      await this.api.put(`/${deviceId}/status`, { status });
    } catch (error) {
      console.error('更新设备状态失败:', error);
      throw error;
    }
  }

  // 批量导入设备绑定
  async batchBindDevices(file: File): Promise<{ successCount: number; failedCount: number; errors: string[] }> {
    // 检查权限
    PermissionService.enforcePermission('devices:manage');
    
    if (USE_MOCK_DATA) {
      // 模拟批量导入
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            successCount: 5,
            failedCount: 1,
            errors: ['第3行：MAC地址格式错误']
          });
        }, 1500);
      });
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.api.post('/batch-bind', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('批量绑定设备失败:', error);
      throw error;
    }
  }

  // 获取设备统计信息
  async getDeviceStats(): Promise<{
    totalDevices: number;
    activeDevices: number;
    inactiveDevices: number;
    suspendedDevices: number;
    boundDevices: number;
  }> {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            totalDevices: 3,
            activeDevices: 1,
            inactiveDevices: 1,
            suspendedDevices: 1,
            boundDevices: 2
          });
        }, 300);
      });
    }
    
    try {
      const response = await this.api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('获取设备统计失败:', error);
      throw error;
    }
  }
}

export const DeviceService = new DeviceServiceClass();