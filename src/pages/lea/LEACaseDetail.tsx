import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, RefreshCw, CheckCircle2, Circle, Clock,
  FileText, MessageSquare, Paperclip, Send, User, Shield,
} from 'lucide-react';
import { leaCaseService, leaComplaintService } from '../../services/leaApi';
import type { LEACase, LEAComplaint } from '../../types/lea';
import { useLEAAuth } from '../../context/LEAAuthContext';

export default function LEACaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useLEAAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<LEACase | null>(null);
  const [complaint, setComplaint] = useState<LEAComplaint | null>(null);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'evidence' | 'notes'>('overview');

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // Try as case first, then as complaint
      let c = await leaCaseService.getById(id);
      if (!c) {
        const comp = await leaComplaintService.getById(id);
        if (comp) {
          setComplaint(comp);
          // Try to find associated case
          const cases = await leaCaseService.getAll();
          c = cases.find(cs => cs.complaintId === id) || null;
        }
      }
      if (c) {
        setCaseData(c);
        if (!complaint) {
          const comp = await leaComplaintService.getById(c.complaintId);
          setComplaint(comp);
        }
      }
      if (!c && !complaint) {
        // Check if it's a complaint ID
        const comp = await leaComplaintService.getById(id);
        setComplaint(comp);
      }
    } catch {
      setError('Failed to load case details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const priorityStyle = (p: string) => {
    switch (p) {
      case 'Critical': return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
      case 'High': return { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' };
      case 'Medium': return { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' };
      default: return { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' };
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      'Open': 'badge-submitted', 'Under Investigation': 'badge-investigating',
      'Bank Coordination': 'badge-review', 'Pending Evidence': 'badge-assigned',
      'Resolved': 'badge-resolved', 'Closed': 'badge-closed',
      'New': 'badge-submitted', 'Under Review': 'badge-review', 'Assigned': 'badge-assigned',
    };
    return map[s] || 'badge-submitted';
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    // Mock: add note locally
    if (caseData) {
      setCaseData({
        ...caseData,
        notes: [...caseData.notes, {
          id: `N-${Date.now()}`,
          officerId: user?.id || 'LEA-OFF-001',
          officerName: user?.fullName || 'Officer',
          note: newNote.trim(),
          createdAt: new Date().toISOString(),
        }],
      });
    }
    setNewNote('');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 shimmer rounded-lg" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6 shimmer h-96" />
          <div className="card p-6 shimmer h-96" />
        </div>
      </div>
    );
  }

  if (error || (!caseData && !complaint)) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <AlertTriangle size={40} color="#dc2626" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {error || 'Case Not Found'}
          </h2>
          <p className="text-slate-500 mb-4">
            {error || `No case or complaint found with ID: ${id}`}
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/lea/complaints" className="btn-secondary">← Back to Complaints</Link>
            <button onClick={fetchData} className="btn-primary"><RefreshCw size={14} /> Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const item = caseData || complaint;
  const title = caseData ? caseData.id : complaint?.id;
  const priority = caseData?.priority || complaint?.priority || 'Medium';
  const status = caseData?.status || complaint?.status || 'New';
  const category = caseData?.category || complaint?.category || '';

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/lea/complaints" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-slate-900">{title}</h1>
            <span className="badge" style={priorityStyle(priority)}>{priority}</span>
            <span className={`badge ${statusBadge(status)}`}>{status}</span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">{category} — {item && 'location' in item ? item.location : ''}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {(['overview', 'timeline', 'evidence', 'notes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Case Overview */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield size={16} color="#1e3a6e" /> Case Overview
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {caseData && (
                    <>
                      <div><span className="text-xs text-slate-500 font-semibold">Case ID</span><p className="text-sm font-semibold text-slate-800">{caseData.id}</p></div>
                      <div><span className="text-xs text-slate-500 font-semibold">Case Reference</span><p className="text-sm font-semibold text-slate-800">{caseData.caseReference}</p></div>
                    </>
                  )}
                  {complaint && (
                    <>
                      <div><span className="text-xs text-slate-500 font-semibold">Complaint ID</span><p className="text-sm font-semibold text-slate-800">{complaint.id}</p></div>
                      <div><span className="text-xs text-slate-500 font-semibold">Complaint Reference</span><p className="text-sm font-semibold text-slate-800">{complaint.complaintReference}</p></div>
                    </>
                  )}
                  <div><span className="text-xs text-slate-500 font-semibold">Crime Category</span><p className="text-sm text-slate-800">{category}</p></div>
                  <div><span className="text-xs text-slate-500 font-semibold">Assigned Officer</span><p className="text-sm text-slate-800">{caseData?.assignedOfficer || complaint?.assignedOfficer || 'Unassigned'}</p></div>
                  <div><span className="text-xs text-slate-500 font-semibold">Created</span><p className="text-sm text-slate-800">{new Date(caseData?.createdAt || complaint?.createdAt || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                  {(caseData?.amountInvolved || complaint?.amountInvolved) && (
                    <div><span className="text-xs text-slate-500 font-semibold">Amount Involved</span><p className="text-sm font-bold text-red-600">₹{(caseData?.amountInvolved || complaint?.amountInvolved || 0).toLocaleString('en-IN')}</p></div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText size={16} /> Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {caseData?.description || complaint?.description}
                </p>
              </div>

              {/* Complainant Reference (masked) */}
              {complaint && (
                <div className="card p-6">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <User size={16} /> Complainant Reference
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><span className="text-xs text-slate-500 font-semibold">Reference ID</span><p className="text-sm font-mono text-slate-800">{complaint.complainantReference}</p></div>
                    <div><span className="text-xs text-slate-500 font-semibold">Platform</span><p className="text-sm text-slate-800">{complaint.platform || 'N/A'}</p></div>
                    <div><span className="text-xs text-slate-500 font-semibold">Incident Date</span><p className="text-sm text-slate-800">{new Date(complaint.incidentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                    <div><span className="text-xs text-slate-500 font-semibold">Evidence Count</span><p className="text-sm text-slate-800">{complaint.evidenceCount} items</p></div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && caseData && (
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock size={16} /> Investigation Timeline
              </h3>
              <div className="space-y-0">
                {caseData.timeline.map(t => (
                  <div key={t.id} className={`timeline-item ${t.completed ? 'completed' : ''}`}>
                    <div className={`timeline-dot ${
                      t.completed ? 'bg-[#1e3a6e] text-white' :
                      t.active ? 'bg-white border-2 border-blue-500 text-blue-500' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {t.completed ? <CheckCircle2 size={16} /> : t.active ? <Clock size={16} /> : <Circle size={14} />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${t.completed || t.active ? 'text-slate-800' : 'text-slate-400'}`}>
                          {t.event}
                        </h4>
                        {t.createdAt && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${t.completed || t.active ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t.description}
                      </p>
                      {t.actor && <p className="text-[10px] text-slate-400 mt-1">by {t.actor}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && !caseData && (
            <div className="card p-12 text-center">
              <Clock size={40} color="#94a3b8" className="mx-auto mb-3" />
              <p className="text-slate-500">No case timeline available. Create a case from this complaint to start tracking.</p>
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === 'evidence' && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Paperclip size={16} /> Evidence
                </h3>
              </div>
              {caseData && caseData.evidence.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr><th>Evidence ID</th><th>Type</th><th>Description</th><th>Upload Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {caseData.evidence.map(e => (
                      <tr key={e.id}>
                        <td className="font-semibold text-slate-800">{e.id}</td>
                        <td><span className="badge badge-submitted">{e.evidenceType}</span></td>
                        <td className="text-sm">{e.description}</td>
                        <td className="text-sm text-slate-500">{e.uploadDate}</td>
                        <td><span className={`badge ${e.status === 'Verified' ? 'badge-resolved' : e.status === 'Rejected' ? 'badge-closed' : 'badge-review'}`}>{e.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <Paperclip size={40} color="#94a3b8" className="mx-auto mb-3" />
                  <p className="text-slate-500">No evidence records available.</p>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <MessageSquare size={16} /> Add Investigation Note
                </h3>
                <div className="flex gap-3">
                  <textarea
                    className="form-input flex-1 text-sm"
                    rows={3}
                    placeholder="Add investigation note…"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button onClick={handleAddNote} className="btn-primary py-2 px-4 text-sm" disabled={!newNote.trim()}>
                    <Send size={14} /> Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {caseData && caseData.notes.length > 0 ? (
                <div className="space-y-3">
                  {caseData.notes.map(n => (
                    <div key={n.id} className="card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
                          {n.officerName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-800">{n.officerName}</span>
                          <span className="text-xs text-slate-400 ml-2">
                            {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pl-9">{n.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <MessageSquare size={40} color="#94a3b8" className="mx-auto mb-3" />
                  <p className="text-slate-500">No investigation notes yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar — Case summary */}
        <div className="space-y-5">
          {/* Status Card */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Case Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Priority</span>
                <span className="badge" style={priorityStyle(priority)}>{priority}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Status</span>
                <span className={`badge ${statusBadge(status)}`}>{status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Officer</span>
                <span className="text-sm font-semibold text-slate-800">{caseData?.assignedOfficer || complaint?.assignedOfficer || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Case Workflow</h3>
            <div className="space-y-2">
              {['Complaint', 'Review', 'Assign', 'Investigate', 'Resolve'].map((step, i) => {
                const statusOrder = ['New', 'Under Review', 'Assigned', 'Under Investigation', 'Resolved'];
                const currentIdx = statusOrder.indexOf(status);
                const isCompleted = i <= currentIdx;
                const isActive = i === currentIdx;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted ? 'bg-[#1e3a6e] text-white' :
                      isActive ? 'border-2 border-blue-500 text-blue-500 bg-white' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm ${isCompleted || isActive ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Summary</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Timeline Events</span>
                <span className="font-bold text-slate-800">{caseData?.timeline.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Evidence Items</span>
                <span className="font-bold text-slate-800">{caseData?.evidence.length || complaint?.evidenceCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Notes</span>
                <span className="font-bold text-slate-800">{caseData?.notes.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
