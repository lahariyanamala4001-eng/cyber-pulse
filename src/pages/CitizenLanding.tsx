import { Link } from 'react-router-dom';
import {
  Shield, FileWarning, Search, ShieldCheck, Phone,
  ArrowRight, AlertTriangle, CheckCircle, Star, Users, TrendingUp,
  Lock, Globe, Zap
} from 'lucide-react';
import { mockAlerts } from '../data/mockAlerts';

const quickActions = [
  {
    id: 'report',
    icon: <FileWarning size={28} color="#1e3a6e" />,
    title: 'Report Cybercrime',
    desc: 'Report an online fraud, scam, harassment, identity theft or other cybercrime.',
    cta: 'Start Report',
    to: '/report',
    bg: '#f0f4ff',
    border: '#c7d7f8',
    ctaColor: '#1e3a6e',
  },
  {
    id: 'track',
    icon: <Search size={28} color="#0369a1" />,
    title: 'Track Complaint',
    desc: 'Check the current status of your submitted complaint using your complaint ID.',
    cta: 'Track Status',
    to: '/track',
    bg: '#f0f9ff',
    border: '#bae6fd',
    ctaColor: '#0369a1',
  },
  {
    id: 'safety',
    icon: <ShieldCheck size={28} color="#166534" />,
    title: 'Safety Centre',
    desc: 'Learn how to protect yourself from common cyber threats and fraud tactics.',
    cta: 'Stay Safe',
    to: '/safety-centre',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    ctaColor: '#166534',
  },
  {
    id: 'help',
    icon: <Phone size={28} color="#7c3aed" />,
    title: 'Emergency Help',
    desc: 'Find immediate assistance and important cybercrime helpline contacts.',
    cta: 'Get Help',
    to: '/help',
    bg: '#faf5ff',
    border: '#ddd6fe',
    ctaColor: '#7c3aed',
  },
];

const stats = [
  { label: 'Complaints Resolved', value: '1.2L+', icon: <CheckCircle size={20} color="#166534" /> },
  { label: 'Citizens Served', value: '8.4L+', icon: <Users size={20} color="#1e3a6e" /> },
  { label: 'Avg. Response Time', value: '24 hrs', icon: <TrendingUp size={20} color="#0369a1" /> },
  { label: 'Safety Tips Shared', value: '50K+', icon: <Star size={20} color="#d97706" /> },
];

const features = [
  { icon: <Lock size={20} color="#1e3a6e" />, title: 'End-to-End Encrypted', desc: 'Your complaint data is encrypted using AES-256 — accessible only to authorized authorities.' },
  { icon: <Globe size={20} color="#0369a1" />, title: 'Available 24/7', desc: 'Report cybercrime anytime, anywhere. The portal never closes.' },
  { icon: <Zap size={20} color="#d97706" />, title: 'Real-Time Updates', desc: 'Receive instant notifications when your complaint status changes.' },
];

