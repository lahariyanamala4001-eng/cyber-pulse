import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FormData {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function CitizenRegister() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    fullName: '', mobile: '', email: '', password: '', confirmPassword: '', agreeToTerms: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = 'Full name must be at least 2 characters.';
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      e.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
    if (!form.agreeToTerms)
      e.agreeToTerms = 'You must agree to the terms to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await register(form.fullName, form.mobile, form.email, form.password);
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch {
      // error shown via context
    }
  };

  const Field = ({ id, label, type = 'text', icon, placeholder, value, onChange, error: err, autoComplete, extra }: {
    id: keyof FormData; label: string; type?: string; icon: React.ReactNode;
    placeholder: string; value: string; onChange: (v: string) => void;
    error?: string; autoComplete?: string; extra?: React.ReactNode;
  }) => (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</div>
        <input
          id={id}
          type={type}
          className={`form-input pl-10 ${err ? 'error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); setErrors(prev => ({ ...prev, [id]: '' })); }}
          autoComplete={autoComplete}
          aria-describedby={err ? `${id}-error` : undefined}
        />
        {extra}
      </div>
      {err && (
        <p id={`${id}-error`} className="form-error">
          <AlertCircle size={12} /> {err}
        </p>
      )}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f8fafc' }}>
        <div className="text-center animate-fade-in-up max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
            <CheckCircle size={40} color="#166534" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Account Created!</h2>
          <p className="text-slate-500">Redirecting you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12 hero-gradient">
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
        <div>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Join millions of<br />protected citizens.
          </h2>
          <p style={{ color: '#93c5fd' }} className="leading-relaxed">
            Create your free account to start reporting cybercrime and accessing safety resources.
          </p>
        </div>
        <p className="text-xs" style={{ color: '#334155' }}>
          © 2026 CyberPulse — Prototype · Fictional data only
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
              <Shield size={20} color="white" />
            </div>
            <div className="font-black text-xl" style={{ color: '#0f2040' }}>CyberPulse</div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-1">Create Citizen Account</h1>
          <p className="text-slate-500 mb-8">Register to report cybercrime and track your complaints.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-6 text-sm text-red-800"
              style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <AlertCircle size={15} color="#dc2626" className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Field id="fullName" label="Full Name" icon={<User size={16} color="#94a3b8" />}
              placeholder="e.g. Arjun Sharma" value={form.fullName}
              onChange={(v) => setForm({ ...form, fullName: v })} error={errors.fullName} autoComplete="name" />

            <Field id="mobile" label="Mobile Number" icon={<Phone size={16} color="#94a3b8" />}
              placeholder="10-digit mobile number" value={form.mobile}
              onChange={(v) => setForm({ ...form, mobile: v })} error={errors.mobile} autoComplete="tel" />

            <Field id="email" label="Email Address" type="email" icon={<Mail size={16} color="#94a3b8" />}
              placeholder="your@email.com" value={form.email}
              onChange={(v) => setForm({ ...form, email: v })} error={errors.email} autoComplete="email" />

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2"><Lock size={16} color="#94a3b8" /></div>
                <input id="password" type={showPwd ? 'text' : 'password'}
                  className={`form-input pl-10 pr-10 ${errors.password ? 'error' : ''}`}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors(p => ({ ...p, password: '' })); }}
                  autoComplete="new-password" />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPwd(!showPwd)} aria-label="Toggle password visibility">
                  {showPwd ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                </button>
              </div>
              {errors.password && <p className="form-error"><AlertCircle size={12} /> {errors.password}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2"><Lock size={16} color="#94a3b8" /></div>
                <input id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  className={`form-input pl-10 pr-10 ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                  autoComplete="new-password" />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password visibility">
                  {showConfirm ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="form-error"><AlertCircle size={12} /> {errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-blue-700 flex-shrink-0"
                  checked={form.agreeToTerms}
                  onChange={(e) => { setForm({ ...form, agreeToTerms: e.target.checked }); setErrors(p => ({ ...p, agreeToTerms: '' })); }} />
                <span className="text-sm text-slate-600">
                  I agree to the{' '}
                  <span className="font-semibold text-blue-700 cursor-pointer">Terms of Service</span>{' '}
                  and{' '}
                  <span className="font-semibold text-blue-700 cursor-pointer">Privacy Policy</span>.
                  My personal information will be used solely for processing my complaints.
                </span>
              </label>
              {errors.agreeToTerms && <p className="form-error mt-1"><AlertCircle size={12} /> {errors.agreeToTerms}</p>}
            </div>

            <button type="submit" id="register-submit-btn" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:text-blue-900 transition-colors" style={{ color: '#2563b0' }}>
                Sign in
              </Link>
            </p>
          </div>

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
