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
  positive: '#00a47c',
  neutral: '#e8932c',
  negative: '#d94040',
};

interface BarDataPoint {
  name: string;
  positive: number;
  neutral: number;
  negative: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: BarDataPoint }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  const total = (data.positive || 0) + (data.neutral || 0) + (data.negative || 0);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm shadow-lg">
      <p className="mb-1.5 font-semibold text-navy-900">{label}</p>
      <p className="mb-2 text-xs text-gray-400">{total} total reviews</p>
      <div className="space-y-1">
        {(['positive', 'neutral', 'negative'] as const).map((key) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS[key] }} />
              <span className="text-gray-500 capitalize">{key}</span>
            </span>
            <span className="font-medium" style={{ color: SENTIMENT_COLORS[key] }}>
              {data[key] || 0}
              <span className="ml-1 text-xs text-gray-400">
                ({total ? ((data[key] / total) * 100).toFixed(0) : 0}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  return (
    <div className="flex justify-center gap-5 mt-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize text-gray-500">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

interface HorizontalBarChartProps {
  data: BarDataPoint[];
  height?: number;
}

export default function HorizontalBarChart({ data, height = 300 }: HorizontalBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e3e7e9" horizontal={false} />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#77868e' }} />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 13, fill: '#4a5459', fontWeight: 500 }}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="positive" stackId="stack" fill={SENTIMENT_COLORS.positive} />
        <Bar dataKey="neutral" stackId="stack" fill={SENTIMENT_COLORS.neutral} />
        <Bar dataKey="negative" stackId="stack" fill={SENTIMENT_COLORS.negative} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
