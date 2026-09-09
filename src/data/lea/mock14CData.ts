export interface NationalAlert {
  id: string;
  title: string;
  summary: string;
  severity: 'Critical' | 'High' | 'Medium';
  affectedRegions: string[];
  fraudType: string;
  dateIssued: string;
  status: 'Active' | 'Acknowledged' | 'Action Taken';
  relatedCasesCount: number;
}

export interface CaseCorrelation {
  id: string;
  fraudType: string;
  confidence: number;
  statesInvolved: string[];
  commonIndicators: string[];
  cases: {
    caseId: string;
    state: string;
    date: string;
    amount: number;
  }[];
  status: 'Potentially Related' | 'Confirmed' | 'Investigating';
  lastUpdated: string;
}

export const mockNationalAlerts: NationalAlert[] = [
  {
    id: "14C-ALT-2026-081",
    title: "Surge in Fake Investment App 'CryptoGrow'",
    summary: "A coordinated campaign distributing a malicious APK posing as a cryptocurrency trading platform. Intelligence indicates the operation originates from southeast Asia border regions, targeting tier-2 cities in India.",
    severity: "Critical",
    affectedRegions: ["Telangana", "Andhra Pradesh", "Karnataka"],
    fraudType: "Investment Scam",
    dateIssued: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: "Active",
    relatedCasesCount: 142
  },
  {
    id: "14C-ALT-2026-079",
    title: "Digital Arrest Modus Operandi Esculating",
    summary: "Fraudsters impersonating Customs and CBI officials over video calls (Skype/WhatsApp) to extort money by threatening 'Digital Arrest' for fictitious illegal parcels.",
    severity: "High",
    affectedRegions: ["Maharashtra", "Delhi NCR", "Telangana"],
    fraudType: "Impersonation / Extortion",
    dateIssued: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    status: "Acknowledged",
    relatedCasesCount: 89
  },
  {
    id: "14C-ALT-2026-075",
    title: "Electricity Bill Update Phishing Links",
    summary: "Mass SMS phishing campaign warning citizens of imminent power disconnection unless a bill is updated via a malicious link. The link captures UPI PIN and bank credentials.",
    severity: "Medium",
    affectedRegions: ["Uttar Pradesh", "Bihar", "Madhya Pradesh"],
    fraudType: "Phishing / Fake Link",
    dateIssued: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    status: "Action Taken",
    relatedCasesCount: 310
  }
];

export const mockCrossStateCorrelations: CaseCorrelation[] = [
  {
    id: "CORR-2026-921",
    fraudType: "UPI / Payment Fraud",
    confidence: 88.5,
    statesInvolved: ["Telangana", "Karnataka"],
    commonIndicators: [
      "UPI Handle: 9876543210@ybl",
      "IP Subnet: 103.14.x.x"
    ],
    cases: [
      { caseId: "CASE-2026-104382", state: "Telangana", date: "2026-09-07", amount: 45000 },
      { caseId: "CASE-KA-2026-8911", state: "Karnataka", date: "2026-09-08", amount: 12000 }
    ],
    status: "Potentially Related",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  },
  {
    id: "CORR-2026-884",
    fraudType: "Job Scam",
    confidence: 94.2,
    statesInvolved: ["Maharashtra", "Gujarat", "Delhi"],
    commonIndicators: [
      "Telegram Group: @WorkFromHome_India_Official",
      "Bank Account: HDFC XXXX4192"
    ],
    cases: [
      { caseId: "CASE-MH-2026-1102", state: "Maharashtra", date: "2026-09-01", amount: 150000 },
      { caseId: "CASE-GJ-2026-0441", state: "Gujarat", date: "2026-09-02", amount: 75000 },
      { caseId: "CASE-DL-2026-5539", state: "Delhi", date: "2026-09-05", amount: 200000 }
    ],
    status: "Investigating",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  }
];
