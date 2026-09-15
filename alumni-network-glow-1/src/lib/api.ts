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

export interface UpdateProfilePayload {
  userType: 'alumni' | 'student';
  name: string;
  enrollmentNo: string;
  batch: string;
  company?: string;
  role?: string;
  experience?: string;
  skills?: string[];
  goals?: string;
  techStack?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'alumni' | 'student' | 'admin';
  profile: {
    enrollmentNo?: string;
    batch?: string;
    company?: string;
    role?: string;
    experience?: string;
    skills?: string[];
    techStack?: string[];
    goals?: string;
  };
  rating: number | null;
  reviewCount: number;
}

export interface Post {
  id: string;
  author: { id: string; name: string; batch: string; company: string } | null;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  likedByMe: boolean;
  commentCount: number;
  createdAt: string;
}

export interface PostComment {
  id: string;
  author: { id: string; name: string } | null;
  content: string;
  createdAt: string;
}

export interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  fromUser: string;
  toUser: string;
  content: string;
  isMe: boolean;
  createdAt: string;
}

export interface Meeting {
  id: string;
  topic: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  requester: { id: string; name: string } | null;
  recipient: { id: string; name: string } | null;
  isMine: boolean;
  createdAt: string;
}

export interface GradEvent {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  mode: 'Virtual' | 'In-Person';
  location: string;
  speaker: string;
  speakerRole: string;
  capacity: number;
  registered: number;
  tags: string[];
  isRegistered: boolean;
  host: { id: string; name: string } | null;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  target: number;
  raised: number;
  donorCount: number;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
}

export interface Donation {
  id: string;
  amount: number;
  message: string;
  anonymous: boolean;
  donor: { name: string; batch: string } | null;
  createdAt: string;
}

export interface TopDonor {
  name: string;
  batch: string;
  total: number;
  campaigns: number;
}

export interface InterviewExperience {
  id: string;
  title: string;
  author: { id: string; name: string; batch: string } | null;
  company: string;
  role: string;
  result: 'Selected' | 'Not Selected';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rounds: number;
  content: string;
  tags: string[];
  upvotes: number;
  upvotedByMe: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  batch: string;
  company: string;
  userType: string;
  points: number;
  avgRating: number;
  feedbackReceived: number;
  meetingsCompleted: number;
  communityPosts: number;
  donationsTotal: number;
}

export interface DashboardStats {
  connectionsMade: number;
  unreadMessages: number;
  meetingsScheduled: number;
  nextMeeting: { date: string; time: string; topic: string } | null;
  feedbackScore: number;
  feedbackCount: number;
  recentActivity: { type: string; title: string; description: string; time: string }[];
  upcomingMeetings: { id: string; topic: string; date: string; time: string; status: string; with: string }[];
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

  private async request<T>(path: string, method: string = 'GET', body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: this.getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
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

  // Profile endpoints
  async updateProfile(payload: UpdateProfilePayload): Promise<{ message: string; user: unknown }> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse(response);
  }

  // Users
  async getMe(): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me');
  }

  async listUsers(filters?: { search?: string; userType?: string; company?: string; batch?: string }): Promise<UserProfile[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.userType) params.set('userType', filters.userType);
    if (filters?.company) params.set('company', filters.company);
    if (filters?.batch) params.set('batch', filters.batch);
    const qs = params.toString();
    return this.request<UserProfile[]>(`/users${qs ? `?${qs}` : ''}`);
  }

  async getUserById(id: string): Promise<UserProfile> {
    return this.request<UserProfile>(`/users/${id}`);
  }

  // Community
  async listPosts(): Promise<Post[]> {
    return this.request<Post[]>('/posts');
  }

  async createPost(payload: { title: string; content: string; category?: string; tags?: string[] }): Promise<Post> {
    return this.request<Post>('/posts', 'POST', payload);
  }

  async togglePostLike(postId: string): Promise<{ likes: number; likedByMe: boolean }> {
    return this.request(`/posts/${postId}/like`, 'POST');
  }

  async listComments(postId: string): Promise<PostComment[]> {
    return this.request<PostComment[]>(`/posts/${postId}/comments`);
  }

  async addComment(postId: string, content: string): Promise<PostComment> {
    return this.request<PostComment>(`/posts/${postId}/comments`, 'POST', { content });
  }

  // Chat
  async listConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/messages/conversations');
  }

  async getThread(userId: string): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/messages/thread/${userId}`);
  }

  async sendMessage(toUserId: string, content: string): Promise<ChatMessage> {
    return this.request<ChatMessage>('/messages', 'POST', { toUserId, content });
  }

  // Meetings
  async listMeetings(): Promise<Meeting[]> {
    return this.request<Meeting[]>('/meetings');
  }

  async requestMeeting(payload: { recipientId: string; topic: string; date: string; time: string }): Promise<Meeting> {
    return this.request<Meeting>('/meetings', 'POST', payload);
  }

  async respondToMeeting(id: string, status: 'accepted' | 'declined' | 'completed' | 'cancelled'): Promise<Meeting> {
    return this.request<Meeting>(`/meetings/${id}/respond`, 'PUT', { status });
  }

  // Events
  async listEvents(scope: 'upcoming' | 'past' | 'mine' = 'upcoming'): Promise<GradEvent[]> {
    return this.request<GradEvent[]>(`/events?scope=${scope}`);
  }

  async createEvent(payload: Partial<GradEvent> & { title: string; date: string }): Promise<GradEvent> {
    return this.request<GradEvent>('/events', 'POST', payload);
  }

  async registerForEvent(id: string): Promise<GradEvent> {
    return this.request<GradEvent>(`/events/${id}/register`, 'POST');
  }

  // Fundraising
  async listCampaigns(): Promise<Campaign[]> {
    return this.request<Campaign[]>('/campaigns');
  }

  async createCampaign(payload: { title: string; description?: string; category?: string; target: number }): Promise<Campaign> {
    return this.request<Campaign>('/campaigns', 'POST', payload);
  }

  async donate(campaignId: string, payload: { amount: number; message?: string; anonymous?: boolean }): Promise<{ campaign: Campaign }> {
    return this.request(`/campaigns/${campaignId}/donate`, 'POST', payload);
  }

  async listDonations(campaignId?: string): Promise<Donation[]> {
    return this.request<Donation[]>(`/campaigns/donations${campaignId ? `?campaignId=${campaignId}` : ''}`);
  }

  async topDonors(): Promise<TopDonor[]> {
    return this.request<TopDonor[]>('/campaigns/donors/top');
  }

  // Interview prep
  async listInterviewExperiences(filters?: { search?: string; company?: string }): Promise<InterviewExperience[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.company) params.set('company', filters.company);
    const qs = params.toString();
    return this.request<InterviewExperience[]>(`/interviews${qs ? `?${qs}` : ''}`);
  }

  async createInterviewExperience(payload: {
    title: string; company: string; role: string; result: 'Selected' | 'Not Selected';
    difficulty?: 'Easy' | 'Medium' | 'Hard'; rounds?: number; content: string; tags?: string[];
  }): Promise<InterviewExperience> {
    return this.request<InterviewExperience>('/interviews', 'POST', payload);
  }

  async toggleUpvote(id: string): Promise<{ upvotes: number; upvotedByMe: boolean }> {
    return this.request(`/interviews/${id}/upvote`, 'POST');
  }

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>('/leaderboard');
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard');
  }
}

// Export singleton instance
export const apiService = new APIService();
