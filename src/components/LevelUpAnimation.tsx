import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Star, 
  Sparkles, 
  Trophy, 
  Zap,
  Gift,
  ArrowUp,
  X
} from 'lucide-react';

interface LevelUpData {
  oldLevel: number;
  newLevel: number;
  xpGained: number;
  totalXP: number;
  nextLevelXP: number;
  rewards?: {
    coins: number;
    items?: string[];
    unlocks?: string[];
  };
}

interface LevelUpAnimationProps {
  isVisible: boolean;
  levelData: LevelUpData;
  onClose: () => void;
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ 
  isVisible, 
  levelData, 
  onClose 
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase(0);
      setShowRewards(false);
      
      // Animation sequence
      const timeouts = [
        setTimeout(() => setAnimationPhase(1), 500),   // Show level up
        setTimeout(() => setAnimationPhase(2), 1500),  // Show XP animation
        setTimeout(() => setAnimationPhase(3), 2500),  // Show rewards
        setTimeout(() => setShowRewards(true), 3000),  // Enable rewards interaction
      ];
      
      return () => timeouts.forEach(clearTimeout);
    }
    return undefined;
  }, [isVisible]);

  if (!isVisible) return null;

  const progressPercentage = (levelData.totalXP / levelData.nextLevelXP) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.1,
                repeatDelay: 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              <Star className="h-3 w-3 text-yellow-400" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative max-w-md w-full"
        >
          <Card className="relative overflow-hidden border-2 border-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 h-6 w-6 p-0 hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Animated Crown */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <motion.div
                initial={{ y: -50, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-yellow-400 p-3 rounded-full shadow-lg"
              >
                <Crown className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            <CardContent className="p-8 pt-12 text-center">
              {/* Level Up Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: animationPhase >= 1 ? 1 : 0, y: animationPhase >= 1 ? 0 : 30 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold text-yellow-600 mb-2">
                  LEVEL UP!
                </h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: animationPhase >= 1 ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-4xl font-bold text-gray-600"
                  >
                    {levelData.oldLevel}
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: animationPhase >= 1 ? 0 : -20, opacity: animationPhase >= 1 ? 1 : 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <ArrowUp className="h-6 w-6 text-green-500" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: animationPhase >= 1 ? 1 : 0, 
                      rotate: animationPhase >= 1 ? 0 : -180 
                    }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className="text-4xl font-bold text-yellow-600 relative"
                  >
                    {levelData.newLevel}
                    {/* Sparkle effect around new level */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: animationPhase >= 1 ? [0, 1.5, 0] : 0 }}
                      transition={{ delay: 1.2, duration: 1 }}
                      className="absolute -inset-2"
                    >
                      <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2" />
                      <Sparkles className="h-6 w-6 text-yellow-400 absolute -bottom-1 -left-1" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* XP Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animationPhase >= 2 ? 1 : 0, y: animationPhase >= 2 ? 0 : 20 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span className="text-lg font-semibold text-blue-600">
                    +{levelData.xpGained} XP
                  </span>
                </div>
                
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress to Level {levelData.newLevel + 1}</span>
                    <span>{levelData.totalXP} / {levelData.nextLevelXP} XP</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: animationPhase >= 2 ? `${progressPercentage}%` : 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <Progress value={progressPercentage} className="h-3" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Rewards Section */}
              {levelData.rewards && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationPhase >= 3 ? 1 : 0, y: animationPhase >= 3 ? 0 : 20 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
                    <Gift className="h-5 w-5 text-purple-500" />
                    Level Rewards
                  </h3>
                  
                  <div className="bg-white/50 rounded-lg p-4 space-y-3">
                    {/* Coins */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: showRewards ? 0 : -20, opacity: showRewards ? 1 : 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full"
                    >
                      <div className="h-5 w-5 rounded-full bg-yellow-400" />
                      <span className="font-medium">+{levelData.rewards.coins} Coins</span>
                    </motion.div>
                    
                    {/* Items */}
                    {levelData.rewards.items && levelData.rewards.items.length > 0 && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: showRewards ? 0 : -20, opacity: showRewards ? 1 : 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <p className="text-sm text-gray-600">New Items Unlocked:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {levelData.rewards.items.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: showRewards ? 1 : 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {item}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Unlocks */}
                    {levelData.rewards.unlocks && levelData.rewards.unlocks.length > 0 && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: showRewards ? 0 : -20, opacity: showRewards ? 1 : 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-2"
                      >
                        <p className="text-sm text-gray-600">Features Unlocked:</p>
                        <div className="space-y-1">
                          {levelData.rewards.unlocks.map((unlock, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: showRewards ? 0 : -20, opacity: showRewards ? 1 : 0 }}
                              transition={{ delay: 1 + index * 0.1 }}
                              className="flex items-center gap-2 text-sm text-green-600"
                            >
                              <Trophy className="h-4 w-4" />
                              {unlock}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: showRewards ? 1 : 0, scale: showRewards ? 1 : 0.8 }}
                transition={{ delay: 1.5 }}
              >
                <Button
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-3 text-lg"
                  onClick={onClose}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Awesome!
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LevelUpAnimation;