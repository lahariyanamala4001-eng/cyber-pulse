import React, { createContext, useContext, useState, useCallback } from 'react';
import type { BankUser } from '../types/bank';
import { bankAuthService } from '../services/bankApi';

interface BankAuthState {
  user: BankUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface BankAuthContextType extends BankAuthState {
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const BankAuthContext = createContext<BankAuthContextType | null>(null);

const MOCK_BANK_USER: BankUser = {
  id: 'BO-001',
  fullName: 'Ravi Menon',
  email: 'ravi.menon@securebank.in',
  mobile: '9988776655',
  role: 'bank_officer',
  department: 'Fraud Investigation Unit',
  bankName: 'SecureBank India Ltd.',
  bankBranch: 'Hyderabad Main Branch',
  employeeId: 'SB-FIU-2024-001',
  permissions: ['view_alerts', 'freeze_accounts', 'create_cases', 'share_with_lea', 'deploy_cashout_alerts', 'view_audit_logs', 'export_reports'],
  lastLogin: new Date().toISOString(),
  twoFactorEnabled: true,
  createdAt: '2024-06-15',
};

export function BankAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BankAuthState>(() => {
    const savedToken = localStorage.getItem('cyberpulse_bank_token');
    const savedUser = localStorage.getItem('cyberpulse_bank_user');
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

  const login = useCallback(async (employeeId: string, password: string) => {
    if (!employeeId || !password) {
      setError('Please enter your Employee ID and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await bankAuthService.login({ employeeId, password });
      localStorage.setItem('cyberpulse_bank_token', res.access_token);
      localStorage.setItem('cyberpulse_bank_user', JSON.stringify(res.user));
      setState({ user: res.user, token: res.access_token, isAuthenticated: true });
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    bankAuthService.logout();
    setState({ user: null, token: null, isAuthenticated: false });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <BankAuthContext.Provider value={{ ...state, login, logout, loading, error, clearError }}>
      {children}
    </BankAuthContext.Provider>
  );
}

export function useBankAuth() {
  const ctx = useContext(BankAuthContext);
  if (!ctx) throw new Error('useBankAuth must be used within BankAuthProvider');
  return ctx;
}

export { MOCK_BANK_USER };
