import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthState } from '../types/user';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<void>;
  register: (fullName: string, mobile: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: User = {
  id: 'user-001',
  fullName: 'Arjun Sharma',
  email: 'arjun.sharma@email.com',
  mobile: '9876543210',
  preferredContact: 'both',
  createdAt: '2026-01-15',
  lastLogin: '2026-09-06T14:30:00+05:30',
  loginMethod: 'Password',
  twoFactorEnabled: false,
  role: 'citizen',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('cyberpulse_token');
    const userStr = localStorage.getItem('cyberpulse_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({ isAuthenticated: true, user, token });
      } catch {
        localStorage.removeItem('cyberpulse_token');
        localStorage.removeItem('cyberpulse_user');
      }
    }
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ identifier, password });
      const user: User = {
        ...MOCK_USER,
        ...res.user,
        preferredContact: 'both',
        createdAt: '2026-01-15',
        lastLogin: new Date().toISOString(),
        loginMethod: 'Password',
        twoFactorEnabled: false,
      };
      localStorage.setItem('cyberpulse_token', res.access_token);
      localStorage.setItem('cyberpulse_user', JSON.stringify(user));
      setState({ isAuthenticated: true, user, token: res.access_token });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (fullName: string, mobile: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await authService.register({ fullName, mobile, email, password });
        const user: User = {
          ...MOCK_USER,
          ...res.user,
          fullName,
          mobile,
          email,
          preferredContact: 'both',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loginMethod: 'Password',
          twoFactorEnabled: false,
        };
        localStorage.setItem('cyberpulse_token', res.access_token);
        localStorage.setItem('cyberpulse_user', JSON.stringify(user));
        setState({ isAuthenticated: true, user, token: res.access_token });
      } catch (err) {
        setError('Registration failed. Please try again.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    setState({ isAuthenticated: false, user: null, token: null });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, loading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
