import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

interface PracticeSessionData {
  id: string;
  title: string;
  description: string;
  duration: string;
  questionCount: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  questions: Question[];
}

interface QuestionProgress {
  questionId: string;
  selectedAnswer: string;
  isAnswered: boolean;
  isChecked: boolean;
  isCorrect: boolean;
}

// Extended sample data with more questions
const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'Manakah dari berikut ini yang merupakan contoh penalaran deduktif?',
    options: [
      { id: 'a', text: 'Semua burung memiliki sayap. Elang adalah burung. Maka elang memiliki sayap.', isCorrect: true },
      { id: 'b', text: 'Saya melihat 5 angsa putih, jadi semua angsa berwarna putih.', isCorrect: false },
      { id: 'c', text: 'Cuaca hari ini cerah, kemungkinan besok juga cerah.', isCorrect: false },
      { id: 'd', text: 'Kebanyakan siswa suka matematika, jadi semua siswa suka matematika.', isCorrect: false }
    ],
    explanation: 'Penalaran deduktif dimulai dari premis umum menuju kesimpulan khusus. Contoh yang benar adalah "Semua burung memiliki sayap. Elang adalah burung. Maka elang memiliki sayap."'
  },
  {
    id: '2',
    text: 'Jika semua A adalah B, dan semua B adalah C, maka dapat disimpulkan bahwa:',
    options: [
      { id: 'a', text: 'Semua A adalah C', isCorrect: true },
      { id: 'b', text: 'Semua C adalah A', isCorrect: false },
      { id: 'c', text: 'Beberapa A adalah C', isCorrect: false },
      { id: 'd', text: 'Tidak ada A yang C', isCorrect: false }
    ],
    explanation: 'Ini adalah contoh silogisme. Jika A⊆B dan B⊆C, maka A⊆C (semua A adalah C).'
  },
  {
    id: '3',
    text: 'Dalam sebuah kelas, 60% siswa suka matematika, 40% suka fisika, dan 20% suka keduanya. Berapa persen siswa yang tidak suka matematika maupun fisika?',
    options: [
      { id: 'a', text: '20%', isCorrect: true },
      { id: 'b', text: '30%', isCorrect: false },
      { id: 'c', text: '40%', isCorrect: false },
      { id: 'd', text: '50%', isCorrect: false }
    ],
    explanation: 'Menggunakan diagram Venn: Siswa yang suka minimal satu = 60% + 40% - 20% = 80%. Jadi yang tidak suka keduanya = 100% - 80% = 20%.'
  },
  {
    id: '4',
    text: 'Manakah pernyataan yang logis benar berdasarkan premis: "Semua mahasiswa rajin. Budi adalah mahasiswa."',
    options: [
      { id: 'a', text: 'Budi rajin', isCorrect: true },
      { id: 'b', text: 'Budi tidak rajin', isCorrect: false },
      { id: 'c', text: 'Budi mungkin rajin', isCorrect: false },
      { id: 'd', text: 'Tidak dapat disimpulkan', isCorrect: false }
    ],
    explanation: 'Berdasarkan silogisme: Premis mayor "Semua mahasiswa rajin", premis minor "Budi adalah mahasiswa", maka kesimpulan "Budi rajin".'
  },
  {
    id: '5',
    text: 'Jika "Tidak ada ikan yang bisa terbang" dan "Semua burung bisa terbang", maka:',
    options: [
      { id: 'a', text: 'Tidak ada ikan yang merupakan burung', isCorrect: true },
      { id: 'b', text: 'Semua burung adalah ikan', isCorrect: false },
      { id: 'c', text: 'Beberapa ikan adalah burung', isCorrect: false },
      { id: 'd', text: 'Semua yang terbang adalah burung', isCorrect: false }
    ],
    explanation: 'Karena ikan tidak bisa terbang dan burung bisa terbang, maka tidak mungkin ada ikan yang merupakan burung.'
  },
  {
    id: '6',
    text: 'Dalam deret: 2, 6, 18, 54, ..., berapakah angka selanjutnya?',
    options: [
      { id: 'a', text: '162', isCorrect: true },
      { id: 'b', text: '108', isCorrect: false },
      { id: 'c', text: '216', isCorrect: false },
      { id: 'd', text: '144', isCorrect: false }
    ],
    explanation: 'Pola deret: setiap angka dikalikan 3. 2×3=6, 6×3=18, 18×3=54, 54×3=162.'
  },
  {
    id: '7',
    text: 'Jika P → Q benar dan Q salah, maka P adalah:',
    options: [
      { id: 'a', text: 'Salah', isCorrect: true },
      { id: 'b', text: 'Benar', isCorrect: false },
      { id: 'c', text: 'Tidak dapat ditentukan', isCorrect: false },
      { id: 'd', text: 'Benar atau salah', isCorrect: false }
    ],
    explanation: 'Dalam logika, jika implikasi P → Q benar dan Q salah, maka P harus salah. Karena jika P benar dan Q salah, maka P → Q akan salah.'
  },
  {
    id: '8',
    text: 'Manakah yang merupakan contoh penalaran induktif?',
    options: [
      { id: 'a', text: 'Matahari terbit dari timur selama 30 hari berturut-turut, jadi matahari selalu terbit dari timur', isCorrect: true },
      { id: 'b', text: 'Semua manusia fana. Socrates manusia. Jadi Socrates fana.', isCorrect: false },
      { id: 'c', text: 'Jika hujan, jalanan basah. Hujan turun. Jadi jalanan basah.', isCorrect: false },
      { id: 'd', text: 'Semua segitiga memiliki tiga sisi. ABC adalah segitiga. Jadi ABC memiliki tiga sisi.', isCorrect: false }
    ],
    explanation: 'Penalaran induktif berangkat dari observasi khusus menuju kesimpulan umum. Mengamati matahari terbit dari timur berulang kali lalu menyimpulkan pola umum adalah contoh penalaran induktif.'
  },
  {
    id: '9',
    text: 'Dalam diagram Venn, jika himpunan A dan B tidak berpotongan, maka:',
    options: [
      { id: 'a', text: 'A ∩ B = ∅', isCorrect: true },
      { id: 'b', text: 'A ∪ B = ∅', isCorrect: false },
      { id: 'c', text: 'A ⊆ B', isCorrect: false },
      { id: 'd', text: 'B ⊆ A', isCorrect: false }
    ],
    explanation: 'Jika dua himpunan tidak berpotongan (disjoint), maka irisan mereka adalah himpunan kosong (A ∩ B = ∅).'
  },
  {
    id: '10',
    text: 'Jika "Semua dokter pintar" dan "Beberapa orang pintar kaya", maka dapat disimpulkan:',
    options: [
      { id: 'a', text: 'Tidak dapat disimpulkan apapun tentang dokter dan kekayaan', isCorrect: true },
      { id: 'b', text: 'Semua dokter kaya', isCorrect: false },
      { id: 'c', text: 'Beberapa dokter kaya', isCorrect: false },
      { id: 'd', text: 'Tidak ada dokter yang kaya', isCorrect: false }
    ],
    explanation: 'Dari premis yang diberikan, kita tidak bisa menyimpulkan hubungan pasti antara dokter dan kekayaan karena tidak semua orang pintar kaya.'
  }
];

