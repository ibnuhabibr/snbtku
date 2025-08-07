import { useState, useEffect, useCallback } from 'react';
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
  Play,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ITryoutPackageSNBT, ISoal } from '@/types/konten';

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

const TryoutPlayer: React.FC<TryoutPlayerProps> = ({ paketTryout }) => {
  // State Management
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<BlockResult[]>([]);

  // Get current block and soal
  const currentBlock = paketTryout.blocks[currentBlockIndex];
  const currentSoal = currentBlock?.soal_ids[currentSoalIndex];
  const totalBlocks = paketTryout.blocks.length;

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
  }, [timer, isFinished]);

  // Handle time up - move to next block or finish
  const handleTimeUp = useCallback(() => {
    if (currentBlockIndex < totalBlocks - 1) {
      setCurrentBlockIndex(prev => prev + 1);
    } else {
      handleFinishExam();
    }
  }, [currentBlockIndex, totalBlocks]);

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
    if (index >= 0 && index < currentBlock.soal_ids.length) {
      setCurrentSoalIndex(index);
    }
  };

  // Calculate results for current block
  const calculateBlockResult = (blockIndex: number): BlockResult => {
    const block = paketTryout.blocks[blockIndex];
    const blockAnswers = block.soal_ids.map(soalId => userAnswers[soalId.id]);
    
    const totalSoal = block.soal_ids.length;
    const terjawab = blockAnswers.filter(answer => answer?.jawaban).length;
    const benar = blockAnswers.filter(answer => 
      answer?.jawaban && answer.jawaban === answer.soalId // This would need actual soal data to check
    ).length;
    const raguRagu = blockAnswers.filter(answer => answer?.status === 'doubtful').length;
    
    return {
      blockIndex,
      blockName: block.nama_blok,
      totalSoal,
      terjawab,
      benar,
      salah: terjawab - benar,
      kosong: totalSoal - terjawab,
      raguRagu
    };
  };

  // Handle finish exam
  const handleFinishExam = () => {
    const allResults = paketTryout.blocks.map((_, index) => calculateBlockResult(index));
    setResults(allResults);
    setIsFinished(true);
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
                Blok {currentBlockIndex + 1} dari {totalBlocks}: {currentBlock?.nama_blok}
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
                  {currentBlock?.nama_blok}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {currentBlock?.soal_ids.map((soal, index) => {
                    const status = getAnswerStatus(soal.id);
                    return (
                      <Button
                        key={soal.id}
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
                        Soal {currentSoalIndex + 1} dari {currentBlock.soal_ids.length}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {currentSoal.subtest.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <Button
                      variant={getAnswerStatus(currentSoal.id) === 'doubtful' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDoubtFlag(currentSoal.id)}
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
                      value={userAnswers[currentSoal.id]?.jawaban || ""}
                      onValueChange={(value) => handleAnswerSelect(currentSoal.id, value)}
                    >
                      {currentSoal.pilihan_jawaban.map((pilihan) => (
                        <div key={pilihan.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value={pilihan.id} id={pilihan.id} />
                          <Label 
                            htmlFor={pilihan.id} 
                            className="flex-1 cursor-pointer text-base leading-relaxed"
                          >
                            <span className="font-semibold mr-2">{pilihan.id}.</span>
                            {pilihan.teks}
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
                      Estimasi waktu: {currentSoal.estimasi_waktu_detik}s
                    </div>
                    
                    <Button
                      onClick={() => navigateToSoal(currentSoalIndex + 1)}
                      disabled={currentSoalIndex === currentBlock.soal_ids.length - 1}
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