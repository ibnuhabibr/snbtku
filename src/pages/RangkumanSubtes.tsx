import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Calculator, 
  Globe, 
  Languages, 
  PenTool,
  ArrowLeft,
  Eye,
  Download,
  FileDown
} from 'lucide-react';

interface RangkumanMaterial {
  id: string;
  title: string;
  description: string;
  driveUrl: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  pages: number;
}

interface SubtesInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  materials: RangkumanMaterial[];
}

const subtesData: { [key: string]: SubtesInfo } = {
  'penalaran-umum': {
    id: 'penalaran-umum',
    title: 'Penalaran Umum',
    description: 'Kemampuan berpikir logis dan analitis untuk memecahkan masalah',
    icon: <Brain className="h-8 w-8" />,
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    materials: [
      {
        id: 'logika-deduktif',
        title: 'Logika Deduktif',
        description: 'Rangkuman lengkap tentang penalaran deduktif dan aplikasinya',
        driveUrl: 'https://drive.google.com/file/d/sample-logika-deduktif/view',
        difficulty: 'Sedang',
        pages: 15
      },
      {
        id: 'analogi',
        title: 'Analogi',
        description: 'Materi tentang perbandingan dan hubungan antar konsep',
        driveUrl: 'https://drive.google.com/file/d/sample-analogi/view',
        difficulty: 'Mudah',
        pages: 12
      },
      {
        id: 'pola-bilangan',
        title: 'Pola Bilangan',
        description: 'Rangkuman pola dan deret bilangan dalam penalaran',
        driveUrl: 'https://drive.google.com/file/d/sample-pola-bilangan/view',
        difficulty: 'Sedang',
        pages: 18
      },
      {
        id: 'silogisme',
        title: 'Silogisme',
        description: 'Penalaran logis dengan premis dan kesimpulan',
        driveUrl: 'https://drive.google.com/file/d/sample-silogisme/view',
        difficulty: 'Sulit',
        pages: 20
      }
    ]
  },
  'pengetahuan-pemahaman-umum': {
    id: 'pengetahuan-pemahaman-umum',
    title: 'Pengetahuan dan Pemahaman Umum',
    description: 'Wawasan umum tentang berbagai bidang pengetahuan',
    icon: <Globe className="h-8 w-8" />,
    color: 'text-green-600',
    bgGradient: 'from-green-50 to-green-100',
    materials: [
      {
        id: 'sejarah-indonesia',
        title: 'Sejarah Indonesia',
        description: 'Rangkuman sejarah Indonesia dari masa ke masa',
        driveUrl: 'https://drive.google.com/file/d/sample-sejarah-indonesia/view',
        difficulty: 'Mudah',
        pages: 25
      },
      {
        id: 'geografi-indonesia',
        title: 'Geografi Indonesia',
        description: 'Kondisi geografis dan wilayah Indonesia',
        driveUrl: 'https://drive.google.com/file/d/sample-geografi-indonesia/view',
        difficulty: 'Mudah',
        pages: 22
      },
      {
        id: 'sains-umum',
        title: 'Sains Umum',
        description: 'Pengetahuan dasar sains dan teknologi',
        driveUrl: 'https://drive.google.com/file/d/sample-sains-umum/view',
        difficulty: 'Sedang',
        pages: 30
      },
      {
        id: 'budaya-indonesia',
        title: 'Budaya Indonesia',
        description: 'Kekayaan budaya dan tradisi Indonesia',
        driveUrl: 'https://drive.google.com/file/d/sample-budaya-indonesia/view',
        difficulty: 'Mudah',
        pages: 18
      }
    ]
  },
  'bacaan-menulis': {
    id: 'bacaan-menulis',
    title: 'Kemampuan Memahami Bacaan dan Menulis',
    description: 'Kemampuan memahami teks dan mengekspresikan ide dalam tulisan',
    icon: <FileText className="h-8 w-8" />,
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    materials: [
      {
        id: 'pemahaman-bacaan',
        title: 'Pemahaman Bacaan',
        description: 'Teknik memahami dan menganalisis teks bacaan',
        driveUrl: 'https://drive.google.com/file/d/sample-pemahaman-bacaan/view',
        difficulty: 'Sedang',
        pages: 20
      },
      {
        id: 'struktur-teks',
        title: 'Struktur Teks',
        description: 'Berbagai jenis struktur dan organisasi teks',
        driveUrl: 'https://drive.google.com/file/d/sample-struktur-teks/view',
        difficulty: 'Sedang',
        pages: 16
      },
      {
        id: 'ejaan-tata-bahasa',
        title: 'Ejaan dan Tata Bahasa',
        description: 'Aturan ejaan dan tata bahasa Indonesia yang benar',
        driveUrl: 'https://drive.google.com/file/d/sample-ejaan-tata-bahasa/view',
        difficulty: 'Mudah',
        pages: 14
      }
    ]
  },
  'pengetahuan-kuantitatif': {
    id: 'pengetahuan-kuantitatif',
    title: 'Pengetahuan Kuantitatif',
    description: 'Kemampuan menggunakan angka dan konsep matematika dasar',
    icon: <Calculator className="h-8 w-8" />,
    color: 'text-orange-600',
    bgGradient: 'from-orange-50 to-orange-100',
    materials: [
      {
        id: 'aritmatika',
        title: 'Aritmatika',
        description: 'Operasi dasar bilangan dan perhitungan',
        driveUrl: 'https://drive.google.com/file/d/sample-aritmatika/view',
        difficulty: 'Mudah',
        pages: 18
      },
      {
        id: 'aljabar',
        title: 'Aljabar',
        description: 'Persamaan, pertidaksamaan, dan fungsi',
        driveUrl: 'https://drive.google.com/file/d/sample-aljabar/view',
        difficulty: 'Sulit',
        pages: 25
      },
      {
        id: 'geometri',
        title: 'Geometri',
        description: 'Bangun datar, ruang, dan pengukuran',
        driveUrl: 'https://drive.google.com/file/d/sample-geometri/view',
        difficulty: 'Sedang',
        pages: 22
      },
      {
        id: 'statistika',
        title: 'Statistika',
        description: 'Pengolahan data dan peluang',
        driveUrl: 'https://drive.google.com/file/d/sample-statistika/view',
        difficulty: 'Sedang',
        pages: 20
      }
    ]
  },
  'literasi-indonesia': {
    id: 'literasi-indonesia',
    title: 'Literasi dalam Bahasa Indonesia',
    description: 'Kemampuan memahami dan menggunakan bahasa Indonesia dengan baik',
    icon: <Languages className="h-8 w-8" />,
    color: 'text-red-600',
    bgGradient: 'from-red-50 to-red-100',
    materials: [
      {
        id: 'teks-naratif',
        title: 'Teks Naratif',
        description: 'Struktur dan ciri-ciri teks naratif',
        driveUrl: 'https://drive.google.com/file/d/sample-teks-naratif/view',
        difficulty: 'Mudah',
        pages: 16
      },
      {
        id: 'teks-eksposisi',
        title: 'Teks Eksposisi',
        description: 'Teks yang menyajikan informasi dan penjelasan',
        driveUrl: 'https://drive.google.com/file/d/sample-teks-eksposisi/view',
        difficulty: 'Sedang',
        pages: 18
      },
      {
        id: 'teks-argumentasi',
        title: 'Teks Argumentasi',
        description: 'Teks yang berisi pendapat dan alasan',
        driveUrl: 'https://drive.google.com/file/d/sample-teks-argumentasi/view',
        difficulty: 'Sedang',
        pages: 20
      },
      {
        id: 'kosakata',
        title: 'Kosakata',
        description: 'Pengembangan dan penggunaan kosakata',
        driveUrl: 'https://drive.google.com/file/d/sample-kosakata/view',
        difficulty: 'Mudah',
        pages: 12
      }
    ]
  },
  'literasi-inggris': {
    id: 'literasi-inggris',
    title: 'Literasi dalam Bahasa Inggris',
    description: 'Kemampuan memahami dan menggunakan bahasa Inggris',
    icon: <Globe className="h-8 w-8" />,
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-50 to-indigo-100',
    materials: [
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension',
        description: 'Teknik memahami teks bahasa Inggris',
        driveUrl: 'https://drive.google.com/file/d/sample-reading-comprehension/view',
        difficulty: 'Sulit',
        pages: 24
      },
      {
        id: 'grammar',
        title: 'Grammar',
        description: 'Tata bahasa Inggris dasar hingga menengah',
        driveUrl: 'https://drive.google.com/file/d/sample-grammar/view',
        difficulty: 'Sedang',
        pages: 28
      },
      {
        id: 'vocabulary',
        title: 'Vocabulary',
        description: 'Kosakata bahasa Inggris untuk SNBT',
        driveUrl: 'https://drive.google.com/file/d/sample-vocabulary/view',
        difficulty: 'Sedang',
        pages: 22
      },
      {
        id: 'text-analysis',
        title: 'Text Analysis',
        description: 'Analisis struktur dan makna teks Inggris',
        driveUrl: 'https://drive.google.com/file/d/sample-text-analysis/view',
        difficulty: 'Sulit',
        pages: 26
      }
    ]
  },
  'penalaran-matematika': {
    id: 'penalaran-matematika',
    title: 'Penalaran Matematika',
    description: 'Kemampuan berpikir logis menggunakan konsep matematika',
    icon: <PenTool className="h-8 w-8" />,
    color: 'text-teal-600',
    bgGradient: 'from-teal-50 to-teal-100',
    materials: [
      {
        id: 'logika-matematika',
        title: 'Logika Matematika',
        description: 'Penalaran logis dalam konteks matematika',
        driveUrl: 'https://drive.google.com/file/d/sample-logika-matematika/view',
        difficulty: 'Sulit',
        pages: 30
      },
      {
        id: 'pemecahan-masalah',
        title: 'Pemecahan Masalah',
        description: 'Strategi menyelesaikan soal matematika',
        driveUrl: 'https://drive.google.com/file/d/sample-pemecahan-masalah/view',
        difficulty: 'Sulit',
        pages: 28
      },
      {
        id: 'pola-fungsi',
        title: 'Pola dan Fungsi',
        description: 'Pola bilangan dan konsep fungsi',
        driveUrl: 'https://drive.google.com/file/d/sample-pola-fungsi/view',
        difficulty: 'Sedang',
        pages: 24
      },
      {
        id: 'probabilitas',
        title: 'Probabilitas',
        description: 'Konsep peluang dan statistika',
        driveUrl: 'https://drive.google.com/file/d/sample-probabilitas/view',
        difficulty: 'Sedang',
        pages: 22
      }
    ]
  }
};

