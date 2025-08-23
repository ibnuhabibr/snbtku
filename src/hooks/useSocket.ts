import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

// Socket event interfaces removed as they were unused

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  emit: (event: string, data?: any) => void;
  disconnect: () => void;
  reconnect: () => void;
}

let socketInstance: Socket | null = null;

export const useSocket = (): UseSocketReturn => {
  const { token, updateUserStats } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const initializeSocket = () => {
    if (!token) {
      console.log('No user token available for socket connection');
      return;
    }

    if (socketInstance?.connected) {
      console.log('Socket already connected');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      socketInstance = io(apiUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      // Connection event handlers
      socketInstance.on('connect', () => {
        console.log('Socket connected successfully');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        
        toast.success('🔌 Connected to real-time updates', {
          duration: 2000,
        });
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          socketInstance?.connect();
        }
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnectionError(error.message);
        setIsConnected(false);
        
        reconnectAttemptsRef.current += 1;
        
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          toast.error('Failed to connect to real-time updates', {
            description: 'Please refresh the page to try again',
            duration: 5000,
          });
        }
      });

      // Gamification event handlers
      socketInstance.on('reward:claimed', (data) => {
        console.log('Reward claimed:', data);
        
        // Update user stats in store
        updateUserStats({
          level: data.userStats.level,
          xp: data.userStats.xp,
          coins: data.userStats.coins,
          dailyStreak: data.userStats.dailyStreak,
        });
        
        // Show success notification
        toast.success('🎉 Reward Claimed!', {
          description: data.message,
          duration: 4000,
        });
      });

      socketInstance.on('quest:completed', (data) => {
        console.log('Quest completed:', data);
        
        // Update user stats
        updateUserStats({
          level: data.userStats.level,
          xp: data.userStats.xp,
          coins: data.userStats.coins,
        });
        
        // Show quest completion notification
        toast.success('🏆 Quest Completed!', {
          description: `${data.questTitle} - Earned ${data.reward.coins} coins and ${data.reward.xp} XP!`,
          duration: 5000,
        });
      });

      socketInstance.on('quest:progress', (data) => {
        console.log('Quest progress updated:', data);
        
        if (data.completed) {
          toast.success('✅ Quest Ready to Claim!', {
            description: `${data.questTitle} (${data.progress}/${data.target})`,
            duration: 3000,
          });
        } else {
          toast.info('📈 Quest Progress', {
            description: `${data.questTitle}: ${data.progress}/${data.target}`,
            duration: 2000,
          });
        }
      });

      socketInstance.on('level:up', (data) => {
        console.log('Level up:', data);
        
        toast.success('🎊 Level Up!', {
          description: `Congratulations! You've reached level ${data.newLevel}!`,
          duration: 6000,
        });
      });

      socketInstance.on('achievement:unlocked', (data) => {
        console.log('Achievement unlocked:', data);
        
        toast.success('🏅 Achievement Unlocked!', {
          description: `${data.title}: ${data.description}`,
          duration: 5000,
        });
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setConnectionError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const disconnect = () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      setIsConnected(false);
      setConnectionError(null);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const reconnect = () => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    
    // Wait a bit before reconnecting
    reconnectTimeoutRef.current = setTimeout(() => {
      initializeSocket();
    }, 1000);
  };

  const emit = (event: string, data?: any) => {
    if (socketInstance?.connected) {
      socketInstance.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  useEffect(() => {
    if (token) {
      initializeSocket();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    socket: socketInstance,
    isConnected,
    connectionError,
    emit,
    disconnect,
    reconnect,
  };
};

// Utility hook for quest progress updates
export const useQuestProgress = () => {
  const { emit } = useSocket();
  
  const updateQuestProgress = (action: string, data?: any) => {
    emit('quest:update_progress', { action, data });
  };
  
  return { updateQuestProgress };
};

// Export socket instance for direct access if needed
export const getSocketInstance = () => socketInstance;