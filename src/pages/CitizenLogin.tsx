import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CitizenLogin() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.identifier.trim()) e.identifier = 'Mobile number or email is required.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await login(form.identifier, form.password);
      navigate('/dashboard');
    } catch {
      // error shown via context
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12 hero-gradient">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)' }}>
              <Shield size={22} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-black text-lg text-white">CyberPulse</div>
              <div className="text-xs" style={{ color: '#64748b' }}>Citizen Portal</div>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Your safety is<br />our priority.
          </h2>
          <p style={{ color: '#93c5fd' }} className="text-base leading-relaxed">
            Report cybercrime securely and track your complaint status in real time.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: '🔒', text: 'AES-256 encrypted data' },
            { icon: '📋', text: 'Track your complaint live' },
            { icon: '🔔', text: 'Real-time safety alerts' },
            { icon: '🛡️', text: 'Trusted by the Government of India' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm" style={{ color: '#93c5fd' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: '#334155' }}>
          © 2026 CyberPulse — Prototype · Fictional data only
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
              <Shield size={20} color="white" />
            </div>
            <div className="font-black text-xl" style={{ color: '#0f2040' }}>CyberPulse</div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-1">Citizen Login</h1>
          <p className="text-slate-500 mb-8">Sign in to your account to manage your complaints.</p>

          {/* Server Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-6 text-sm text-red-800"
              style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <AlertCircle size={15} color="#dc2626" className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="identifier" className="form-label">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <User size={16} color="#94a3b8" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  className={`form-input pl-10 ${errors.identifier ? 'error' : ''}`}
                  placeholder="Enter mobile or email"
                  value={form.identifier}
                  onChange={(e) => { setForm({ ...form, identifier: e.target.value }); setErrors({ ...errors, identifier: '' }); }}
                  autoComplete="username"
                  aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                />
              </div>
              {errors.identifier && (
                <p id="identifier-error" className="form-error">
                  <AlertCircle size={12} /> {errors.identifier}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-1.5">
                <label htmlFor="password" className="form-label mb-0">Password</label>
                <button type="button" className="text-xs font-semibold hover:text-blue-900 transition-colors"
                  style={{ color: '#2563b0' }}>
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Lock size={16} color="#94a3b8" />
                </div>
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-input pl-10 pr-10 ${errors.password ? 'error' : ''}`}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}>
                  {showPwd ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="form-error">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">Login <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:text-blue-900 transition-colors" style={{ color: '#2563b0' }}>
                Create Citizen Account
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-5 p-3 rounded-xl text-center" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <p className="text-xs text-blue-700">
              <strong>Demo:</strong> Enter any email/mobile and any password (6+ chars) to login.
            </p>
          </div>

          {/* Authority link */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              Are you an authority user?{' '}
              <span className="font-semibold text-slate-500 cursor-pointer hover:text-slate-700">
                Use the appropriate authority portal →
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
