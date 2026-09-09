// ─── Bank Authority Portal — TypeScript Types ──────────────────────────────
// All domain types for the bank fraud detection and investigation workflow.

// ─── Risk Levels ────────────────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FraudAlertStatus =
  | 'New'
  | 'Under Review'
  | 'Escalated'
  | 'False Positive'
  | 'Confirmed Fraud'
  | 'Resolved';

export type FraudCaseStatus =
  | 'New'
  | 'Under Investigation'
  | 'LEA Referred'
  | 'Account Frozen'
  | 'Funds Recovered'
  | 'Closed';

export type LEASharedStatus =
  | 'Shared'
  | 'Acknowledged'
  | 'Under LEA Investigation'
  | 'Action Taken'
  | 'Closed';

export type TransactionChannel = 'UPI' | 'NEFT' | 'RTGS' | 'IMPS' | 'Card' | 'ATM' | 'NetBanking' | 'Wallet';
export type TransactionType = 'Credit' | 'Debit';

// ─── Transaction ────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  counterpartyId: string;
  counterpartyName: string;
  counterpartyBank: string;
  amount: number;
  currency: string;
  type: TransactionType;
  channel: TransactionChannel;
  timestamp: string;
  location: string;
  ipAddress: string;
  deviceId: string;
  isFlagged: boolean;
  riskScore?: number;
  // Velocity metrics (pre-computed or from model)
  velocityCount1h?: number;   // # of transactions in last 1 hour
  velocityCount24h?: number;  // # of transactions in last 24 hours
  velocityAmount24h?: number; // total amount in last 24 hours
  isInternational: boolean;
  mccCode?: string;
  description: string;
}

// ─── ML Model Outputs ───────────────────────────────────────────────────────

export interface FraudPrediction {
  transactionId: string;
  fraudProbability: number;      // 0.0–1.0
  modelName: string;             // e.g. 'XGBoost v2.1'
  modelVersion: string;
  features: FeatureImportance[];
  predictedAt: string;
}

export interface FeatureImportance {
  feature: string;
  value: number;
  importance: number;   // 0.0–1.0
  direction: 'increases_risk' | 'decreases_risk';
}

export interface VelocityRisk {
  accountId: string;
  riskScore: number;          // 0–100
  transactionCount1h: number;
  transactionCount24h: number;
  totalAmount24h: number;
  avgTransactionAmount: number;
  unusualPatterns: string[];
  calculatedAt: string;
}

export interface FinalRiskResult {
  transactionId: string;
  fraudProbability: number;
  velocityRiskScore: number;
  finalRiskScore: number;      // 0–100
  riskLevel: RiskLevel;
  riskFactors: string[];
  recommendation: string;
  calculatedAt: string;
}

export interface AnomalyResult {
  transactionId: string;
  isAnomaly: boolean;
  anomalyScore: number;        // -1 to 1 (Isolation Forest)
  contributingFactors: string[];
}

// ─── Fraud Alert ────────────────────────────────────────────────────────────

export interface FraudAlert {
  id: string;
  transactionId: string;
  transaction: Transaction;
  fraudProbability: number;
  velocityRiskScore: number;
  finalRiskScore: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  status: FraudAlertStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  notes: string[];
  linkedCaseId?: string;
  recommendation: string;
}

// ─── Cash-out Prediction ────────────────────────────────────────────────────

export interface CashoutPrediction {
  id: string;
  alertId: string;
  transactionId: string;
  predictedATM: ATMLocation;
  predictedTimeWindow: {
    from: string;
    to: string;
  };
  confidence: number;            // 0.0–1.0
  modelFeatures: {
    feature: string;
    value: string;
  }[];
  status: 'Predicted' | 'Alert Deployed' | 'Intercepted' | 'Expired';
  predictedAt: string;
}

// ─── ATM Locations ──────────────────────────────────────────────────────────

export interface ATMLocation {
  id: string;
  name: string;
  bank: string;
  lat: number;
  lng: number;
  address: string;
  riskZone: RiskLevel;
  recentFraudCount: number;
}

// ─── Fraud Case ─────────────────────────────────────────────────────────────

export interface FraudCase {
  id: string;
  title: string;
  description: string;
  status: FraudCaseStatus;
  riskLevel: RiskLevel;
  totalAmountInvolved: number;
  linkedAlerts: string[];
  linkedTransactions: string[];
  assignedOfficer: string;
  createdAt: string;
  updatedAt: string;
  timeline: CaseTimelineEntry[];
  leaReferralId?: string;
  accountsFrozen: string[];
  recoveredAmount: number;
}

