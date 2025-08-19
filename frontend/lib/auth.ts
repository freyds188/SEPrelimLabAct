const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  user: User;
  token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Server did not return valid JSON');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    this.setToken(data.token);
    return data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Server did not return valid JSON');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    this.setToken(data.token);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.request('/auth/me');
      
      if (!response.ok) {
        this.removeToken();
        return null;
      }

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('Invalid JSON response:', err);
        this.removeToken();
        return null;
      }

      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      this.removeToken();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
