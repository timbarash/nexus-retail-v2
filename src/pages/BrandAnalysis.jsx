import React, { useMemo } from 'react';
import { Tag, BarChart3, TrendingUp, Star } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import SentimentBadge from '../components/common/SentimentBadge';
import ReviewCard from '../components/common/ReviewCard';
import {
  avgSentiment,
  sentimentDistribution,
  monthlyTrend,
  sentimentLabel,
} from '../utils/helpers';

const BRAND_COLORS = {
  'Ozone Reserve': '#8b5cf6',
  'Common Goods': '#6ABA48',
  'Tunnel Vision': '#00a35e',
  'Simply Herb': '#3b82f6',
  'Ozone': '#f59e0b',
};

const BRANDS = ['Ozone', 'Ozone Reserve', 'Simply Herb', 'Common Goods', 'Tunnel Vision'];

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-[#00a35e]" />}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
      </div>
    </div>
  );
}

function BrandOverviewCard({ brand, reviews: brandReviews }) {
  const avg = avgSentiment(brandReviews);
  const normalizedAvg = Math.round(((avg + 1) / 2) * 100);
  const dist = sentimentDistribution(brandReviews);
  const total = dist.positive + dist.neutral + dist.negative;
  const sentiment = sentimentLabel(avg);

  const catCounts = {};
  brandReviews.forEach((r) => {
    (r.categories || []).forEach((c) => {
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
  });
  const topCategories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  let scoreColor = 'text-[#00a35e]';
  let barColor = 'bg-[#00a35e]';
  if (normalizedAvg < 40) {
    scoreColor = 'text-[#ef4444]';
    barColor = 'bg-[#ef4444]';
  } else if (normalizedAvg < 60) {
    scoreColor = 'text-[#d97706]';
    barColor = 'bg-[#d97706]';
  }

  const brandColor = BRAND_COLORS[brand] || '#6b7280';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-border p-5 hover:border-gray-300 transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: brandColor }}
            />
            {brand}
          </h3>
          <p className="text-sm text-text-secondary mt-0.5">
            {total} review{total !== 1 ? 's' : ''}
          </p>
        </div>
        <SentimentBadge sentiment={sentiment} size="sm" />
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">Sentiment Score</span>
          <span className={`text-sm font-bold ${scoreColor}`}>{normalizedAvg}/100</span>
        </div>
        <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${normalizedAvg}%` }}
          />
        </div>
      </div>

      {total > 0 && (
        <div className="flex items-center gap-1 mb-3">
          <div
            className="h-1.5 rounded-full bg-[#00a35e]"
            style={{ width: `${(dist.positive / total) * 100}%` }}
          />
          <div
            className="h-1.5 rounded-full bg-[#d97706]"
            style={{ width: `${(dist.neutral / total) * 100}%` }}
          />
          <div
            className="h-1.5 rounded-full bg-[#ef4444]"
            style={{ width: `${(dist.negative / total) * 100}%` }}
          />
        </div>
      )}
      <div className="flex justify-between text-xs text-text-secondary mb-3">
        <span className="text-[#00a35e]">{dist.positive} pos</span>
        <span className="text-[#d97706]">{dist.neutral} neu</span>
        <span className="text-[#ef4444]">{dist.negative} neg</span>
      </div>

      {topCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {topCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-bg text-text-secondary text-xs border border-surface-border"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ComparisonTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-surface-border p-3 text-sm">
      <p className="font-semibold text-text-primary mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-text-secondary">{p.name}</span>
            </span>
            <span className="font-medium" style={{ color: p.color }}>
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-surface-border p-3 text-sm">
      <p className="font-semibold text-text-primary mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload
          .filter((p) => p.value != null)
          .map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-text-secondary">{p.name}</span>
              </span>
              <span className="font-medium" style={{ color: p.color }}>
                {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function BrandAnalysis({ reviews }) {
  const brandData = useMemo(() => {
    const result = {};
    BRANDS.forEach((brand) => {
      result[brand] = reviews.filter(
        (r) => r.brand && r.brand.toLowerCase() === brand.toLowerCase()
      );
    });
    return result;
  }, [reviews]);

  const comparisonData = useMemo(() => {
    return BRANDS.map((brand) => {
      const brandReviews = brandData[brand] || [];
      const dist = sentimentDistribution(brandReviews);
      return {
        name: brand,
        positive: dist.positive,
        neutral: dist.neutral,
        negative: dist.negative,
      };
    });
  }, [brandData]);

  const trendData = useMemo(() => {
    const monthSet = new Set();
    const brandTrends = {};

    BRANDS.forEach((brand) => {
      const brandReviews = brandData[brand] || [];
      const trend = monthlyTrend(brandReviews);
      brandTrends[brand] = {};
      trend.forEach((t) => {
        monthSet.add(t.month);
        brandTrends[brand][t.month] = t.avg;
      });
    });

    const months = [...monthSet].sort();
    return months.map((month) => {
      const point = { month };
      BRANDS.forEach((brand) => {
        point[brand] = brandTrends[brand][month] ?? null;
      });
      return point;
    });
  }, [brandData]);

  const brandHighlights = useMemo(() => {
    const result = {};
    BRANDS.forEach((brand) => {
      const brandReviews = brandData[brand] || [];
      if (brandReviews.length === 0) {
        result[brand] = { best: null, worst: null };
        return;
      }
      const sorted = [...brandReviews].sort(
        (a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0)
      );
      result[brand] = {
        best: sorted[0],
        worst: sorted[sorted.length - 1],
      };
    });
    return result;
  }, [brandData]);

  const activeBrands = BRANDS.filter(
    (b) => brandData[b] && brandData[b].length > 0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Section 1: Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Brand Analysis</h1>
        <p className="text-sm text-text-secondary mt-1">
          Compare sentiment and performance across Ascend product brands
        </p>
      </div>

      {/* Section 2: Brand Overview Cards */}
      <div>
        <SectionHeader
          title="Brand Overview"
          subtitle="Key metrics for each brand"
          icon={Tag}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {BRANDS.map((brand) => (
            <BrandOverviewCard
              key={brand}
              brand={brand}
              reviews={brandData[brand] || []}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Brand Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-border p-5">
        <SectionHeader
          title="Brand Comparison"
          subtitle="Sentiment distribution across all brands"
          icon={BarChart3}
        />
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={comparisonData}
            margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#F0F6FC', fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-text-secondary capitalize">{value}</span>
              )}
            />
            <Bar dataKey="positive" fill="#00a35e" radius={[4, 4, 0, 0]} barSize={24} name="Positive" />
            <Bar dataKey="neutral" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} name="Neutral" />
            <Bar dataKey="negative" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} name="Negative" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section 4: Brand Trend Lines */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-border p-5">
        <SectionHeader
          title="Brand Sentiment Trends"
          subtitle="Monthly sentiment scores by brand"
          icon={TrendingUp}
        />
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[-1, 1]}
              />
              <Tooltip content={<TrendTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-text-secondary">{value}</span>
                )}
              />
              {activeBrands.map((brand) => (
                <Line
                  key={brand}
                  type="monotone"
                  dataKey={brand}
                  stroke={BRAND_COLORS[brand]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: BRAND_COLORS[brand], strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: '#161B22', strokeWidth: 2 }}
                  connectNulls
                  name={brand}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-48 text-text-muted text-sm">
            No trend data available
          </div>
        )}
      </div>

      {/* Section 5: Top Reviews per Brand */}
      <div>
        <SectionHeader
          title="Top Reviews by Brand"
          subtitle="Best and worst reviews for each brand"
          icon={Star}
        />
        <div className="space-y-6">
          {activeBrands.map((brand) => {
            const highlights = brandHighlights[brand] || {};
            const { best, worst } = highlights;
            if (!best && !worst) return null;

            return (
              <div key={brand}>
                <h3 className="text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: BRAND_COLORS[brand] }}
                  />
                  {brand}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {best && (
                    <div>
                      <p className="text-xs font-semibold text-[#00a35e] uppercase tracking-wider mb-2">
                        Best Review
                      </p>
                      <ReviewCard review={best} highlight="positive" />
                    </div>
                  )}
                  {worst && worst.id !== best?.id && (
                    <div>
                      <p className="text-xs font-semibold text-[#ef4444] uppercase tracking-wider mb-2">
                        Worst Review
                      </p>
                      <ReviewCard review={worst} highlight="negative" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