const PracticeSession: React.FC = () => {
  const { subtestId, topicId } = useParams<{ subtestId: string; topicId: string }>();
  // const navigate = useNavigate(); // Removed unused variable
  
  // State for current question and progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Progress tracking
  const [questionProgress, setQuestionProgress] = useState<{ [key: string]: QuestionProgress }>({});
  
  const sessionData: PracticeSessionData = {
    id: topicId || 'default',
    title: 'Penalaran Umum - Logika Dasar',
    description: 'Latihan soal penalaran logika dan analisis',
    duration: 'Unlimited',
    questionCount: sampleQuestions.length,
    difficulty: 'Sedang',
    questions: sampleQuestions
  };

  const currentQuestion = sessionData.questions[currentQuestionIndex];
  const progressKey = `practice_${subtestId}_${topicId}`;

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setQuestionProgress(parsed.questionProgress || {});
      
      // Find the last answered question
      const lastAnsweredIndex = Math.max(
        0,
        ...Object.values(parsed.questionProgress || {})
          .map((progress: any, index) => progress.isChecked ? index : -1)
      );
      
      if (lastAnsweredIndex >= 0) {
        setCurrentQuestionIndex(Math.min(lastAnsweredIndex + 1, sessionData.questions.length - 1));
      }
    }
  }, [progressKey, sessionData.questions.length]);

  // Load current question state
  useEffect(() => {
    const currentProgress = currentQuestion?.id ? questionProgress[currentQuestion.id] : undefined;
    if (currentProgress) {
      setSelectedAnswer(currentProgress.selectedAnswer || '');
      setIsAnswerChecked(currentProgress.isChecked || false);
      setShowExplanation(currentProgress.isChecked || false);
    } else {
      setSelectedAnswer('');
      setIsAnswerChecked(false);
      setShowExplanation(false);
    }
  }, [currentQuestionIndex, questionProgress, currentQuestion?.id]);

  // Save progress to localStorage
  const saveProgress = (updatedProgress: { [key: string]: QuestionProgress }) => {
    const progressData = {
      questionProgress: updatedProgress,
      lastUpdated: new Date().toISOString(),
      currentIndex: currentQuestionIndex
    };
    localStorage.setItem(progressKey, JSON.stringify(progressData));
    setQuestionProgress(updatedProgress);
  };

  const handleAnswerSelect = (optionId: string) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(optionId);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) {
      alert('Silakan pilih jawaban terlebih dahulu!');
      return;
    }

    const correctOption = currentQuestion?.options.find(opt => opt.isCorrect);
    const isCorrect = selectedAnswer === correctOption?.id;

    const updatedProgress = {
      ...questionProgress,
      [currentQuestion?.id || '']: {
        questionId: currentQuestion?.id || '',
        selectedAnswer,
        isAnswered: true,
        isChecked: true,
        isCorrect
      }
    };

    saveProgress(updatedProgress);
    setIsAnswerChecked(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!isAnswerChecked) {
      alert('Silakan cek jawaban terlebih dahulu!');
      return;
    }

    if (currentQuestionIndex < sessionData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (!isAnswerChecked) {
      alert('Silakan cek jawaban terlebih dahulu!');
      return;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800';
      case 'Sedang': return 'bg-yellow-100 text-yellow-800';
      case 'Sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnsweredCount = () => {
    return Object.values(questionProgress).filter(p => p.isChecked).length;
  };

  const getCorrectCount = () => {
    return Object.values(questionProgress).filter(p => p.isChecked && p.isCorrect).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to={`/practice/${subtestId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{sessionData.title}</h1>
              <p className="text-muted-foreground">{sessionData.description}</p>
            </div>
          </div>
          <Badge className={getDifficultyColor(sessionData.difficulty)}>
            {sessionData.difficulty}
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress Latihan</span>
              <span className="text-sm text-muted-foreground">
                {getAnsweredCount()} dari {sessionData.questions.length} soal dijawab
              </span>
            </div>
            <Progress value={(getAnsweredCount() / sessionData.questions.length) * 100} className="mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Soal ke-{currentQuestionIndex + 1}</span>
              <span>{getCorrectCount()} jawaban benar</span>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Soal {currentQuestionIndex + 1}
              </CardTitle>
              {currentQuestion && questionProgress[currentQuestion.id]?.isChecked && (
                <div className="flex items-center gap-2">
                  {questionProgress[currentQuestion.id]?.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    questionProgress[currentQuestion.id]?.isCorrect 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {questionProgress[currentQuestion.id]?.isCorrect ? 'Benar' : 'Salah'}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{currentQuestion?.text}</p>
            
            <div className="space-y-3 mb-6">
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = option.isCorrect;
                const showResult = isAnswerChecked;
                
                let buttonClass = 'w-full text-left p-4 border rounded-lg transition-all ';
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += 'border-green-500 bg-green-50 text-green-800';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-red-500 bg-red-50 text-red-800';
                  } else {
                    buttonClass += 'border-gray-200 bg-gray-50 text-gray-600';
                  }
                } else {
                  if (isSelected) {
                    buttonClass += 'border-blue-500 bg-blue-50 text-blue-800';
                  } else {
                    buttonClass += 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
                  }
                }
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={isAnswerChecked}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.id.toUpperCase()}. {option.text}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Check Answer Button */}
            {!isAnswerChecked && (
              <div className="flex justify-center mb-4">
                <Button 
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className="px-8"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Cek Jawaban
                </Button>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Pembahasan:</h4>
                    <p className="text-blue-700">{currentQuestion?.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || !isAnswerChecked}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} dari {sessionData.questions.length}
          </span>
          
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === sessionData.questions.length - 1 || !isAnswerChecked}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;