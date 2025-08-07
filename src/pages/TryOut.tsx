import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Clock, 
  Users,
  Trophy,
  Play,
  BarChart3,
  Calendar,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Timer
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from '@/components/Navigation';

const TryOut = () => {
  const [activeTab, setActiveTab] = useState("available");

  const tryOutStats = {
    totalTryOuts: 45,
    completed: 12,
    averageScore: 742,
    bestScore: 865,
    rank: 156
  };

  const availableTryOuts = [
    {
      id: 1,
      title: "SNBT Simulasi #15",
      duration: 195, // minutes
      participants: 2847,
      difficulty: "Realistis",
      status: "available",
      startTime: "Kapan saja",
      subtests: [
        { name: "Penalaran Umum", duration: 30, questions: 30 },
        { name: "Pengetahuan Umum", duration: 20, questions: 20 },
        { name: "Pemahaman Bacaan", duration: 20, questions: 20 },
        { name: "Pengetahuan Kuantitatif", duration: 20, questions: 20 },
        { name: "Literasi B. Indonesia", duration: 35, questions: 30 },
        { name: "Literasi B. Inggris", duration: 25, questions: 20 },
        { name: "Penalaran Matematika", duration: 25, questions: 20 }
      ]
    },
    {
      id: 2,
      title: "SNBT Challenge - Minggu Ini",
      duration: 195,
      participants: 1523,
      difficulty: "Menantang",
      status: "scheduled",
      startTime: "Sabtu, 14:00 WIB",
      subtests: [
        { name: "Penalaran Umum", duration: 30, questions: 30 },
        { name: "Pengetahuan Umum", duration: 20, questions: 20 },
        { name: "Pemahaman Bacaan", duration: 20, questions: 20 },
        { name: "Pengetahuan Kuantitatif", duration: 20, questions: 20 },
        { name: "Literasi B. Indonesia", duration: 35, questions: 30 },
        { name: "Literasi B. Inggris", duration: 25, questions: 20 },
        { name: "Penalaran Matematika", duration: 25, questions: 20 }
      ]
    },
    {
      id: 3,
      title: "SNBT Sprint - Full Test",
      duration: 195,
      participants: 892,
      difficulty: "Menengah",
      status: "available",
      startTime: "Kapan saja",
      subtests: [
        { name: "Penalaran Umum", duration: 30, questions: 30 },
        { name: "Pengetahuan Umum", duration: 20, questions: 20 },
        { name: "Pemahaman Bacaan", duration: 20, questions: 20 },
        { name: "Pengetahuan Kuantitatif", duration: 20, questions: 20 },
        { name: "Literasi B. Indonesia", duration: 35, questions: 30 },
        { name: "Literasi B. Inggris", duration: 25, questions: 20 },
        { name: "Penalaran Matematika", duration: 25, questions: 20 }
      ]
    },
    {
      id: 4,
      title: "SNBT Marathon - Full Test",
      duration: 195,
      participants: 4521,
      difficulty: "Sulit",
      status: "available",
      startTime: "Kapan saja",
      subtests: [
        { name: "Penalaran Umum", duration: 30, questions: 30 },
        { name: "Pengetahuan Umum", duration: 20, questions: 20 },
        { name: "Pemahaman Bacaan", duration: 20, questions: 20 },
        { name: "Pengetahuan Kuantitatif", duration: 20, questions: 20 },
        { name: "Literasi B. Indonesia", duration: 35, questions: 30 },
        { name: "Literasi B. Inggris", duration: 25, questions: 20 },
        { name: "Penalaran Matematika", duration: 25, questions: 20 }
      ]
    }
  ];

  const completedTryOuts = [
    {
      id: 1,
      title: "SNBT Simulasi #14",
      completedDate: "3 hari lalu",
      score: 742,
      maxScore: 1000,
      rank: 245,
      totalParticipants: 3421,
      percentile: 92,
      subtestScores: [
        { name: "Penalaran Umum", score: 780, maxScore: 1000, percentage: 78 },
        { name: "Pengetahuan Umum", score: 720, maxScore: 1000, percentage: 72 },
        { name: "Pemahaman Bacaan", score: 650, maxScore: 1000, percentage: 65 },
        { name: "Pengetahuan Kuantitatif", score: 750, maxScore: 1000, percentage: 75 },
        { name: "Literasi B. Indonesia", score: 800, maxScore: 1000, percentage: 80 },
        { name: "Literasi B. Inggris", score: 700, maxScore: 1000, percentage: 70 },
        { name: "Penalaran Matematika", score: 690, maxScore: 1000, percentage: 69 }
      ]
    },
    {
      id: 2,
      title: "SNBT Challenge - Minggu Lalu",
      completedDate: "1 minggu lalu",
      score: 685,
      maxScore: 1000,
      rank: 412,
      totalParticipants: 2876,
      percentile: 85,
      subtestScores: [
        { name: "Penalaran Umum", score: 720, maxScore: 1000, percentage: 72 },
        { name: "Pengetahuan Umum", score: 650, maxScore: 1000, percentage: 65 },
        { name: "Pemahaman Bacaan", score: 600, maxScore: 1000, percentage: 60 },
        { name: "Pengetahuan Kuantitatif", score: 700, maxScore: 1000, percentage: 70 },
        { name: "Literasi B. Indonesia", score: 750, maxScore: 1000, percentage: 75 },
        { name: "Literasi B. Inggris", score: 650, maxScore: 1000, percentage: 65 },
        { name: "Penalaran Matematika", score: 725, maxScore: 1000, percentage: 73 }
      ]
    },
    {
      id: 3,
      title: "SNBT Sprint - Full Test",
      completedDate: "2 minggu lalu",
      score: 658,
      maxScore: 1000,
      rank: 156,
      totalParticipants: 1245,
      percentile: 87,
      subtestScores: [
        { name: "Penalaran Umum", score: 680, maxScore: 1000, percentage: 68 },
        { name: "Pengetahuan Umum", score: 700, maxScore: 1000, percentage: 70 },
        { name: "Pemahaman Bacaan", score: 650, maxScore: 1000, percentage: 65 },
        { name: "Pengetahuan Kuantitatif", score: 700, maxScore: 1000, percentage: 70 },
        { name: "Literasi B. Indonesia", score: 720, maxScore: 1000, percentage: 72 },
        { name: "Literasi B. Inggris", score: 650, maxScore: 1000, percentage: 65 },
        { name: "Penalaran Matematika", score: 506, maxScore: 1000, percentage: 51 }
      ]
    }
  ];

  const upcomingScheduled = [
    {
      id: 1,
      title: "SNBT National Championship",
      date: "Minggu, 15 Des 2024",
      time: "09:00 WIB",
      participants: 12547,
      prize: "Sertifikat + Merchandise",
      status: "registered"
    },
    {
      id: 2,
      title: "SNBT Weekly Challenge #52",
      date: "Sabtu, 21 Des 2024",
      time: "14:00 WIB",
      participants: 3421,
      prize: "Badge Eksklusif",
      status: "open"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "mudah":
      case "menengah":
        return "bg-green-100 text-green-800";
      case "menantang":
      case "realistis":
        return "bg-yellow-100 text-yellow-800";
      case "sulit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Try Out SNBT 🎯</h1>
          <p className="text-muted-foreground">Simulasi ujian SNBT yang realistis dengan sistem penilaian berbasis IRT</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{tryOutStats.totalTryOuts}</div>
              <div className="text-sm text-muted-foreground">Total Try Out</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{tryOutStats.completed}</div>
              <div className="text-sm text-muted-foreground">Selesai</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{tryOutStats.averageScore}</div>
              <div className="text-sm text-muted-foreground">Rata-rata Skor</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{tryOutStats.bestScore}</div>
              <div className="text-sm text-muted-foreground">Skor Terbaik</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">#{tryOutStats.rank}</div>
              <div className="text-sm text-muted-foreground">Ranking</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Try Out Tersedia</TabsTrigger>
            <TabsTrigger value="completed">Riwayat</TabsTrigger>
            <TabsTrigger value="scheduled">Terjadwal</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableTryOuts.map((tryOut) => (
                <Card key={tryOut.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{tryOut.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getDifficultyColor(tryOut.difficulty)}>
                            {tryOut.difficulty}
                          </Badge>

                          {tryOut.status === 'scheduled' && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Terjadwal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Try Out Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{tryOut.duration} menit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{tryOut.participants.toLocaleString()} peserta</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{tryOut.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>{tryOut.subtests.reduce((acc, sub) => acc + sub.questions, 0)} soal</span>
                        </div>
                      </div>

                      {/* Subtests */}
                      <div>
                        <h4 className="font-medium mb-2">Subtest:</h4>
                        <div className="space-y-2">
                          {tryOut.subtests.map((subtest, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                              <span className="font-medium">{subtest.name}</span>
                              <div className="flex items-center gap-4 text-muted-foreground">
                                <span>{subtest.questions} soal</span>
                                <span>{subtest.duration} menit</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full" 
                        disabled={tryOut.status === 'scheduled'}
                        variant="default"
                      >
                        {tryOut.status === 'scheduled' ? (
                          <>
                            <Timer className="h-4 w-4 mr-2" />
                            Menunggu Jadwal
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Mulai Try Out
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-6">
              {completedTryOuts.map((tryOut) => (
                <Card key={tryOut.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{tryOut.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tryOut.completedDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{tryOut.score}</div>
                        <div className="text-sm text-muted-foreground">dari {tryOut.maxScore}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Overall Stats */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Statistik Keseluruhan</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Ranking</span>
                            <span className="font-medium">#{tryOut.rank} dari {tryOut.totalParticipants.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Persentil</span>
                            <span className="font-medium">{tryOut.percentile}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Skor Total</span>
                            <span className={`font-medium ${getScoreColor((tryOut.score / tryOut.maxScore) * 100)}`}>
                              {Math.round((tryOut.score / tryOut.maxScore) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subtest Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Breakdown per Subtest</h4>
                        <div className="space-y-3">
                          {tryOut.subtestScores.map((subtest, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{subtest.name}</span>
                                <span className={getScoreColor(subtest.percentage)}>
                                  {subtest.score}/{subtest.maxScore} ({subtest.percentage}%)
                                </span>
                              </div>
                              <Progress value={subtest.percentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Lihat Analisis
                      </Button>
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        Ulangi Try Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {upcomingScheduled.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {event.date} • {event.time}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                            <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">{event.participants.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Peserta Terdaftar</p>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                            <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                            <p className="text-sm font-medium">{event.prize}</p>
                            <p className="text-xs text-muted-foreground">Hadiah</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        <Badge 
                          variant={event.status === 'registered' ? 'default' : 'secondary'}
                          className="px-3 py-1"
                        >
                          {event.status === 'registered' ? 'Terdaftar' : 'Buka'}
                        </Badge>
                        {event.status === 'registered' ? (
                          <Button variant="outline" className="min-w-[120px]">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Terdaftar
                          </Button>
                        ) : (
                          <Button className="min-w-[120px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            Daftar Sekarang
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TryOut;