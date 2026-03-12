import { useMemo } from 'react';
import {
  Trophy, Shield, AlertTriangle, Lightbulb, Target,
  TrendingUp, TrendingDown, Award, MessageCircle, BarChart3,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import { reviews } from '../data/reviews';
import { avgSentiment, calculateNPS, categorySentiment, sentimentDistribution } from '../utils/reviewUtils';

/* ── Constants ── */
const COMPANY_COLORS: Record<string, string> = {
  AWH: '#00a47c',
  Curaleaf: '#6366f1',
  'Green Thumb Industries': '#f59e0b',
  Trulieve: '#ef4444',
  Verano: '#8b5cf6',
  'Cresco Labs': '#0ea5e9',
};

const CATEGORY_LIST = [
  'Product Quality', 'Staff Friendliness', 'Wait Times',
  'Pricing', 'Store Atmosphere', 'Product Selection',
];

/* ── Tooltip ── */
function SentimentBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm shadow-lg">
      <p className="mb-1.5 font-semibold text-navy-900">{label}</p>
      <div className="space-y-1">
        {payload.map(item => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-500">{item.name}</span>
            </span>
            <span className="font-medium" style={{ color: item.color }}>
              {item.value >= 0 ? '+' : ''}{item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function CompetitiveInsights() {
  /* AWH real metrics from mock data */
  const awhMetrics = useMemo(() => {
    const avg = avgSentiment(reviews);
    const nps = calculateNPS(reviews);
    const catSent = categorySentiment(reviews);
    const dist = sentimentDistribution(reviews);

    const catSorted = [...catSent].sort((a, b) => b.avg - a.avg);
    const strength = catSorted.length > 0 ? catSorted[0].category : 'Product Quality';
    const weakness = catSorted.length > 1 ? catSorted[catSorted.length - 1].category : 'Wait Times';

    return { name: 'AWH', avgSentiment: Math.round(avg * 100) / 100, nps, volume: reviews.length, strength, weakness, catScores: catSent, dist };
  }, []);

  /* Competitor data (hardcoded) */
  const competitorData = useMemo(() => [
    { name: 'Curaleaf', avgSentiment: 0.24, nps: 18, volume: 14200, strength: 'Product Selection', weakness: 'Wait Times' },
    { name: 'Green Thumb Industries', avgSentiment: 0.31, nps: 26, volume: 8400, strength: 'Store Atmosphere', weakness: 'Pricing' },
    { name: 'Trulieve', avgSentiment: 0.28, nps: 22, volume: 12400, strength: 'Product Selection', weakness: 'Wait Times' },
    { name: 'Verano', avgSentiment: 0.22, nps: 15, volume: 5100, strength: 'Pricing', weakness: 'Staff Friendliness' },
    { name: 'Cresco Labs', avgSentiment: 0.33, nps: 28, volume: 6800, strength: 'Product Quality', weakness: 'Store Atmosphere' },
  ], []);

  /* All companies combined & sorted */
  const allCompanies = useMemo(() => {
    const awhRow = {
      name: 'AWH',
      avgSentiment: awhMetrics.avgSentiment,
      nps: awhMetrics.nps,
      volume: awhMetrics.volume,
      strength: awhMetrics.strength,
      weakness: awhMetrics.weakness,
    };
    return [awhRow, ...competitorData].sort((a, b) => b.avgSentiment - a.avgSentiment);
  }, [awhMetrics, competitorData]);

  const awhRank = useMemo(() => allCompanies.findIndex(c => c.name === 'AWH') + 1, [allCompanies]);

  /* Sentiment comparison bar chart data */
  const sentimentChartData = useMemo(() =>
    allCompanies.map(c => ({ name: c.name, sentiment: c.avgSentiment })),
  [allCompanies]);

  /* Radar chart: AWH vs best competitor */
  const bestCompetitorName = useMemo(() =>
    competitorData.reduce((best, c) => c.avgSentiment > best.avgSentiment ? c : best, competitorData[0]).name,
  [competitorData]);

  const radarData = useMemo(() => {
    const competitorCatScores: Record<string, Record<string, number>> = {
      'Cresco Labs': { 'Product Quality': 0.40, 'Staff Friendliness': 0.28, 'Wait Times': 0.18, 'Pricing': 0.22, 'Store Atmosphere': 0.12, 'Product Selection': 0.30 },
      'Green Thumb Industries': { 'Product Quality': 0.30, 'Staff Friendliness': 0.25, 'Wait Times': 0.20, 'Pricing': 0.18, 'Store Atmosphere': 0.38, 'Product Selection': 0.28 },
      Trulieve: { 'Product Quality': 0.30, 'Staff Friendliness': 0.22, 'Wait Times': 0.12, 'Pricing': 0.20, 'Store Atmosphere': 0.25, 'Product Selection': 0.38 },
      Curaleaf: { 'Product Quality': 0.25, 'Staff Friendliness': 0.20, 'Wait Times': 0.15, 'Pricing': 0.22, 'Store Atmosphere': 0.20, 'Product Selection': 0.30 },
      Verano: { 'Product Quality': 0.20, 'Staff Friendliness': 0.15, 'Wait Times': 0.25, 'Pricing': 0.32, 'Store Atmosphere': 0.22, 'Product Selection': 0.18 },
    };

    const bestCatScores = competitorCatScores[bestCompetitorName] || {};
    const awhCatMap: Record<string, number> = {};
    awhMetrics.catScores.forEach(c => { awhCatMap[c.category] = c.avg; });

    return CATEGORY_LIST.map(cat => ({
      category: cat,
      AWH: Math.round(((awhCatMap[cat] || 0) + 1) * 50),
      [bestCompetitorName]: Math.round(((bestCatScores[cat] || 0) + 1) * 50),
    }));
  }, [awhMetrics, bestCompetitorName]);

  /* SWOT Analysis */
  const swotData = useMemo(() => {
    const catSorted = [...(awhMetrics.catScores || [])].sort((a, b) => b.avg - a.avg);
    const topCats = catSorted.slice(0, 2).map(c => c.category);
    const weakCats = catSorted.slice(-2).map(c => c.category);

    const dist = awhMetrics.dist;
    const posRate = reviews.length > 0 ? ((dist.positive / reviews.length) * 100).toFixed(0) : '0';

    return {
      strengths: [
        `Strong performance in ${topCats[0] || 'key categories'} with above-average sentiment`,
        `${posRate}% positive review rate across all locations`,
        topCats[1] ? `Consistently positive feedback on ${topCats[1]}` : 'Growing brand loyalty among Ozone consumers',
        'Multi-state presence across 7 states provides diverse market coverage',
      ],
      weaknesses: [
        `${weakCats[0] || 'Wait Times'} receives the lowest sentiment scores`,
        weakCats[1] ? `Room for improvement in ${weakCats[1]}` : 'Inconsistent experiences across locations',
        'Michigan market saturation creates significant pricing pressure',
        'Some locations underperform relative to the brand average',
      ],
      opportunities: [
        'Ohio adult-use market launch positions AWH for significant growth',
        'Leverage top-performing locations (MD, OH) as operational models',
        'Introduce expanded loyalty programs to address pricing sentiment',
        'Grow review volume on Leafly and Weedmaps for broader consumer reach',
      ],
      threats: [
        `${bestCompetitorName} leads in overall sentiment (+${allCompanies.find(c => c.name === bestCompetitorName)?.avgSentiment.toFixed(2)})`,
        'Increasing competition in key states (IL, NJ, OH)',
        'Negative social media sentiment on Reddit spreads rapidly across state subs',
        'Michigan price compression continues to pressure MSO margins',
      ],
    };
  }, [awhMetrics, bestCompetitorName, allCompanies]);

  return (
    <div className="space-y-8">
      <PageHeader title="Competitive Landscape" subtitle="Simulated competitive data for demonstration purposes" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="AWH Rank" value={`#${awhRank} of ${allCompanies.length}`} subtitle="By overall sentiment" icon={<Award size={20} />} />
        <MetricCard label="Avg Sentiment" value={(awhMetrics.avgSentiment >= 0 ? '+' : '') + awhMetrics.avgSentiment.toFixed(2)} subtitle="AWH score" icon={<TrendingUp size={20} />} />
        <MetricCard label="NPS Score" value={awhMetrics.nps} subtitle="Net Promoter Score" icon={<Target size={20} />} />
        <MetricCard label="Reviews Analyzed" value={awhMetrics.volume.toLocaleString()} subtitle="AWH review volume" icon={<MessageCircle size={20} />} />
      </div>

      {/* Overall Comparison Table */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-navy-900">Overall Comparison</h3>
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Avg Sentiment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">NPS Score</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Review Volume</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Top Strength</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Top Weakness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allCompanies.map(company => {
                  const isAWH = company.name === 'AWH';
                  return (
                    <tr key={company.name} className={isAWH ? 'bg-[#00a47c]/5' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: COMPANY_COLORS[company.name] || '#77868e' }} />
                          <span className={`font-medium ${isAWH ? 'text-[#00a47c]' : 'text-navy-900'}`}>
                            {company.name}
                            {isAWH && (
                              <span className="ml-2 rounded-full bg-[#00a47c]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00a47c]">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-50">
                            <div className="h-full rounded-full" style={{ width: `${((company.avgSentiment + 1) / 2) * 100}%`, backgroundColor: COMPANY_COLORS[company.name] || '#77868e' }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-600">
                            {company.avgSentiment >= 0 ? '+' : ''}{company.avgSentiment.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${company.nps >= 30 ? 'text-[#00a47c]' : company.nps >= 0 ? 'text-[#e8932c]' : 'text-[#d94040]'}`}>
                          {company.nps}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{company.volume.toLocaleString()}</td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <span className="inline-flex items-center rounded-md border border-[#00a47c]/20 bg-[#00a47c]/5 px-2 py-0.5 text-xs font-medium text-[#00a47c]">
                          {company.strength}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <span className="inline-flex items-center rounded-md border border-[#d94040]/20 bg-[#d94040]/5 px-2 py-0.5 text-xs font-medium text-[#d94040]">
                          {company.weakness}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sentiment Comparison Bar Chart */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h3 className="mb-4 text-base font-semibold text-navy-900">Sentiment Comparison</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={sentimentChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e7e9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#77868e' }} angle={-25} textAnchor="end" height={60} />
              <YAxis domain={[0, 0.5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#77868e' }} tickFormatter={v => '+' + v.toFixed(1)} />
              <Tooltip content={<SentimentBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="sentiment" radius={[4, 4, 0, 0]} barSize={36} name="Avg Sentiment">
                {sentimentChartData.map((entry, idx) => (
                  <Cell key={idx} fill={COMPANY_COLORS[entry.name] || '#77868e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Radar Chart */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h3 className="mb-1 text-base font-semibold text-navy-900">Category Comparison</h3>
          <p className="mb-4 text-xs text-gray-400">AWH vs {bestCompetitorName}</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e3e7e9" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#77868e' }} />
              <PolarRadiusAxis angle={90} domain={[30, 80]} tick={{ fontSize: 10, fill: '#77868e' }} axisLine={false} />
              <Radar name="AWH" dataKey="AWH" stroke="#00a47c" fill="#00a47c" fillOpacity={0.2} strokeWidth={2} />
              <Radar name={bestCompetitorName} dataKey={bestCompetitorName} stroke={COMPANY_COLORS[bestCompetitorName] || '#6366f1'} fill={COMPANY_COLORS[bestCompetitorName] || '#6366f1'} fillOpacity={0.1} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Market Position Summary */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy-900">
          <Target size={20} className="text-dutchie-green" />
          Market Position Summary
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#00a47c]/10">
              <Award size={20} className="text-[#00a47c]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">Ranks #{awhRank} in overall sentiment</p>
              <p className="mt-0.5 text-xs text-gray-500">Among {allCompanies.length} tracked competitors in the cannabis retail space</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#00a47c]/10">
              <TrendingUp size={20} className="text-[#00a47c]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">Strongest in: {awhMetrics.strength}</p>
              <p className="mt-0.5 text-xs text-gray-500">Opportunity area: {awhMetrics.weakness}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-dutchie-500/10">
              <BarChart3 size={20} className="text-dutchie-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">{awhMetrics.volume.toLocaleString()} reviews analyzed</p>
              <p className="mt-0.5 text-xs text-gray-500">Coverage across Reddit, Google, Leafly, and Weedmaps</p>
            </div>
          </div>
        </div>
      </section>

      {/* SWOT Analysis */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-navy-900">SWOT Analysis</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-lg border border-gray-100 border-l-4 border-l-[#00a47c] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00a47c]/10">
                <Shield size={16} className="text-[#00a47c]" />
              </div>
              <h4 className="font-semibold text-[#00a47c]">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {swotData.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00a47c]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-lg border border-gray-100 border-l-4 border-l-[#d94040] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d94040]/10">
                <AlertTriangle size={16} className="text-[#d94040]" />
              </div>
              <h4 className="font-semibold text-[#d94040]">Weaknesses</h4>
            </div>
            <ul className="space-y-2">
              {swotData.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d94040]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="rounded-lg border border-gray-100 border-l-4 border-l-dutchie-500 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dutchie-500/10">
                <Lightbulb size={16} className="text-dutchie-500" />
              </div>
              <h4 className="font-semibold text-dutchie-500">Opportunities</h4>
            </div>
            <ul className="space-y-2">
              {swotData.opportunities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dutchie-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="rounded-lg border border-gray-100 border-l-4 border-l-[#e8932c] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8932c]/10">
                <TrendingDown size={16} className="text-[#e8932c]" />
              </div>
              <h4 className="font-semibold text-[#e8932c]">Threats</h4>
            </div>
            <ul className="space-y-2">
              {swotData.threats.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#e8932c]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
