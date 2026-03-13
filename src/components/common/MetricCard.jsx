import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COLOR_HEX = {
  dutchie: '#00C27C',
  blue: '#64A8E0',
  purple: '#B598E8',
  amber: '#D4A03A',
  red: '#E87068',
};

/* Tiny SVG sparkline — takes an array of numbers */
function Sparkline({ data, color = '#00C27C', width = 64, height = 24 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(' ');
  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricCard({
  title, value, subtitle, icon: Icon, trend, trendLabel,
  color = 'dutchie', sparkline, borderAccent, benchmark, benchmarkLabel,
  style,
}) {
  const hex = COLOR_HEX[color] || COLOR_HEX.dutchie;
  const trendPositive = typeof trend === 'number' && trend >= 0;

  return (
    <div
      className={`bg-[#1C1B1A] rounded-xl border border-[#38332B] p-4 hover:brightness-110 transition-all duration-200 cursor-default ${borderAccent ? 'border-l-[3px]' : ''}`}
      style={{
        ...(borderAccent ? { borderLeftColor: hex } : {}),
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {/* Row 1: icon + sparkline */}
      <div className="flex items-center justify-between mb-3">
        {Icon && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${hex}18` }}
          >
            <Icon className="h-4 w-4" style={{ color: hex }} />
          </div>
        )}
        {sparkline ? (
          <Sparkline data={sparkline} color={hex} />
        ) : (
          !Icon && <div />
        )}
      </div>

      {/* Row 2: big value */}
      <p className="text-xl font-bold text-[#F0EDE8]">{value}</p>

      {/* Row 3: label + trend */}
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-[#ADA599]">{title}</p>
        {typeof trend === 'number' && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trendPositive ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
            {trendPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trendPositive ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Row 4: optional benchmark comparison */}
      {benchmark && (
        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(56,51,43,0.4)' }}>
          <span className="text-[12px] text-[#ADA599]">{benchmarkLabel || 'Avg'}: {benchmark}</span>
          {typeof trend === 'number' && (
            <span
              className="text-[12px] font-semibold px-1.5 py-0.5 rounded"
              style={{ color: trendPositive ? '#00C27C' : '#E87068', background: trendPositive ? 'rgba(0,194,124,0.07)' : 'rgba(232,112,104,0.07)' }}
            >
              {trendPositive ? 'Above' : 'Below'}
            </span>
          )}
        </div>
      )}

      {/* Legacy: subtitle support */}
      {subtitle && !benchmark && (
        <p className="mt-1 text-xs text-[#6B6359]">{subtitle}</p>
      )}
    </div>
  );
}
