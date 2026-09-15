// API Configuration and Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'alumni' | 'student';
}

export interface FeedbackPayload {
  toUserId: string;
  rating: number;
  comment: string;
  feedbackType?: 'meeting' | 'chat' | 'general';
}

export interface UserForFeedback {
  id: string;
  name: string;
  role: string;
}

class APIService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Feedback endpoints
  async submitFeedback(payload: FeedbackPayload): Promise<{ message: string; feedback: FeedbackItem }> {
    const response = await fetch(`${API_BASE_URL}/feedback/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<{ message: string; feedback: FeedbackItem }>(response);
  }

  async getGivenFeedback(): Promise<FeedbackItem[]> {
    const response = await fetch(`${API_BASE_URL}/feedback/given`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<FeedbackItem[]>(response);
  }

  async getReceivedFeedback(): Promise<FeedbackItem[]> {
    const response = await fetch(`${API_BASE_URL}/feedback/received`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<FeedbackItem[]>(response);
  }

  async getUsersForFeedback(): Promise<UserForFeedback[]> {
    const response = await fetch(`${API_BASE_URL}/feedback/users`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<UserForFeedback[]>(response);
  }

  // Add more API methods here as needed
}

// Export singleton instance
export const apiService = new APIService();
