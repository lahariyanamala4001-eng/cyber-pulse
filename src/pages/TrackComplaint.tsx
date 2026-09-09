import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, AlertCircle, Info, FileWarning, Clock } from 'lucide-react';
import { mockComplaints } from '../data/mockComplaints';
import type { Complaint } from '../types/complaint';
import StatusBadge from '../components/StatusBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';

export default function TrackComplaint() {
  const [params] = useSearchParams();
  const [inputId, setInputId] = useState(params.get('id') || '');
  const [searched, setSearched] = useState(!!params.get('id'));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Complaint | null | undefined>(undefined);

  const doSearch = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(true);
    await new Promise(r => setTimeout(r, 700));
    const found = mockComplaints.find(c => c.id.toLowerCase() === id.trim().toLowerCase());
    setResult(found || null);
    setLoading(false);
  };

  useEffect(() => {
    const id = params.get('id');
    if (id) doSearch(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(inputId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Search size={20} color="#1e3a6e" />
          <h1 className="text-2xl font-black text-slate-900">Track Your Complaint</h1>
        </div>
        <p className="text-slate-500 text-sm">Enter your complaint ID to view the current status and updates.</p>
      </div>

      {/* Search Box */}
      <div className="card p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <label htmlFor="complaint-id" className="form-label text-base mb-2 block">Enter Complaint ID</label>
          <div className="flex gap-3">
            <input
              id="complaint-id"
              type="text"
              className="form-input font-mono text-base flex-1"
              placeholder="e.g. CCP-2026-104382"
              value={inputId}
              onChange={e => setInputId(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="btn-primary flex-shrink-0 px-6" disabled={loading}>
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : <><Search size={16}/> Track</>}
            </button>
          </div>
        </form>

        {/* Demo hints */}
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <Info size={14} color="#0369a1" className="flex-shrink-0 mt-0.5"/>
          <div>
            <p className="text-xs font-semibold text-blue-800 mb-1">Demo complaint IDs you can try:</p>
            <div className="flex flex-wrap gap-2">
              {mockComplaints.map(c => (
                <button key={c.id} type="button"
                  onClick={() => { setInputId(c.id); doSearch(c.id); }}
                  className="font-mono text-xs px-2 py-1 rounded-lg font-semibold transition-colors"
                  style={{ background: '#e0f2fe', color: '#0369a1' }}>
                  {c.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-10 text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-slate-500 text-sm">Looking up complaint…</p>
        </div>
      )}

      {/* Not found */}
      {!loading && searched && result === null && (
        <div className="card p-10 text-center animate-fade-in">
          <AlertCircle size={40} color="#e2e8f0" className="mx-auto mb-3"/>
          <h3 className="font-bold text-slate-700 mb-1">Complaint Not Found</h3>
          <p className="text-sm text-slate-500 mb-4">
            No complaint found for ID <strong className="font-mono">{inputId}</strong>. Please check your ID and try again.
          </p>
          <p className="text-xs text-slate-400">
            If you recently submitted, it may take a few minutes to appear.
          </p>
        </div>
      )}

      {/* Result */}
      {!loading && result && (
        <div className="animate-fade-in space-y-5">
          {/* Header Card */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Complaint ID</p>
                <h2 className="text-2xl font-black font-mono text-blue-700">{result.id}</h2>
                <p className="text-slate-600 font-medium mt-0.5">{result.type}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100">
              {[
                { label: 'Incident Date', value: result.incidentDate },
                { label: 'Submitted On', value: result.date },
                { label: 'Last Updated', value: result.lastUpdated },
                { label: 'Evidence Files', value: `${result.evidenceCount} file(s)` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            {result.amountLost != null && result.amountLost > 0 && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl"
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <AlertCircle size={14} color="#dc2626"/>
                <p className="text-sm text-red-800">
                  <strong>Reported financial loss:</strong> ₹{result.amountLost.toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Clock size={17} color="#1e3a6e"/> Complaint Progress
            </h3>
            <ComplaintTimeline timeline={result.timeline}/>
          </div>

          {/* Latest Update */}
          <div className="card p-6" style={{ borderLeft: '4px solid #2563b0' }}>
            <h3 className="font-bold text-slate-800 mb-2">Latest Update</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{result.latestUpdate}</p>
            <p className="text-xs text-slate-400 mt-3">Updated: {result.lastUpdated}</p>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 px-2">
            <Info size={14} color="#64748b" className="flex-shrink-0 mt-0.5"/>
            <p className="text-xs text-slate-400">
              For your security, detailed investigation notes are not displayed here. Authorities will contact you directly for updates. Do not share your complaint ID publicly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/report" className="btn-secondary">
              <FileWarning size={15}/> Report Another
            </Link>
            <button onClick={() => window.print()} className="btn-outline">
              Print / Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
