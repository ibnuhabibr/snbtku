import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Gift, 
  Sparkles, 
  Crown, 
  Medal, 
  Award,
  X,
  Coins,
  Zap
} from 'lucide-react';

interface Reward {
  id: string;
  type: 'achievement' | 'quest' | 'level_up' | 'streak' | 'special';
  title: string;
  description: string;
  xp?: number;
  coins?: number;
  items?: string[];
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon?: React.ComponentType<any>;
}

interface RewardNotificationProps {
  rewards: Reward[];
  onClose: (rewardId: string) => void;
  onClaimAll?: () => void;
}

const RewardNotification: React.FC<RewardNotificationProps> = ({ 
  rewards, 
  onClose, 
  onClaimAll 
}) => {
  const [visibleRewards, setVisibleRewards] = useState<Reward[]>([]);

  useEffect(() => {
    // Show rewards one by one with delay
    rewards.forEach((reward, index) => {
      setTimeout(() => {
        setVisibleRewards(prev => [...prev, reward]);
      }, index * 500);
    });
  }, [rewards]);

  const getRarityColor = (rarity: string = 'common') => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string = 'common') => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'uncommon': return 'border-green-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const getTypeIcon = (type: string, CustomIcon?: React.ComponentType<any>) => {
    if (CustomIcon) return CustomIcon;
    
    switch (type) {
      case 'achievement': return Trophy;
      case 'quest': return Star;
      case 'level_up': return Crown;
      case 'streak': return Medal;
      case 'special': return Award;
      default: return Gift;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-500';
      case 'quest': return 'text-blue-500';
      case 'level_up': return 'text-purple-500';
      case 'streak': return 'text-orange-500';
      case 'special': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const handleCloseReward = (rewardId: string) => {
    setVisibleRewards(prev => prev.filter(r => r.id !== rewardId));
    onClose(rewardId);
  };

  const handleClaimAll = () => {
    setVisibleRewards([]);
    if (onClaimAll) onClaimAll();
  };

  if (visibleRewards.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="max-w-md w-full max-h-[80vh] overflow-y-auto">
        <AnimatePresence>
          {visibleRewards.map((reward, index) => {
            const IconComponent = getTypeIcon(reward.type, reward.icon);
            
            return (
              <motion.div
                key={reward.id}
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: -50 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: index * 0.1
                }}
                className="mb-4"
              >
                <Card className={`relative overflow-hidden border-2 ${getRarityBorder(reward.rarity)} shadow-2xl`}>
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(reward.rarity)} opacity-10`} />
                  
                  {/* Sparkle Effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1, 0], 
                          opacity: [0, 1, 0],
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.3,
                          repeatDelay: 1
                        }}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`
                        }}
                      >
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10 h-6 w-6 p-0 hover:bg-white/20"
                    onClick={() => handleCloseReward(reward.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  <CardContent className="p-6 text-center relative z-10">
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className={`mx-auto mb-4 p-4 rounded-full bg-white shadow-lg ${getTypeColor(reward.type)}`}
                    >
                      <IconComponent className="h-8 w-8" />
                    </motion.div>
                    
                    {/* Rarity Badge */}
                    {reward.rarity && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-3"
                      >
                        <Badge 
                          className={`bg-gradient-to-r ${getRarityColor(reward.rarity)} text-white font-bold px-3 py-1`}
                        >
                          {reward.rarity.toUpperCase()}
                        </Badge>
                      </motion.div>
                    )}
                    
                    {/* Title */}
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl font-bold mb-2 text-foreground"
                    >
                      {reward.title}
                    </motion.h3>
                    
                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-muted-foreground mb-4"
                    >
                      {reward.description}
                    </motion.p>
                    
                    {/* Rewards */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-center gap-4 mb-4"
                    >
                      {reward.xp && (
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          <Star className="h-4 w-4" />
                          <span className="font-medium">+{reward.xp} XP</span>
                        </div>
                      )}
                      {reward.coins && (
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                          <div className="h-4 w-4 rounded-full bg-yellow-400" />
                          <span className="font-medium">+{reward.coins}</span>
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Items */}
                    {reward.items && reward.items.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-4"
                      >
                        <p className="text-sm text-muted-foreground mb-2">Items Unlocked:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {reward.items.map((item, itemIndex) => (
                            <Badge key={itemIndex} variant="secondary" className="text-xs">
                              <Gift className="h-3 w-3 mr-1" />
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Claim Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button
                        className={`bg-gradient-to-r ${getRarityColor(reward.rarity)} hover:opacity-90 text-white font-bold px-6 py-2`}
                        onClick={() => handleCloseReward(reward.id)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Claim Reward!
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Claim All Button */}
        {visibleRewards.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Button
              variant="outline"
              className="bg-white/90 hover:bg-white"
              onClick={handleClaimAll}
            >
              <Gift className="h-4 w-4 mr-2" />
              Claim All ({visibleRewards.length})
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RewardNotification;