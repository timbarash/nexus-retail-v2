import { useState, useMemo } from 'react';
import {
  PhoneCall, Clock, CheckCircle, TrendingUp, Mic, Settings, Target,
  Volume2, ChevronDown, ChevronUp, Play, MessageSquare, Filter,
  ShoppingBag, DollarSign, Package,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import SentimentBadge from '../components/SentimentBadge';
import {
  voiceAICalls, voiceAIMetrics, voiceAIMonthlyTrend,
  intentDistribution, hourlyCallVolume, resolutionDistribution,
  voiceAgentConfigs, voiceOptions,
  orderCategoryBreakdown, orderMonthlyTrend, topOrderedProducts,
  type VoiceAICall, type VoiceAgentConfig,
} from '../data/voiceAI';

type Tab = 'analytics' | 'callLog' | 'config';
type SortKey = 'timestamp' | 'duration' | 'sentiment' | 'resolution';

const TABS: { id: Tab; label: string; icon: typeof PhoneCall }[] = [
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'callLog', label: 'Call Log', icon: MessageSquare },
  { id: 'config', label: 'Configuration', icon: Settings },
];

const ITEMS_PER_PAGE = 12;

// ---------------------------------------------------------------------------
// Shared tooltip
// ---------------------------------------------------------------------------

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm shadow-lg">
      <p className="mb-1.5 font-semibold text-navy-800">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-panel-300 capitalize">{p.name}:</span>
          <span className="font-medium text-navy-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Analytics Tab