export interface CaseTimelineEntry {
  stage: string;
  date: string;
  note: string;
  actor: string;
  completed: boolean;
  active: boolean;
}

// ─── LEA Coordination ───────────────────────────────────────────────────────

export interface LEACoordinationEntry {
  id: string;
  caseId: string;
  caseName: string;
  leaName: string;
  leaOfficer: string;
  leaContact: string;
  sharedStatus: LEASharedStatus;
  sharedAt: string;
  lastUpdate: string;
  totalAmountInvolved: number;
  riskLevel: RiskLevel;
  messages: LEAMessage[];
  sharedDocuments: string[];
}

export interface LEAMessage {
  id: string;
  from: string;
  fromRole: 'bank' | 'lea';
  message: string;
  timestamp: string;
}

// ─── Audit Log ──────────────────────────────────────────────────────────────

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW_ALERT'
  | 'ESCALATE_ALERT'
  | 'DISMISS_ALERT'
  | 'FREEZE_ACCOUNT'
  | 'UNFREEZE_ACCOUNT'
  | 'CREATE_CASE'
  | 'UPDATE_CASE'
  | 'SHARE_WITH_LEA'
  | 'VIEW_TRANSACTION'
  | 'FLAG_TRANSACTION'
  | 'EXPORT_REPORT'
  | 'UPDATE_SETTINGS'
  | 'DEPLOY_CASHOUT_ALERT';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// ─── Bank User ──────────────────────────────────────────────────────────────

export interface BankUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: 'bank_officer' | 'bank_admin' | 'bank_analyst';
  department: string;
  bankName: string;
  bankBranch: string;
  employeeId: string;
  permissions: string[];
  lastLogin: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalAlertsToday: number;
  criticalAlerts: number;
  highAlerts: number;
  blockedTransactions: number;
  blockedAmount: number;
  activeCases: number;
  recoveredAmount: number;
  falsePositiveRate: number;
  avgResponseTime: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface FraudTypeBreakdown {
  type: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}

// ─── Notification ───────────────────────────────────────────────────────────

export type BankNotificationType = 'fraud_alert' | 'case_update' | 'lea_message' | 'system';

export interface BankNotification {
  id: string;
  type: BankNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  severity?: RiskLevel;
}

// ─── TabPFN Model 1 & Model 2 Cyber Fraud Intelligence Pipeline ─────────────

export interface CyberFraudTransactionInput {
  transaction_id: string;
  customer_id: string;
  transaction_hour: number;
  transaction_minute: number;
  transaction_day_of_week?: number; // 0 = Monday
  account_age_days: number;
  previous_chargebacks: number;
  merchant_category: string;
  transaction_country: string;
  device_type: string;
  transaction_type: string;
  geo_location_region: string;
  is_international: number; // 0 or 1
  is_high_risk_merchant_category: number; // 0 or 1
  is_weekend: number; // 0 or 1
  customer_total_transactions_30d: number;
  customer_risk_score: number;
  transaction_amount: number;
  avg_transaction_amount_30d_customer: number;
  transaction_velocity_1h: number;
  transaction_velocity_24h: number;
}

export interface Model1TabPFNOutput {
  fraud_probability: number;
  ml_risk_score: number;
  best_threshold: number;
  predicted_class: 0 | 1;
  model_name: string;
  dataset: string;
  encoded_features?: Record<string, number>;
}

export interface VelocityRiskOutput {
  velocity_1h: number;
  velocity_24h: number;
  velocity_1h_score: number;
  velocity_24h_score: number;
  velocity_risk_score: number;
  velocity_risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface CombinedRiskOutput {
  ml_risk_score: number;
  velocity_risk_score: number;
  final_risk_score: number;
  final_risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  final_action: 'IMMEDIATE ALERT' | 'URGENT ALERT' | 'MONITOR' | 'ALLOW';
}

export interface Model2CashoutOutput {
  triggered: boolean;
  minutes_until_cashout: number;
  transfer_time: string;
  predicted_cashout_time: string;
  atm_latitude: number;
  atm_longitude: number;
  atm_address: string;
  atm_branch: string;
  recommended_responses: string[];
}

export interface FullPipelineExecutionResult {
  transaction: CyberFraudTransactionInput;
  model1: Model1TabPFNOutput;
  velocity: VelocityRiskOutput;
  combined: CombinedRiskOutput;
  model2?: Model2CashoutOutput;
  executionTimeMs: number;
  source: 'api' | 'client_engine';
}
