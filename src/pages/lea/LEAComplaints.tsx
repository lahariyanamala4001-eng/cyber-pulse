import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, FileText, AlertTriangle, RefreshCw,
  ChevronDown, X,
} from 'lucide-react';
import { leaComplaintService } from '../../services/leaApi';
import type { LEAComplaint, LEACrimeCategory, LEAComplaintStatus, LEAPriority } from '../../types/lea';

export default function LEAComplaints() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<LEAComplaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<LEACrimeCategory | ''>('');
  const [filterStatus, setFilterStatus] = useState<LEAComplaintStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<LEAPriority | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaComplaintService.getAll();
      setComplaints(data);
    } catch {
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

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
      'New': 'badge-submitted',
      'Under Review': 'badge-review',
      'Assigned': 'badge-assigned',
      'Under Investigation': 'badge-investigating',
      'Resolved': 'badge-resolved',
      'Closed': 'badge-closed',
    };
    return map[s] || 'badge-submitted';
  };

  const filtered = complaints.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.complaintReference.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.assignedOfficer.toLowerCase().includes(q);
    const matchCategory = !filterCategory || c.category === filterCategory;
    const matchStatus = !filterStatus || c.status === filterStatus;
    const matchPriority = !filterPriority || c.priority === filterPriority;
    return matchSearch && matchCategory && matchStatus && matchPriority;
  });

  const clearFilters = () => {
    setFilterCategory('');
    setFilterStatus('');
    setFilterPriority('');
    setSearchQuery('');
  };

  const hasActiveFilters = filterCategory || filterStatus || filterPriority || searchQuery;

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <AlertTriangle size={40} color="#dc2626" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Complaints</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button onClick={fetchComplaints} className="btn-primary"><RefreshCw size={14} /> Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Complaints & Cases</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage citizen complaints and case investigations.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-submitted text-xs">{complaints.length} Total</span>
          <button onClick={fetchComplaints} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} color="#94a3b8" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, category, location, officer…"
              className="form-input pl-9 py-2.5 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline py-2 px-4 text-sm flex items-center gap-2 ${showFilters ? 'bg-slate-50' : ''}`}
          >
            <Filter size={14} /> Filters <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-outline py-2 px-3 text-sm flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Crime Category</label>
              <select className="form-input py-2 text-sm" value={filterCategory} onChange={e => setFilterCategory(e.target.value as LEACrimeCategory | '')}>
                <option value="">All Categories</option>
                {['Online Financial Fraud', 'UPI / Payment Fraud', 'Phishing / Fake Link', 'Social Media Fraud', 'Identity Theft', 'Cyber Harassment', 'Account Hacking', 'Fake Website / App', 'Investment Scam', 'Job Scam', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
              <select className="form-input py-2 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value as LEAComplaintStatus | '')}>
                <option value="">All Statuses</option>
                {['New', 'Under Review', 'Assigned', 'Under Investigation', 'Resolved', 'Closed'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Priority</label>
              <select className="form-input py-2 text-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value as LEAPriority | '')}>
                <option value="">All Priorities</option>
                {['Critical', 'High', 'Medium', 'Low'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Complaints Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 shimmer rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={40} color="#94a3b8" className="mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Complaints Found</h3>
            <p className="text-slate-500 text-sm">
              {hasActiveFilters ? 'Try adjusting your filters.' : 'No complaints available.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Crime Type</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Officer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div>
                        <span className="font-semibold text-slate-800">{c.id}</span>
                        <div className="text-[10px] text-slate-400">{c.complaintReference}</div>
                      </div>
                    </td>
                    <td className="text-sm">{c.category}</td>
                    <td className="text-sm">{c.location}</td>
                    <td className="text-sm text-slate-500">
                      {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className="badge" style={priorityStyle(c.priority)}>{c.priority}</span>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge(c.status)}`}>{c.status}</span>
                    </td>
                    <td className="text-sm">{c.assignedOfficer || <span className="text-slate-400 italic">Unassigned</span>}</td>
                    <td>
                      <Link to={`/lea/complaints/${c.id}`} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
