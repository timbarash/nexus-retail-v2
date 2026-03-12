import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight, Star, MessageCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ReviewCard from '../components/common/ReviewCard';
import DonutChart from '../components/charts/DonutChart';
import SentimentBadge from '../components/common/SentimentBadge';
import {
  sentimentDistribution,
  groupBy,
  avgSentiment,
} from '../utils/helpers';
import { sources as allSources, brands as allBrands } from '../data/mockData';

const REVIEWS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'positive', label: 'Most Positive' },
  { value: 'negative', label: 'Most Negative' },
  { value: 'helpful', label: 'Most Helpful' },
];

const SENTIMENT_OPTIONS = ['positive', 'neutral', 'negative'];

const SOURCE_COLORS = {
  Reddit: '#FF4500',
  'Google Reviews': '#4285F4',
  Leafly: '#00a35e',
  Weedmaps: '#F59E0B',
};

/* ────────────────────────────────────────────
   Chip components
   ──────────────────────────────────────────── */
function ToggleChip({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
        active
          ? 'bg-[#00a35e] text-white border-[#00a35e] shadow-sm'
          : 'bg-white text-text-secondary border-surface-border hover:border-gray-300 hover:bg-surface-hover'
      }`}
      style={active && color ? { backgroundColor: color, borderColor: color } : {}}
    >
      {label}
    </button>
  );
}

function ActiveFilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-text-secondary border border-surface-border">
      {label}
      <button onClick={onRemove} className="hover:text-[#ef4444] transition-colors ml-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/* ────────────────────────────────────────────
   Source Pie Tooltip
   ──────────────────────────────────────────── */
function SourcePieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white rounded-lg shadow-lg border border-surface-border p-2.5 text-sm">
      <p className="font-medium text-text-primary">{name}</p>
      <p className="text-text-secondary">{value} reviews</p>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function ReviewExplorer({ reviews, filters, onFilterChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [localSourceFilters, setLocalSourceFilters] = useState(filters.sources || []);
  const [localSentimentFilters, setLocalSentimentFilters] = useState(filters.sentiments || []);
  const [localBrandFilters, setLocalBrandFilters] = useState(filters.brands || []);

  /* Reset page when filters change */
  useEffect(() => {
    setCurrentPage(1);
  }, [localSourceFilters, localSentimentFilters, localBrandFilters, sortBy, reviews]);

  /* Sync local filters back to parent */
  useEffect(() => {
    onFilterChange({
      ...filters,
      sources: localSourceFilters,
      sentiments: localSentimentFilters,
      brands: localBrandFilters,
    });
  }, [localSourceFilters, localSentimentFilters, localBrandFilters]);

  /* ── Toggle filter helpers ── */
  function toggleSource(source) {
    setLocalSourceFilters((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  }

  function toggleSentiment(sentiment) {
    setLocalSentimentFilters((prev) =>
      prev.includes(sentiment) ? prev.filter((s) => s !== sentiment) : [...prev, sentiment]
    );
  }

  function toggleBrand(brand) {
    setLocalBrandFilters((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  function clearAllFilters() {
    setLocalSourceFilters([]);
    setLocalSentimentFilters([]);
    setLocalBrandFilters([]);
    setSortBy('recent');
  }

  /* ── Sorted reviews ── */
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
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
      default:
        break;
    }
    return sorted;
  }, [reviews, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [sortedReviews, currentPage]);

  /* ── Sidebar stats ── */
  const dist = useMemo(() => sentimentDistribution(reviews), [reviews]);
  const avgRating = useMemo(() => {
    const rated = reviews.filter((r) => r.rating != null);
    if (rated.length === 0) return 0;
    return rated.reduce((acc, r) => acc + r.rating, 0) / rated.length;
  }, [reviews]);

  const sourcePieData = useMemo(() => {
    const bySource = groupBy(reviews, 'source');
    return Object.entries(bySource).map(([name, arr]) => ({
      name,
      value: arr.length,
      color: SOURCE_COLORS[name] || '#6b7280',
    }));
  }, [reviews]);

  const brandData = useMemo(() => {
    const byBrand = groupBy(reviews.filter((r) => r.brand), 'brand');
    return Object.entries(byBrand)
      .map(([name, arr]) => ({ name, count: arr.length, avg: avgSentiment(arr) }))
      .sort((a, b) => b.count - a.count);
  }, [reviews]);

  /* ── Active filter tags ── */
  const hasActiveFilters =
    localSourceFilters.length > 0 ||
    localSentimentFilters.length > 0 ||
    localBrandFilters.length > 0;

  /* ── Page numbers for pagination ── */
  function getPageNumbers() {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  /* ════════════════════════════════════════
     RENDER
     ════════════════════════════════════════ */
  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#00a35e]" />
            Review Explorer
          </h2>
          <p className="text-text-secondary mt-1">
            {reviews.length.toLocaleString()} total reviews available
          </p>
        </div>
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-border p-4 md:p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Filter className="w-4 h-4 text-text-muted" />
          Filters
        </div>

        {/* Source filters */}
        <div>
          <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">Source</p>
          <div className="flex flex-wrap gap-2">
            {allSources.map((source) => (
              <ToggleChip
                key={source}
                label={source}
                active={localSourceFilters.includes(source)}
                onClick={() => toggleSource(source)}
                color={SOURCE_COLORS[source]}
              />
            ))}
          </div>
        </div>

        {/* Sentiment filters */}
        <div>
          <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">Sentiment</p>
          <div className="flex flex-wrap gap-2">
            {SENTIMENT_OPTIONS.map((s) => (
              <ToggleChip
                key={s}
                label={s.charAt(0).toUpperCase() + s.slice(1)}
                active={localSentimentFilters.includes(s)}
                onClick={() => toggleSentiment(s)}
              />
            ))}
          </div>
        </div>

        {/* Brand filters */}
        <div>
          <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">Brand</p>
          <div className="flex flex-wrap gap-2">
            {allBrands.map((brand) => (
              <ToggleChip
                key={brand}
                label={brand}
                active={localBrandFilters.includes(brand)}
                onClick={() => toggleBrand(brand)}
              />
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sort by</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-surface-border rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-[#00a35e] focus:border-transparent bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto text-xs text-[#ef4444] hover:text-[#ef4444] font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* ─── Results Summary ─── */}
      <div className="flex items-center flex-wrap gap-2">
        <p className="text-sm text-text-secondary">
          Showing <span className="font-semibold text-text-primary">{sortedReviews.length}</span> of{' '}
          <span className="font-semibold text-text-primary">{reviews.length}</span> reviews
        </p>
        {localSourceFilters.map((s) => (
          <ActiveFilterTag key={`source-${s}`} label={s} onRemove={() => toggleSource(s)} />
        ))}
        {localSentimentFilters.map((s) => (
          <ActiveFilterTag
            key={`sent-${s}`}
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            onRemove={() => toggleSentiment(s)}
          />
        ))}
        {localBrandFilters.map((b) => (
          <ActiveFilterTag key={`brand-${b}`} label={b} onRemove={() => toggleBrand(b)} />
        ))}
      </div>

      {/* ─── Main Content: List + Sidebar ─── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Review List */}
        <div className="flex-1 min-w-0 space-y-4">
          {paginatedReviews.length > 0 ? (
            paginatedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} highlight={review.sentiment} />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-surface-border p-12 text-center">
              <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No reviews match your filters</p>
              <p className="text-sm text-text-muted mt-1">Try adjusting your filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-surface-border text-text-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#00a35e] text-white shadow-sm'
                      : 'text-text-secondary hover:bg-surface-hover'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-surface-border text-text-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
          {/* Sentiment Donut */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-border p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Sentiment Breakdown</h4>
            <DonutChart data={dist} height={200} showLegend={true} />
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-border p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Average Rating</h4>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-text-primary">{avgRating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(avgRating)
                        ? 'fill-[#d97706] text-[#d97706]'
                        : 'fill-gray-200 text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Based on {reviews.filter((r) => r.rating != null).length} rated reviews
            </p>
          </div>

          {/* Source Distribution Pie */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-border p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Top Sources</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={sourcePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {sourcePieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<SourcePieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {sourcePieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          </div>

          {/* Top Brands */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-border p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Top Brands Mentioned</h4>
            <div className="space-y-2.5">
              {brandData.map((brand) => (
                <div key={brand.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{brand.name}</span>
                    <span className="text-xs text-text-muted">{brand.count} reviews</span>
                  </div>
                  <SentimentBadge
                    sentiment={brand.avg >= 0.15 ? 'positive' : brand.avg >= -0.15 ? 'neutral' : 'negative'}
                    score={brand.avg}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
