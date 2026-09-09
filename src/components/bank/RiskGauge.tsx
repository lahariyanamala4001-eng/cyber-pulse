import { useEffect, useState } from 'react';
import type { RiskLevel } from '../../types/bank';
import { getRiskLevelColor } from '../../services/mlService';

interface RiskGaugeProps {
  score: number;        // 0–100
  riskLevel: RiskLevel;
  size?: number;
  showLabel?: boolean;
}

export default function RiskGauge({ score, riskLevel, size = 120, showLabel = true }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getRiskLevelColor(riskLevel);

  return (
    <div className="risk-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="risk-gauge-track" cx={size / 2} cy={size / 2} r={radius} />
        <circle
          className="risk-gauge-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <div className="risk-gauge-label">
          <span style={{ fontSize: size * 0.25, color }}>{animatedScore}</span>
          <span style={{ fontSize: size * 0.09, color: '#64748b', fontWeight: 600 }}>{riskLevel}</span>
        </div>
      )}
    </div>
  );
}
