import React, { useMemo } from 'react';

const sizeConfig = {
  sm: { width: 120, height: 80, strokeWidth: 10, fontSize: 20, labelSize: 10, radius: 45 },
  md: { width: 180, height: 110, strokeWidth: 14, fontSize: 28, labelSize: 12, radius: 65 },
  lg: { width: 240, height: 145, strokeWidth: 18, fontSize: 36, labelSize: 14, radius: 85 },
};

function scoreToColor(normalizedScore) {
  if (normalizedScore >= 65) return '#00C27C';
  if (normalizedScore >= 45) return '#D4A03A';
  if (normalizedScore >= 25) return '#FFA657';
  return '#E87068';
}

export default function SentimentGauge({ score, size = 'lg' }) {
  const config = sizeConfig[size] || sizeConfig.lg;
  const { width, height, strokeWidth, fontSize, labelSize, radius } = config;

  const normalizedScore = useMemo(() => {
    const clamped = Math.max(-1, Math.min(1, score || 0));
    return Math.round(((clamped + 1) / 2) * 100);
  }, [score]);

  const color = scoreToColor(normalizedScore);

  const centerX = width / 2;
  const centerY = height - 10;
  const startAngle = Math.PI;
  const endAngle = 0;

  const bgStartX = centerX + radius * Math.cos(startAngle);
  const bgStartY = centerY - radius * Math.sin(startAngle);
  const bgEndX = centerX + radius * Math.cos(endAngle);
  const bgEndY = centerY - radius * Math.sin(endAngle);

  const bgPath = `M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 0 1 ${bgEndX} ${bgEndY}`;

  const fraction = normalizedScore / 100;
  const valueAngle = startAngle - fraction * Math.PI;
  const valEndX = centerX + radius * Math.cos(valueAngle);
  const valEndY = centerY - radius * Math.sin(valueAngle);
  const largeArcFlag = fraction > 0.5 ? 1 : 0;

  const valuePath = `M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${valEndX} ${valEndY}`;

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`gauge-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E87068" />
            <stop offset="35%" stopColor="#FFA657" />
            <stop offset="50%" stopColor="#D4A03A" />
            <stop offset="75%" stopColor="#00E08E" />
            <stop offset="100%" stopColor="#00C27C" />
          </linearGradient>
        </defs>

        <path
          d={bgPath}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {normalizedScore > 0 && (
          <path
            d={valuePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}

        <text
          x={centerX}
          y={centerY - 12}
          textAnchor="middle"
          dominantBaseline="auto"
          className="font-bold"
          style={{ fontSize: `${fontSize}px`, fill: color }}
        >
          {normalizedScore}
        </text>

        <text
          x={bgStartX - 2}
          y={centerY + 2}
          textAnchor="middle"
          style={{ fontSize: `${labelSize - 2}px`, fill: '#484F58' }}
        >
          0
        </text>
        <text
          x={bgEndX + 2}
          y={centerY + 2}
          textAnchor="middle"
          style={{ fontSize: `${labelSize - 2}px`, fill: '#484F58' }}
        >
          100
        </text>
      </svg>
      <span
        className="text-[#ADA599] font-medium -mt-1"
        style={{ fontSize: `${labelSize}px` }}
      >
        Overall Sentiment
      </span>
    </div>
  );
}
