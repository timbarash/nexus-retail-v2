import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight, Star, MessageCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PageHeader from '../components/PageHeader';
import ReviewCard from '../components/ReviewCard';
import DonutChart from '../components/DonutChart';
import SentimentBadge from '../components/SentimentBadge';
import { reviews as allReviews, sources as allSources, brands as allBrands } from '../data/reviews';
import { sentimentDistribution, groupBy, avgSentiment, filterReviews } from '../utils/reviewUtils';

const REVIEWS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'positive', label: 'Most Positive' },
  { value: 'negative', label: 'Most Negative' },
  { value: 'helpful', label: 'Most Helpful' },
];

const SENTIMENT_OPTIONS = ['positive', 'neutral', 'negative'] as const;

const SOURCE_COLORS: Record<string, string> = {
  Reddit: '#FF4500',
  'Google Reviews': '#4285F4',
  Leafly: '#00a47c',
  Weedmaps: '#F59E0B',
};

function ToggleChip({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'border-navy-900 bg-navy-900 text-white shadow-sm'
          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
      }`}
      style={active && color ? { backgroundColor: color, borderColor: color } : {}}
    >
      {label}
    </button>
  );
}

function ActiveFilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
      {label}
      <button onClick={onRemove} className="ml-0.5 text-gray-500 transition-colors hover:text-[#d94040]">
        <X size={12} />
      </button>
    </span>
  );
}

function SourcePieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2.5 text-sm shadow-lg">
      <p className="font-medium text-navy-900">{name}</p>
      <p className="text-gray-500">{value} reviews</p>
    </div>
  );
}

export default function ReviewExplorer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [sentimentFilters, setSentimentFilters] = useState<string[]>([]);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return filterReviews(allReviews, {
      sources: sourceFilters.length > 0 ? sourceFilters : undefined,
      sentiments: sentimentFilters.length > 0 ? sentimentFilters : undefined,
      brands: brandFilters.length > 0 ? brandFilters : undefined,
    });
  }, [sourceFilters, sentimentFilters, brandFilters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilters, sentimentFilters, brandFilters, sortBy]);

  // Toggle helpers
  function toggle(arr: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
  }

  function clearAllFilters() {
    setSourceFilters([]);
    setSentimentFilters([]);
    setBrandFilters([]);
    setSortBy('recent');
  }

  // Sorted reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...filteredReviews];
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 'positive':
        sorted.sort((a, b) => b.sentimentScore - a.sentimentScore);
        break;
      case 'negative':
        sorted.sort((a, b) => a.sentimentScore - b.sentimentScore);
        break;
      case 'helpful':
        sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
    }
    return sorted;
  }, [filteredReviews, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [sortedReviews, currentPage]);

  // Sidebar stats
  const dist = useMemo(() => sentimentDistribution(filteredReviews), [filteredReviews]);
  const avgRating = useMemo(() => {
    const rated = filteredReviews.filter(r => r.rating != null);
    if (rated.length === 0) return 0;
    return rated.reduce((acc, r) => acc + r.rating!, 0) / rated.length;
  }, [filteredReviews]);

  const sourcePieData = useMemo(() => {
    const bySource = groupBy(filteredReviews, 'source');
    return Object.entries(bySource).map(([name, arr]) => ({
      name,
      value: arr.length,
      color: SOURCE_COLORS[name] || '#77868e',
    }));
  }, [filteredReviews]);

  const brandData = useMemo(() => {
    const byBrand = groupBy(filteredReviews.filter(r => r.brand), 'brand');
    return Object.entries(byBrand)
      .map(([name, arr]) => ({ name, count: arr.length, avg: avgSentiment(arr) }))
      .sort((a, b) => b.count - a.count);
  }, [filteredReviews]);

  const hasActiveFilters = sourceFilters.length > 0 || sentimentFilters.length > 0 || brandFilters.length > 0;

  function getPageNumbers() {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Review Explorer" subtitle={`${allReviews.length.toLocaleString()} total reviews available \u00b7 Directional mock data for analysis purposes`} />

      {/* Filter Bar */}
      <div className="space-y-4 rounded-xl border border-gray-100 bg-white shadow-sm p-4 md:p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Filter size={16} className="text-gray-500" />
          Filters
        </div>

        {/* Source */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Source</p>
          <div className="flex flex-wrap gap-2">
            {allSources.map(source => (
              <ToggleChip key={source} label={source} active={sourceFilters.includes(source)} onClick={() => toggle(sourceFilters, source, setSourceFilters)} color={SOURCE_COLORS[source]} />
            ))}
          </div>
        </div>

        {/* Sentiment */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Sentiment</p>
          <div className="flex flex-wrap gap-2">
            {SENTIMENT_OPTIONS.map(s => (
              <ToggleChip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} active={sentimentFilters.includes(s)} onClick={() => toggle(sentimentFilters, s, setSentimentFilters)} />
            ))}
          </div>
        </div>

        {/* Brand */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Brand</p>
          <div className="flex flex-wrap gap-2">
            {allBrands.map(brand => (
              <ToggleChip key={brand} label={brand} active={brandFilters.includes(brand)} onClick={() => toggle(brandFilters, brand, setBrandFilters)} />
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 border-t border-gray-100 pt-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Sort by</p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-100 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dutchie-500"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="ml-auto text-xs font-medium text-[#d94040] transition-colors hover:text-red-700">
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-navy-900">{sortedReviews.length}</span> of{' '}
          <span className="font-semibold text-navy-900">{allReviews.length}</span> reviews
        </p>
        {sourceFilters.map(s => (
          <ActiveFilterTag key={`src-${s}`} label={s} onRemove={() => toggle(sourceFilters, s, setSourceFilters)} />
        ))}
        {sentimentFilters.map(s => (
          <ActiveFilterTag key={`sent-${s}`} label={s.charAt(0).toUpperCase() + s.slice(1)} onRemove={() => toggle(sentimentFilters, s, setSentimentFilters)} />
        ))}
        {brandFilters.map(b => (
          <ActiveFilterTag key={`brand-${b}`} label={b} onRemove={() => toggle(brandFilters, b, setBrandFilters)} />
        ))}
      </div>

      {/* Main Content: List + Sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Review List */}
        <div className="min-w-0 flex-1 space-y-4">
          {paginatedReviews.length > 0 ? (
            paginatedReviews.map(review => (
              <ReviewCard key={review.id} review={review} highlight={review.sentiment} />
            ))
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-12 text-center">
              <Search size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="font-medium text-gray-600">No reviews match your filters</p>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full flex-shrink-0 space-y-4 lg:w-80">
          {/* Sentiment Donut */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-600">Sentiment Breakdown</h4>
            <DonutChart data={dist} height={200} showLegend />
          </div>

          {/* Average Rating */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-600">Average Rating</h4>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-navy-900">{avgRating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                  />
                ))}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Based on {filteredReviews.filter(r => r.rating != null).length} rated reviews
            </p>
          </div>

          {/* Source Distribution */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-600">Top Sources</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={sourcePieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {sourcePieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<SourcePieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {sourcePieData.map(item => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          </div>

          {/* Top Brands */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-600">Top Brands Mentioned</h4>
            <div className="space-y-2.5">
              {brandData.map(brand => (
                <div key={brand.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-navy-900">{brand.name}</span>
                    <span className="text-xs text-gray-400">{brand.count} reviews</span>
                  </div>
                  <SentimentBadge sentiment={brand.avg >= 0.15 ? 'positive' : brand.avg >= -0.15 ? 'mixed' : 'negative'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
