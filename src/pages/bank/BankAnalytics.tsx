import { BarChart3, TrendingUp, PieChart, IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function BankAnalytics() {
  const monthlyData = [
    { month: 'Apr', alerts: 42, blocked: 28, recovered: 18 },
    { month: 'May', alerts: 55, blocked: 38, recovered: 24 },
    { month: 'Jun', alerts: 38, blocked: 25, recovered: 20 },
    { month: 'Jul', alerts: 67, blocked: 48, recovered: 31 },
    { month: 'Aug', alerts: 51, blocked: 35, recovered: 27 },
    { month: 'Sep', alerts: 54, blocked: 40, recovered: 30 },
  ];
  const maxAlerts = Math.max(...monthlyData.map(d => d.alerts));

  const fraudTypes = [
    { type: 'UPI Fraud', count: 42, amount: 18.5, pct: 35, color: '#1e3a6e' },
    { type: 'Card Fraud', count: 28, amount: 9.2, pct: 23, color: '#2563b0' },
    { type: 'NEFT/RTGS', count: 18, amount: 32.0, pct: 15, color: '#06b6d4' },
    { type: 'ATM Fraud', count: 15, amount: 7.5, pct: 12, color: '#14b8a6' },
    { type: 'Investment Scam', count: 10, amount: 21.0, pct: 8, color: '#f59e0b' },
    { type: 'Other', count: 8, amount: 3.8, pct: 7, color: '#94a3b8' },
  ];

  const kpis = [
    { label: 'Detection Accuracy', value: '96.1%', change: '+1.9%', up: true, color: '#166534' },
    { label: 'Avg Response Time', value: '4.2 min', change: '-0.8 min', up: false, color: '#166534' },
    { label: 'False Positive Rate', value: '12.5%', change: '-3.2%', up: false, color: '#166534' },
    { label: 'Recovery Rate', value: '68.4%', change: '+5.1%', up: true, color: '#166534' },
  ];

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <BarChart3 size={22} color="#1e3a6e" /> Fraud Analytics
        </h1>
        <p className="text-slate-500 text-sm">Fraud trends, type breakdown, and performance metrics.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="metric-card" style={{ borderTop: '3px solid #bbf7d0' }}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{k.label}</p>
            <p className="text-2xl font-black text-slate-900">{k.value}</p>
            <p className={`text-xs font-semibold mt-1 flex items-center gap-0.5`} style={{ color: k.color }}>
              {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {k.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} color="#1e3a6e" /> Monthly Fraud Alerts (6 months)
          </h3>
          <div className="space-y-3">
            {monthlyData.map(d => (
              <div key={d.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700 w-10">{d.month}</span>
                  <span className="text-xs text-slate-500">{d.alerts} alerts · {d.blocked} blocked · {d.recovered} recovered</span>
                </div>
                <div className="flex gap-1 h-5">
                  <div className="h-full rounded-l-md transition-all duration-700"
                    style={{ width: `${(d.alerts / maxAlerts) * 100}%`, background: '#1e3a6e' }}
                    title={`${d.alerts} alerts`} />
                  <div className="h-full transition-all duration-700"
                    style={{ width: `${(d.blocked / maxAlerts) * 100}%`, background: '#2563b0' }}
                    title={`${d.blocked} blocked`} />
                  <div className="h-full rounded-r-md transition-all duration-700"
                    style={{ width: `${(d.recovered / maxAlerts) * 100}%`, background: '#14b8a6' }}
                    title={`${d.recovered} recovered`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#1e3a6e' }} /> Alerts</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#2563b0' }} /> Blocked</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#14b8a6' }} /> Recovered</span>
          </div>
        </div>

        {/* Fraud Type Breakdown */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart size={16} color="#1e3a6e" /> Fraud Type Breakdown
          </h3>
          {/* Visual pie chart (CSS) */}
          <div className="w-40 h-40 rounded-full mx-auto mb-6 relative"
            style={{
              background: `conic-gradient(${fraudTypes.map((t, i) => {
                const start = fraudTypes.slice(0, i).reduce((s, tt) => s + tt.pct, 0);
                return `${t.color} ${start}% ${start + t.pct}%`;
              }).join(', ')})`,
            }}>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-black text-slate-800">121</p>
                <p className="text-[10px] text-slate-400">Total</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {fraudTypes.map(t => (
              <div key={t.type} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: t.color }} />
                <span className="text-sm font-medium text-slate-700 flex-1">{t.type}</span>
                <span className="text-xs text-slate-500">{t.count}</span>
                <span className="text-xs font-bold text-slate-800 w-10 text-right">{t.pct}%</span>
                <span className="text-xs text-green-700 font-medium w-16 text-right flex items-center gap-0.5 justify-end">
                  <IndianRupee size={9} />{t.amount}L
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="card p-6 mt-6">
        <h3 className="font-bold text-slate-800 mb-4">🌍 Geographic Distribution (Top Cities)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { city: 'Hyderabad', count: 28, pct: 23 },
            { city: 'Mumbai', count: 24, pct: 20 },
            { city: 'Bangalore', count: 19, pct: 16 },
            { city: 'Delhi', count: 22, pct: 18 },
            { city: 'Chennai', count: 15, pct: 12 },
          ].map(c => (
            <div key={c.city} className="text-center p-4 rounded-xl" style={{ background: '#f8fafc' }}>
              <p className="text-xl font-black text-blue-700">{c.count}</p>
              <p className="text-sm font-semibold text-slate-700">{c.city}</p>
              <p className="text-xs text-slate-400">{c.pct}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
