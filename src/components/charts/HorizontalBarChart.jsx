import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const SENTIMENT_COLORS = {
  positive: '#00C27C',
  neutral: '#D4A03A',
  negative: '#E87068',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  const total = (data.positive || 0) + (data.neutral || 0) + (data.negative || 0);

  return (
    <div className="bg-[#1C1B1A] rounded-lg shadow-lg border border-[#38332B] p-3 text-sm">
      <p className="font-semibold text-[#F0EDE8] mb-1.5">{label}</p>
      <p className="text-xs text-[#6B6359] mb-2">{total} total reviews</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00C27C]" />
            <span className="text-[#ADA599]">Positive</span>
          </span>
          <span className="font-medium text-[#00C27C]">
            {data.positive || 0}
            <span className="text-[#6B6359] text-xs ml-1">
              ({total ? ((data.positive / total) * 100).toFixed(0) : 0}%)
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D4A03A]" />
            <span className="text-[#ADA599]">Neutral</span>
          </span>
          <span className="font-medium text-[#D4A03A]">
            {data.neutral || 0}
            <span className="text-[#6B6359] text-xs ml-1">
              ({total ? ((data.neutral / total) * 100).toFixed(0) : 0}%)
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E87068]" />
            <span className="text-[#ADA599]">Negative</span>
          </span>
          <span className="font-medium text-[#E87068]">
            {data.negative || 0}
            <span className="text-[#6B6359] text-xs ml-1">
              ({total ? ((data.negative / total) * 100).toFixed(0) : 0}%)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="flex justify-center gap-5 mt-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#ADA599] capitalize">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function HorizontalBarChart({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[#6B6359] text-sm"
        style={{ height }}
      >
        No source data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        barGap={0}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6359' }} />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 13, fill: '#F0F6FC', fontWeight: 500 }}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="positive" stackId="stack" fill={SENTIMENT_COLORS.positive} radius={[0, 0, 0, 0]} />
        <Bar dataKey="neutral" stackId="stack" fill={SENTIMENT_COLORS.neutral} radius={[0, 0, 0, 0]} />
        <Bar dataKey="negative" stackId="stack" fill={SENTIMENT_COLORS.negative} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
