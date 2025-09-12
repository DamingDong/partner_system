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
  
  // 回收池相关状态
  const [recoveryPool, setRecoveryPool] = useState<RecoveryPool | null>(null);
  const [poolLoading, setPoolLoading] = useState(false);

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

        <TabsContent value="redemption" className="space-y-4">
          {/* 回收池状态卡片 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg border p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">权益回收池</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-white/80">可用天数</p>
                    <p className="text-3xl font-bold">{recoveryPool?.availableDays || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">总计天数</p>
                    <p className="text-3xl font-bold">{recoveryPool?.totalDays || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">已用天数</p>
                    <p className="text-3xl font-bold">{recoveryPool?.usedDays || 0}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <div className="w-32 bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all" 
                      style={{ 
                        width: `${recoveryPool ? (recoveryPool.availableDays / recoveryPool.totalDays * 100) : 0}%` 
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm text-white/80">
                  使用率: {recoveryPool && recoveryPool.totalDays > 0 
                    ? Math.round((recoveryPool.usedDays / recoveryPool.totalDays) * 100) 
                    : 0}%
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 text-purple-600 border-white/20 hover:bg-white/10"
                  onClick={() => {
                    // 批量兑换功能入口（后续开发）
                    toast.info('批量兑换会员卡功能开发中...');
                  }}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  批量兑换
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">权益回收申请</h3>
                  <p className="text-sm text-muted-foreground">
                    管理会员卡权益回收申请记录，审批通过后天数将自动累计到回收池
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // 批量审批功能（后续开发）
                      toast.info('批量审批功能开发中...');
                    }}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    批量审批
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    导出记录
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">申请ID</TableHead>
                    <TableHead className="w-32">原卡号</TableHead>
                    <TableHead className="w-20">积分</TableHead>
                    <TableHead className="w-24">回收天数</TableHead>
                    <TableHead className="w-24">奖励类型</TableHead>
                    <TableHead className="w-20">状态</TableHead>
                    <TableHead className="w-28">申请时间</TableHead>
                    <TableHead className="w-28">处理时间</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptionRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        暂无权益回收申请记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    redemptionRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium font-mono">
                          {request.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-mono">
                          {request.originalCardNumber}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium text-blue-600">
                            {request.points}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium text-green-600">
                            +{request.daysRemaining}天
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={request.rewardType === 'yearly' ? 'default' : 'secondary'}>
                            {request.rewardType === 'yearly' ? '年度奖励' : '月度奖励'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getRedemptionStatusBadge(request.status)}
                            {request.status === 'approved' && (
                              <Badge variant="outline" className="text-xs">
                                <Recycle className="h-3 w-3 mr-1" />
                                已入池
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(request.requestedAt).toLocaleDateString('zh-CN')}
                        </TableCell>
                        <TableCell className="text-sm">
                          {request.processedAt 
                            ? new Date(request.processedAt).toLocaleDateString('zh-CN')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => {
                              // 查看详情逻辑
                              toast.info('查看申请详情功能开发中...');
                            }}
                          >
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
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