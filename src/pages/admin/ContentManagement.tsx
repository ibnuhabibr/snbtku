import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  FileText,
  Target,
  MoreHorizontal,
  Calendar,
  Users,
  Clock,
  Save,
  X
} from "lucide-react";
import AdminNavigation from "@/components/AdminNavigation";
import { adminService, Question, QuestionFormData, TryoutPackage, TryoutPackageFormData } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

// Interfaces are now imported from adminService

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  // const [loading, setLoading] = useState(false); // Removed unused variable
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tryoutPackages, setTryoutPackages] = useState<TryoutPackage[]>([]);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isTryoutDialogOpen, setIsTryoutDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingTryout, setEditingTryout] = useState<TryoutPackage | null>(null);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadQuestions();
    loadTryoutPackages();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await adminService.getQuestions();
      setQuestions(response.questions || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive"
      });
    }
  };

  const loadTryoutPackages = async () => {
    try {
      const response = await adminService.getTryoutPackages();
      setTryoutPackages(response.packages || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tryout packages",
        variant: "destructive"
      });
    }
  };

  const handleCreateQuestion = async (data: QuestionFormData) => {
    try {
      await adminService.createQuestion(data);
      toast({
        title: "Success",
        description: "Question created successfully"
      });
      setIsQuestionDialogOpen(false);
      loadQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create question",
        variant: "destructive"
      });
    }
  };

  const handleUpdateQuestion = async (id: string, data: QuestionFormData) => {
    try {
      await adminService.updateQuestion(id, data);
      toast({
        title: "Success",
        description: "Question updated successfully"
      });
      setEditingQuestion(null);
      loadQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive"
      });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await adminService.deleteQuestion(id);
      toast({
        title: "Success",
        description: "Question deleted successfully"
      });
      loadQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  const handleCreateTryoutPackage = async (data: TryoutPackageFormData) => {
    try {
      await adminService.createTryoutPackage(data);
      toast({
        title: "Success",
        description: "Tryout package created successfully"
      });
      setIsTryoutDialogOpen(false);
      loadTryoutPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tryout package",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTryoutPackage = async (id: string, data: TryoutPackageFormData) => {
    try {
      await adminService.updateTryoutPackage(id, data);
      toast({
        title: "Success",
        description: "Tryout package updated successfully"
      });
      setEditingTryout(null);
      loadTryoutPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tryout package",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTryoutPackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tryout package?')) return;
    
    try {
      await adminService.deleteTryoutPackage(id);
      toast({
        title: "Success",
        description: "Tryout package deleted successfully"
      });
      loadTryoutPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tryout package",
        variant: "destructive"
      });
    }
  };

  // Filter functions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || question.review_status === filterStatus;
    const matchesSubject = filterSubject === 'all' || question.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const filteredTryoutPackages = tryoutPackages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (pkg.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (pkg.is_active ? 'active' : 'inactive') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject?.toLowerCase()) {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 md:pt-20">
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Subject</SelectItem>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Soal</TabsTrigger>
            <TabsTrigger value="tryouts">Try Out Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Manajemen Soal
                  </CardTitle>
                  <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Soal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Tambah Soal Baru</DialogTitle>
                      </DialogHeader>
                      <QuestionForm onSubmit={handleCreateQuestion} onCancel={() => setIsQuestionDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Sub Topic</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {question.question_text}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSubjectColor(question.subject)}>
                            {question.subject}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.sub_topic || '-'}</TableCell>
                        <TableCell>
                          <Badge className={getDifficultyColor(question.difficulty_level)}>
                            {question.difficulty_level}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.question_type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(question.review_status)}>
                            {question.review_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(question.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(question)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
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
                    Manajemen Tryout Packages
                  </CardTitle>
                  <Dialog open={isTryoutDialogOpen} onOpenChange={setIsTryoutDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Package
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Tambah Tryout Package Baru</DialogTitle>
                      </DialogHeader>
                      <TryoutPackageForm onSubmit={handleCreateTryoutPackage} onCancel={() => setIsTryoutDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTryoutPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.title}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {pkg.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDifficultyColor(pkg.difficulty_level)}>
                            {pkg.difficulty_level}
                          </Badge>
                        </TableCell>
                        <TableCell>{pkg.total_questions}</TableCell>
                        <TableCell>{pkg.duration_minutes} min</TableCell>
                        <TableCell>Rp {pkg.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pkg.is_active ? 'active' : 'inactive')}>
                            {pkg.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(pkg.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditingTryout(pkg)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteTryoutPackage(pkg.id)}>
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
                    {filteredTryoutPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {pkg.duration_minutes} menit
                          </div>
                        </TableCell>
                        <TableCell>{pkg.total_questions} soal</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pkg.is_active ? 'active' : 'inactive')}>
                            {pkg.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(pkg.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Rp {pkg.price.toLocaleString()}
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

        {/* Question Dialog */}
        <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru'}</DialogTitle>
            </DialogHeader>
            <QuestionForm 
              question={editingQuestion} 
              onSubmit={editingQuestion ? 
                (data: QuestionFormData) => handleUpdateQuestion(editingQuestion.id, data) : 
                handleCreateQuestion
              } 
              onCancel={() => {
                setIsQuestionDialogOpen(false);
                setEditingQuestion(null);
              }} 
            />
          </DialogContent>
        </Dialog>

        {/* Tryout Package Dialog */}
        <Dialog open={isTryoutDialogOpen} onOpenChange={setIsTryoutDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTryout ? 'Edit Tryout Package' : 'Tambah Tryout Package Baru'}</DialogTitle>
            </DialogHeader>
            <TryoutPackageForm 
              tryoutPackage={editingTryout} 
              onSubmit={editingTryout ? 
                (data: TryoutPackageFormData) => handleUpdateTryoutPackage(editingTryout.id, data) : 
                handleCreateTryoutPackage
              } 
              onCancel={() => {
                setIsTryoutDialogOpen(false);
                setEditingTryout(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Question Form Component
interface QuestionFormProps {
  question?: Question | null;
  onSubmit: (data: QuestionFormData) => void;
  onCancel: () => void;
}

function QuestionForm({ question, onSubmit, onCancel }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: question?.question_text || '',
    subject: question?.subject || 'TPS',
    sub_topic: question?.sub_topic || '',
    difficulty_level: question?.difficulty_level || 'easy',
    question_type: question?.question_type || 'multiple_choice',
    options: question?.options || ['', '', '', '', ''],
    correct_answer: question?.correct_answer || '',
    explanation: question?.explanation || '',
    time_limit_seconds: question?.time_limit_seconds || 120
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question_text">Pertanyaan</Label>
        <Textarea
          id="question_text"
          value={formData.question_text}
          onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TPS">TPS</SelectItem>
              <SelectItem value="Literasi">Literasi</SelectItem>
              <SelectItem value="Numerasi">Numerasi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sub_topic">Sub Topic</Label>
          <Input
            id="sub_topic"
            value={formData.sub_topic}
            onChange={(e) => setFormData({ ...formData, sub_topic: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="difficulty_level">Difficulty</Label>
          <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="question_type">Type</Label>
          <Select value={formData.question_type} onValueChange={(value) => setFormData({ ...formData, question_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="essay">Essay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.question_type === 'multiple_choice' && (
        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {formData.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-6 text-sm font-medium">{String.fromCharCode(65 + index)}.</span>
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="correct_answer">Correct Answer</Label>
        <Input
          id="correct_answer"
          value={formData.correct_answer}
          onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
          placeholder={formData.question_type === 'multiple_choice' ? 'A, B, C, D, or E' : 'Correct answer'}
          required
        />
      </div>

      <div>
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="time_limit_seconds">Time Limit (seconds)</Label>
        <Input
          id="time_limit_seconds"
          type="number"
          value={formData.time_limit_seconds}
          onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) || 120 })}
          min={30}
          max={600}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-1" />
          {question ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

// Tryout Package Form Component
interface TryoutPackageFormProps {
  tryoutPackage?: TryoutPackage | null;
  onSubmit: (data: TryoutPackageFormData) => void;
  onCancel: () => void;
}

function TryoutPackageForm({ tryoutPackage, onSubmit, onCancel }: TryoutPackageFormProps) {
  const [formData, setFormData] = useState<TryoutPackageFormData>({
    title: tryoutPackage?.title || '',
    description: tryoutPackage?.description || '',
    category: tryoutPackage?.category || 'SNBT',
    difficulty_level: tryoutPackage?.difficulty_level || 'medium',
    duration_minutes: tryoutPackage?.duration_minutes || 180,
    total_questions: tryoutPackage?.total_questions || 0,
    price: tryoutPackage?.price || 0,
    is_active: tryoutPackage?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SNBT">SNBT</SelectItem>
              <SelectItem value="UTBK">UTBK</SelectItem>
              <SelectItem value="Simulasi">Simulasi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="difficulty_level">Difficulty</Label>
          <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="duration_minutes">Duration (minutes)</Label>
          <Input
            id="duration_minutes"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 180 })}
            min={30}
            max={300}
            required
          />
        </div>

        <div>
          <Label htmlFor="total_questions">Total Questions</Label>
          <Input
            id="total_questions"
            type="number"
            value={formData.total_questions}
            onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) || 0 })}
            min={1}
            max={200}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price (Rp)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
            min={0}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-1" />
          {tryoutPackage ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default ContentManagement;