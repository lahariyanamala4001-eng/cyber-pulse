import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileWarning, ChevronRight, ChevronLeft, Check,
  AlertCircle, Calendar, Clock, IndianRupee, Smartphone,
  Globe, Info, CheckSquare
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import type { CrimeType, ComplaintFormData } from '../types/complaint';
import { complaintsService } from '../services/api';

const CRIME_TYPES: { type: CrimeType; emoji: string; desc: string }[] = [
  { type: 'Online Financial Fraud', emoji: '💳', desc: 'Unauthorized bank/card transactions' },
  { type: 'UPI / Payment Fraud', emoji: '📱', desc: 'Fraudulent UPI transfers or requests' },
  { type: 'Phishing / Fake Link', emoji: '🎣', desc: 'Fake emails, SMS or websites' },
  { type: 'Social Media Fraud', emoji: '📲', desc: 'Fake profiles, scams on social platforms' },
  { type: 'Identity Theft', emoji: '🪪', desc: 'Misuse of your personal information' },
  { type: 'Cyber Harassment', emoji: '⚠️', desc: 'Online threats, stalking or abuse' },
  { type: 'Account Hacking', emoji: '🔓', desc: 'Unauthorized access to your accounts' },
  { type: 'Fake Website / App', emoji: '🌐', desc: 'Impersonating websites or apps' },
  { type: 'Investment Scam', emoji: '📈', desc: 'Fraudulent investment or trading schemes' },
  { type: 'Job Scam', emoji: '💼', desc: 'Fake job offers demanding fees' },
  { type: 'Other', emoji: '📋', desc: 'Any other cybercrime not listed above' },
];

const STEPS = ['Incident Type', 'Incident Details', 'Evidence', 'Contact Details', 'Review & Submit'];

const empty: ComplaintFormData = {
  crimeType: '', otherCrimeType: '', incidentDate: '', incidentTime: '',
  description: '', howItHappened: '', amountInvolved: '', transactionId: '',
  contactInvolved: '', platform: '', evidenceFiles: [],
  fullName: '', mobile: '', email: '', preferredContact: 'both', confirmed: false,
};

