# 开发指南 - 合作伙伴管理系统

## 📋 文档概述

### 文档目的
本文档为合作伙伴管理系统提供完整的开发指导，包括项目架构、开发环境配置、编码规范、最佳实践等，帮助开发团队高效协作和规范开发。

### 适用范围
- 新加入的开发人员：快速上手项目
- 现有开发团队：统一开发规范和最佳实践
- 技术负责人：技术架构和代码质量把控

### 版本信息
- **当前版本**: v1.0
- **生效时间**: 2025-01-05
- **维护责任人**: 技术负责人

## 🏗️ 项目架构

### 技术栈

#### 前端技术栈
```typescript
// 核心框架
React 18.3.1 + TypeScript 5.0+
Vite 5.0+ (构建工具)

// 样式系统
Tailwind CSS 3.3+ (原子化CSS)
shadcn/ui (组件库)

// 状态管理
Zustand 4.5+ (轻量状态管理)

// 路由管理
React Router DOM 6.26+

// 数据可视化
Recharts 2.12+ (图表组件)

// HTTP客户端
Axios 1.11+ (HTTP请求)

// 测试框架
Vitest 3.2+ (单元测试)
@testing-library/react (组件测试)
```

#### 开发工具
```bash
# 包管理器
pnpm 8.10+

# 代码质量
ESLint 8.50+ (代码检查)
Prettier 3.0+ (代码格式化)

# Git工作流
Husky 8.0+ (Git钩子)
lint-staged 13.2+ (暂存区检查)
```

### 目录结构

```
src/
├── components/          # 可复用组件
│   ├── auth/           # 认证相关组件
│   ├── cards/          # 会员卡组件
│   ├── dashboard/      # 仪表板组件
│   ├── layout/         # 布局组件
│   ├── orders/         # 订单组件
│   ├── partners/       # 合作伙伴组件
│   ├── recovery/       # 权益回收组件
│   ├── revenue/        # 分账管理组件
│   └── ui/             # 基础UI组件 (shadcn/ui)
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 仪表板页面
│   ├── Cards.tsx       # 会员卡管理页面
│   ├── Orders.tsx      # 订单管理页面
│   ├── Partners.tsx    # 合作伙伴页面
│   ├── RecoveryPoolPage.tsx # 权益回收池页面
│   ├── RevenueSharing.tsx   # 分账管理页面
│   └── Reports.tsx     # 数据报表页面
├── services/           # 业务服务层
│   ├── authService.ts  # 认证服务
│   ├── cardService.ts  # 会员卡服务
│   ├── orderService.ts # 订单服务
│   ├── partnerService.ts # 合作伙伴服务
│   └── recoveryPoolService.ts # 回收池服务
├── store/              # 状态管理
│   ├── authStore.ts    # 认证状态
│   ├── cardStore.ts    # 会员卡状态
│   ├── orderStore.ts   # 订单状态
│   └── uiStore.ts      # UI状态
├── hooks/              # 自定义Hook
│   ├── useAuth.ts      # 认证相关Hook
│   ├── useCards.ts     # 会员卡相关Hook
│   ├── useOrders.ts    # 订单相关Hook
│   └── usePartners.ts  # 合作伙伴相关Hook
├── lib/                # 工具函数和Mock数据
│   ├── utils/          # 工具函数
│   ├── constants/      # 常量定义
│   └── mock-data/      # Mock数据
├── types/              # TypeScript类型定义
│   ├── auth.ts         # 认证类型
│   ├── cards.ts        # 会员卡类型
│   ├── orders.ts       # 订单类型
│   └── common.ts       # 通用类型
└── __tests__/          # 测试文件
    ├── components/     # 组件测试
    ├── services/       # 服务测试
    └── utils/          # 工具函数测试
```

## 🔧 开发环境配置

### 环境要求

#### 系统要求
- **Node.js**: 18.0.0+ (推荐18.18.0 LTS)
- **pnpm**: 8.10.0+
- **Git**: 2.30.0+
- **操作系统**: Windows 10+/macOS 12+/Linux Ubuntu 20.04+

#### 开发工具推荐
- **IDE**: VS Code (推荐) 或 WebStorm
- **浏览器**: Chrome 90+ 或 Firefox 100+
- **Git客户端**: Git CLI 或 SourceTree

### 快速开始

#### 1. 环境准备
```bash
# 安装Node.js (推荐使用nvm)
nvm install 18.18.0
nvm use 18.18.0

# 安装pnpm
npm install -g pnpm@8.10.0

# 验证安装
node --version  # v18.18.0
pnpm --version  # 8.10.0+
```

#### 2. 项目初始化
```bash
# 克隆项目
git clone https://github.com/DamingDong/partner_system.git
cd partner_system

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问应用
# http://localhost:5173
```

#### 3. VS Code配置
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 📝 编码规范

### TypeScript规范

#### 类型定义规范
```typescript
// 接口命名使用PascalCase，以I开头
interface IUser {
  id: string;
  name: string;
  email: string;
}

// 枚举使用PascalCase
enum CardStatus {
  PENDING_BIND = 'PENDING_BIND',
  BOUND = 'BOUND',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

// 类型别名使用PascalCase
type TCardList = ICard[];

// 函数类型定义
interface IUserService {
  getUserById: (id: string) => Promise<IUser>;
  createUser: (user: Omit<IUser, 'id'>) => Promise<IUser>;
}
```

