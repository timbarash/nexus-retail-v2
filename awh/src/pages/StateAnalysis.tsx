import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import PageHeader from '../components/PageHeader';
import SentimentBadge from '../components/SentimentBadge';
import { stateData } from '../data/stateAnalysis';
import { getScoreColor } from '../utils/colors';

export default function StateAnalysis() {
  return (
    <div>
      <PageHeader
        title="State Analysis"
        subtitle="Sentiment trends across AWH's 7-state footprint"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stateData.map((s) => {
          const color = getScoreColor(s.score);
          return (
            <div key={s.abbreviation} className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-navy-900">{s.state}</h3>
                    <span className="rounded bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-500">
                      {s.abbreviation}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{s.locationCount} locations</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color }}>{s.score}</p>
                  <SentimentBadge sentiment={s.sentiment} />
                </div>
              </div>

              <div className="mt-3">
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={s.trend} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <YAxis domain={[30, 80]} hide />
                    <Tooltip
                      formatter={(value: number) => [value, 'Score']}
                      labelFormatter={(label: string) => label}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e3e7e9', fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke={color}
                      fill={color}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <p className="mt-2 text-xs text-gray-500">{s.keyInsight}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
