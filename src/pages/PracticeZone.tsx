import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

interface QuestionTopic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  estimatedTime: string;
  completionRate: number;
  lastAttempt?: string;
}

interface SubtestSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  category: 'TPS' | 'Literasi';
  topics: QuestionTopic[];
}

const subtestSections: SubtestSection[] = [
  {
    id: 'penalaran-umum',
    title: 'Penalaran Umum',
    description: 'Kemampuan berpikir logis dan analitis',
    icon: <Brain className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'TPS',
    topics: [
      {
        id: 'logika-dasar',
        title: 'Logika Dasar',
        description: 'Soal-soal tentang konsep dasar logika dan penalaran',
        questionCount: 15,
        difficulty: 'Mudah',
        estimatedTime: '20 menit',
        completionRate: 87,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'silogisme',
        title: 'Silogisme',
        description: 'Latihan penalaran deduktif dengan premis mayor dan minor',
        questionCount: 20,
        difficulty: 'Sedang',
        estimatedTime: '25 menit',
        completionRate: 75,
        lastAttempt: '3 hari lalu'
      },
      {
        id: 'analogi',
        title: 'Analogi',
        description: 'Soal perbandingan hubungan antar konsep',
        questionCount: 18,
        difficulty: 'Sedang',
        estimatedTime: '22 menit',
        completionRate: 92,
        lastAttempt: '1 hari lalu'
      },
      {
        id: 'pola-bilangan',
        title: 'Pola Bilangan',
        description: 'Latihan mengenali dan melanjutkan pola dalam deret bilangan',
        questionCount: 16,
        difficulty: 'Sedang',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'diagram-venn',
        title: 'Diagram Venn',
        description: 'Soal representasi visual hubungan antar himpunan',
        questionCount: 12,
        difficulty: 'Mudah',
        estimatedTime: '15 menit',
        completionRate: 0
      },
      {
        id: 'penalaran-spasial',
        title: 'Penalaran Spasial',
        description: 'Latihan kemampuan memahami hubungan ruang dan bentuk',
        questionCount: 14,
        difficulty: 'Sulit',
        estimatedTime: '18 menit',
        completionRate: 0
      },
      {
        id: 'penalaran-kuantitatif',
        title: 'Penalaran Kuantitatif',
        description: 'Soal penalaran menggunakan data numerik',
        questionCount: 22,
        difficulty: 'Sulit',
        estimatedTime: '28 menit',
        completionRate: 0
      },
      {
        id: 'penalaran-verbal',
        title: 'Penalaran Verbal',
        description: 'Latihan kemampuan penalaran menggunakan bahasa',
        questionCount: 20,
        difficulty: 'Sulit',
        estimatedTime: '25 menit',
        completionRate: 0
      }
    ]
  },
  {
    id: 'pengetahuan-pemahaman-umum',
    title: 'Pengetahuan dan Pemahaman Umum',
    description: 'Wawasan umum berbagai bidang',
    icon: <Globe className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    category: 'TPS',
    topics: [
      {
        id: 'sejarah-indonesia',
        title: 'Sejarah Indonesia',
        description: 'Soal tentang peristiwa penting dalam sejarah Indonesia',
        questionCount: 25,
        difficulty: 'Sedang',
        estimatedTime: '30 menit',
        completionRate: 80,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'geografi-indonesia',
        title: 'Geografi Indonesia',
        description: 'Latihan tentang kondisi geografis dan wilayah Indonesia',
        questionCount: 20,
        difficulty: 'Mudah',
        estimatedTime: '25 menit',
        completionRate: 95,
        lastAttempt: '1 hari lalu'
      },
      {
        id: 'budaya-indonesia',
        title: 'Budaya Indonesia',
        description: 'Soal keragaman budaya dan tradisi Indonesia',
        questionCount: 18,
        difficulty: 'Mudah',
        estimatedTime: '22 menit',
        completionRate: 0
      },
      {
        id: 'sains-teknologi',
        title: 'Sains dan Teknologi',
        description: 'Latihan tentang perkembangan sains dan teknologi',
        questionCount: 22,
        difficulty: 'Sedang',
        estimatedTime: '28 menit',
        completionRate: 0
      },
      {
        id: 'organisasi-internasional',
        title: 'Organisasi Internasional',
        description: 'Soal tentang organisasi dan kerjasama internasional',
        questionCount: 16,
        difficulty: 'Sedang',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'isu-kontemporer',
        title: 'Isu Kontemporer',
        description: 'Latihan tentang isu-isu terkini yang relevan',
        questionCount: 20,
        difficulty: 'Sedang',
        estimatedTime: '25 menit',
        completionRate: 0
      }
    ]
  },
  {
    id: 'bacaan-menulis',
    title: 'Kemampuan Memahami Bacaan dan Menulis',
    description: 'Pemahaman teks dan ekspresi tulisan',
    icon: <FileText className="h-6 w-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    category: 'TPS',
    topics: [
      {
        id: 'pemahaman-bacaan',
        title: 'Pemahaman Bacaan',
        description: 'Soal teknik memahami berbagai jenis teks',
        questionCount: 20,
        difficulty: 'Sedang',
        estimatedTime: '25 menit',
        completionRate: 85,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'struktur-teks',
        title: 'Struktur Teks',
        description: 'Latihan memahami organisasi dan struktur teks',
        questionCount: 15,
        difficulty: 'Mudah',
        estimatedTime: '18 menit',
        completionRate: 90,
        lastAttempt: '1 hari lalu'
      },
      {
        id: 'ejaan-tata-bahasa',
        title: 'Ejaan dan Tata Bahasa',
        description: 'Soal aturan ejaan dan tata bahasa Indonesia',
        questionCount: 25,
        difficulty: 'Sedang',
        estimatedTime: '30 menit',
        completionRate: 78,
        lastAttempt: '3 hari lalu'
      },
      {
        id: 'kosakata',
        title: 'Kosakata',
        description: 'Latihan pengembangan dan penggunaan kosakata',
        questionCount: 18,
        difficulty: 'Mudah',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'menulis-efektif',
        title: 'Menulis Efektif',
        description: 'Soal teknik menulis yang efektif dan efisien',
        questionCount: 12,
        difficulty: 'Sulit',
        estimatedTime: '25 menit',
        completionRate: 0
      },
      {
        id: 'analisis-teks',
        title: 'Analisis Teks',
        description: 'Latihan menganalisis makna dan tujuan teks',
        questionCount: 16,
        difficulty: 'Sulit',
        estimatedTime: '22 menit',
        completionRate: 0
      },
      {
        id: 'retorika',
        title: 'Retorika',
        description: 'Soal seni berbicara dan meyakinkan',
        questionCount: 14,
        difficulty: 'Sulit',
        estimatedTime: '20 menit',
        completionRate: 0
      }
    ]
  },
  {
    id: 'pengetahuan-kuantitatif',
    title: 'Pengetahuan Kuantitatif',
    description: 'Konsep matematika dasar',
    icon: <Calculator className="h-6 w-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'TPS',
    topics: [
      {
        id: 'aritmatika',
        title: 'Aritmatika',
        description: 'Soal operasi dasar bilangan dan perhitungan',
        questionCount: 20,
        difficulty: 'Mudah',
        estimatedTime: '25 menit',
        completionRate: 95,
        lastAttempt: '1 hari lalu'
      },
      {
        id: 'aljabar-dasar',
        title: 'Aljabar Dasar',
        description: 'Latihan konsep variabel dan persamaan sederhana',
        questionCount: 18,
        difficulty: 'Sedang',
        estimatedTime: '22 menit',
        completionRate: 82,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'geometri',
        title: 'Geometri',
        description: 'Soal bangun datar dan ruang',
        questionCount: 16,
        difficulty: 'Sedang',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'statistika-dasar',
        title: 'Statistika Dasar',
        description: 'Latihan pengolahan dan interpretasi data',
        questionCount: 15,
        difficulty: 'Sedang',
        estimatedTime: '18 menit',
        completionRate: 0
      },
      {
        id: 'perbandingan-proporsi',
        title: 'Perbandingan dan Proporsi',
        description: 'Soal konsep rasio dan perbandingan',
        questionCount: 14,
        difficulty: 'Mudah',
        estimatedTime: '17 menit',
        completionRate: 0
      },
      {
        id: 'peluang',
        title: 'Peluang',
        description: 'Latihan konsep probabilitas sederhana',
        questionCount: 12,
        difficulty: 'Sulit',
        estimatedTime: '15 menit',
        completionRate: 0
      },
      {
        id: 'fungsi',
        title: 'Fungsi',
        description: 'Soal konsep fungsi dan grafiknya',
        questionCount: 16,
        difficulty: 'Sulit',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'trigonometri-dasar',
        title: 'Trigonometri Dasar',
        description: 'Latihan konsep dasar trigonometri',
        questionCount: 14,
        difficulty: 'Sulit',
        estimatedTime: '18 menit',
        completionRate: 0
      }
    ]
  },
  {
    id: 'literasi-indonesia',
    title: 'Literasi dalam Bahasa Indonesia',
    description: 'Kemampuan berbahasa Indonesia',
    icon: <Languages className="h-6 w-6" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    category: 'Literasi',
    topics: [
      {
        id: 'teks-naratif',
        title: 'Teks Naratif',
        description: 'Soal memahami dan menganalisis teks cerita',
        questionCount: 15,
        difficulty: 'Mudah',
        estimatedTime: '18 menit',
        completionRate: 93,
        lastAttempt: '1 hari lalu'
      },
      {
        id: 'teks-eksposisi',
        title: 'Teks Eksposisi',
        description: 'Latihan teks yang menjelaskan atau memaparkan',
        questionCount: 18,
        difficulty: 'Sedang',
        estimatedTime: '22 menit',
        completionRate: 88,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'teks-argumentasi',
        title: 'Teks Argumentasi',
        description: 'Soal teks yang berisi pendapat dan alasan',
        questionCount: 20,
        difficulty: 'Sedang',
        estimatedTime: '25 menit',
        completionRate: 85,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'kosakata-konteks',
        title: 'Kosakata dalam Konteks',
        description: 'Latihan memahami makna kata dalam konteks',
        questionCount: 16,
        difficulty: 'Mudah',
        estimatedTime: '20 menit',
        completionRate: 90,
        lastAttempt: '1 hari lalu'
      },
      {
        id: 'teks-prosedural',
        title: 'Teks Prosedural',
        description: 'Soal teks yang berisi langkah-langkah',
        questionCount: 12,
        difficulty: 'Mudah',
        estimatedTime: '15 menit',
        completionRate: 0
      },
      {
        id: 'teks-deskriptif',
        title: 'Teks Deskriptif',
        description: 'Latihan teks yang menggambarkan sesuatu',
        questionCount: 14,
        difficulty: 'Mudah',
        estimatedTime: '17 menit',
        completionRate: 0
      }
    ]
  },
  {
    id: 'literasi-inggris',
    title: 'Literasi dalam Bahasa Inggris',
    description: 'Kemampuan berbahasa Inggris',
    icon: <Globe className="h-6 w-6" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    category: 'Literasi',
    topics: [
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension',
        description: 'Soal memahami teks bahasa Inggris',
        questionCount: 20,
        difficulty: 'Sedang',
        estimatedTime: '25 menit',
        completionRate: 75,
        lastAttempt: '3 hari lalu'
      },
      {
        id: 'vocabulary',
        title: 'Vocabulary',
        description: 'Latihan kosakata bahasa Inggris',
        questionCount: 25,
        difficulty: 'Mudah',
        estimatedTime: '20 menit',
        completionRate: 88,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'grammar',
        title: 'Grammar',
        description: 'Soal tata bahasa Inggris',
        questionCount: 22,
        difficulty: 'Sedang',
        estimatedTime: '25 menit',
        completionRate: 0
      },
      {
        id: 'text-analysis',
        title: 'Text Analysis',
        description: 'Latihan menganalisis teks bahasa Inggris',
        questionCount: 18,
        difficulty: 'Sulit',
        estimatedTime: '22 menit',
        completionRate: 0
      },
      {
        id: 'inference',
        title: 'Inference',
        description: 'Soal menyimpulkan makna tersirat',
        questionCount: 16,
        difficulty: 'Sulit',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'context-clues',
        title: 'Context Clues',
        description: 'Latihan memahami makna dari konteks',
        questionCount: 15,
        difficulty: 'Sedang',
        estimatedTime: '18 menit',
        completionRate: 0
      },
      {
        id: 'critical-reading',
        title: 'Critical Reading',
        description: 'Soal membaca kritis dan evaluatif',
        questionCount: 14,
        difficulty: 'Sulit',
        estimatedTime: '20 menit',
        completionRate: 0
      }
    ]
  },
  {
    id: 'penalaran-matematika',
    title: 'Penalaran Matematika',
    description: 'Logika matematika tingkat lanjut',
    icon: <PenTool className="h-6 w-6" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    category: 'Literasi',
    topics: [
      {
        id: 'logika-matematika',
        title: 'Logika Matematika',
        description: 'Soal penalaran logis dalam matematika',
        questionCount: 18,
        difficulty: 'Sedang',
        estimatedTime: '22 menit',
        completionRate: 72,
        lastAttempt: '2 hari lalu'
      },
      {
        id: 'pemecahan-masalah',
        title: 'Pemecahan Masalah',
        description: 'Latihan strategi menyelesaikan masalah matematika',
        questionCount: 16,
        difficulty: 'Sulit',
        estimatedTime: '25 menit',
        completionRate: 0
      },
      {
        id: 'pola-fungsi',
        title: 'Pola dan Fungsi',
        description: 'Soal mengenali pola dan hubungan fungsional',
        questionCount: 20,
        difficulty: 'Sedang',
        estimatedTime: '24 menit',
        completionRate: 0
      },
      {
        id: 'probabilitas',
        title: 'Probabilitas',
        description: 'Latihan konsep peluang dan statistika',
        questionCount: 15,
        difficulty: 'Sulit',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'geometri-analitik',
        title: 'Geometri Analitik',
        description: 'Soal geometri dengan pendekatan aljabar',
        questionCount: 14,
        difficulty: 'Sulit',
        estimatedTime: '18 menit',
        completionRate: 0
      },
      {
        id: 'kalkulus-dasar',
        title: 'Kalkulus Dasar',
        description: 'Latihan konsep limit dan turunan sederhana',
        questionCount: 12,
        difficulty: 'Sulit',
        estimatedTime: '20 menit',
        completionRate: 0
      },
      {
        id: 'optimasi',
        title: 'Optimasi',
        description: 'Soal mencari nilai maksimum dan minimum',
        questionCount: 10,
        difficulty: 'Sulit',
        estimatedTime: '15 menit',
        completionRate: 0
      },
      {
        id: 'matematika-diskrit',
        title: 'Matematika Diskrit',
        description: 'Latihan konsep kombinatorik dan graf',
        questionCount: 13,
        difficulty: 'Sulit',
        estimatedTime: '18 menit',
        completionRate: 0
      }
    ]
  }
];

