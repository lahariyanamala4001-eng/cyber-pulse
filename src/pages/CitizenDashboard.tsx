import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileWarning, Clock, CheckCircle, Bell, ShieldCheck,
  Plus, ArrowRight, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockComplaints } from '../data/mockComplaints';
import { mockAlerts } from '../data/mockAlerts';
import ComplaintCard from '../components/ComplaintCard';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'cards' | 'table'>('table');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const active = mockComplaints.filter(c => !['Resolved', 'Closed'].includes(c.status));
  const resolved = mockComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status));
  const unreadAlerts = mockAlerts.filter(a => !a.isRead && !a.isDismissed);

  const stats = [
    { label: 'Active Complaints', value: active.length, icon: <FileWarning size={20} color="#1e3a6e" />, bg: '#f0f4ff', border: '#c7d7f8', color: '#1e3a6e' },
    { label: 'Resolved', value: resolved.length, icon: <CheckCircle size={20} color="#166534" />, bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
    { label: 'New Alerts', value: unreadAlerts.length, icon: <Bell size={20} color="#dc2626" />, bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
    { label: 'Safety Score', value: '8.5/10', icon: <ShieldCheck size={20} color="#7c3aed" />, bg: '#faf5ff', border: '#ddd6fe', color: '#7c3aed' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-5 h-24 shimmer" />
          ))}
        </div>
        <div className="card p-6 shimmer h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Citizen'}! 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Here's an overview of your complaints and latest alerts.
          </p>
        </div>
        <Link to="/report" id="dashboard-report-btn" className="btn-primary flex-shrink-0">
          <Plus size={16} /> New Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5" style={{ borderTop: `3px solid ${s.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                {s.icon}
              </div>
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Complaints Table */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">My Complaints</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setView(view === 'table' ? 'cards' : 'table')}
                  className="btn-outline py-1.5 px-3 text-xs">
                  {view === 'table' ? 'Card View' : 'Table View'}
                </button>
                <button className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
                  <RefreshCw size={11} /> Refresh
                </button>
              </div>
            </div>

            {view === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left" aria-label="Complaints table">
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Complaint ID', 'Type', 'Date', 'Status', 'Last Updated', 'Action'].map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockComplaints.map(c => (
                      <ComplaintCard key={c.id} complaint={c} view="row" />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {mockComplaints.map(c => (
                  <ComplaintCard key={c.id} complaint={c} view="card" />
                ))}
              </div>
            )}

            {mockComplaints.length === 0 && (
              <div className="text-center py-16 px-6">
                <FileWarning size={40} color="#e2e8f0" className="mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No complaints yet</p>
                <p className="text-sm text-slate-400 mb-4">Your submitted complaints will appear here.</p>
                <Link to="/report" className="btn-primary inline-flex">
                  <Plus size={15} /> Report Cybercrime
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Latest Alerts */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Latest Alerts</h2>
              <Link to="/alerts" className="text-xs font-semibold text-blue-700 hover:text-blue-900">View all</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {mockAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className={`px-4 py-3 ${!alert.isRead ? 'bg-blue-50/40' : ''}`}>
                  <div className="flex items-start gap-2">
                    <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8efff)' }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} color="#1e3a6e" />
              <span className="font-bold text-slate-800 text-sm">Safety Tip of the Day</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Never share your OTP, UPI PIN, or bank details with anyone — not even someone claiming to be from your bank.
            </p>
            <Link to="/safety-centre" className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: '#1e3a6e' }}>
              More Safety Tips <ArrowRight size={12} />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/report', label: 'Report New Cybercrime', icon: <Plus size={14} /> },
                { to: '/track', label: 'Track a Complaint', icon: <Clock size={14} /> },
                { to: '/safety-map', label: 'Find Nearby Help', icon: <ShieldCheck size={14} /> },
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
