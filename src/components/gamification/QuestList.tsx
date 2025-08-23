import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Coins, Zap, Target, Calendar, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/stores/authStore';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  reward: {
    coins: number;
    xp: number;
  };
  expiresAt?: string;
}

interface QuestListProps {
  onQuestComplete?: (quest: Quest) => void;
}

export const QuestList: React.FC<QuestListProps> = ({ onQuestComplete }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingQuest, setClaimingQuest] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quests', {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuests(data.quests || []);
      } else {
        // Fallback to mock data
        setQuests(getMockQuests());
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
      // Fallback to mock data
      setQuests(getMockQuests());
    } finally {
      setLoading(false);
    }
  };

  const getMockQuests = (): Quest[] => [
    {
      id: '1',
      title: 'Selesaikan 5 Soal Matematika',
      description: 'Kerjakan dan selesaikan 5 soal penalaran matematika',
      type: 'daily',
      target: 5,
      progress: 3,
      completed: false,
      claimed: false,
      reward: { coins: 100, xp: 50 }
    },
    {
      id: '2',
      title: 'Baca 3 Materi Pembelajaran',
      description: 'Baca dan pahami 3 materi pembelajaran hari ini',
      type: 'daily',
      target: 3,
      progress: 3,
      completed: true,
      claimed: false,
      reward: { coins: 75, xp: 40 }
    },
    {
      id: '3',
      title: 'Ikuti Try Out Mingguan',
      description: 'Selesaikan try out mingguan dengan skor minimal 70',
      type: 'weekly',
      target: 1,
      progress: 0,
      completed: false,
      claimed: false,
      reward: { coins: 500, xp: 200 },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      title: 'Streak 7 Hari',
      description: 'Belajar selama 7 hari berturut-turut',
      type: 'achievement',
      target: 7,
      progress: 4,
      completed: false,
      claimed: false,
      reward: { coins: 300, xp: 150 }
    }
  ];

  const claimQuestReward = async (questId: string) => {
    try {
      setClaimingQuest(questId);
      
      // Find the quest to claim
      const questToClaim = quests.find(q => q.id === questId);
      if (!questToClaim || !questToClaim.completed || questToClaim.claimed) {
        toast({
          title: "Tidak dapat mengklaim",
          description: "Quest belum selesai atau sudah diklaim",
          variant: "destructive",
        });
        return;
      }

      // Try API first
      try {
        const response = await fetch(`/api/quests/${questId}/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Update quest status
          setQuests(prev => prev.map(quest => 
            quest.id === questId 
              ? { ...quest, claimed: true }
              : quest
          ));

          // Show success toast
          toast({
            title: "Quest selesai!",
            description: `${data.message} (+${data.reward.coins} koin, +${data.reward.xp} XP)`,
          });

          // Notify parent component
          if (onQuestComplete) {
            onQuestComplete({ ...questToClaim, claimed: true });
          }
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock claim');
      }

      // Fallback to mock claim
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Update quest status
      setQuests(prev => prev.map(quest => 
        quest.id === questId 
          ? { ...quest, claimed: true }
          : quest
      ));

      // Show success toast
      toast({
        title: "Quest selesai!",
        description: `Hadiah berhasil diklaim! (+${questToClaim.reward.coins} koin, +${questToClaim.reward.xp} XP)`,
      });

      // Notify parent component
      if (onQuestComplete) {
        onQuestComplete({ ...questToClaim, claimed: true });
      }

    } catch (error) {
      console.error('Failed to claim quest reward:', error);
      toast({
        title: "Gagal mengklaim hadiah",
        description: "Terjadi kesalahan jaringan",
        variant: "destructive",
      });
    } finally {
      setClaimingQuest(null);
    }
  };

  const getQuestIcon = (type: Quest['type']) => {
    switch (type) {
      case 'daily':
        return <Calendar className="h-4 w-4" />;
      case 'weekly':
        return <Clock className="h-4 w-4" />;
      case 'achievement':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getQuestTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800';
      case 'weekly':
        return 'bg-purple-100 text-purple-800';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Kedaluwarsa';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} hari`;
    } else if (hours > 0) {
      return `${hours}j ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const filterQuestsByType = (type: Quest['type']) => {
    return quests.filter(quest => quest.type === type);
  };

  const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
    const progressPercentage = Math.min((quest.progress / quest.target) * 100, 100);
    const isExpired = Boolean(quest.expiresAt && new Date(quest.expiresAt) < new Date());
    
    return (
      <Card className={`${quest.completed ? 'border-green-200 bg-green-50' : ''} ${isExpired ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getQuestIcon(quest.type)}
              <CardTitle className="text-base">{quest.title}</CardTitle>
            </div>
            <Badge className={getQuestTypeColor(quest.type)}>
              {quest.type === 'daily' ? 'Harian' : quest.type === 'weekly' ? 'Mingguan' : 'Pencapaian'}
            </Badge>
          </div>
          <CardDescription className="text-sm">
            {quest.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">
                {quest.progress} / {quest.target}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Reward */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span>{quest.reward.coins}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-600" />
              <span>{quest.reward.xp} XP</span>
            </div>
          </div>

          {/* Time Remaining */}
          {quest.expiresAt && (
            <div className="text-xs text-gray-500">
              {isExpired ? (
                <span className="text-red-500">Kedaluwarsa</span>
              ) : (
                <span>Sisa waktu: {formatTimeRemaining(quest.expiresAt)}</span>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {quest.claimed ? (
              <Button disabled className="w-full" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Sudah Diklaim
              </Button>
            ) : quest.completed ? (
              <Button 
                onClick={() => claimQuestReward(quest.id)}
                disabled={claimingQuest === quest.id || isExpired}
                className="w-full"
                size="sm"
              >
                {claimingQuest === quest.id ? 'Mengklaim...' : 'Klaim Hadiah'}
              </Button>
            ) : (
              <Button disabled variant="outline" className="w-full" size="sm">
                {isExpired ? 'Kedaluwarsa' : 'Belum Selesai'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quest</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Quest
        </CardTitle>
        <CardDescription>
          Selesaikan quest untuk mendapatkan hadiah menarik!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Harian</TabsTrigger>
            <TabsTrigger value="weekly">Mingguan</TabsTrigger>
            <TabsTrigger value="achievement">Pencapaian</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4 mt-4">
            {filterQuestsByType('daily').length > 0 ? (
              filterQuestsByType('daily').map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Tidak ada quest harian tersedia
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4 mt-4">
            {filterQuestsByType('weekly').length > 0 ? (
              filterQuestsByType('weekly').map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Tidak ada quest mingguan tersedia
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="achievement" className="space-y-4 mt-4">
            {filterQuestsByType('achievement').length > 0 ? (
              filterQuestsByType('achievement').map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Tidak ada pencapaian tersedia
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};