export default function CitizenLanding() {
  const urgentAlerts = mockAlerts.filter(a => a.severity === 'high' && !a.isDismissed).slice(0, 2);

  return (
    <div className="animate-fade-in">
      {/* Alert Banner */}
      {urgentAlerts.length > 0 && (
        <div style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
            <AlertTriangle size={15} color="#dc2626" className="flex-shrink-0" />
            <p className="text-sm text-red-800">
              <strong>Alert:</strong> {urgentAlerts[0].title} —{' '}
              <Link to="/alerts" className="underline font-semibold hover:text-red-900">View all alerts</Link>
            </p>
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-gradient py-20 sm:py-28" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
                <Shield size={13} color="#06b6d4" />
                <span className="text-xs font-bold tracking-wide" style={{ color: '#06b6d4' }}>
                  NATIONAL CYBERCRIME CITIZEN PORTAL
                </span>
              </div>

              <h1 id="hero-heading"
                className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6"
                style={{ letterSpacing: '-0.02em' }}>
                Report Cybercrime.<br />
                <span style={{ color: '#67e8f9' }}>Stay Informed.</span><br />
                Stay Safe.
              </h1>

              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#93c5fd' }}>
                Report cybercrime securely, track your complaint in real time, and receive important safety alerts — all in one trusted platform.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/report" id="hero-report-cta" className="btn-primary text-base px-7 py-3.5"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', boxShadow: '0 4px 20px rgba(6,182,212,0.35)' }}>
                  <FileWarning size={18} /> Report a Cybercrime
                </Link>
                <Link to="/track" id="hero-track-cta"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'white' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                  <Search size={18} /> Track My Complaint
                </Link>
              </div>

              {/* Trust line */}
              <div className="mt-8 flex items-center gap-2">
                <Shield size={14} color="#64748b" />
                <span className="text-xs" style={{ color: '#64748b' }}>
                  Secured by Government of India · Ministry of Home Affairs
                </span>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hidden lg:flex items-center justify-center animate-fade-in delay-300">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full animate-pulse-ring"
                  style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' }} />

                {/* Main shield */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                  <div className="absolute w-56 h-56 rounded-full"
                    style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }} />
                  <div className="absolute w-40 h-40 rounded-full"
                    style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }} />
                  <div className="relative flex items-center justify-center w-28 h-28 rounded-full shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, #0f2040 0%, #1e3a6e 100%)', border: '2px solid rgba(6,182,212,0.4)' }}>
                    <Shield size={56} color="#06b6d4" strokeWidth={1.5} />
                  </div>

                  {/* Floating badges */}
                  {[
                    { label: '✓ Secure', x: '-translate-x-28 -translate-y-12', bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
                    { label: '🔒 Encrypted', x: 'translate-x-24 -translate-y-8', bg: '#f0f4ff', border: '#c7d7f8', color: '#1e3a6e' },
                    { label: '📋 Track Live', x: '-translate-x-20 translate-y-16', bg: '#faf5ff', border: '#ddd6fe', color: '#7c3aed' },
                    { label: '🔔 Alerts', x: 'translate-x-20 translate-y-20', bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
                  ].map((badge, i) => (
                    <div key={i}
                      className={`absolute transform ${badge.x} px-3 py-1.5 rounded-full text-xs font-bold shadow-md`}
                      style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color, animationDelay: `${i * 0.2}s` }}>
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {stat.icon}
                <div>
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" aria-labelledby="quick-actions-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 id="quick-actions-heading" className="text-3xl font-black text-slate-900 mb-3">
              What would you like to do?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Choose from the options below. Reporting a cybercrime is simple and takes only a few minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, i) => (
              <div
                key={action.id}
                className={`card p-6 card-interactive flex flex-col animate-fade-in-up delay-${(i + 1) * 100}`}
                style={{ borderTop: `3px solid ${action.border}` }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: action.bg }}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{action.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5">{action.desc}</p>
                <Link
                  to={action.to}
                  id={`quick-action-${action.id}`}
                  className="flex items-center gap-2 font-semibold text-sm transition-colors"
                  style={{ color: action.ctaColor }}>
                  {action.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Trust Us ─────────────────────────────────────────────────── */}
      <section className="py-16 section-dots" aria-labelledby="trust-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="trust-heading" className="text-3xl font-black text-slate-900 mb-4">
                Built for your safety.<br />
                <span style={{ color: '#1e3a6e' }}>Designed for simplicity.</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                CyberPulse is designed so that any citizen — regardless of technical knowledge — can report cybercrime, track their complaint, and stay safe online.
              </p>
              <div className="space-y-5">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#f0f4ff' }}>
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{f.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '01', title: 'Choose incident type', desc: 'Select from a clear list of cybercrime categories.' },
                { num: '02', title: 'Describe what happened', desc: 'Tell us in your own words. No technical terms needed.' },
                { num: '03', title: 'Upload evidence', desc: 'Add screenshots, documents or receipts securely.' },
                { num: '04', title: 'Submit & track', desc: 'Get a complaint ID and track progress in real time.' },
              ].map((step) => (
                <div key={step.num} className="card p-5">
                  <div className="text-3xl font-black mb-2" style={{ color: '#e2e8f0' }}>{step.num}</div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cybercrime Helpline CTA ───────────────────────────────────────── */}
      <section className="py-16" aria-labelledby="helpline-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl p-8 sm:p-12 text-center"
            style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a6e 100%)', position: 'relative', overflow: 'hidden' }}>
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 50%, #2563b0 0%, transparent 50%)' }} />
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                <Phone size={28} color="#06b6d4" />
              </div>
              <h2 id="helpline-heading" className="text-3xl font-black text-white mb-3">
                Need Immediate Help?
              </h2>
              <p className="text-lg mb-2" style={{ color: '#93c5fd' }}>
                Call the National Cybercrime Helpline
              </p>
              <div className="text-5xl font-black mb-6" style={{ color: '#06b6d4', letterSpacing: '-0.02em' }}>
                1930
              </div>
              <p className="text-sm mb-8" style={{ color: '#64748b' }}>
                Available 24 hours, 7 days a week · Free of charge · Toll-free
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/report" className="btn-primary px-8 py-3.5"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
                  <FileWarning size={16} /> Report Online Now
                </Link>
                <Link to="/safety-map" className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: 'white' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                  Find Nearby Help Centre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
