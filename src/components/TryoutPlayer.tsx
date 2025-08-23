import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle, 
  Circle, 
  AlertCircle,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ITryoutPackageSNBT } from '@/types/konten';

interface TryoutPlayerProps {
  paketTryout: ITryoutPackageSNBT;
}

type AnswerStatus = 'unanswered' | 'answered' | 'doubtful';

interface UserAnswer {
  soalId: string;
  jawaban: string;
  status: AnswerStatus;
  waktuJawab: Date;
}

interface BlockResult {
  blockIndex: number;
  blockName: string;
  totalSoal: number;
  terjawab: number;
  benar: number;
  salah: number;
  kosong: number;
  raguRagu: number;
}

// Memoized Question Component for better performance
const Question = memo(({ 
  soal, 
  userAnswer, 
  onAnswerChange, 
  onStatusChange 
}: { 
  soal: any; 
  userAnswer: UserAnswer | undefined; 
  onAnswerChange: (jawaban: string) => void; 
  onStatusChange: (status: AnswerStatus) => void; 
}) => {
  return (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none">
        <h3 className="text-lg font-medium">{soal.pertanyaan}</h3>
      </div>
      
      <RadioGroup 
        value={userAnswer?.jawaban || ''} 
        onValueChange={onAnswerChange}
        className="space-y-3"
      >
        {Object.entries(soal.pilihan_jawaban).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
            <RadioGroupItem value={key} id={`answer-${key}`} />
            <Label htmlFor={`answer-${key}`} className="flex-grow cursor-pointer">{String(value)}</Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="flex space-x-2 mt-4">
        <Button 
          variant={userAnswer?.status === 'doubtful' ? 'destructive' : 'outline'} 
          size="sm"
          onClick={() => onStatusChange(userAnswer?.status === 'doubtful' ? 'answered' : 'doubtful')}
        >
          <Flag className="mr-1 h-4 w-4" />
          {userAnswer?.status === 'doubtful' ? 'Tandai Ragu-ragu' : 'Batalkan Ragu-ragu'}
        </Button>
      </div>
    </div>
  );
});

Question.displayName = 'Question'; // Required for memo components in React DevTools

// Memoized Timer Component for better performance
const Timer = memo(({ seconds }: { seconds: number; onTimeUp?: () => void }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  // Warning condition when less than 5 minutes left
  const isWarning = seconds < 300;
  
  return (
    <div className={cn(
      "flex items-center space-x-2 text-lg font-mono", 
      isWarning ? "text-red-600 animate-pulse" : ""
    )}>
      <Clock className="h-5 w-5" />
      <span>{formattedTime}</span>
    </div>
  );
});

Timer.displayName = 'Timer'; // Required for memo components in React DevTools

const TryoutPlayer: React.FC<TryoutPlayerProps> = ({ paketTryout }) => {
  // State Management
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<BlockResult[]>([]);

  // Get current block and soal - memoized to prevent re-calculations
  const currentBlock = useMemo(() => paketTryout.blocks[currentBlockIndex], [paketTryout.blocks, currentBlockIndex]);
  const currentSoalId = useMemo(() => currentBlock?.soal_ids[currentSoalIndex], [currentBlock, currentSoalIndex]);
  const totalBlocks = useMemo(() => paketTryout.blocks.length, [paketTryout.blocks]);
  
  // TODO: This should fetch actual soal data from API or props
  // For now, creating a mock soal object to prevent TypeScript errors
  const currentSoal = useMemo(() => currentSoalId ? {
    id: currentSoalId,
    subtest: 'Penalaran Umum' as const,
    pertanyaan: 'Soal akan dimuat dari server...',
    pilihan_jawaban: { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E' },
    jawaban_benar: 'A' as const,
    pembahasan: '',
    tingkat_kesulitan: 'Sedang' as const,
    kategori_kognitif: 'C1' as const,
    waktu_pengerjaan_detik: 120,
    tags: [],
    created_at: new Date(),
    updated_at: new Date()
  } : null, [currentSoalId]);

  // Handle finish exam
  const handleFinishExam = useCallback(() => {
    const allResults = paketTryout.blocks.map((_, index) => calculateBlockResult(index));
    setResults(allResults);
    setIsFinished(true);
  }, [paketTryout.blocks]);

  // Handle time up - move to next block or finish
  const handleTimeUp = useCallback(() => {
    if (currentBlockIndex < totalBlocks - 1) {
      setCurrentBlockIndex(prev => prev + 1);
    } else {
      handleFinishExam();
    }
  }, [currentBlockIndex, totalBlocks, handleFinishExam]);

  // Initialize timer when block changes
  useEffect(() => {
    if (currentBlock && !isFinished) {
      setTimer(currentBlock.waktu_pengerjaan_menit * 60); // Convert to seconds
      setCurrentSoalIndex(0); // Reset to first question of new block
    }
  }, [currentBlockIndex, currentBlock, isFinished]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !isFinished) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Time's up, move to next block
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [timer, isFinished, handleTimeUp]);

  // Handle answer selection
  const handleAnswerSelect = (soalId: string, jawaban: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [soalId]: {
        soalId,
        jawaban,
        status: 'answered',
        waktuJawab: new Date()
      }
    }));
  };

  // Handle doubt flag
  const handleDoubtFlag = (soalId: string) => {
    setUserAnswers(prev => {
      const currentAnswer = prev[soalId];
      return {
        ...prev,
        [soalId]: {
          soalId,
          jawaban: currentAnswer?.jawaban || '',
          status: currentAnswer?.status === 'doubtful' ? 
            (currentAnswer.jawaban ? 'answered' : 'unanswered') : 'doubtful',
          waktuJawab: currentAnswer?.waktuJawab || new Date()
        }
      };
    });
  };

  // Navigate between questions within current block
  const navigateToSoal = (index: number) => {
    if (currentBlock && index >= 0 && index < currentBlock.soal_ids.length) {
      setCurrentSoalIndex(index);
    }
  };

  // Calculate results for current block
  const calculateBlockResult = (blockIndex: number): BlockResult => {
    const block = paketTryout.blocks[blockIndex];
    if (!block) {
      return {
        blockIndex,
        blockName: 'Unknown Block',
        totalSoal: 0,
        terjawab: 0,
        benar: 0,
        salah: 0,
        kosong: 0,
        raguRagu: 0
      };
    }
    
    const blockAnswers = block.soal_ids.map(soalId => userAnswers[soalId]);
    
    const totalSoal = block.soal_ids.length;
    const terjawab = blockAnswers.filter(answer => answer?.jawaban).length;
    const benar = blockAnswers.filter(answer => 
      answer?.jawaban && answer.jawaban === answer.soalId // This would need actual soal data to check
    ).length;
    const raguRagu = blockAnswers.filter(answer => answer?.status === 'doubtful').length;
    
    return {
      blockIndex,
      blockName: block.nama_block || 'Unknown Block',
      totalSoal,
      terjawab,
      benar,
      salah: terjawab - benar,
      kosong: totalSoal - terjawab,
      raguRagu
    };
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get answer status for a question
  const getAnswerStatus = (soalId: string): AnswerStatus => {
    return userAnswers[soalId]?.status || 'unanswered';
  };

  // Get status icon
  const getStatusIcon = (status: AnswerStatus) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'doubtful':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Results view
  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-600">
                🎉 Ujian Selesai!
              </CardTitle>
              <p className="text-muted-foreground">
                Berikut adalah hasil sementara ujian Anda
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.blockName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{result.totalSoal}</div>
                          <div className="text-sm text-muted-foreground">Total Soal</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{result.terjawab}</div>
                          <div className="text-sm text-muted-foreground">Terjawab</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">{result.kosong}</div>
                          <div className="text-sm text-muted-foreground">Kosong</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">{result.raguRagu}</div>
                          <div className="text-sm text-muted-foreground">Ragu-ragu</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round((result.terjawab / result.totalSoal) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Persentase</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button size="lg" className="mr-4">
                  Lihat Pembahasan
                </Button>
                <Button variant="outline" size="lg">
                  Kembali ke Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main exam interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header with timer and progress */}
      <div className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{paketTryout.judul}</h1>
              <p className="text-sm text-muted-foreground">
                Blok {currentBlockIndex + 1} dari {totalBlocks}: {currentBlock?.nama_block}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className={cn(
                  "text-lg font-mono font-bold",
                  timer < 300 ? "text-red-500" : "text-primary"
                )}>
                  {formatTime(timer)}
                </span>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleFinishExam}
              >
                <Square className="h-4 w-4 mr-1" />
                Selesaikan Ujian
              </Button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <Progress 
              value={((currentBlockIndex) / totalBlocks) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Blok {currentBlockIndex + 1}</span>
              <span>{totalBlocks} Blok Total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question navigation panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Navigasi Soal</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {currentBlock?.nama_block}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {currentBlock?.soal_ids.map((soalId, index) => {
                    const status = getAnswerStatus(soalId);
                    return (
                      <Button
                        key={soalId}
                        variant={index === currentSoalIndex ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-10 w-10 p-0",
                          status === 'answered' && "border-green-500 bg-green-50",
                          status === 'doubtful' && "border-yellow-500 bg-yellow-50"
                        )}
                        onClick={() => navigateToSoal(index)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold">{index + 1}</span>
                          <div className="h-1 w-1">
                            {getStatusIcon(status)}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                <Separator className="my-4" />
                
                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Sudah Dijawab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    <span>Ragu-ragu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 text-gray-400" />
                    <span>Belum Dijawab</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main question area */}
          <div className="lg:col-span-3">
            {currentSoal && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Soal {currentSoalIndex + 1} dari {currentBlock?.soal_ids.length || 0}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {currentSoal.subtest.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <Button
                      variant={getAnswerStatus(currentSoalId || '') === 'doubtful' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDoubtFlag(currentSoalId || '')}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Ragu-ragu
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {/* Question text */}
                    <div className="prose max-w-none">
                      <p className="text-base leading-relaxed whitespace-pre-wrap">
                        {currentSoal.pertanyaan}
                      </p>
                    </div>
                    
                    {/* Answer options */}
                    <RadioGroup
                      value={userAnswers[currentSoalId || '']?.jawaban || ""}
                      onValueChange={(value) => handleAnswerSelect(currentSoalId || '', value)}
                    >
                      {Object.entries(currentSoal.pilihan_jawaban).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value={key} id={key} />
                          <Label 
                            htmlFor={key} 
                            className="flex-1 cursor-pointer text-base leading-relaxed"
                          >
                            <span className="font-semibold mr-2">{key}.</span>
                            {value}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => navigateToSoal(currentSoalIndex - 1)}
                      disabled={currentSoalIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Sebelumnya
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      Estimasi waktu: {currentSoal.waktu_pengerjaan_detik}s
                    </div>
                    
                    <Button
                      onClick={() => navigateToSoal(currentSoalIndex + 1)}
                      disabled={currentSoalIndex === (currentBlock?.soal_ids.length || 0) - 1}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
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

export default TryoutPlayer;