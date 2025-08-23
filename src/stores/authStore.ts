import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  unique_id?: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  // Gamification fields
  level?: number;
  xp?: number;
  coins?: number;
  dailyStreak?: number;
  lastCheckIn?: string;
  achievements?: string[];
  avatar_url?: string;
  totalQuestions?: number;
  correctAnswers?: number;
  studyTime?: number; // in minutes
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  updateUserStats: (stats: Partial<Pick<User, 'level' | 'xp' | 'coins' | 'dailyStreak' | 'achievements' | 'avatar_url' | 'totalQuestions' | 'correctAnswers' | 'studyTime'>>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
        setUser: (user: User) => {
          set({ user, isAuthenticated: !!user });
        },

        setToken: (token: string) => {
          set({ token });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

      login: (user: User, token: string) => {
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          });
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        },

      clearError: () => {
          set({ error: null });
        },

        updateUserStats: (stats) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                ...stats,
              },
            });
          }
        },
    }),
    {
        name: 'snbtku-auth', // localStorage key
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
  )
);

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated;
};