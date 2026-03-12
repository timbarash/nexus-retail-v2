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
    <div className="bg-white rounded-lg shadow-lg border border-surface-border p-3 text-sm">
      <p className="font-semibold text-text-primary mb-1.5">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-text-secondary">Avg Score</span>
          <span className="font-medium text-text-primary">{data.avg?.toFixed(1)}</span>
        </div>
        {typeof data.positive === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00a35e]" />
              <span className="text-text-secondary">Positive</span>
            </span>
            <span className="font-medium text-[#00a35e]">{data.positive}</span>
          </div>
        )}
        {typeof data.neutral === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d97706]" />
              <span className="text-text-secondary">Neutral</span>
            </span>
            <span className="font-medium text-[#d97706]">{data.neutral}</span>
          </div>
        )}
        {typeof data.negative === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span className="text-text-secondary">Negative</span>
            </span>
            <span className="font-medium text-[#ef4444]">{data.negative}</span>
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
        className="flex items-center justify-center text-text-muted text-sm"
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
            <stop offset="0%" stopColor="#00a35e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00a35e" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          dy={8}
        />
        <YAxis
          domain={[-1, 1]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          dx={-4}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="avg"
          stroke="#00a35e"
          strokeWidth={2.5}
          fill="url(#sentimentGradient)"
          dot={{ r: 3, fill: '#00a35e', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#00a35e', stroke: '#161B22', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
