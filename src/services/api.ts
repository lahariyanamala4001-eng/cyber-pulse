// API Service Layer
// Placeholder interfaces for FastAPI backend integration
// Replace BASE_URL with your FastAPI server URL when integrating

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
    role: 'citizen';
  };
}

export const authService = {
  /**
   * POST /api/auth/login
   * JWT login — replace mock with real fetch when backend is ready.
   */
  login: async (_payload: LoginPayload): Promise<AuthResponse> => {
    // TODO: Replace with real API call
    // const res = await fetch(`${BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // if (!res.ok) throw new Error('Invalid credentials');
    // return res.json();

    // Mock response
    await new Promise((r) => setTimeout(r, 800));
    return {
      access_token: 'mock-jwt-token-placeholder',
      token_type: 'bearer',
      user: {
        id: 'user-001',
        fullName: 'Arjun Sharma',
        email: _payload.identifier.includes('@') ? _payload.identifier : 'arjun.sharma@email.com',
        mobile: _payload.identifier.includes('@') ? '9876543210' : _payload.identifier,
        role: 'citizen',
      },
    };
  },

  /**
   * POST /api/auth/register
   */
  register: async (_payload: RegisterPayload): Promise<AuthResponse> => {
    await new Promise((r) => setTimeout(r, 1000));
    return {
      access_token: 'mock-jwt-token-placeholder',
      token_type: 'bearer',
      user: {
        id: 'user-' + Math.random().toString(36).substr(2, 6),
        fullName: _payload.fullName,
        email: _payload.email,
        mobile: _payload.mobile,
        role: 'citizen',
      },
    };
  },

  logout: () => {
    localStorage.removeItem('cyberpulse_token');
    localStorage.removeItem('cyberpulse_user');
  },
};

// ─── Complaints ─────────────────────────────────────────────────────────────

export const complaintsService = {
  /**
   * POST /api/complaints
   * Submit a new complaint. In production, send JWT in Authorization header.
   */
  submit: async (_data: FormData): Promise<{ id: string; submittedAt: string }> => {
    // TODO: Replace with real fetch
    // const res = await fetch(`${BASE_URL}/complaints`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}` },
    //   body: data, // multipart form with evidence files
    // });
    // return res.json();

    await new Promise((r) => setTimeout(r, 1200));
    const id = `CCP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    return { id, submittedAt: new Date().toISOString() };
  },

  /**
   * GET /api/complaints
   */
  getAll: async (_token: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const { mockComplaints } = await import('../data/mockComplaints');
    return mockComplaints;
  },

  /**
   * GET /api/complaints/{id}
   */
  getById: async (id: string, _token: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const { mockComplaints } = await import('../data/mockComplaints');
    return mockComplaints.find((c) => c.id === id) || null;
  },
};

// ─── Alerts ─────────────────────────────────────────────────────────────────

export const alertsService = {
  /**
   * GET /api/alerts
   */
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 400));
    const { mockAlerts } = await import('../data/mockAlerts');
    return mockAlerts;
  },
};

// ─── Safety Locations ────────────────────────────────────────────────────────

export const safetyLocationsService = {
  /**
   * GET /api/safety-locations
   */
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 300));
    const { mockSafetyLocations } = await import('../data/mockSafetyLocations');
    return mockSafetyLocations;
  },
};

// Suppress unused BASE_URL warning for now
void BASE_URL;
