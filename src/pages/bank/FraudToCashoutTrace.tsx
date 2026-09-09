import { Crosshair, ArrowDown, IndianRupee, MapPin, AlertTriangle } from 'lucide-react';
import { getRiskLevelColor } from '../../services/mlService';

export default function FraudToCashoutTrace() {

  const traceNodes = [
    { label: 'Compromised Account', account: 'ACC-1001 — Rajesh Kumar', bank: 'SecureBank India', type: 'source', flagged: true },
    { label: 'Transfer #1 — NEFT', amount: 245000, time: '2:14 AM', to: 'ACC-9911 (Unknown Merchant)', channel: 'NEFT', flagged: true },
    { label: 'Transfer #2 — IMPS', amount: 185000, time: '2:28 AM', to: 'ACC-3344 (Personal Transfer)', channel: 'IMPS', flagged: true },
    { label: 'Intermediate Account', account: 'ACC-9911 — Unknown Merchant', bank: 'XYZ Payments Bank', type: 'hop', flagged: true },
    { label: 'Further Transfer', amount: 200000, time: '2:45 AM (est.)', to: 'ACC-7799 (Mule Account)', channel: 'UPI', flagged: true },
    { label: 'Mule Account', account: 'ACC-7799 — Mule Account', bank: 'ABC Small Finance Bank', type: 'hop', flagged: true },
    { label: 'Cash-out — ATM', amount: 200000, time: '3:22 AM', to: 'ATM-SEC-0044 (Secunderabad)', channel: 'ATM', flagged: true },
  ];

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Crosshair size={22} color="#1e3a6e" /> Fraud-to-Cashout Trace
        </h1>
        <p className="text-slate-500 text-sm">Visual trace of money movement from initial fraud to final cash-out point.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trace Visualization */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800">Money Flow — Case FC-2026-001</h2>
              <span className="badge risk-critical">CRITICAL</span>
            </div>

            <div className="space-y-0">
              {traceNodes.map((node, i) => (
                <div key={i}>
                  <div className={`trace-node ${node.flagged ? 'flagged' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: node.type === 'source' ? '#fef2f2' : node.type === 'hop' ? '#fff7ed' : '#f0f4ff',
                        color: node.type === 'source' ? '#dc2626' : node.type === 'hop' ? '#ea580c' : '#1e3a6e',
                      }}>
                      {node.type === 'source' ? <AlertTriangle size={18} /> :
                       node.type === 'hop' ? <ArrowDown size={18} /> :
                       node.amount ? <IndianRupee size={18} /> : <MapPin size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{node.label}</p>
                      {node.account && <p className="text-xs text-slate-500">{node.account} · {node.bank}</p>}
                      {node.amount && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          <span className="font-semibold">₹{node.amount.toLocaleString('en-IN')}</span>
                          {node.channel && <span className="text-slate-400"> via {node.channel}</span>}
                          {node.time && <span className="text-slate-400"> at {node.time}</span>}
                          {node.to && <span className="text-slate-400"> → {node.to}</span>}
                        </p>
                      )}
                    </div>
                    {node.flagged && <AlertTriangle size={14} color="#dc2626" />}
                  </div>
                  {i < traceNodes.length - 1 && <div className="trace-connector" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Case Summary Sidebar */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Trace Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Amount', value: '₹4,30,000' },
                { label: 'Number of Hops', value: '3' },
                { label: 'Time Span', value: '68 minutes' },
                { label: 'Accounts Involved', value: '4' },
                { label: 'Cash-out Method', value: 'ATM Withdrawal' },
                { label: 'Cash-out Location', value: 'ATM-SEC-0044, Secunderabad' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-semibold text-slate-500">{label}</span>
                  <span className="text-xs font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5" style={{ borderLeft: `4px solid ${getRiskLevelColor('CRITICAL')}` }}>
            <h3 className="font-bold text-red-800 text-sm mb-2">⚠️ Analysis</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Classic mule account pattern: funds moved through intermediary within 68 minutes, 
              then withdrawn via ATM in Secunderabad at 3:22 AM. Speed of movement and nighttime 
              cash-out are strong indicators of organized fraud.
            </p>
          </div>

          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8efff)' }}>
            <h3 className="font-bold text-slate-800 text-sm mb-2">💡 ML Insight</h3>
            <p className="text-sm text-slate-600">
              The model detected the mule-hop pattern with 91% confidence. The combination of velocity 
              (4 txns/hr), nighttime activity, and unknown counterparties triggered the CRITICAL alert 
              within 1 minute of the first transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
