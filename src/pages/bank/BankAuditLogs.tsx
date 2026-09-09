import { useState } from 'react';
import { ScrollText, Search, Filter, Download } from 'lucide-react';
import { mockAuditLogs } from '../../data/bank/mockAuditLogs';
import type { AuditAction } from '../../types/bank';

const actionColors: Record<string, { bg: string; color: string }> = {
  LOGIN: { bg: '#f0f9ff', color: '#0369a1' },
  LOGOUT: { bg: '#f8fafc', color: '#64748b' },
  VIEW_ALERT: { bg: '#fffbeb', color: '#d97706' },
  ESCALATE_ALERT: { bg: '#fff7ed', color: '#ea580c' },
  DISMISS_ALERT: { bg: '#f0fdf4', color: '#166534' },
  FREEZE_ACCOUNT: { bg: '#fef2f2', color: '#dc2626' },
  UNFREEZE_ACCOUNT: { bg: '#f0fdf4', color: '#166534' },
  CREATE_CASE: { bg: '#f0f4ff', color: '#1e3a6e' },
  UPDATE_CASE: { bg: '#f0f4ff', color: '#2563b0' },
  SHARE_WITH_LEA: { bg: '#faf5ff', color: '#7c3aed' },
  VIEW_TRANSACTION: { bg: '#f8fafc', color: '#475569' },
  FLAG_TRANSACTION: { bg: '#fff7ed', color: '#ea580c' },
  EXPORT_REPORT: { bg: '#f0f9ff', color: '#0369a1' },
  UPDATE_SETTINGS: { bg: '#f8fafc', color: '#475569' },
  DEPLOY_CASHOUT_ALERT: { bg: '#fef2f2', color: '#dc2626' },
};

export default function BankAuditLogs() {
  const [actionFilter, setActionFilter] = useState<AuditAction | 'ALL'>('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const users = [...new Set(mockAuditLogs.map(l => l.userName))];

  const filtered = mockAuditLogs.filter(l => {
    if (actionFilter !== 'ALL' && l.action !== actionFilter) return false;
    if (userFilter !== 'ALL' && l.userName !== userFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.target.toLowerCase().includes(q) || l.details.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ScrollText size={22} color="#1e3a6e" /> Audit Logs
          </h1>
          <p className="text-slate-500 text-sm">Complete trail of all actions taken in the bank portal.</p>
        </div>
        <button className="btn-outline text-sm py-2 px-4">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Search size={15} color="#94a3b8" /></div>
            <input type="text" className="form-input pl-9 py-2 text-sm" placeholder="Search targets, details…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} color="#64748b" />
            <select className="form-input py-2 text-sm w-auto" value={actionFilter}
              onChange={e => setActionFilter(e.target.value as AuditAction | 'ALL')}>
              <option value="ALL">All Actions</option>
              {Object.keys(actionColors).map(a => (
                <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select className="form-input py-2 text-sm w-auto" value={userFilter}
              onChange={e => setUserFilter(e.target.value)}>
              <option value="ALL">All Users</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-3">{filtered.length} log entries</p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['Timestamp', 'User', 'Action', 'Target', 'Details', 'IP'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const ac = actionColors[log.action] || { bg: '#f8fafc', color: '#475569' };
                return (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="font-medium text-sm">{log.userName}</td>
                    <td>
                      <span className="badge text-[10px] px-2 py-0.5" style={{ background: ac.bg, color: ac.color, border: `1px solid ${ac.color}30` }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-blue-700 font-semibold">{log.target}</td>
                    <td className="text-xs text-slate-600 max-w-64 truncate">{log.details}</td>
                    <td className="font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