const PracticeZone: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'TPS' | 'Literasi'>('All');



  const filteredSections = useMemo(() => {
    return selectedCategory === 'All' 
      ? subtestSections 
      : subtestSections.filter(section => section.category === selectedCategory);
  }, [selectedCategory]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800';
      case 'Sedang': return 'bg-yellow-100 text-yellow-800';
      case 'Sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Removed unused variables: totalQuestions, completedTopics, totalTopics, averageCompletion

  return (
    <div className="min-h-screen bg-gray-50 no-blink">
      <Navigation />
      
      <div className="container max-w-7xl mx-auto px-4 py-8 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Practice Zone</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Latihan soal berdasarkan subtes SNBT untuk meningkatkan kemampuan Anda
              </p>
            </div>
          </div>



          {/* Category Filter */}
          <div className="flex gap-4 mb-8 category-transition">
            {(['All', 'TPS', 'Literasi'] as const).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-2"
              >
                {category === 'All' ? 'Semua Kategori' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Subtest Sections */}
        <div className="space-y-6 min-h-[600px] dynamic-content category-transition">
          {filteredSections.map((section) => {
            const sectionProgress = section.topics.reduce((total, topic) => total + topic.completionRate, 0) / section.topics.length;
            
            return (
              <Card key={section.id} className={`${section.borderColor} border-2 transition-all duration-300 hover:shadow-lg transform-gpu`}>
                <CardHeader className={`${section.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-white rounded-lg ${section.color}`}>
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{section.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{section.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {section.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {section.topics.length} topik tersedia
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden md:block">
                        <div className="text-sm text-muted-foreground mb-1">Progress</div>
                        <div className="flex items-center gap-2">
                          <Progress value={sectionProgress} className="w-20" />
                          <span className="text-sm font-medium">{Math.round(sectionProgress)}%</span>
                        </div>
                      </div>
                      <Link to={`/practice/${section.id}`}>
                        <Button 
                          size="sm" 
                          className="px-4 py-2"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Mulai
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Mobile progress bar */}
                  <div className="mt-4 md:hidden">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(sectionProgress)}%</span>
                    </div>
                    <Progress value={sectionProgress} className="h-2" />
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Grid layout for mobile, horizontal scroll for desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:gap-4 lg:overflow-x-auto lg:pb-4 gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {section.topics.map((topic) => (
                      <Card key={topic.id} className="lg:flex-shrink-0 lg:w-72 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{topic.title}</h4>
                            <Badge className={getDifficultyColor(topic.difficulty)} variant="secondary">
                              {topic.difficulty}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{topic.completionRate}%</span>
                            </div>
                            <Progress value={topic.completionRate} className="h-2" />
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {topic.questionCount} soal
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {topic.estimatedTime}
                              </div>
                            </div>
                            
                            {topic.lastAttempt && (
                              <div className="text-xs text-muted-foreground">
                                Terakhir: {topic.lastAttempt}
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="w-full"
                            variant={topic.completionRate > 0 ? "outline" : "default"}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {topic.completionRate > 0 ? 'Lanjutkan' : 'Mulai'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PracticeZone;