export default function ReportCrime() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ComplaintFormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ComplaintFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState('');

  const set = <K extends keyof ComplaintFormData>(k: K, v: ComplaintFormData[K]) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  // ── Validation per step ────────────────────────────────────────────────────
  const validateStep = (s: number): boolean => {
    const e: Partial<Record<keyof ComplaintFormData, string>> = {};
    if (s === 0) {
      if (!form.crimeType) e.crimeType = 'Please select an incident type.';
      if (form.crimeType === 'Other' && !form.otherCrimeType.trim())
        e.otherCrimeType = 'Please describe the incident type.';
    }
    if (s === 1) {
      if (!form.incidentDate) e.incidentDate = 'Please enter the date of the incident.';
      if (!form.description.trim() || form.description.trim().length < 20)
        e.description = 'Please provide at least 20 characters describing the incident.';
      if (!form.howItHappened.trim())
        e.howItHappened = 'Please describe how the incident happened.';
    }
    if (s === 3) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required.';
      if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    }
    if (s === 4) {
      if (!form.confirmed) e.confirmed = 'Please confirm the accuracy of your information.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('crimeType', form.crimeType);
      fd.append('description', form.description);
      const res = await complaintsService.submit(fd);
      setSuccessId(res.id);
      setSubmittedAt(new Date(res.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (successId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 animate-fade-in-up text-center">
        <div className="card p-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#f0fdf4', border: '3px solid #bbf7d0' }}>
            <Check size={40} color="#166534" strokeWidth={2.5} />
          </div>
          <span className="badge badge-resolved text-sm mb-4 inline-flex">Complaint Submitted</span>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Complaint Submitted Successfully</h1>
          <p className="text-slate-500 mb-8">
            Your complaint has been received and registered in the system.
          </p>

          <div className="rounded-2xl p-6 mb-6 text-left" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Complaint ID', value: successId, mono: true, highlight: true },
                { label: 'Submitted On', value: submittedAt },
                { label: 'Current Status', value: 'Submitted' },
                { label: 'Next Step', value: 'Initial Review (within 24 hrs)' },
              ].map(({ label, value, mono, highlight }) => (
                <div key={label}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className={`font-semibold ${mono ? 'font-mono text-lg' : 'text-sm'} ${highlight ? 'text-blue-700' : 'text-slate-800'}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl mb-8 text-left"
            style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <Info size={15} color="#92400e" className="flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Save your Complaint ID:</strong> {successId} — You'll need this to track your complaint.
              This is a prototype. This is not an official government complaint number.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate(`/track?id=${successId}`)} className="btn-primary">
              Track Complaint
            </button>
            <button onClick={() => window.print()} className="btn-secondary">
              Download Acknowledgement
            </button>
            <button onClick={() => navigate('/')} className="btn-outline">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Progress Bar ──────────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? '1' : 'none' }}>
            <div className="flex flex-col items-center">
              <div className={`step-dot ${i < step ? 'completed' : i === step ? 'active' : ''}`}>
                {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-xs mt-1.5 font-medium hidden sm:block ${
                i === step ? 'text-blue-700' : i < step ? 'text-slate-600' : 'text-slate-400'
              }`} style={{ maxWidth: 80, textAlign: 'center', lineHeight: '1.2' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line mx-1 sm:mx-2 ${i < step ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 sm:hidden text-center">
        <span className="text-sm font-semibold text-blue-700">Step {step + 1}: {STEPS[step]}</span>
      </div>
    </div>
  );

  const NavButtons = () => (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
      <button onClick={prev} disabled={step === 0} className="btn-outline" style={{ opacity: step === 0 ? 0.4 : 1 }}>
        <ChevronLeft size={16} /> Previous
      </button>
      {step < STEPS.length - 1 ? (
        <button onClick={next} className="btn-primary">
          Next <ChevronRight size={16} />
        </button>
      ) : (
        <button onClick={handleSubmit} disabled={submitting} className="btn-primary" id="submit-complaint-btn"
          style={{ background: 'linear-gradient(135deg, #166534, #15803d)', opacity: submitting ? 0.7 : 1 }}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg> Submitting…
            </span>
          ) : <><Check size={16} /> Submit Complaint</>}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileWarning size={20} color="#1e3a6e" />
          <h1 className="text-2xl font-black text-slate-900">Report a Cybercrime</h1>
        </div>
        <p className="text-slate-500 text-sm">Fill out the form below to submit your complaint. All information is kept confidential.</p>
      </div>

      <div className="card p-6 sm:p-8">
        <ProgressBar />

        {/* ── Step 0: Incident Type ────────────────────────────────────────── */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Select Incident Type</h2>
            <p className="text-sm text-slate-500 mb-6">Choose the category that best describes what happened to you.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {CRIME_TYPES.map(({ type, emoji, desc }) => (
                <button key={type} type="button" id={`crime-type-${type.replace(/\W/g, '-')}`}
                  className={`crime-type-card text-left ${form.crimeType === type ? 'selected' : ''}`}
                  onClick={() => set('crimeType', type)}>
                  <div className="text-2xl mb-2">{emoji}</div>
                  <div className="text-sm font-semibold text-slate-800 leading-snug">{type}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</div>
                </button>
              ))}
            </div>
            {errors.crimeType && <p className="form-error"><AlertCircle size={12} /> {errors.crimeType}</p>}
            {form.crimeType === 'Other' && (
              <div className="mt-4">
                <label htmlFor="otherCrimeType" className="form-label">Please describe the incident type</label>
                <input id="otherCrimeType" type="text" className={`form-input ${errors.otherCrimeType ? 'error' : ''}`}
                  placeholder="e.g. Ransomware attack, Data breach..."
                  value={form.otherCrimeType} onChange={e => set('otherCrimeType', e.target.value)} />
                {errors.otherCrimeType && <p className="form-error"><AlertCircle size={12} /> {errors.otherCrimeType}</p>}
              </div>
            )}
            <NavButtons />
          </div>
        )}

        {/* ── Step 1: Incident Details ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Incident Details</h2>
            <p className="text-sm text-slate-500 mb-6">Describe what happened. Use your own words — no technical knowledge required.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="incidentDate" className="form-label flex items-center gap-1.5">
                  <Calendar size={13} /> Date of Incident <span className="text-red-500">*</span>
                </label>
                <input id="incidentDate" type="date" className={`form-input ${errors.incidentDate ? 'error' : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                  value={form.incidentDate} onChange={e => set('incidentDate', e.target.value)} />
                {errors.incidentDate && <p className="form-error"><AlertCircle size={12} /> {errors.incidentDate}</p>}
              </div>
              <div>
                <label htmlFor="incidentTime" className="form-label flex items-center gap-1.5">
                  <Clock size={13} /> Approximate Time
                </label>
                <input id="incidentTime" type="time" className="form-input"
                  value={form.incidentTime} onChange={e => set('incidentTime', e.target.value)} />
                <p className="form-hint">Approximate time is fine.</p>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="form-label">
                Describe the Incident <span className="text-red-500">*</span>
              </label>
              <textarea id="description" rows={4} className={`form-input ${errors.description ? 'error' : ''}`}
                placeholder="e.g. I received a call from someone claiming to be from my bank. They asked me to share my OTP..."
                value={form.description} onChange={e => set('description', e.target.value)} />
              <p className="form-hint">{form.description.length}/500 characters. Be as detailed as possible.</p>
              {errors.description && <p className="form-error"><AlertCircle size={12} /> {errors.description}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="howItHappened" className="form-label">
                How Did It Happen? <span className="text-red-500">*</span>
              </label>
              <textarea id="howItHappened" rows={3} className={`form-input ${errors.howItHappened ? 'error' : ''}`}
                placeholder="e.g. I clicked a link in an SMS. After entering my details, money was deducted..."
                value={form.howItHappened} onChange={e => set('howItHappened', e.target.value)} />
              {errors.howItHappened && <p className="form-error"><AlertCircle size={12} /> {errors.howItHappened}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="amountInvolved" className="form-label flex items-center gap-1.5">
                  <IndianRupee size={13} /> Amount Lost (if any)
                </label>
                <input id="amountInvolved" type="number" min="0" className="form-input"
                  placeholder="e.g. 45000" value={form.amountInvolved} onChange={e => set('amountInvolved', e.target.value)} />
                <p className="form-hint">Leave blank if no financial loss.</p>
              </div>
              <div>
                <label htmlFor="transactionId" className="form-label">Transaction ID (if any)</label>
                <input id="transactionId" type="text" className="form-input"
                  placeholder="e.g. UPI-2026082712340089" value={form.transactionId} onChange={e => set('transactionId', e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactInvolved" className="form-label flex items-center gap-1.5">
                  <Smartphone size={13} /> Suspect Contact/Username
                </label>
                <input id="contactInvolved" type="text" className="form-input"
                  placeholder="e.g. 9876543210 / @frauduser" value={form.contactInvolved} onChange={e => set('contactInvolved', e.target.value)} />
              </div>
              <div>
                <label htmlFor="platform" className="form-label flex items-center gap-1.5">
                  <Globe size={13} /> Platform Used
                </label>
                <input id="platform" type="text" className="form-input"
                  placeholder="e.g. PhonePe, Instagram, SMS" value={form.platform} onChange={e => set('platform', e.target.value)} />
              </div>
            </div>
            <NavButtons />
          </div>
        )}

        {/* ── Step 2: Evidence ─────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Upload Evidence</h2>
            <p className="text-sm text-slate-500 mb-2">Upload any supporting files. Evidence helps strengthen your complaint.</p>
            <div className="flex items-start gap-2 p-3 rounded-xl mb-6 text-sm"
              style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <Info size={15} color="#0369a1" className="flex-shrink-0 mt-0.5" />
              <p className="text-blue-800">
                Your evidence will be securely associated with your complaint and only accessed by authorized investigators.
              </p>
            </div>
            <div className="mb-4">
              <p className="form-label mb-2">Accepted evidence types:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Screenshots', 'Transaction Receipts', 'Email Screenshots', 'Chat Screenshots', 'Documents', 'Other Evidence'].map(t => (
                  <span key={t} className="badge badge-submitted">{t}</span>
                ))}
              </div>
            </div>
            <FileUpload files={form.evidenceFiles} onChange={v => set('evidenceFiles', v)} />
            <p className="text-sm text-slate-500 mt-4 italic">
              Evidence upload is optional but strongly recommended. You can also add evidence later.
            </p>
            <NavButtons />
          </div>
        )}

        {/* ── Step 3: Contact Details ──────────────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Your Contact Details</h2>
            <p className="text-sm text-slate-500 mb-2">We need your contact details to keep you updated on your complaint.</p>
            <div className="flex items-start gap-2 p-3 rounded-xl mb-6 text-sm"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Info size={15} color="#166534" className="flex-shrink-0 mt-0.5" />
              <p className="text-green-800">
                <strong>Privacy Notice:</strong> Your personal information is used solely for processing your complaint and will not be shared publicly or with third parties.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="contactName" className="form-label">Full Name <span className="text-red-500">*</span></label>
                <input id="contactName" type="text" className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Your full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} autoComplete="name" />
                {errors.fullName && <p className="form-error"><AlertCircle size={12} /> {errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="contactMobile" className="form-label">Mobile Number <span className="text-red-500">*</span></label>
                <input id="contactMobile" type="tel" className={`form-input ${errors.mobile ? 'error' : ''}`}
                  placeholder="10-digit mobile" value={form.mobile} onChange={e => set('mobile', e.target.value)} autoComplete="tel" />
                {errors.mobile && <p className="form-error"><AlertCircle size={12} /> {errors.mobile}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="contactEmail" className="form-label">Email Address <span className="text-red-500">*</span></label>
              <input id="contactEmail" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              {errors.email && <p className="form-error"><AlertCircle size={12} /> {errors.email}</p>}
            </div>
            <div>
              <label className="form-label">Preferred Communication Method</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {(['mobile', 'email', 'both'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="preferredContact" value={opt} checked={form.preferredContact === opt}
                      onChange={() => set('preferredContact', opt)} className="accent-blue-700" />
                    <span className="text-sm text-slate-700 capitalize">{opt === 'both' ? 'Both' : opt === 'mobile' ? 'SMS/Call' : 'Email'}</span>
                  </label>
                ))}
              </div>
            </div>
            <NavButtons />
          </div>
        )}

        {/* ── Step 4: Review & Submit ──────────────────────────────────────── */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Review & Submit</h2>
            <p className="text-sm text-slate-500 mb-6">Please review your complaint details before submitting.</p>

            <div className="space-y-4 mb-6">
              {[
                { label: 'Incident Type', value: form.crimeType === 'Other' ? form.otherCrimeType : form.crimeType },
                { label: 'Date of Incident', value: form.incidentDate || '—' },
                { label: 'Description', value: form.description },
                { label: 'How It Happened', value: form.howItHappened },
                { label: 'Financial Loss', value: form.amountInvolved ? `₹${Number(form.amountInvolved).toLocaleString('en-IN')}` : 'None reported' },
                { label: 'Platform', value: form.platform || '—' },
                { label: 'Evidence Files', value: `${form.evidenceFiles.length} file(s) attached` },
                { label: 'Contact Name', value: form.fullName },
                { label: 'Mobile', value: form.mobile },
                { label: 'Email', value: form.email },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm font-semibold text-slate-500 w-36 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-800 flex-1">{value || '—'}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input type="checkbox" checked={form.confirmed} onChange={e => set('confirmed', e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-blue-700 flex-shrink-0" id="confirm-checkbox" />
              <span className="text-sm text-slate-700">
                <strong>I confirm</strong> that the information provided is accurate to the best of my knowledge. I understand that providing false information is a punishable offence.
              </span>
            </label>
            {errors.confirmed && <p className="form-error mb-3"><AlertCircle size={12} /> {errors.confirmed}</p>}

            <NavButtons />
          </div>
        )}
      </div>

      {/* Side note */}
      <div className="mt-4 flex items-start gap-2 px-2">
        <CheckSquare size={14} color="#64748b" className="flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400">
          Submitting a false complaint is a criminal offence under the IT Act, 2000. All submitted complaints are reviewed by trained officers.
        </p>
      </div>
    </div>
  );
}
