import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankAuthProvider, useBankAuth } from './context/BankAuthContext';
import { LEAAuthProvider, useLEAAuth } from './context/LEAAuthContext';
import { isBankPortal, isLEAPortal, isCitizenPortal } from './config/portal';
import CitizenLayout from './layouts/CitizenLayout';
import BankLayout from './layouts/BankLayout';
import LEALayout from './layouts/LEALayout';
import CitizenLanding from './pages/CitizenLanding';
import CitizenLogin from './pages/CitizenLogin';
import CitizenRegister from './pages/CitizenRegister';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportCrime from './pages/ReportCrime';
import TrackComplaint from './pages/TrackComplaint';
import Alerts from './pages/Alerts';
import SafetyCentre from './pages/SafetyCentre';
import SafetyMap from './pages/SafetyMap';
import Profile from './pages/Profile';
import Help from './pages/Help';

// Bank pages
import BankLogin from './pages/bank/BankLogin';
import BankDashboard from './pages/bank/BankDashboard';
import FraudAlertCentre from './pages/bank/FraudAlertCentre';
import TransactionInvestigation from './pages/bank/TransactionInvestigation';
import FraudToCashoutTrace from './pages/bank/FraudToCashoutTrace';
import CashoutPrediction from './pages/bank/CashoutPrediction';
import RiskMLView from './pages/bank/RiskMLView';
import MLPipelineRunner from './pages/bank/MLPipelineRunner';
import PredictiveATMMapPage from './pages/bank/PredictiveATMMapPage';
import FraudCases from './pages/bank/FraudCases';
import LEACoordination from './pages/bank/LEACoordination';
import BankAnalytics from './pages/bank/BankAnalytics';
import BankAuditLogs from './pages/bank/BankAuditLogs';
import BankNotifications from './pages/bank/BankNotifications';
import BankProfile from './pages/bank/BankProfile';

// LEA pages
import LEALogin from './pages/lea/LEALogin';
import LEADashboard from './pages/lea/LEADashboard';
import LEAComplaints from './pages/lea/LEAComplaints';
import LEACaseDetail from './pages/lea/LEACaseDetail';
import LEAPreviousCases from './pages/lea/LEAPreviousCases';
import LEACybercrimeMap from './pages/lea/LEACybercrimeMap';
import LEABankCoordination from './pages/lea/LEABankCoordination';
import LEAProfile from './pages/lea/LEAProfile';
import LEA14CIntelligence from './pages/lea/LEA14CIntelligence';

// Protected route wrapper — Citizen
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Protected route wrapper — Bank
function BankProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useBankAuth();
  if (!isAuthenticated) return <Navigate to="/bank/login" replace />;
  return <>{children}</>;
}

// Protected route wrapper — LEA
function LEAProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useLEAAuth();
  if (!isAuthenticated) return <Navigate to="/lea/login" replace />;
  return <>{children}</>;
}

