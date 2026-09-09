import { CheckCircle, Circle, Clock } from 'lucide-react';
import type { CaseTimelineEntry } from '../../types/bank';

interface CaseTimelineProps {
  timeline: CaseTimelineEntry[];
}

export default function CaseTimeline({ timeline }: CaseTimelineProps) {
  return (
    <div className="space-y-0">
      {timeline.map((entry, i) => {
        const isCompleted = entry.completed;
        const isActive = entry.active;

        return (
          <div key={i} className={`timeline-item ${isCompleted ? 'completed' : ''}`}>
            <div className="timeline-dot" style={{
              background: isCompleted ? '#1e3a6e' : isActive ? '#2563b0' : '#f1f5f9',
              border: isActive ? '3px solid #bfdbfe' : 'none',
            }}>
              {isCompleted ? (
                <CheckCircle size={16} color="white" />
              ) : isActive ? (
                <Clock size={14} color="white" />
              ) : (
                <Circle size={14} color="#94a3b8" />
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-sm font-bold ${
                  isCompleted ? 'text-slate-800' : isActive ? 'text-blue-700' : 'text-slate-400'
                }`}>
                  {entry.stage}
                </span>
                {isActive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    In Progress
                  </span>
                )}
              </div>
              {entry.date && (
                <p className="text-xs text-slate-400 mb-1">
                  {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}
                  {new Date(entry.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  {entry.actor && ` · ${entry.actor}`}
                </p>
              )}
              <p className={`text-sm ${isCompleted || isActive ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                {entry.note}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
