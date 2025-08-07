import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { scrollToTop } from '@/lib/utils';
import { 
  BookOpen, 
  Brain, 
  Calculator, 
  FileText, 
  Globe, 
  Languages, 
  PenTool,
  Play,
  Clock,
  Target,
  Star,
  CheckCircle,
  Lock,
  Trophy,
  Award,
  ChevronRight,
  ArrowRight,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  status: 'available' | 'current' | 'completed';
  xpReward: number;
  prerequisites?: string[];
}

const StudyJourney = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const learningPaths: LearningPath[] = [
    {
      id: 'penalaran-umum',
      title: 'PU',
      description: 'Kemampuan berpikir logis dan analitis dalam memecahkan masalah',
      icon: <Brain className="h-8 w-8" />,
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      progress: 85,
      totalLessons: 12,
      completedLessons: 10,
      estimatedTime: '6 jam',
      difficulty: 'Sedang',
      status: 'completed',
      xpReward: 1200
    },
    {
      id: 'pengetahuan-pemahaman-umum',
      title: 'PPU',
      description: 'Wawasan umum tentang berbagai bidang pengetahuan',
      icon: <Globe className="h-8 w-8" />,
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100',
      progress: 60,
      totalLessons: 15,
      completedLessons: 9,
      estimatedTime: '8 jam',
      difficulty: 'Mudah',
      status: 'current',
      xpReward: 1500
    },
    {
      id: 'bacaan-menulis',
      title: 'PBM',
      description: 'Kemampuan memahami teks dan mengekspresikan ide dalam tulisan',
      icon: <FileText className="h-8 w-8" />,
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      progress: 30,
      totalLessons: 10,
      completedLessons: 3,
      estimatedTime: '5 jam',
      difficulty: 'Sedang',
      status: 'available',
      xpReward: 1000
    },
    {
      id: 'pengetahuan-kuantitatif',
      title: 'PK',
      description: 'Kemampuan menggunakan angka dan konsep matematika dasar',
      icon: <Calculator className="h-8 w-8" />,
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      progress: 0,
      totalLessons: 14,
      completedLessons: 0,
      estimatedTime: '7 jam',
      difficulty: 'Sulit',
      status: 'available',
      xpReward: 1400
    },
    {
      id: 'literasi-indonesia',
      title: 'LBI',
      description: 'Kemampuan berbahasa Indonesia yang baik dan benar',
      icon: <Languages className="h-8 w-8" />,
      color: 'text-red-600',
      bgGradient: 'from-red-50 to-red-100',
      progress: 0,
      totalLessons: 11,
      completedLessons: 0,
      estimatedTime: '6 jam',
      difficulty: 'Sedang',
      status: 'available',
      xpReward: 1100
    },
    {
      id: 'literasi-inggris',
      title: 'LBE',
      description: 'Kemampuan memahami dan menggunakan bahasa Inggris',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      progress: 0,
      totalLessons: 13,
      completedLessons: 0,
      estimatedTime: '7 jam',
      difficulty: 'Sulit',
      status: 'available',
      xpReward: 1300
    },
    {
      id: 'penalaran-matematika',
      title: 'PM',
      description: 'Kemampuan bernalar menggunakan konsep dan prosedur matematika',
      icon: <PenTool className="h-8 w-8" />,
      color: 'text-teal-600',
      bgGradient: 'from-teal-50 to-teal-100',
      progress: 0,
      totalLessons: 16,
      completedLessons: 0,
      estimatedTime: '8 jam',
      difficulty: 'Sulit',
      status: 'available',
      xpReward: 1600
    }
  ];

  const handlePathClick = (pathId: string) => {
    setSelectedPath(pathId);
  };

  const closePopup = () => {
    setSelectedPath(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800';
      case 'Sedang': return 'bg-yellow-100 text-yellow-800';
      case 'Sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'current': return 'Sedang Berjalan';
      case 'available': return 'Tersedia';
      default: return 'Terkunci';
    }
  };

  const totalXP = learningPaths.reduce((sum, path) => {
    return sum + (path.status === 'completed' ? path.xpReward : 0);
  }, 0);

  const totalProgress = Math.round(
    learningPaths.reduce((sum, path) => sum + path.progress, 0) / learningPaths.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Study Journey SNBT
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Ikuti perjalanan belajar yang terstruktur untuk menguasai semua materi SNBT. 
            Setiap jalur pembelajaran dirancang untuk membangun kemampuan Anda secara bertahap.
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="h-12 w-12 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalXP}</h3>
                <p className="text-muted-foreground">Total XP</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Target className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalProgress}%</h3>
                <p className="text-muted-foreground">Progress Keseluruhan</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">52</h3>
                <p className="text-muted-foreground">Jam Pembelajaran</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Learning Paths - Horizontal Scroll */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Jalur Pembelajaran</h2>
            <Badge variant="outline" className="px-3 py-1">
              {learningPaths.length} Jalur Tersedia
            </Badge>
          </div>
          
          {/* Desktop View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-6 min-w-max">
                {learningPaths.map((path, index) => {
                  const IconComponent = () => path.icon;
                  return (
                    <Card 
                      key={path.id}
                      className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 bg-gradient-to-br ${path.bgGradient} min-w-[320px] max-w-[320px]`}
                      onMouseEnter={() => setHoveredCard(path.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handlePathClick(path.id)}
                    >
                      <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className={`p-4 rounded-xl bg-white shadow-sm ${path.color}`}>
                            <IconComponent />
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {path.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {path.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{path.progress}%</span>
                            </div>
                            <Progress value={path.progress} className="h-2" />
                          </div>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-lg font-bold text-gray-900">{path.completedLessons}</p>
                              <p className="text-xs text-muted-foreground">Selesai</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">{path.totalLessons}</p>
                              <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">{path.estimatedTime}</p>
                              <p className="text-xs text-muted-foreground">Durasi</p>
                            </div>
                          </div>
                          
                          {/* Status and Difficulty */}
                          <div className="flex justify-between items-center">
                            <Badge 
                              variant="outline" 
                              className={getDifficultyColor(path.difficulty)}
                            >
                              {path.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {path.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {path.status === 'current' && <Play className="h-4 w-4 text-blue-600" />}
                              {path.status === 'available' && <Target className="h-4 w-4 text-gray-600" />}
                              <span className="text-sm font-medium">{getStatusText(path.status)}</span>
                            </div>
                          </div>
                          
                          {/* XP Reward */}
                          <div className="flex items-center justify-center space-x-2 p-2 bg-white/50 rounded-lg">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">{path.xpReward} XP</span>
                          </div>
                          
                          {/* Action Button */}
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            variant={hoveredCard === path.id ? "default" : "outline"}
                            onClick={() => handlePathClick(path.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Mulai
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Mobile View */}
          <div className="lg:hidden">
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
                {learningPaths.map((path) => {
                  const IconComponent = () => path.icon;
                  return (
                    <Card 
                      key={path.id}
                      className={`group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br ${path.bgGradient} min-w-[280px] max-w-[280px]`}
                      onClick={() => handlePathClick(path.id)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-3">
                          <div className={`p-3 rounded-xl bg-white shadow-sm ${path.color}`}>
                            <IconComponent />
                          </div>
                        </div>
                        <CardTitle className="text-lg mb-2">
                          {path.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{path.progress}%</span>
                            </div>
                            <Progress value={path.progress} className="h-2" />
                          </div>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{path.completedLessons}</p>
                              <p className="text-xs text-muted-foreground">Selesai</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{path.totalLessons}</p>
                              <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{path.estimatedTime}</p>
                              <p className="text-xs text-muted-foreground">Durasi</p>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => handlePathClick(path.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Mulai
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/practice" onClick={scrollToTop}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Practice Zone
                </h3>
                <p className="text-muted-foreground mb-4">
                  Latihan soal per subtest dengan berbagai tingkat kesulitan
                </p>
                <Button variant="outline" className="w-full">
                  Mulai Latihan
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/tryout" onClick={scrollToTop}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Try Out SNBT
                </h3>
                <p className="text-muted-foreground mb-4">
                  Simulasi ujian lengkap dengan sistem penilaian yang akurat
                </p>
                <Button variant="outline" className="w-full">
                  Ikuti Try Out
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/analisis-potensi" onClick={scrollToTop}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Analisis Potensi
                </h3>
                <p className="text-muted-foreground mb-4">
                  Evaluasi kemampuan awal untuk rekomendasi belajar yang tepat
                </p>
                <Button variant="outline" className="w-full">
                  Mulai Tes
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      
      {/* Popup Widget */}
      {selectedPath && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Pilih Jenis Pembelajaran
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closePopup}
                  className="p-1 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Pilih cara belajar yang ingin Anda lakukan untuk subtes ini:
              </p>
              
              <div className="space-y-3">
                <Link 
                  to={`/materi-belajar/${selectedPath}`} 
                  className="w-full"
                  onClick={() => { closePopup(); scrollToTop(); }}
                >
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Materi Belajar</div>
                      <div className="text-sm text-gray-500">Pelajari konsep dan teori</div>
                    </div>
                  </Button>
                </Link>
                
                <Link 
                  to={`/practice/${selectedPath}`} 
                  className="w-full"
                  onClick={() => { closePopup(); scrollToTop(); }}
                >
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Latihan Soal</div>
                      <div className="text-sm text-gray-500">Berlatih dengan soal-soal</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyJourney;