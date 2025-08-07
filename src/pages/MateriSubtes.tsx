import React, { useState } from 'react';
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
  Target
} from 'lucide-react';

interface MaterialTopic {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  completed: boolean;
  locked: boolean;
  content?: string;
}

interface SubtestMaterial {
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
  topics: MaterialTopic[];
}

const subtestMaterials: Record<string, SubtestMaterial> = {
  'penalaran-umum': {
    id: 'penalaran-umum',
    title: 'Penalaran Umum',
    description: 'Kemampuan berpikir logis dan analitis',
    icon: Brain,
    color: 'blue',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    totalTopics: 8,
    completedTopics: 3,
    estimatedTime: '12 jam',
    topics: [
      {
        id: 'logika-dasar',
        title: 'Logika Dasar',
        description: 'Memahami konsep dasar logika dan penalaran',
        duration: '90 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false,
        content: 'Materi tentang logika dasar...'
      },
      {
        id: 'silogisme',
        title: 'Silogisme',
        description: 'Bentuk penalaran deduktif dengan premis mayor dan minor',
        duration: '120 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        content: 'Materi tentang silogisme...'
      },
      {
        id: 'analogi',
        title: 'Analogi',
        description: 'Perbandingan hubungan antar konsep',
        duration: '100 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false,
        content: 'Materi tentang analogi...'
      },
      {
        id: 'pola-bilangan',
        title: 'Pola Bilangan',
        description: 'Mengenali dan melanjutkan pola dalam deret bilangan',
        duration: '110 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false,
        content: 'Materi tentang pola bilangan...'
      },
      {
        id: 'diagram-venn',
        title: 'Diagram Venn',
        description: 'Representasi visual hubungan antar himpunan',
        duration: '95 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'penalaran-spasial',
        title: 'Penalaran Spasial',
        description: 'Kemampuan memahami hubungan ruang dan bentuk',
        duration: '130 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'penalaran-kuantitatif',
        title: 'Penalaran Kuantitatif',
        description: 'Penalaran menggunakan data numerik',
        duration: '140 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'penalaran-verbal',
        title: 'Penalaran Verbal',
        description: 'Kemampuan penalaran menggunakan bahasa',
        duration: '125 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'pengetahuan-pemahaman-umum': {
    id: 'pengetahuan-pemahaman-umum',
    title: 'Pengetahuan dan Pemahaman Umum',
    description: 'Wawasan umum tentang berbagai bidang pengetahuan',
    icon: Globe,
    color: 'green',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    totalTopics: 6,
    completedTopics: 2,
    estimatedTime: '8 jam',
    topics: [
      {
        id: 'sejarah-indonesia',
        title: 'Sejarah Indonesia',
        description: 'Peristiwa penting dalam sejarah Indonesia',
        duration: '120 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'geografi-indonesia',
        title: 'Geografi Indonesia',
        description: 'Kondisi geografis dan wilayah Indonesia',
        duration: '100 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false
      },
      {
        id: 'budaya-indonesia',
        title: 'Budaya Indonesia',
        description: 'Keragaman budaya dan tradisi Indonesia',
        duration: '90 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'sains-teknologi',
        title: 'Sains dan Teknologi',
        description: 'Perkembangan sains dan teknologi',
        duration: '110 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'organisasi-internasional',
        title: 'Organisasi Internasional',
        description: 'Organisasi dan kerjasama internasional',
        duration: '110 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'isu-kontemporer',
        title: 'Isu Kontemporer',
        description: 'Isu-isu terkini yang relevan',
        duration: '100 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      }
    ]
  },
  'bacaan-menulis': {
    id: 'bacaan-menulis',
    title: 'Kemampuan Memahami Bacaan dan Menulis',
    description: 'Kemampuan memahami teks dan mengekspresikan ide dalam tulisan',
    icon: FileText,
    color: 'purple',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    totalTopics: 7,
    completedTopics: 3,
    estimatedTime: '5 jam',
    topics: [
      {
        id: 'pemahaman-bacaan',
        title: 'Pemahaman Bacaan',
        description: 'Teknik memahami berbagai jenis teks',
        duration: '90 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'struktur-teks',
        title: 'Struktur Teks',
        description: 'Memahami organisasi dan struktur teks',
        duration: '80 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false
      },
      {
        id: 'ejaan-tata-bahasa',
        title: 'Ejaan dan Tata Bahasa',
        description: 'Aturan ejaan dan tata bahasa Indonesia',
        duration: '100 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'kosakata',
        title: 'Kosakata',
        description: 'Pengembangan dan penggunaan kosakata',
        duration: '70 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'menulis-efektif',
        title: 'Menulis Efektif',
        description: 'Teknik menulis yang efektif dan efisien',
        duration: '120 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'analisis-teks',
        title: 'Analisis Teks',
        description: 'Menganalisis makna dan tujuan teks',
        duration: '110 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'retorika',
        title: 'Retorika',
        description: 'Seni berbicara dan meyakinkan',
        duration: '100 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'pengetahuan-kuantitatif': {
    id: 'pengetahuan-kuantitatif',
    title: 'Pengetahuan Kuantitatif',
    description: 'Kemampuan menggunakan angka dan konsep matematika dasar',
    icon: Calculator,
    color: 'orange',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    totalTopics: 8,
    completedTopics: 2,
    estimatedTime: '7 jam',
    topics: [
      {
        id: 'aritmatika',
        title: 'Aritmatika',
        description: 'Operasi dasar bilangan dan perhitungan',
        duration: '100 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false
      },
      {
        id: 'aljabar-dasar',
        title: 'Aljabar Dasar',
        description: 'Konsep variabel dan persamaan sederhana',
        duration: '120 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'geometri',
        title: 'Geometri',
        description: 'Bangun datar dan ruang',
        duration: '110 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'statistika-dasar',
        title: 'Statistika Dasar',
        description: 'Pengolahan dan interpretasi data',
        duration: '90 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'perbandingan-proporsi',
        title: 'Perbandingan dan Proporsi',
        description: 'Konsep rasio dan perbandingan',
        duration: '80 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'peluang',
        title: 'Peluang',
        description: 'Konsep probabilitas sederhana',
        duration: '100 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'fungsi',
        title: 'Fungsi',
        description: 'Konsep fungsi dan grafiknya',
        duration: '130 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'trigonometri-dasar',
        title: 'Trigonometri Dasar',
        description: 'Konsep dasar trigonometri',
        duration: '140 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'literasi-indonesia': {
    id: 'literasi-indonesia',
    title: 'Literasi dalam Bahasa Indonesia',
    description: 'Kemampuan memahami dan menggunakan bahasa Indonesia dengan baik',
    icon: Languages,
    color: 'red',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    totalTopics: 6,
    completedTopics: 4,
    estimatedTime: '4 jam',
    topics: [
      {
        id: 'teks-naratif',
        title: 'Teks Naratif',
        description: 'Memahami dan menganalisis teks cerita',
        duration: '80 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false
      },
      {
        id: 'teks-eksposisi',
        title: 'Teks Eksposisi',
        description: 'Teks yang menjelaskan atau memaparkan',
        duration: '90 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'teks-argumentasi',
        title: 'Teks Argumentasi',
        description: 'Teks yang berisi pendapat dan alasan',
        duration: '100 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'kosakata-konteks',
        title: 'Kosakata dalam Konteks',
        description: 'Memahami makna kata dalam konteks',
        duration: '70 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false
      },
      {
        id: 'teks-prosedural',
        title: 'Teks Prosedural',
        description: 'Teks yang berisi langkah-langkah',
        duration: '60 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      },
      {
        id: 'teks-deskriptif',
        title: 'Teks Deskriptif',
        description: 'Teks yang menggambarkan sesuatu',
        duration: '75 menit',
        difficulty: 'Mudah',
        completed: false,
        locked: false
      }
    ]
  },
  'literasi-inggris': {
    id: 'literasi-inggris',
    title: 'Literasi dalam Bahasa Inggris',
    description: 'Kemampuan memahami dan menggunakan bahasa Inggris',
    icon: Globe,
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    totalTopics: 7,
    completedTopics: 2,
    estimatedTime: '6 jam',
    topics: [
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension',
        description: 'Memahami teks bahasa Inggris',
        duration: '100 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'vocabulary',
        title: 'Vocabulary',
        description: 'Kosakata bahasa Inggris',
        duration: '80 menit',
        difficulty: 'Mudah',
        completed: true,
        locked: false
      },
      {
        id: 'grammar',
        title: 'Grammar',
        description: 'Tata bahasa Inggris',
        duration: '120 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'text-analysis',
        title: 'Text Analysis',
        description: 'Menganalisis teks bahasa Inggris',
        duration: '110 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'inference',
        title: 'Inference',
        description: 'Menyimpulkan makna tersirat',
        duration: '90 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'context-clues',
        title: 'Context Clues',
        description: 'Memahami makna dari konteks',
        duration: '85 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'critical-reading',
        title: 'Critical Reading',
        description: 'Membaca kritis dan evaluatif',
        duration: '130 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  },
  'penalaran-matematika': {
    id: 'penalaran-matematika',
    title: 'Penalaran Matematika',
    description: 'Kemampuan berpikir logis menggunakan konsep matematika',
    icon: PenTool,
    color: 'teal',
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600',
    totalTopics: 8,
    completedTopics: 1,
    estimatedTime: '8 jam',
    topics: [
      {
        id: 'logika-matematika',
        title: 'Logika Matematika',
        description: 'Penalaran logis dalam matematika',
        duration: '120 menit',
        difficulty: 'Sedang',
        completed: true,
        locked: false
      },
      {
        id: 'pemecahan-masalah',
        title: 'Pemecahan Masalah',
        description: 'Strategi menyelesaikan masalah matematika',
        duration: '140 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'pola-fungsi',
        title: 'Pola dan Fungsi',
        description: 'Mengenali pola dan hubungan fungsional',
        duration: '110 menit',
        difficulty: 'Sedang',
        completed: false,
        locked: false
      },
      {
        id: 'probabilitas',
        title: 'Probabilitas',
        description: 'Konsep peluang dan statistika',
        duration: '100 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'geometri-analitik',
        title: 'Geometri Analitik',
        description: 'Geometri dengan pendekatan aljabar',
        duration: '130 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'kalkulus-dasar',
        title: 'Kalkulus Dasar',
        description: 'Konsep limit dan turunan sederhana',
        duration: '150 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'optimasi',
        title: 'Optimasi',
        description: 'Mencari nilai maksimum dan minimum',
        duration: '140 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      },
      {
        id: 'modeling-matematika',
        title: 'Modeling Matematika',
        description: 'Membuat model matematika dari masalah nyata',
        duration: '160 menit',
        difficulty: 'Sulit',
        completed: false,
        locked: false
      }
    ]
  }
};

const MateriSubtes: React.FC = () => {
  const { subtestId } = useParams<{ subtestId: string }>();
  const [selectedTopic, setSelectedTopic] = useState<MaterialTopic | null>(null);
  
  const subtest = subtestId ? subtestMaterials[subtestId] : null;
  
  if (!subtest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Materi tidak ditemukan</h2>
          <Link to="/materi-belajar" className="text-blue-600 hover:text-blue-700">
            Kembali ke Materi Belajar
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-700';
      case 'Sedang': return 'bg-yellow-100 text-yellow-700';
      case 'Sulit': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const progress = (subtest.completedTopics / subtest.totalTopics) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/materi-belajar" 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${subtest.bgColor}`}>
                  <subtest.icon className={`w-5 h-5 ${subtest.iconColor}`} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{subtest.title}</h1>
                  <p className="text-sm text-gray-500">{subtest.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {subtest.completedTopics}/{subtest.totalTopics} Topik
                </p>
                <p className="text-xs text-gray-500">Estimasi: {subtest.estimatedTime}</p>
              </div>
              <div className="w-24">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Daftar Materi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {subtest.topics.map((topic, index) => {
                    const isLocked = topic.locked;
                    const isCompleted = topic.completed;
                    const isSelected = selectedTopic?.id === topic.id;
                    
                    return (
                      <button
                        key={topic.id}
                        onClick={() => !isLocked && setSelectedTopic(topic)}
                        disabled={isLocked}
                        className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : isLocked ? (
                                <div className="w-5 h-5 rounded-full bg-gray-300" />
                              ) : (
                                <Play className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {topic.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {topic.duration}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getDifficultyColor(topic.difficulty)}`}
                            >
                              {topic.difficulty}
                            </Badge>
                            {!isLocked && <ChevronRight className="w-4 h-4 text-gray-400" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {selectedTopic ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span>{selectedTopic.title}</span>
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{selectedTopic.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{selectedTopic.duration}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={getDifficultyColor(selectedTopic.difficulty)}
                      >
                        {selectedTopic.difficulty}
                      </Badge>
                      {selectedTopic.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Selesai
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {selectedTopic.content ? (
                      <div className="space-y-6">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedTopic.content}
                        </p>
                        
                        {/* Placeholder for actual content */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-blue-900 mb-3">
                            Konten Pembelajaran
                          </h3>
                          <p className="text-blue-700 mb-4">
                            Materi pembelajaran untuk topik "{selectedTopic.title}" akan ditampilkan di sini.
                            Konten dapat berupa teks, gambar, video, atau interactive elements.
                          </p>
                          <div className="flex space-x-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Play className="w-4 h-4 mr-2" />
                              Mulai Belajar
                            </Button>
                            <Button size="sm" variant="outline">
                              <Star className="w-4 h-4 mr-2" />
                              Tandai Favorit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Konten Sedang Dikembangkan
                        </h3>
                        <p className="text-gray-500">
                          Materi untuk topik ini sedang dalam tahap pengembangan.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-24">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Pilih Materi untuk Dipelajari
                    </h3>
                    <p className="text-gray-500">
                      Klik salah satu topik di sidebar untuk memulai pembelajaran.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MateriSubtes;