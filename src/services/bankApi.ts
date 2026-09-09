// ─── Bank API Service Layer ─────────────────────────────────────────────────
// Placeholder interfaces for FastAPI backend integration.
// Follows the same pattern as the citizen api.ts.

import type { BankUser } from '../types/bank';
import { mockTransactions } from '../data/bank/mockTransactions';
import { mockFraudAlerts } from '../data/bank/mockFraudAlerts';
import { mockFraudCases } from '../data/bank/mockFraudCases';
import { mockLEACoordinations, mockBankNotifications } from '../data/bank/mockLEAData';
import { mockAuditLogs } from '../data/bank/mockAuditLogs';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
void BASE_URL;

// ─── Bank Auth ──────────────────────────────────────────────────────────────

export interface BankLoginPayload {
  employeeId: string;
  password: string;
}

export interface BankAuthResponse {
  access_token: string;
  token_type: string;
  user: BankUser;
}

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
  lastLogin: '2026-09-07T08:30:00+05:30',
  twoFactorEnabled: true,
  createdAt: '2024-06-15',
};

export const bankAuthService = {
  login: async (_payload: BankLoginPayload): Promise<BankAuthResponse> => {
    await new Promise(r => setTimeout(r, 800));
    return {
      access_token: 'mock-bank-jwt-token',
      token_type: 'bearer',
      user: MOCK_BANK_USER,
    };
  },

  logout: () => {
    localStorage.removeItem('cyberpulse_bank_token');
    localStorage.removeItem('cyberpulse_bank_user');
  },
};

// ─── Transactions ───────────────────────────────────────────────────────────

export const transactionService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    return mockTransactions;
  },

  getById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    return mockTransactions.find(t => t.id === id) || null;
  },

  search: async (query: string) => {
    await new Promise(r => setTimeout(r, 300));
    const q = query.toLowerCase();
    return mockTransactions.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.accountName.toLowerCase().includes(q) ||
      t.accountId.toLowerCase().includes(q) ||
      t.counterpartyName.toLowerCase().includes(q)
    );
  },
};

// ─── Fraud Alerts ───────────────────────────────────────────────────────────

export const fraudAlertService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    return mockFraudAlerts;
  },

  getById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    return mockFraudAlerts.find(a => a.id === id) || null;
  },

  updateStatus: async (id: string, _status: string) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, id };
  },

  escalate: async (id: string) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, id, caseId: `FC-2026-${Math.floor(100 + Math.random() * 900)}` };
  },
};

// ─── Fraud Cases ────────────────────────────────────────────────────────────

export const fraudCaseService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    return mockFraudCases;
  },

  getById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    return mockFraudCases.find(c => c.id === id) || null;
  },

  create: async (_data: Record<string, unknown>) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, id: `FC-2026-${Math.floor(100 + Math.random() * 900)}` };
  },

  update: async (id: string, _data: Record<string, unknown>) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, id };
  },
};

// ─── LEA Coordination ───────────────────────────────────────────────────────

export const leaCoordinationService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    return mockLEACoordinations;
  },

  shareWithLEA: async (caseId: string, _leaDetails: Record<string, string>) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, caseId, referralId: `LEA-REF-${Date.now()}` };
  },

  sendMessage: async (_coordinationId: string, _message: string) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true };
  },
};

// ─── Audit Logs ─────────────────────────────────────────────────────────────

export const auditService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    return mockAuditLogs;
  },

  log: async (_action: string, _target: string, _details: string) => {
    await new Promise(r => setTimeout(r, 100));
    return { success: true };
  },
};

// ─── Analytics ──────────────────────────────────────────────────────────────

export const analyticsService = {
  getDashboardStats: async () => {
    await new Promise(r => setTimeout(r, 300));
    return {
      totalAlertsToday: 10,
      criticalAlerts: 3,
      highAlerts: 4,
      blockedTransactions: 8,
      blockedAmount: 2055000,
      activeCases: 5,
      recoveredAmount: 627000,
      falsePositiveRate: 12.5,
      avgResponseTime: '4.2 min',
    };
  },

  getFraudTrends: async () => {
    await new Promise(r => setTimeout(r, 300));
    return [
      { date: '2026-09-01', value: 5 },
      { date: '2026-09-02', value: 8 },
      { date: '2026-09-03', value: 3 },
      { date: '2026-09-04', value: 12 },
      { date: '2026-09-05', value: 7 },
      { date: '2026-09-06', value: 9 },
      { date: '2026-09-07', value: 10 },
    ];
  },

  getFraudTypeBreakdown: async () => {
    await new Promise(r => setTimeout(r, 200));
    return [
      { type: 'UPI Fraud', count: 42, amount: 1850000, percentage: 35, color: '#1e3a6e' },
      { type: 'Card Fraud', count: 28, amount: 920000, percentage: 23, color: '#2563b0' },
      { type: 'NEFT/RTGS Fraud', count: 18, amount: 3200000, percentage: 15, color: '#06b6d4' },
      { type: 'ATM Fraud', count: 15, amount: 750000, percentage: 12, color: '#14b8a6' },
      { type: 'Investment Scam', count: 10, amount: 2100000, percentage: 8, color: '#f59e0b' },
      { type: 'Other', count: 8, amount: 380000, percentage: 7, color: '#94a3b8' },
    ];
  },
};

// ─── Notifications ──────────────────────────────────────────────────────────

export const bankNotificationService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 200));
    return mockBankNotifications;
  },

  markRead: async (id: string) => {
    await new Promise(r => setTimeout(r, 100));
    return { success: true, id };
  },
};
