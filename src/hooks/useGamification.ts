import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import gamificationService from '@/services/gamificationService';
import { useToast } from '@/hooks/use-toast';

interface UserStats {
  xp: number;
  coins: number;
  level: number;
  totalQuestions: number;
  correctAnswers: number;
  studyTime: number;
  streak: number;
  avatar_url?: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
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

export const useGamification = () => {
  const { user, updateUserStats } = useAuthStore();
  const { toast } = useToast();
  
  const [userStats, setUserStats] = useState<UserStats>({
    xp: user?.xp || 0,
    coins: user?.coins || 1000,
    level: user?.level || 1,
    totalQuestions: user?.totalQuestions || 0,
    correctAnswers: user?.correctAnswers || 0,
    studyTime: user?.studyTime || 0,
    streak: user?.dailyStreak || 0,
    avatar_url: user?.avatar_url || '',
  });
  
  const [quests, setQuests] = useState<{
    daily: Quest[];
    weekly: Quest[];
    achievements: Quest[];
  }>({
    daily: [],
    weekly: [],
    achievements: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial gamification data
  const loadData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Load user stats and quests in parallel
      const [stats, questData] = await Promise.all([
        gamificationService.getUserStats(),
        gamificationService.getQuests()
      ]);

      setUserStats(stats);
      setQuests(questData);

      // Update auth store with fresh stats
      const updateData: any = {
        xp: stats.xp,
        coins: stats.coins,
        level: stats.level,
        totalQuestions: stats.totalQuestions,
        correctAnswers: stats.correctAnswers,
        studyTime: stats.studyTime,
      };
      
      if (stats.avatar_url) {
        updateData.avatar_url = stats.avatar_url;
      }
      
      updateUserStats(updateData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data gamifikasi';
      setError(errorMessage);
      console.error('Error loading gamification data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUserStats]);

  // Initialize data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper function to show success toast
  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
      duration: 3000,
    });
  };

  // Helper function to show error toast
  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      duration: 5000,
    });
  };

  // Actions
  const completeQuestion = useCallback(async (isCorrect: boolean) => {
    try {
      const result = await gamificationService.updateQuestProgress('answer_question', { correct: isCorrect });
      
      // Update local state
      setUserStats(result.userStats);
      
      // Show notification for XP gain
      if (result.xpGained && result.xpGained > 0) {
        showSuccessToast(
          isCorrect ? "Jawaban Benar! 🎉" : "Tetap Semangat! 💪",
          `+${result.coinsGained} koin, +${result.xpGained} XP`
        );
      }

      // Check for level up
      if (result.leveledUp) {
        showSuccessToast(
          "LEVEL UP! 🚀",
          `Selamat! Anda naik ke level ${result.userStats.level}!`
        );
      }

      return result;
    } catch (err) {
      showErrorToast("Gagal Update Progress", "Terjadi kesalahan saat mengupdate progress");
      throw err;
    }
  }, []);

  const completeTryout = useCallback(async (score: number, timeSpent: number) => {
    try {
      const result = await gamificationService.updateQuestProgress('complete_tryout', { score, timeSpent });
      
      setUserStats(result.userStats);
      
      showSuccessToast(
        "Tryout Selesai! 🏆",
        `Skor: ${score}% | +${result.coinsGained} koin, +${result.xpGained} XP`
      );

      if (result.leveledUp) {
        showSuccessToast(
          "LEVEL UP! 🚀",
          `Selamat! Anda naik ke level ${result.userStats.level}!`
        );
      }

      return result;
    } catch (err) {
      showErrorToast("Gagal Simpan Hasil Tryout", "Terjadi kesalahan saat menyimpan hasil tryout");
      throw err;
    }
  }, []);

  const updateStudyTime = useCallback(async (minutes: number) => {
    try {
      const result = await gamificationService.updateQuestProgress('study_time', { minutes });
      
      setUserStats(result.userStats);
      
      if (minutes >= 5) { // Only show toast for significant study time
        showSuccessToast(
          "Belajar Produktif! 📚",
          `${minutes} menit | +${result.coinsGained} koin, +${result.xpGained} XP`
        );
      }

      return result;
    } catch (err) {
      console.error('Error updating study time:', err);
      // Don't show error toast for study time updates as they're frequent
      throw err;
    }
  }, []);

  const dailyCheckIn = useCallback(async () => {
    try {
      const result = await gamificationService.dailyCheckIn();
      
      // Update local state
      setUserStats(prev => ({
        ...prev,
        streak: result.streak,
        coins: prev.coins + result.reward.coins,
        xp: prev.xp + result.reward.xp
      }));

      showSuccessToast(
        "Check-in Berhasil! 🎉",
        `Streak ${result.streak} hari! +${result.reward.coins} koin, +${result.reward.xp} XP`
      );

      // Reload data to get updated quests
      await loadData();

      return result;
    } catch (err: any) {
      showErrorToast("Check-in Gagal", err.message || "Silakan coba lagi nanti");
      throw err;
    }
  }, [loadData]);

  const claimQuestReward = useCallback(async (questId: string) => {
    try {
      const result = await gamificationService.claimQuestReward(questId);
      
      setUserStats(result.newStats);
      
      showSuccessToast(
        "Reward Diklaim! 🏆",
        `+${result.reward.coins} koin, +${result.reward.xp} XP`
      );

      // Update quest state locally
      setQuests(prev => ({
        ...prev,
        daily: prev.daily.map(quest => 
          quest.id === questId ? { ...quest, claimed: true } : quest
        ),
        weekly: prev.weekly.map(quest => 
          quest.id === questId ? { ...quest, claimed: true } : quest
        ),
      }));

      return result;
    } catch (err: any) {
      showErrorToast("Gagal Klaim Reward", err.message || "Silakan coba lagi");
      throw err;
    }
  }, []);

  const updateAvatar = useCallback(async (avatarUrl: string) => {
    try {
      const result = await gamificationService.updateAvatar(avatarUrl);
      
      setUserStats(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));

      showSuccessToast("Avatar Diperbarui! 👤", "Avatar baru Anda telah disimpan");

      return result;
    } catch (err) {
      showErrorToast("Gagal Update Avatar", "Terjadi kesalahan saat mengupdate avatar");
      throw err;
    }
  }, []);

  // Calculate progress percentage for quests
  const getQuestProgress = useCallback((progress: number, target: number): number => {
    return Math.min((progress / target) * 100, 100);
  }, []);

  // Check if can check in today
  const canCheckInToday = useCallback((): boolean => {
    // This should be handled by the backend, but we can add client-side logic
    return true; // Let backend handle the validation
  }, []);

  return {
    // State
    userStats,
    quests,
    isLoading,
    error,
    
    // Actions
    loadData,
    completeQuestion,
    completeTryout,
    updateStudyTime,
    dailyCheckIn,
    claimQuestReward,
    updateAvatar,
    
    // Helpers
    getQuestProgress,
    canCheckInToday,
  };
};
