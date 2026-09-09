import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, LogIn, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { useLEAAuth } from '../../context/LEAAuthContext';

export default function LEALogin() {
  const { login, loading, error, clearError } = useLEAAuth();
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(officerId, password);
    navigate('/lea/dashboard');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #162b55 100%)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)' }}>
            <ShieldCheck size={36} color="white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Law Enforcement Portal</h1>
          <p className="text-cyan-200 text-lg max-w-md leading-relaxed">
            Cyber Crime Investigation Unit — Complaint management, case investigation, and bank coordination.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {[
              { label: 'Active Cases', value: '156' },
              { label: 'Cases Resolved', value: '2,847' },
              { label: 'Avg Response Time', value: '< 24 hours' },
              { label: 'Conviction Rate', value: '73.2%' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-black text-cyan-300">{s.value}</p>
                <p className="text-xs text-cyan-100/60 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
                <Shield size={24} color="white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">LEA Officer Login</h2>
              <p className="text-slate-500 text-sm mt-1">Access the Cyber Crime Investigation Dashboard</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm animate-fade-in"
                style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="officerId" className="form-label">Officer ID / Badge Number</label>
                <input id="officerId" type="text" className="form-input" autoComplete="username"
                  placeholder="e.g. CYB-HYD-2024-047"
                  value={officerId} onChange={e => setOfficerId(e.target.value)} />
              </div>

              <div>
                <label htmlFor="leaPassword" className="form-label">Password</label>
                <div className="relative">
                  <input id="leaPassword" type={showPassword ? 'text' : 'password'}
                    className="form-input pr-10" placeholder="Enter your password" autoComplete="current-password"
                    value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}
                style={{ padding: '14px 24px' }}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg> Authenticating…
                  </span>
                ) : <><LogIn size={16} /> Sign In</>}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 flex items-start gap-2 p-3 rounded-xl"
              style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <Info size={14} color="#0369a1" className="flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                <strong>Demo:</strong> Enter any Officer ID and password (6+ chars) to access the LEA dashboard.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                ← Back to Citizen Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
