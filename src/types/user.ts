export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  preferredContact: 'mobile' | 'email' | 'both';
  createdAt: string;
  lastLogin: string;
  loginMethod: string;
  twoFactorEnabled: boolean;
  role: 'citizen';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginCredentials {
  identifier: string; // mobile or email
  password: string;
}

export interface RegisterData {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}
