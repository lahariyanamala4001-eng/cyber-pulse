// ─── Law Enforcement Agency Portal — TypeScript Types ──────────────────────
// All domain types for the LEA cybercrime investigation workflow.

// ─── LEA User ───────────────────────────────────────────────────────────────

export type LEARole = 'lea_officer' | 'lea_admin';

export interface LEAUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: LEARole;
  badgeNumber: string;
  department: string;
  station: string;
  rank: string;
  permissions: string[];
  lastLogin: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

// ─── Complaint (as seen by LEA — citizen PII masked) ────────────────────────

export type LEAComplaintStatus =
  | 'New'
  | 'Under Review'
  | 'Assigned'
  | 'Under Investigation'
  | 'Resolved'
  | 'Closed';

export type LEAPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type LEACrimeCategory =
  | 'Online Financial Fraud'
  | 'UPI / Payment Fraud'
  | 'Phishing / Fake Link'
  | 'Social Media Fraud'
  | 'Identity Theft'
  | 'Cyber Harassment'
  | 'Account Hacking'
  | 'Fake Website / App'
  | 'Investment Scam'
  | 'Job Scam'
  | 'Other';

export interface LEAComplaint {
  id: string;
  complaintReference: string;
  category: LEACrimeCategory;
  description: string;
  location: string;
  date: string;
  incidentDate: string;
  priority: LEAPriority;
  status: LEAComplaintStatus;
  assignedOfficer: string;
  complainantReference: string; // masked — e.g. CIT-REF-XXXX
  amountInvolved?: number;
  platform?: string;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Case ───────────────────────────────────────────────────────────────────

export type LEACaseStatus =
  | 'Open'
  | 'Under Investigation'
  | 'Pending Evidence'
  | 'Bank Coordination'
  | 'Resolved'
  | 'Closed';

export interface LEACase {
  id: string;
  caseReference: string;
  complaintId: string;
  category: LEACrimeCategory;
  priority: LEAPriority;
  status: LEACaseStatus;
  assignedOfficer: string;
  description: string;
  location: string;
  amountInvolved?: number;
  timeline: LEACaseTimeline[];
  notes: LEACaseNote[];
  evidence: LEACaseEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface LEACaseTimeline {
  id: string;
  event: string;
  description: string;
  actor: string;
  createdAt: string;
  completed: boolean;
  active: boolean;
}

export interface LEACaseNote {
  id: string;
  officerId: string;
  officerName: string;
  note: string;
  createdAt: string;
}

export interface LEACaseEvidence {
  id: string;
  evidenceType: 'Document' | 'Screenshot' | 'Transaction Record' | 'Communication Log' | 'Digital Forensic' | 'Other';
  description: string;
  uploadDate: string;
  status: 'Submitted' | 'Under Review' | 'Verified' | 'Rejected';
}

// ─── Previous Case ──────────────────────────────────────────────────────────

export interface PreviousCase {
  id: string;
  caseReference: string;
  crimeType: LEACrimeCategory;
  location: string;
  date: string;
  pattern: string;
  outcome: string;
  investigationApproach: string;
  keywords: string[];
}

// ─── Cybercrime Hotspot (Map) ───────────────────────────────────────────────

export interface CybercrimeHotspot {
  id: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  crimeCategory: LEACrimeCategory;
  caseCount: number;
  severity: LEAPriority;
  recentActivity: string;
  timeRange: string;
}

// ─── Bank Alert (as seen by LEA) ────────────────────────────────────────────

export type BankAlertLEAStatus =
  | 'Received'
  | 'Under Review'
  | 'Case Opened'
  | 'Information Requested'
  | 'Resolved'
  | 'Closed';

export interface BankAlertLEA {
  id: string;
  alertReference: string;
  bankReference: string;
  transactionReference: string;
  maskedAccountReference: string; // e.g. XXXX XXXX 4821
  crimeType: string;
  amount: number;
  transactionTime: string;
  priority: LEAPriority;
  location: string;
  status: BankAlertLEAStatus;
  alertReason: string;
  communications: BankLEACommunication[];
  createdAt: string;
  updatedAt: string;
}

export interface BankLEACommunication {
  id: string;
  from: string;
  fromRole: 'bank' | 'lea';
  message: string;
  timestamp: string;
}

// ─── Notification ───────────────────────────────────────────────────────────

export type LEANotificationType =
  | 'new_complaint'
  | 'high_priority'
  | 'bank_escalation'
  | 'case_update'
  | 'bank_response'
  | 'system_alert';

export interface LEANotification {
  id: string;
  type: LEANotificationType;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  severity?: LEAPriority;
}

// ─── ML Predictive Intelligence (Integration Interface ONLY) ────────────────
// This represents the OUTPUT of the existing ML model.
// DO NOT implement prediction logic here — this is a data contract only.

export interface MLPredictiveIntelligence {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  potentialHotspot?: {
    area: string;
    lat: number;
    lng: number;
  };
  predictedTimeWindow?: {
    from: string;
    to: string;
  };
  crimePattern?: string;
  confidence?: number; // 0.0–1.0, supplied by the existing model
  modelSource?: string;
  generatedAt?: string;
}

// ─── Dashboard Summary ──────────────────────────────────────────────────────

export interface LEADashboardSummary {
  newComplaints: number;
  activeCases: number;
  highPriorityCases: number;
  bankEscalations: number;
  resolvedCases: number;
}

export interface LEADashboardAlert {
  id: string;
  alertType: string;
  location: string;
  severity: LEAPriority;
  time: string;
  status: string;
}
