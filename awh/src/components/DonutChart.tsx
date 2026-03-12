import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS: Record<string, string> = {
  positive: '#00a47c',
  neutral: '#e8932c',
  negative: '#d94040',
};

const LABELS: Record<string, string> = {
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
};

interface ChartItem {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: ChartItem }> }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, payload: data } = payload[0];
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm shadow-lg">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-medium text-navy-900">{name}</span>
      </div>
      <p className="mt-1 text-gray-500">{value} reviews ({data.percentage}%)</p>
    </div>
  );
}

interface DonutChartProps {
  data: { positive: number; neutral: number; negative: number };
  height?: number;
  showLegend?: boolean;
}

export default function DonutChart({ data, height = 250, showLegend = true }: DonutChartProps) {
  const chartData = useMemo<ChartItem[]>(() => {
    if (!data) return [];
    const total = (data.positive || 0) + (data.neutral || 0) + (data.negative || 0);
    if (total === 0) return [];

    return (['positive', 'neutral', 'negative'] as const)
      .map((key) => ({
        name: LABELS[key],
        value: data[key] || 0,
        color: COLORS[key],
        percentage: (((data[key] || 0) / total) * 100).toFixed(1),
      }))
      .filter((d) => d.value > 0);
  }, [data]);

  const dominant = useMemo(() => {
    if (!chartData.length) return null;
    return chartData.reduce((max, item) => (item.value > max.value ? item : max), chartData[0]);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No sentiment data available
      </div>
    );
  }

  const innerRadius = height * 0.22;
  const outerRadius = height * 0.38;

  return (
    <div style={{ width: '100%', height: height + (showLegend ? 40 : 0) }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {dominant && (
            <>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fill: dominant.color, fontSize: '1.25rem', fontWeight: 700 }}
              >
                {dominant.percentage}%
              </text>
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fill: '#77868e', fontSize: '0.7rem' }}
              >
                {dominant.name}
              </text>
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <div className="flex justify-center gap-4 mt-2">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-gray-500">{d.name}</span>
              <span className="font-medium text-gray-600">{d.value}</span>
              <span className="text-xs text-gray-400">({d.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
