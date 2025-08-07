import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Clock, 
  BookOpen,
  TrendingUp,
  Award,
  Zap,
  Crown,
  Medal,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GameStatsProps {
  className?: string;
  showDetailed?: boolean;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface DetailedStat {
  category: string;
  stats: StatItem[];
  icon: React.ComponentType<any>;
  color: string;
}

const GameStats: React.FC<GameStatsProps> = ({ className = '', showDetailed = false }) => {
  const basicStats: StatItem[] = [
    {
      label: 'Level',
      value: 12,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+1',
      trend: 'up'
    },
    {
      label: 'Total XP',
      value: '2,450',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+180',
      trend: 'up'
    },
    {
      label: 'Streak',
      value: '7 hari',
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+1',
      trend: 'up'
    },
    {
      label: 'Coins',
      value: '1,250',
      icon: () => <div className="h-4 w-4 rounded-full bg-yellow-400" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+50',
      trend: 'up'
    }
  ];

  const detailedStats: DetailedStat[] = [
    {
      category: 'Learning Progress',
      icon: BookOpen,
      color: 'text-blue-600',
      stats: [
        {
          label: 'Questions Answered',
          value: '1,247',
          icon: Target,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          change: '+45 today',
          trend: 'up'
        },
        {
          label: 'Study Time',
          value: '42h 30m',
          icon: Clock,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          change: '+2h today',
          trend: 'up'
        },
        {
          label: 'Accuracy Rate',
          value: '78%',
          icon: TrendingUp,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          change: '+3%',
          trend: 'up'
        }
      ]
    },
    {
      category: 'Achievements',
      icon: Trophy,
      color: 'text-yellow-600',
      stats: [
        {
          label: 'Total Achievements',
          value: 23,
          icon: Award,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          change: '+2 this week',
          trend: 'up'
        },
        {
          label: 'Rare Achievements',
          value: 5,
          icon: Medal,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          change: '+1 this week',
          trend: 'up'
        },
        {
          label: 'Completion Rate',
          value: '67%',
          icon: BarChart3,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          change: '+5%',
          trend: 'up'
        }
      ]
    },
    {
      category: 'Social & Competition',
      icon: Users,
      color: 'text-pink-600',
      stats: [
        {
          label: 'Leaderboard Rank',
          value: '#15',
          icon: Trophy,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          change: '+3 positions',
          trend: 'up'
        },
        {
          label: 'Study Groups',
          value: 3,
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          change: '+1 this month',
          trend: 'up'
        },
        {
          label: 'Friends Helped',
          value: 12,
          icon: () => <div className="h-4 w-4 text-pink-600">❤️</div>,
          color: 'text-pink-600',
          bgColor: 'bg-pink-100',
          change: '+2 this week',
          trend: 'up'
        }
      ]
    },
    {
      category: 'Performance Metrics',
      icon: Zap,
      color: 'text-indigo-600',
      stats: [
        {
          label: 'Best Streak',
          value: '14 days',
          icon: Flame,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          change: 'Personal best',
          trend: 'up'
        },
        {
          label: 'Weekly Goal',
          value: '85%',
          icon: Target,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          change: '17/20 days',
          trend: 'up'
        },
        {
          label: 'Monthly Active',
          value: '28 days',
          icon: Calendar,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          change: '90% active',
          trend: 'up'
        }
      ]
    }
  ];

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!showDetailed) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Game Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {basicStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-3 rounded-lg border bg-card"
                >
                  <div className={`mx-auto mb-2 p-2 rounded-full w-fit ${stat.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {stat.change && (
                    <p className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                      {getTrendIcon(stat.trend)} {stat.change}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Level Progress */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Level 12 Progress</span>
              <span className="text-sm text-muted-foreground">2,450 / 2,800 XP</span>
            </div>
            <Progress value={87.5} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">350 XP to Level 13</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {basicStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className={`mx-auto mb-3 p-3 rounded-full w-fit ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  {stat.change && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getTrendColor(stat.trend)}`}
                    >
                      {getTrendIcon(stat.trend)} {stat.change}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detailedStats.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CategoryIcon className={`h-5 w-5 ${category.color}`} />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.stats.map((stat, statIndex) => {
                    const StatIcon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * 0.2) + (statIndex * 0.1) }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                            <StatIcon className={`h-4 w-4 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{stat.label}</p>
                            {stat.change && (
                              <p className={`text-xs ${getTrendColor(stat.trend)}`}>
                                {stat.change}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{stat.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GameStats;