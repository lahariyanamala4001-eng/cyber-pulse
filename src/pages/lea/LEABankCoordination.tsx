import { useState, useEffect } from 'react';
import {
  Handshake, AlertTriangle, RefreshCw, ArrowLeft, Send,
  MessageSquare, ExternalLink, Clock, Shield,
} from 'lucide-react';
import { leaBankCoordService } from '../../services/leaApi';
import type { BankAlertLEA } from '../../types/lea';

export default function LEABankCoordination() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<BankAlertLEA[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<BankAlertLEA | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaBankCoordService.getAlerts();
      setAlerts(data);
    } catch {
      setError('Failed to load bank alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

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
      'Received': 'badge-submitted', 'Under Review': 'badge-review',
      'Case Opened': 'badge-assigned', 'Information Requested': 'badge-investigating',
      'Resolved': 'badge-resolved', 'Closed': 'badge-closed',
    };
    return map[s] || 'badge-submitted';
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedAlert) return;
    setSelectedAlert({
      ...selectedAlert,
      communications: [...selectedAlert.communications, {
        id: `MSG-${Date.now()}`,
        from: 'Vikram Reddy',
        fromRole: 'lea',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
      }],
    });
    setNewMessage('');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <AlertTriangle size={40} color="#dc2626" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Bank Alerts</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button onClick={fetchAlerts} className="btn-primary"><RefreshCw size={14} /> Retry</button>
        </div>
      </div>
    );
  }

  // Detail view
  if (selectedAlert) {
    return (
      <div className="p-4 sm:p-6 animate-fade-in">
        {/* Back */}
        <button onClick={() => setSelectedAlert(null)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft size={16} /> Back to Bank Alerts
        </button>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <h1 className="text-xl font-black text-slate-900">{selectedAlert.alertReference}</h1>
          <span className="badge" style={priorityStyle(selectedAlert.priority)}>{selectedAlert.priority}</span>
          <span className={`badge ${statusBadge(selectedAlert.status)}`}>{selectedAlert.status}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Alert Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Card */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Shield size={16} color="#1e3a6e" /> Alert Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><span className="text-xs text-slate-500 font-semibold">Alert ID</span><p className="text-sm font-semibold text-slate-800">{selectedAlert.id}</p></div>
                <div><span className="text-xs text-slate-500 font-semibold">Bank</span><p className="text-sm text-slate-800">{selectedAlert.bankReference}</p></div>
                <div><span className="text-xs text-slate-500 font-semibold">Transaction Reference</span><p className="text-sm font-mono text-slate-800">{selectedAlert.transactionReference}</p></div>
                <div><span className="text-xs text-slate-500 font-semibold">Account Reference</span><p className="text-sm font-mono text-slate-800">{selectedAlert.maskedAccountReference}</p></div>
                <div><span className="text-xs text-slate-500 font-semibold">Amount</span><p className="text-sm font-bold text-red-600">₹{selectedAlert.amount.toLocaleString('en-IN')}</p></div>
                <div><span className="text-xs text-slate-500 font-semibold">Transaction Time</span><p className="text-sm text-slate-800">{new Date(selectedAlert.transactionTime).toLocaleString('en-IN')}</p></div>
                <div><span className="text-xs text-slate-500 font-semibold">Crime Type</span><p className="text-sm text-slate-800">{selectedAlert.crimeType}</p></div>
                <div><span className="text-xs text-slate-500 font-semibold">Location</span><p className="text-sm text-slate-800">{selectedAlert.location}</p></div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">Alert Reason</span>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{selectedAlert.alertReason}</p>
              </div>
            </div>

            {/* Communication History */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare size={16} /> Communication History
              </h3>
              <div className="space-y-3 mb-4">
                {selectedAlert.communications.map(msg => (
                  <div key={msg.id} className={`msg-bubble ${msg.fromRole}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold">{msg.from}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Send Message */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  className="form-input flex-1 text-sm py-2.5"
                  placeholder="Send update or request information…"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="btn-primary py-2 px-4 text-sm" disabled={!newMessage.trim()}>
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Actions */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Review Alert', action: 'review' },
                  { label: 'Open Case', action: 'case' },
                  { label: 'Request Information', action: 'request' },
                  { label: 'Send Update', action: 'update' },
                ].map(a => (
                  <button key={a.action}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 text-left">
                    <ExternalLink size={14} color="#94a3b8" />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Workflow */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Workflow</h3>
              <div className="space-y-2">
                {['Bank Alert', 'LEA Review', 'Investigation', 'Request Info', 'Bank Response', 'Case Update', 'Resolution'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i < 2 ? 'bg-[#1e3a6e] text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i < 2 ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs ${i < 2 ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Handshake size={24} color="#1e3a6e" /> Bank Coordination
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage bank-escalated cyber fraud alerts and coordination.</p>
        </div>
        <button onClick={fetchAlerts} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Alerts Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 shimmer rounded-lg" />)}
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center">
            <Handshake size={40} color="#94a3b8" className="mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Bank Alerts</h3>
            <p className="text-slate-500 text-sm">No bank-escalated alerts at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Bank</th>
                  <th>Transaction Ref</th>
                  <th>Crime Type</th>
                  <th>Amount</th>
                  <th>Priority</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td className="font-semibold text-slate-800">{a.alertReference}</td>
                    <td className="text-sm">{a.bankReference}</td>
                    <td className="text-xs font-mono text-slate-500">{a.transactionReference.slice(-12)}</td>
                    <td className="text-sm">{a.crimeType}</td>
                    <td className="text-sm font-bold text-slate-800">₹{a.amount.toLocaleString('en-IN')}</td>
                    <td><span className="badge" style={priorityStyle(a.priority)}>{a.priority}</span></td>
                    <td className="text-sm">{a.location}</td>
                    <td className="text-xs text-slate-500">
                      <div className="flex items-center gap-1"><Clock size={10} /> {new Date(a.transactionTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                    </td>
                    <td><span className={`badge ${statusBadge(a.status)}`}>{a.status}</span></td>
                    <td>
                      <button onClick={() => setSelectedAlert(a)} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                        View →
                      </button>
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
