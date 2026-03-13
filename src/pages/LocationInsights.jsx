import React, { useState, useMemo } from 'react';
import { MapPin, ArrowUpDown, ChevronDown, ChevronUp, DollarSign, ShoppingCart, Receipt, Percent, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ReviewCard from '../components/common/ReviewCard';
import TrendChart from '../components/charts/TrendChart';
import {
  avgSentiment,
  groupBy,
  sentimentDistribution,
  monthlyTrend,
  categorySentiment,
  sentimentColor,
} from '../utils/helpers';
import { locations } from '../data/mockData';
import { useStores } from '../contexts/StoreContext';
import { useDateRange } from '../contexts/DateRangeContext';

// ---------------------------------------------------------------------------
// Per-store metrics — deterministically generated (same seed as NexusHome)
// State-based parameters from real MSO dispensary data (2024 earnings)
// ---------------------------------------------------------------------------

function _seedRng(seed) {
  let s = seed | 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const STATE_PARAMS = {
  IL: { revLow: 350, revMid: 525, revHigh: 750, basketLow: 85, basketHigh: 110, gmLow: 48, gmHigh: 54 },
  NJ: { revLow: 400, revMid: 540, revHigh: 700, basketLow: 80, basketHigh: 100, gmLow: 50, gmHigh: 55 },
  MA: { revLow: 250, revMid: 375, revHigh: 500, basketLow: 70, basketHigh: 90,  gmLow: 46, gmHigh: 52 },
  OH: { revLow: 275, revMid: 375, revHigh: 475, basketLow: 75, basketHigh: 90,  gmLow: 48, gmHigh: 53 },
  MD: { revLow: 250, revMid: 335, revHigh: 425, basketLow: 70, basketHigh: 85,  gmLow: 47, gmHigh: 52 },
  MI: { revLow: 100, revMid: 225, revHigh: 350, basketLow: 55, basketHigh: 75,  gmLow: 40, gmHigh: 47 },
  PA: { revLow: 100, revMid: 225, revHigh: 350, basketLow: 80, basketHigh: 95,  gmLow: 45, gmHigh: 50 },
};

const STORE_METRICS = locations.map((loc, i) => {
  const rng = _seedRng(i * 7919 + 31);
  const isOutlet = loc.name.includes('Outlet');
  const sp = STATE_PARAMS[loc.state] || STATE_PARAMS.MI;
  const tierShift = isOutlet ? -0.30 : (rng() > 0.6 ? 0.25 : 0);
  const baseRev = sp.revMid + (rng() - 0.5) * (sp.revHigh - sp.revLow) * 0.6;
  const revenue = Math.round(Math.max(sp.revLow * 0.8, baseRev * (1 + tierShift)) * 10) / 10;
  const avgBasket = Math.round((sp.basketLow + rng() * (sp.basketHigh - sp.basketLow) + (isOutlet ? -3 : 0)) * 100) / 100;
  const transactions = Math.round((revenue * 1000) / avgBasket);
  const margin = Math.round((sp.gmLow + rng() * (sp.gmHigh - sp.gmLow) + (isOutlet ? -(1 + rng()) : 0)) * 10) / 10;
  const sentimentScore = Math.round(50 + rng() * 40);
  const sentimentDelta = Math.round((rng() * 20 - 10) * 10) / 10;
  const sentimentFlag = sentimentDelta <= -6 ? 'alert' : sentimentDelta >= 6 ? 'improving' : sentimentDelta <= -3 ? 'watch' : null;
  const vsBenchmark = Math.round((rng() * 30 - 8) * 10) / 10;
  return {
    name: loc.name, state: loc.state, city: loc.city,
    revenue, transactions, avgBasket, margin,
    sentimentScore, sentimentDelta, sentimentFlag, vsBenchmark,
  };
});

/* ────────────────────────────────────────────
   Helper: format revenue (in thousands) as $XK or $X.XM
   ──────────────────────────────────────────── */
function fmtRevenue(revK) {
  if (revK >= 1000) return `$${(revK / 1000).toFixed(1)}M`;
  return `$${Math.round(revK)}K`;
}

/* ────────────────────────────────────────────
   Helper: sentiment bar color utility
   ──────────────────────────────────────────── */
function sentimentBarColor(score) {
  if (score >= 0.2) return 'bg-[#00C27C]';
  if (score >= -0.2) return 'bg-[#D4A03A]';
  return 'bg-[#E87068]';
}

function sentimentTextColor(score) {
  if (score >= 0.2) return 'text-[#00C27C]';
  if (score >= -0.2) return 'text-[#D4A03A]';
  return 'text-[#E87068]';
}

/* ────────────────────────────────────────────
   Custom tooltip for comparison chart
   ──────────────────────────────────────────── */
function ComparisonTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="bg-[#1C1B1A] rounded-lg shadow-lg border border-[#38332B] p-3 text-sm">
      <p className="font-semibold text-[#F0EDE8] mb-1">{label}</p>
      <p className="text-[#ADA599]">
        Avg Sentiment: <span className="font-medium" style={{ color: sentimentColor(value) }}>{value >= 0 ? '+' : ''}{value?.toFixed(2)}</span>
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function LocationInsights({ reviews }) {
  const [sortKey, setSortKey] = useState('revenue');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { selectedStoreNames } = useStores();
  const { dateMultiplier, trendScale, rateOffset, periodLabel, rangeLabel } = useDateRange();

  /* ── Derive state-level data ── */
  const stateData = useMemo(() => {
    const byState = groupBy(reviews, 'state');
    return Object.entries(byState)
      .map(([state, stateReviews]) => {
        const uniqueLocations = new Set(stateReviews.map((r) => r.location));
        return {
          state,
          locationCount: uniqueLocations.size,
          reviewCount: stateReviews.length,
          avg: avgSentiment(stateReviews),
        };
      })
      .sort((a, b) => b.reviewCount - a.reviewCount);
  }, [reviews]);

  /* ── Derive location-level data (merged with STORE_METRICS) ── */
  const locationData = useMemo(() => {
    const byLocation = groupBy(reviews, 'location');
    return Object.entries(byLocation).map(([name, locReviews]) => {
      const dist = sentimentDistribution(locReviews);
      const catSent = categorySentiment(locReviews);
      const locMeta = locations.find((l) => l.name === name);
      const metrics = STORE_METRICS.find((m) => m.name === name);
      return {
        name,
        city: locMeta?.city || '',
        state: locMeta?.state || locReviews[0]?.state || '',
        reviewCount: locReviews.length,
        avg: avgSentiment(locReviews),
        dist,
        topCategory: catSent.length > 0 ? catSent[0].category : '-',
        reviews: locReviews,
        revenue: Math.round(((metrics?.revenue || 0) * dateMultiplier) * 10) / 10,
        transactions: Math.round((metrics?.transactions || 0) * dateMultiplier),
        avgBasket: Math.round(((metrics?.avgBasket || 0) * (1 + rateOffset)) * 100) / 100,
        margin: Math.round(((metrics?.margin || 0) + rateOffset * 50) * 10) / 10,
        vsBenchmark: metrics?.vsBenchmark || 0,
      };
    });
  }, [reviews, dateMultiplier, rateOffset]);

  /* ── Filter by selected stores ── */
  const filteredLocations = useMemo(() => {
    return locationData.filter((loc) => selectedStoreNames.has(loc.name));
  }, [locationData, selectedStoreNames]);

  /* ── KPI aggregates ── */
  const kpis = useMemo(() => {
    const stores = filteredLocations;
    const totalRevenue = stores.reduce((s, l) => s + l.revenue, 0);
    const totalTransactions = stores.reduce((s, l) => s + l.transactions, 0);
    const weightedBasket = totalTransactions > 0
      ? (totalRevenue * 1000) / totalTransactions
      : 0;
    const avgMargin = stores.length > 0
      ? stores.reduce((s, l) => s + l.margin, 0) / stores.length
      : 0;
    return {
      totalRevenue,
      totalTransactions,
      avgBasket: Math.round(weightedBasket * 100) / 100,
      avgMargin: Math.round(avgMargin * 10) / 10,
    };
  }, [filteredLocations]);

  /* ── Sorted location data for table ── */
  const sortedLocations = useMemo(() => {
    const sorted = [...filteredLocations];
    sorted.sort((a, b) => {
      let valA, valB;
      switch (sortKey) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case 'reviewCount':
          valA = a.reviewCount; valB = b.reviewCount; break;
        case 'avg':
          valA = a.avg; valB = b.avg; break;
        case 'revenue':
          valA = a.revenue; valB = b.revenue; break;
        case 'transactions':
          valA = a.transactions; valB = b.transactions; break;
        case 'avgBasket':
          valA = a.avgBasket; valB = b.avgBasket; break;
        case 'margin':
          valA = a.margin; valB = b.margin; break;
        case 'vsBenchmark':
          valA = a.vsBenchmark; valB = b.vsBenchmark; break;
        default:
          valA = a.revenue; valB = b.revenue; break;
      }
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
    return sorted;
  }, [filteredLocations, sortKey, sortDir]);

  /* ── Top 10 for comparison chart ── */
  const top10ChartData = useMemo(() => {
    return [...filteredLocations]
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10)
      .map((loc) => ({
        name: loc.name.replace('Ascend ', '').replace(' - ', ' '),
        avg: Math.round(loc.avg * 100) / 100,
      }));
  }, [filteredLocations]);

  /* ── Selected location detail data ── */
  const selectedDetail = useMemo(() => {
    if (!selectedLocation) return null;
    const loc = locationData.find((l) => l.name === selectedLocation);
    if (!loc) return null;
    const catData = categorySentiment(loc.reviews);
    const trend = monthlyTrend(loc.reviews);
    const recentReviews = [...loc.reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    return { ...loc, catData, trend, recentReviews };
  }, [selectedLocation, locationData]);

  /* ── Sort handler ── */
  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ column }) {
    if (sortKey !== column) return <ArrowUpDown className="w-3.5 h-3.5 text-[#6B6359]" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-[#00C27C]" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-[#00C27C]" />
    );
  }

  function SortableHeader({ label, column, className = '' }) {
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-semibold text-[#ADA599] uppercase tracking-wider cursor-pointer select-none hover:text-[#F0EDE8] transition-colors ${className}`}
        onClick={() => handleSort(column)}
      >
        <span className="flex items-center gap-1">
          {label} <SortIcon column={column} />
        </span>
      </th>
    );
  }

  /* ════════════════════════════════════════
     RENDER
     ════════════════════════════════════════ */
  return (
    <div className="space-y-8">
      {/* ─── Section 1: Header ─── */}
      <div>
        <h2 className="text-2xl font-bold text-[#F0EDE8] flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#00C27C]" />
          Store Performance
        </h2>
        <p className="text-[#ADA599] mt-1">
          Performance metrics across your dispensary locations — {rangeLabel}
        </p>
      </div>

      {/* ─── KPI Summary Cards ─── */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#00C27C]/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[#00C27C]" />
              </div>
              <span className="text-xs font-medium text-[#ADA599] uppercase tracking-wider">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-[#F0EDE8]">
              ${(kpis.totalRevenue / 1000).toFixed(1)}M
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-[#00C27C]" />
              <span className="text-xs text-[#00C27C]">+{(4.2 * trendScale).toFixed(1)}% {periodLabel}</span>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#64A8E0]/10 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-[#64A8E0]" />
              </div>
              <span className="text-xs font-medium text-[#ADA599] uppercase tracking-wider">Transactions</span>
            </div>
            <p className="text-2xl font-bold text-[#F0EDE8]">
              {kpis.totalTransactions.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-[#00C27C]" />
              <span className="text-xs text-[#00C27C]">+{(2.8 * trendScale).toFixed(1)}% {periodLabel}</span>
            </div>
          </div>

          {/* Avg Basket */}
          <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4A03A]/10 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-[#D4A03A]" />
              </div>
              <span className="text-xs font-medium text-[#ADA599] uppercase tracking-wider">Avg Basket</span>
            </div>
            <p className="text-2xl font-bold text-[#F0EDE8]">
              ${kpis.avgBasket.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-[#E87068]" />
              <span className="text-xs text-[#E87068]">-{(1.1 * trendScale).toFixed(1)}% {periodLabel}</span>
            </div>
          </div>

          {/* Avg Margin */}
          <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#BC8CFF]/10 flex items-center justify-center">
                <Percent className="w-4 h-4 text-[#BC8CFF]" />
              </div>
              <span className="text-xs font-medium text-[#ADA599] uppercase tracking-wider">Avg Margin</span>
            </div>
            <p className={`text-2xl font-bold ${kpis.avgMargin >= 48 ? 'text-[#00C27C]' : 'text-[#D4A03A]'}`}>
              {kpis.avgMargin}%
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-[#00C27C]" />
              <span className="text-xs text-[#00C27C]">+{(0.5 * trendScale).toFixed(1)}pp {periodLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: State-Level Overview ─── */}
      <section>
        <h3 className="text-lg font-semibold text-[#F0EDE8] mb-4">State Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stateData.map((s) => {
            const barWidth = Math.round(((s.avg + 1) / 2) * 100);
            return (
              <div
                key={s.state}
                className="bg-[#1C1B1A] rounded-xl shadow-sm border border-[#38332B] p-5 hover:border-[#38332B] transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl font-extrabold text-[#F0EDE8]">{s.state}</span>
                  <span
                    className={`text-sm font-semibold ${sentimentTextColor(s.avg)}`}
                  >
                    {s.avg >= 0 ? '+' : ''}{s.avg.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-[#ADA599]">
                  <p>
                    <span className="font-medium text-[#F0EDE8]">{s.locationCount}</span> location{s.locationCount !== 1 ? 's' : ''}
                  </p>
                  <p>
                    <span className="font-medium text-[#F0EDE8]">{s.reviewCount}</span> review{s.reviewCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {/* Sentiment bar */}
                <div className="mt-3 h-2 bg-[#1C1B1A] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${sentimentBarColor(s.avg)}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Section 3: Location Ranking Table ─── */}
      <section>
        <h3 className="text-lg font-semibold text-[#F0EDE8] mb-4">Store Rankings</h3>
        <div className="bg-[#1C1B1A] rounded-xl shadow-sm border border-[#38332B] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#141210] border-b border-[#38332B]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#ADA599] uppercase tracking-wider w-12">
                    #
                  </th>
                  <SortableHeader label="Location" column="name" />
                  <SortableHeader label="Revenue" column="revenue" />
                  <SortableHeader label="Txns" column="transactions" className="hidden md:table-cell" />
                  <SortableHeader label="Avg Basket" column="avgBasket" className="hidden md:table-cell" />
                  <SortableHeader label="Margin" column="margin" />
                  <SortableHeader label="Sentiment" column="avg" />
                  <SortableHeader label="vs Bench" column="vsBenchmark" className="hidden lg:table-cell" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {sortedLocations.map((loc, idx) => {
                  const isSelected = selectedLocation === loc.name;

                  return (
                    <tr
                      key={loc.name}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[rgba(0,194,124,0.06)]' : 'hover:bg-[#282724]'
                      }`}
                      onClick={() =>
                        setSelectedLocation(isSelected ? null : loc.name)
                      }
                    >
                      <td className="px-4 py-3 text-[#6B6359] font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#F0EDE8]">{loc.name}</p>
                          <p className="text-xs text-[#6B6359]">
                            {loc.city}, {loc.state}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#F0EDE8] font-medium">
                        {fmtRevenue(loc.revenue)}
                      </td>
                      <td className="px-4 py-3 text-[#F0EDE8] font-medium hidden md:table-cell">
                        {loc.transactions.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-[#F0EDE8] font-medium hidden md:table-cell">
                        ${loc.avgBasket.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${loc.margin >= 48 ? 'text-[#00C27C]' : loc.margin >= 45 ? 'text-[#D4A03A]' : 'text-[#E87068]'}`}>
                          {loc.margin}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#1C1B1A] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${sentimentBarColor(loc.avg)}`}
                              style={{ width: `${((loc.avg + 1) / 2) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${sentimentTextColor(loc.avg)}`}>
                            {loc.avg >= 0 ? '+' : ''}{loc.avg.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          loc.vsBenchmark >= 0
                            ? 'bg-[#00C27C]/10 text-[#00C27C]'
                            : 'bg-[#E87068]/10 text-[#E87068]'
                        }`}>
                          {loc.vsBenchmark >= 0 ? '+' : ''}{loc.vsBenchmark}%
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

      {/* ─── Section 4: Location Comparison Chart ─── */}
      <section>
        <h3 className="text-lg font-semibold text-[#F0EDE8] mb-4">
          Top 10 Locations by Sentiment
        </h3>
        <div className="bg-[#1C1B1A] rounded-xl shadow-sm border border-[#38332B] p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={top10ChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis
                type="number"
                domain={[-0.5, 1]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B6359' }}
                tickFormatter={(v) => (v >= 0 ? '+' : '') + v.toFixed(1)}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#F0F6FC', fontWeight: 500 }}
                width={140}
              />
              <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="avg" radius={[0, 4, 4, 0]} barSize={22}>
                {top10ChartData.map((entry, index) => (
                  <Cell key={index} fill={sentimentColor(entry.avg)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ─── Section 5: Location Detail (expanded) ─── */}
      {selectedDetail && (
        <section className="animate-in">
          <div className="bg-[#1C1B1A] rounded-xl shadow-sm border-2 border-[#00C27C]/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#F0EDE8]">{selectedDetail.name}</h3>
                <p className="text-sm text-[#ADA599]">
                  {selectedDetail.city}, {selectedDetail.state} &middot; {selectedDetail.reviewCount} reviews &middot; Avg sentiment:{' '}
                  <span className={`font-semibold ${sentimentTextColor(selectedDetail.avg)}`}>
                    {selectedDetail.avg >= 0 ? '+' : ''}{selectedDetail.avg.toFixed(2)}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-sm text-[#6B6359] hover:text-[#ADA599] transition-colors px-3 py-1 rounded-lg hover:bg-[#282724]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-[#F0EDE8] mb-3">Category Breakdown</h4>
                <div className="space-y-3">
                  {selectedDetail.catData.map((cat) => {
                    const total = cat.positive + cat.neutral + cat.negative;
                    return (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#F0EDE8]">{cat.category}</span>
                          <span className={`text-xs font-semibold ${sentimentTextColor(cat.avg)}`}>
                            {cat.avg >= 0 ? '+' : ''}{cat.avg.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 h-2">
                          <div
                            className="h-full bg-[#00C27C] rounded-l"
                            style={{ width: `${total > 0 ? (cat.positive / total) * 100 : 0}%` }}
                          />
                          <div
                            className="h-full bg-[#D4A03A]"
                            style={{ width: `${total > 0 ? (cat.neutral / total) * 100 : 0}%` }}
                          />
                          <div
                            className="h-full bg-[#E87068] rounded-r"
                            style={{ width: `${total > 0 ? (cat.negative / total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Trend */}
              <div>
                <h4 className="text-sm font-semibold text-[#F0EDE8] mb-3">Monthly Trend</h4>
                <TrendChart data={selectedDetail.trend} height={220} />
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#F0EDE8] mb-3">Recent Reviews</h4>
              <div className="space-y-3">
                {selectedDetail.recentReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} highlight={review.sentiment} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
