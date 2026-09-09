import { useState } from 'react';
import { Handshake, Send } from 'lucide-react';
import { mockLEACoordinations } from '../../data/bank/mockLEAData';

export default function LEACoordination() {
  const [selectedId, setSelectedId] = useState<string | null>(mockLEACoordinations[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');

  const selected = mockLEACoordinations.find(c => c.id === selectedId);

  const statusColors: Record<string, { bg: string; color: string }> = {
    'Shared': { bg: '#f0f9ff', color: '#0369a1' },
    'Acknowledged': { bg: '#fffbeb', color: '#d97706' },
    'Under LEA Investigation': { bg: '#fff7ed', color: '#ea580c' },
    'Action Taken': { bg: '#f0fdf4', color: '#166534' },
    'Closed': { bg: '#f8fafc', color: '#64748b' },
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Handshake size={22} color="#1e3a6e" /> LEA Coordination
        </h1>
        <p className="text-slate-500 text-sm">Manage cases shared with Law Enforcement Agencies.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-700">{mockLEACoordinations.length} Shared Cases</p>
          </div>
          <div className="divide-y divide-slate-50">
            {mockLEACoordinations.map(coord => {
              const sc = statusColors[coord.sharedStatus] || statusColors['Shared'];
              return (
                <button key={coord.id} onClick={() => setSelectedId(coord.id)}
                  className={`w-full text-left px-4 py-4 transition-colors ${
                    selectedId === coord.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-blue-700">{coord.caseId}</span>
                    <span className={`badge risk-${coord.riskLevel.toLowerCase()} text-[10px]`}>{coord.riskLevel}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">{coord.caseName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{coord.leaName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="badge text-[10px]" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                      {coord.sharedStatus}
                    </span>
                    <span className="text-[10px] text-slate-400">{coord.messages.length} msgs</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-5 animate-fade-in">
              {/* Header */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Case</p>
                    <h2 className="text-xl font-black text-slate-900">{selected.caseName}</h2>
                  </div>
                  <span className={`badge risk-${selected.riskLevel.toLowerCase()}`}>{selected.riskLevel}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'LEA', value: selected.leaName },
                    { label: 'Officer', value: selected.leaOfficer },
                    { label: 'Amount', value: `₹${selected.totalAmountInvolved.toLocaleString('en-IN')}` },
                    { label: 'Shared On', value: new Date(selected.sharedAt).toLocaleDateString('en-IN') },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shared Documents */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-3">📎 Shared Documents</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.sharedDocuments.map(doc => (
                    <span key={doc} className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: '#f0f4ff', color: '#1e3a6e', border: '1px solid #c7d7f8' }}>
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Communication Thread */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Communication Thread</h3>
                </div>
                <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
                  {selected.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.fromRole === 'bank' ? 'justify-end' : 'justify-start'}`}>
                      <div>
                        <div className={`msg-bubble ${msg.fromRole}`}>
                          {msg.message}
                        </div>
                        <p className={`text-[10px] text-slate-400 mt-1 ${msg.fromRole === 'bank' ? 'text-right' : ''}`}>
                          {msg.from} · {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
                  <input type="text" className="form-input py-2 text-sm flex-1"
                    placeholder="Type a message…" value={newMessage}
                    onChange={e => setNewMessage(e.target.value)} />
                  <button className="btn-primary py-2 px-4 text-sm" onClick={() => setNewMessage('')}>
                    <Send size={14} /> Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Handshake size={40} color="#e2e8f0" className="mx-auto mb-3" />
              <p className="text-slate-500">Select a case to view coordination details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
