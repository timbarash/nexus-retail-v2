import React, { useMemo } from 'react';
import { Trophy, Shield, AlertTriangle, Lightbulb, Target, TrendingUp, TrendingDown, Award, MessageCircle, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import {
  avgSentiment,
  calculateNPS,
  categorySentiment,
  sentimentDistribution,
} from '../utils/helpers';

/* ────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────── */
const COMPANY_COLORS = {
  Ascend: '#00a35e',
  'Housing Works': '#f97316',
  Sunnyside: '#f59e0b',
  Rise: '#ef4444',
  'The Cannabist': '#8b5cf6',
  'The Botanist': '#0ea5e9',
};

const CATEGORY_LIST = [
  'Product Quality',
  'Staff Friendliness',
  'Wait Times',
  'Pricing',
  'Store Atmosphere',
  'Product Selection',
];

/* ────────────────────────────────────────────
   Custom chart tooltips
   ──────────────────────────────────────────── */
function SentimentBarTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-surface-border p-3 text-sm">
      <p className="font-semibold text-text-primary mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-text-secondary">{item.name}</span>
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

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function CompetitiveInsights({ reviews }) {
  /* ── Ascend real metrics ── */
  const ascendMetrics = useMemo(() => {
    const avg = avgSentiment(reviews);
    const nps = calculateNPS(reviews);
    const catSent = categorySentiment(reviews);
    const dist = sentimentDistribution(reviews);

    // Determine strength and weakness
    const catSorted = [...catSent].sort((a, b) => b.avg - a.avg);
    const strength = catSorted.length > 0 ? catSorted[0].category : 'Product Quality';
    const weakness = catSorted.length > 1 ? catSorted[catSorted.length - 1].category : 'Wait Times';

    return {
      name: 'Ascend',
      avgSentiment: Math.round(avg * 100) / 100,
      nps,
      volume: reviews.length,
      strength,
      weakness,
      catScores: catSent,
      dist,
    };
  }, [reviews]);

  /* ── Competitor data (hardcoded) ── */
  const competitorData = useMemo(() => [
    { name: 'Housing Works', avgSentiment: 0.28, nps: 22, volume: 12400, strength: 'Product Selection', weakness: 'Wait Times' },
    { name: 'Sunnyside', avgSentiment: 0.35, nps: 31, volume: 4200, strength: 'Store Atmosphere', weakness: 'Pricing' },
    { name: 'Rise', avgSentiment: 0.31, nps: 26, volume: 3800, strength: 'Staff Friendliness', weakness: 'Product Selection' },
    { name: 'The Cannabist', avgSentiment: 0.22, nps: 15, volume: 5100, strength: 'Pricing', weakness: 'Staff Friendliness' },
    { name: 'The Botanist', avgSentiment: 0.38, nps: 35, volume: 2900, strength: 'Product Quality', weakness: 'Store Atmosphere' },
  ], []);

  /* ── All companies combined ── */
  const allCompanies = useMemo(() => {
    const ascendRow = {
      name: 'Ascend',
      avgSentiment: ascendMetrics.avgSentiment,
      nps: ascendMetrics.nps,
      volume: ascendMetrics.volume,
      strength: ascendMetrics.strength,
      weakness: ascendMetrics.weakness,
    };
    return [ascendRow, ...competitorData].sort((a, b) => b.avgSentiment - a.avgSentiment);
  }, [ascendMetrics, competitorData]);

  /* ── Ascend rank ── */
  const ascendRank = useMemo(() => {
    return allCompanies.findIndex((c) => c.name === 'Ascend') + 1;
  }, [allCompanies]);

  /* ── Sentiment comparison chart data ── */
  const sentimentChartData = useMemo(() => {
    return allCompanies.map((c) => ({
      name: c.name,
      sentiment: c.avgSentiment,
    }));
  }, [allCompanies]);

  /* ── Radar chart data: Ascend vs best competitor ── */
  const radarData = useMemo(() => {
    // Best competitor (highest avg sentiment, not Ascend)
    const bestCompetitor = competitorData.reduce((best, c) =>
      c.avgSentiment > best.avgSentiment ? c : best
    , competitorData[0]);

    // Simulated category scores for competitor
    const competitorCatScores = {
      'The Botanist': { 'Product Quality': 0.45, 'Staff Friendliness': 0.30, 'Wait Times': 0.20, 'Pricing': 0.25, 'Store Atmosphere': 0.10, 'Product Selection': 0.35 },
      Sunnyside: { 'Product Quality': 0.30, 'Staff Friendliness': 0.28, 'Wait Times': 0.22, 'Pricing': 0.15, 'Store Atmosphere': 0.40, 'Product Selection': 0.25 },
      Rise: { 'Product Quality': 0.25, 'Staff Friendliness': 0.40, 'Wait Times': 0.20, 'Pricing': 0.28, 'Store Atmosphere': 0.30, 'Product Selection': 0.18 },
      'Housing Works': { 'Product Quality': 0.30, 'Staff Friendliness': 0.22, 'Wait Times': 0.12, 'Pricing': 0.20, 'Store Atmosphere': 0.25, 'Product Selection': 0.38 },
      'The Cannabist': { 'Product Quality': 0.20, 'Staff Friendliness': 0.15, 'Wait Times': 0.25, 'Pricing': 0.35, 'Store Atmosphere': 0.22, 'Product Selection': 0.20 },
    };

    const bestCatScores = competitorCatScores[bestCompetitor.name] || {};

    // Build radar data with Ascend actuals
    const ascendCatMap = {};
    ascendMetrics.catScores.forEach((c) => {
      ascendCatMap[c.category] = c.avg;
    });

    return CATEGORY_LIST.map((cat) => ({
      category: cat,
      Ascend: Math.round(((ascendCatMap[cat] || 0) + 1) * 50), // normalize -1..1 to 0..100
      [bestCompetitor.name]: Math.round(((bestCatScores[cat] || 0) + 1) * 50),
    }));
  }, [ascendMetrics, competitorData]);

  const bestCompetitorName = useMemo(() => {
    return competitorData.reduce((best, c) =>
      c.avgSentiment > best.avgSentiment ? c : best
    , competitorData[0]).name;
  }, [competitorData]);

  /* ── SWOT Analysis ── */
  const swotData = useMemo(() => {
    const catSorted = [...(ascendMetrics.catScores || [])].sort((a, b) => b.avg - a.avg);
    const topCats = catSorted.slice(0, 2).map((c) => c.category);
    const weakCats = catSorted.slice(-2).map((c) => c.category);

    const dist = ascendMetrics.dist;
    const posRate = reviews.length > 0 ? ((dist.positive / reviews.length) * 100).toFixed(0) : 0;

    return {
      strengths: [
        `Strong performance in ${topCats[0] || 'key categories'} with above-average sentiment`,
        `${posRate}% positive review rate across all locations`,
        topCats[1] ? `Consistently positive feedback on ${topCats[1]}` : 'Growing brand loyalty among repeat customers',
        'Multi-state presence provides diverse market coverage',
      ],
      weaknesses: [
        `${weakCats[0] || 'Wait Times'} receives the lowest sentiment scores`,
        weakCats[1] ? `Room for improvement in ${weakCats[1]}` : 'Inconsistent experiences across locations',
        'Negative reviews often cite pricing concerns',
        'Some locations underperform relative to the brand average',
      ],
      opportunities: [
        'Expand digital ordering to reduce wait time complaints',
        'Leverage top-performing locations as training models',
        'Introduce loyalty programs to address pricing sentiment',
        'Grow review volume on Leafly and Weedmaps for broader reach',
      ],
      threats: [
        `${bestCompetitorName} leads in overall sentiment (${allCompanies.find(c => c.name === bestCompetitorName)?.avgSentiment.toFixed(2)})`,
        'Increasing competition in key markets (Manhattan, Brooklyn, Queens)',
        'Negative social media reviews can spread rapidly on Reddit',
        'Market consolidation may reduce competitive differentiation',
      ],
    };
  }, [ascendMetrics, competitorData, bestCompetitorName, allCompanies, reviews]);

  /* ════════════════════════════════════════
     RENDER
     ════════════════════════════════════════ */
  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#00a35e]" />
          Competitive Landscape
        </h2>
        <p className="text-text-secondary mt-1 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#d97706]" />
          Simulated competitive data for demonstration purposes
        </p>
      </div>

      {/* ─── Summary Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ascend Rank"
          value={`#${ascendRank} of ${allCompanies.length}`}
          subtitle="By overall sentiment"
          icon={Award}
          color="dutchie"
        />
        <MetricCard
          title="Avg Sentiment"
          value={(ascendMetrics.avgSentiment >= 0 ? '+' : '') + ascendMetrics.avgSentiment.toFixed(2)}
          subtitle="Ascend score"
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="NPS Score"
          value={ascendMetrics.nps}
          subtitle="Net Promoter Score"
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Reviews Analyzed"
          value={ascendMetrics.volume.toLocaleString()}
          subtitle="Ascend review volume"
          icon={MessageCircle}
          color="amber"
        />
      </div>

      {/* ─── Overall Comparison Table ─── */}
      <section>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Overall Comparison</h3>
        <div className="bg-white rounded-xl shadow-sm border border-surface-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-bg border-b border-surface-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Avg Sentiment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">NPS Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Review Volume</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">Top Strength</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">Top Weakness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {allCompanies.map((company, idx) => {
                  const isAscend = company.name === 'Ascend';
                  return (
                    <tr
                      key={company.name}
                      className={isAscend ? 'bg-[rgba(0,163,94,0.06)]' : 'hover:bg-surface-hover'}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COMPANY_COLORS[company.name] || '#6b7280' }}
                          />
                          <span className={`font-medium ${isAscend ? 'text-[#00a35e]' : 'text-text-primary'}`}>
                            {company.name}
                            {isAscend && (
                              <span className="ml-2 text-[10px] font-semibold bg-[rgba(0,163,94,0.1)] text-[#00a35e] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${((company.avgSentiment + 1) / 2) * 100}%`,
                                backgroundColor: COMPANY_COLORS[company.name] || '#6b7280',
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-text-primary">
                            {company.avgSentiment >= 0 ? '+' : ''}{company.avgSentiment.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${company.nps >= 30 ? 'text-[#00a35e]' : company.nps >= 0 ? 'text-[#d97706]' : 'text-[#ef4444]'}`}>
                          {company.nps}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                        {company.volume.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[rgba(0,163,94,0.12)] text-[#00a35e] text-xs font-medium border border-[rgba(0,163,94,0.2)]">
                          {company.strength}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[rgba(239,68,68,0.12)] text-[#ef4444] text-xs font-medium border border-[rgba(239,68,68,0.2)]">
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

      {/* ─── Charts Row: Sentiment Comparison + Radar ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Comparison Bar Chart */}
        <section className="bg-white rounded-xl shadow-sm border border-surface-border p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Sentiment Comparison</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={sentimentChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={[0, 0.5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(v) => '+' + v.toFixed(1)}
              />
              <Tooltip content={<SentimentBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="sentiment" radius={[4, 4, 0, 0]} barSize={36} name="Avg Sentiment">
                {sentimentChartData.map((entry, idx) => (
                  <Cell key={idx} fill={COMPANY_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Radar Chart */}
        <section className="bg-white rounded-xl shadow-sm border border-surface-border p-6">
          <h3 className="text-base font-semibold text-text-primary mb-1">Category Comparison</h3>
          <p className="text-xs text-text-muted mb-4">Ascend vs {bestCompetitorName}</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[30, 80]}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
              />
              <Radar
                name="Ascend"
                dataKey="Ascend"
                stroke="#00a35e"
                fill="#00a35e"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name={bestCompetitorName}
                dataKey={bestCompetitorName}
                stroke={COMPANY_COLORS[bestCompetitorName] || '#6366f1'}
                fill={COMPANY_COLORS[bestCompetitorName] || '#6366f1'}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* ─── Market Position Summary ─── */}
      <section className="bg-white rounded-xl shadow-sm border border-surface-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#00a35e]" />
          Market Position Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[rgba(0,163,94,0.1)] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#00a35e]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Ranks #{ascendRank} in overall sentiment
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Among {allCompanies.length} tracked competitors in the cannabis retail space
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[rgba(0,163,94,0.12)] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#00a35e]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Strongest in: {ascendMetrics.strength}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Opportunity area: {ascendMetrics.weakness}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[rgba(59,130,246,0.12)] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {ascendMetrics.volume.toLocaleString()} reviews analyzed
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Comprehensive coverage across Reddit, Google, Leafly, and Weedmaps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SWOT Analysis ─── */}
      <section>
        <h3 className="text-lg font-semibold text-text-primary mb-4">SWOT Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-[#00a35e] border border-surface-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(0,163,94,0.12)] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#00a35e]" />
              </div>
              <h4 className="font-semibold text-[#00a35e]">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {swotData.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a35e] flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-[#ef4444] border border-surface-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.12)] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              </div>
              <h4 className="font-semibold text-[#ef4444]">Weaknesses</h4>
            </div>
            <ul className="space-y-2">
              {swotData.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-[#3b82f6] border border-surface-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(59,130,246,0.12)] flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <h4 className="font-semibold text-[#3b82f6]">Opportunities</h4>
            </div>
            <ul className="space-y-2">
              {swotData.opportunities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-[#FFA657] border border-surface-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(255,166,87,0.12)] flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-[#FFA657]" />
              </div>
              <h4 className="font-semibold text-[#FFA657]">Threats</h4>
            </div>
            <ul className="space-y-2">
              {swotData.threats.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFA657] flex-shrink-0 mt-1.5" />
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
