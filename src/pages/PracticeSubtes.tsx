import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Brain,
  Globe,
  FileText,
  Calculator,
  Languages,
  PenTool,
  Award,
  ChevronRight,
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface PracticeTopic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  completed: boolean;
  locked: boolean;
  bestScore?: number;
  attempts?: number;
}

interface SubtestPractice {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  iconColor: string;
  totalTopics: number;
  completedTopics: number;
  estimatedTime: string;
  topics: PracticeTopic[];
}

const subtestPractices: Record<string, SubtestPractice> = {
  'penalaran-umum': {
    id: 'penalaran-umum',
    title: 'Penalaran Umum',
    description: 'Latihan soal kemampuan berpikir logis dan analitis',
    icon: Brain,
    color: 'blue',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    totalTopics: 8,
    completedTopics: 3,
    estimatedTime: '6 jam',
    topics: [
      {
        id: 'logika-dasar',
        title: 'Logika Dasar',
        description: 'Soal-soal tentang konsep dasar logika dan penalaran',
        questionCount: 15,
        duration: '20 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        bestScore: 87,
        attempts: 3
      },
      {
        id: 'silogisme',
        title: 'Silogisme',
        description: 'Latihan penalaran deduktif dengan premis mayor dan minor',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 75,
        attempts: 2
      },
      {
        id: 'analogi',
        title: 'Analogi',
        description: 'Soal perbandingan hubungan antar konsep',
        questionCount: 18,
        duration: '22 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 92,
        attempts: 4
      },
      {
        id: 'pola-bilangan',
        title: 'Pola Bilangan',
        description: 'Latihan mengenali dan melanjutkan pola dalam deret bilangan',
        questionCount: 16,
        duration: '20 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'diagram-venn',
        title: 'Diagram Venn',
        description: 'Soal representasi visual hubungan antar himpunan',
        questionCount: 12,
        duration: '15 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'penalaran-spasial',
        title: 'Penalaran Spasial',
        description: 'Latihan kemampuan memahami hubungan ruang dan bentuk',
        questionCount: 14,
        duration: '18 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'penalaran-kuantitatif',
        title: 'Penalaran Kuantitatif',
        description: 'Soal penalaran menggunakan data numerik',
        questionCount: 22,
        duration: '28 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'penalaran-verbal',
        title: 'Penalaran Verbal',
        description: 'Latihan kemampuan penalaran menggunakan bahasa',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'pengetahuan-pemahaman-umum': {
    id: 'pengetahuan-pemahaman-umum',
    title: 'Pengetahuan dan Pemahaman Umum',
    description: 'Latihan soal wawasan umum tentang berbagai bidang pengetahuan',
    icon: Globe,
    color: 'green',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    totalTopics: 6,
    completedTopics: 2,
    estimatedTime: '4 jam',
    topics: [
      {
        id: 'sejarah-indonesia',
        title: 'Sejarah Indonesia',
        description: 'Soal tentang peristiwa penting dalam sejarah Indonesia',
        questionCount: 25,
        duration: '30 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 80,
        attempts: 2
      },
      {
        id: 'geografi-indonesia',
        title: 'Geografi Indonesia',
        description: 'Latihan tentang kondisi geografis dan wilayah Indonesia',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        bestScore: 95,
        attempts: 1
      },
      {
        id: 'budaya-indonesia',
        title: 'Budaya Indonesia',
        description: 'Soal keragaman budaya dan tradisi Indonesia',
        questionCount: 18,
        duration: '22 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'sains-teknologi',
        title: 'Sains dan Teknologi',
        description: 'Latihan tentang perkembangan sains dan teknologi',
        questionCount: 22,
        duration: '28 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'organisasi-internasional',
        title: 'Organisasi Internasional',
        description: 'Soal tentang organisasi dan kerjasama internasional',
        questionCount: 16,
        duration: '20 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'isu-kontemporer',
        title: 'Isu Kontemporer',
        description: 'Latihan tentang isu-isu terkini yang relevan',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      }
    ]
  },
  'bacaan-menulis': {
    id: 'bacaan-menulis',
    title: 'Kemampuan Memahami Bacaan dan Menulis',
    description: 'Latihan soal kemampuan memahami teks dan mengekspresikan ide',
    icon: FileText,
    color: 'purple',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    totalTopics: 7,
    completedTopics: 3,
    estimatedTime: '3.5 jam',
    topics: [
      {
        id: 'pemahaman-bacaan',
        title: 'Pemahaman Bacaan',
        description: 'Soal teknik memahami berbagai jenis teks',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 85,
        attempts: 2
      },
      {
        id: 'struktur-teks',
        title: 'Struktur Teks',
        description: 'Latihan memahami organisasi dan struktur teks',
        questionCount: 15,
        duration: '18 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        bestScore: 90,
        attempts: 1
      },
      {
        id: 'ejaan-tata-bahasa',
        title: 'Ejaan dan Tata Bahasa',
        description: 'Soal aturan ejaan dan tata bahasa Indonesia',
        questionCount: 25,
        duration: '30 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 78,
        attempts: 3
      },
      {
        id: 'kosakata',
        title: 'Kosakata',
        description: 'Latihan pengembangan dan penggunaan kosakata',
        questionCount: 18,
        duration: '20 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'menulis-efektif',
        title: 'Menulis Efektif',
        description: 'Soal teknik menulis yang efektif dan efisien',
        questionCount: 12,
        duration: '25 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'analisis-teks',
        title: 'Analisis Teks',
        description: 'Latihan menganalisis makna dan tujuan teks',
        questionCount: 16,
        duration: '22 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'retorika',
        title: 'Retorika',
        description: 'Soal seni berbicara dan meyakinkan',
        questionCount: 14,
        duration: '20 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'pengetahuan-kuantitatif': {
    id: 'pengetahuan-kuantitatif',
    title: 'Pengetahuan Kuantitatif',
    description: 'Latihan soal kemampuan menggunakan angka dan konsep matematika dasar',
    icon: Calculator,
    color: 'orange',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    totalTopics: 8,
    completedTopics: 2,
    estimatedTime: '4 jam',
    topics: [
      {
        id: 'aritmatika',
        title: 'Aritmatika',
        description: 'Soal operasi dasar bilangan dan perhitungan',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        bestScore: 95,
        attempts: 1
      },
      {
        id: 'aljabar-dasar',
        title: 'Aljabar Dasar',
        description: 'Latihan konsep variabel dan persamaan sederhana',
        questionCount: 18,
        duration: '22 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 82,
        attempts: 2
      },
      {
        id: 'geometri',
        title: 'Geometri',
        description: 'Soal bangun datar dan ruang',
        questionCount: 16,
        duration: '20 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'statistika-dasar',
        title: 'Statistika Dasar',
        description: 'Latihan pengolahan dan interpretasi data',
        questionCount: 15,
        duration: '18 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'perbandingan-proporsi',
        title: 'Perbandingan dan Proporsi',
        description: 'Soal konsep rasio dan perbandingan',
        questionCount: 14,
        duration: '17 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'peluang',
        title: 'Peluang',
        description: 'Latihan konsep probabilitas sederhana',
        questionCount: 12,
        duration: '15 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'fungsi',
        title: 'Fungsi',
        description: 'Soal konsep fungsi dan grafiknya',
        questionCount: 16,
        duration: '20 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'trigonometri-dasar',
        title: 'Trigonometri Dasar',
        description: 'Latihan konsep dasar trigonometri',
        questionCount: 14,
        duration: '18 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'literasi-indonesia': {
    id: 'literasi-indonesia',
    title: 'Literasi dalam Bahasa Indonesia',
    description: 'Latihan soal kemampuan memahami dan menggunakan bahasa Indonesia',
    icon: Languages,
    color: 'red',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    totalTopics: 6,
    completedTopics: 4,
    estimatedTime: '3 jam',
    topics: [
      {
        id: 'teks-naratif',
        title: 'Teks Naratif',
        description: 'Soal memahami dan menganalisis teks cerita',
        questionCount: 15,
        duration: '18 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        bestScore: 93,
        attempts: 1
      },
      {
        id: 'teks-eksposisi',
        title: 'Teks Eksposisi',
        description: 'Latihan teks yang menjelaskan atau memaparkan',
        questionCount: 18,
        duration: '22 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 88,
        attempts: 2
      },
      {
        id: 'teks-argumentasi',
        title: 'Teks Argumentasi',
        description: 'Soal teks yang berisi pendapat dan alasan',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 85,
        attempts: 2
      },
      {
        id: 'kosakata-konteks',
        title: 'Kosakata dalam Konteks',
        description: 'Latihan memahami makna kata dalam konteks',
        questionCount: 16,
        duration: '20 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        bestScore: 90,
        attempts: 1
      },
      {
        id: 'teks-prosedural',
        title: 'Teks Prosedural',
        description: 'Soal teks yang berisi langkah-langkah',
        questionCount: 12,
        duration: '15 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'teks-deskriptif',
        title: 'Teks Deskriptif',
        description: 'Latihan teks yang menggambarkan sesuatu',
        questionCount: 14,
        duration: '17 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      }
    ]
  },
  'literasi-inggris': {
    id: 'literasi-inggris',
    title: 'Literasi dalam Bahasa Inggris',
    description: 'Latihan soal kemampuan memahami dan menggunakan bahasa Inggris',
    icon: Globe,
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    totalTopics: 7,
    completedTopics: 2,
    estimatedTime: '3.5 jam',
    topics: [
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension',
        description: 'Soal memahami teks bahasa Inggris',
        questionCount: 20,
        duration: '25 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 75,
        attempts: 3
      },
      {
        id: 'vocabulary',
        title: 'Vocabulary',
        description: 'Latihan kosakata bahasa Inggris',
        questionCount: 25,
        duration: '20 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        bestScore: 88,
        attempts: 2
      },
      {
        id: 'grammar',
        title: 'Grammar',
        description: 'Soal tata bahasa Inggris',
        questionCount: 22,
        duration: '25 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'text-analysis',
        title: 'Text Analysis',
        description: 'Latihan menganalisis teks bahasa Inggris',
        questionCount: 18,
        duration: '22 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'inference',
        title: 'Inference',
        description: 'Soal menyimpulkan makna tersirat',
        questionCount: 16,
        duration: '20 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'context-clues',
        title: 'Context Clues',
        description: 'Latihan memahami makna dari konteks',
        questionCount: 15,
        duration: '18 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'critical-reading',
        title: 'Critical Reading',
        description: 'Soal membaca kritis dan evaluatif',
        questionCount: 14,
        duration: '20 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'penalaran-matematika': {
    id: 'penalaran-matematika',
    title: 'Penalaran Matematika',
    description: 'Latihan soal kemampuan berpikir logis menggunakan konsep matematika',
    icon: PenTool,
    color: 'teal',
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600',
    totalTopics: 8,
    completedTopics: 1,
    estimatedTime: '4.5 jam',
    topics: [
      {
        id: 'logika-matematika',
        title: 'Logika Matematika',
        description: 'Soal penalaran logis dalam matematika',
        questionCount: 18,
        duration: '22 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        bestScore: 72,
        attempts: 2
      },
      {
        id: 'pemecahan-masalah',
        title: 'Pemecahan Masalah',
        description: 'Latihan strategi menyelesaikan masalah matematika',
        questionCount: 16,
        duration: '25 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'pola-fungsi',
        title: 'Pola dan Fungsi',
        description: 'Soal mengenali pola dan hubungan fungsional',
        questionCount: 20,
        duration: '24 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'probabilitas',
        title: 'Probabilitas',
        description: 'Latihan konsep peluang dan statistika',
        questionCount: 15,
        duration: '20 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'geometri-analitik',
        title: 'Geometri Analitik',
        description: 'Soal geometri dengan pendekatan aljabar',
        questionCount: 14,
        duration: '22 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'kalkulus-dasar',
        title: 'Kalkulus Dasar',
        description: 'Latihan konsep limit dan turunan sederhana',
        questionCount: 12,
        duration: '25 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'optimasi',
        title: 'Optimasi',
        description: 'Soal mencari nilai maksimum dan minimum',
        questionCount: 10,
        duration: '20 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'modeling-matematika',
        title: 'Modeling Matematika',
        description: 'Latihan membuat model matematika dari masalah nyata',
        questionCount: 8,
        duration: '25 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  }
};

const PracticeSubtes: React.FC = () => {
  const { subtestId } = useParams<{ subtestId: string }>();
  // Removed unused selectedTopic state

  const subtest = subtestId ? subtestPractices[subtestId] : null;

  if (!subtest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Subtes Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-8">Subtes yang Anda cari tidak tersedia.</p>
            <Link to="/practice">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Practice Zone
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800';
      case 'Sedang': return 'bg-yellow-100 text-yellow-800';
      case 'Sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const IconComponent = subtest.icon;
  const progress = Math.round((subtest.completedTopics / subtest.totalTopics) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/practice" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Practice Zone
          </Link>
          
          <div className={`${subtest.bgColor} rounded-2xl p-8 mb-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className={`p-4 bg-white rounded-xl shadow-sm ${subtest.iconColor}`}>
                  <IconComponent className="h-12 w-12" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{subtest.title}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{subtest.description}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>{subtest.totalTopics} topik latihan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{subtest.estimatedTime} total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>{subtest.completedTopics} selesai</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-2">Progress Keseluruhan</div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="w-32" />
                  <span className="text-2xl font-bold text-gray-900">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Soal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subtest.topics.reduce((total, topic) => total + topic.questionCount, 0)}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Topik Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{subtest.completedTopics}/{subtest.totalTopics}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skor Terbaik</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.max(...subtest.topics.filter(t => t.bestScore).map(t => t.bestScore!), 0) || '-'}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Percobaan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subtest.topics.reduce((total, topic) => total + (topic.attempts || 0), 0)}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subtest.topics.map((topic) => {
            const isLocked = topic.locked;
            const isCompleted = topic.completed;
            
            return (
              <Card 
                key={topic.id} 
                className={`group transition-all duration-200 hover:shadow-lg ${
                  isLocked ? 'opacity-60' : 'hover:-translate-y-1'
                } ${
                  isCompleted ? 'ring-2 ring-green-200 bg-green-50' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {topic.title}
                        </CardTitle>
                        {isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{topic.questionCount} soal</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{topic.duration}</span>
                        </div>
                      </div>
                      
                      <Badge className={getDifficultyColor(topic.difficulty)} variant="secondary">
                        {topic.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Performance Stats */}
                  {isCompleted && topic.bestScore && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Skor Terbaik:</span>
                        <span className={`font-semibold ${getScoreColor(topic.bestScore)}`}>
                          {topic.bestScore}%
                        </span>
                      </div>
                      {topic.attempts && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-muted-foreground">Percobaan:</span>
                          <span className="font-medium">{topic.attempts}x</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <Link to={`/practice/${subtestId}/${topic.id}`}>
                    <Button 
                      className="w-full" 
                      disabled={isLocked}
                      variant={isCompleted ? "outline" : "default"}
                    >
                    {isLocked ? (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Terkunci
                      </>
                    ) : isCompleted ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Ulangi Latihan
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Mulai Latihan
                      </>
                    )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tips Latihan Soal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Mulai dari topik dengan tingkat kesulitan mudah</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Perhatikan waktu pengerjaan setiap soal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Review jawaban yang salah untuk pembelajaran</span>
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Ulangi latihan untuk meningkatkan skor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Catat pola soal yang sering muncul</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Konsisten berlatih setiap hari</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PracticeSubtes;