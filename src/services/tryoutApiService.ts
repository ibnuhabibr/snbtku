import { authService } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

interface TryoutPackage {
  id: string;
  title: string;
  description: string;
  packageType: string;
  category: string;
  difficultyLevel: string;
  totalQuestions: number;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Question {
  id: string;
  questionText: string;
  questionImageUrl?: string;
  explanation: string;
  explanationImageUrl?: string;
  subject: string;
  subTopic: string;
  difficultyLevel: string;
  questionType: string;
  options: Array<{ id: string; text: string; imageUrl?: string }>;
  correctAnswer: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface TryoutPackageWithQuestions extends TryoutPackage {
  questions: Question[];
}

class TryoutApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const authHeaders = authService.getAuthHeaders();
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getTryoutPackages(): Promise<TryoutPackage[]> {
    try {
      const response = await this.makeRequest<{ packages: TryoutPackage[] }>('/tryouts/packages');
      return response.packages;
    } catch (error) {
      console.error('Failed to fetch tryout packages:', error);
      throw error;
    }
  }

  async getTryoutPackageById(id: string): Promise<TryoutPackageWithQuestions> {
    try {
      const response = await this.makeRequest<{ package: TryoutPackageWithQuestions }>(`/tryouts/packages/${id}`);
      return response.package;
    } catch (error) {
      console.error(`Failed to fetch tryout package ${id}:`, error);
      throw error;
    }
  }

  // Helper method to format duration
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return remainingMinutes > 0 
        ? `${hours} jam ${remainingMinutes} menit`
        : `${hours} jam`;
    }
    
    return `${minutes} menit`;
  }

  // Helper method to format price
  formatPrice(price: number): string {
    if (price === 0) {
      return 'Gratis';
    }
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  }

  // Helper method to get difficulty level in Indonesian
  getDifficultyLabel(level: string): string {
    const labels: Record<string, string> = {
      'mudah': 'Mudah',
      'sedang': 'Sedang',
      'sulit': 'Sulit',
      'campuran': 'Campuran'
    };
    
    return labels[level] || level;
  }

  // Helper method to get subject label in Indonesian
  getSubjectLabel(subject: string): string {
    const labels: Record<string, string> = {
      'matematika': 'Matematika',
      'fisika': 'Fisika',
      'kimia': 'Kimia',
      'biologi': 'Biologi',
      'bahasa_indonesia': 'Bahasa Indonesia',
      'bahasa_inggris': 'Bahasa Inggris'
    };
    
    return labels[subject] || subject;
  }
}

export const tryoutApiService = new TryoutApiService();
export default tryoutApiService;
export type { TryoutPackage, Question, TryoutPackageWithQuestions };