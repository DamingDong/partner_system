import React, { useState, useEffect } from 'react';
import { MembershipCard, CardType, CardStatus, CardBatch } from '@/types';
import { CardService } from '@/services/cardService';
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
  Activity
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

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterCards();
  }, [cards, searchTerm, statusFilter, typeFilter]);

  const loadData = async () => {
    if (!user?.partnerId) return;

    try {
      setLoading(true);
      const [cardsData, batchesData] = await Promise.all([
        CardService.getCards(user.partnerId),
        CardService.getBatches(user.partnerId)
      ]);
      setCards(cardsData);
      setBatches(batchesData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败，请重试');
    } finally {
      setLoading(false);
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
    if (!importFile || !user?.partnerId) {
      toast.error('请选择要导入的文件');
      return;
    }

    try {
      await CardService.importCards(user.partnerId, importFile);
      toast.success('会员卡导入成功！');
      setShowImportDialog(false);
      setImportFile(null);
      loadData(); // 重新加载数据
    } catch (error) {
      console.error('导入失败:', error);
      toast.error('导入失败，请检查文件格式');
    }
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
          <Button onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总卡数</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待激活</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unactivated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已绑定</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bound}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已过期</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索卡号或ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: CardStatus | 'ALL') => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="状态筛选" />
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
              <SelectTrigger className="w-40">
                <SelectValue placeholder="类型筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部类型</SelectItem>
                <SelectItem value={CardType.REGULAR}>普通卡</SelectItem>
                <SelectItem value={CardType.BOUND}>绑定卡</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区域 */}
      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">会员卡列表</TabsTrigger>
          <TabsTrigger value="batches">批次管理</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>会员卡列表</CardTitle>
              <CardDescription>
                共 {filteredCards.length} 张会员卡
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>卡号</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>激活时间</TableHead>
                    <TableHead>到期时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">{card.cardNumber}</TableCell>
                      <TableCell>{getTypeBadge(card.cardType)}</TableCell>
                      <TableCell>{getStatusBadge(card.status)}</TableCell>
                      <TableCell>
                        {card.activationDate 
                          ? new Date(card.activationDate).toLocaleDateString() 
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {card.expiryDate 
                          ? new Date(card.expiryDate).toLocaleDateString() 
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {card.status === CardStatus.UNACTIVATED && (
                          <Button
                            size="sm"
                            onClick={() => handleActivateCard(card)}
                          >
                            激活
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>批次管理</CardTitle>
              <CardDescription>
                管理会员卡导入批次
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>批次号</TableHead>
                    <TableHead>批次名称</TableHead>
                    <TableHead>总卡数</TableHead>
                    <TableHead>已激活</TableHead>
                    <TableHead>导入方式</TableHead>
                    <TableHead>创建时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                      <TableCell>{batch.name}</TableCell>
                      <TableCell>{batch.totalCards}</TableCell>
                      <TableCell>{batch.activatedCards}</TableCell>
                      <TableCell>
                        <Badge variant={batch.importMethod === 'file' ? 'default' : 'secondary'}>
                          {batch.importMethod === 'file' ? '文件导入' : 'API导入'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(batch.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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