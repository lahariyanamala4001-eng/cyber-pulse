import type { ATMLocation, CashoutPrediction } from '../../types/bank';

export const mockATMLocations: ATMLocation[] = [
  { id: 'ATM-001', name: 'HDFC ATM Madhapur', bank: 'HDFC Bank', lat: 17.4486, lng: 78.3908, address: 'Cyber Towers, Madhapur, Hyderabad', riskZone: 'HIGH', recentFraudCount: 5 },
  { id: 'ATM-002', name: 'SBI ATM Secunderabad', bank: 'SBI', lat: 17.4399, lng: 78.4983, address: 'M.G. Road, Secunderabad', riskZone: 'CRITICAL', recentFraudCount: 8 },
  { id: 'ATM-003', name: 'ICICI ATM Ameerpet', bank: 'ICICI Bank', lat: 17.4375, lng: 78.4483, address: 'Ameerpet Main Road, Hyderabad', riskZone: 'MEDIUM', recentFraudCount: 2 },
  { id: 'ATM-004', name: 'Axis ATM Banjara Hills', bank: 'Axis Bank', lat: 17.4156, lng: 78.4347, address: 'Road No. 12, Banjara Hills', riskZone: 'LOW', recentFraudCount: 0 },
  { id: 'ATM-005', name: 'SBI ATM Kukatpally', bank: 'SBI', lat: 17.4948, lng: 78.3996, address: 'KPHB Colony, Kukatpally', riskZone: 'HIGH', recentFraudCount: 4 },
  { id: 'ATM-006', name: 'HDFC ATM Begumpet', bank: 'HDFC Bank', lat: 17.4437, lng: 78.4641, address: 'Begumpet Main Road, Hyderabad', riskZone: 'MEDIUM', recentFraudCount: 1 },
  { id: 'ATM-007', name: 'Kotak ATM Gachibowli', bank: 'Kotak Mahindra', lat: 17.4401, lng: 78.3489, address: 'Financial District, Gachibowli', riskZone: 'LOW', recentFraudCount: 0 },
  { id: 'ATM-008', name: 'PNB ATM Dilsukhnagar', bank: 'PNB', lat: 17.3688, lng: 78.5247, address: 'Dilsukhnagar Chowrastha', riskZone: 'HIGH', recentFraudCount: 6 },
  { id: 'ATM-009', name: 'SBI ATM Uppal', bank: 'SBI', lat: 17.3946, lng: 78.5598, address: 'Uppal Bus Stop, Hyderabad', riskZone: 'CRITICAL', recentFraudCount: 7 },
  { id: 'ATM-010', name: 'HDFC ATM Jubilee Hills', bank: 'HDFC Bank', lat: 17.4324, lng: 78.4072, address: 'Road No. 36, Jubilee Hills', riskZone: 'LOW', recentFraudCount: 0 },
  { id: 'ATM-011', name: 'ICICI ATM LB Nagar', bank: 'ICICI Bank', lat: 17.3500, lng: 78.5499, address: 'LB Nagar Main Road, Hyderabad', riskZone: 'MEDIUM', recentFraudCount: 3 },
  { id: 'ATM-012', name: 'SBI ATM Mehdipatnam', bank: 'SBI', lat: 17.3943, lng: 78.4427, address: 'Mehdipatnam Circle, Hyderabad', riskZone: 'HIGH', recentFraudCount: 4 },
];

export const mockCashoutPredictions: CashoutPrediction[] = [
  {
    id: 'CSH-001',
    alertId: 'FA-2026-0001',
    transactionId: 'TXN-2026-090705',
    predictedATM: mockATMLocations[1], // SBI ATM Secunderabad
    predictedTimeWindow: {
      from: '2026-09-07T14:00:00+05:30',
      to: '2026-09-07T16:30:00+05:30',
    },
    confidence: 0.89,
    modelFeatures: [
      { feature: 'Counterparty geo-proximity', value: 'Secunderabad (3.2 km)' },
      { feature: 'Historical cash-out pattern', value: 'Same-day withdrawal 78% likely' },
      { feature: 'ATM fraud frequency', value: '8 incidents in 30 days' },
      { feature: 'Amount compatible', value: 'ATM daily limit matches fraud amount' },
    ],
    status: 'Alert Deployed',
    predictedAt: '2026-09-07T01:08:00+05:30',
  },
  {
    id: 'CSH-002',
    alertId: 'FA-2026-0003',
    transactionId: 'TXN-2026-090701',
    predictedATM: mockATMLocations[0], // HDFC ATM Madhapur
    predictedTimeWindow: {
      from: '2026-09-07T12:00:00+05:30',
      to: '2026-09-07T15:00:00+05:30',
    },
    confidence: 0.82,
    modelFeatures: [
      { feature: 'Device last known location', value: 'Madhapur area' },
      { feature: 'Mule account pattern', value: 'Intermediate hop to ATM withdrawal' },
      { feature: 'ATM capacity', value: 'High denomination notes available' },
      { feature: 'Time pattern', value: 'Afternoon cash-out typical for this pattern' },
    ],
    status: 'Predicted',
    predictedAt: '2026-09-07T02:20:00+05:30',
  },
  {
    id: 'CSH-003',
    alertId: 'FA-2026-0005',
    transactionId: 'TXN-2026-090707',
    predictedATM: mockATMLocations[8], // SBI ATM Uppal
    predictedTimeWindow: {
      from: '2026-09-07T16:00:00+05:30',
      to: '2026-09-07T19:00:00+05:30',
    },
    confidence: 0.76,
    modelFeatures: [
      { feature: 'Withdrawal history', value: 'Account uses Uppal ATMs frequently' },
      { feature: 'Cash-out velocity', value: 'Second large withdrawal expected' },
      { feature: 'ATM area risk', value: 'CRITICAL zone — 7 incidents in 30 days' },
    ],
    status: 'Predicted',
    predictedAt: '2026-09-07T03:25:00+05:30',
  },
  {
    id: 'CSH-004',
    alertId: 'FA-2026-0004',
    transactionId: 'TXN-2026-090702',
    predictedATM: mockATMLocations[4], // SBI ATM Kukatpally
    predictedTimeWindow: {
      from: '2026-09-07T10:00:00+05:30',
      to: '2026-09-07T13:00:00+05:30',
    },
    confidence: 0.71,
    modelFeatures: [
      { feature: 'Split transaction endpoint', value: 'Kukatpally branch proximity' },
      { feature: 'Structuring pattern', value: 'Multiple sub-50K likely to convert to cash' },
    ],
    status: 'Intercepted',
    predictedAt: '2026-09-07T03:45:00+05:30',
  },
];
