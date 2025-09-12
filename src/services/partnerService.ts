import { Partner, PartnerType, PartnerStatus } from '@/types';

export class PartnerService {
  static async getPartners(): Promise<Partner[]> {
    // 模拟API调用，实际项目中替换为真实API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: '北京科技有限公司',
            type: PartnerType.PRIMARY,
            status: PartnerStatus.ACTIVE,
            commissionRate: 0.15,
            level: 1,
            contactInfo: {
              email: 'contact@bjtech.com',
              phone: '010-12345678',
              address: '北京市朝阳区科技园A座',
              contactPerson: '张经理'
            },
            createdAt: '2024-01-15T08:00:00Z',
            updatedAt: '2024-01-15T08:00:00Z'
          },
          {
            id: '2',
            name: '上海贸易集团',
            type: PartnerType.SECONDARY,
            status: PartnerStatus.ACTIVE,
            commissionRate: 0.12,
            level: 2,
            contactInfo: {
              email: 'info@shtrade.com',
              phone: '021-87654321',
              address: '上海市浦东新区商务大厦',
              contactPerson: '李总监'
            },
            createdAt: '2024-02-20T10:30:00Z',
            updatedAt: '2024-02-20T10:30:00Z'
          },
          {
            id: '3',
            name: '深圳数字科技',
            type: PartnerType.TERTIARY,
            status: PartnerStatus.ACTIVE,
            commissionRate: 0.10,
            level: 3,
            contactInfo: {
              email: 'business@szdigital.com',
              phone: '0755-12345678',
              address: '深圳市南山区科技园',
              contactPerson: '王经理'
            },
            createdAt: '2024-01-28T14:15:00Z',
            updatedAt: '2024-01-28T14:15:00Z'
          },
          {
            id: '4',
            name: '广州网络科技',
            type: PartnerType.PRIMARY,
            status: PartnerStatus.INACTIVE,
            commissionRate: 0.18,
            level: 1,
            contactInfo: {
              email: 'partner@gznetwork.com',
              phone: '020-87654321',
              address: '广州市天河区科技园',
              contactPerson: '陈总'
            },
            createdAt: '2024-03-05T09:45:00Z',
            updatedAt: '2024-03-05T09:45:00Z'
          }
        ]);
      }, 1000);
    });
  }

  static async getPartnerById(id: string): Promise<Partner | null> {
    const partners = await this.getPartners();
    return partners.find(partner => partner.id === id) || null;
  }

  static async createPartner(partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Partner> {
    // 模拟创建合作伙伴
    const newPartner: Partner = {
      ...partner,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newPartner;
  }

  static async updatePartner(id: string, updates: Partial<Partner>): Promise<Partner> {
    // 模拟更新合作伙伴
    const partner = await this.getPartnerById(id);
    if (!partner) {
      throw new Error('合作伙伴不存在');
    }
    return {
      ...partner,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  static async deletePartner(id: string): Promise<void> {
    // 模拟删除合作伙伴
    console.log(`删除合作伙伴: ${id}`);
  }
}