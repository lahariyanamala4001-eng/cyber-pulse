import { useState, useEffect } from 'react';
import {
  Search, History, AlertTriangle, RefreshCw, ChevronDown, ChevronUp,
  MapPin, Calendar, Tag, CheckCircle2, X,
} from 'lucide-react';
import { leaPreviousCaseService } from '../../services/leaApi';
import type { PreviousCase } from '../../types/lea';

export default function LEAPreviousCases() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<PreviousCase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const fetchCases = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaPreviousCaseService.search(query);
      setCases(data);
    } catch {
      setError('Failed to load previous cases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCases(); }, []);

  const handleSearch = () => {
    fetchCases(searchQuery || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <AlertTriangle size={40} color="#dc2626" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Previous Cases</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button onClick={() => fetchCases()} className="btn-primary"><RefreshCw size={14} /> Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <History size={24} color="#1e3a6e" /> Previous Cases
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Search historical cybercrime cases to identify patterns and investigation approaches.</p>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} color="#94a3b8" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by fraud type, location, keywords, case ID…"
              className="form-input pl-9 py-2.5 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button onClick={handleSearch} className="btn-primary py-2 px-5 text-sm">
            <Search size={14} /> Search
          </button>
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); fetchCases(); }} className="btn-outline py-2 px-3 text-sm">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-xs text-slate-400">Quick searches:</span>
          {['UPI', 'phishing', 'investment scam', 'identity theft', 'Hyderabad'].map(tag => (
            <button
              key={tag}
              onClick={() => { setSearchQuery(tag); fetchCases(tag); }}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="card p-6 shimmer h-24" />)}
        </div>
      ) : cases.length === 0 ? (
        <div className="card p-12 text-center">
          <History size={40} color="#94a3b8" className="mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No Cases Found</h3>
          <p className="text-slate-500 text-sm">Try different search terms or keywords.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">{cases.length} case{cases.length !== 1 ? 's' : ''} found</p>
          <div className="space-y-3">
            {cases.map(c => {
              const isExpanded = expandedCase === c.id;
              return (
                <div key={c.id} className="card overflow-hidden">
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{c.caseReference}</span>
                        <span className="badge badge-submitted text-[10px]">{c.crimeType}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {c.location}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-resolved text-[10px]">
                        <CheckCircle2 size={10} /> Closed
                      </span>
                      {isExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/50 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left: Pattern + Approach */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fraud Pattern</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">{c.pattern}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Investigation Approach</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">{c.investigationApproach}</p>
                          </div>
                        </div>

                        {/* Right: Outcome + Keywords */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Outcome</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">{c.outcome}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keywords</h4>
                            <div className="flex gap-1.5 flex-wrap">
                              {c.keywords.map(k => (
                                <span key={k} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                  <Tag size={9} /> {k}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Flow */}
                      <div className="mt-5 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {['Historical Case', 'Fraud Pattern', 'Investigation Approach', 'Outcome'].map((step, i) => (
                            <div key={step} className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white bg-[#1e3a6e] px-3 py-1 rounded-full">{step}</span>
                              {i < 3 && <span className="text-slate-300">→</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
