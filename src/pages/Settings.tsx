import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Bell, User, Shield, Palette, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface SettingsData {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    security: boolean;
  };
  security: {
    twoFactor: boolean;
    passwordExpiry: number;
    sessionTimeout: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      name: user?.name || '管理员',
      email: user?.email || 'admin@example.com',
      phone: '+86 138 0000 0000',
      avatar: '',
    },
    notifications: {
      email: true,
      push: true,
      marketing: false,
      security: true,
    },
    security: {
      twoFactor: false,
      passwordExpiry: 90,
      sessionTimeout: 30,
    },
    appearance: {
      theme: 'system',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
    },
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = async (section: keyof SettingsData) => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      console.log(`Saved ${section} settings:`, settings[section]);
    }, 1000);
  };

  const handleProfileChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value },
    }));
  };

  const handleAppearanceChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-600">管理您的账户和系统偏好设置</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            个人资料
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            通知设置
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            安全设置
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            外观设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>个人资料</CardTitle>
              <CardDescription>管理您的个人信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.profile.avatar} />
                  <AvatarFallback>{settings.profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">更换头像</Button>
                  <p className="text-sm text-muted-foreground mt-1">支持 JPG, PNG, GIF 格式，最大 2MB</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">邮箱</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      已验证
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">手机号码</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSave('profile')}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? '保存中...' : '保存更改'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知偏好</CardTitle>
              <CardDescription>选择您希望接收的通知类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>邮件通知</Label>
                    <p className="text-sm text-muted-foreground">接收重要更新和提醒</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>推送通知</Label>
                    <p className="text-sm text-muted-foreground">在浏览器中接收实时通知</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>营销邮件</Label>
                    <p className="text-sm text-muted-foreground">接收产品更新和优惠信息</p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>安全提醒</Label>
                    <p className="text-sm text-muted-foreground">账户安全相关的重要通知</p>
                  </div>
                  <Switch
                    checked={settings.notifications.security}
                    onCheckedChange={(checked) => handleNotificationChange('security', checked)}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSave('notifications')}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? '保存中...' : '保存设置'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>管理您的账户安全选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>两步验证</Label>
                    <p className="text-sm text-muted-foreground">为您的账户添加额外的安全层</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactor', checked)}
                  />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="passwordExpiry">密码过期时间</Label>
                  <Select
                    value={settings.security.passwordExpiry.toString()}
                    onValueChange={(value) => handleSecurityChange('passwordExpiry', parseInt(value))}
                  >
                    <SelectTrigger id="passwordExpiry" className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30天</SelectItem>
                      <SelectItem value="60">60天</SelectItem>
                      <SelectItem value="90">90天</SelectItem>
                      <SelectItem value="180">180天</SelectItem>
                      <SelectItem value="365">365天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">会话超时时间</Label>
                  <Select
                    value={settings.security.sessionTimeout.toString()}
                    onValueChange={(value) => handleSecurityChange('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger id="sessionTimeout" className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15分钟</SelectItem>
                      <SelectItem value="30">30分钟</SelectItem>
                      <SelectItem value="60">1小时</SelectItem>
                      <SelectItem value="120">2小时</SelectItem>
                      <SelectItem value="240">4小时</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    修改密码
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    查看登录历史
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => handleSave('security')}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? '保存中...' : '保存设置'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>自定义系统的外观和语言</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="theme">主题</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => handleAppearanceChange('theme', value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">浅色</SelectItem>
                      <SelectItem value="dark">深色</SelectItem>
                      <SelectItem value="system">跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="language">语言</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => handleAppearanceChange('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="ja-JP">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">时区</Label>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) => handleAppearanceChange('timezone', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">(GMT+8) 上海</SelectItem>
                      <SelectItem value="Asia/Tokyo">(GMT+9) 东京</SelectItem>
                      <SelectItem value="America/New_York">(GMT-5) 纽约</SelectItem>
                      <SelectItem value="Europe/London">(GMT+0) 伦敦</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => handleSave('appearance')}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? '保存中...' : '保存设置'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;