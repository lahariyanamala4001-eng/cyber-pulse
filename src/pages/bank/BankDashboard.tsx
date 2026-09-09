import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ShieldOff, IndianRupee, FolderSearch,
  ArrowRight, Clock, RefreshCw, Target
} from 'lucide-react';
import { useBankAuth } from '../../context/BankAuthContext';
import { mockFraudAlerts } from '../../data/bank/mockFraudAlerts';
import { mockFraudCases } from '../../data/bank/mockFraudCases';
import FraudAlertCard from '../../components/bank/FraudAlertCard';

export default function BankDashboard() {
  const { user } = useBankAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const critical = mockFraudAlerts.filter(a => a.riskLevel === 'CRITICAL');
  const high = mockFraudAlerts.filter(a => a.riskLevel === 'HIGH');
  const activeCases = mockFraudCases.filter(c => !['Closed'].includes(c.status));
  const totalBlocked = mockFraudAlerts.filter(a => ['Escalated', 'Confirmed Fraud'].includes(a.status)).length;
  const recoveredAmount = mockFraudCases.reduce((sum, c) => sum + c.recoveredAmount, 0);
  const trendData = [5, 8, 3, 12, 7, 9, 10]; // Last 7 days

  const stats = [
    { label: 'Total Alerts Today', value: mockFraudAlerts.length, icon: <AlertTriangle size={20} />, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    { label: 'CRITICAL / HIGH', value: `${critical.length} / ${high.length}`, icon: <ShieldOff size={20} />, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    { label: 'Blocked Transactions', value: totalBlocked, icon: <ShieldOff size={20} />, color: '#7c3aed', bg: '#faf5ff', border: '#ddd6fe' },
    { label: 'Active Cases', value: activeCases.length, icon: <FolderSearch size={20} />, color: '#1e3a6e', bg: '#f0f4ff', border: '#c7d7f8' },
    { label: 'Recovered Amount', value: `₹${(recoveredAmount / 100000).toFixed(1)}L`, icon: <IndianRupee size={20} />, color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Avg Response Time', value: '4.2 min', icon: <Clock size={20} />, color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="metric-card h-24 shimmer" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6 shimmer h-80" />
          <div className="card p-6 shimmer h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Fraud Intelligence Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome back, {user?.fullName}. Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
            LIVE
          </div>
          <button className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="metric-card" style={{ borderTop: `3px solid ${s.border}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Critical/High Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <AlertTriangle size={18} color="#dc2626" /> Recent High-Priority Alerts
            </h2>
            <Link to="/bank/alerts" className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {mockFraudAlerts
            .filter(a => ['CRITICAL', 'HIGH'].includes(a.riskLevel))
            .slice(0, 4)
            .map(alert => (
              <FraudAlertCard key={alert.id} alert={alert} />
            ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Fraud Trend Mini Chart */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center justify-between">
              Alert Trend (7 days)
              <span className="text-xs font-normal text-slate-400">Total: {trendData.reduce((a, b) => a + b, 0)}</span>
            </h3>
            <div className="mini-bar" style={{ height: 60 }}>
              {trendData.map((v, i) => (
                <div key={i} className="mini-bar-item" style={{ height: `${(v / Math.max(...trendData)) * 100}%` }}
                  title={`Day ${i + 1}: ${v} alerts`} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-400">
              <span>Sep 1</span><span>Sep 7</span>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Risk Distribution</h3>
            <div className="space-y-2.5">
              {[
                { level: 'CRITICAL', count: critical.length, color: '#dc2626', pct: (critical.length / mockFraudAlerts.length) * 100 },
                { level: 'HIGH', count: high.length, color: '#ea580c', pct: (high.length / mockFraudAlerts.length) * 100 },
                { level: 'MEDIUM', count: mockFraudAlerts.filter(a => a.riskLevel === 'MEDIUM').length, color: '#d97706', pct: (mockFraudAlerts.filter(a => a.riskLevel === 'MEDIUM').length / mockFraudAlerts.length) * 100 },
                { level: 'LOW', count: mockFraudAlerts.filter(a => a.riskLevel === 'LOW').length, color: '#16a34a', pct: (mockFraudAlerts.filter(a => a.riskLevel === 'LOW').length / mockFraudAlerts.length) * 100 },
              ].map(r => (
                <div key={r.level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: r.color }}>{r.level}</span>
                    <span className="text-xs text-slate-500">{r.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: '#f1f5f9' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Cases */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Active Cases</h3>
              <Link to="/bank/cases" className="text-xs font-semibold text-blue-700 hover:text-blue-900">View all</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {activeCases.slice(0, 4).map(c => (
                <Link key={c.id} to={`/bank/cases/${c.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                  <FolderSearch size={14} color="#1e3a6e" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.id}</p>
                    <p className="text-xs text-slate-500 truncate">{c.title}</p>
                  </div>
                  <span className={`badge text-[10px] risk-${c.riskLevel.toLowerCase()}`}>
                    {c.riskLevel}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/bank/alerts', label: 'Review Pending Alerts', icon: <AlertTriangle size={14} /> },
                { to: '/bank/cashout-predictions', label: 'Cash-out Predictions', icon: <Target size={14} /> },
                { to: '/bank/atm-map', label: 'Predictive ATM Map', icon: <Target size={14} /> },
                { to: '/bank/lea-coordination', label: 'LEA Coordination', icon: <FolderSearch size={14} /> },
              ].map(action => (
                <Link key={action.to} to={action.to}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  <span className="text-slate-400">{action.icon}</span>
                  {action.label}
                  <ArrowRight size={12} color="#94a3b8" className="ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
