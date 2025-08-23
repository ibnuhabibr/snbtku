import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Heart, Star, Sparkles, Lock, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';


interface HappyAvatar {
  id: string;
  name: string;
  url: string;
  category: 'free' | 'purchased';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  cost?: number;
}

interface HappyAvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

const HappyAvatarSelector: React.FC<HappyAvatarSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentAvatar
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('free');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || '');
  const [showLockedDialog, setShowLockedDialog] = useState(false);


  // Avatar collection
  const happyAvatars: HappyAvatar[] = [
    // Free Avatars
    {
      id: '1',
      name: '😊 Sunshine Student',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunshineStudent&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=724133&clothingColor=3c4f5c',
      category: 'free',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '2',
      name: '😄 Joyful Genius',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JoyfulGenius&mood=happy&eyes=wink&mouth=smile&skinColor=f8d25c&hairColor=2c1b18&clothingColor=65c9ff',
      category: 'free',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '3',
      name: '🤗 Bright Buddy',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BrightBuddy&mood=happy&eyes=happy&mouth=smile&skinColor=edb98a&hairColor=auburn&clothingColor=ff5c5c',
      category: 'free',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '4',
      name: '😍 Cheerful Champion',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CheerfulChampion&mood=happy&eyes=hearts&mouth=smile&skinColor=ae5d29&hairColor=blonde&clothingColor=25557c',
      category: 'free',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '5',
      name: '🥰 Sweet Smarty',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SweetSmarty&mood=happy&eyes=happy&mouth=smile&skinColor=fd9841&hairColor=brown&clothingColor=ff488e',
      category: 'free',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '6',
      name: '🌟 Radiant Reader',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RadiantReader&mood=happy&eyes=happy&mouth=smile&skinColor=ffdbac&hairColor=red&clothingColor=7bc142',
      category: 'free',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '7',
      name: '✨ Sparkle Scholar',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SparkleScholar&mood=happy&eyes=wink&mouth=smile&skinColor=d08b5b&hairColor=black&clothingColor=ff8cc8',
      category: 'free',
      rarity: 'common',
      unlocked: true
    },
    
    // Purchased Avatars - Karakter Terkenal
    {
      id: '50',
      name: '🕷️ Spiderman',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spiderman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=red&clothingColor=ff0000&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 800
    },
    {
      id: '51',
      name: '🦇 Batman',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Batman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=000000&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 850
    },
    {
      id: '52',
      name: '🦸‍♂️ Superman',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Superman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=0066cc&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 900
    },
    {
      id: '53',
      name: '🤖 Iron Man',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IronMan&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=brown&clothingColor=cc0000&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 950
    },
    {
      id: '54',
      name: '👸 Wonder Woman',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WonderWoman&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=cc0000&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 800
    },
    {
      id: '55',
      name: '🛡️ Captain America',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CaptainAmerica&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=blonde&clothingColor=0066cc&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 850
    },
    {
      id: '56',
      name: '⚡ Thor',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thor&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=blonde&clothingColor=cc0000&accessoriesChance=100',
      category: 'purchased',
      rarity: 'legendary',
      unlocked: false,
      cost: 1000
    },
    {
      id: '57',
      name: '💚 Hulk',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hulk&mood=happy&eyes=happy&mouth=smile&skinColor=00cc00&hairColor=black&clothingColor=663399&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 900
    },
    {
      id: '58',
      name: '🐾 Black Panther',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BlackPanther&mood=happy&eyes=happy&mouth=smile&skinColor=ae5d29&hairColor=black&clothingColor=000000&accessoriesChance=100',
      category: 'purchased',
      rarity: 'epic',
      unlocked: false,
      cost: 950
    },
    {
      id: '59',
      name: '🔮 Doctor Strange',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DoctorStrange&mood=happy&eyes=happy&mouth=smile&skinColor=fdbcb4&hairColor=black&clothingColor=663399&accessoriesChance=100',
      category: 'purchased',
      rarity: 'legendary',
      unlocked: false,
      cost: 1200
    },
    

  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Smile className="h-3 w-3" />;
      case 'rare': return <Heart className="h-3 w-3" />;
      case 'epic': return <Star className="h-3 w-3" />;
      case 'legendary': return <Sparkles className="h-3 w-3" />;
      default: return <Smile className="h-3 w-3" />;
    }
  };



  const filteredAvatars = happyAvatars.filter(avatar => avatar.category === selectedCategory);

  const handleSelect = (avatar: HappyAvatar) => {
    if (!avatar.unlocked && avatar.category === 'purchased') {
      // Show locked dialog for premium avatars
      setShowLockedDialog(true);
      return;
    }
    setSelectedAvatar(avatar.url);
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-yellow-500" />
            Pilih Avatar
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2">
            {['free', 'purchased'].map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category === 'free' ? '🆓 Gratis' : '💎 Premium'}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {['free', 'purchased'].map((category) => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-96">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4">
                  {filteredAvatars.map((avatar) => (
                    <motion.div
                      key={avatar.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedAvatar === avatar.url 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2'
                      }`}
                      onClick={() => handleSelect(avatar)}
                    >
                      <div className="text-center space-y-2">
                        <div className="relative">
                          <Avatar className="w-16 h-16 mx-auto border-2 border-gray-200">
                            <AvatarImage 
                              src={avatar.url} 
                              alt={avatar.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-orange-100">
                              😊
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Rarity Badge */}
                          <div className="absolute -top-1 -right-1">
                            <Badge 
                              variant="secondary" 
                              className={`${getRarityColor(avatar.rarity)} text-xs px-1 py-0 h-5 flex items-center gap-1`}
                            >
                              {getRarityIcon(avatar.rarity)}
                            </Badge>
                          </div>
                          
                          {/* Locked Overlay for Premium Avatars */}
                          {!avatar.unlocked && avatar.category === 'purchased' && (
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                              <Lock className="h-4 w-4 text-white" />
                            </div>
                          )}
                          
                          {/* Selection Indicator */}
                          {selectedAvatar === avatar.url && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center"
                            >
                              <div className="bg-primary text-white rounded-full p-1">
                                <Smile className="h-3 w-3" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-center truncate px-1">
                            {avatar.name}
                          </p>
                          {!avatar.unlocked && avatar.cost && (
                            <p className="text-xs text-yellow-600 font-medium">
                              {avatar.cost} coins
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedAvatar ? 'Avatar dipilih!' : 'Pilih avatar yang kamu suka'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedAvatar}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
            >
              <Smile className="h-4 w-4 mr-2" />
              Pilih Avatar
            </Button>
          </div>
        </div>
      </DialogContent>
      
      {/* Locked Avatar Dialog */}
      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-yellow-500" />
              Avatar Terkunci
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="mb-4">
              <ShoppingBag className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-medium mb-2">Avatar Premium</p>
              <p className="text-muted-foreground">
                Avatar ini adalah avatar premium yang perlu dibeli terlebih dahulu.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setShowLockedDialog(false)}>
                Tutup
              </Button>
              <Button 
                onClick={() => {
                  setShowLockedDialog(false);
                  onClose();
                  // Navigate to shop - you might want to use router here
                  window.location.href = '/toko';
                }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Silakan Beli di Toko
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default HappyAvatarSelector;