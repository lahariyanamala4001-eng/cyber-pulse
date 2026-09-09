import type { LEACoordinationEntry, BankNotification } from '../../types/bank';

export const mockLEACoordinations: LEACoordinationEntry[] = [
  {
    id: 'LEA-COORD-001',
    caseId: 'FC-2026-002',
    caseName: 'Split Transaction Structuring — ACC-1002',
    leaName: 'Cybercrime Cell, Mumbai',
    leaOfficer: 'Inspector Ajay Kulkarni',
    leaContact: 'ajay.kulkarni@cybercrime.mum.gov.in',
    sharedStatus: 'Under LEA Investigation',
    sharedAt: '2026-09-07T14:00:00+05:30',
    lastUpdate: '2026-09-07T15:30:00+05:30',
    totalAmountInvolved: 325000,
    riskLevel: 'HIGH',
    messages: [
      { id: 'MSG-001', from: 'Amit Sharma', fromRole: 'bank', message: 'Sharing case FC-2026-002. Structuring pattern confirmed with 18 sub-₹50K transactions. Account frozen. STR filed.', timestamp: '2026-09-07T14:00:00+05:30' },
      { id: 'MSG-002', from: 'Inspector Ajay Kulkarni', fromRole: 'lea', message: 'Case received. We will investigate the QuickPay Solutions entity. Please share KYC documents.', timestamp: '2026-09-07T14:30:00+05:30' },
      { id: 'MSG-003', from: 'Amit Sharma', fromRole: 'bank', message: 'KYC documents attached. Account opened in branch with Aadhaar OTP. Facial mismatch noted during review.', timestamp: '2026-09-07T15:00:00+05:30' },
      { id: 'MSG-004', from: 'Inspector Ajay Kulkarni', fromRole: 'lea', message: 'Acknowledged. QuickPay Solutions linked to 3 other fraud complaints. Investigation initiated.', timestamp: '2026-09-07T15:30:00+05:30' },
    ],
    sharedDocuments: ['KYC_ACC-1002.pdf', 'Transaction_Log_ACC-1002.pdf', 'STR_Report.pdf'],
  },
  {
    id: 'LEA-COORD-002',
    caseId: 'FC-2026-004',
    caseName: 'Cross-border Fraud — ACC-1005',
    leaName: 'Cyber Crime Cell, Hyderabad',
    leaOfficer: 'ACP Srinivas Reddy',
    leaContact: 'srinivas.reddy@cybercrime.hyd.gov.in',
    sharedStatus: 'Acknowledged',
    sharedAt: '2026-09-07T13:00:00+05:30',
    lastUpdate: '2026-09-07T13:45:00+05:30',
    totalAmountInvolved: 350000,
    riskLevel: 'CRITICAL',
    messages: [
      { id: 'MSG-005', from: 'Ravi Menon', fromRole: 'bank', message: 'Urgent: Cross-border transfer via VPN to Offshore Trading LLC. ₹3.5L. Account frozen. SWIFT recall initiated. Suspected money laundering.', timestamp: '2026-09-07T13:00:00+05:30' },
      { id: 'MSG-006', from: 'ACP Srinivas Reddy', fromRole: 'lea', message: 'Case acknowledged. Priority investigation. Please share IP logs and device forensics data.', timestamp: '2026-09-07T13:45:00+05:30' },
    ],
    sharedDocuments: ['Transaction_Detail_TXN-090705.pdf', 'IP_Trace_Report.pdf', 'SWIFT_Recall_Ref.pdf'],
  },
];

export const mockBankNotifications: BankNotification[] = [
  { id: 'BN-001', type: 'fraud_alert', title: 'CRITICAL Alert: Cross-border Fraud', message: 'TXN-090705: ₹3.5L cross-border transfer via VPN. Risk score: 96.', isRead: false, timestamp: '2026-09-07T01:06:00+05:30', actionUrl: '/bank/alerts', severity: 'CRITICAL' },
  { id: 'BN-002', type: 'fraud_alert', title: 'CRITICAL Alert: Investment Fraud', message: 'TXN-090703: ₹5L RTGS to RBI-flagged entity. New account.', isRead: false, timestamp: '2026-09-07T04:56:00+05:30', actionUrl: '/bank/alerts', severity: 'CRITICAL' },
  { id: 'BN-003', type: 'fraud_alert', title: 'HIGH Alert: Velocity Anomaly', message: 'ACC-1001: 4 transactions totaling ₹4.3L in 14 minutes.', isRead: false, timestamp: '2026-09-07T02:15:00+05:30', actionUrl: '/bank/alerts', severity: 'HIGH' },
  { id: 'BN-004', type: 'case_update', title: 'Case FC-2026-002 referred to LEA', message: 'Split transaction case shared with Cybercrime Cell, Mumbai.', isRead: false, timestamp: '2026-09-07T14:00:00+05:30', actionUrl: '/bank/cases' },
  { id: 'BN-005', type: 'lea_message', title: 'LEA Response: QuickPay Investigation', message: 'Inspector Kulkarni: QuickPay linked to 3 fraud complaints. Investigation initiated.', isRead: false, timestamp: '2026-09-07T15:30:00+05:30', actionUrl: '/bank/lea-coordination' },
  { id: 'BN-006', type: 'fraud_alert', title: 'Cash-out Prediction: SBI ATM Secunderabad', message: 'High-confidence prediction: cash-out expected between 2:00–4:30 PM today.', isRead: true, timestamp: '2026-09-07T01:08:00+05:30', actionUrl: '/bank/cashout-predictions', severity: 'HIGH' },
  { id: 'BN-007', type: 'system', title: 'ML Model Updated', message: 'XGBoost fraud model v2.1 deployed. Improved accuracy from 94.2% to 96.1%.', isRead: true, timestamp: '2026-09-07T06:00:00+05:30' },
  { id: 'BN-008', type: 'case_update', title: 'Case FC-2026-006 Closed', message: 'Card-not-present case closed as false positive after customer verification.', isRead: true, timestamp: '2026-09-07T10:00:00+05:30', actionUrl: '/bank/cases' },
];
