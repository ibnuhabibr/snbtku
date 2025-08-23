import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL } from '../config/api';

interface UserStats {
  xp: number;
  coins: number;
  level: number;
  totalQuestions: number;
  correctAnswers: number;
  studyTime: number; // in minutes
  streak: number;
  avatar_url?: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  target: number;
  reward: {
    coins: number;
    xp: number;
  };
  completed: boolean;
  claimed: boolean;
  expiresAt?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  reward: {
    coins: number;
    xp: number;
  };
}

class GamificationService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { token } = useAuthStore.getState();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

  // Get user gamification stats
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await this.makeRequest<{ stats: UserStats }>('/gamification/stats');
      return response.stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      
      // Return default stats if server is not available
      return {
        xp: 0,
        coins: 1000,
        level: 1,
        totalQuestions: 0,
        correctAnswers: 0,
        studyTime: 0,
        streak: 0,
      };
    }
  }

  // Get active quests
  async getQuests(): Promise<{
    daily: Quest[];
    weekly: Quest[];
    achievements: Quest[];
  }> {
    try {
      const response = await this.makeRequest<{
        daily: Quest[];
        weekly: Quest[];
        achievements: Quest[];
      }>('/gamification/quests');
      
      return response;
    } catch (error) {
      console.error('Error fetching quests:', error);
      return {
        daily: [],
        weekly: [],
        achievements: []
      };
    }
  }

  // Update quest progress
  async updateQuestProgress(action: string, data?: any): Promise<{
    updatedQuests: Quest[];
    completedQuests: Quest[];
    newAchievements: Achievement[];
    userStats: UserStats;
    xpGained?: number;
    coinsGained?: number;
    leveledUp?: boolean;
  }> {
    try {
      const response = await this.makeRequest<{
        updatedQuests: Quest[];
        completedQuests: Quest[];
        newAchievements: Achievement[];
        userStats: UserStats;
      }>('/gamification/progress', {
        method: 'POST',
        body: JSON.stringify({ action, data })
      });

      // Update auth store with new stats
      const { updateUserStats } = useAuthStore.getState();
      updateUserStats({
        xp: response.userStats.xp,
        coins: response.userStats.coins,
        level: response.userStats.level,
      });

      return response;
    } catch (error) {
      console.error('Error updating quest progress:', error);
      throw error;
    }
  }

  // Claim quest reward
  async claimQuestReward(questId: string): Promise<{
    success: boolean;
    reward: { coins: number; xp: number };
    newStats: UserStats;
  }> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        reward: { coins: number; xp: number };
        newStats: UserStats;
      }>(`/gamification/quests/${questId}/claim`, {
        method: 'POST'
      });

      // Update auth store with new stats
      const { updateUserStats } = useAuthStore.getState();
      updateUserStats({
        xp: response.newStats.xp,
        coins: response.newStats.coins,
        level: response.newStats.level,
      });

      return response;
    } catch (error) {
      console.error('Error claiming quest reward:', error);
      throw error;
    }
  }

  // Get achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await this.makeRequest<{ achievements: Achievement[] }>('/gamification/achievements');
      return response.achievements;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  // Update avatar
  async updateAvatar(avatarUrl: string): Promise<{ success: boolean; avatarUrl: string }> {
    try {
      const response = await this.makeRequest<{ success: boolean; avatarUrl: string }>('/gamification/avatar', {
        method: 'POST',
        body: JSON.stringify({ avatarUrl })
      });

      // Update auth store
      const { user, setUser } = useAuthStore.getState();
      if (user) {
        setUser({ ...user, avatar_url: avatarUrl });
      }

      return response;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  // Daily check-in
  async dailyCheckIn(): Promise<{
    success: boolean;
    streak: number;
    reward: { coins: number; xp: number };
    nextCheckIn: string;
  }> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        streak: number;
        reward: { coins: number; xp: number };
        nextCheckIn: string;
      }>('/gamification/checkin', {
        method: 'POST'
      });

      return response;
    } catch (error) {
      console.error('Error with daily check-in:', error);
      throw error;
    }
  }

  // Helper functions for common quest actions
  async completeQuestion(isCorrect: boolean): Promise<void> {
    await this.updateQuestProgress('answer_question', { correct: isCorrect });
  }

  async completeTryout(score: number, timeSpent: number): Promise<void> {
    await this.updateQuestProgress('complete_tryout', { score, timeSpent });
  }

  async updateStudyTime(minutes: number): Promise<void> {
    await this.updateQuestProgress('study_time', { minutes });
  }

  async completeLesson(lessonId: string): Promise<void> {
    await this.updateQuestProgress('complete_lesson', { lessonId });
  }
}

export const gamificationService = new GamificationService();
export default gamificationService;
