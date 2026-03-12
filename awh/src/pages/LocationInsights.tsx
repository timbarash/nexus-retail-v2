import { useState, useMemo } from 'react';
import { MapPin, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageHeader from '../components/PageHeader';
import ReviewCard from '../components/ReviewCard';
import TrendChart from '../components/TrendChart';
import { reviews, locations } from '../data/reviews';
import { avgSentiment, groupBy, sentimentDistribution, monthlyTrend, categorySentiment, sentimentColor } from '../utils/reviewUtils';

function sentimentBarColor(score: number): string {
  if (score >= 0.2) return 'bg-[#00a47c]';
  if (score >= -0.2) return 'bg-[#e8932c]';
  return 'bg-[#d94040]';
}

function sentimentTextColor(score: number): string {
  if (score >= 0.2) return 'text-[#00a47c]';
  if (score >= -0.2) return 'text-[#e8932c]';
  return 'text-[#d94040]';
}

function ComparisonTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm shadow-lg">
      <p className="mb-1 font-semibold text-navy-900">{label}</p>
      <p className="text-gray-500">
        Avg Sentiment: <span className="font-medium" style={{ color: sentimentColor(value) }}>{value >= 0 ? '+' : ''}{value?.toFixed(2)}</span>
      </p>
    </div>
  );
}

type SortKey = 'name' | 'reviewCount' | 'avg';
type SortDir = 'asc' | 'desc';

