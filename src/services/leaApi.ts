// ─── LEA API Service Layer ──────────────────────────────────────────────────
// Placeholder interfaces for FastAPI backend integration.
// Follows the same pattern as bankApi.ts.
// Replace BASE_URL with your FastAPI LEA backend URL when integrating.

import type { LEAUser } from '../types/lea';

const BASE_URL = import.meta.env.VITE_LEA_API_URL || 'http://localhost:8001/api';
void BASE_URL;

// ─── Mock LEA User ──────────────────────────────────────────────────────────

const MOCK_LEA_USER: LEAUser = {
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
    'view_complaints', 'manage_cases', 'view_previous_cases',
    'view_map', 'bank_coordination', 'add_notes',
    'update_status', 'view_intelligence',
  ],
  lastLogin: '2026-09-07T08:30:00+05:30',
  twoFactorEnabled: true,
  createdAt: '2024-03-10',
};

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LEALoginPayload {
  officerId: string;
  password: string;
}

export interface LEAAuthResponse {
  access_token: string;
  token_type: string;
  user: LEAUser;
}

export const leaAuthService = {
  login: async (_payload: LEALoginPayload): Promise<LEAAuthResponse> => {
    // TODO: Replace with real API call
    // const res = await fetch(`${BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // if (!res.ok) throw new Error('Invalid credentials');
    // return res.json();

    await new Promise(r => setTimeout(r, 800));
    return {
      access_token: 'mock-lea-jwt-token',
      token_type: 'bearer',
      user: MOCK_LEA_USER,
    };
  },

  logout: () => {
    localStorage.removeItem('cyberpulse_lea_token');
    localStorage.removeItem('cyberpulse_lea_user');
  },
};

// ─── Dashboard ──────────────────────────────────────────────────────────────

export const leaDashboardService = {
  getSummary: async () => {
    await new Promise(r => setTimeout(r, 300));
    const { mockLEAComplaints } = await import('../data/lea/mockLEAComplaints');
    const { mockLEACases } = await import('../data/lea/mockLEACases');
    const { mockBankAlertsLEA } = await import('../data/lea/mockBankAlertsLEA');

    return {
      newComplaints: mockLEAComplaints.filter(c => c.status === 'New').length,
      activeCases: mockLEACases.filter(c => !['Resolved', 'Closed'].includes(c.status)).length,
      highPriorityCases: mockLEACases.filter(c => ['Critical', 'High'].includes(c.priority)).length,
      bankEscalations: mockBankAlertsLEA.filter(a => !['Resolved', 'Closed'].includes(a.status)).length,
      resolvedCases: mockLEACases.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
    };
  },

  getAlerts: async () => {
    await new Promise(r => setTimeout(r, 200));
    return [
      { id: 'DA-001', alertType: 'High-risk cyber fraud', location: 'Hyderabad', severity: 'Critical' as const, time: '2 hours ago', status: 'Active' },
      { id: 'DA-002', alertType: 'Multiple complaints — same area', location: 'Ameerpet, Hyderabad', severity: 'High' as const, time: '5 hours ago', status: 'Active' },
      { id: 'DA-003', alertType: 'Bank escalation', location: 'Delhi', severity: 'Critical' as const, time: '1 day ago', status: 'Under Review' },
      { id: 'DA-004', alertType: 'Emerging fraud pattern', location: 'Noida', severity: 'High' as const, time: '1 day ago', status: 'Monitoring' },
      { id: 'DA-005', alertType: 'Bank escalation', location: 'Mumbai', severity: 'Medium' as const, time: '3 days ago', status: 'Resolved' },
    ];
  },

  getRecentCases: async () => {
    await new Promise(r => setTimeout(r, 300));
    const { mockLEACases } = await import('../data/lea/mockLEACases');
    return mockLEACases.slice(0, 5);
  },
};

// ─── Complaints ─────────────────────────────────────────────────────────────

