import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { LoginRequest } from '@/types';

const loginSchema = z.object({
  username: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位字符'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // 确保数据类型符合 LoginRequest
      const loginData: LoginRequest = {
        username: data.username,
        password: data.password,
      };
      const authResponse = await AuthService.login(loginData);
      login(authResponse);
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '登录失败，请重试';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 快速登录函数
  const quickLogin = (username: string, password: string) => {
    setValue('username', username);
    setValue('password', password);
    // 自动提交表单
    setTimeout(() => {
      onSubmit({ username, password });
    }, 100);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MGX</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            合作伙伴系统
          </CardTitle>
          <CardDescription className="text-center">
            请输入您的账户信息登录
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
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">邮箱地址</Label>
              <Input
                id="username"
                type="email"
                placeholder="admin@example.com 或 partner001@example.com"
                {...register('username')}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              登录
            </Button>
          </form>
          
          {/* 快速登录区域 */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">或使用快速登录</span>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => quickLogin('admin@example.com', 'password')}
                disabled={isLoading}
              >
                快速登录（管理员）
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => quickLogin('partner001@example.com', 'password')}
                disabled={isLoading}
              >
                快速登录（合作伙伴）
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              忘记密码？
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}