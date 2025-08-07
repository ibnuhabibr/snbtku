import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Coins, 
  Star, 
  Crown, 
  Zap,
  Gift,
  Sparkles,
  Heart,
  Trophy,
  Shield,
  Flame,
  Target,
  Award,
  Gem,
  Bolt,
  Clock,
  Rocket,
  Diamond,
  Sword
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

const Shop = () => {
  const [userCoins, setUserCoins] = useState(1250);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const shopItems = {
    avatars: [
      {
        id: 'avatar-1',
        name: 'Happy Scholar',
        description: 'Avatar ceria untuk pelajar rajin',
        price: 500,
        image: '😊',
        rarity: 'common'
      },
      {
        id: 'avatar-2',
        name: 'Genius Master',
        description: 'Avatar eksklusif untuk jenius',
        price: 1500,
        image: '🤓',
        rarity: 'rare'
      },
      {
        id: 'avatar-3',
        name: 'Champion Elite',
        description: 'Avatar legendaris juara',
        price: 5000,
        image: '👑',
        rarity: 'legendary'
      },
      {
        id: 'avatar-4',
        name: 'Cool Student',
        description: 'Avatar keren untuk siswa modern',
        price: 750,
        image: '😎',
        rarity: 'common'
      },
      {
        id: 'avatar-5',
        name: 'Rocket Scientist',
        description: 'Avatar untuk calon ilmuwan',
        price: 2000,
        image: '🚀',
        rarity: 'rare'
      },
      {
        id: 'avatar-6',
        name: 'Brain Master',
        description: 'Avatar untuk master otak',
        price: 3000,
        image: '🧠',
        rarity: 'rare'
      },
      {
        id: 'avatar-7',
        name: 'Fire Scholar',
        description: 'Avatar berapi-api untuk pelajar bersemangat',
        price: 4000,
        image: '🔥',
        rarity: 'rare'
      },
      {
        id: 'avatar-8',
        name: 'Lightning Fast',
        description: 'Avatar kilat untuk yang cepat belajar',
        price: 6000,
        image: '⚡',
        rarity: 'legendary'
      },
      {
        id: 'avatar-9',
        name: 'Diamond Mind',
        description: 'Avatar berlian untuk pikiran cemerlang',
        price: 15000,
        image: '💎',
        rarity: 'legendary'
      },
      {
        id: 'avatar-10',
        name: 'Ultimate Scholar',
        description: 'Avatar tertinggi untuk scholar sejati',
        price: 50000,
        image: '🏆',
        rarity: 'legendary'
      }
    ],
    powerups: [
      {
        id: 'powerup-1',
        name: 'Double XP',
        description: 'Gandakan XP selama 1 jam',
        price: 800,
        icon: Zap,
        duration: '1 jam',
        rarity: 'common'
      },
      {
        id: 'powerup-2',
        name: 'Streak Shield',
        description: 'Lindungi streak dari putus 1x',
        price: 1200,
        icon: Shield,
        duration: 'Sekali pakai',
        rarity: 'common'
      },
      {
        id: 'powerup-3',
        name: 'Time Freeze',
        description: 'Tambah waktu 30 menit di try out',
        price: 2500,
        icon: Clock,
        duration: 'Sekali pakai',
        rarity: 'rare'
      },
      {
        id: 'powerup-4',
        name: 'Triple XP',
        description: 'Gandakan XP 3x selama 30 menit',
        price: 1500,
        icon: Bolt,
        duration: '30 menit',
        rarity: 'rare'
      },
      {
        id: 'powerup-5',
        name: 'Focus Boost',
        description: 'Tingkatkan akurasi jawaban 20%',
        price: 2000,
        icon: Target,
        duration: '1 sesi',
        rarity: 'rare'
      },
      {
        id: 'powerup-6',
        name: 'Mega Shield',
        description: 'Lindungi streak dari putus 3x',
        price: 3500,
        icon: Heart,
        duration: '3x pakai',
        rarity: 'rare'
      },
      {
        id: 'powerup-7',
        name: 'Rocket Boost',
        description: 'Selesaikan soal 50% lebih cepat',
        price: 4500,
        icon: Rocket,
        duration: '1 try out',
        rarity: 'legendary'
      },
      {
        id: 'powerup-8',
        name: 'Perfect Score',
        description: 'Jaminan skor 100% untuk 1 quiz',
        price: 8000,
        icon: Star,
        duration: 'Sekali pakai',
        rarity: 'legendary'
      },
      {
        id: 'powerup-9',
        name: 'Ultimate Boost',
        description: 'Kombinasi semua boost selama 1 hari',
        price: 25000,
        icon: Gem,
        duration: '24 jam',
        rarity: 'legendary'
      },
      {
        id: 'powerup-10',
        name: 'God Mode',
        description: 'Unlimited power untuk 1 minggu',
        price: 100000,
        icon: Crown,
        duration: '7 hari',
        rarity: 'legendary'
      }
    ],

    badges: [
      {
        id: 'badge-1',
        name: 'Study Master',
        description: 'Badge untuk pelajar rajin',
        price: 1000,
        icon: Trophy,
        rarity: 'common'
      },
      {
        id: 'badge-2',
        name: 'Quiz Champion',
        description: 'Badge juara kuis',
        price: 2000,
        icon: Crown,
        rarity: 'rare'
      },
      {
        id: 'badge-3',
        name: 'Legend Scholar',
        description: 'Badge legendaris untuk scholar sejati',
        price: 5000,
        icon: Sparkles,
        rarity: 'legendary'
      },
      {
        id: 'badge-4',
        name: 'Speed Demon',
        description: 'Badge untuk yang cepat menyelesaikan soal',
        price: 1500,
        icon: Bolt,
        rarity: 'common'
      },
      {
        id: 'badge-5',
        name: 'Streak Warrior',
        description: 'Badge untuk master streak',
        price: 2500,
        icon: Flame,
        rarity: 'rare'
      },
      {
        id: 'badge-6',
        name: 'Perfect Scorer',
        description: 'Badge untuk yang sering dapat nilai sempurna',
        price: 3000,
        icon: Star,
        rarity: 'rare'
      },
      {
        id: 'badge-7',
        name: 'Knowledge Hunter',
        description: 'Badge untuk pemburu ilmu',
        price: 3500,
        icon: Target,
        rarity: 'rare'
      },
      {
        id: 'badge-8',
        name: 'Elite Scholar',
        description: 'Badge untuk scholar elite',
        price: 7500,
        icon: Award,
        rarity: 'legendary'
      },
      {
        id: 'badge-9',
        name: 'Diamond Achiever',
        description: 'Badge berlian untuk pencapaian tertinggi',
        price: 15000,
        icon: Diamond,
        rarity: 'legendary'
      },
      {
        id: 'badge-10',
        name: 'Ultimate Master',
        description: 'Badge tertinggi untuk master sejati',
        price: 50000,
        icon: Sword,
        rarity: 'legendary'
      }
    ]
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'legendary': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePurchase = (itemId: string, price: number) => {
    if (userCoins >= price && !purchasedItems.includes(itemId)) {
      setUserCoins(prev => prev - price);
      setPurchasedItems(prev => [...prev, itemId]);
    }
  };

  const renderShopSection = (items: any[], type: string) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = userCoins >= item.price;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                isPurchased ? 'bg-green-50 border-green-200' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className={getRarityColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                    {isPurchased && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ Owned
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-center mb-4">
                    {type === 'avatars' && (
                      <div className="text-4xl mb-2">{item.image}</div>
                    )}
                    {type === 'powerups' && (
                      <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-2">
                        <item.icon className="h-8 w-8 text-blue-500" />
                      </div>
                    )}

                    {type === 'badges' && (
                      <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-2">
                        <item.icon className="h-8 w-8 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-center">{item.name}</h3>
                  <p className="text-muted-foreground text-sm text-center mb-4">{item.description}</p>
                  
                  {item.duration && (
                    <p className="text-xs text-center text-blue-600 mb-4">Durasi: {item.duration}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-yellow-600">{item.price}</span>
                    </div>
                    
                    <Button 
                      size="sm"
                      disabled={isPurchased || !canAfford}
                      onClick={() => handlePurchase(item.id, item.price)}
                      className={isPurchased ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {isPurchased ? 'Owned' : canAfford ? 'Buy' : 'Not enough coins'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <ShoppingBag className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Toko Rewards
            </h1>
          </motion.div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coins className="h-6 w-6 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600">{userCoins.toLocaleString()}</span>
            <span className="text-muted-foreground">Coins</span>
          </div>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tukarkan coins yang kamu kumpulkan dengan berbagai item menarik untuk mempersonalisasi pengalaman belajarmu!
          </p>
        </div>

        {/* Shop Tabs */}
        <Tabs defaultValue="avatars" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="avatars" className="flex items-center gap-2">
              <span>😊</span> Avatars
            </TabsTrigger>
            <TabsTrigger value="powerups" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Power-ups
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avatars" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Avatar Collection</h2>
              <p className="text-muted-foreground">Pilih avatar yang mencerminkan kepribadianmu</p>
            </div>
            {renderShopSection(shopItems.avatars, 'avatars')}
          </TabsContent>

          <TabsContent value="powerups" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Power-ups</h2>
              <p className="text-muted-foreground">Tingkatkan performa belajarmu dengan power-ups</p>
            </div>
            {renderShopSection(shopItems.powerups, 'powerups')}
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Achievement Badges</h2>
              <p className="text-muted-foreground">Koleksi badge untuk menunjukkan pencapaianmu</p>
            </div>
            {renderShopSection(shopItems.badges, 'badges')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;