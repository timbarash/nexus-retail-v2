import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-[#1C1B1A] rounded-lg shadow-lg border border-[#38332B] p-3 text-sm">
      <p className="font-semibold text-[#F0EDE8] mb-1.5">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#ADA599]">Avg Score</span>
          <span className="font-medium text-[#F0EDE8]">{data.avg?.toFixed(1)}</span>
        </div>
        {typeof data.positive === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00C27C]" />
              <span className="text-[#ADA599]">Positive</span>
            </span>
            <span className="font-medium text-[#00C27C]">{data.positive}</span>
          </div>
        )}
        {typeof data.neutral === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4A03A]" />
              <span className="text-[#ADA599]">Neutral</span>
            </span>
            <span className="font-medium text-[#D4A03A]">{data.neutral}</span>
          </div>
        )}
        {typeof data.negative === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E87068]" />
              <span className="text-[#ADA599]">Negative</span>
            </span>
            <span className="font-medium text-[#E87068]">{data.negative}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrendChart({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[#6B6359] text-sm"
        style={{ height }}
      >
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C27C" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00C27C" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B6359' }}
          dy={8}
        />
        <YAxis
          domain={[-1, 1]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B6359' }}
          dx={-4}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="avg"
          stroke="#00C27C"
          strokeWidth={2.5}
          fill="url(#sentimentGradient)"
          dot={{ r: 3, fill: '#00C27C', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#00C27C', stroke: '#161B22', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
