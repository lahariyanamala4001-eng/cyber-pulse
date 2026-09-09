import { useState } from 'react';
import { Bell, Filter, CheckCheck } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import type { Alert } from '../types/alert';
import { mockAlerts } from '../data/mockAlerts';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  const markRead = (id: string) =>
    setAlerts(a => a.map(al => al.id === id ? { ...al, isRead: true } : al));

  const dismiss = (id: string) =>
    setAlerts(a => a.map(al => al.id === id ? { ...al, isDismissed: true } : al));

  const markAllRead = () =>
    setAlerts(a => a.map(al => ({ ...al, isRead: true })));

  const visible = alerts.filter(a => {
    if (a.isDismissed) return false;
    if (filter === 'unread') return !a.isRead;
    if (filter === 'high') return a.severity === 'high';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead && !a.isDismissed).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={20} color="#1e3a6e"/>
            <h1 className="text-2xl font-black text-slate-900">Safety Alerts</h1>
            {unreadCount > 0 && (
              <span className="badge badge-submitted">{unreadCount} new</span>
            )}
          </div>
          <p className="text-slate-500 text-sm">Stay informed about cybercrime threats and safety advisories.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-outline flex-shrink-0 text-sm flex items-center gap-1.5">
            <CheckCheck size={14}/> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} color="#64748b"/>
        {(['all', 'unread', 'high'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
              filter === f
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {f === 'all' ? 'All Alerts' : f === 'unread' ? 'Unread' : 'High Priority'}
          </button>
        ))}
      </div>

      {/* Alert List */}
      {visible.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell size={40} color="#e2e8f0" className="mx-auto mb-3"/>
          <h3 className="font-bold text-slate-600 mb-1">
            {filter === 'unread' ? 'No unread alerts' : 'No alerts'}
          </h3>
          <p className="text-sm text-slate-400">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(alert => (
            <AlertCard key={alert.id} alert={alert} onMarkRead={markRead} onDismiss={dismiss}/>
          ))}
        </div>
      )}

      <div className="mt-8 card p-5" style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8efff)' }}>
        <h3 className="font-bold text-slate-800 mb-1 text-sm">🔔 Real-Time Alerts</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          This portal sends real-time safety alerts about cybercrime trends in your area. Make sure your notification preferences are up to date in your profile settings.
        </p>
      </div>
    </div>
  );
}
