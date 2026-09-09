import { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { mockATMLocations, mockCashoutPredictions } from '../../data/bank/mockCashoutPredictions';
import PredictiveATMMap from '../../components/bank/PredictiveATMMap';
import type { RiskLevel } from '../../types/bank';

export default function PredictiveATMMapPage() {
  const [mounted, setMounted] = useState(false);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');

  useEffect(() => { setMounted(true); }, []);

  const filtered = riskFilter === 'ALL' ? mockATMLocations : mockATMLocations.filter(a => a.riskZone === riskFilter);

  const counts = {
    CRITICAL: mockATMLocations.filter(a => a.riskZone === 'CRITICAL').length,
    HIGH: mockATMLocations.filter(a => a.riskZone === 'HIGH').length,
    MEDIUM: mockATMLocations.filter(a => a.riskZone === 'MEDIUM').length,
    LOW: mockATMLocations.filter(a => a.riskZone === 'LOW').length,
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin size={22} color="#1e3a6e" /> Predictive ATM Risk Map
          </h1>
          <p className="text-slate-500 text-sm">ATM locations with risk zones and predicted cash-out markers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} color="#64748b" />
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as (RiskLevel | 'ALL')[]).map(level => {
            const colors: Record<string, string> = { ALL: '#1e3a6e', CRITICAL: '#dc2626', HIGH: '#ea580c', MEDIUM: '#d97706', LOW: '#16a34a' };
            return (
              <button key={level} onClick={() => setRiskFilter(level)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  riskFilter === level ? 'text-white' : 'text-slate-600 bg-white border-slate-200'
                }`}
                style={riskFilter === level ? { background: colors[level], borderColor: colors[level] } : {}}>
                {level} {level !== 'ALL' ? `(${counts[level as RiskLevel]})` : `(${mockATMLocations.length})`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            {mounted && (
              <PredictiveATMMap
                atmLocations={filtered}
                predictions={mockCashoutPredictions}
                height="600px"
              />
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 px-1 text-xs text-slate-400">
            {[
              { label: 'CRITICAL', color: '#dc2626' },
              { label: 'HIGH', color: '#ea580c' },
              { label: 'MEDIUM', color: '#d97706' },
              { label: 'LOW', color: '#16a34a' },
              { label: 'Predicted Cash-out', color: '#dc2626', pulse: true },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${l.pulse ? 'live-pulse' : ''}`} style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">ATM Summary</p>
            <div className="space-y-2">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map(level => {
                const colors: Record<RiskLevel, string> = { CRITICAL: '#dc2626', HIGH: '#ea580c', MEDIUM: '#d97706', LOW: '#16a34a' };
                return (
                  <div key={level} className="flex justify-between items-center py-1.5">
                    <span className="text-xs font-bold" style={{ color: colors[level] }}>{level}</span>
                    <span className="text-sm font-black text-slate-800">{counts[level]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Active Predictions</p>
            <div className="space-y-3">
              {mockCashoutPredictions.filter(p => p.status !== 'Expired').map(p => (
                <div key={p.id} className="p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <p className="text-xs font-bold text-red-800">{p.predictedATM.name}</p>
                  <p className="text-[10px] text-red-600 mt-0.5">
                    {new Date(p.predictedTimeWindow.from).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    {' — '}
                    {new Date(p.predictedTimeWindow.to).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Confidence: {(p.confidence * 100).toFixed(0)}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fff)', border: '1px solid #fecaca' }}>
            <p className="text-sm font-bold text-red-800 mb-2">🚨 Emergency</p>
            <p className="text-xs text-red-700">If a predicted cash-out is imminent, contact the nearest branch and local police immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
