import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight, Clock, IndianRupee, MapPin } from 'lucide-react';
import type { FraudAlert } from '../../types/bank';
import { getRiskLevelColor, getRiskLevelBg, getRiskLevelBorder } from '../../services/mlService';

interface FraudAlertCardProps {
  alert: FraudAlert;
  compact?: boolean;
}

export default function FraudAlertCard({ alert, compact = false }: FraudAlertCardProps) {
  const color = getRiskLevelColor(alert.riskLevel);
  const bg = getRiskLevelBg(alert.riskLevel);
  const border = getRiskLevelBorder(alert.riskLevel);

  const time = new Date(alert.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (compact) {
    return (
      <Link to={`/bank/transactions/${alert.transactionId}`}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${alert.riskLevel === 'CRITICAL' ? 'live-pulse' : ''}`}
          style={{ background: color }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{alert.transaction.accountName}</p>
          <p className="text-xs text-slate-500">₹{alert.transaction.amount.toLocaleString('en-IN')} · {alert.transaction.channel}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="badge text-[10px] py-0.5 px-2" style={{ background: bg, color, border: `1px solid ${border}` }}>
            {alert.riskLevel}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="card overflow-hidden animate-fade-in" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${alert.riskLevel === 'CRITICAL' ? 'live-pulse' : ''}`}
              style={{ background: color }} />
            <span className="badge" style={{ background: bg, color, border: `1px solid ${border}` }}>
              {alert.riskLevel}
            </span>
            <span className="badge badge-submitted text-[10px]">{alert.status}</span>
          </div>
          <span className="text-xs font-mono text-slate-400">{alert.id}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Account</p>
            <p className="text-sm font-semibold text-slate-800">{alert.transaction.accountName}</p>
            <p className="text-xs text-slate-500 font-mono">{alert.transaction.accountId}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Transaction</p>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              <IndianRupee size={12} />
              {alert.transaction.amount.toLocaleString('en-IN')}
              <span className="text-slate-400 font-normal">via {alert.transaction.channel}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg" style={{ background: '#f8fafc' }}>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Fraud Prob</p>
            <p className="text-lg font-black" style={{ color }}>{(alert.fraudProbability * 100).toFixed(0)}%</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: '#f8fafc' }}>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Velocity</p>
            <p className="text-lg font-black" style={{ color }}>{alert.velocityRiskScore}</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: bg }}>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Final Score</p>
            <p className="text-lg font-black" style={{ color }}>{alert.finalRiskScore}</p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-500 mb-1.5">Risk Factors:</p>
          <div className="flex flex-wrap gap-1.5">
            {alert.riskFactors.slice(0, 4).map((f, i) => (
              <span key={i} className="text-[11px] px-2 py-1 rounded-lg font-medium"
                style={{ background: '#fef2f2', color: '#991b1b' }}>
                <AlertTriangle size={9} className="inline mr-1" />{f}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock size={11} /> {time}</span>
            <span className="flex items-center gap-1"><MapPin size={11} /> {alert.transaction.location}</span>
          </div>
          <Link to={`/bank/transactions/${alert.transactionId}`}
            className="text-xs font-semibold flex items-center gap-1 transition-colors"
            style={{ color: '#1e3a6e' }}>
            Investigate <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
