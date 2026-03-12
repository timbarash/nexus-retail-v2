import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataPoint {
  month: string;
  avg: number;
  positive?: number;
  neutral?: number;
  negative?: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: TrendDataPoint }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm shadow-lg">
      <p className="mb-1.5 font-semibold text-navy-900">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Avg Score</span>
          <span className="font-medium text-navy-900">{data.avg?.toFixed(2)}</span>
        </div>
        {typeof data.positive === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00a47c]" />
              <span className="text-gray-500">Positive</span>
            </span>
            <span className="font-medium text-[#00a47c]">{data.positive}</span>
          </div>
        )}
        {typeof data.neutral === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#e8932c]" />
              <span className="text-gray-500">Neutral</span>
            </span>
            <span className="font-medium text-[#e8932c]">{data.neutral}</span>
          </div>
        )}
        {typeof data.negative === 'number' && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#d94040]" />
              <span className="text-gray-500">Negative</span>
            </span>
            <span className="font-medium text-[#d94040]">{data.negative}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
}

export default function TrendChart({ data, height = 300 }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="awhSentimentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a47c" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00a47c" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e3e7e9" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#77868e' }}
          dy={8}
        />
        <YAxis
          domain={[-1, 1]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#77868e' }}
          dx={-4}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="avg"
          stroke="#00a47c"
          strokeWidth={2.5}
          fill="url(#awhSentimentGradient)"
          dot={{ r: 3, fill: '#00a47c', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#00a47c', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
