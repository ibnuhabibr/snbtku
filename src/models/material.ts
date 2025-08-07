/**
 * Model untuk materi pembelajaran
 */

// Tipe subtest yang tersedia
export type SubtestType = 'TPS' | 'Literasi' | 'Matematika';

// Tipe tingkat kesulitan
export type DifficultyLevel = 'Mudah' | 'Menengah' | 'Sulit';

// Interface dasar untuk semua jenis materi
export interface BaseMaterial {
  id: string;
  title: string;
  subtest: SubtestType;
  topic: string;
  description: string;
  rating: number;
  lastUpdated: string | Date;
  difficulty: DifficultyLevel;
  isBookmarked?: boolean;
  createdBy?: string; // ID pengguna yang membuat materi
  createdAt: Date;
}

// Interface untuk materi rangkuman
export interface SummaryMaterial extends BaseMaterial {
  type: 'summary';
  readTime: string;
  views: number;
  content: string; // Konten rangkuman dalam format HTML atau Markdown
}

// Interface untuk materi video
export interface VideoMaterial extends BaseMaterial {
  type: 'video';
  duration: string;
  views: number;
  channel: string;
  thumbnail: string;
  uploadDate: string | Date;
  videoUrl: string;
}

// Interface untuk catatan dan rumus
export interface NotesMaterial extends BaseMaterial {
  type: 'notes';
  fileType: string; // PDF, DOCX, dll
  fileSize: string;
  downloads: number;
  fileUrl: string;
}

// Union type untuk semua jenis materi
export type Material = SummaryMaterial | VideoMaterial | NotesMaterial;

// Interface untuk statistik materi
export interface MaterialStats {
  totalMaterials: number;
  videos: number;
  summaries: number;
  downloads: number;
}

// Interface untuk filter materi
export interface MaterialFilter {
  searchQuery?: string;
  subtest?: string;
  type?: string;
  difficulty?: string;
  topic?: string;
}