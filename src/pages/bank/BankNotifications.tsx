import { useState } from 'react';
import { Bell, AlertTriangle, FolderSearch, Handshake, Settings, CheckCheck } from 'lucide-react';
import { mockBankNotifications } from '../../data/bank/mockLEAData';
import type { BankNotificationType } from '../../types/bank';
import { getRiskLevelColor } from '../../services/mlService';

export default function BankNotifications() {
  const [filter, setFilter] = useState<BankNotificationType | 'ALL'>('ALL');
  const [notifications, setNotifications] = useState(mockBankNotifications);

  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const typeIcons: Record<BankNotificationType, React.ReactNode> = {
    fraud_alert: <AlertTriangle size={16} />,
    case_update: <FolderSearch size={16} />,
    lea_message: <Handshake size={16} />,
    system: <Settings size={16} />,
  };

  const typeLabels: Record<BankNotificationType, string> = {
    fraud_alert: 'Fraud Alerts',
    case_update: 'Case Updates',
    lea_message: 'LEA Messages',
    system: 'System',
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell size={22} color="#1e3a6e" /> Notifications
          </h1>
          <p className="text-slate-500 text-sm">{unreadCount} unread notification(s)</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-outline text-sm py-2 px-4">
            <CheckCheck size={14} /> Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['ALL', 'fraud_alert', 'case_update', 'lea_message', 'system'] as (BankNotificationType | 'ALL')[]).map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              filter === t ? 'bg-blue-700 text-white border-blue-700' : 'text-slate-600 bg-white border-slate-200 hover:border-slate-300'
            }`}>
            {t === 'ALL' ? 'All' : typeLabels[t]}
            {t !== 'ALL' && ` (${notifications.filter(n => n.type === t).length})`}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell size={40} color="#e2e8f0" className="mx-auto mb-3" />
            <p className="text-slate-500">No notifications.</p>
          </div>
        ) : (
          filtered.map(notif => {
            const severityColor = notif.severity ? getRiskLevelColor(notif.severity) : '#64748b';
            return (
              <div key={notif.id}
                className={`card p-4 flex items-start gap-4 transition-colors ${!notif.isRead ? 'border-l-4' : ''}`}
                style={!notif.isRead ? { borderLeftColor: severityColor } : {}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: notif.type === 'fraud_alert' ? '#fef2f2'
                      : notif.type === 'case_update' ? '#f0f4ff'
                      : notif.type === 'lea_message' ? '#f0fdf4'
                      : '#f8fafc',
                    color: notif.type === 'fraud_alert' ? '#dc2626'
                      : notif.type === 'case_update' ? '#1e3a6e'
                      : notif.type === 'lea_message' ? '#166534'
                      : '#64748b',
                  }}>
                  {typeIcons[notif.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`text-sm font-bold ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    {notif.severity && (
                      <span className={`badge risk-${notif.severity.toLowerCase()} text-[10px]`}>{notif.severity}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(notif.timestamp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
