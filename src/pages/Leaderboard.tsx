import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, 
  Medal,
  Crown,
  Star,
  TrendingUp,
  Users,
  Target,
  Flame,
  Award,
  Calendar,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [selectedCategory, setSelectedCategory] = useState("overall");
  const [activeTab, setActiveTab] = useState("leaderboard");

  const currentUser = {
    id: "current",
    name: "Kamu",
    avatar: "/api/placeholder/40/40",
    rank: 156,
    xp: 2450,
    level: 12,
    streak: 7,
    badges: 8,
    tryOutScore: 485
  };

  const topUsers = [
    {
      id: 1,
      name: "Ahmad Rizki",
      avatar: "/api/placeholder/40/40",
      rank: 1,
      xp: 8750,
      level: 28,
      streak: 45,
      badges: 24,
      tryOutScore: 720,
      change: "up",
      location: "Jakarta"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      avatar: "/api/placeholder/40/40",
      rank: 2,
      xp: 8420,
      level: 27,
      streak: 38,
      badges: 22,
      tryOutScore: 695,
      change: "same",
      location: "Bandung"
    },
    {
      id: 3,
      name: "Budi Santoso",
      avatar: "/api/placeholder/40/40",
      rank: 3,
      xp: 7890,
      level: 25,
      streak: 32,
      badges: 20,
      tryOutScore: 680,
      change: "down",
      location: "Surabaya"
    }
  ];

  const leaderboardData = [
    ...topUsers,
    {
      id: 4,
      name: "Dewi Lestari",
      avatar: "/api/placeholder/40/40",
      rank: 4,
      xp: 7650,
      level: 24,
      streak: 28,
      badges: 19,
      tryOutScore: 665,
      change: "up",
      location: "Yogyakarta"
    },
    {
      id: 5,
      name: "Andi Pratama",
      avatar: "/api/placeholder/40/40",
      rank: 5,
      xp: 7320,
      level: 23,
      streak: 25,
      badges: 18,
      tryOutScore: 650,
      change: "up",
      location: "Medan"
    },
    {
      id: 6,
      name: "Maya Sari",
      avatar: "/api/placeholder/40/40",
      rank: 6,
      xp: 6980,
      level: 22,
      streak: 22,
      badges: 17,
      tryOutScore: 635,
      change: "down",
      location: "Makassar"
    },
    {
      id: 7,
      name: "Rudi Hermawan",
      avatar: "/api/placeholder/40/40",
      rank: 7,
      xp: 6750,
      level: 21,
      streak: 20,
      badges: 16,
      tryOutScore: 620,
      change: "same",
      location: "Palembang"
    },
    {
      id: 8,
      name: "Lina Marlina",
      avatar: "/api/placeholder/40/40",
      rank: 8,
      xp: 6450,
      level: 20,
      streak: 18,
      badges: 15,
      tryOutScore: 605,
      change: "up",
      location: "Semarang"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Menyelesaikan 10 soal pertama",
      icon: Target,
      rarity: "common",
      unlockedBy: 15420,
      totalUsers: 25000
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Belajar 7 hari berturut-turut",
      icon: Flame,
      rarity: "uncommon",
      unlockedBy: 8750,
      totalUsers: 25000
    },
    {
      id: 3,
      title: "Try Out Master",
      description: "Skor 700+ di try out",
      icon: Trophy,
      rarity: "rare",
      unlockedBy: 1250,
      totalUsers: 25000
    },
    {
      id: 4,
      title: "Speed Demon",
      description: "Menyelesaikan 50 soal dalam 1 hari",
      icon: Star,
      rarity: "epic",
      unlockedBy: 420,
      totalUsers: 25000
    },
    {
      id: 5,
      title: "Legend",
      description: "Mencapai level 30",
      icon: Crown,
      rarity: "legendary",
      unlockedBy: 85,
      totalUsers: 25000
    }
  ];

  const weeklyStats = {
    totalUsers: 25000,
    activeUsers: 18750,
    newUsers: 1250,
    averageXP: 2150
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800";
      case "uncommon":
        return "bg-green-100 text-green-800";
      case "rare":
        return "bg-blue-100 text-blue-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      case "legendary":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard 🏆</h1>
          <p className="text-muted-foreground">Kompetisi sehat dengan sesama pejuang SNBT di seluruh Indonesia</p>
        </div>

        {/* Current User Stats */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{currentUser.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Ranking #{currentUser.rank}</span>
                    <span>Level {currentUser.level}</span>
                    <span>{currentUser.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-500">{currentUser.streak}</div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-500">{currentUser.badges}</div>
                    <div className="text-xs text-muted-foreground">Badges</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">{currentUser.tryOutScore}</div>
                    <div className="text-xs text-muted-foreground">Best Score</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="mt-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Periode:</label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Harian</SelectItem>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                        <SelectItem value="alltime">Sepanjang Masa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Kategori:</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overall">Keseluruhan</SelectItem>
                        <SelectItem value="xp">Total XP</SelectItem>
                        <SelectItem value="tryout">Try Out Score</SelectItem>
                        <SelectItem value="streak">Streak Terpanjang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top 3 Podium */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center">🏆 Top 3 Champions 🏆</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-end gap-8">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-20 w-20 mx-auto border-4 border-gray-300">
                        <AvatarImage src={topUsers[1].avatar} />
                        <AvatarFallback>{topUsers[1].name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        <Medal className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="font-bold">{topUsers[1].name}</h3>
                    <p className="text-sm text-muted-foreground">{topUsers[1].location}</p>
                    <p className="text-lg font-bold text-primary">{topUsers[1].xp.toLocaleString()} XP</p>
                    <div className="bg-gray-100 h-24 w-24 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                      <span className="text-2xl font-bold text-gray-600">2</span>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-400">
                        <AvatarImage src={topUsers[0].avatar} />
                        <AvatarFallback>{topUsers[0].name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        <Crown className="h-10 w-10 text-yellow-500" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">{topUsers[0].name}</h3>
                    <p className="text-sm text-muted-foreground">{topUsers[0].location}</p>
                    <p className="text-xl font-bold text-yellow-600">{topUsers[0].xp.toLocaleString()} XP</p>
                    <div className="bg-yellow-100 h-32 w-24 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                      <span className="text-3xl font-bold text-yellow-600">1</span>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-20 w-20 mx-auto border-4 border-amber-600">
                        <AvatarImage src={topUsers[2].avatar} />
                        <AvatarFallback>{topUsers[2].name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        <Medal className="h-8 w-8 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="font-bold">{topUsers[2].name}</h3>
                    <p className="text-sm text-muted-foreground">{topUsers[2].location}</p>
                    <p className="text-lg font-bold text-primary">{topUsers[2].xp.toLocaleString()} XP</p>
                    <div className="bg-amber-100 h-20 w-24 mx-auto mt-4 rounded-t-lg flex items-end justify-center pb-2">
                      <span className="text-2xl font-bold text-amber-600">3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard Lengkap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.map((user, index) => (
                    <div key={user.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                      index < 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5' : 'hover:bg-muted/50'
                    } transition-colors`}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 flex justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{user.xp.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">XP</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Lv.{user.level}</div>
                          <div className="text-xs text-muted-foreground">Level</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{user.streak}</div>
                          <div className="text-xs text-muted-foreground">Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{user.tryOutScore}</div>
                          <div className="text-xs text-muted-foreground">Best Score</div>
                        </div>
                        <div className="w-6">
                          {getChangeIcon(user.change)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            {/* Achievement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{weeklyStats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{weeklyStats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{weeklyStats.newUsers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">New This Week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{weeklyStats.averageXP.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Avg XP</div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements List */}
            <Card>
              <CardHeader>
                <CardTitle>Semua Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <achievement.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="text-xs text-muted-foreground">
                          {achievement.unlockedBy.toLocaleString()} dari {achievement.totalUsers.toLocaleString()} users ({Math.round((achievement.unlockedBy / achievement.totalUsers) * 100)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;