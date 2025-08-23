import { api } from './api';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

interface Question {
  id: string;
  question_text: string;
  subject: string;
  sub_topic?: string;
  difficulty_level: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  time_limit_seconds: number;
  review_status: string;
  created_at: string;
  updated_at: string;
}

interface QuestionFormData {
  question_text: string;
  subject: string;
  sub_topic?: string;
  difficulty_level: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  time_limit_seconds: number;
}

interface TryoutPackage {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: string;
  duration_minutes: number;
  total_questions: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TryoutPackageFormData {
  title: string;
  description?: string;
  category: string;
  difficulty_level: string;
  duration_minutes: number;
  total_questions: number;
  price: number;
  is_active: boolean;
}

interface QuestionsResponse {
  questions: Question[];
  total: number;
  page: number;
  limit: number;
}

interface TryoutPackagesResponse {
  packages: TryoutPackage[];
  total: number;
  page: number;
  limit: number;
}

export const adminService = {
  // Get admin dashboard stats
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users with filters
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }): Promise<AdminUsersResponse> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId: string, role: string): Promise<void> => {
    await api.patch(`/admin/users/${userId}/role`, { role });
  },

  // Update user status
  updateUserStatus: async (userId: string, isActive: boolean): Promise<void> => {
    await api.patch(`/admin/users/${userId}/status`, { is_active: isActive });
  },

  // Questions CRUD
  getQuestions: async (params?: {
    page?: number;
    limit?: number;
    subject?: string;
    difficulty_level?: string;
    review_status?: string;
    search?: string;
  }): Promise<QuestionsResponse> => {
    const response = await api.get('/admin/questions', { params });
    return response.data;
  },

  createQuestion: async (data: QuestionFormData): Promise<Question> => {
    const response = await api.post('/admin/questions', data);
    return response.data;
  },

  updateQuestion: async (id: string, data: QuestionFormData): Promise<Question> => {
    const response = await api.put(`/admin/questions/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await api.delete(`/admin/questions/${id}`);
  },

  // Tryout Packages CRUD
  getTryoutPackages: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty_level?: string;
    is_active?: boolean;
    search?: string;
  }): Promise<TryoutPackagesResponse> => {
    const response = await api.get('/admin/tryout-packages', { params });
    return response.data;
  },

  createTryoutPackage: async (data: TryoutPackageFormData): Promise<TryoutPackage> => {
    const response = await api.post('/admin/tryout-packages', data);
    return response.data;
  },

  updateTryoutPackage: async (id: string, data: TryoutPackageFormData): Promise<TryoutPackage> => {
    const response = await api.put(`/admin/tryout-packages/${id}`, data);
    return response.data;
  },

  deleteTryoutPackage: async (id: string): Promise<void> => {
    await api.delete(`/admin/tryout-packages/${id}`);
  },
};

export type { Question, QuestionFormData, TryoutPackage, TryoutPackageFormData };