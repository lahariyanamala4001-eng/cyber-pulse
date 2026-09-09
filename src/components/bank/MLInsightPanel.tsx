import type { FeatureImportance, FraudPrediction, VelocityRisk } from '../../types/bank';
import { getRiskLevelColor } from '../../services/mlService';
import type { RiskLevel } from '../../types/bank';
import RiskGauge from './RiskGauge';

interface MLInsightPanelProps {
  fraudPrediction?: FraudPrediction;
  velocityRisk?: VelocityRisk;
  finalScore: number;
  riskLevel: RiskLevel;
  recommendation: string;
}

export default function MLInsightPanel({
  fraudPrediction,
  velocityRisk,
  finalScore,
  riskLevel,
  recommendation,
}: MLInsightPanelProps) {
  const color = getRiskLevelColor(riskLevel);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Risk Score Overview */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          🤖 ML Risk Analysis
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <RiskGauge score={finalScore} riskLevel={riskLevel} size={140} />
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ background: '#f8fafc' }}>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fraud Probability</p>
                <p className="text-xl font-black" style={{ color }}>
                  {fraudPrediction ? `${(fraudPrediction.fraudProbability * 100).toFixed(1)}%` : '—'}
                </p>
                {fraudPrediction && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {fraudPrediction.modelName} {fraudPrediction.modelVersion}
                  </p>
                )}
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#f8fafc' }}>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Velocity Risk</p>
                <p className="text-xl font-black" style={{ color }}>
                  {velocityRisk ? velocityRisk.riskScore : '—'}
                </p>
                {velocityRisk && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {velocityRisk.transactionCount1h} txns/hr · {velocityRisk.transactionCount24h} txns/24h
                  </p>
                )}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}30` }}>
              <p className="text-xs font-bold mb-1" style={{ color }}>⚡ Recommendation</p>
              <p className="text-sm text-slate-700">{recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      {fraudPrediction && fraudPrediction.features.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-4">📊 Feature Importance</h3>
          <p className="text-xs text-slate-500 mb-4">What the ML model considered when scoring this transaction.</p>
          <div className="space-y-3">
            {fraudPrediction.features
              .sort((a, b) => b.importance - a.importance)
              .map((f: FeatureImportance, i: number) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{f.feature.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">
                        {typeof f.value === 'number' ? f.value.toFixed(2) : f.value}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        f.direction === 'increases_risk' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {f.direction === 'increases_risk' ? '↑ Risk' : '↓ Risk'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${f.importance * 100}%`,
                        background: f.direction === 'increases_risk'
                          ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                          : 'linear-gradient(90deg, #22c55e, #16a34a)',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Velocity Patterns */}
      {velocityRisk && velocityRisk.unusualPatterns.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-3">⚠️ Unusual Patterns Detected</h3>
          <div className="space-y-2">
            {velocityRisk.unusualPatterns.map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <span className="text-red-500 flex-shrink-0">✕</span>
                <span className="text-sm text-red-800">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
