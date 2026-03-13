import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, Activity, Hash } from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import WordCloud from '../components/common/WordCloud';
import ReviewCard from '../components/common/ReviewCard';
import DonutChart from '../components/charts/DonutChart';
import TrendChart from '../components/charts/TrendChart';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import {
  avgSentiment,
  groupBy,
  sentimentDistribution,
  monthlyTrend,
  getTopWords,
  calculateNPS,
  categorySentiment,
} from '../utils/helpers';

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-[#00C27C]" />}
      <div>
        <h2 className="text-lg font-semibold text-[#F0EDE8]">{title}</h2>
        {subtitle && <p className="text-sm text-[#ADA599]">{subtitle}</p>}
      </div>
    </div>
  );
}

function CategoryCard({ name, data }) {
  const total = (data.positive || 0) + (data.neutral || 0) + (data.negative || 0);
  if (total === 0) return null;

  const posPercent = ((data.positive / total) * 100).toFixed(0);
  const negPercent = ((data.negative / total) * 100).toFixed(0);
  const score = data.avg != null ? data.avg : 0;
  const normalizedScore = Math.round(((score + 1) / 2) * 100);

  let scoreColor = '#00C27C';
  if (normalizedScore < 40) scoreColor = '#E87068';
  else if (normalizedScore < 60) scoreColor = '#D4A03A';

  return (
    <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] border-l-[3px] p-4 hover:brightness-110 transition-all duration-200" style={{ borderLeftColor: scoreColor, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#F0EDE8]">{name}</h3>
        <span className="text-lg font-bold" style={{ color: scoreColor }}>{normalizedScore}</span>
      </div>
      <div className="w-full h-2 bg-[#1C1B1A] rounded-full overflow-hidden flex">
        <div
          className="h-full bg-[#00C27C] transition-all duration-500"
          style={{ width: `${posPercent}%` }}
        />
        <div
          className="h-full bg-[#D4A03A] transition-all duration-500"
          style={{ width: `${100 - posPercent - negPercent}%` }}
        />
        <div
          className="h-full bg-[#E87068] transition-all duration-500"
          style={{ width: `${negPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-[#ADA599]">
        <span className="text-[#00C27C]">{posPercent}% positive</span>
        <span className="text-[#E87068]">{negPercent}% negative</span>
      </div>
      <p className="text-xs text-[#6B6359] mt-1">{total} reviews</p>
    </div>
  );
}

export default function Overview({ reviews, allReviews, filters, onFilterChange }) {
  const totalReviews = reviews.length;
  const avgScore = useMemo(() => avgSentiment(reviews), [reviews]);
  const normalizedAvg = Math.round(((avgScore + 1) / 2) * 100);
  const npsScore = useMemo(() => calculateNPS(reviews), [reviews]);
  const distribution = useMemo(() => sentimentDistribution(reviews), [reviews]);
  const trend = useMemo(() => monthlyTrend(reviews), [reviews]);
  const topWords = useMemo(() => getTopWords(reviews), [reviews]);

  const prevPeriodCount = useMemo(() => {
    if (!allReviews || allReviews.length === 0) return totalReviews;
    const sorted = [...allReviews].sort((a, b) => new Date(a.date) - new Date(b.date));
    const midIdx = Math.floor(sorted.length / 2);
    return sorted.slice(0, midIdx).length || totalReviews;
  }, [allReviews, totalReviews]);

  const trendPercent = prevPeriodCount > 0
    ? ((totalReviews - prevPeriodCount) / prevPeriodCount) * 100
    : 0;

  const sourceBreakdown = useMemo(() => {
    const grouped = groupBy(reviews, 'source');
    return Object.entries(grouped).map(([source, sourceReviews]) => {
      const dist = sentimentDistribution(sourceReviews);
      return {
        name: source,
        positive: dist.positive,
        neutral: dist.neutral,
        negative: dist.negative,
      };
    }).sort((a, b) => (b.positive + b.neutral + b.negative) - (a.positive + a.neutral + a.negative));
  }, [reviews]);

  const mostActiveSource = useMemo(() => {
    if (sourceBreakdown.length === 0) return 'N/A';
    return sourceBreakdown[0].name;
  }, [sourceBreakdown]);

  const mostActiveSourceCount = useMemo(() => {
    if (sourceBreakdown.length === 0) return 0;
    const s = sourceBreakdown[0];
    return s.positive + s.neutral + s.negative;
  }, [sourceBreakdown]);

  const categoryInsights = useMemo(() => categorySentiment(reviews), [reviews]);

  const highlights = useMemo(() => {
    if (reviews.length === 0) return { mostPositive: null, mostNegative: null, mostRecent: null };
    const sorted = [...reviews].sort((a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0));
    const mostPositive = sorted[0];
    const mostNegative = sorted[sorted.length - 1];
    const byDate = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    const mostRecent = byDate[0];
    return { mostPositive, mostNegative, mostRecent };
  }, [reviews]);

  const dateRange = useMemo(() => {
    if (reviews.length === 0) return '';
    const dates = reviews.map((r) => new Date(r.date)).filter((d) => !isNaN(d));
    if (dates.length === 0) return '';
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    const fmt = (d) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${fmt(min)} - ${fmt(max)}`;
  }, [reviews]);

  let avgColor = 'text-[#00C27C]';
  if (normalizedAvg < 40) avgColor = 'text-[#E87068]';
  else if (normalizedAvg < 60) avgColor = 'text-[#D4A03A]';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Section 1: Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F0EDE8]">Dashboard Overview</h1>
        <p className="text-sm text-[#ADA599] mt-1">
          {totalReviews.toLocaleString()} reviews analyzed
          {dateRange && <span className="mx-1.5">|</span>}
          {dateRange}
        </p>
      </div>

      {/* Section 2: Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        <MetricCard
          title="Total Reviews"
          value={totalReviews.toLocaleString()}
          icon={MessageSquare}
          trend={trendPercent}
          trendLabel="vs prev period"
          color="dutchie"
          borderAccent
        />
        <MetricCard
          title="Avg Sentiment Score"
          value={<span className={avgColor}>{normalizedAvg}</span>}
          subtitle="out of 100"
          icon={Activity}
          color="blue"
          borderAccent
        />
        <MetricCard
          title="NPS Score"
          value={npsScore > 0 ? `+${npsScore}` : npsScore}
          subtitle="-100 to +100 scale"
          icon={TrendingUp}
          color="purple"
          borderAccent
        />
        <MetricCard
          title="Most Active Source"
          value={mostActiveSource}
          subtitle={`${mostActiveSourceCount.toLocaleString()} reviews`}
          icon={Hash}
          color="amber"
          borderAccent
        />
      </div>

      {/* Section 3: Sentiment Distribution + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-grid">
        <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5 hover:brightness-110 transition-all" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <SectionHeader title="Sentiment Distribution" icon={BarChart3} />
          <DonutChart data={distribution} height={260} showLegend />
        </div>
        <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5 hover:brightness-110 transition-all" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <SectionHeader
            title="Sentiment Trend"
            subtitle="Monthly average sentiment score"
            icon={TrendingUp}
          />
          <TrendChart data={trend} height={280} />
        </div>
      </div>

      {/* Section 4: Source Breakdown */}
      <div className="bg-[#1C1B1A] rounded-xl shadow-sm border border-[#38332B] p-5">
        <SectionHeader
          title="Source Breakdown"
          subtitle="Sentiment distribution by review source"
          icon={Users}
        />
        <HorizontalBarChart data={sourceBreakdown} height={Math.max(200, sourceBreakdown.length * 60)} />
      </div>

      {/* Section 5: Category Insights */}
      <div>
        <SectionHeader
          title="Category Insights"
          subtitle="Sentiment analysis across key categories"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
          {categoryInsights.map((data) => (
            <CategoryCard key={data.category} name={data.category} data={data} />
          ))}
        </div>
      </div>

      {/* Section 6: Word Cloud */}
      <div className="bg-[#1C1B1A] rounded-xl shadow-sm border border-[#38332B] p-5">
        <SectionHeader
          title="Common Themes"
          subtitle="Frequently mentioned words and phrases"
        />
        <WordCloud words={topWords} maxWords={40} />
      </div>

      {/* Section 7: Review Highlights */}
      <div>
        <SectionHeader title="Review Highlights" subtitle="Notable reviews from your data" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {highlights.mostPositive && (
            <div>
              <p className="text-xs font-semibold text-[#00C27C] uppercase tracking-wider mb-2">
                Most Positive Review
              </p>
              <ReviewCard review={highlights.mostPositive} highlight="positive" />
            </div>
          )}
          {highlights.mostNegative && (
            <div>
              <p className="text-xs font-semibold text-[#E87068] uppercase tracking-wider mb-2">
                Most Negative Review
              </p>
              <ReviewCard review={highlights.mostNegative} highlight="negative" />
            </div>
          )}
          {highlights.mostRecent && (
            <div>
              <p className="text-xs font-semibold text-[#64A8E0] uppercase tracking-wider mb-2">
                Most Recent Review
              </p>
              <ReviewCard review={highlights.mostRecent} highlight="recent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