export default function LocationInsights() {
  const [sortKey, setSortKey] = useState<SortKey>('avg');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  /* State-level data */
  const stateData = useMemo(() => {
    const byState = groupBy(reviews, 'state');
    return Object.entries(byState)
      .map(([state, stateReviews]) => {
        const uniqueLocations = new Set(stateReviews.map(r => r.location));
        return {
          state,
          locationCount: uniqueLocations.size,
          reviewCount: stateReviews.length,
          avg: avgSentiment(stateReviews),
        };
      })
      .sort((a, b) => b.reviewCount - a.reviewCount);
  }, []);

  /* Location-level data */
  const locationData = useMemo(() => {
    const byLocation = groupBy(reviews, 'location');
    return Object.entries(byLocation).map(([name, locReviews]) => {
      const dist = sentimentDistribution(locReviews);
      const catSent = categorySentiment(locReviews);
      const locMeta = locations.find(l => l.name === name);
      return {
        name,
        city: locMeta?.city || '',
        state: locMeta?.state || locReviews[0]?.state || '',
        reviewCount: locReviews.length,
        avg: avgSentiment(locReviews),
        dist,
        topCategory: catSent.length > 0 ? catSent[0].category : '-',
        reviews: locReviews,
      };
    });
  }, []);

  /* Sorted location data */
  const sortedLocations = useMemo(() => {
    const sorted = [...locationData];
    sorted.sort((a, b) => {
      switch (sortKey) {
        case 'name': {
          const valA = a.name.toLowerCase();
          const valB = b.name.toLowerCase();
          return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        case 'reviewCount':
          return sortDir === 'asc' ? a.reviewCount - b.reviewCount : b.reviewCount - a.reviewCount;
        case 'avg':
        default:
          return sortDir === 'asc' ? a.avg - b.avg : b.avg - a.avg;
      }
    });
    return sorted;
  }, [locationData, sortKey, sortDir]);

  /* Top 10 for chart */
  const top10ChartData = useMemo(() =>
    [...locationData]
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10)
      .map(loc => ({
        name: loc.name.replace('Ascend ', '').replace(' - ', ' '),
        avg: Math.round(loc.avg * 100) / 100,
      })),
  [locationData]);

  /* Selected location detail */
  const selectedDetail = useMemo(() => {
    if (!selectedLocation) return null;
    const loc = locationData.find(l => l.name === selectedLocation);
    if (!loc) return null;
    const catData = categorySentiment(loc.reviews);
    const trend = monthlyTrend(loc.reviews);
    const recentReviews = [...loc.reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    return { ...loc, catData, trend, recentReviews };
  }, [selectedLocation, locationData]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDir === 'asc' ? <ChevronUp size={14} className="text-navy-900" /> : <ChevronDown size={14} className="text-navy-900" />;
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Location Insights" subtitle="Sentiment analysis across Ascend dispensary locations" />

      {/* State Overview */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-navy-900">State Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stateData.map(s => {
            const barWidth = Math.round(((s.avg + 1) / 2) * 100);
            return (
              <div key={s.state} className="rounded-lg border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-3xl font-extrabold text-navy-900">{s.state}</span>
                  <span className={`text-sm font-semibold ${sentimentTextColor(s.avg)}`}>
                    {s.avg >= 0 ? '+' : ''}{s.avg.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  <p><span className="font-medium text-gray-600">{s.locationCount}</span> location{s.locationCount !== 1 ? 's' : ''}</p>
                  <p><span className="font-medium text-gray-600">{s.reviewCount}</span> review{s.reviewCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-50">
                  <div className={`h-full rounded-full transition-all ${sentimentBarColor(s.avg)}`} style={{ width: `${barWidth}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Location Rankings */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-navy-900">Location Rankings</h3>
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="w-12 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                  <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-navy-900" onClick={() => handleSort('name')}>
                    <span className="flex items-center gap-1">Location <SortIcon column="name" /></span>
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-navy-900" onClick={() => handleSort('reviewCount')}>
                    <span className="flex items-center gap-1">Reviews <SortIcon column="reviewCount" /></span>
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-navy-900" onClick={() => handleSort('avg')}>
                    <span className="flex items-center gap-1">Sentiment <SortIcon column="avg" /></span>
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Distribution</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Top Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedLocations.map((loc, idx) => {
                  const isSelected = selectedLocation === loc.name;
                  const total = loc.dist.positive + loc.dist.neutral + loc.dist.negative;
                  const pctPos = total > 0 ? (loc.dist.positive / total) * 100 : 0;
                  const pctNeu = total > 0 ? (loc.dist.neutral / total) * 100 : 0;
                  const pctNeg = total > 0 ? (loc.dist.negative / total) * 100 : 0;

                  return (
                    <tr
                      key={loc.name}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#00a47c]/5' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedLocation(isSelected ? null : loc.name)}
                    >
                      <td className="px-4 py-3 font-medium text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-navy-900">{loc.name}</p>
                          <p className="text-xs text-gray-400">{loc.city}, {loc.state}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-600">{loc.reviewCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-50">
                            <div className={`h-full rounded-full ${sentimentBarColor(loc.avg)}`} style={{ width: `${((loc.avg + 1) / 2) * 100}%` }} />
                          </div>
                          <span className={`text-sm font-semibold ${sentimentTextColor(loc.avg)}`}>
                            {loc.avg >= 0 ? '+' : ''}{loc.avg.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex w-32 items-center gap-0.5">
                          <div className="h-3 rounded-l bg-[#00a47c]" style={{ width: `${pctPos}%` }} title={`Positive: ${loc.dist.positive}`} />
                          <div className="h-3 bg-[#e8932c]" style={{ width: `${pctNeu}%` }} title={`Neutral: ${loc.dist.neutral}`} />
                          <div className="h-3 rounded-r bg-[#d94040]" style={{ width: `${pctNeg}%` }} title={`Negative: ${loc.dist.negative}`} />
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <span className="inline-flex items-center rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                          {loc.topCategory}
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

      {/* Top 10 Chart */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-navy-900">Top 10 Locations by Sentiment</h3>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={top10ChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e7e9" horizontal={false} />
              <XAxis type="number" domain={[-0.5, 1]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#77868e' }} tickFormatter={v => (v >= 0 ? '+' : '') + v.toFixed(1)} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4a5459', fontWeight: 500 }} width={140} />
              <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="avg" radius={[0, 4, 4, 0]} barSize={22}>
                {top10ChartData.map((entry, index) => (
                  <Cell key={index} fill={sentimentColor(entry.avg)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Location Detail */}
      {selectedDetail && (
        <section>
          <div className="rounded-lg border-2 border-[#00a47c]/20 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy-900">{selectedDetail.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedDetail.city}, {selectedDetail.state} &middot; {selectedDetail.reviewCount} reviews &middot; Avg sentiment:{' '}
                  <span className={`font-semibold ${sentimentTextColor(selectedDetail.avg)}`}>
                    {selectedDetail.avg >= 0 ? '+' : ''}{selectedDetail.avg.toFixed(2)}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="rounded-lg px-3 py-1 text-sm text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Category Breakdown */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-600">Category Breakdown</h4>
                <div className="space-y-3">
                  {selectedDetail.catData.map(cat => {
                    const total = cat.positive + cat.neutral + cat.negative;
                    return (
                      <div key={cat.category}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-gray-600">{cat.category}</span>
                          <span className={`text-xs font-semibold ${sentimentTextColor(cat.avg)}`}>
                            {cat.avg >= 0 ? '+' : ''}{cat.avg.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex h-2 items-center gap-0.5">
                          <div className="h-full rounded-l bg-[#00a47c]" style={{ width: `${total > 0 ? (cat.positive / total) * 100 : 0}%` }} />
                          <div className="h-full bg-[#e8932c]" style={{ width: `${total > 0 ? (cat.neutral / total) * 100 : 0}%` }} />
                          <div className="h-full rounded-r bg-[#d94040]" style={{ width: `${total > 0 ? (cat.negative / total) * 100 : 0}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Trend */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-600">Monthly Trend</h4>
                <TrendChart data={selectedDetail.trend} height={220} />
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-gray-600">Recent Reviews</h4>
              <div className="space-y-3">
                {selectedDetail.recentReviews.map(review => (
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
