import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  positive: '#00C27C',
  neutral: '#D4A03A',
  negative: '#E87068',
};

const LABELS = {
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, payload: data } = payload[0];
  return (
    <div className="bg-[#1C1B1A] rounded-lg shadow-lg border border-[#38332B] p-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-medium text-[#F0EDE8]">{name}</span>
      </div>
      <p className="text-[#ADA599] mt-1">
        {value} reviews ({data.percentage}%)
      </p>
    </div>
  );
}

function CustomLegend({ payload, chartData }) {
  return (
    <div className="flex justify-center gap-4 mt-2">
      {payload?.map((entry) => {
        const item = chartData.find((d) => d.name === entry.value);
        return (
          <div key={entry.value} className="flex items-center gap-1.5 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#ADA599]">{entry.value}</span>
            <span className="font-medium text-[#F0EDE8]">
              {item?.value || 0}
            </span>
            <span className="text-[#6B6359] text-xs">
              ({item?.percentage || 0}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function DonutChart({ data, height = 250, showLegend = true }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    const total = (data.positive || 0) + (data.neutral || 0) + (data.negative || 0);
    if (total === 0) return [];

    return [
      {
        name: LABELS.positive,
        value: data.positive || 0,
        color: COLORS.positive,
        percentage: ((data.positive || 0) / total * 100).toFixed(1),
      },
      {
        name: LABELS.neutral,
        value: data.neutral || 0,
        color: COLORS.neutral,
        percentage: ((data.neutral || 0) / total * 100).toFixed(1),
      },
      {
        name: LABELS.negative,
        value: data.negative || 0,
        color: COLORS.negative,
        percentage: ((data.negative || 0) / total * 100).toFixed(1),
      },
    ].filter((d) => d.value > 0);
  }, [data]);

  const dominant = useMemo(() => {
    if (!chartData.length) return null;
    return chartData.reduce((max, item) => (item.value > max.value ? item : max), chartData[0]);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[#6B6359] text-sm"
        style={{ height }}
      >
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
          {/* Center label */}
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-2xl font-bold"
            style={{ fill: dominant?.color || '#F0F6FC', fontSize: '1.25rem', fontWeight: 700 }}
          >
            {dominant?.percentage}%
          </text>
          <text
            x="50%"
            y="57%"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fill: '#6B6359', fontSize: '0.7rem' }}
          >
            {dominant?.name}
          </text>
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <CustomLegend
          payload={chartData.map((d) => ({ value: d.name, color: d.color }))}
          chartData={chartData}
        />
      )}
    </div>
  );
}
