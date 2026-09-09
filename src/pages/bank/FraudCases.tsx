import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FolderSearch, Search, ChevronRight, Clock } from 'lucide-react';
import { mockFraudCases } from '../../data/bank/mockFraudCases';
import CaseTimeline from '../../components/bank/CaseTimeline';
import type { FraudCaseStatus } from '../../types/bank';

export default function FraudCases() {
  const { id } = useParams<{ id: string }>();
  const [statusFilter, setStatusFilter] = useState<FraudCaseStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Detail view
  const selectedCase = id ? mockFraudCases.find(c => c.id === id) : null;
  if (selectedCase) {
    return (
      <div className="p-4 sm:p-6 animate-fade-in">
        <Link to="/bank/cases" className="btn-outline mb-4 text-sm">← Back to Cases</Link>
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Case ID</p>
              <h2 className="text-2xl font-black font-mono text-blue-700">{selectedCase.id}</h2>
              <p className="text-slate-600 font-medium mt-0.5">{selectedCase.title}</p>
            </div>
            <span className={`badge risk-${selectedCase.riskLevel.toLowerCase()} text-sm px-3 py-1`}>
              {selectedCase.riskLevel}
            </span>
          </div>
          <p className="text-sm text-slate-700 mb-5 leading-relaxed">{selectedCase.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100">
            {[
              { label: 'Status', value: selectedCase.status },
              { label: 'Amount Involved', value: `₹${selectedCase.totalAmountInvolved.toLocaleString('en-IN')}` },
              { label: 'Recovered', value: `₹${selectedCase.recoveredAmount.toLocaleString('en-IN')}` },
              { label: 'Assigned To', value: selectedCase.assignedOfficer },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Clock size={17} color="#1e3a6e" /> Case Timeline
            </h3>
            <CaseTimeline timeline={selectedCase.timeline} />
          </div>
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-3">Linked Alerts</h3>
              <div className="space-y-2">
                {selectedCase.linkedAlerts.map(a => (
                  <Link key={a} to="/bank/alerts" className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <span className="font-mono text-xs font-bold text-blue-700">{a}</span>
                    <ChevronRight size={12} color="#94a3b8" className="ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-3">Linked Transactions</h3>
              <div className="space-y-2">
                {selectedCase.linkedTransactions.map(t => (
                  <Link key={t} to={`/bank/transactions/${t}`} className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <span className="font-mono text-xs font-bold text-blue-700">{t}</span>
                    <ChevronRight size={12} color="#94a3b8" className="ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
            {selectedCase.accountsFrozen.length > 0 && (
              <div className="card p-6" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <h3 className="font-bold text-red-800 mb-2 text-sm">🔒 Frozen Accounts</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.accountsFrozen.map(acc => (
                    <span key={acc} className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-700">{acc}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedCase.leaReferralId && (
              <div className="card p-5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <h3 className="font-bold text-green-800 text-sm mb-1">📋 LEA Referral</h3>
                <p className="text-xs text-green-700">Referral ID: <strong>{selectedCase.leaReferralId}</strong></p>
                <Link to="/bank/lea-coordination" className="text-xs font-semibold text-green-700 hover:text-green-900 mt-2 inline-flex items-center gap-1">
                  View Coordination <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  const filtered = mockFraudCases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FolderSearch size={22} color="#1e3a6e" /> Fraud Cases
        </h1>
        <p className="text-slate-500 text-sm">Manage fraud cases from creation to resolution.</p>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Search size={15} color="#94a3b8" /></div>
            <input type="text" className="form-input pl-9 py-2 text-sm" placeholder="Search cases…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-input py-2 text-sm w-auto" value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as FraudCaseStatus | 'ALL')}>
            <option value="ALL">All Statuses</option>
            {['New', 'Under Investigation', 'LEA Referred', 'Account Frozen', 'Funds Recovered', 'Closed'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['Case ID', 'Title', 'Status', 'Risk', 'Amount', 'Recovered', 'Officer', 'Action'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-blue-700 text-xs">{c.id}</td>
                  <td className="max-w-48"><p className="text-sm font-medium text-slate-800 truncate">{c.title}</p></td>
                  <td><span className="badge badge-submitted text-[10px]">{c.status}</span></td>
                  <td><span className={`badge risk-${c.riskLevel.toLowerCase()} text-[10px]`}>{c.riskLevel}</span></td>
                  <td className="font-semibold text-sm">₹{c.totalAmountInvolved.toLocaleString('en-IN')}</td>
                  <td className="text-sm text-green-700 font-semibold">₹{c.recoveredAmount.toLocaleString('en-IN')}</td>
                  <td className="text-sm text-slate-600">{c.assignedOfficer}</td>
                  <td>
                    <Link to={`/bank/cases/${c.id}`} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
