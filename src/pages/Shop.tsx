import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingBag, 
  Coins, 
  Star, 
  Crown, 
  Zap,
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
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';

const Shop = () => {
  const { user, updateUserStats } = useAuthStore();
  const { toast } = useToast();
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  
  const userCoins = user?.coins || 0;

  // Fetch shop items and user inventory
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch shop items from API
        try {
          const itemsResponse = await api.get('/shop/items');
          setShopItems(itemsResponse.data.items || []);
          
          const inventoryResponse = await api.get('/shop/inventory');
          setPurchasedItems(inventoryResponse.data.purchasedItems || []);
        } catch (apiError) {
          console.log('API not available, using mock shop data');
          // Fallback to mock data
          setShopItems(getMockShopItems());
          setPurchasedItems([]);
        }
        
      } catch (error) {
        console.error('Error fetching shop data:', error);
        // Fallback to mock data
        setShopItems(getMockShopItems());
        setPurchasedItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && shopItems.length === 0) {
      fetchShopData();
    }
  }, [user, shopItems.length]);

  const getMockShopItems = () => [
    // Avatars - Premium (sinkronisasi dengan HappyAvatarSelector)
    { 
      id: '50', 
      name: '🕷️ Spiderman', 
      category: 'avatar', 
      price: 800, 
      rarity: 'epic', 
      description: 'Avatar Spiderman dengan kostum merah-biru ikonik',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spiderman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=red&clothingColor=ff0000&accessoriesChance=100'
    },
    { 
      id: '51', 
      name: '🦇 Batman', 
      category: 'avatar', 
      price: 850, 
      rarity: 'epic', 
      description: 'Avatar Batman dengan jubah hitam legendaris',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Batman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=000000&accessoriesChance=100'
    },
    { 
      id: '52', 
      name: '🦸‍♂️ Superman', 
      category: 'avatar', 
      price: 900, 
      rarity: 'epic', 
      description: 'Avatar Superman dengan logo S di dada',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Superman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=0066cc&accessoriesChance=100'
    },
    { 
      id: '53', 
      name: '🤖 Iron Man', 
      category: 'avatar', 
      price: 950, 
      rarity: 'epic', 
      description: 'Avatar Iron Man dengan armor teknologi tinggi',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IronMan&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=brown&clothingColor=cc0000&accessoriesChance=100'
    },
    { 
      id: '54', 
      name: '👸 Wonder Woman', 
      category: 'avatar', 
      price: 800, 
      rarity: 'epic', 
      description: 'Avatar Wonder Woman dengan tiara emas',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WonderWoman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=cc0000&accessoriesChance=100'
    },
    { 
      id: '55', 
      name: '🛡️ Captain America', 
      category: 'avatar', 
      price: 850, 
      rarity: 'epic', 
      description: 'Avatar Captain America dengan perisai vibranium',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CaptainAmerica&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=blonde&clothingColor=0066cc&accessoriesChance=100'
    },
    { 
      id: '56', 
      name: '⚡ Thor', 
      category: 'avatar', 
      price: 1000, 
      rarity: 'legendary', 
      description: 'Avatar Thor dengan palu Mjolnir',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thor&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=blonde&clothingColor=cc0000&accessoriesChance=100'
    },
    { 
      id: '57', 
      name: '💚 Hulk', 
      category: 'avatar', 
      price: 900, 
      rarity: 'epic', 
      description: 'Avatar Hulk dengan kekuatan super',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hulk&mood=happy&eyes=happy&mouth=smile&skinColor=00cc00&hairColor=black&clothingColor=663399&accessoriesChance=100'
    },
    { 
      id: '58', 
      name: '🐾 Black Panther', 
      category: 'avatar', 
      price: 950, 
      rarity: 'epic', 
      description: 'Avatar Black Panther dari Wakanda',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BlackPanther&mood=happy&eyes=happy&mouth=smile&skinColor=ae5d29&hairColor=black&clothingColor=000000&accessoriesChance=100'
    },
    { 
      id: '59', 
      name: '🔮 Doctor Strange', 
      category: 'avatar', 
      price: 1200, 
      rarity: 'legendary', 
      description: 'Avatar Doctor Strange dengan mantel levitasi',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DoctorStrange&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=663399&accessoriesChance=100'
    },
    
    // Power-ups
    { id: '11', name: 'Double XP', category: 'powerup', price: 50, rarity: 'common', description: 'Gandakan XP selama 1 jam' },
    { id: '12', name: 'Coin Booster', category: 'powerup', price: 75, rarity: 'common', description: 'Tambahan 50% koin selama 2 jam' },
    { id: '13', name: 'Time Freeze', category: 'powerup', price: 100, rarity: 'rare', description: 'Bekukan waktu quiz selama 30 detik' },
    { id: '14', name: 'Hint Master', category: 'powerup', price: 80, rarity: 'common', description: '3 hint gratis untuk quiz' },
    { id: '15', name: 'Lucky Charm', category: 'powerup', price: 150, rarity: 'rare', description: 'Peluang jawaban benar +20%' },
    { id: '16', name: 'Energy Drink', category: 'powerup', price: 60, rarity: 'common', description: 'Pulihkan semua energi' },
    { id: '17', name: 'Mega Boost', category: 'powerup', price: 200, rarity: 'legendary', description: 'Triple XP dan koin selama 1 jam' },
    { id: '18', name: 'Shield Protection', category: 'powerup', price: 120, rarity: 'rare', description: 'Lindungi streak dari 1 kesalahan' },
    { id: '19', name: 'Speed Boost', category: 'powerup', price: 90, rarity: 'common', description: 'Kecepatan berpikir +30%' },
    { id: '20', name: 'Focus Potion', category: 'powerup', price: 110, rarity: 'rare', description: 'Konsentrasi maksimal selama 2 jam' },
    
    // Badges
    { id: '21', name: 'Badge Pemula', category: 'badge', price: 25, rarity: 'common', description: 'Badge untuk pemula yang bersemangat' },
    { id: '22', name: 'Badge Matematika', category: 'badge', price: 150, rarity: 'rare', description: 'Badge master matematika' },
    { id: '23', name: 'Badge Bahasa', category: 'badge', price: 150, rarity: 'rare', description: 'Badge ahli bahasa Indonesia' },
    { id: '24', name: 'Badge Sains', category: 'badge', price: 150, rarity: 'rare', description: 'Badge ilmuwan muda' },
    { id: '25', name: 'Badge Logika', category: 'badge', price: 200, rarity: 'rare', description: 'Badge master logika' },
    { id: '26', name: 'Badge Champion', category: 'badge', price: 500, rarity: 'legendary', description: 'Badge juara sejati' },
    { id: '27', name: 'Badge Genius', category: 'badge', price: 750, rarity: 'legendary', description: 'Badge untuk jenius' },
    { id: '28', name: 'Badge Warrior', category: 'badge', price: 300, rarity: 'rare', description: 'Badge pejuang tangguh' },
    { id: '29', name: 'Badge Scholar', category: 'badge', price: 400, rarity: 'rare', description: 'Badge cendekiawan' },
    { id: '30', name: 'Badge Legend', category: 'badge', price: 1000, rarity: 'legendary', description: 'Badge legenda yang langka' }
  ];
  
  // Group items by category with useMemo to prevent unnecessary re-renders
  const groupedItems = useMemo(() => ({
    avatars: shopItems.filter(item => item.category === 'avatar'),
    powerups: shopItems.filter(item => item.category === 'powerup'),
    badges: shopItems.filter(item => item.category === 'badge')
  }), [shopItems]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'legendary': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePurchase = async (itemId: string, price: number) => {
    if (purchasing || userCoins < price || purchasedItems.includes(itemId)) {
      return;
    }
    
    if (userCoins < price) {
      toast({
        title: 'Koin Tidak Cukup',
        description: `Anda membutuhkan ${price - userCoins} koin lagi untuk membeli item ini.`,
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setPurchasing(itemId);
      
      try {
        const response = await api.post(`/shop/purchase/${itemId}`);
        
        if (response.data.success) {
          // Update local state
          setPurchasedItems(prev => [...prev, itemId]);
          
          // Update user coins in auth store
          updateUserStats({
            coins: response.data.newCoins
          });
          
          toast({
            title: 'Pembelian Berhasil!',
            description: `Anda telah berhasil membeli ${response.data.item.name}`,
          });
        }
      } catch (apiError) {
        console.log('API not available, simulating purchase');
        // Simulate purchase delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const item = shopItems.find(item => item.id === itemId);
        
        // Update local state
        setPurchasedItems(prev => [...prev, itemId]);
        
        // Update user coins in auth store
        updateUserStats({
          coins: userCoins - price
        });
        
        toast({
          title: 'Pembelian Berhasil!',
          description: `Anda telah berhasil membeli ${item?.name || 'item'}`,
        });
      }
    } catch (error: any) {
      console.error('Error purchasing item:', error);
      toast({
        title: 'Pembelian Gagal',
        description: 'Gagal membeli item. Silakan coba lagi.',
        variant: 'destructive'
      });
    } finally {
      setPurchasing(null);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Zap, Shield, Clock, Bolt, Target, Heart, Rocket, Star, Gem, Crown,
      Trophy, Sparkles, Flame, Award, Diamond, Sword
    };
    return iconMap[iconName] || Trophy;
  };

  const renderShopSection = (items: any[], type: string) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = userCoins >= item.price;
          const isPurchasing = purchasing === item.id;
          
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
                    {(type === 'powerups' || type === 'badges') && (
                      <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-2">
                        {React.createElement(getIconComponent(item.icon), {
                          className: `h-8 w-8 ${type === 'powerups' ? 'text-blue-500' : 'text-yellow-500'}`
                        })}
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
                      disabled={isPurchased || !canAfford || isPurchasing}
                      onClick={() => handlePurchase(item.id, item.price)}
                      className={isPurchased ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {isPurchasing ? 'Buying...' : isPurchased ? 'Owned' : canAfford ? 'Buy' : 'Not enough coins'}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 no-blink">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center gap-3 mb-4 will-change-transform"
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
            {renderShopSection(groupedItems.avatars, 'avatars')}
          </TabsContent>

          <TabsContent value="powerups" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Power-ups</h2>
              <p className="text-muted-foreground">Tingkatkan performa belajarmu dengan power-ups</p>
            </div>
            {renderShopSection(groupedItems.powerups, 'powerups')}
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Achievement Badges</h2>
              <p className="text-muted-foreground">Koleksi badge untuk menunjukkan pencapaianmu</p>
            </div>
            {renderShopSection(groupedItems.badges, 'badges')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;