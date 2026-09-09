import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftRight, Search, IndianRupee, Clock, MapPin,
  AlertTriangle, Shield, Smartphone, Globe, Info
} from 'lucide-react';
import { mockTransactions } from '../../data/bank/mockTransactions';
import { mockFraudAlerts } from '../../data/bank/mockFraudAlerts';
import type { Transaction } from '../../types/bank';
import MLInsightPanel from '../../components/bank/MLInsightPanel';

export default function TransactionInvestigation() {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    if (id) {
      const txn = mockTransactions.find(t => t.id === id);
      if (txn) setSelectedTxn(txn);
    }
  }, [id]);

  const filtered = mockTransactions.filter(t => {
    if (channelFilter !== 'ALL' && t.channel !== channelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.id.toLowerCase().includes(q) || t.accountName.toLowerCase().includes(q) ||
        t.accountId.toLowerCase().includes(q) || t.counterpartyName.toLowerCase().includes(q);
    }
    return true;
  });

  // If viewing a specific transaction
  if (selectedTxn) {
    const alert = mockFraudAlerts.find(a => a.transactionId === selectedTxn.id);
    const riskLevel = alert?.riskLevel || (selectedTxn.riskScore && selectedTxn.riskScore > 75 ? 'HIGH' : selectedTxn.riskScore && selectedTxn.riskScore > 50 ? 'MEDIUM' : 'LOW') as 'HIGH' | 'MEDIUM' | 'LOW';

    return (
      <div className="p-4 sm:p-6 animate-fade-in">
        <button onClick={() => setSelectedTxn(null)} className="btn-outline mb-4 text-sm">
          ← Back to Transactions
        </button>

        {/* Transaction Header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction ID</p>
              <h2 className="text-2xl font-black font-mono text-blue-700">{selectedTxn.id}</h2>
            </div>
            {selectedTxn.isFlagged && (
              <span className={`badge risk-${riskLevel.toLowerCase()} text-sm px-3 py-1`}>
                ⚠️ {riskLevel} RISK
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Amount', value: `₹${selectedTxn.amount.toLocaleString('en-IN')}`, icon: <IndianRupee size={13} /> },
              { label: 'Channel', value: selectedTxn.channel, icon: <Smartphone size={13} /> },
              { label: 'Timestamp', value: new Date(selectedTxn.timestamp).toLocaleString('en-IN'), icon: <Clock size={13} /> },
              { label: 'Location', value: selectedTxn.location, icon: <MapPin size={13} /> },
            ].map(({ label, value, icon }) => (
              <div key={label}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">{icon} {label}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">Transaction Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Sender Account', value: `${selectedTxn.accountName} (${selectedTxn.accountId})` },
                  { label: 'Receiver', value: `${selectedTxn.counterpartyName} (${selectedTxn.counterpartyId})` },
                  { label: 'Receiver Bank', value: selectedTxn.counterpartyBank },
                  { label: 'Type', value: selectedTxn.type },
                  { label: 'IP Address', value: selectedTxn.ipAddress },
                  { label: 'Device ID', value: selectedTxn.deviceId },
                  { label: 'International', value: selectedTxn.isInternational ? 'Yes ⚠️' : 'No' },
                  { label: 'Description', value: selectedTxn.description },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-semibold text-slate-500 w-32 flex-shrink-0">{label}</span>
                    <span className="text-sm text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Velocity Info */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">⚡ Velocity Metrics</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl" style={{ background: '#f8fafc' }}>
                  <p className="text-2xl font-black text-slate-800">{selectedTxn.velocityCount1h || 1}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Txns / 1 hr</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: '#f8fafc' }}>
                  <p className="text-2xl font-black text-slate-800">{selectedTxn.velocityCount24h || 1}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Txns / 24 hr</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: '#f8fafc' }}>
                  <p className="text-2xl font-black text-slate-800">
                    ₹{((selectedTxn.velocityAmount24h || 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Amount / 24 hr</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">🔧 Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="btn-primary text-sm py-2 px-4"><Shield size={14} /> Freeze Account</button>
                <button className="btn-secondary text-sm py-2 px-4"><AlertTriangle size={14} /> Escalate to Case</button>
                <Link to="/bank/lea-coordination" className="btn-outline text-sm py-2 px-4">
                  <Globe size={14} /> Share with LEA
                </Link>
              </div>
            </div>
          </div>

          {/* ML Panel */}
          {alert ? (
            <MLInsightPanel
              finalScore={alert.finalRiskScore}
              riskLevel={alert.riskLevel}
              recommendation={alert.recommendation}
              fraudPrediction={{
                transactionId: selectedTxn.id,
                fraudProbability: alert.fraudProbability,
                modelName: 'XGBoost Fraud Detector',
                modelVersion: 'v2.1',
                features: [
                  { feature: 'transaction_amount', value: selectedTxn.amount, importance: 0.28, direction: selectedTxn.amount > 100000 ? 'increases_risk' : 'decreases_risk' },
                  { feature: 'transaction_hour', value: parseInt(selectedTxn.timestamp.split('T')[1]?.split(':')[0] || '12'), importance: 0.19, direction: 'increases_risk' },
                  { feature: 'velocity_1h', value: selectedTxn.velocityCount1h || 1, importance: 0.22, direction: (selectedTxn.velocityCount1h || 1) > 3 ? 'increases_risk' : 'decreases_risk' },
                  { feature: 'is_international', value: selectedTxn.isInternational ? 1 : 0, importance: 0.15, direction: selectedTxn.isInternational ? 'increases_risk' : 'decreases_risk' },
                  { feature: 'device_trust_score', value: 0.1, importance: 0.16, direction: 'increases_risk' },
                ],
                predictedAt: new Date().toISOString(),
              }}
              velocityRisk={{
                accountId: selectedTxn.accountId,
                riskScore: alert.velocityRiskScore,
                transactionCount1h: selectedTxn.velocityCount1h || 1,
                transactionCount24h: selectedTxn.velocityCount24h || 1,
                totalAmount24h: selectedTxn.velocityAmount24h || selectedTxn.amount,
                avgTransactionAmount: selectedTxn.amount,
                unusualPatterns: alert.riskFactors.slice(0, 3),
                calculatedAt: new Date().toISOString(),
              }}
            />
          ) : (
            <div className="card p-6 text-center">
              <Info size={30} color="#e2e8f0" className="mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No ML analysis available for this transaction.</p>
              <p className="text-xs text-slate-400 mt-1">Transaction risk score: {selectedTxn.riskScore || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Transaction list view
  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ArrowLeftRight size={22} color="#1e3a6e" /> Transaction Investigation
        </h1>
        <p className="text-slate-500 text-sm">Search and investigate individual transactions with ML risk analysis.</p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Search size={15} color="#94a3b8" /></div>
            <input type="text" className="form-input pl-9 py-2 text-sm" placeholder="Search by ID, account name, counterparty…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-input py-2 text-sm w-auto" value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}>
            <option value="ALL">All Channels</option>
            {['UPI', 'NEFT', 'RTGS', 'IMPS', 'Card', 'ATM', 'NetBanking'].map(ch => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['ID', 'Account', 'Counterparty', 'Amount', 'Channel', 'Time', 'Risk', 'Action'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => {
                const riskColor = txn.riskScore && txn.riskScore > 75 ? '#dc2626' : txn.riskScore && txn.riskScore > 50 ? '#d97706' : '#16a34a';
                return (
                  <tr key={txn.id}>
                    <td className="font-mono font-semibold text-blue-700 text-xs">{txn.id}</td>
                    <td>
                      <p className="font-semibold text-slate-800">{txn.accountName}</p>
                      <p className="text-xs text-slate-400 font-mono">{txn.accountId}</p>
                    </td>
                    <td>
                      <p className="font-medium text-slate-700">{txn.counterpartyName}</p>
                      <p className="text-xs text-slate-400">{txn.counterpartyBank}</p>
                    </td>
                    <td className="font-semibold">₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-submitted text-[10px]">{txn.channel}</span></td>
                    <td className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(txn.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-16 h-2 rounded-full" style={{ background: '#f1f5f9' }}>
                          <div className="h-full rounded-full" style={{ width: `${txn.riskScore || 0}%`, background: riskColor }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: riskColor }}>{txn.riskScore || 0}</span>
                      </div>
                    </td>
                    <td>
                      <button onClick={() => setSelectedTxn(txn)}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                        Investigate →
                      </button>
                    </td>
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
