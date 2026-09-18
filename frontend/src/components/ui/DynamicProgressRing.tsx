import React from 'react';

interface DynamicProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  textColor?: string;
  className?: string;
}

export const DynamicProgressRing: React.FC<DynamicProgressRingProps> = ({
  percentage,
  size = 39,
  strokeWidth = 3.6,
  trackColor = '#FFFFFF',
  progressColor = '#0048B3',
  textColor = '#0D0D0D',
  className = '',
}) => {
  // Center coordinates and radius
  const center = size / 2;
  // Radius accounts for half the stroke width and 1px breathing space so caps don't clip
  const radius = center - strokeWidth / 2 - 1.2;
  const circumference = 2 * Math.PI * radius;
  // Clamped percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = circumference - (circumference * clampedPercentage) / 100;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none animate-fadeIn ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circular track (solid white donut) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Active progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {/* Centered percentage label in authentic PP Neue Montreal */}
      <span
        className="absolute inset-0 flex items-center justify-center text-[12px] font-medium leading-none tracking-[-0.01em]"
        style={{
          color: textColor,
          fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {clampedPercentage}%
      </span>
    </div>
  );
};
