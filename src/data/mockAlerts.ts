import type { Alert } from '../types/alert';

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    title: 'Instant Loan Fraud Warning',
    message:
      'Be cautious of fraudulent messages claiming to offer instant loan approval. These scammers ask for processing fees upfront and then disappear. Never pay advance fees for loans.',
    severity: 'high',
    category: 'Investment Scam',
    date: '2026-09-06',
    isRead: false,
    isDismissed: false,
  },
  {
    id: 'ALT-002',
    title: 'UPI PIN Safety Reminder',
    message:
      'Do not share your UPI PIN, OTP or banking credentials with anyone. Legitimate banks and government agencies will NEVER ask for your PIN or OTP over phone or message.',
    severity: 'high',
    category: 'Payment Fraud',
    date: '2026-09-05',
    isRead: false,
    isDismissed: false,
  },
  {
    id: 'ALT-003',
    title: 'Phishing Alert: Fake Bank Messages',
    message:
      'Fraudsters are impersonating banks, delivery services and government agencies via SMS and WhatsApp. Do not click links from unknown senders. Verify directly with the official website.',
    severity: 'high',
    category: 'Phishing',
    date: '2026-09-04',
    isRead: false,
    isDismissed: false,
  },
  {
    id: 'ALT-004',
    title: 'Job Scam Advisory',
    message:
      'Beware of fake job offers asking for registration fees or personal documents. Legitimate employers never ask for money upfront. Verify company credentials before applying.',
    severity: 'medium',
    category: 'Job Scam',
    date: '2026-09-03',
    isRead: true,
    isDismissed: false,
  },
  {
    id: 'ALT-005',
    title: 'Social Media Impersonation Rising',
    message:
      'Reports of social media account cloning are on the rise. Fraudsters clone profiles and message your contacts asking for money. Always verify via a phone call before sending money.',
    severity: 'medium',
    category: 'Social Engineering',
    date: '2026-09-02',
    isRead: true,
    isDismissed: false,
  },
  {
    id: 'ALT-006',
    title: 'Investment Fraud Advisory',
    message:
      'Unrealistic returns on investment schemes circulating on Telegram and WhatsApp groups are fraudulent. If it sounds too good to be true, it almost always is.',
    severity: 'medium',
    category: 'Investment Scam',
    date: '2026-09-01',
    isRead: true,
    isDismissed: false,
  },
  {
    id: 'ALT-007',
    title: 'System Maintenance Notice',
    message:
      'Scheduled maintenance on September 8th from 2 AM to 4 AM IST. Services may be briefly unavailable. Your data is safe.',
    severity: 'info',
    category: 'General',
    date: '2026-08-30',
    isRead: true,
    isDismissed: false,
  },
];
