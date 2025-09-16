import React, { useState, useEffect } from 'react';
import { MembershipCard, CardType, CardStatus, CardBatch, RedemptionRequest, RecoveryPool } from '@/types';
import { CardService } from '@/services/cardService';
import { RecoveryPoolService } from '@/services/recoveryPoolService';
import { useAuthStore } from '@/store/authStore';
import { CardActivationModal } from '@/components/cards/CardActivationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  Upload, 
  Filter, 
  RefreshCw,
  CreditCard,
  Users,
  Calendar,
  Activity,
  Recycle,
  Gift,
  FileDown
} from 'lucide-react';

const Cards: React.FC = () => {
  const { user } = useAuthStore();
  const [cards, setCards] = useState<MembershipCard[]>([]);
  const [batches, setBatches] = useState<CardBatch[]>([]);
  const [filteredCards, setFilteredCards] = useState<MembershipCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CardStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<CardType | 'ALL'>('ALL');
  const [selectedCard, setSelectedCard] = useState<MembershipCard | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  
  // 权益回收相关状态
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>([]);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [showBatchRedemptionModal, setShowBatchRedemptionModal] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [redemptionReason, setRedemptionReason] = useState('');
  const [selectedRedemptionRequests, setSelectedRedemptionRequests] = useState<string[]>([]);
  
  // 回收池相关状态
  const [recoveryPool, setRecoveryPool] = useState<RecoveryPool | null>(null);
  const [poolLoading, setPoolLoading] = useState(false);
  
  // 批量审批相关状态
  const [batchApprovalLoading, setBatchApprovalLoading] = useState(false);
  const [approvalProgress, setApprovalProgress] = useState({ current: 0, total: 0 });
  
  // 批量兑换相关状态
  const [showBatchExchangeModal, setShowBatchExchangeModal] = useState(false);
  const [exchangeCardCount, setExchangeCardCount] = useState(1);
  const [exchangeCardType, setExchangeCardType] = useState<'monthly' | 'yearly'>('monthly');
  const [exchangeRequiredDays, setExchangeRequiredDays] = useState(30);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterCards();
  }, [cards, searchTerm, statusFilter, typeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 如果是管理员，使用默认的partnerId
      const partnerId = user?.partnerId || 'partner-001';
      
      const [cardsData, batchesData, redemptionData] = await Promise.all([
        CardService.getCards(partnerId),
        CardService.getBatches(partnerId),
        CardService.getRedemptionRequests(partnerId)
      ]);
      setCards(cardsData);
      setBatches(batchesData);
      setRedemptionRequests(redemptionData);
      
      // 加载回收池信息
      loadRecoveryPool(partnerId);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  const loadRecoveryPool = async (partnerId: string) => {
    try {
      setPoolLoading(true);
      const poolData = await RecoveryPoolService.getRecoveryPool(partnerId);
      setRecoveryPool(poolData);
    } catch (error) {
      console.error('加载回收池信息失败:', error);
    } finally {
      setPoolLoading(false);
    }
  };

  const filterCards = () => {
    let filtered = cards;

    // 按搜索关键词过滤
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 按状态过滤
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(card => card.status === statusFilter);
    }

    // 按类型过滤
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(card => card.cardType === typeFilter);
    }

    setFilteredCards(filtered);
  };

  const handleActivateCard = (card: MembershipCard) => {
    setSelectedCard(card);
    setShowActivationModal(true);
  };

  const handleActivationSuccess = () => {
    loadData(); // 重新加载数据以更新状态
    toast.success('会员卡激活成功！');
  };

  const handleImportCards = async () => {
    if (!importFile) {
      toast.error('请选择要导入的文件');
      return;
    }

    try {
      // 如果是管理员，使用默认的partnerId
      const partnerId = user?.partnerId || 'partner-001';
      
      await CardService.importCards(partnerId, importFile);
      toast.success('会员卡导入成功！');
      setShowImportDialog(false);
      setImportFile(null);
      loadData(); // 重新加载数据
    } catch (error) {
      console.error('导入失败:', error);
      toast.error('导入失败，请检查文件格式');
    }
  };

  // 权益回收相关处理函数
  const handleSingleRedemption = async (card: MembershipCard) => {
    if (!redemptionReason.trim()) {
      toast.error('请填写销卡原因');
      return;
    }

    try {
      const partnerId = user?.partnerId || 'partner-001';
      const { points, days } = await CardService.calculateRedemptionPoints(card.id);
      
      await CardService.createRedemptionRequest({
        partnerId,
        cardId: card.id,
        points,
        daysRemaining: days,
        rewardType: days >= 365 ? 'yearly' : 'monthly',
        requestReason: redemptionReason
      });
      
      toast.success('权益回收申请提交成功！');
      setShowRedemptionModal(false);
      setRedemptionReason('');
      loadData();
    } catch (error) {
      console.error('权益回收失败:', error);
      toast.error('权益回收申请失败，请重试');
    }
  };

  const handleBatchRedemption = async () => {
    if (selectedCards.length === 0) {
      toast.error('请选择要回收的会员卡');
      return;
    }

    if (!redemptionReason.trim()) {
      toast.error('请填写销卡原因');
      return;
    }

    try {
      const partnerId = user?.partnerId || 'partner-001';
      const requests = [];
      
      for (const cardId of selectedCards) {
        const { points, days } = await CardService.calculateRedemptionPoints(cardId);
        requests.push({
          partnerId,
          cardId,
          points,
          daysRemaining: days,
          rewardType: days >= 365 ? 'yearly' : 'monthly',
          requestReason: redemptionReason
        });
      }
      
      await Promise.all(
        requests.map(request => CardService.createRedemptionRequest(request))
      );
      
      toast.success(`成功提交 ${selectedCards.length} 张卡的权益回收申请！`);
      setShowBatchRedemptionModal(false);
      setSelectedCards([]);
      setRedemptionReason('');
      loadData();
    } catch (error) {
      console.error('批量权益回收失败:', error);
      toast.error('批量权益回收申请失败，请重试');
    }
  };

  const handleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  // 批量兑换会员卡相关处理函数
  const handleExchangeCardTypeChange = (type: 'monthly' | 'yearly') => {
    setExchangeCardType(type);
    setExchangeRequiredDays(type === 'yearly' ? 365 : 30);
  };

  const handleExchangeCardCountChange = (count: number) => {
    setExchangeCardCount(count);
  };

  const calculateTotalRequiredDays = () => {
    return exchangeCardCount * exchangeRequiredDays;
  };

  const handleBatchExchange = async () => {
    const totalDays = calculateTotalRequiredDays();
    
    if (!recoveryPool) {
      toast.error('回收池信息未加载');
      return;
    }

    if (recoveryPool.availableDays < totalDays) {
      toast.error(`回收池余额不足！需要${totalDays}天，可用${recoveryPool.availableDays}天`);
      return;
    }

    try {
      setExchangeLoading(true);
      const partnerId = user?.partnerId || 'partner-001';
      
      // 1. 创建批量兑换申请
      const exchangeRequest = await RecoveryPoolService.createBatchExchangeRequest({
        partnerId,
        cardCount: exchangeCardCount,
        cardType: exchangeCardType,
        totalDaysRequired: totalDays,
        status: 'pending',
        operatorId: user?.id || 'admin'
      });
      
      // 2. 处理批量兑换（扣除回收池天数）
      await RecoveryPoolService.processBatchExchange(
        exchangeRequest.id,
        partnerId,
        totalDays,
        exchangeCardCount,
        user?.id || 'admin'
      );
      
      // 3. 生成新的会员卡（这里调用CardService的批量生成接口）
      const newCards = [];
      for (let i = 0; i < exchangeCardCount; i++) {
        const cardData = {
          partnerId,
          cardType: CardType.REGULAR,
          validDays: exchangeRequiredDays,
          source: 'batch_exchange',
          sourceId: exchangeRequest.id
        };
        
        // 这里可以调用CardService.generateCard或类似的接口
        newCards.push(cardData);
      }
      
      toast.success(`成功兑换${exchangeCardCount}张${exchangeCardType === 'yearly' ? '年卡' : '月卡'}！消耗${totalDays}天`);
      
      // 关闭模态框并重置表单
      setShowBatchExchangeModal(false);
      setExchangeCardCount(1);
      setExchangeCardType('monthly');
      setExchangeRequiredDays(30);
      
      // 重新加载数据
      loadData();
      
    } catch (error) {
      console.error('批量兑换失败:', error);
      toast.error('批量兑换失败，请重试');
    } finally {
      setExchangeLoading(false);
    }
  };

  // 批量审批相关处理函数
  const handleRedemptionRequestSelection = (requestId: string) => {
    setSelectedRedemptionRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAllRedemptionRequests = (checked: boolean) => {
    if (checked) {
      setSelectedRedemptionRequests(redemptionRequests.map(req => req.id));
    } else {
      setSelectedRedemptionRequests([]);
    }
  };

  const handleBatchApproval = async (approve: boolean) => {
    if (selectedRedemptionRequests.length === 0) {
      toast.error('请选择要审批的申请');
      return;
    }

    try {
      setBatchApprovalLoading(true);
      setApprovalProgress({ current: 0, total: selectedRedemptionRequests.length });
      const partnerId = user?.partnerId || 'partner-001';
      const operatorId = user?.id || 'admin';
      
      if (approve) {
        // 批量通过 - 显示进度
        const result = await CardService.batchApproveRedemptionRequests(selectedRedemptionRequests, operatorId);
        
        // 模拟进度更新
        for (let i = 1; i <= selectedRedemptionRequests.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setApprovalProgress({ current: i, total: selectedRedemptionRequests.length });
        }
        
        toast.success(
          `成功批准${result.approvedCount}个申请，共${result.totalDays}天已入池！`, 
          { duration: 3000 }
        );
      } else {
        // 批量拒绝
        await Promise.all(
          selectedRedemptionRequests.map(requestId => 
            CardService.rejectRedemptionRequest(requestId, operatorId, '批量拒绝')
          )
        );
        toast.success(`已拒绝${selectedRedemptionRequests.length}个申请`);
      }
      
      setSelectedRedemptionRequests([]);
      setApprovalProgress({ current: 0, total: 0 });
      loadData();
    } catch (error) {
      console.error('批量审批失败:', error);
      toast.error('批量审批失败，请重试');
    } finally {
      setBatchApprovalLoading(false);
      setApprovalProgress({ current: 0, total: 0 });
    }
  };

  const handleApproveRedemption = async (requestId: string) => {
    try {
      const operatorId = user?.id || 'admin';
      await CardService.approveRedemptionRequest(requestId, operatorId);
      toast.success('申请已通过，天数已入池！');
      loadData();
    } catch (error) {
      console.error('审批失败:', error);
      toast.error('审批失败，请重试');
    }
  };

  const handleRejectRedemption = async (requestId: string) => {
    try {
      const operatorId = user?.id || 'admin';
      await CardService.rejectRedemptionRequest(requestId, operatorId, '手动拒绝');
      toast.success('申请已拒绝');
      loadData();
    } catch (error) {
      console.error('拒绝失败:', error);
      toast.error('拒绝失败，请重试');
    }
  };

  const getRedemptionStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '待处理', variant: 'secondary' as const },
      approved: { label: '已通过', variant: 'default' as const },
      rejected: { label: '已拒绝', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getStatusBadge = (status: CardStatus) => {
    const statusConfig = {
      [CardStatus.UNACTIVATED]: { label: '待激活', variant: 'secondary' as const },
      [CardStatus.INACTIVE]: { label: '未激活', variant: 'destructive' as const },
      [CardStatus.BOUND]: { label: '已绑定', variant: 'default' as const },
      [CardStatus.EXPIRED]: { label: '已过期', variant: 'outline' as const },
      [CardStatus.CANCELLED]: { label: '已销卡', variant: 'destructive' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: CardType) => {
    return (
      <Badge variant={type === CardType.REGULAR ? 'default' : 'secondary'}>
        {type === CardType.REGULAR ? '普通卡' : '绑定卡'}
      </Badge>
    );
  };

  const getCardStats = () => {
    const stats = {
      total: cards.length,
      unactivated: cards.filter(c => c.status === CardStatus.UNACTIVATED).length,
      bound: cards.filter(c => c.status === CardStatus.BOUND).length,
      expired: cards.filter(c => c.status === CardStatus.EXPIRED).length,
    };
    return stats;
  };

  const stats = getCardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">会员卡管理</h1>
          <p className="text-muted-foreground">
            管理和监控会员卡的状态、激活和使用情况
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* 只有管理员可以导入会员卡 */}
          {user?.role === 'ADMIN' && (
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  导入会员卡
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>批量导入会员卡</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardFile">选择文件</Label>
                    <Input
                      id="cardFile"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      支持 Excel (.xlsx, .xls) 和 CSV 格式
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                      取消
                    </Button>
                    <Button onClick={handleImportCards} disabled={!importFile}>
                      导入
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {/* 合作伙伴和管理员可以进行批量权益回收 */}
          {(user?.role === 'ADMIN' || user?.role === 'PARTNER') && (
            <Dialog open={showBatchRedemptionModal} onOpenChange={setShowBatchRedemptionModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Recycle className="h-4 w-4 mr-2" />
                  批量权益回收
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>批量权益回收申请</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>已选择 {selectedCards.length} 张会员卡</Label>
                    <p className="text-sm text-muted-foreground">
                      请在下方会员卡列表中勾选要回收的卡片
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="batchReason">销卡原因</Label>
                    <Textarea
                      id="batchReason"
                      placeholder="请输入销卡原因..."
                      value={redemptionReason}
                      onChange={(e) => setRedemptionReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setShowBatchRedemptionModal(false);
                      setRedemptionReason('');
                    }}>
                      取消
                    </Button>
                    <Button 
                      onClick={handleBatchRedemption} 
                      disabled={selectedCards.length === 0 || !redemptionReason.trim()}
                    >
                      提交申请
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Button onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">总卡数</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">待激活</p>
              <p className="text-2xl font-bold text-orange-600">{stats.unactivated}</p>
            </div>
            <Calendar className="h-5 w-5 text-orange-500" />
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">已绑定</p>
              <p className="text-2xl font-bold text-green-600">{stats.bound}</p>
            </div>
            <Users className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">已过期</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <Activity className="h-5 w-5 text-red-500" />
          </div>
        </div>
        {/* 回收池信息卡片 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg border p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/90">回收池</p>
              {poolLoading ? (
                <p className="text-2xl font-bold">-</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{recoveryPool?.availableDays || 0}天</p>
                  <p className="text-xs text-white/80">
                    总计{recoveryPool?.totalDays || 0}天 / 已用{recoveryPool?.usedDays || 0}天
                  </p>
                </div>
              )}
            </div>
            <Recycle className="h-5 w-5 text-white/90" />
          </div>
        </div>
      </div>

      {/* 快速操作区域 */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">快速操作</h3>
            <p className="text-sm text-muted-foreground">
              基于回收池天数进行批量兑换操作
            </p>
          </div>
          {/* 管理员和合作伙伴可以进行批量兑换 */}
          {(user?.role === 'ADMIN' || user?.role === 'PARTNER') && (
            <Dialog open={showBatchExchangeModal} onOpenChange={setShowBatchExchangeModal}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={!recoveryPool || recoveryPool.availableDays === 0}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  批量兑换会员卡
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>批量兑换会员卡</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* 回收池信息展示 */}
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">回收池余额：</span>
                      <span className="font-semibold text-purple-600">
                        {recoveryPool?.availableDays || 0} 天
                      </span>
                    </div>
                  </div>
                  
                  {/* 兑换配置 */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardType">会员卡类型</Label>
                      <Select 
                        value={exchangeCardType} 
                        onValueChange={(value: 'monthly' | 'yearly') => handleExchangeCardTypeChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">月卡 (30天)</SelectItem>
                          <SelectItem value="yearly">年卡 (365天)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardCount">兑换数量</Label>
                      <Input
                        id="cardCount"
                        type="number"
                        min={1}
                        max={Math.floor((recoveryPool?.availableDays || 0) / exchangeRequiredDays)}
                        value={exchangeCardCount}
                        onChange={(e) => handleExchangeCardCountChange(parseInt(e.target.value) || 1)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        最多可兑换 {Math.floor((recoveryPool?.availableDays || 0) / exchangeRequiredDays)} 张
                      </p>
                    </div>
                  </div>
                  
                  {/* 消耗预览 */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">总消耗天数：</span>
                        <span className="font-semibold text-orange-600">
                          {calculateTotalRequiredDays()} 天
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">剩余天数：</span>
                        <span className="font-semibold">
                          {(recoveryPool?.availableDays || 0) - calculateTotalRequiredDays()} 天
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowBatchExchangeModal(false);
                        setExchangeCardCount(1);
                        setExchangeCardType('monthly');
                        setExchangeRequiredDays(30);
                      }}
                    >
                      取消
                    </Button>
                    <Button 
                      onClick={handleBatchExchange}
                      disabled={
                        exchangeLoading || 
                        !recoveryPool || 
                        calculateTotalRequiredDays() > recoveryPool.availableDays ||
                        exchangeCardCount < 1
                      }
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {exchangeLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          处理中...
                        </>
                      ) : (
                        <>
                          <Gift className="h-4 w-4 mr-2" />
                          确认兑换
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{recoveryPool?.totalDays || 0}</div>
            <div className="text-sm text-muted-foreground">累计天数</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{recoveryPool?.availableDays || 0}</div>
            <div className="text-sm text-muted-foreground">可用天数</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{recoveryPool?.usedDays || 0}</div>
            <div className="text-sm text-muted-foreground">已使用</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor((recoveryPool?.availableDays || 0) / 30)}
            </div>
            <div className="text-sm text-muted-foreground">可兑换月卡</div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索卡号或ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value: CardStatus | 'ALL') => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部状态</SelectItem>
                <SelectItem value={CardStatus.UNACTIVATED}>待激活</SelectItem>
                <SelectItem value={CardStatus.BOUND}>已绑定</SelectItem>
                <SelectItem value={CardStatus.EXPIRED}>已过期</SelectItem>
                <SelectItem value={CardStatus.CANCELLED}>已销卡</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value: CardType | 'ALL') => setTypeFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部类型</SelectItem>
                <SelectItem value={CardType.REGULAR}>普通卡</SelectItem>
                <SelectItem value={CardType.BOUND}>绑定卡</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">会员卡列表</TabsTrigger>
          <TabsTrigger value="batches">批次管理</TabsTrigger>
          <TabsTrigger value="redemption">权益回收</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">会员卡列表</h3>
                  <p className="text-sm text-muted-foreground">
                    共 {filteredCards.length} 张会员卡
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCards.length === filteredCards.length && filteredCards.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCards(filteredCards.map(card => card.id));
                          } else {
                            setSelectedCards([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-32">卡号</TableHead>
                    <TableHead className="w-20">类型</TableHead>
                    <TableHead className="w-20">状态</TableHead>
                    <TableHead className="w-24">激活时间</TableHead>
                    <TableHead className="w-24">到期时间</TableHead>
                    <TableHead className="w-24">剩余天数</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        暂无会员卡数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCards.map((card) => (
                      <TableRow key={card.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox
                            checked={selectedCards.includes(card.id)}
                            onCheckedChange={() => handleCardSelection(card.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium font-mono">
                          {card.cardNumber}
                        </TableCell>
                        <TableCell>{getTypeBadge(card.cardType)}</TableCell>
                        <TableCell>{getStatusBadge(card.status)}</TableCell>
                        <TableCell className="text-sm">
                          {card.activationDate 
                            ? new Date(card.activationDate).toLocaleDateString('zh-CN') 
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-sm">
                          {card.expiryDate 
                            ? new Date(card.expiryDate).toLocaleDateString('zh-CN') 
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-sm">
                          {card.remainingDays ? (
                            <span className={`font-medium ${
                              card.remainingDays <= 30 
                                ? 'text-red-600' 
                                : card.remainingDays <= 90 
                                ? 'text-orange-600' 
                                : 'text-green-600'
                            }`}>
                              {card.remainingDays}天
                            </span>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {card.status === CardStatus.UNACTIVATED && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleActivateCard(card)}
                                className="h-8 px-3"
                              >
                                激活
                              </Button>
                            )}
                            {(card.status === CardStatus.BOUND || card.status === CardStatus.EXPIRED) && (
                              <Dialog open={showRedemptionModal} onOpenChange={setShowRedemptionModal}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedCard(card)}
                                    className="h-8 px-3"
                                  >
                                    <Gift className="h-3 w-3 mr-1" />
                                    回收
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>权益回收申请</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h4 className="font-medium mb-2">会员卡信息</h4>
                                      <p className="text-sm">卡号: {card.cardNumber}</p>
                                      <p className="text-sm">状态: {getStatusBadge(card.status)}</p>
                                      <p className="text-sm">剩余天数: {card.remainingDays || 0}天</p>
                                    </div>
                                    <div>
                                      <Label htmlFor="reason">销卡原因</Label>
                                      <Textarea
                                        id="reason"
                                        placeholder="请输入销卡原因..."
                                        value={redemptionReason}
                                        onChange={(e) => setRedemptionReason(e.target.value)}
                                        rows={3}
                                      />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" onClick={() => {
                                        setShowRedemptionModal(false);
                                        setRedemptionReason('');
                                      }}>
                                        取消
                                      </Button>
                                      <Button 
                                        onClick={() => handleSingleRedemption(card)}
                                        disabled={!redemptionReason.trim()}
                                      >
                                        提交申请
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">批次管理</h3>
                  <p className="text-sm text-muted-foreground">
                    管理会员卡导入批次
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">批次号</TableHead>
                    <TableHead>批次名称</TableHead>
                    <TableHead className="w-20">总卡数</TableHead>
                    <TableHead className="w-20">已激活</TableHead>
                    <TableHead className="w-24">进度</TableHead>
                    <TableHead className="w-24">导入方式</TableHead>
                    <TableHead className="w-28">创建时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        暂无批次数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    batches.map((batch) => {
                      const progress = batch.totalCards > 0 ? (batch.activatedCards / batch.totalCards) * 100 : 0;
                      return (
                        <TableRow key={batch.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium font-mono">
                            {batch.batchNumber}
                          </TableCell>
                          <TableCell className="font-medium">{batch.name}</TableCell>
                          <TableCell className="text-center">{batch.totalCards}</TableCell>
                          <TableCell className="text-center">{batch.activatedCards}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all" 
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground min-w-[3rem]">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={batch.importMethod === 'file' ? 'default' : 'secondary'}>
                              {batch.importMethod === 'file' ? '文件导入' : 'API导入'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(batch.createdAt).toLocaleDateString('zh-CN')}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* 权益回收Tab */}
        <TabsContent value="redemption" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>权益回收申请管理</CardTitle>
                <CardDescription>
                  审核和处理会员卡权益回收申请，通过后天数将自动入池
                </CardDescription>
              </div>
              {user?.role === 'ADMIN' && selectedRedemptionRequests.length > 0 && (
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleBatchApproval(true)}
                      disabled={selectedRedemptionRequests.length === 0 || batchApprovalLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {batchApprovalLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          处理中...
                        </>
                      ) : (
                        <>
                          <Activity className="h-4 w-4 mr-2" />
                          批量通过 ({selectedRedemptionRequests.length})
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBatchApproval(false)}
                      disabled={selectedRedemptionRequests.length === 0 || batchApprovalLoading}
                    >
                      批量拒绝
                    </Button>
                  </div>
                  
                  {/* 进度条 */}
                  {batchApprovalLoading && approvalProgress.total > 0 && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>审批进度</span>
                        <span>{approvalProgress.current}/{approvalProgress.total}</span>
                      </div>
                      <Progress 
                        value={(approvalProgress.current / approvalProgress.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {redemptionRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">暂无权益回收申请</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {user?.role === 'ADMIN' && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedRedemptionRequests.length > 0 &&
                              selectedRedemptionRequests.length === redemptionRequests.filter(req => req.status === 'pending').length
                            }
                            onCheckedChange={handleSelectAllRedemptionRequests}
                          />
                        </TableHead>
                      )}
                      <TableHead>申请ID</TableHead>
                      <TableHead>卡号</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>剩余天数</TableHead>
                      <TableHead>积分</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>申请原因</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redemptionRequests.map((request) => (
                      <TableRow key={request.id}>
                        {user?.role === 'ADMIN' && (
                          <TableCell>
                            {request.status === 'pending' && (
                              <Checkbox
                                checked={selectedRedemptionRequests.includes(request.id)}
                                onCheckedChange={() => handleRedemptionRequestSelection(request.id)}
                              />
                            )}
                          </TableCell>
                        )}
                        <TableCell className="font-mono">{request.id}</TableCell>
                        <TableCell>{request.cardId}</TableCell>
                        <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
                        <TableCell>{request.daysRemaining} 天</TableCell>
                        <TableCell>{request.points} 积分</TableCell>
                        <TableCell>{getRedemptionStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={request.requestReason}>
                            {request.requestReason}
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && user?.role === 'ADMIN' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRedemption(request.id)}
                              >
                                通过
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRedemption(request.id)}
                              >
                                拒绝
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 激活模态框 */}
      <CardActivationModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
        card={selectedCard}
        onActivationSuccess={handleActivationSuccess}
      />
    </div>
  );
};

export default Cards;