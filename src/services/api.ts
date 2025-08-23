import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const { isAuthenticated, token } = useAuthStore.getState();
      
      // Log the error for debugging
      console.log('401 Error Details:', {
        url: error.config?.url,
        isAuthenticated,
        hasToken: !!token,
        currentPath: window.location.pathname
      });
      
      // Only logout if user was previously authenticated and has a token
      // This prevents logout during initial load or when token is not yet set
      if (isAuthenticated && token) {
        // Add a small delay to prevent race conditions
        setTimeout(() => {
          const currentState = useAuthStore.getState();
          // Double-check the state hasn't changed
          if (currentState.isAuthenticated && currentState.token) {
            console.log('Performing logout due to 401 error');
            useAuthStore.getState().logout();
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);