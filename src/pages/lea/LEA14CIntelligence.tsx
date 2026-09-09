import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, AlertTriangle, ShieldAlert, Network, MapPin, Search,
  Clock, CheckCircle2, ChevronRight, Activity, ArrowUpRight, FileText
} from 'lucide-react';
import { mockNationalAlerts, mockCrossStateCorrelations } from '../../data/lea/mock14CData';
import type { NationalAlert, CaseCorrelation } from '../../data/lea/mock14CData';

export default function LEA14CIntelligence() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'correlation'>('alerts');
  const [alerts, setAlerts] = useState<NationalAlert[]>(mockNationalAlerts);
  const [correlations] = useState<CaseCorrelation[]>(mockCrossStateCorrelations);

  const handleAlertAction = (id: string, newStatus: NationalAlert['status']) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const severityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
      case 'High': return { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' };
      default: return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
    }
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase" 
              style={{ background: '#1e3a6e', color: 'white' }}>
              National Level
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Globe size={24} color="#1e3a6e" /> 14C Intelligence Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Indian Cybercrime Coordination Centre (I4C) early-warning alerts and cross-state correlations.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'border-[#1e3a6e] text-[#1e3a6e]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldAlert size={16} /> Early-Warning Alerts
          <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px]">
            {alerts.filter(a => a.status === 'Active').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('correlation')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'correlation'
              ? 'border-[#1e3a6e] text-[#1e3a6e]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Network size={16} /> Cross-State Correlation
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'alerts' && alerts.map(alert => {
            const style = severityStyle(alert.severity);
            return (
              <div key={alert.id} className="card overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{alert.id}</span>
                        <span className="badge" style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                          {alert.severity} Priority
                        </span>
                        {alert.status === 'Active' ? (
                          <span className="badge badge-submitted">NEW</span>
                        ) : (
                          <span className="badge bg-slate-100 text-slate-500 border-slate-200">{alert.status}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{alert.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {alert.summary}
                  </p>
                  
                  <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fraud Type</span>
                      <span className="text-sm font-semibold text-slate-800">{alert.fraudType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Regions</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} color="#64748b" />
                        <span className="text-sm font-semibold text-slate-800" title={alert.affectedRegions.join(', ')}>
                          {alert.affectedRegions.length} States
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Related Cases</span>
                      <span className="text-sm font-semibold text-slate-800">{alert.relatedCasesCount} identified</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> Issued: {new Date(alert.dateIssued).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'Active' && (
                      <button onClick={() => handleAlertAction(alert.id, 'Acknowledged')} className="btn-outline py-1.5 px-3 text-xs">
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'Action Taken' && (
                      <button onClick={() => handleAlertAction(alert.id, 'Action Taken')} className="btn-primary py-1.5 px-3 text-xs bg-green-600 hover:bg-green-700">
                        <CheckCircle2 size={12} /> Mark Action Taken
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {activeTab === 'correlation' && correlations.map(corr => (
            <div key={corr.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-400">{corr.id}</span>
                    <span className="badge badge-assigned text-[10px]">{corr.status}</span>
                  </div>
                  <h3 className="font-bold text-slate-800">{corr.fraudType} Pattern Detected</h3>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-4"
                    style={{ borderColor: corr.confidence > 90 ? '#ef4444' : '#f59e0b', color: corr.confidence > 90 ? '#ef4444' : '#f59e0b' }}>
                    <span className="text-xs font-black">{corr.confidence}%</span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase">Match Match</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-5">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Common Indicators</h4>
                  <ul className="space-y-1.5">
                    {corr.commonIndicators.map((ind, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                        <Search size={12} className="text-blue-500 flex-shrink-0" />
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">States Involved</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {corr.statesInvolved.map(state => (
                      <span key={state} className="badge bg-indigo-50 text-indigo-700 border-indigo-100">{state}</span>
                    ))}
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-t border-slate-100 pt-4">Potentially Related Cases</h4>
              <div className="space-y-2">
                {corr.cases.map(c => (
                  <Link key={c.caseId} to={`/lea/previous-cases`} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <FileText size={14} className="text-slate-500 group-hover:text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{c.caseId}</div>
                        <div className="text-xs text-slate-500">{c.state} • {new Date(c.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-red-600">₹{c.amount.toLocaleString('en-IN')}</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className="card p-5" style={{ borderTop: '3px solid #1e3a6e' }}>
            <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
              <Activity size={16} className="text-[#1e3a6e]" /> Predictive Defence
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Intelligence alerts flow directly into the predictive mapping system. View active hotspots and vulnerable zones.
            </p>
            <Link to="/lea/map" className="btn-primary w-full justify-center text-xs py-2">
              <MapPin size={14} /> View Cybercrime Map
            </Link>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/lea/bank-coordination" className="flex items-center justify-between p-2.5 rounded hover:bg-slate-50 text-sm font-medium text-slate-700 group">
                <span className="flex items-center gap-2"><Globe size={14} className="text-slate-400 group-hover:text-[#1e3a6e]" /> Bank Coordination</span>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#1e3a6e]" />
              </Link>
              <Link to="/lea/previous-cases" className="flex items-center justify-between p-2.5 rounded hover:bg-slate-50 text-sm font-medium text-slate-700 group">
                <span className="flex items-center gap-2"><Search size={14} className="text-slate-400 group-hover:text-[#1e3a6e]" /> Search Case Database</span>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#1e3a6e]" />
              </Link>
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
             <div className="flex items-start gap-2">
               <AlertTriangle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
               <div>
                 <h4 className="text-xs font-bold text-blue-900 mb-1">Confidentiality Notice</h4>
                 <p className="text-[10px] text-blue-700 leading-relaxed">
                   14C Intelligence data is strictly confidential and for official law enforcement use only. Unauthorized sharing violates the Information Technology Act.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
