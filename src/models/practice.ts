/**
 * Model untuk sistem latihan soal
 */

import { SubtestType, DifficultyLevel } from './material';

// Tipe jawaban untuk soal pilihan ganda
export type AnswerOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

// Tipe soal dasar
export interface BaseQuestion {
  id: string;
  text: string;
  explanation: string;
  difficulty: DifficultyLevel;
  subtest: SubtestType;
  topic: string;
  createdBy?: string;
  createdAt: Date;
}

// Soal pilihan ganda
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: AnswerOption[];
}

// Soal isian singkat
export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  correctAnswer: string;
  // Bisa ditambahkan array kata kunci yang dianggap benar
  acceptableAnswers?: string[];
}

// Soal benar/salah
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

// Soal menjodohkan
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: {
    left: string;
    right: string;
  }[];
}

// Union type untuk semua jenis soal
export type Question = MultipleChoiceQuestion | ShortAnswerQuestion | TrueFalseQuestion | MatchingQuestion;

// Set soal latihan
export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  subtest: SubtestType;
  topic: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  estimatedTime: string;
  questions: string[]; // Array ID soal
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Jawaban pengguna untuk satu soal
export interface UserAnswer {
  questionId: string;
  answer: string | boolean | string[]; // Tergantung tipe soal
  isCorrect: boolean;
  timeSpent: number; // Waktu dalam detik
}

// Hasil latihan soal
export interface PracticeResult {
  id: string;
  userId: string;
  questionSetId: string;
  answers: UserAnswer[];
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  completionTime: number; // Total waktu dalam detik
  completedAt: Date;
}

// Statistik latihan soal
export interface PracticeStats {
  totalQuestions: number;
  answeredQuestions: number;
  accuracy: number;
  averageTime: string;
  streak: number;
}

// Filter untuk soal latihan
export interface PracticeFilter {
  searchQuery?: string;
  subtest?: string;
  difficulty?: string;
  topic?: string;
}

// Aktivitas latihan terbaru
export interface RecentActivity {
  id: string;
  title: string;
  questionSetId: string;
  date: string | Date;
  questions: number;
  score: number;
  time: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}