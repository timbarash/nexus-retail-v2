import { Link } from 'react-router-dom';
import { MapPin, Map, TrendingUp, Building2, PhoneCall, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import { companyInfo, productBrands } from '../data/company';
import { stateData } from '../data/stateAnalysis';
import { voiceAIMetrics } from '../data/voiceAI';
import { getScoreColor } from '../utils/colors';

export default function Overview() {
  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`${companyInfo.name} — Customer Sentiment Snapshot`}
      />

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Locations" value={companyInfo.locationCount} icon={<MapPin size={20} />} subtitle={`Across ${companyInfo.stateCount} states`} />
        <MetricCard label="Markets" value={`${companyInfo.stateCount} States`} icon={<Map size={20} />} subtitle={companyInfo.states.join(', ')} />
        <MetricCard label="Ticker" value={`${companyInfo.exchange}: ${companyInfo.ticker}`} icon={<TrendingUp size={20} />} />
        <MetricCard label="Headquarters" value={companyInfo.hq} icon={<Building2 size={20} />} />
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Product Brand Scores */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">Product Brand Scores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={productBrands} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, 'Score']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e3e7e9' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                {productBrands.map((brand, index) => (
                  <Cell key={index} fill={getScoreColor(brand.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment by State */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">Sentiment by State</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
              <XAxis dataKey="abbreviation" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, 'Score']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e3e7e9' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={36}>
                {stateData.map((s, index) => (
                  <Cell key={index} fill={getScoreColor(s.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Voice AI Insights */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/15">
              <PhoneCall size={20} className="text-gold-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-navy-800">Voice AI Insights</h2>
              <p className="text-xs text-panel-300">Dutchie Voice AI — calls, ordering &amp; sentiment</p>
            </div>
          </div>
          <Link
            to="/voice-ai"
            className="flex items-center gap-1.5 rounded-lg bg-gold-500 px-3.5 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-gold-400"
          >
            View Details
            <ArrowRight size={14} />
          </Link>
        </div>
        {/* Row 1 — Call metrics */}
        <div className="grid gap-4 border-b border-gray-50 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <p className="text-sm text-panel-300">Total Calls</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">{voiceAIMetrics.totalCalls.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-dutchie-300">+12% this month</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-panel-300">Avg Sentiment</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">
              {voiceAIMetrics.avgSentimentScore > 0 ? '+' : ''}{voiceAIMetrics.avgSentimentScore.toFixed(2)}
            </p>
            <p className="mt-0.5 text-xs text-dutchie-300">Positive trend</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-panel-300">Resolution Rate</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">{(voiceAIMetrics.resolutionRate * 100).toFixed(0)}%</p>
            <p className="mt-0.5 text-xs text-panel-300">First-call resolution</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-panel-300">Avg Duration</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">
              {Math.floor(voiceAIMetrics.avgDuration / 60)}:{String(voiceAIMetrics.avgDuration % 60).padStart(2, '0')}
            </p>
            <p className="mt-0.5 text-xs text-panel-300">Minutes:Seconds</p>
          </div>
        </div>
        {/* Row 2 — Ordering metrics */}
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4 bg-dutchie-900/5">
          <div className="text-center">
            <p className="text-sm text-panel-300">Orders Placed</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">{voiceAIMetrics.totalOrders}</p>
            <p className="mt-0.5 text-xs text-dutchie-300">Via Voice AI</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-panel-300">Voice Revenue</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">${voiceAIMetrics.totalRevenue.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-dutchie-300">Total voice orders</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-panel-300">Avg Order Value</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">${voiceAIMetrics.avgOrderValue.toFixed(0)}</p>
            <p className="mt-0.5 text-xs text-panel-300">Per voice order</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-panel-300">Order Conversion</p>
            <p className="mt-1 text-2xl font-bold text-navy-800">{(voiceAIMetrics.orderConversionRate * 100).toFixed(0)}%</p>
            <p className="mt-0.5 text-xs text-panel-300">Calls to orders</p>
          </div>
        </div>
      </div>

      {/* Company Info Table */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 className="mb-4 text-lg font-semibold text-navy-900">Company Information</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {[
              ['Company', companyInfo.name],
              ['CEO', companyInfo.ceo],
              ['Founded', companyInfo.founded],
              ['Employees', companyInfo.employees],
              ['Headquarters', companyInfo.hq],
              ['Exchange', `${companyInfo.exchange}: ${companyInfo.ticker}`],
              ['Description', companyInfo.description],
            ].map(([label, value]) => (
              <tr key={String(label)}>
                <td className="py-3 pr-4 font-medium text-gray-500 w-36">{String(label)}</td>
                <td className="py-3 text-navy-900">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
