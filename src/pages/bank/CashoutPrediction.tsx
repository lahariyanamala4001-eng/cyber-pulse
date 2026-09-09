import { useState, useEffect } from 'react';
import { Target, Clock, MapPin, AlertTriangle, Check, Info } from 'lucide-react';
import { mockCashoutPredictions, mockATMLocations } from '../../data/bank/mockCashoutPredictions';
import PredictiveATMMap from '../../components/bank/PredictiveATMMap';

export default function CashoutPredictionPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Target size={22} color="#1e3a6e" /> Cash-out Predictions
        </h1>
        <p className="text-slate-500 text-sm">ML-predicted cash-out events with time windows and ATM locations.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Predictions List */}
        <div className="lg:col-span-2 space-y-4">
          {mockCashoutPredictions.map(pred => {
            const statusColors: Record<string, { bg: string; color: string }> = {
              'Predicted': { bg: '#fffbeb', color: '#d97706' },
              'Alert Deployed': { bg: '#fff7ed', color: '#ea580c' },
              'Intercepted': { bg: '#f0fdf4', color: '#166534' },
              'Expired': { bg: '#f8fafc', color: '#64748b' },
            };
            const sc = statusColors[pred.status] || statusColors['Predicted'];
            const confidence = pred.confidence * 100;

            return (
              <div key={pred.id} className="card p-5" style={{ borderLeft: `4px solid ${confidence > 80 ? '#dc2626' : '#d97706'}` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{pred.id}</span>
                    <span className="badge text-[10px]" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                      {pred.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black" style={{ color: confidence > 80 ? '#dc2626' : '#d97706' }}>
                      {confidence.toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-slate-400">Confidence</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Clock size={14} color="#64748b" className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Predicted Time Window</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {new Date(pred.predictedTimeWindow.from).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        {' — '}
                        {new Date(pred.predictedTimeWindow.to).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} color="#64748b" className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Predicted ATM</p>
                      <p className="text-sm font-semibold text-slate-800">{pred.predictedATM.name}</p>
                      <p className="text-xs text-slate-500">{pred.predictedATM.address}</p>
                    </div>
                  </div>
                </div>

                {/* Model Features */}
                <div className="mb-3">
                  <p className="text-xs font-bold text-slate-500 mb-2">ML Model Reasoning:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pred.modelFeatures.map((f, i) => (
                      <span key={i} className="text-[11px] px-2 py-1 rounded-lg font-medium"
                        style={{ background: '#f0f4ff', color: '#1e3a6e' }}>
                        {f.feature}: {f.value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Alert: {pred.alertId} · TXN: {pred.transactionId}</span>
                  {pred.status === 'Predicted' && (
                    <button className="btn-primary text-xs py-1.5 px-3 ml-auto">
                      <AlertTriangle size={11} /> Deploy Alert
                    </button>
                  )}
                  {pred.status === 'Alert Deployed' && (
                    <span className="text-xs font-semibold text-orange-600 ml-auto flex items-center gap-1">
                      <Clock size={11} /> Alert Active
                    </span>
                  )}
                  {pred.status === 'Intercepted' && (
                    <span className="text-xs font-semibold text-green-600 ml-auto flex items-center gap-1">
                      <Check size={11} /> Intercepted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map + Info */}
        <div className="space-y-5">
          {mounted && (
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-700">Predicted Locations</p>
              </div>
              <PredictiveATMMap
                atmLocations={mockATMLocations}
                predictions={mockCashoutPredictions}
                height="350px"
              />
            </div>
          )}

          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8efff)' }}>
            <h3 className="font-bold text-slate-800 text-sm mb-2">🤖 How It Works</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The cash-out prediction model analyzes the fraud transaction's counterparty location, 
              historical withdrawal patterns, ATM proximity, and mule account behavior to predict 
              where and when the stolen funds will likely be withdrawn.
            </p>
          </div>

          <div className="card p-5 flex items-start gap-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <Info size={14} color="#92400e" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>Action Required:</strong> Deploy alerts for "Predicted" entries to notify branch security 
              and nearby LEA units. Time-sensitive — act before the predicted window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
