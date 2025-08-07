import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Calendar,
  TrendingUp,
  Flame,
  Star,
  Clock,
  Award,
  Users,
  ChevronRight,
  Play,
  BarChart3,
  Gamepad2,
  Gift
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import GamificationSystem from "@/components/GamificationSystem";
import QuestTracker from "@/components/QuestTracker";
import { scrollToTop } from '@/lib/utils';

const Dashboard = () => {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalXP, setTotalXP] = useState(2450);
  const [currentLevel, setCurrentLevel] = useState(12);
  const [nextLevelXP, setNextLevelXP] = useState(2800);
  const [showGamification, setShowGamification] = useState(false);

  const todayStats = {
    questionsAnswered: 45,
    timeSpent: 120, // minutes
    accuracy: 78,
    xpEarned: 180
  };

  // Daily checkpoint system - simulating user's current day
  const currentDay = 3; // User is on day 3
  const weeklyCheckpoints = [
    { day: 1, unlocked: true, claimed: true, coins: 100 },
    { day: 2, unlocked: true, claimed: true, coins: 150 },
    { day: 3, unlocked: true, claimed: false, coins: 200 },
    { day: 4, unlocked: false, claimed: false, coins: 250 },
    { day: 5, unlocked: false, claimed: false, coins: 300 },
    { day: 6, unlocked: false, claimed: false, coins: 350 },
    { day: 7, unlocked: false, claimed: false, coins: 500 },
  ];

  const handleClaimReward = (day: number) => {
    // Handle claim logic here
    console.log(`Claimed reward for day ${day}`);
  };

  const recentAchievements = [
    { title: "First Try Out", description: "Menyelesaikan try out pertama", icon: Target, earned: "2 hari lalu" },
    { title: "Week Warrior", description: "Belajar 7 hari berturut-turut", icon: Flame, earned: "1 minggu lalu" },
    { title: "Math Master", description: "Skor 90+ di Penalaran Matematika", icon: Award, earned: "2 minggu lalu" }
  ];

  const recommendedTopics = [
    { title: "Penalaran Matematika - Fungsi", progress: 60, difficulty: "Menengah", estimatedTime: "30 menit" },
    { title: "Literasi Bahasa Indonesia - Teks Argumentasi", progress: 30, difficulty: "Mudah", estimatedTime: "25 menit" },
    { title: "Penalaran Umum - Logika", progress: 0, difficulty: "Sulit", estimatedTime: "45 menit" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat datang kembali! 👋</h1>
          <p className="text-muted-foreground">Mari lanjutkan perjalanan belajar SNBT mu hari ini</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Top Section - Daily Checkpoint System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Checkpoint Harian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                {weeklyCheckpoints.map((checkpoint, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-200 ${
                      checkpoint.day === currentDay
                        ? checkpoint.claimed
                          ? 'bg-green-500 text-white border-green-500 ring-2 ring-green-200'
                          : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white border-blue-500 ring-2 ring-blue-200 shadow-lg'
                        : checkpoint.claimed 
                        ? 'bg-green-500 text-white border-green-500' 
                        : checkpoint.unlocked 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted text-muted-foreground border-muted'
                    }`}>
                      {checkpoint.claimed ? '✓' : checkpoint.day}
                    </div>
                    <span className={`text-xs font-medium ${
                      checkpoint.day === currentDay ? 'text-blue-600' : 'text-muted-foreground'
                    }`}>Hari {checkpoint.day}</span>
                    <div className="flex flex-col items-center min-h-[60px] justify-between">
                      <span className="text-xs font-medium text-yellow-600">{checkpoint.coins} 🪙</span>
                      {checkpoint.unlocked && !checkpoint.claimed && (
                        <Button 
                          size="sm" 
                          className={`mt-1 h-6 px-2 text-xs ${
                            checkpoint.day === currentDay 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                              : ''
                          }`}
                          onClick={() => handleClaimReward(checkpoint.day)}
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="px-3 py-1">
                  🔥 Hari ke-{currentDay} dari siklus mingguan
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Second Section - Stats, Achievements, Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Soal Dikerjakan</span>
                  <span className="font-medium">{todayStats.questionsAnswered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Waktu Belajar</span>
                  <span className="font-medium">{Math.floor(todayStats.timeSpent / 60)}j {todayStats.timeSpent % 60}m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Akurasi</span>
                  <span className="font-medium">{todayStats.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">XP Earned</span>
                  <span className="font-medium text-primary">+{todayStats.xpEarned}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Pencapaian Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <achievement.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.earned}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/analisis-potensi" onClick={scrollToTop}>
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analisis Potensi
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/practice" onClick={scrollToTop}>
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Latihan Soal
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/tryout" onClick={scrollToTop}>
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Try Out
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/leaderboard" onClick={scrollToTop}>
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Leaderboard
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  className="w-full justify-between bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" 
                  onClick={() => setShowGamification(true)}
                >
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Misi
                  </span>
                  <Gift className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Third Section - Recommended Topics and Quest Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Topics */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Rekomendasi Belajar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{topic.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {topic.estimatedTime}
                        </span>
                        <Badge variant={topic.difficulty === 'Mudah' ? 'secondary' : topic.difficulty === 'Menengah' ? 'default' : 'destructive'} className="text-xs">
                          {topic.difficulty}
                        </Badge>
                      </div>
                      {topic.progress > 0 && (
                        <Progress value={topic.progress} className="mt-2 h-2" />
                      )}
                    </div>
                    <Button size="sm" className="ml-4">
                      <Play className="h-4 w-4 mr-1" />
                      Mulai
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quest Tracker */}
            <div>
              <QuestTracker maxQuests={3} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gamification System Modal */}
      <GamificationSystem 
        isOpen={showGamification} 
        onClose={() => setShowGamification(false)} 
      />
    </div>
  );
};

export default Dashboard;