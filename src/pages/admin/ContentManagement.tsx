import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  BookOpen,
  FileText,
  Target,
  MoreHorizontal,
  Calendar,
  Users,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminNavigation from "@/components/AdminNavigation";

interface Material {
  id: string;
  title: string;
  subtest: string;
  topic: string;
  type: string;
  status: string;
  author: string;
  createdAt: string;
  views: number;
  downloads: number;
}

interface Question {
  id: string;
  question: string;
  subtest: string;
  topic: string;
  difficulty: string;
  type: string;
  status: string;
  author: string;
  createdAt: string;
  usageCount: number;
}

interface TryOut {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  status: string;
  scheduledDate: string;
  participants: number;
  createdAt: string;
}

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("materials");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubtest, setFilterSubtest] = useState("all");

  // Mock data
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      title: "Penalaran Umum - Logika Dasar",
      subtest: "TPS",
      topic: "Penalaran Umum",
      type: "PDF",
      status: "published",
      author: "Admin",
      createdAt: "2024-01-15",
      views: 2847,
      downloads: 1234
    },
    {
      id: "2",
      title: "Fungsi dan Grafik - Konsep Lengkap",
      subtest: "Matematika",
      topic: "Fungsi",
      type: "Video",
      status: "draft",
      author: "Dr. Matematika",
      createdAt: "2024-01-14",
      views: 1892,
      downloads: 567
    },
    {
      id: "3",
      title: "Teks Argumentasi - Analisis Struktur",
      subtest: "Literasi",
      topic: "Teks Argumentasi",
      type: "PDF",
      status: "pending",
      author: "Prof. Bahasa",
      createdAt: "2024-01-13",
      views: 2156,
      downloads: 890
    }
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "Jika semua A adalah B, dan semua B adalah C, maka...",
      subtest: "TPS",
      topic: "Penalaran Umum",
      difficulty: "Mudah",
      type: "Multiple Choice",
      status: "active",
      author: "Admin",
      createdAt: "2024-01-15",
      usageCount: 156
    },
    {
      id: "2",
      question: "Tentukan nilai x dari persamaan 2x + 5 = 13",
      subtest: "Matematika",
      topic: "Aljabar",
      difficulty: "Mudah",
      type: "Multiple Choice",
      status: "active",
      author: "Dr. Matematika",
      createdAt: "2024-01-14",
      usageCount: 234
    },
    {
      id: "3",
      question: "Bacalah teks berikut dan tentukan ide pokok paragraf...",
      subtest: "Literasi",
      topic: "Pemahaman Bacaan",
      difficulty: "Menengah",
      type: "Multiple Choice",
      status: "review",
      author: "Prof. Bahasa",
      createdAt: "2024-01-13",
      usageCount: 89
    }
  ]);

  const [tryouts, setTryouts] = useState<TryOut[]>([
    {
      id: "1",
      title: "SNBT Try Out #15 - Simulasi Lengkap",
      description: "Try out lengkap dengan 3 subtest sesuai format SNBT terbaru",
      duration: 180,
      totalQuestions: 120,
      status: "active",
      scheduledDate: "2024-01-20",
      participants: 1247,
      createdAt: "2024-01-10"
    },
    {
      id: "2",
      title: "SNBT Try Out #16 - Focus TPS",
      description: "Try out khusus untuk subtest TPS dengan soal-soal terbaru",
      duration: 90,
      totalQuestions: 60,
      status: "scheduled",
      scheduledDate: "2024-01-25",
      participants: 0,
      createdAt: "2024-01-12"
    },
    {
      id: "3",
      title: "SNBT Try Out #14 - Evaluasi Lengkap",
      description: "Try out evaluasi dengan analisis mendalam",
      duration: 180,
      totalQuestions: 120,
      status: "completed",
      scheduledDate: "2024-01-15",
      participants: 892,
      createdAt: "2024-01-08"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "pending":
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "mudah":
        return "bg-green-100 text-green-800";
      case "menengah":
        return "bg-yellow-100 text-yellow-800";
      case "sulit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubtestColor = (subtest: string) => {
    switch (subtest?.toLowerCase()) {
      case "tps":
        return "bg-blue-100 text-blue-800";
      case "literasi":
        return "bg-green-100 text-green-800";
      case "matematika":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Management 📚</h1>
          <p className="text-muted-foreground">Kelola semua konten pembelajaran, soal, dan try out</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari konten..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSubtest} onValueChange={setFilterSubtest}>
                <SelectTrigger>
                  <SelectValue placeholder="Subtest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Subtest</SelectItem>
                  <SelectItem value="tps">TPS</SelectItem>
                  <SelectItem value="literasi">Literasi</SelectItem>
                  <SelectItem value="matematika">Matematika</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials">Materi</TabsTrigger>
            <TabsTrigger value="questions">Soal</TabsTrigger>
            <TabsTrigger value="tryouts">Try Out</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Manajemen Materi
                  </CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Materi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Subtest</TableHead>
                      <TableHead>Topik</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>
                          <Badge className={getSubtestColor(material.subtest)}>
                            {material.subtest}
                          </Badge>
                        </TableCell>
                        <TableCell>{material.topic}</TableCell>
                        <TableCell>{material.type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(material.status)}>
                            {material.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{material.author}</TableCell>
                        <TableCell>{material.views.toLocaleString()}</TableCell>
                        <TableCell>{material.downloads.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Manajemen Soal
                  </CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Soal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Soal</TableHead>
                      <TableHead>Subtest</TableHead>
                      <TableHead>Topik</TableHead>
                      <TableHead>Tingkat</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {question.question}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSubtestColor(question.subtest)}>
                            {question.subtest}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.topic}</TableCell>
                        <TableCell>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(question.status)}>
                            {question.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.usageCount}x</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tryouts" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Manajemen Try Out
                  </CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Buat Try Out
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Soal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Jadwal</TableHead>
                      <TableHead>Peserta</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tryouts.map((tryout) => (
                      <TableRow key={tryout.id}>
                        <TableCell className="font-medium">{tryout.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {tryout.duration} menit
                          </div>
                        </TableCell>
                        <TableCell>{tryout.totalQuestions} soal</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tryout.status)}>
                            {tryout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {tryout.scheduledDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {tryout.participants.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentManagement;