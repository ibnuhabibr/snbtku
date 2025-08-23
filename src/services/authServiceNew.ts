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
    xp?: number;
    coins?: number;
    level?: number;
    avatar_url?: string;
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
          await this.delay(RETRY_CONFIG.retryDelay * attempt);
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { setLoading, setError, login } = useAuthStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Memulai login...', { email: credentials.email });
      
      const response = await this.makeRequestWithRetry<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('✅ Login berhasil:', { userId: response.user.id, email: response.user.email });
      
      // Update auth store
      login(response.user, response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login gagal. Silakan coba lagi.';
      console.error('❌ Login error:', errorMessage);
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
      
      console.log('📝 Memulai registrasi...', { email: userData.email, name: userData.name });
      
      const response = await this.makeRequestWithRetry<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      console.log('✅ Registrasi berhasil:', { userId: response.user.id, email: response.user.email });
      
      // Update auth store
      login(response.user, response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registrasi gagal. Silakan coba lagi.';
      console.error('❌ Register error:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Simplified Google OAuth - direct backend call without Firebase
  async googleAuth(googleToken: string): Promise<AuthResponse> {
    const { setLoading, setError, login } = useAuthStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Memulai Google OAuth...');
      
      const response = await this.makeRequestWithRetry<AuthResponse>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: googleToken }),
      });

      console.log('✅ Google OAuth berhasil:', { userId: response.user.id });
      
      // Update auth store
      login(response.user, response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login gagal. Silakan coba lagi.';
      console.error('❌ Google OAuth error:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async getCurrentUser() {
    const { token, setUser, setError } = useAuthStore.getState();
    
    if (!token) {
      throw new Error('Token autentikasi tidak ditemukan');
    }

    try {
      const response = await this.makeRequestWithRetry<{ user: AuthResponse['user'] }>('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.user);
      return response.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengambil data user';
      setError(errorMessage);
      throw error;
    }
  }

  logout() {
    const { logout } = useAuthStore.getState();
    console.log('👋 Logout user');
    logout();
  }

  async adminLogin(passkey: string): Promise<AuthResponse> {
    const { setLoading, setError, login } = useAuthStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await this.makeRequestWithRetry<AuthResponse>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ passkey }),
      });

      // Update auth store
      login(response.user, response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Admin login gagal';
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

  // Check if server is healthy
  async checkServerHealth(): Promise<boolean> {
    try {
      await this.makeRequestWithRetry('/health', { method: 'GET' });
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
