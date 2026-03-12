import React from 'react';
import { Bug, Sparkles, BookOpen, Star, TrendingUp, BarChart3, DollarSign, ShoppingBag, Users, Monitor, AlertTriangle, Shield, Clock, Package, CheckCircle2 } from 'lucide-react';

function formatCurrency(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

/* ─── Bug Ticket Card ─── */
export function BugTicketCard({ data }) {
  return (
    <div className="mt-2 rounded-lg border border-[#F85149]/30 bg-[#F85149]/[0.06] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Bug className="w-4 h-4 text-[#F85149]" />
        <span className="text-xs font-bold text-[#F85149] uppercase">Bug Report</span>
        <span className="ml-auto text-xs font-mono text-[#8B949E]">{data.ticketId}</span>
      </div>
      <p className="text-sm text-[#C9D1D9]">{data.issue}</p>
      <div className="flex items-center gap-3 text-xs text-[#8B949E]">
        <span className="bg-[#F85149]/20 text-[#F85149] rounded px-1.5 py-0.5 font-medium">P2</span>
        <span>In Queue — Engineering notified</span>
      </div>
    </div>
  );
}

/* ─── Feature Card ─── */
export function FeatureCard({ data }) {
  return (
    <div className="mt-2 rounded-lg border border-[#B392F0]/30 bg-[#B392F0]/[0.06] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#B392F0]" />
        <span className="text-xs font-bold text-[#B392F0] uppercase">Feature Request</span>
        <span className="ml-auto text-xs font-mono text-[#8B949E]">{data.ticketId}</span>
      </div>
      <p className="text-sm text-[#C9D1D9]">{data.request}</p>
      <div className="flex items-center gap-3 text-xs text-[#8B949E]">
        <span className="bg-[#B392F0]/20 text-[#B392F0] rounded px-1.5 py-0.5 font-medium">Submitted</span>
        <span>Product team will review in next sprint</span>
      </div>
    </div>
  );
}

/* ─── KB Card ─── */
export function KBCard({ data }) {
  return (
    <div className="mt-2 rounded-lg border border-[#58A6FF]/30 bg-[#58A6FF]/[0.06] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#58A6FF]" />
        <span className="text-xs font-bold text-[#58A6FF] uppercase">Knowledge Base</span>
        <span className="ml-auto text-xs text-[#8B949E]">{data.topic}</span>
      </div>
      <p className="text-sm text-[#C9D1D9]">{data.answer}</p>
      <div className="flex flex-wrap gap-1.5">
        {data.articles.map((a, i) => (
          <span key={i} className="text-xs bg-[#58A6FF]/10 text-[#58A6FF] rounded px-2 py-0.5">{a}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Review Summary Card ─── */
export function ReviewSummaryCard({ data }) {
  return (
    <div className="mt-2 rounded-lg border border-[#00C27C]/30 bg-[#00C27C]/[0.06] p-3 space-y-3">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-[#00C27C]" />
        <span className="text-xs font-bold text-[#00C27C] uppercase">Review Feed</span>
        <span className="ml-auto text-xs text-[#8B949E]">{data.filterDesc}</span>
      </div>
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">{data.totalReviews}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Reviews</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">{data.avgRating}/5</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Avg Rating</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">{data.positivePercent}%</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Positive</p>
        </div>
      </div>
      {/* Excerpts */}
      {data.excerpts && data.excerpts.length > 0 && (
        <div className="space-y-1.5">
          {data.excerpts.map((ex, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <span className="text-[#D29922] flex-shrink-0">{'★'.repeat(ex.stars)}</span>
              <span className="text-[#C9D1D9] italic">"{ex.text}"</span>
              <span className="text-[#484F58] flex-shrink-0">— {ex.source}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Sentiment Summary Card ─── */
export function SentimentSummaryCard({ data }) {
  return (
    <div className="mt-2 rounded-lg border border-[#00C27C]/30 bg-[#00C27C]/[0.06] p-3 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#00C27C]" />
        <span className="text-xs font-bold text-[#00C27C] uppercase">Sentiment Dashboard</span>
        <span className="ml-auto text-xs text-[#8B949E]">{data.focus}</span>
      </div>
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">{data.overallScore}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Score</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#58A6FF]">+{data.nps}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">NPS</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#00C27C]">{data.positivePercent}%</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Positive</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F85149]">{data.negativePercent}%</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Negative</p>
        </div>
      </div>
      {/* Category bars */}
      <div className="space-y-1.5">
        {data.categories.map((cat, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="text-[#8B949E] w-28 text-right truncate">{cat.label}</span>
            <div className="flex-1 bg-[#21262D] rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${cat.score}%`, backgroundColor: cat.color }} />
            </div>
            <span className="text-[#C9D1D9] w-8 text-right">{cat.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Report Summary Card ─── */
export function ReportSummaryCard({ data }) {
  return (
    <div className="mt-2 rounded-lg border border-[#58A6FF]/30 bg-[#58A6FF]/[0.06] p-3 space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-[#58A6FF]" />
        <span className="text-xs font-bold text-[#58A6FF] uppercase">Performance Report</span>
        <span className="ml-auto text-xs text-[#8B949E]">{data.timeframeLabel}</span>
      </div>
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">{formatCurrency(data.revenue)}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Revenue</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">{data.orders.toLocaleString()}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Orders</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">${data.aov.toFixed(2)}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">AOV</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className={`text-lg font-bold ${data.growthPct >= 0 ? 'text-[#00C27C]' : 'text-[#F85149]'}`}>
            {data.growthPct >= 0 ? '+' : ''}{data.growthPct}%
          </p>
          <p className="text-[10px] text-[#8B949E] uppercase">Growth</p>
        </div>
      </div>
      {/* Top sellers */}
      <div>
        <p className="text-[10px] text-[#8B949E] uppercase font-semibold mb-1">Top Sellers</p>
        <div className="space-y-1">
          {data.topProducts.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#484F58]">{i + 1}.</span>
                <span className="text-[#C9D1D9]">{p.name}</span>
                <span className="text-[#484F58]">{p.category}</span>
              </div>
              <span className="text-[#F0F6FC] font-medium">{formatCurrency(p.revenue)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Category bars */}
      <div className="space-y-1">
        {data.categoryData.slice(0, 4).map((cat, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="text-[#8B949E] w-20 text-right truncate">{cat.name}</span>
            <div className="flex-1 bg-[#21262D] rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
            </div>
            <span className="text-[#C9D1D9] w-8 text-right">{cat.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Shift Handoff Card ─── */
export function ShiftHandoffCard({ data }) {
  const cashDiff = data.cashStatus.actual - data.cashStatus.expected;
  const cashColor = Math.abs(cashDiff) <= 5 ? '#00C27C' : '#D29922';
  return (
    <div className="mt-2 rounded-lg border border-[#D29922]/30 bg-[#D29922]/[0.06] p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#D29922]" />
        <span className="text-xs font-bold text-[#D29922] uppercase">Shift Handoff</span>
        <span className="ml-auto text-xs text-[#8B949E]">{data.openIssues} open issues</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">{data.metrics.transactions}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Transactions</p>
        </div>
        <div className="bg-[#161B22] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-[#F0F6FC]">${data.metrics.avgBasket}</p>
          <p className="text-[10px] text-[#8B949E] uppercase">Avg Basket</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs p-2 bg-[#161B22] rounded-lg">
        <span className="text-[#8B949E]">Cash Status</span>
        <span style={{ color: cashColor }}>
          ${data.cashStatus.actual.toLocaleString()} vs ${data.cashStatus.expected.toLocaleString()} expected
          ({cashDiff >= 0 ? '+' : ''}{cashDiff.toFixed(2)})
        </span>
      </div>
      {data.inventoryAlerts.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-[#8B949E] uppercase font-semibold">Inventory Alerts</p>
          {data.inventoryAlerts.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#C9D1D9]">
              <Package className="w-3 h-3 text-[#D29922]" />
              {a}
            </div>
          ))}
        </div>
      )}
      {data.notes && (
        <div className="text-xs text-[#8B949E] italic border-t border-[#30363D] pt-2">
          {data.notes}
        </div>
      )}
    </div>
  );
}

/* ─── POS Alert Card ─── */
export function POSAlertCard({ data }) {
  const statusColor = { online: '#00C27C', offline: '#F85149' };
  return (
    <div className="mt-2 rounded-lg border border-[#F85149]/30 bg-[#F85149]/[0.06] p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <Monitor className="w-4 h-4 text-[#F85149]" />
        <span className="text-xs font-bold text-[#F85149] uppercase">POS Terminal Status</span>
      </div>
      <div className="space-y-1.5">
        {data.terminals.map((t, i) => (
          <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${
            t.status === 'offline' ? 'border-[#F85149]/30 bg-[#F85149]/[0.08]' : 'border-[#21262D] bg-[#161B22]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor[t.status] }} />
              <span className="text-xs font-medium text-[#F0F6FC]">{t.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8B949E]">
              {t.status === 'offline' ? (
                <>
                  <span className="text-[#F85149] font-medium">Offline {t.downtime}</span>
                  {t.voids > 0 && <span className="bg-[#F85149]/20 text-[#F85149] rounded px-1.5 py-0.5 font-medium">{t.voids} voids</span>}
                </>
              ) : (
                <span>{t.txns} txns</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {data.speedAlert && (
        <div className="flex items-center gap-2 text-xs p-2 bg-[#D29922]/[0.08] border border-[#D29922]/30 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-[#D29922] flex-shrink-0" />
          <span className="text-[#D29922]">{data.speedAlert}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Compliance Alert Card ─── */
export function ComplianceAlertCard({ data }) {
  return (
    <div className="mt-2 rounded-lg border border-[#A371F7]/30 bg-[#A371F7]/[0.06] p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-[#A371F7]" />
        <span className="text-xs font-bold text-[#A371F7] uppercase">Compliance Status</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs p-2 bg-[#161B22] rounded-lg border border-[#21262D]">
          <span className="text-[#8B949E]">Manifest Due</span>
          <span className="text-[#D29922] font-medium">{data.manifestDue}</span>
        </div>
        <div className="p-2 bg-[#161B22] rounded-lg border border-[#21262D]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#8B949E]">Reconciliation</span>
            <span className="text-[#F0F6FC] font-medium">{data.reconciliationPct}%</span>
          </div>
          <div className="w-full bg-[#21262D] rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-[#00C27C] transition-all" style={{ width: `${data.reconciliationPct}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs p-2 bg-[#161B22] rounded-lg border border-[#21262D]">
          <span className="text-[#8B949E]">License Renewal</span>
          <span className="text-[#00C27C] font-medium">{data.licenseRenewal}</span>
        </div>
        <div className="flex items-center justify-between text-xs p-2 bg-[#161B22] rounded-lg border border-[#21262D]">
          <span className="text-[#8B949E]">Pending Packages</span>
          <span className="text-[#D29922] font-medium">{data.pendingPackages}</span>
        </div>
      </div>
    </div>
  );
}
