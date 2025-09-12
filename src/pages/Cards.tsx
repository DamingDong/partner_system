import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { CardService } from '@/services/cardService';
import { CoreSystemService } from '@/services/coreSystemService';
import { 
  MembershipCard, 
  CardBatch, 
  RedemptionRequest, 
  ImportCardsRequest,
  CreateRedemptionRequest,
  CardType,
  CardStatus
} from '@/types';
import { 
  Upload, 
  Search, 
  Package, 
  Calendar, 
  AlertCircle, 
  Gift, 
  Download,
  Plus,
  FileText,
  RefreshCw,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const Cards: React.FC = () => {
  const { user } = useAuthStore();
  
  // 基础数据状态
  const [cards, setCards] = useState<MembershipCard[]>([]);
  const [batches, setBatches] = useState<CardBatch[]>([]);
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>([]);
  const [cardStats, setCardStats] = useState({
    totalCards: 0,
    activeCards: 0,
    cancelledCards: 0,
    expiredCards: 0
  });
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // UI状态
  const [activeTab, setActiveTab] = useState<'cards' | 'batches' | 'redemptions' | 'stats'>('cards');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [batchCards, setBatchCards] = useState<MembershipCard[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<CardStatus | 'all'>('all');
  
  // 模态框状态
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBatchCreateModal, setShowBatchCreateModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showCardDetailModal, setShowCardDetailModal] = useState(false);
  
  // 选中项状态
  const [selectedCard, setSelectedCard] = useState<MembershipCard | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [redemptionPoints, setRedemptionPoints] = useState<{ points: number; days: number } | null>(null);
  
  // 批量操作状态
  const [batchImportData, setBatchImportData] = useState<{
    batchName: string;
    importMethod: 'file' | 'api';
    cards: { cardNumber: string; cardType: CardType; expiryDate?: string }[];
  }>({
    batchName: '',
    importMethod: 'file',
    cards: []
  });

  // 数据加载函数
  const loadData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const partnerId = user.partnerId || user.id;
      const [cardsData, batchesData, redemptionsData, statsData] = await Promise.all([
        CardService.getCards(partnerId),
        CardService.getBatches(partnerId),
        CardService.getRedemptionRequests(partnerId),
        CardService.getCardStats(partnerId)
      ]);
      
      setCards(cardsData);
      setBatches(batchesData);
      setRedemptionRequests(redemptionsData);
      setCardStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await CardService.importCards(user.id, file);
      await loadData();
      setShowImportModal(false);
    } catch (error) {
      console.error('导入失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSelect = async (batchId: string) => {
    setSelectedBatch(batchId);
    try {
      const cards = await CardService.getCardsByBatch(batchId);
      setBatchCards(cards);
    } catch (error) {
      console.error('获取批次卡片失败:', error);
    }
  };

  const handleCancelCard = async (cardId: string) => {
    try {
      await CardService.cancelCard(cardId);
      await loadData();
    } catch (error) {
      console.error('销卡失败:', error);
    }
  };

  const handleCalculateRedemption = async (card: MembershipCard) => {
    setSelectedCard(card);
    try {
      const points = await CardService.calculateRedemptionPoints(card.id);
      setRedemptionPoints(points);
      setShowRedeemModal(true);
    } catch (error) {
      console.error('计算积分失败:', error);
    }
  };

  const handleRedeemCard = async (rewardType: 'monthly' | 'yearly') => {
    if (!selectedCard || !redemptionPoints || !user) return;
    
    try {
      await CardService.createRedemptionRequest({
        cardId: selectedCard.id,
        partnerId: user.partnerId || user.id,
        points: redemptionPoints.points,
        daysRemaining: redemptionPoints.days,
        rewardType,
        requestType: rewardType
      });
      await loadData();
      setShowRedeemModal(false);
      setSelectedCard(null);
      setRedemptionPoints(null);
    } catch (error) {
      console.error('兑换失败:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'bound': return 'text-blue-600 bg-blue-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '未激活';
      case 'bound': return '已绑定';
      case 'expired': return '已过期';
      case 'cancelled': return '已销卡';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">会员卡管理</h1>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload className="w-4 h-4" />
          <span>批量导入</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'cards', label: '会员卡列表' },
              { key: 'batches', label: '批次管理' },
              { key: 'redemptions', label: '兑换申请' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{card.cardNumber}</h3>
                        <p className="text-sm text-gray-500">批次: {card.batchId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                        {getStatusText(card.status)}
                      </span>
                    </div>
                    
                    {card.activationDate && (
                      <div className="text-sm text-gray-600">
                        <p>激活时间: {new Date(card.activationDate).toLocaleDateString()}</p>
                        {card.expiryDate && (
                          <p>到期时间: {new Date(card.expiryDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}

                    {card.status === 'active' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCancelCard(card.id)}
                          className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          申请销卡
                        </button>
                        <button
                          onClick={() => handleCalculateRedemption(card)}
                          className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          积分兑换
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'batches' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map((batch) => (
                  <div key={batch.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{batch.batchNumber}</h3>
                        <p className="text-sm text-gray-500">
                          导入时间: {new Date(batch.importedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {batch.quantity} 张卡
                      </span>
                    </div>
                    <button
                      onClick={() => handleBatchSelect(batch.id)}
                      className="mt-3 text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      查看详情
                    </button>
                  </div>
                ))}
              </div>

              {selectedBatch && batchCards.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">批次详情</h4>
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {batchCards.map((card) => (
                        <div key={card.id} className="border rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{card.cardNumber}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(card.status)}`}>
                              {getStatusText(card.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'redemptions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {redemptionRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          兑换 {request.rewardType === 'monthly' ? '月卡' : '年卡'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          卡号: {cards.find(c => c.id === request.cardId)?.cardNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          积分: {request.points} 分 ({request.days} 天)
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'text-yellow-600 bg-yellow-50' :
                        request.status === 'approved' ? 'text-green-600 bg-green-50' :
                        'text-red-600 bg-red-50'
                      }`}>
                        {request.status === 'pending' ? '待审核' :
                         request.status === 'approved' ? '已通过' : '已拒绝'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      申请时间: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 导入模态框 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">批量导入会员卡</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择文件
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="text-sm text-gray-500">
                支持 CSV 和 Excel 文件格式
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 兑换模态框 */}
      {showRedeemModal && selectedCard && redemptionPoints && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">积分兑换</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  可兑换积分: <span className="font-medium">{redemptionPoints.points} 分</span>
                </p>
                <p className="text-sm text-gray-600">
                  对应天数: <span className="font-medium">{redemptionPoints.days} 天</span>
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleRedeemCard('monthly')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  兑换月卡
                </button>
                <button
                  onClick={() => handleRedeemCard('yearly')}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  兑换年卡
                </button>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowRedeemModal(false);
                  setSelectedCard(null);
                  setRedemptionPoints(null);
                }}
                className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;