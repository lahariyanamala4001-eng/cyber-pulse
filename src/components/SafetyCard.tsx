import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SafetyCardProps {
  title: string;
  description: string;
  tips: string[];
  icon?: ReactNode;
  category: string;
  color?: string;
}

export default function SafetyCard({
  title,
  description,
  tips,
  icon,
  category,
  color = '#1e3a6e',
}: SafetyCardProps) {
  return (
    <div className="card p-6 card-interactive h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
          style={{ background: `${color}15` }}
          aria-hidden="true"
        >
          {icon || <ShieldCheck size={22} color={color} />}
        </div>
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color }}
          >
            {category}
          </span>
          <h3 className="font-bold text-slate-800 mt-0.5 text-lg leading-snug">
            {title}
          </h3>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{description}</p>

      <div className="flex-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Key tips:
        </p>
        <ul className="space-y-2">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                style={{ background: color, fontSize: '10px' }}
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <Link
          to="/safety-centre"
          className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{ color }}
        >
          Learn more <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