#### 组件Props规范
```typescript
// Props接口命名：组件名 + Props
interface ICardListProps {
  cards: ICard[];
  loading?: boolean;
  onCardClick?: (card: ICard) => void;
  className?: string;
}

// 函数组件定义
const CardList: React.FC<ICardListProps> = ({
  cards,
  loading = false,
  onCardClick,
  className
}) => {
  // 组件实现
};
```

### React组件规范

#### 函数组件规范
```typescript
// 使用函数组件和Hooks
import React, { useState, useEffect } from 'react';

interface IUserProfileProps {
  userId: string;
}

const UserProfile: React.FC<IUserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  if (!user) {
    return <div className="text-red-500">用户不存在</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};

export default UserProfile;
```

#### 自定义Hook规范
```typescript
// Hook命名以use开头，使用camelCase
import { useState, useEffect } from 'react';
import { cardService, ICard } from '../services/cardService';

export const useCards = (partnerId?: string) => {
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const cardData = await cardService.getCards({
          partnerId,
          page: 1,
          limit: 50
        });
        
        setCards(cardData.cards);
      } catch (err) {
        setError('获取会员卡列表失败');
        console.error('Failed to fetch cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [partnerId]);

  return {
    cards,
    loading,
    error,
    refetch: () => {
      // 重新获取数据的逻辑
    }
  };
};
```

### 样式规范

#### Tailwind CSS使用规范
```typescript
// 使用Tailwind原子类，避免自定义CSS
const Card = ({ title, content, action }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{content}</p>
    <div className="flex justify-end space-x-2">
      {action}
    </div>
  </div>
);

// 响应式设计
const ResponsiveGrid = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item, index) => (
      <Card key={index} {...item} />
    ))}
  </div>
);
```

#### shadcn/ui组件使用
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const UserForm = () => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>用户信息</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Input placeholder="姓名" />
      <Input placeholder="邮箱" type="email" />
      <Button className="w-full">保存</Button>
    </CardContent>
  </Card>
);
```

## 🚀 最佳实践

### 状态管理最佳实践

#### Zustand Store设计
```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ICardStore {
  cards: ICard[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setCards: (cards: ICard[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchCards: (partnerId?: string) => Promise<void>;
  activateCard: (cardId: string, activationCode: string) => Promise<void>;
}

export const useCardStore = create<ICardStore>()(
  devtools(
    (set, get) => ({
      cards: [],
      loading: false,
      error: null,
      
      setCards: (cards) => set({ cards }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      fetchCards: async (partnerId) => {
        set({ loading: true, error: null });
        
        try {
          const response = await cardService.getCards({ partnerId });
          set({ cards: response.cards, loading: false });
        } catch (error) {
          set({ error: '获取会员卡失败', loading: false });
        }
      },
      
      activateCard: async (cardId, activationCode) => {
        set({ loading: true, error: null });
        
        try {
          await cardService.activateCard(cardId, activationCode);
          // 重新获取卡片列表
          await get().fetchCards();
        } catch (error) {
          set({ error: '激活会员卡失败', loading: false });
        }
      }
    }),
    { name: 'card-store' }
  )
);
```

### API服务层最佳实践

#### 服务类设计
```typescript
import axios from 'axios';

class CardService {
  private api = axios.create({
    baseURL: '/api',
    timeout: 10000
  });

  // 请求拦截器
  constructor() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // 处理Token过期
          this.handleTokenExpired();
        }
        return Promise.reject(error);
      }
    );
  }

  async getCards(params: ICardQueryParams): Promise<ICardListResponse> {
    return this.api.get('/cards', { params });
  }

  async activateCard(cardId: string, activationCode: string): Promise<void> {
    return this.api.post(`/cards/${cardId}/activate`, { activationCode });
  }

  private handleTokenExpired() {
    // Token过期处理逻辑
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
}

export const cardService = new CardService();
```

### 错误处理最佳实践

#### 统一错误处理
```typescript
// 错误边界组件
import React from 'react';

interface IErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  IErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // 可以发送错误报告到监控系统
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-800 font-semibold">出错了</h3>
          <p className="text-red-600">请刷新页面重试</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🧪 测试指南

### 单元测试规范

#### 组件测试
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CardList } from './CardList';

const mockCards = [
  { id: '1', cardNumber: '1234567890', status: 'ACTIVE' },
  { id: '2', cardNumber: '0987654321', status: 'EXPIRED' }
];

describe('CardList', () => {
  it('renders card list correctly', () => {
    render(<CardList cards={mockCards} />);
    
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('0987654321')).toBeInTheDocument();
  });

  it('calls onCardClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    render(<CardList cards={mockCards} onCardClick={mockOnClick} />);
    
    fireEvent.click(screen.getByText('1234567890'));
    expect(mockOnClick).toHaveBeenCalledWith(mockCards[0]);
  });
});
```

#### Hook测试
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCards } from './useCards';

// Mock service
jest.mock('../services/cardService');

describe('useCards', () => {
  it('fetches cards successfully', async () => {
    const { result } = renderHook(() => useCards('partner-1'));
    
    await act(async () => {
      await result.current.refetch();
    });
    
    expect(result.current.cards).toHaveLength(2);
    expect(result.current.loading).toBe(false);
  });
});
```

---

**文档版本**: v1.0  
**创建日期**: 2025-01-05  
**维护责任人**: 技术负责人  
**下次评审**: 2025-02-05