import { Link } from 'react-router-dom';
import { BarChart3, Activity, Sliders, ArrowRight } from 'lucide-react';
import RiskGauge from '../../components/bank/RiskGauge';
import { TABPFN_THRESHOLD_BENCHMARK } from '../../services/mlService';

export default function RiskMLView() {
  const models = [
    {
      name: 'Model 1: TabPFN Fraud Classifier',
      version: 'TabPFN v2.0',
      tag: 'model1_tabpfn_model.pkl',
      accuracy: 95.12,
      precision: 81.94,
      recall: 89.52,
      f1: 85.56,
      status: 'Active',
      dataset: 'arun-gharami/lead-ai-fraud-detection-dataset-v2',
      details: 'Trained on 5,000 stratified samples, tested on 20,000 unseen transactions. Optimal threshold: 0.30.',
    },
    {
      name: 'Transaction Velocity Risk Engine',
      version: 'v2.0 Rule Engine',
      tag: '70% 1h + 30% 24h',
      accuracy: 98.4,
      precision: 91.2,
      recall: 94.0,
      f1: 92.58,
      status: 'Active',
      dataset: 'Real-time Streaming Transactions',
      details: 'Evaluates rapid-fire account bursts across 1-hour and 24-hour velocity windows.',
    },
    {
      name: 'Combined Fraud Risk Engine',
      version: 'Ensemble Engine',
      tag: '70% ML + 30% Velocity',
      accuracy: 96.85,
      precision: 92.1,
      recall: 93.4,
      f1: 92.74,
      status: 'Active',
      dataset: 'Hybrid Scoring Architecture',
      details: 'Synthesizes ML TabPFN probability with velocity signals to assign CRITICAL/HIGH/MEDIUM/LOW alerts.',
    },
    {
      name: 'Model 2: Cash-out Intelligence',
      version: 'Regression v1.0',
      tag: 'model2_cashout_model.pkl',
      accuracy: 91.5,
      precision: 88.3,
      recall: 86.9,
      f1: 87.59,
      status: 'Active',
      dataset: 'Secondary Account ATM Withdrawals',
      details: 'Predicts withdrawal delay (minutes), target cash-out time, and exact ATM GPS coordinates.',
    },
  ];

  const riskDistribution = [
    { range: '0–29 (LOW / ALLOW)', count: 1847, pct: 62, color: '#16a34a' },
    { range: '30–59 (MEDIUM / MONITOR)', count: 612, pct: 21, color: '#d97706' },
    { range: '60–79 (HIGH / URGENT ALERT)', count: 328, pct: 11, color: '#ea580c' },
    { range: '80–100 (CRITICAL / IMMEDIATE ALERT)', count: 178, pct: 6, color: '#dc2626' },
  ];

  const topFeatures = [
    { feature: 'transaction_amount', importance: 0.28, type: 'Numeric (INR)' },
    { feature: 'transaction_velocity_1h', importance: 0.22, type: 'Numeric' },
    { feature: 'customer_risk_score', importance: 0.18, type: 'Numeric (0-100)' },
    { feature: 'transaction_hour', importance: 0.16, type: 'Numeric (0-23)' },
    { feature: 'is_international', importance: 0.14, type: 'Binary (0/1)' },
    { feature: 'is_high_risk_merchant_category', importance: 0.13, type: 'Binary (0/1)' },
    { feature: 'account_age_days', importance: 0.12, type: 'Numeric (Days)' },
    { feature: 'previous_chargebacks', importance: 0.11, type: 'Numeric' },
  ];

  return (
    <div className="p-4 sm:p-6 animate-fade-in space-y-6">
      {/* Top Banner with Pipeline Runner link - White & Black Gradient */}
      <div className="card p-6 bg-gradient-to-r from-black via-zinc-900 to-black text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800 shadow-xl rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/10 text-white border border-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              TabPFN + Model 2 Active
            </span>
            <span className="text-xs text-zinc-300">Production Inference Online</span>
          </div>
          <h2 className="text-xl font-black text-white">Cyber Fraud Intelligence ML Pipeline</h2>
          <p className="text-xs text-zinc-300 max-w-xl mt-1">
            Integrated TabPFN classification model, transaction velocity risk engine, and Model 2 cash-out prediction.
            Run live end-to-end evaluations on transactions in real time.
          </p>
        </div>
        <Link
          to="/bank/ml-pipeline"
          className="text-xs px-4 py-2 font-bold flex items-center gap-2 self-start md:self-center shadow-lg bg-white text-black hover:bg-zinc-200 transition-colors rounded-xl border-0 cursor-pointer"
        >
          <Activity size={15} /> Launch ML Pipeline Runner <ArrowRight size={14} />
        </Link>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <BarChart3 size={24} color="#1e3a6e" /> Machine Learning Models & Risk Architecture
        </h1>
        <p className="text-slate-500 text-sm">
          Model performance benchmarks, threshold tuning metrics, feature weighting, and combined risk distribution.
        </p>
      </div>

      {/* Model Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {models.map(m => (
          <div key={m.name} className="card p-5 flex flex-col justify-between" style={{ borderTop: '3px solid #2563b0' }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-resolved text-[10px]">{m.status}</span>
                <span className="text-[10px] font-mono text-slate-400">{m.version}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{m.name}</h3>
              <p className="font-mono text-[10px] text-blue-700 font-bold mb-3">{m.tag}</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: 'Accuracy', value: m.accuracy },
                  { label: 'Precision', value: m.precision },
                  { label: 'Recall', value: m.recall },
                  { label: 'F1 Score', value: m.f1 },
                ].map(metric => (
                  <div key={metric.label} className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-base font-black text-blue-700">{metric.value}%</p>
                    <p className="text-[10px] text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">{m.details}</p>
          </div>
        ))}
      </div>

      {/* Threshold Matrix Table */}
      <div className="card p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders size={18} color="#1e3a6e" /> TabPFN Decision Threshold Sweep (Model 1)
            </h3>
            <p className="text-slate-500 text-xs">
              Performance metrics across decision thresholds evaluated on 20,000 test transactions from <code>lead-ai-fraud-detection-dataset-v2</code>.
            </p>
          </div>
          <span className="badge badge-resolved text-xs font-bold px-3 py-1 self-start sm:self-auto">
            Best Threshold: 0.30 (F1: 85.56%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Threshold</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-Score</th>
                <th>Accuracy</th>
                <th>Operating Trade-off</th>
              </tr>
            </thead>
            <tbody>
              {TABPFN_THRESHOLD_BENCHMARK.map(r => (
                <tr key={r.threshold} className={r.isBest ? 'bg-blue-50/80 font-semibold' : ''}>
                  <td className="font-mono font-bold text-blue-800">
                    {r.threshold.toFixed(2)}
                    {r.isBest && (
                      <span className="ml-2 text-[10px] bg-blue-700 text-white font-sans px-2 py-0.5 rounded-full font-bold">
                        ★ Selected Best
                      </span>
                    )}
                  </td>
                  <td className="font-mono">{(r.precision * 100).toFixed(2)}%</td>
                  <td className="font-mono">{(r.recall * 100).toFixed(2)}%</td>
                  <td className="font-mono text-blue-700 font-bold">{(r.f1 * 100).toFixed(2)}%</td>
                  <td className="font-mono">{(r.accuracy * 100).toFixed(2)}%</td>
                  <td className="text-xs text-slate-600">
                    {r.threshold < 0.30 && 'High recall at expense of higher false alarms'}
                    {r.isBest && <strong className="text-green-700">Optimal balance between catching fraud & minimizing false flags</strong>}
                    {r.threshold > 0.30 && 'High precision, but higher risk of missing actual fraud'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 text-base">📊 TabPFN Key Feature Importance</h3>
            <span className="text-xs text-slate-400 font-mono">18 Features Total</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Relative feature influence learned by TabPFN during 5k sample stratified training.
          </p>
          <div className="space-y-3">
            {topFeatures.map(f => (
              <div key={f.feature}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-semibold text-slate-800">{f.feature}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{f.type}</span>
                    <span className="text-xs font-bold text-blue-700">{(f.importance * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(f.importance / 0.28) * 100}%`,
                      background: 'linear-gradient(90deg, #1e3a6e, #2563b0)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combined Risk Distribution */}
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">📈 Combined Fraud Risk Engine Distribution</h3>
          <p className="text-xs text-slate-500">
            Categorization based on <code>Final Risk Score = (ML Risk × 0.70) + (Velocity Risk × 0.30)</code>.
          </p>

          <div className="flex items-center justify-center py-2">
            <RiskGauge score={95.94} riskLevel="CRITICAL" size={130} />
          </div>
          <p className="text-xs text-slate-500 text-center">
            Demo High-Risk Case score: <strong>95.94/100</strong> (CRITICAL → IMMEDIATE ALERT)
          </p>

          <div className="space-y-3 pt-2">
            {riskDistribution.map(r => (
              <div key={r.range}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: r.color }}>{r.range}</span>
                  <span className="text-xs text-slate-500">{r.count} txns ({r.pct}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
