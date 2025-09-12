import React, { useState } from 'react';
import { MembershipCard, CardType, BindingType } from '@/types';
import { CardService } from '@/services/cardService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Smartphone, Wifi, Package } from 'lucide-react';

interface CardActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: MembershipCard | null;
  onActivationSuccess: () => void;
}

export const CardActivationModal: React.FC<CardActivationModalProps> = ({
  isOpen,
  onClose,
  card,
  onActivationSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    macAddress: '',
    channelPackage: '',
    bindingType: BindingType.MAC_ADDRESS,
    deviceInfo: {
      deviceName: '',
      deviceModel: '',
      osVersion: '',
      appVersion: ''
    }
  });

  const handleActivation = async () => {
    if (!card) return;

    // 验证必填字段
    if (!formData.phoneNumber) {
      toast.error('请输入手机号');
      return;
    }

    if (card.cardType === CardType.BOUND) {
      if (!formData.macAddress || !formData.channelPackage) {
        toast.error('绑定卡需要填写MAC地址和渠道包');
        return;
      }
    }

    try {
      setLoading(true);
      
      // 调用激活接口
      await CardService.activateCard(card.id, {
        phoneNumber: formData.phoneNumber,
        macAddress: formData.macAddress,
        channelPackage: formData.channelPackage,
        bindingType: formData.bindingType,
        deviceInfo: formData.deviceInfo
      });

      toast.success('会员卡激活成功！');
      onActivationSuccess();
      onClose();
    } catch (error) {
      console.error('激活失败:', error);
      toast.error('激活失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      phoneNumber: '',
      macAddress: '',
      channelPackage: '',
      bindingType: BindingType.MAC_ADDRESS,
      deviceInfo: {
        deviceName: '',
        deviceModel: '',
        osVersion: '',
        appVersion: ''
      }
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            激活会员卡
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 卡片信息 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">卡号</span>
              <span className="font-mono font-medium">{card?.cardNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">类型</span>
              <span className={`px-2 py-1 rounded text-xs ${
                card?.cardType === CardType.REGULAR 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {card?.cardType === CardType.REGULAR ? '普通卡' : '绑定卡'}
              </span>
            </div>
          </div>

          {/* 激活表单 */}
          <div className="space-y-3">
            {/* 手机号（必填） */}
            <div>
              <Label htmlFor="phoneNumber">手机号 *</Label>
              <Input
                id="phoneNumber"
                placeholder="请输入手机号"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))}
              />
            </div>

            {/* 绑定卡额外字段 */}
            {card?.cardType === CardType.BOUND && (
              <>
                <div>
                  <Label htmlFor="macAddress" className="flex items-center">
                    <Wifi className="h-4 w-4 mr-1" />
                    MAC地址 *
                  </Label>
                  <Input
                    id="macAddress"
                    placeholder="请输入MAC地址"
                    value={formData.macAddress}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      macAddress: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="channelPackage" className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    渠道包 *
                  </Label>
                  <Input
                    id="channelPackage"
                    placeholder="请输入渠道包名称"
                    value={formData.channelPackage}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      channelPackage: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bindingType">绑定类型</Label>
                  <Select
                    value={formData.bindingType}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      bindingType: value as BindingType
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BindingType.MAC_ADDRESS}>MAC地址绑定</SelectItem>
                      <SelectItem value={BindingType.CHANNEL_PACKAGE}>渠道包绑定</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleActivation} disabled={loading}>
              {loading ? '激活中...' : '确认激活'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};