export const leaComplaintService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    const { mockLEAComplaints } = await import('../data/lea/mockLEAComplaints');
    return mockLEAComplaints;
  },

  getById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    const { mockLEAComplaints } = await import('../data/lea/mockLEAComplaints');
    return mockLEAComplaints.find(c => c.id === id) || null;
  },

  assign: async (id: string, _officerId: string) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, id };
  },

  updateStatus: async (id: string, _status: string) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, id };
  },
};

// ─── Cases ──────────────────────────────────────────────────────────────────

export const leaCaseService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    const { mockLEACases } = await import('../data/lea/mockLEACases');
    return mockLEACases;
  },

  getById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    const { mockLEACases } = await import('../data/lea/mockLEACases');
    return mockLEACases.find(c => c.id === id) || null;
  },

  addNote: async (caseId: string, _note: string) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, caseId };
  },

  getTimeline: async (caseId: string) => {
    await new Promise(r => setTimeout(r, 200));
    const { mockLEACases } = await import('../data/lea/mockLEACases');
    const c = mockLEACases.find(c => c.id === caseId);
    return c?.timeline || [];
  },

  updateStatus: async (caseId: string, _status: string) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, caseId };
  },
};

// ─── Previous Cases ─────────────────────────────────────────────────────────

export const leaPreviousCaseService = {
  search: async (query?: string) => {
    await new Promise(r => setTimeout(r, 400));
    const { mockPreviousCases } = await import('../data/lea/mockPreviousCases');
    if (!query) return mockPreviousCases;
    const q = query.toLowerCase();
    return mockPreviousCases.filter(c =>
      c.caseReference.toLowerCase().includes(q) ||
      c.crimeType.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.pattern.toLowerCase().includes(q) ||
      c.keywords.some(k => k.toLowerCase().includes(q))
    );
  },

  getById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    const { mockPreviousCases } = await import('../data/lea/mockPreviousCases');
    return mockPreviousCases.find(c => c.id === id) || null;
  },
};

// ─── Map / Hotspots ─────────────────────────────────────────────────────────

export const leaMapService = {
  getHotspots: async () => {
    await new Promise(r => setTimeout(r, 300));
    const { mockHotspots } = await import('../data/lea/mockHotspots');
    return mockHotspots;
  },
};

// ─── Bank Coordination ──────────────────────────────────────────────────────

export const leaBankCoordService = {
  getAlerts: async () => {
    await new Promise(r => setTimeout(r, 400));
    const { mockBankAlertsLEA } = await import('../data/lea/mockBankAlertsLEA');
    return mockBankAlertsLEA;
  },

  getAlertById: async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    const { mockBankAlertsLEA } = await import('../data/lea/mockBankAlertsLEA');
    return mockBankAlertsLEA.find(a => a.id === id) || null;
  },

  requestInfo: async (alertId: string, _message: string) => {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, alertId };
  },

  sendUpdate: async (alertId: string, _message: string) => {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, alertId };
  },
};

// ─── Notifications ──────────────────────────────────────────────────────────

export const leaNotificationService = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 200));
    const { mockLEANotifications } = await import('../data/lea/mockLEANotifications');
    return mockLEANotifications;
  },

  markRead: async (id: string) => {
    await new Promise(r => setTimeout(r, 100));
    return { success: true, id };
  },
};

// ─── ML Integration (Interface ONLY — no model code) ────────────────────────
// This service communicates with the EXISTING ML model server.
// DO NOT implement prediction logic here.

export const leaMLIntegration = {
  /**
   * POST /api/intelligence/predict
   * Calls the existing ML model service and returns structured output.
   * Currently returns a placeholder — will connect to real model later.
   */
  getPrediction: async (_input: Record<string, unknown>) => {
    // TODO: Replace with real API call to ML service
    // const res = await fetch(`${BASE_URL}/intelligence/predict`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //   body: JSON.stringify(input),
    // });
    // return res.json();

    await new Promise(r => setTimeout(r, 500));
    return {
      status: 'integration_pending',
      message: 'ML model integration pending. Connect your existing model to receive predictions.',
    };
  },
};
