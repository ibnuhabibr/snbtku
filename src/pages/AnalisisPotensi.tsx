import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Star,
  Users,
  ArrowRight,
  FileText,
  Lightbulb,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Zap
} from 'lucide-react';
import Navigation from '@/components/Navigation';

// Sample data untuk analisis potensi
const analysisData = {
  overallScore: 485,
  totalTryouts: 12,
  improvement: 15.2,
  rank: 1247,
  totalUsers: 15420,
  lastUpdate: '2 jam yang lalu',
  subtestScores: [
    { name: 'Penalaran Umum', score: 520, trend: 'up', improvement: 12 },
    { name: 'Pengetahuan Umum', score: 465, trend: 'up', improvement: 8 },
    { name: 'Pemahaman Bacaan', score: 490, trend: 'stable', improvement: 2 },
    { name: 'Pengetahuan Kuantitatif', score: 445, trend: 'down', improvement: -5 },
    { name: 'Literasi Indonesia', score: 510, trend: 'up', improvement: 18 },
    { name: 'Literasi Inggris', score: 420, trend: 'up', improvement: 25 },
    { name: 'Penalaran Matematika', score: 395, trend: 'up', improvement: 10 }
  ],
  tryoutProgress: [
    { tryoutName: 'Try Out #1', score: 420, date: '15 Des 2024' },
    { tryoutName: 'Try Out #3', score: 435, date: '18 Des 2024' },
    { tryoutName: 'Try Out #5', score: 450, date: '22 Des 2024' },
    { tryoutName: 'Try Out #7', score: 465, date: '25 Des 2024' },
    { tryoutName: 'Try Out #9', score: 485, date: '28 Des 2024' },
    { tryoutName: 'Try Out #12', score: 495, date: '2 Jan 2025' },
    { tryoutName: 'Try Out #15', score: 485, date: '5 Jan 2025' }
  ],
  strengths: [
    { area: 'Penalaran Umum', reason: 'Konsisten menunjukkan peningkatan dalam logika deduktif' },
    { area: 'Literasi Indonesia', reason: 'Pemahaman tata bahasa dan kosakata sangat baik' }
  ],
  improvements: [
    { area: 'Pengetahuan Kuantitatif', reason: 'Perlu fokus pada konsep matematika dasar dan operasi hitung', priority: 'Tinggi' },
    { area: 'Literasi Inggris', reason: 'Grammar dan vocabulary masih perlu diperkuat', priority: 'Sedang' },
    { area: 'Penalaran Matematika', reason: 'Logika matematika kompleks perlu latihan lebih intensif', priority: 'Sedang' }
  ],
  tips: [
    'Fokus latihan soal Pengetahuan Kuantitatif 30 menit setiap hari',
    'Baca artikel bahasa Inggris minimal 2 artikel per hari',
    'Latihan soal penalaran matematika dengan timer untuk meningkatkan kecepatan',
    'Pertahankan konsistensi latihan di area yang sudah kuat'
  ]
};

const AnalisisPotensi: React.FC = () => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Sedang':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analisis Potensi SNBT
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Analisis komprehensif potensi Anda berdasarkan data real-time dari tryout dan latihan yang telah dikerjakan.
          </p>
          <p className="text-sm text-muted-foreground">
            Terakhir diperbarui: {analysisData.lastUpdate}
          </p>
        </div>

        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{analysisData.overallScore}</h3>
              <p className="text-muted-foreground">Skor Rata-rata</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">+{analysisData.improvement}%</h3>
              <p className="text-muted-foreground">Peningkatan</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">#{analysisData.rank}</h3>
              <p className="text-muted-foreground">Peringkat</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{analysisData.totalTryouts}</h3>
              <p className="text-muted-foreground">Tryout Selesai</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Grafik Perkembangan Nilai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {analysisData.tryoutProgress.map((tryout, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 mb-1">{tryout.score}</div>
                    <div className="text-xs font-medium text-gray-700 mb-1">{tryout.tryoutName}</div>
                    <div className="text-xs text-gray-500">{tryout.date}</div>
                    <div className="mt-2">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300" 
                          style={{width: `${(tryout.score / 800) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 font-medium">Perkembangan Keseluruhan:</span>
                  <span className="text-blue-900 font-bold">
                    {analysisData.tryoutProgress.length > 1 && 
                      `+${analysisData.tryoutProgress[analysisData.tryoutProgress.length - 1].score - analysisData.tryoutProgress[0].score} poin dari tryout pertama`
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subtest Performance */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Analisis Per Subtes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.subtestScores.map((subtest, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(subtest.trend)}
                    <div>
                      <div className="font-medium">{subtest.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {subtest.improvement > 0 ? '+' : ''}{subtest.improvement}% dari tryout sebelumnya
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{subtest.score}</div>
                    <Progress value={(subtest.score / 800) * 100} className="w-24 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Star className="h-6 w-6" />
                Kekuatan Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.strengths.map((strength, index) => (
                  <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-800 mb-2">{strength.area}</div>
                    <div className="text-sm text-green-700">{strength.reason}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-6 w-6" />
                Area yang Perlu Diperbaiki
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.improvements.map((improvement, index) => (
                  <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-orange-800">{improvement.area}</div>
                      <Badge className={getPriorityColor(improvement.priority)}>
                        {improvement.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-orange-700">{improvement.reason}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Tips Personal untuk Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">{tip}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalisisPotensi;