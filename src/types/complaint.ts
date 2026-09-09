export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'Under Investigation'
  | 'Resolved'
  | 'Closed';

export type CrimeType =
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

export interface ComplaintTimeline {
  stage: string;
  date: string;
  note: string;
  completed: boolean;
  active: boolean;
}

export interface Complaint {
  id: string;
  type: CrimeType;
  date: string;
  incidentDate: string;
  description: string;
  amountLost?: number;
  transactionId?: string;
  platform?: string;
  status: ComplaintStatus;
  lastUpdated: string;
  timeline: ComplaintTimeline[];
  evidenceCount: number;
  latestUpdate: string;
}

export interface ComplaintFormData {
  crimeType: CrimeType | '';
  otherCrimeType: string;
  incidentDate: string;
  incidentTime: string;
  description: string;
  howItHappened: string;
  amountInvolved: string;
  transactionId: string;
  contactInvolved: string;
  platform: string;
  evidenceFiles: File[];
  fullName: string;
  mobile: string;
  email: string;
  preferredContact: 'mobile' | 'email' | 'both';
  confirmed: boolean;
}
