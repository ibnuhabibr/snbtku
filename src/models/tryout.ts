/**
 * Model untuk simulasi tryout
 */

import { SubtestType, DifficultyLevel } from './material';
import { UserAnswer } from './practice';

// Status tryout
export type TryoutStatus = 'available' | 'scheduled' | 'completed';

// Subtest dalam tryout
export interface TryoutSubtest {
  name: SubtestType;
  duration: number; // dalam menit
  questions: number;
  questionIds?: string[]; // ID soal-soal dalam subtest
}

// Model tryout
export interface Tryout {
  id: string;
  title: string;
  description: string;
  duration: number; // Total durasi dalam menit
  participants: number;
  difficulty: DifficultyLevel;
  status: TryoutStatus;
  startTime: string | Date; // "Kapan saja" atau waktu spesifik
  subtests: TryoutSubtest[];
  isPublic: boolean;

  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Hasil subtest dalam tryout
export interface SubtestResult {
  name: SubtestType;
  score: number;
  maxScore: number;
  percentage: number;
  answers: UserAnswer[];
  timeSpent: number; // dalam detik
}

// Hasil tryout
export interface TryoutResult {
  id: string;
  tryoutId: string;
  userId: string;
  score: number;
  maxScore: number;
  rank: number;
  totalParticipants: number;
  percentile: number;
  completedDate: Date;
  subtestScores: SubtestResult[];
}

// Statistik tryout
export interface TryoutStats {
  totalTryOuts: number;
  completed: number;
  averageScore: number;
  bestScore: number;
  rank: number;
}

// Tryout terjadwal
export interface ScheduledTryout {
  id: string;
  title: string;
  date: string | Date;
  time: string;
  participants: number;
  prize: string;
  status: 'registered' | 'open' | 'closed';
}

// Filter untuk tryout
export interface TryoutFilter {
  status?: TryoutStatus;
  difficulty?: DifficultyLevel;
  subtest?: SubtestType;
}