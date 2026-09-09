import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, FolderOpen, AlertTriangle, Handshake, CheckCircle2,
  ArrowRight, RefreshCw, Clock, Map, History, Shield,
} from 'lucide-react';
import { useLEAAuth } from '../../context/LEAAuthContext';
import { leaDashboardService } from '../../services/leaApi';
import type { LEADashboardSummary, LEADashboardAlert } from '../../types/lea';
import type { LEACase } from '../../types/lea';

export default function LEADashboard() {
  const { user } = useLEAAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<LEADashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<LEADashboardAlert[]>([]);
  const [recentCases, setRecentCases] = useState<LEACase[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, a, c] = await Promise.all([
        leaDashboardService.getSummary(),
        leaDashboardService.getAlerts(),
        leaDashboardService.getRecentCases(),
      ]);
      setSummary(s);
      setAlerts(a);
      setRecentCases(c);
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const priorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
      case 'High': return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
      case 'Medium': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
      default: return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Open': 'badge-submitted',
      'Under Investigation': 'badge-investigating',
      'Bank Coordination': 'badge-review',
      'Pending Evidence': 'badge-assigned',
      'Resolved': 'badge-resolved',
      'Closed': 'badge-closed',
      'Active': 'badge-investigating',
      'Under Review': 'badge-review',
      'Monitoring': 'badge-assigned',
    };
    return map[status] || 'badge-submitted';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="metric-card h-28 shimmer" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6 shimmer h-80" />
          <div className="card p-6 shimmer h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <AlertTriangle size={40} color="#dc2626" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Unavailable</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button onClick={fetchData} className="btn-primary">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'New Complaints', value: summary?.newComplaints ?? 0, icon: <FileText size={20} />, color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
    { label: 'Active Cases', value: summary?.activeCases ?? 0, icon: <FolderOpen size={20} />, color: '#1e3a6e', bg: '#f0f4ff', border: '#c7d7f8' },
    { label: 'High Priority', value: summary?.highPriorityCases ?? 0, icon: <AlertTriangle size={20} />, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    { label: 'Bank Escalations', value: summary?.bankEscalations ?? 0, icon: <Handshake size={20} />, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    { label: 'Resolved Cases', value: summary?.resolvedCases ?? 0, icon: <CheckCircle2 size={20} />, color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  ];

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Intelligence Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome, {user?.rank} {user?.fullName}. {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 live-pulse" />
            ONLINE
          </div>
          <button onClick={fetchData} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
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
        {/* Left column — Alerts + Cases */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Alerts */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle size={16} color="#dc2626" /> Recent Alerts
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Alert Type</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map(alert => {
                    const pc = priorityColor(alert.severity);
                    return (
                      <tr key={alert.id}>
                        <td className="font-semibold text-slate-800">{alert.id}</td>
                        <td>{alert.alertType}</td>
                        <td>{alert.location}</td>
                        <td>
                          <span className="badge" style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="text-slate-500">{alert.time}</td>
                        <td><span className={`badge ${statusBadge(alert.status)}`}>{alert.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Cases */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <FolderOpen size={16} color="#1e3a6e" /> Recent Cases
              </h2>
              <Link to="/lea/complaints" className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Crime Type</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Assigned Officer</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map(c => {
                    const pc = priorityColor(c.priority);
                    return (
                      <tr key={c.id}>
                        <td>
                          <Link to={`/lea/complaints/${c.id}`} className="font-semibold text-blue-700 hover:text-blue-900">
                            {c.id}
                          </Link>
                        </td>
                        <td>{c.category}</td>
                        <td>{c.location}</td>
                        <td>
                          <span className="badge" style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}>
                            {c.priority}
                          </span>
                        </td>
                        <td>{c.assignedOfficer}</td>
                        <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                        <td className="text-slate-500 text-xs">
                          {new Date(c.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Shield size={14} color="#1e3a6e" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { to: '/lea/complaints', label: 'View Complaints', icon: <FileText size={14} /> },
                { to: '/lea/complaints', label: 'Open Case', icon: <FolderOpen size={14} /> },
                { to: '/lea/previous-cases', label: 'Previous Cases', icon: <History size={14} /> },
                { to: '/lea/map', label: 'View Map', icon: <Map size={14} /> },
                { to: '/lea/bank-coordination', label: 'Bank Coordination', icon: <Handshake size={14} /> },
              ].map(action => (
                <Link key={action.label} to={action.to}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  <span className="text-slate-400">{action.icon}</span>
                  {action.label}
                  <ArrowRight size={12} color="#94a3b8" className="ml-auto" />
                </Link>
              ))}
            </div>
          </div>

          {/* Case Priority Distribution */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Case Priority Distribution</h3>
            <div className="space-y-2.5">
              {[
                { level: 'Critical', count: recentCases.filter(c => c.priority === 'Critical').length, color: '#dc2626', total: recentCases.length },
                { level: 'High', count: recentCases.filter(c => c.priority === 'High').length, color: '#ea580c', total: recentCases.length },
                { level: 'Medium', count: recentCases.filter(c => c.priority === 'Medium').length, color: '#d97706', total: recentCases.length },
                { level: 'Low', count: recentCases.filter(c => c.priority === 'Low').length, color: '#16a34a', total: recentCases.length },
              ].map(r => (
                <div key={r.level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: r.color }}>{r.level}</span>
                    <span className="text-xs text-slate-500">{r.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: '#f1f5f9' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${r.total > 0 ? (r.count / r.total) * 100 : 0}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Preview */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Clock size={14} /> Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { text: 'Critical bank alert received from SecureBank', time: '2h ago', color: '#dc2626' },
                { text: 'New complaint COMP-008 submitted', time: '5h ago', color: '#ea580c' },
                { text: 'Case LEA-CASE-003 resolved', time: '1d ago', color: '#166534' },
                { text: 'Emerging fraud pattern detected in Hyderabad', time: '1d ago', color: '#d97706' },
              ].map((item, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                  <div>
                    <p className="text-sm text-slate-700">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
