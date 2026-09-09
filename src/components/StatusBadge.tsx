import type { ComplaintStatus } from '../types/complaint';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ComplaintStatus, { label: string; cls: string; dot: string }> = {
  Submitted: {
    label: 'Submitted',
    cls: 'badge-submitted',
    dot: '#0369a1',
  },
  'Under Review': {
    label: 'Under Review',
    cls: 'badge-review',
    dot: '#92400e',
  },
  Assigned: {
    label: 'Assigned',
    cls: 'badge-assigned',
    dot: '#7c3aed',
  },
  'Under Investigation': {
    label: 'Under Investigation',
    cls: 'badge-investigating',
    dot: '#c2410c',
  },
  Resolved: {
    label: 'Resolved',
    cls: 'badge-resolved',
    dot: '#166534',
  },
  Closed: {
    label: 'Closed',
    cls: 'badge-closed',
    dot: '#475569',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : '';

  return (
    <span className={`badge ${config.cls} ${sizeClass}`}>
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: config.dot }}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
