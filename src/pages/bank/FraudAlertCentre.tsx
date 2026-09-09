import { useState } from 'react';
import { AlertTriangle, Filter, CheckCheck, Search } from 'lucide-react';
import { mockFraudAlerts } from '../../data/bank/mockFraudAlerts';
import FraudAlertCard from '../../components/bank/FraudAlertCard';
import type { RiskLevel, FraudAlertStatus } from '../../types/bank';

export default function FraudAlertCentre() {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<FraudAlertStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockFraudAlerts.filter(a => {
    if (riskFilter !== 'ALL' && a.riskLevel !== riskFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.id.toLowerCase().includes(q) || a.transactionId.toLowerCase().includes(q) ||
        a.transaction.accountName.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    CRITICAL: mockFraudAlerts.filter(a => a.riskLevel === 'CRITICAL').length,
    HIGH: mockFraudAlerts.filter(a => a.riskLevel === 'HIGH').length,
    MEDIUM: mockFraudAlerts.filter(a => a.riskLevel === 'MEDIUM').length,
    LOW: mockFraudAlerts.filter(a => a.riskLevel === 'LOW').length,
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle size={22} color="#dc2626" /> Fraud Alert Centre
          </h1>
          <p className="text-slate-500 text-sm">Monitor, review and action fraud alerts in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" /> LIVE
          </span>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map(level => {
          const colors: Record<RiskLevel, { bg: string; color: string; border: string }> = {
            CRITICAL: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
            HIGH: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
            MEDIUM: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
            LOW: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
          };
          const c = colors[level];
          return (
            <button key={level} onClick={() => setRiskFilter(riskFilter === level ? 'ALL' : level)}
              className={`card p-4 text-center transition-all ${riskFilter === level ? 'ring-2' : ''}`}
              style={{ borderTop: `3px solid ${c.border}`, ...(riskFilter === level ? { ringColor: c.color } : {}) }}>
              <p className="text-2xl font-black" style={{ color: c.color }}>{counts[level]}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: c.color }}>{level}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Search size={15} color="#94a3b8" /></div>
            <input type="text" className="form-input pl-9 py-2 text-sm" placeholder="Search alerts, transaction IDs, accounts…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} color="#64748b" />
            <select className="form-input py-2 text-sm w-auto"
              value={statusFilter} onChange={e => setStatusFilter(e.target.value as FraudAlertStatus | 'ALL')}>
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Escalated">Escalated</option>
              <option value="Confirmed Fraud">Confirmed Fraud</option>
              <option value="False Positive">False Positive</option>
              <option value="Resolved">Resolved</option>
            </select>
            {(riskFilter !== 'ALL' || statusFilter !== 'ALL' || search) && (
              <button onClick={() => { setRiskFilter('ALL'); setStatusFilter('ALL'); setSearch(''); }}
                className="btn-outline py-2 px-3 text-xs">
                <CheckCheck size={12} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-slate-500 mb-4">{filtered.length} alert(s) found</p>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertTriangle size={40} color="#e2e8f0" className="mx-auto mb-3" />
          <h3 className="font-bold text-slate-600 mb-1">No alerts match your filters</h3>
          <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(alert => (
            <FraudAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
