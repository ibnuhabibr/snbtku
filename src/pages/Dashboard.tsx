import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress"; // Removed unused import
// import { Badge } from "@/components/ui/badge"; // Removed unused import
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Removed unused import
import { 
  BookOpen, 
  Target, 
  Trophy, 
  // Calendar, // Removed unused import
  // TrendingUp, // Removed unused import
  Flame,
  // Star, // Removed unused import
  // Clock, // Removed unused import
  Award,
  Users,
  ChevronRight,
  // Play, // Removed unused import
  BarChart3,
  Gamepad2,
  // Gift, // Removed unused import
  Lightbulb,
  Brain,
  Heart,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import GamificationSystem from "@/components/GamificationSystem";
import QuestTracker from "@/components/QuestTracker";
import { DailyCheckIn } from "@/components/gamification/DailyCheckIn";
import PWAHomeBanner from "@/components/PWAHomeBanner";
import { scrollToTop } from '@/lib/utils';

const Dashboard = () => {
  // Removed unused state variables: currentStreak, totalXP, currentLevel
  // Removed unused nextLevelXP state
  const [showGamification, setShowGamification] = useState(false);

  const todayStats = {
    questionsAnswered: 45,
    timeSpent: 120, // minutes
    accuracy: 78,
    xpEarned: 180
  };

  // Removed unused currentDay and weeklyCheckpoints

  // Removed unused handleClaimReward function

  const recentAchievements = [
    { title: "First Try Out", description: "Menyelesaikan try out pertama", icon: Target, earned: "2 hari lalu" },
    { title: "Week Warrior", description: "Belajar 7 hari berturut-turut", icon: Flame, earned: "1 minggu lalu" },
    { title: "Math Master", description: "Skor 90+ di Penalaran Matematika", icon: Award, earned: "2 minggu lalu" }
  ];

  const studyTips = [
    {
      title: "💡 Tips Belajar Efektif",
      content: "Gunakan teknik Pomodoro: belajar 25 menit, istirahat 5 menit. Ini membantu menjaga fokus dan mencegah kelelahan mental.",
      category: "tip"
    },
    {
      title: "🎯 Strategi Mengerjakan Soal",
      content: "Baca soal dengan teliti, identifikasi kata kunci, dan eliminasi jawaban yang jelas salah terlebih dahulu.",
      category: "tip"
    },
    {
      title: "🔥 Motivasi Hari Ini",
      content: "Setiap soal yang kamu kerjakan adalah satu langkah lebih dekat menuju PTN impianmu. Tetap semangat!",
      category: "motivation"
    },
    {
      title: "⭐ Mindset Juara",
      content: "Kegagalan adalah guru terbaik. Setiap kesalahan adalah kesempatan untuk belajar dan menjadi lebih baik.",
      category: "motivation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat datang kembali! 👋</h1>
          <p className="text-muted-foreground">Mari lanjutkan perjalanan belajar SNBT mu hari ini</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* PWA Install Banner */}
          <PWAHomeBanner />

          {/* Top Section - Daily Check-in System */}
          <DailyCheckIn />

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
                <Link to="/gamification" onClick={scrollToTop}>
                  <Button className="w-full justify-between bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <span className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Misi
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Third Section - Recommended Topics and Quest Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Tips & Motivation */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Tips & Motivasi Belajar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studyTips.map((tip, index) => (
                  <div key={index} className={`p-4 border rounded-lg transition-colors ${
                    tip.category === 'motivation' 
                      ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100' 
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
                  }`}>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      {tip.category === 'motivation' ? (
                        <Heart className="h-4 w-4 text-red-500" />
                      ) : (
                        <Zap className="h-4 w-4 text-blue-500" />
                      )}
                      {tip.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.content}
                    </p>
                  </div>
                ))}
                
                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-3 mt-6 pt-4 border-t">
                  <Link to="/analisis-potensi" onClick={scrollToTop}>
                    <Button className="w-full justify-center bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
                      <Brain className="h-4 w-4 mr-2" />
                      Analisis Potensi
                    </Button>
                  </Link>
                  <Link to="/materi-belajar" onClick={scrollToTop}>
                    <Button className="w-full justify-center" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Materi Belajar
                    </Button>
                  </Link>
                </div>
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