// ---------------------------------------------------------------------------

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Call Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Calls" value={voiceAIMetrics.totalCalls.toLocaleString()} icon={<PhoneCall size={20} />} subtitle={`${voiceAIMetrics.callsToday} today`} />
        <MetricCard label="Avg Sentiment" value={`${voiceAIMetrics.avgSentimentScore > 0 ? '+' : ''}${voiceAIMetrics.avgSentimentScore.toFixed(2)}`} icon={<TrendingUp size={20} />} subtitle="Trending up" />
        <MetricCard label="Resolution Rate" value={`${(voiceAIMetrics.resolutionRate * 100).toFixed(0)}%`} icon={<CheckCircle size={20} />} subtitle="First-call resolution" />
        <MetricCard label="Avg Duration" value={`${Math.floor(voiceAIMetrics.avgDuration / 60)}:${String(voiceAIMetrics.avgDuration % 60).padStart(2, '0')}`} icon={<Clock size={20} />} subtitle="Minutes:Seconds" />
      </div>

      {/* Ordering Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Voice Orders" value={voiceAIMetrics.totalOrders.toString()} icon={<ShoppingBag size={20} />} subtitle={`${(voiceAIMetrics.orderConversionRate * 100).toFixed(0)}% conversion`} />
        <MetricCard label="Voice Revenue" value={`$${voiceAIMetrics.totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} subtitle="Total order revenue" />
        <MetricCard label="Avg Order Value" value={`$${voiceAIMetrics.avgOrderValue.toFixed(0)}`} icon={<Package size={20} />} subtitle="Per voice order" />
        <MetricCard label="Satisfaction" value={`${voiceAIMetrics.avgSatisfaction}/5`} icon={<CheckCircle size={20} />} subtitle={`${voiceAIMetrics.avgSatisfaction >= 4 ? 'Excellent' : 'Good'} rating`} />
      </div>

      {/* Charts Row 1: Sentiment Trend + Hourly Volume */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-navy-800">Call Sentiment Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={voiceAIMonthlyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#677882' }} />
              <YAxis tick={{ fontSize: 12, fill: '#677882' }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#6ABA48" fill="#6ABA48" fillOpacity={0.6} name="Positive" />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#FFC02A" fill="#FFC02A" fillOpacity={0.4} name="Neutral" />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} name="Negative" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-navy-800">Call Volume by Hour</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyCallVolume} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#677882' }} />
              <YAxis tick={{ fontSize: 12, fill: '#677882' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" fill="#6ABA48" radius={[4, 4, 0, 0]} name="Calls" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Order Revenue Trend + Category Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-navy-800">Voice Order Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={orderMonthlyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#677882' }} />
              <YAxis tick={{ fontSize: 12, fill: '#677882' }} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                formatter={(value: number, name: string) => [name === 'revenue' ? `$${value.toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="revenue" fill="#FFC02A" radius={[4, 4, 0, 0]} name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-navy-800">Orders by Product Category</h3>
          <div className="space-y-3">
            {orderCategoryBreakdown.map((cat) => {
              const maxRevenue = orderCategoryBreakdown[0]?.revenue ?? 1;
              return (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="w-24 truncate text-sm text-panel-400">{cat.category}</span>
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-dutchie-300 transition-all"
                        style={{ width: `${(cat.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-20 text-right text-sm font-medium text-navy-800">${cat.revenue.toLocaleString()}</span>
                  <span className="w-14 text-right text-xs text-panel-300">{cat.orders} orders</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 3: Intent Distribution + Resolution Outcomes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-navy-800">Intent Distribution</h3>
          <div className="space-y-3">
            {intentDistribution.map((item) => (
              <div key={item.intent} className="flex items-center gap-3">
                <span className="w-36 truncate text-sm text-panel-400">{item.label}</span>
                <div className="flex-1">
                  <div className="h-6 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.intent === 'order_placement' ? '#FFC02A' : '#6ABA48' }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-medium text-navy-800">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-navy-800">Resolution Outcomes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={resolutionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
                strokeWidth={0}
              >
                {resolutionDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} calls`, name]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-sm text-panel-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Ordered Products */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-navy-800">Top Products Ordered via Voice AI</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-3 pr-4 font-medium text-panel-300">Product</th>
                <th className="pb-3 pr-4 font-medium text-panel-300">Category</th>
                <th className="pb-3 pr-4 font-medium text-panel-300 text-right">Orders</th>
                <th className="pb-3 font-medium text-panel-300 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topOrderedProducts.map((p) => (
                <tr key={p.name}>
                  <td className="py-3 pr-4 font-medium text-navy-800">{p.name}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-panel-400">{p.category}</span>
                  </td>
                  <td className="py-3 pr-4 text-right text-panel-400">{p.orders}</td>
                  <td className="py-3 text-right font-medium text-navy-800">${p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Behavior Analysis Table */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-navy-800">Behavior Analysis by Intent</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-3 pr-4 font-medium text-panel-300">Intent</th>
                <th className="pb-3 pr-4 font-medium text-panel-300">Count</th>
                <th className="pb-3 pr-4 font-medium text-panel-300">Share</th>
                <th className="pb-3 pr-4 font-medium text-panel-300">Avg Sentiment</th>
                <th className="pb-3 font-medium text-panel-300">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {intentDistribution.map((item) => (
                <tr key={item.intent}>
                  <td className="py-3 pr-4 font-medium text-navy-800">{item.label}</td>
                  <td className="py-3 pr-4 text-panel-400">{item.count}</td>
                  <td className="py-3 pr-4 text-panel-400">{item.percentage}%</td>
                  <td className="py-3 pr-4">
                    <span className={`font-medium ${item.avgSentiment > 0.15 ? 'text-emerald-600' : item.avgSentiment < -0.15 ? 'text-red-500' : 'text-amber-500'}`}>
                      {item.avgSentiment > 0 ? '+' : ''}{item.avgSentiment.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`font-medium ${item.resolutionRate >= 0.7 ? 'text-emerald-600' : item.resolutionRate >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
                      {(item.resolutionRate * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Call Log Tab
// ---------------------------------------------------------------------------

function CallLogTab() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filters, setFilters] = useState({ intent: '', sentiment: '', resolution: '' });
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = [...voiceAICalls];
    if (filters.intent) result = result.filter(c => c.intent === filters.intent);
    if (filters.sentiment) result = result.filter(c => c.sentiment === filters.sentiment);
    if (filters.resolution) result = result.filter(c => c.resolution === filters.resolution);

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'timestamp': cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(); break;
        case 'duration': cmp = a.duration - b.duration; break;
        case 'sentiment': cmp = a.sentimentScore - b.sentimentScore; break;
        case 'resolution': cmp = a.resolution.localeCompare(b.resolution); break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [filters, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortAsc ? <ChevronUp size={14} className="inline ml-0.5" /> : <ChevronDown size={14} className="inline ml-0.5" />;
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function formatDuration(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <Filter size={16} className="text-panel-300" />
        <select
          value={filters.intent}
          onChange={(e) => { setFilters(f => ({ ...f, intent: e.target.value })); setPage(0); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-dutchie-300"
        >
          <option value="">All Intents</option>
          {intentDistribution.map(i => <option key={i.intent} value={i.intent}>{i.label}</option>)}
        </select>
        <select
          value={filters.sentiment}
          onChange={(e) => { setFilters(f => ({ ...f, sentiment: e.target.value })); setPage(0); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-dutchie-300"
        >
          <option value="">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <select
          value={filters.resolution}
          onChange={(e) => { setFilters(f => ({ ...f, resolution: e.target.value })); setPage(0); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-dutchie-300"
        >
          <option value="">All Resolutions</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
          <option value="callback">Callback</option>
          <option value="abandoned">Abandoned</option>
        </select>
        <span className="ml-auto text-xs text-panel-300">{filtered.length} calls</span>
      </div>

      {/* Call Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-panel-50 text-left">
                <th className="px-4 py-3 font-medium text-panel-300 cursor-pointer select-none" onClick={() => handleSort('timestamp')}>
                  Time <SortIcon col="timestamp" />
                </th>
                <th className="px-4 py-3 font-medium text-panel-300 cursor-pointer select-none" onClick={() => handleSort('duration')}>
                  Duration <SortIcon col="duration" />
                </th>
                <th className="px-4 py-3 font-medium text-panel-300">Caller</th>
                <th className="hidden px-4 py-3 font-medium text-panel-300 md:table-cell">Location</th>
                <th className="px-4 py-3 font-medium text-panel-300">Intent</th>
                <th className="px-4 py-3 font-medium text-panel-300 cursor-pointer select-none" onClick={() => handleSort('sentiment')}>
                  Sentiment <SortIcon col="sentiment" />
                </th>
                <th className="hidden px-4 py-3 font-medium text-panel-300 md:table-cell">Order</th>
                <th className="hidden px-4 py-3 font-medium text-panel-300 md:table-cell cursor-pointer select-none" onClick={() => handleSort('resolution')}>
                  Resolution <SortIcon col="resolution" />
                </th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((call) => (
                <CallRow
                  key={call.id}
                  call={call}
                  isExpanded={expandedId === call.id}
                  onToggle={() => setExpandedId(expandedId === call.id ? null : call.id)}
                  formatTime={formatTime}
                  formatDuration={formatDuration}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-panel-400 transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-panel-300">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-panel-400 transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CallRow({ call, isExpanded, onToggle, formatTime, formatDuration }: {
  call: VoiceAICall;
  isExpanded: boolean;
  onToggle: () => void;
  formatTime: (iso: string) => string;
  formatDuration: (s: number) => string;
}) {
  const resolutionColor: Record<string, string> = {
    resolved: 'text-emerald-600 bg-emerald-50',
    escalated: 'text-amber-600 bg-amber-50',
    callback: 'text-indigo-600 bg-indigo-50',
    abandoned: 'text-red-600 bg-red-50',
  };

  return (
    <>
      <tr
        className="cursor-pointer transition-colors hover:bg-gray-50"
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-navy-800 whitespace-nowrap">{formatTime(call.timestamp)}</td>
        <td className="px-4 py-3 text-panel-400 whitespace-nowrap">{formatDuration(call.duration)}</td>
        <td className="px-4 py-3 text-navy-800">{call.callerName}</td>
        <td className="hidden px-4 py-3 text-panel-400 md:table-cell">{call.location.replace('Ascend ', '')}</td>
        <td className="px-4 py-3">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            call.intent === 'order_placement' ? 'bg-gold-100 text-gold-800' : 'bg-gray-100 text-panel-400'
          }`}>
            {call.intentLabel}
          </span>
        </td>
        <td className="px-4 py-3">
          <SentimentBadge sentiment={call.sentiment} score={call.sentimentScore} />
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          {call.orderPlaced ? (
            <span className="rounded-full bg-dutchie-100 px-2 py-0.5 text-xs font-medium text-dutchie-800">
              ${call.orderTotal?.toFixed(0)}
            </span>
          ) : (
            <span className="text-xs text-panel-200">—</span>
          )}
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${resolutionColor[call.resolution]}`}>
            {call.resolution}
          </span>
        </td>
        <td className="px-4 py-3">
          {isExpanded ? <ChevronUp size={16} className="text-panel-300" /> : <ChevronDown size={16} className="text-panel-300" />}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={9} className="bg-panel-50 px-4 py-4">
            <div className="mx-auto max-w-2xl space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-panel-300">Transcript</p>
                {call.orderPlaced && (
                  <span className="flex items-center gap-1.5 rounded-full bg-dutchie-100 px-2.5 py-1 text-xs font-medium text-dutchie-800">
                    <ShoppingBag size={12} />
                    Order: ${call.orderTotal?.toFixed(2)} · {call.orderItems} item{call.orderItems !== 1 ? 's' : ''} · {call.orderCategory}
                  </span>
                )}
              </div>
              {call.transcript.map((line, i) => (
                <div key={i} className={`flex ${line.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                    line.speaker === 'agent'
                      ? 'bg-dutchie-300/10 text-navy-800'
                      : 'bg-white text-panel-400 border border-gray-200'
                  }`}>
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-panel-300">
                      {line.speaker === 'agent' ? call.voiceAgent : call.callerName} · {line.time}
                    </span>
                    {line.text}
                  </div>
                </div>
              ))}
              {call.satisfactionRating && (
                <p className="pt-2 text-center text-xs text-panel-300">
                  Post-call rating: {'★'.repeat(call.satisfactionRating)}{'☆'.repeat(5 - call.satisfactionRating)} ({call.satisfactionRating}/5)
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Configuration Tab
// ---------------------------------------------------------------------------

function ConfigTab() {
  const [agents, setAgents] = useState<VoiceAgentConfig[]>(voiceAgentConfigs.map(a => ({ ...a })));
  const [selectedVoice, setSelectedVoice] = useState(agents[0]?.voiceId ?? 'nova');
  const [editingGoals, setEditingGoals] = useState<string | null>(null);
  const [goalText, setGoalText] = useState('');
  const [greeting, setGreeting] = useState(agents[0]?.greeting ?? '');
  const [saved, setSaved] = useState(false);

  function toggleAgent(id: string) {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  }

  function showSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Save confirmation */}
      {saved && (
        <div className="rounded-lg bg-dutchie-300/10 px-4 py-2.5 text-center text-sm font-medium text-dutchie-800">
          Changes saved (demo mode — not persisted)
        </div>
      )}

      {/* Active Agents */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Volume2 size={20} className="text-dutchie-300" />
          <h3 className="text-lg font-semibold text-navy-800">Voice Agents</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className={`rounded-xl border p-5 transition-all ${agent.isActive ? 'border-dutchie-300 bg-dutchie-50/30' : 'border-gray-100 bg-panel-50'}`}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${agent.isActive ? 'bg-dutchie-300' : 'bg-gray-300'}`}>
                    <Mic size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800">{agent.name}</p>
                    <p className="text-xs text-panel-300">Voice: {agent.voiceLabel}</p>
                  </div>
                </div>
                <button
                  onClick={() => { toggleAgent(agent.id); showSaved(); }}
                  className={`relative h-6 w-11 rounded-full transition-colors ${agent.isActive ? 'bg-dutchie-300' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${agent.isActive ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <p className="text-sm text-panel-400">{agent.personality}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Mic size={20} className="text-dutchie-300" />
          <h3 className="text-lg font-semibold text-navy-800">Voice Selection</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {voiceOptions.map((voice) => (
            <button
              key={voice.id}
              onClick={() => { setSelectedVoice(voice.id); showSaved(); }}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                selectedVoice === voice.id
                  ? 'border-dutchie-300 bg-dutchie-50/30 ring-1 ring-dutchie-300'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                selectedVoice === voice.id ? 'bg-dutchie-300' : 'bg-gray-200'
              }`}>
                <Play size={12} className="text-white ml-0.5" />
              </div>
              <div>
                <p className="font-medium text-navy-800">{voice.label}</p>
                <p className="mt-0.5 text-xs text-panel-300">{voice.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Goals Editor */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Target size={20} className="text-dutchie-300" />
          <h3 className="text-lg font-semibold text-navy-800">AI Goals</h3>
        </div>
        <div className="space-y-3">
          {agents.filter(a => a.isActive).map((agent) => (
            <div key={agent.id}>
              <p className="mb-2 text-sm font-medium text-panel-400">{agent.name}'s Goals</p>
              <ul className="space-y-2">
                {agent.goals.map((goal, gi) => (
                  <li key={gi} className="flex items-start gap-2 text-sm">
                    {editingGoals === `${agent.id}-${gi}` ? (
                      <input
                        autoFocus
                        value={goalText}
                        onChange={(e) => setGoalText(e.target.value)}
                        onBlur={() => {
                          if (goalText.trim()) {
                            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, goals: a.goals.map((g, i) => i === gi ? goalText : g) } : a));
                            showSaved();
                          }
                          setEditingGoals(null);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        className="flex-1 rounded-lg border border-dutchie-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-dutchie-300"
                      />
                    ) : (
                      <>
                        <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-dutchie-300" />
                        <span
                          className="cursor-pointer text-navy-800 hover:text-dutchie-400"
                          onClick={() => { setEditingGoals(`${agent.id}-${gi}`); setGoalText(goal); }}
                        >
                          {goal}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Greeting Customization */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-dutchie-300" />
          <h3 className="text-lg font-semibold text-navy-800">Greeting Script</h3>
        </div>
        <textarea
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-navy-800 placeholder-panel-300 focus:outline-none focus:ring-2 focus:ring-dutchie-300"
          placeholder="Enter the greeting your Voice AI will use..."
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-panel-300">{greeting.length} characters</p>
          <button
            onClick={showSaved}
            className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-gold-400"
          >
            Save Greeting
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function VoiceAI() {
  const [activeTab, setActiveTab] = useState<Tab>('analytics');

  return (
    <div>
      <PageHeader
        title="Voice AI Analytics"
        subtitle="Dutchie Voice AI — call analysis, ordering insights, and agent configuration"
      />

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-dutchie-300 text-dutchie-400'
                : 'border-transparent text-panel-300 hover:text-panel-400'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'callLog' && <CallLogTab />}
      {activeTab === 'config' && <ConfigTab />}
    </div>
  );
}
