export type AlertSeverity = 'high' | 'medium' | 'low' | 'info';
export type AlertCategory =
  | 'Payment Fraud'
  | 'Phishing'
  | 'Social Engineering'
  | 'Investment Scam'
  | 'Job Scam'
  | 'Identity Theft'
  | 'General';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  date: string;
  isRead: boolean;
  isDismissed: boolean;
}
