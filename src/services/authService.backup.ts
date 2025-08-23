import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL, REQUEST_TIMEOUT, RETRY_CONFIG, checkNetworkStatus } from '../config/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    unique_id?: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    lastLoginAt?: string;
  };
  token: string;
}

class AuthService {
  private async makeRequestWithRetry<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    attempt = 1
  ): Promise<T> {
    // Check network connectivity first
    if (!checkNetworkStatus()) {
      throw new Error('Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const controller = new AbortController();
    
    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Check if this is a retryable error
        if (
          RETRY_CONFIG.retryOnStatus.includes(response.status) && 
          attempt < RETRY_CONFIG.maxAttempts
        ) {
          console.log(`Mencoba ulang permintaan (${attempt}/${RETRY_CONFIG.maxAttempts})...`);
          await this.delay(RETRY_CONFIG.retryDelay * attempt); // Exponential backoff
          return this.makeRequestWithRetry(endpoint, options, attempt + 1);
        }

        const errorData = await response.json().catch(() => ({ 
          error: `Terjadi kesalahan jaringan (${response.status}). Silakan coba lagi.` 
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        if (attempt < RETRY_CONFIG.maxAttempts) {
          console.log(`Timeout, mencoba ulang (${attempt}/${RETRY_CONFIG.maxAttempts})...`);
          await this.delay(RETRY_CONFIG.retryDelay * attempt);
          return this.makeRequestWithRetry(endpoint, options, attempt + 1);
        }
        throw new Error('Koneksi timeout. Periksa koneksi internet Anda dan coba lagi.');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (attempt < RETRY_CONFIG.maxAttempts) {
          console.log(`Koneksi gagal, mencoba ulang (${attempt}/${RETRY_CONFIG.maxAttempts})...`);
          await this.delay(RETRY_CONFIG.retryDelay * attempt);
          return this.makeRequestWithRetry(endpoint, options, attempt + 1);
        }
        throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      }
      
      throw error;
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.makeRequestWithRetry<T>(endpoint, options);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { setLoading, setError, login } = useAuthStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await this.makeRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Update auth store
      console.log('AuthService register - calling login with:', { user: response.user, token: response.token });
      login(response.user, response.token);
      console.log('AuthService register - login called, current auth state:', useAuthStore.getState());
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { setLoading, setError, login } = useAuthStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await this.makeRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Update auth store
      login(response.user, response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async getCurrentUser() {
    const { token, setUser, setError } = useAuthStore.getState();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await this.makeRequest<{ user: AuthResponse['user'] }>('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.user);
      return response.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user data';
      setError(errorMessage);
      throw error;
    }
  }

  logout() {
    const { logout } = useAuthStore.getState();
    logout();
  }

  async adminLogin(passkey: string): Promise<AuthResponse> {
    const { setLoading, setError, login } = useAuthStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await this.makeRequest<AuthResponse>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ passkey }),
      });

      // Update auth store
      login(response.user, response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Admin login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Helper method to get auth headers for other API calls
  getAuthHeaders() {
    const { token } = useAuthStore.getState();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
export default authService;