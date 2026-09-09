import { useState } from 'react';
import { Bell, X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type { Alert, AlertSeverity } from '../types/alert';

interface AlertCardProps {
  alert: Alert;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  expanded?: boolean;
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  const props = { size: 16, strokeWidth: 2.5 };
  if (severity === 'high') return <AlertTriangle {...props} color="#dc2626" />;
  if (severity === 'medium') return <AlertCircle {...props} color="#d97706" />;
  if (severity === 'low') return <Info {...props} color="#2563b0" />;
  return <Bell {...props} color="#6366f1" />;
}

const severityLabel: Record<AlertSeverity, string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
  info: 'Information',
};

const alertClass: Record<AlertSeverity, string> = {
  high: 'alert-high',
  medium: 'alert-medium',
  low: 'alert-low',
  info: 'alert-info',
};

export default function AlertCard({ alert, onMarkRead, onDismiss }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (alert.isDismissed) return null;

  return (
    <div
      className={`card p-4 ${alertClass[alert.severity]} ${!alert.isRead ? 'ring-1 ring-inset ring-current/10' : 'opacity-80'} animate-fade-in`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <SeverityIcon severity={alert.severity} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: alert.severity === 'high' ? '#dc2626' :
                           alert.severity === 'medium' ? '#d97706' :
                           alert.severity === 'low' ? '#2563b0' : '#6366f1'
                  }}>
                  {severityLabel[alert.severity]}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">{alert.category}</span>
                {!alert.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="Unread" />
                )}
              </div>
              <h3 className="font-semibold text-slate-800 mt-0.5">{alert.title}</h3>
            </div>

            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Dismiss alert"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <p className={`text-sm text-slate-700 mt-1.5 ${!expanded ? 'line-clamp-2' : ''}`}>
            {alert.message}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400">{alert.date}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
              {onMarkRead && !alert.isRead && (
                <button
                  onClick={() => onMarkRead(alert.id)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