const RangkumanSubtes: React.FC = () => {
  const { subtesId } = useParams<{ subtesId: string }>();
  const subtes = subtesId ? subtesData[subtesId] : null;

  if (!subtes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Subtes Tidak Ditemukan</h1>
          <p className="text-lg text-muted-foreground mb-8">Subtes yang Anda cari tidak tersedia.</p>
          <Link to="/materi-belajar">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Materi Belajar
            </Button>
          </Link>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/materi-belajar" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Materi Belajar
          </Link>
          
          <div className="text-center">
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${subtes.bgGradient} mb-4`}>
              <div className={`${subtes.color}`}>
                {subtes.icon}
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rangkuman {subtes.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {subtes.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <FileDown className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{subtes.materials.length}</h3>
              <p className="text-muted-foreground">Materi Tersedia</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {subtes.materials.reduce((total, material) => total + material.pages, 0)}
              </h3>
              <p className="text-muted-foreground">Total Halaman</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Download className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">PDF</h3>
              <p className="text-muted-foreground">Format Rangkuman</p>
            </CardContent>
          </Card>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subtes.materials.map((material) => (
            <Card key={material.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {material.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(material.difficulty)}>
                    {material.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {material.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {material.pages} halaman
                    </span>
                    <span className="flex items-center">
                      <FileDown className="h-4 w-4 mr-1" />
                      PDF
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => window.open(material.driveUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Rangkuman
                    <Download className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RangkumanSubtes;