import { CheckCircle, Circle, Clock } from 'lucide-react';
import type { ComplaintTimeline } from '../types/complaint';

interface ComplaintTimelineProps {
  timeline: ComplaintTimeline[];
}

export default function ComplaintTimelineView({ timeline }: ComplaintTimelineProps) {
  return (
    <div className="space-y-0">
      {timeline.map((item, idx) => (
        <div key={idx} className={`timeline-item ${item.completed ? 'completed' : ''}`}>
          <div>
            <div
              className={`timeline-dot ${
                item.completed
                  ? 'bg-blue-900 text-white'
                  : item.active
                  ? 'text-blue-700 border-2 border-blue-600 bg-blue-50'
                  : 'text-slate-300 border-2 border-slate-200 bg-white'
              }`}
            >
              {item.completed ? (
                <CheckCircle size={16} color="white" strokeWidth={2.5} />
              ) : item.active ? (
                <Clock size={14} color="#1d4ed8" strokeWidth={2.5} />
              ) : (
                <Circle size={14} color="#cbd5e1" />
              )}
            </div>
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`text-sm font-semibold ${
                  item.completed
                    ? 'text-slate-800'
                    : item.active
                    ? 'text-blue-800'
                    : 'text-slate-400'
                }`}
              >
                {item.stage}
              </span>
              {item.active && (
                <span className="badge badge-investigating text-xs">Current</span>
              )}
              {item.completed && !item.active && (
                <span className="badge badge-resolved text-xs">Done</span>
              )}
            </div>
            {item.date && (
              <p className="text-xs text-slate-400 mb-1">{item.date}</p>
            )}
            <p className={`text-sm ${item.completed || item.active ? 'text-slate-600' : 'text-slate-400'}`}>
              {item.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
