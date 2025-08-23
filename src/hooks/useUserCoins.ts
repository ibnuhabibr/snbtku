import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';

export const useUserCoins = () => {
  const { user, updateUserStats } = useAuthStore();
  const [coins, setCoins] = useState<number>(user?.coins || 0);
  const [loading, setLoading] = useState(false);
  const lastFetchRef = useRef<number>(0);
  const FETCH_COOLDOWN = 5000; // 5 seconds cooldown

  const fetchCoins = async (force = false) => {
    const { isAuthenticated, token } = useAuthStore.getState();
    
    if (!user || !isAuthenticated || !token) {
      setCoins(user?.coins || 0);
      setLoading(false);
      return;
    }

    // Check cooldown to prevent too many requests
    const now = Date.now();
    if (!force && now - lastFetchRef.current < FETCH_COOLDOWN) {
      return;
    }

    try {
      setLoading(true);
      lastFetchRef.current = now;
      const response = await api.get('/shop/coins');
      const userCoins = response.data.coins || 0;
      setCoins(userCoins);
      
      // Update coins in auth store
      updateUserStats({ coins: userCoins });
    } catch (error) {
      console.error('Error fetching user coins:', error);
      // Fallback to coins from auth store if API fails
      setCoins(user.coins || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { isAuthenticated, token } = useAuthStore.getState();
    
    // Initialize with coins from auth store
    if (user?.coins !== undefined) {
      setCoins(user.coins);
    }
    
    // Only fetch from API if user is authenticated, has token, and we don't have coins data or it's been a while
    if (isAuthenticated && user && token && (!user?.coins || Date.now() - lastFetchRef.current > FETCH_COOLDOWN)) {
      // Add a small delay to ensure token is properly set after registration/login
      const timeoutId = setTimeout(() => {
        fetchCoins();
      }, 500); // 500ms delay
      
      return () => clearTimeout(timeoutId);
    }
    
    // Always return a cleanup function, even if it's empty
    return () => {};
  }, [user?.id]); // Only depend on user ID, not the entire user object

  // Refresh coins function for manual updates
  const refreshCoins = () => {
    fetchCoins(true); // Force refresh
  };

  return {
    coins,
    loading,
    refreshCoins
  };
};