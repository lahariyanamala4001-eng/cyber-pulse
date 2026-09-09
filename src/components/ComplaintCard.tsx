import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import type { Complaint } from '../types/complaint';
import StatusBadge from './StatusBadge';

interface ComplaintCardProps {
  complaint: Complaint;
  view?: 'card' | 'row';
}

export default function ComplaintCard({ complaint, view = 'card' }: ComplaintCardProps) {
  if (view === 'row') {
    return (
      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td className="px-4 py-3">
          <span className="font-mono text-sm font-semibold text-blue-700">{complaint.id}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-slate-700">{complaint.type}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-slate-500">{complaint.incidentDate}</span>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={complaint.status} size="sm" />
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-slate-500">{complaint.lastUpdated}</span>
        </td>
        <td className="px-4 py-3">
          <Link
            to={`/track?id=${complaint.id}`}
            className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
          >
            View <ArrowRight size={13} />
          </Link>
        </td>
      </tr>
    );
  }

  return (
    <div className="card p-5 card-interactive animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-mono text-sm font-bold text-blue-700">{complaint.id}</span>
          <h3 className="font-semibold text-slate-800 mt-0.5">{complaint.type}</h3>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{complaint.description}</p>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} /> Incident: {complaint.incidentDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} /> Updated: {complaint.lastUpdated}
        </span>
        {complaint.amountLost && complaint.amountLost > 0 && (
          <span className="text-red-600 font-medium">
            Loss: ₹{complaint.amountLost.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">{complaint.evidenceCount} evidence file(s)</span>
        <Link
          to={`/track?id=${complaint.id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        >
          Track Status <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
