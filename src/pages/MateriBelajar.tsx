import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Calculator, 
  Globe, 
  Languages, 
  PenTool,
  Target,
  Clock,
  Users,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Download,
  Eye,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MaterialSection {
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
  topics: string[];
}

const materialSections: MaterialSection[] = [
  {
    id: 'penalaran-umum',
    title: 'Penalaran Umum',
    description: 'Kemampuan berpikir logis dan analitis untuk memecahkan masalah',
    icon: <Brain className="h-8 w-8" />,
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    estimatedTime: '6 jam',
    difficulty: 'Sedang',
    topics: ['Logika Deduktif', 'Analogi', 'Pola Bilangan', 'Silogisme']
  },
  {
    id: 'pengetahuan-pemahaman-umum',
    title: 'Pengetahuan dan Pemahaman Umum',
    description: 'Wawasan umum tentang berbagai bidang pengetahuan',
    icon: <Globe className="h-8 w-8" />,
    color: 'text-green-600',
    bgGradient: 'from-green-50 to-green-100',
    progress: 45,
    totalLessons: 15,
    completedLessons: 7,
    estimatedTime: '8 jam',
    difficulty: 'Mudah',
    topics: ['Sejarah', 'Geografi', 'Sains', 'Budaya']
  },
  {
    id: 'bacaan-menulis',
    title: 'Kemampuan Memahami Bacaan dan Menulis',
    description: 'Kemampuan memahami teks dan mengekspresikan ide dalam tulisan',
    icon: <FileText className="h-8 w-8" />,
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    progress: 70,
    totalLessons: 10,
    completedLessons: 7,
    estimatedTime: '5 jam',
    difficulty: 'Sedang',
    topics: ['Pemahaman Bacaan', 'Struktur Teks', 'Ejaan', 'Tata Bahasa']
  },
  {
    id: 'pengetahuan-kuantitatif',
    title: 'Pengetahuan Kuantitatif',
    description: 'Kemampuan menggunakan angka dan konsep matematika dasar',
    icon: <Calculator className="h-8 w-8" />,
    color: 'text-orange-600',
    bgGradient: 'from-orange-50 to-orange-100',
    progress: 55,
    totalLessons: 14,
    completedLessons: 8,
    estimatedTime: '7 jam',
    difficulty: 'Sulit',
    topics: ['Aritmatika', 'Aljabar', 'Geometri', 'Statistika']
  },
  {
    id: 'literasi-indonesia',
    title: 'Literasi dalam Bahasa Indonesia',
    description: 'Kemampuan memahami dan menggunakan bahasa Indonesia dengan baik',
    icon: <Languages className="h-8 w-8" />,
    color: 'text-red-600',
    bgGradient: 'from-red-50 to-red-100',
    progress: 80,
    totalLessons: 8,
    completedLessons: 6,
    estimatedTime: '4 jam',
    difficulty: 'Sedang',
    topics: ['Teks Naratif', 'Teks Eksposisi', 'Teks Argumentasi', 'Kosakata']
  },
  {
    id: 'literasi-inggris',
    title: 'Literasi dalam Bahasa Inggris',
    description: 'Kemampuan memahami dan menggunakan bahasa Inggris',
    icon: <Globe className="h-8 w-8" />,
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-50 to-indigo-100',
    progress: 40,
    totalLessons: 12,
    completedLessons: 5,
    estimatedTime: '6 jam',
    difficulty: 'Sulit',
    topics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Text Analysis']
  },
  {
    id: 'penalaran-matematika',
    title: 'Penalaran Matematika',
    description: 'Kemampuan berpikir logis menggunakan konsep matematika',
    icon: <PenTool className="h-8 w-8" />,
    color: 'text-teal-600',
    bgGradient: 'from-teal-50 to-teal-100',
    progress: 35,
    totalLessons: 16,
    completedLessons: 6,
    estimatedTime: '8 jam',
    difficulty: 'Sulit',
    topics: ['Logika Matematika', 'Pemecahan Masalah', 'Pola dan Fungsi', 'Probabilitas']
  }
];

const MateriBelajar: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800';
      case 'Sedang': return 'bg-yellow-100 text-yellow-800';
      case 'Sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tpsSections = materialSections.slice(0, 4);
  const literasiSections = materialSections.slice(4, 7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">7</h3>
              <p className="text-muted-foreground">Kategori Materi</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">87</h3>
              <p className="text-muted-foreground">Total Pelajaran</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">44</h3>
              <p className="text-muted-foreground">Jam Pembelajaran</p>
            </CardContent>
          </Card>
        </div>

        {/* TPS Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Tes Potensi Skolastik (TPS)</h2>
              <p className="text-muted-foreground">Mengukur kemampuan kognitif yang diperlukan untuk keberhasilan di pendidikan tinggi</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tpsSections.map((section) => (
              <Card 
                key={section.id} 
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-gradient-to-br ${section.bgGradient}`}
                onMouseEnter={() => setHoveredCard(section.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 rounded-xl bg-white shadow-sm ${section.color}`}>
                      {section.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-3 text-center group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-center">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{section.progress}%</span>
                      </div>
                      <Progress value={section.progress} className="h-2" />
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{section.completedLessons}</p>
                        <p className="text-xs text-muted-foreground">Selesai</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{section.totalLessons}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{section.estimatedTime}</p>
                        <p className="text-xs text-muted-foreground">Durasi</p>
                      </div>
                    </div>
                    

                    
                    {/* Action Button */}
                    <Link to={`/materi-belajar/${section.id}`} className="w-full">
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant={hoveredCard === section.id ? "default" : "outline"}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Mulai Belajar
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Literasi Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
              <Languages className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Tes Literasi</h2>
              <p className="text-muted-foreground">Mengukur kemampuan memahami, menggunakan, dan merefleksikan berbagai jenis teks</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {literasiSections.map((section) => (
              <Card 
                key={section.id} 
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-gradient-to-br ${section.bgGradient}`}
                onMouseEnter={() => setHoveredCard(section.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-full bg-white shadow-sm ${section.color} mb-4`}>
                      {section.icon}
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{section.progress}%</span>
                      </div>
                      <Progress value={section.progress} className="h-2" />
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{section.completedLessons}</p>
                        <p className="text-xs text-muted-foreground">Selesai</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{section.totalLessons}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{section.estimatedTime}</p>
                        <p className="text-xs text-muted-foreground">Durasi</p>
                      </div>
                    </div>
                    

                    
                    {/* Action Button */}
                    <Link to={`/materi-belajar/${section.id}`} className="w-full">
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant={hoveredCard === section.id ? "default" : "outline"}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Mulai Belajar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rangkuman Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4">
              <FileDown className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Rangkuman Materi</h2>
            <p className="text-lg text-muted-foreground">Akses rangkuman lengkap untuk setiap subtes SNBT</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materialSections.map((section) => (
              <Card key={`summary-${section.id}`} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${section.bgGradient} mb-3`}>
                    <div className={`${section.color}`}>
                      {section.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground text-center">
                      Rangkuman lengkap dan ringkas
                    </div>
                    <Link to={`/rangkuman/${section.id}`} className="w-full">
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Rangkuman
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Button - Moved to Bottom */}
        <div className="text-center mb-16">
          <Link to="/analisis-potensi">
            <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300">
              <Target className="h-6 w-6 mr-3" />
              Lihat Analisis Potensi
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MateriBelajar;