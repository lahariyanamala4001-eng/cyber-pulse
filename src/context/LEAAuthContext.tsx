import React, { createContext, useContext, useState, useCallback } from 'react';
import type { LEAUser } from '../types/lea';
import { leaAuthService } from '../services/leaApi';

interface LEAAuthState {
  user: LEAUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface LEAAuthContextType extends LEAAuthState {
  login: (officerId: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const LEAAuthContext = createContext<LEAAuthContextType | null>(null);

export const MOCK_LEA_USER: LEAUser = {
  id: 'LEA-OFF-001',
  fullName: 'Vikram Reddy',
  email: 'vikram.reddy@cyberpolice.gov.in',
  mobile: '9876501234',
  role: 'lea_officer',
  badgeNumber: 'CYB-HYD-2024-047',
  department: 'Cyber Crime Cell',
  station: 'Hyderabad Central',
  rank: 'Inspector',
  permissions: [
    'view_complaints',
    'manage_cases',
    'view_previous_cases',
    'view_map',
    'bank_coordination',
    'add_notes',
    'update_status',
    'view_intelligence',
  ],
  lastLogin: new Date().toISOString(),
  twoFactorEnabled: true,
  createdAt: '2024-03-10',
};

export function LEAAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LEAAuthState>(() => {
    const savedToken = localStorage.getItem('cyberpulse_lea_token');
    const savedUser = localStorage.getItem('cyberpulse_lea_user');
    if (savedToken && savedUser) {
      try {
        return { user: JSON.parse(savedUser), token: savedToken, isAuthenticated: true };
      } catch {
        // ignore
      }
    }
    return { user: null, token: null, isAuthenticated: false };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (officerId: string, password: string) => {
    if (!officerId || !password) {
      setError('Please enter your Officer ID and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await leaAuthService.login({ officerId, password });
      localStorage.setItem('cyberpulse_lea_token', res.access_token);
      localStorage.setItem('cyberpulse_lea_user', JSON.stringify(res.user));
      setState({ user: res.user, token: res.access_token, isAuthenticated: true });
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    leaAuthService.logout();
    setState({ user: null, token: null, isAuthenticated: false });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <LEAAuthContext.Provider value={{ ...state, login, logout, loading, error, clearError }}>
      {children}
    </LEAAuthContext.Provider>
  );
}

export function useLEAAuth() {
  const ctx = useContext(LEAAuthContext);
  if (!ctx) throw new Error('useLEAAuth must be used within LEAAuthProvider');
  return ctx;
}
