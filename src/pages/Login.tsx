import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { adminPermissions, partnerPermissions } from '@/lib/mock-data';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('请输入邮箱地址');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }
    if (!formData.password) {
      setError('请输入密码');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户数据
      const mockUser = {
        id: '1',
        username: formData.email.split('@')[0],
        email: formData.email,
        phone: '13800138000',
        name: formData.email.includes('admin') ? '管理员' : '合作伙伴',
        role: formData.email.includes('admin') ? UserRole.ADMIN : UserRole.PARTNER,
        partnerId: formData.email.includes('admin') ? undefined : 'partner-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 构造 AuthResponse 对象
      const authResponse = {
        user: mockUser,
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        permissions: formData.email.includes('admin') ? adminPermissions : partnerPermissions
      };

      login(authResponse);
      navigate(from, { replace: true });
    } catch (err) {
      setError('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  // 快速登录函数
  const quickLogin = (email: string, password: string) => {
    setFormData({ email, password, rememberMe: false });
    // 自动提交表单
    setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser = {
          id: '1',
          username: email.split('@')[0],
          email: email,
          phone: '13800138000',
          name: email.includes('admin') ? '管理员' : '合作伙伴',
          role: email.includes('admin') ? UserRole.ADMIN : UserRole.PARTNER,
          partnerId: email.includes('admin') ? undefined : 'partner-001',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // 构造 AuthResponse 对象
        const authResponse = {
          user: mockUser,
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh-token',
          permissions: email.includes('admin') ? adminPermissions : partnerPermissions
        };
        
        login(authResponse);
        navigate(from, { replace: true });
      } catch (err) {
        setError('快速登录失败');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4 text-2xl">欢迎回来</CardTitle>
            <CardDescription>
              登录您的合作伙伴账户
            </CardDescription>
            
            {/* 测试账号提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm font-medium text-blue-800 mb-2">💡 测试账号信息：</p>
              <div className="space-y-1 text-xs text-blue-700">
                <div className="flex justify-between">
                  <span>管理员账号：</span>
                  <span className="font-mono">admin@example.com / password</span>
                </div>
                <div className="flex justify-between">
                  <span>合作伙伴账号：</span>
                  <span className="font-mono">partner001@example.com / password</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com 或 partner001@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleChange('rememberMe', checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  记住我
                </Label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                忘记密码？
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          {/* 快速登录区域 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                或使用快速登录
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => quickLogin('admin@example.com', 'password')}
              disabled={loading}
            >
              快速登录（管理员）
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => quickLogin('partner001@example.com', 'password')}
              disabled={loading}
            >
              快速登录（合作伙伴）
            </Button>
          </div>

          <div className="text-center text-sm">
            还没有账户？{' '}
            <Link to="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            合作伙伴管理系统 © 2024
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}