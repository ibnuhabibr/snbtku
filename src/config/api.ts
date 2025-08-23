// API Configuration with environment support
const getApiBaseUrl = (): string => {
  // Check environment variables first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Default URLs based on environment
  if (import.meta.env.MODE === 'production') {
    return 'https://api.snbtku.com/api/v1'; // Replace with your production URL
  }
  
  if (import.meta.env.MODE === 'staging') {
    return 'https://staging-api.snbtku.com/api/v1'; // Replace with your staging URL
  }
  
  // Development fallback
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Request timeout configuration
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// Retry configuration
export const RETRY_CONFIG = {
  maxAttempts: 3,
  retryDelay: 1000, // 1 second
  retryOnStatus: [408, 429, 500, 502, 503, 504], // HTTP status codes to retry on
};

// Network status check
export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};
