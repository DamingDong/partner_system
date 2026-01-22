# API 集成技能

## 技能概述
为合作伙伴管理系统提供专业的 API 集成技能，基于协作框架实现 RESTful API 设计、数据获取、错误处理等。

## 协作角色定位

### API 集成职责
- **技术实现者**：基于产品需求实现 API 接口
- **数据桥梁**：连接前端界面和后端服务
- **错误处理专家**：确保系统稳定性和用户体验
- **性能优化者**：优化 API 响应时间和数据效率

### 协作接口定义
- **与产品经理**：确认 API 需求规格和验收标准
- **与前端团队**：定义数据格式和交互协议
- **与后端团队**：协调接口设计和实现细节
- **与AI助手**：自动化 API 文档维护和测试

## 核心能力

### 1. 协作式 API 服务设计
- RESTful API 规范实现，基于协作框架确认需求
- 请求/响应数据格式定义，与前后端团队协作
- 错误码和状态码管理，支持产品经理验收
- 接口版本控制，确保协作框架下的兼容性

### 2. 协作式数据获取策略
- React Query 数据缓存，基于协作性能要求
- 轮询和实时更新，满足产品实时性需求
- 分页数据加载，优化用户体验
- 批量请求优化，提升系统性能

### 3. 协作式错误处理
- 网络错误处理，确保系统稳定性
- 业务错误处理，支持产品业务逻辑
- 重试机制，基于协作框架的容错策略
- 降级方案，保障核心功能可用性

## 最佳实践

### 服务层架构
```typescript
// 服务基类
abstract class BaseService {
  protected baseURL: string;
  protected headers: Record<string, string>;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }
  
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

// 具体服务实现
class PartnerService extends BaseService {
  constructor() {
    super('/api/v1');
  }
  
  async getPartners(params?: GetPartnersParams): Promise<Partner[]> {
    return this.request<Partner[]>('/partners', {
      method: 'GET',
      params,
    });
  }
  
  async createPartner(data: CreatePartnerData): Promise<Partner> {
    return this.request<Partner>('/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

### React Query 集成
```typescript
// 查询钩子
const usePartners = (params?: GetPartnersParams) => {
  return useQuery({
    queryKey: ['partners', params],
    queryFn: () => partnerService.getPartners(params),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

// 突变钩子
const useCreatePartner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePartnerData) => partnerService.createPartner(data),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });
};
```

## 项目特定 API

### 核心 API 端点
```typescript
// 合作伙伴管理
GET /api/v1/partners           // 获取合作伙伴列表
GET /api/v1/partners/:id        // 获取合作伙伴详情
POST /api/v1/partners           // 创建合作伙伴
PUT /api/v1/partners/:id        // 更新合作伙伴
DELETE /api/v1/partners/:id     // 删除合作伙伴

// 会员卡管理
GET /api/v1/cards               // 获取会员卡列表
GET /api/v1/cards/:id           // 获取会员卡详情
POST /api/v1/cards              // 创建会员卡
POST /api/v1/cards/:id/bind     // 绑定会员卡
POST /api/v1/cards/:id/unbind   // 解绑会员卡

// 订单管理
GET /api/v1/orders              // 获取订单列表
GET /api/v1/orders/:id          // 获取订单详情
GET /api/v1/orders/export       // 导出订单数据
POST /api/v1/orders             // 创建订单

// 分账管理
GET /api/v1/sharing-records     // 获取分账记录
GET /api/v1/revenue-summary     // 获取收入汇总

// 对账管理
GET /api/v1/reconciliation-statements  // 获取对账单
POST /api/v1/reconciliation-statements // 生成对账单
```

### 请求/响应格式
```typescript
// 分页请求
interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 错误响应
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## 安全和认证

### 认证机制
- JWT Token 认证
- 权限验证中间件
- API 密钥管理
- 请求签名验证

### 安全最佳实践
- HTTPS 强制使用
- 请求频率限制
- 输入验证和清理
- SQL 注入防护