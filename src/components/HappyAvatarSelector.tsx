import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HappyAvatar {
  id: string;
  name: string;
  url: string;
  category: 'cute' | 'superhero' | 'animal' | 'fantasy' | 'profession';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('cute');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || '');

  // Happy and cute avatar collection
  const happyAvatars: HappyAvatar[] = [
    // Cute Characters
    {
      id: '1',
      name: '😊 Happy Student',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HappyStudent&mood=happy&eyes=happy&mouth=smile',
      category: 'cute',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '2',
      name: '😄 Cheerful Learner',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CheerfulLearner&mood=happy&eyes=wink&mouth=smile',
      category: 'cute',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '3',
      name: '🤗 Friendly Helper',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FriendlyHelper&mood=happy&eyes=happy&mouth=smile',
      category: 'cute',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '4',
      name: '😍 Study Buddy',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudyBuddy&mood=happy&eyes=hearts&mouth=smile',
      category: 'cute',
      rarity: 'rare',
      unlocked: true
    },
    {
      id: '5',
      name: '🥰 Sweet Scholar',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SweetScholar&mood=happy&eyes=happy&mouth=smile',
      category: 'cute',
      rarity: 'rare',
      unlocked: true
    },
    
    // Animal Characters
    {
      id: '6',
      name: '🐱 Happy Kitty',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HappyKitty&mood=happy&eyes=happy&mouth=smile&accessoriesChance=80',
      category: 'animal',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '7',
      name: '🐼 Smiling Panda',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SmilingPanda&mood=happy&eyes=happy&mouth=smile',
      category: 'animal',
      rarity: 'common',
      unlocked: true
    },
    {
      id: '8',
      name: '🦊 Clever Fox',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CleverFox&mood=happy&eyes=wink&mouth=smile',
      category: 'animal',
      rarity: 'rare',
      unlocked: true
    },
    {
      id: '9',
      name: '🐨 Cuddly Koala',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CuddlyKoala&mood=happy&eyes=happy&mouth=smile',
      category: 'animal',
      rarity: 'rare',
      unlocked: true
    },
    {
      id: '10',
      name: '🦄 Magic Unicorn',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MagicUnicorn&mood=happy&eyes=happy&mouth=smile&accessoriesChance=100',
      category: 'animal',
      rarity: 'epic',
      unlocked: true
    },
    
    // Superhero Characters
    {
      id: '11',
      name: '🦸‍♂️ Happy Hero',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HappyHero&mood=happy&eyes=happy&mouth=smile&accessoriesChance=90',
      category: 'superhero',
      rarity: 'epic',
      unlocked: true
    },
    {
      id: '12',
      name: '⚡ Thunder Smile',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThunderSmile&mood=happy&eyes=happy&mouth=smile',
      category: 'superhero',
      rarity: 'epic',
      unlocked: true
    },
    {
      id: '13',
      name: '🔥 Fire Guardian',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FireGuardian&mood=happy&eyes=happy&mouth=smile',
      category: 'superhero',
      rarity: 'legendary',
      unlocked: true
    },
    
    // Fantasy Characters
    {
      id: '14',
      name: '🧙‍♂️ Wise Wizard',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WiseWizard&mood=happy&eyes=happy&mouth=smile&accessoriesChance=100',
      category: 'fantasy',
      rarity: 'epic',
      unlocked: true
    },
    {
      id: '15',
      name: '🧚‍♀️ Happy Fairy',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HappyFairy&mood=happy&eyes=happy&mouth=smile',
      category: 'fantasy',
      rarity: 'rare',
      unlocked: true
    },
    {
      id: '16',
      name: '👑 Royal Scholar',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RoyalScholar&mood=happy&eyes=happy&mouth=smile&accessoriesChance=100',
      category: 'fantasy',
      rarity: 'legendary',
      unlocked: true
    },
    
    // Profession Characters
    {
      id: '17',
      name: '👨‍🎓 Graduate',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Graduate&mood=happy&eyes=happy&mouth=smile&accessoriesChance=100',
      category: 'profession',
      rarity: 'rare',
      unlocked: true
    },
    {
      id: '18',
      name: '👩‍🔬 Scientist',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scientist&mood=happy&eyes=happy&mouth=smile',
      category: 'profession',
      rarity: 'rare',
      unlocked: true
    },
    {
      id: '19',
      name: '🚀 Astronaut',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Astronaut&mood=happy&eyes=happy&mouth=smile&accessoriesChance=100',
      category: 'profession',
      rarity: 'epic',
      unlocked: true
    },
    {
      id: '20',
      name: '🎨 Artist',
      url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist&mood=happy&eyes=happy&mouth=smile',
      category: 'profession',
      rarity: 'common',
      unlocked: true
    }
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

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'cute': return '😊 Cute';
      case 'animal': return '🐾 Animals';
      case 'superhero': return '🦸 Heroes';
      case 'fantasy': return '✨ Fantasy';
      case 'profession': return '👔 Professions';
      default: return category;
    }
  };

  const filteredAvatars = happyAvatars.filter(avatar => avatar.category === selectedCategory);

  const handleSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
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
          <TabsList className="grid w-full grid-cols-5">
            {['cute', 'animal', 'superhero', 'fantasy', 'profession'].map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {getCategoryDisplayName(category)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {['cute', 'animal', 'superhero', 'fantasy', 'profession'].map((category) => (
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
                      onClick={() => handleSelect(avatar.url)}
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
    </Dialog>
  );
};

export default HappyAvatarSelector;