function BankPortalRoutes() {
  return (
    <Routes>
      <Route path="/bank/login" element={<BankLogin />} />
      <Route path="/login" element={<Navigate to="/bank/login" replace />} />
      <Route path="/" element={<Navigate to="/bank/dashboard" replace />} />

      {/* Bank Authority Portal */}
      <Route element={<BankProtectedRoute><BankLayout /></BankProtectedRoute>}>
        <Route path="/bank/dashboard" element={<BankDashboard />} />
        <Route path="/bank/ml-pipeline" element={<MLPipelineRunner />} />
        <Route path="/bank/alerts" element={<FraudAlertCentre />} />
        <Route path="/bank/transactions" element={<TransactionInvestigation />} />
        <Route path="/bank/transactions/:id" element={<TransactionInvestigation />} />
        <Route path="/bank/trace" element={<FraudToCashoutTrace />} />
        <Route path="/bank/cashout-predictions" element={<CashoutPrediction />} />
        <Route path="/bank/risk-ml" element={<RiskMLView />} />
        <Route path="/bank/atm-map" element={<PredictiveATMMapPage />} />
        <Route path="/bank/cases" element={<FraudCases />} />
        <Route path="/bank/cases/:id" element={<FraudCases />} />
        <Route path="/bank/lea-coordination" element={<LEACoordination />} />
        <Route path="/bank/analytics" element={<BankAnalytics />} />
        <Route path="/bank/audit-logs" element={<BankAuditLogs />} />
        <Route path="/bank/notifications" element={<BankNotifications />} />
        <Route path="/bank/profile" element={<BankProfile />} />

        {/* Root aliases for standalone bank portal */}
        <Route path="/dashboard" element={<BankDashboard />} />
        <Route path="/ml-pipeline" element={<MLPipelineRunner />} />
        <Route path="/alerts" element={<FraudAlertCentre />} />
        <Route path="/transactions" element={<TransactionInvestigation />} />
        <Route path="/transactions/:id" element={<TransactionInvestigation />} />
        <Route path="/trace" element={<FraudToCashoutTrace />} />
        <Route path="/cashout-predictions" element={<CashoutPrediction />} />
        <Route path="/risk-ml" element={<RiskMLView />} />
        <Route path="/atm-map" element={<PredictiveATMMapPage />} />
        <Route path="/cases" element={<FraudCases />} />
        <Route path="/cases/:id" element={<FraudCases />} />
        <Route path="/lea-coordination" element={<LEACoordination />} />
        <Route path="/analytics" element={<BankAnalytics />} />
        <Route path="/audit-logs" element={<BankAuditLogs />} />
        <Route path="/notifications" element={<BankNotifications />} />
        <Route path="/profile" element={<BankProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/bank/dashboard" replace />} />
    </Routes>
  );
}

function LEAPortalRoutes() {
  return (
    <Routes>
      <Route path="/lea/login" element={<LEALogin />} />
      <Route path="/login" element={<Navigate to="/lea/login" replace />} />
      <Route path="/" element={<Navigate to="/lea/dashboard" replace />} />

      {/* LEA Portal */}
      <Route element={<LEAProtectedRoute><LEALayout /></LEAProtectedRoute>}>
        <Route path="/lea/dashboard" element={<LEADashboard />} />
        <Route path="/lea/14c-intelligence" element={<LEA14CIntelligence />} />
        <Route path="/lea/complaints" element={<LEAComplaints />} />
        <Route path="/lea/complaints/:id" element={<LEACaseDetail />} />
        <Route path="/lea/previous-cases" element={<LEAPreviousCases />} />
        <Route path="/lea/map" element={<LEACybercrimeMap />} />
        <Route path="/lea/bank-coordination" element={<LEABankCoordination />} />
        <Route path="/lea/profile" element={<LEAProfile />} />

        {/* Root aliases for standalone LEA portal */}
        <Route path="/dashboard" element={<LEADashboard />} />
        <Route path="/14c-intelligence" element={<LEA14CIntelligence />} />
        <Route path="/complaints" element={<LEAComplaints />} />
        <Route path="/complaints/:id" element={<LEACaseDetail />} />
        <Route path="/previous-cases" element={<LEAPreviousCases />} />
        <Route path="/map" element={<LEACybercrimeMap />} />
        <Route path="/bank-coordination" element={<LEABankCoordination />} />
        <Route path="/profile" element={<LEAProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/lea/dashboard" replace />} />
    </Routes>
  );
}

function AppRoutes() {
  if (isBankPortal) return <BankPortalRoutes />;
  if (isLEAPortal) return <LEAPortalRoutes />;

  return (
    <Routes>
      {/* ─── Citizen Auth ─────────────────────────────────── */}
      <Route path="/login" element={<CitizenLogin />} />
      <Route path="/register" element={<CitizenRegister />} />

      {/* ─── Citizen Portal ───────────────────────────────── */}
      <Route element={<CitizenLayout />}>
        <Route path="/" element={<CitizenLanding />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/safety-centre" element={<SafetyCentre />} />
        <Route path="/safety-map" element={<SafetyMap />} />
        <Route path="/help" element={<Help />} />

        {/* Protected citizen routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><CitizenDashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
      </Route>

      {/* ─── Bank Auth ────────────────────────────────────── */}
      <Route path="/bank/login" element={<BankLogin />} />

      {/* ─── Bank Authority Portal ────────────────────────── */}
      <Route element={
        <BankProtectedRoute><BankLayout /></BankProtectedRoute>
      }>
        <Route path="/bank/dashboard" element={<BankDashboard />} />
        <Route path="/bank/ml-pipeline" element={<MLPipelineRunner />} />
        <Route path="/bank/alerts" element={<FraudAlertCentre />} />
        <Route path="/bank/transactions" element={<TransactionInvestigation />} />
        <Route path="/bank/transactions/:id" element={<TransactionInvestigation />} />
        <Route path="/bank/trace" element={<FraudToCashoutTrace />} />
        <Route path="/bank/cashout-predictions" element={<CashoutPrediction />} />
        <Route path="/bank/risk-ml" element={<RiskMLView />} />
        <Route path="/bank/atm-map" element={<PredictiveATMMapPage />} />
        <Route path="/bank/cases" element={<FraudCases />} />
        <Route path="/bank/cases/:id" element={<FraudCases />} />
        <Route path="/bank/lea-coordination" element={<LEACoordination />} />
        <Route path="/bank/analytics" element={<BankAnalytics />} />
        <Route path="/bank/audit-logs" element={<BankAuditLogs />} />
        <Route path="/bank/notifications" element={<BankNotifications />} />
        <Route path="/bank/profile" element={<BankProfile />} />
      </Route>

      {/* ─── LEA Auth ─────────────────────────────────────── */}
      <Route path="/lea/login" element={<LEALogin />} />

      {/* ─── LEA Portal ───────────────────────────────────── */}
      <Route element={
        <LEAProtectedRoute><LEALayout /></LEAProtectedRoute>
      }>
        <Route path="/lea/dashboard" element={<LEADashboard />} />
        <Route path="/lea/14c-intelligence" element={<LEA14CIntelligence />} />
        <Route path="/lea/complaints" element={<LEAComplaints />} />
        <Route path="/lea/complaints/:id" element={<LEACaseDetail />} />
        <Route path="/lea/previous-cases" element={<LEAPreviousCases />} />
        <Route path="/lea/map" element={<LEACybercrimeMap />} />
        <Route path="/lea/bank-coordination" element={<LEABankCoordination />} />
        <Route path="/lea/profile" element={<LEAProfile />} />
      </Route>

      {/* ─── Catch-all ────────────────────────────────────── */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4" style={{ background: '#f1f5f9' }}>
          <div className="text-8xl font-black text-slate-200 mb-4">404</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">Page Not Found</h1>
          <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn-primary">Go to Home</a>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    if (isBankPortal) {
      document.title = 'CyberPulse — Bank Authority Portal';
    } else if (isLEAPortal) {
      document.title = 'CyberPulse — Law Enforcement Portal';
    } else if (isCitizenPortal) {
      document.title = 'CyberPulse — Citizen Cybercrime Portal';
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <BankAuthProvider>
          <LEAAuthProvider>
            <AppRoutes />
          </LEAAuthProvider>
        </BankAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

