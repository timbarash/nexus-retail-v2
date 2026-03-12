import React, { useState } from 'react';
import {
  TrendingUp, AlertTriangle, PhoneCall, Users, Package, DollarSign,
  Zap, Star, MessageSquare, BarChart3, Send, Sparkles, ChevronRight,
  MapPin, ThumbsUp, ThumbsDown, Bot, Mic, ArrowUpRight, ArrowDownRight,
  Minus, Smartphone, QrCode, Monitor, Layers, Radio, Activity,
} from 'lucide-react';

// ==========================================================================
// NEXUS DATA
// ==========================================================================

const NEXUS_DATA = {
  todaySales: 47_820,
  salesGoal: 52_000,
  topStore: 'River North, IL',
  topStoreRevenue: 12_340,
  underperformer: 'Springfield, IL',
  underperformerDelta: -23,
  traffic: { today: 342, yesterday: 318 },

  lowStockAlerts: 7,
  stockoutRisk: 3,
  topLowStock: [
    { product: 'Ozone Cake Mints 3.5g', store: 'River North', daysLeft: 1.5 },
    { product: 'Simply Herb Gummies 100mg', store: 'Fort Lee', daysLeft: 2 },
    { product: 'Tunnel Vision 5-Pack', store: 'Grand Rapids', daysLeft: 0.5 },
  ],

  activeMembers: 18_420,
  atRiskCustomers: 1_247,
  loyaltyScore: 72,
  loyaltyTrend: -3,
  avgVisitFreq: 2.4,

  discountWaste: 4_320,
  underperformingPromos: 3,
  marketPriceGap: '+6%',
  topWastedPromo: '20% Off Edibles (Mon)',

  topBrand: 'Ozone',
  topBrandScore: 82,
  brandFundingAvailable: 2_150,

  voiceCalls: 200,
  voiceOrders: 67,
  voiceRevenue: 6_843,
  voiceAvgOrder: 102,
  voiceResolution: 78,

  // Sentiment
  overallSentiment: 68,
  sentimentDelta: 4,
  positiveReviews: 220,
  neutralReviews: 89,
  negativeReviews: 135,
  totalReviews: 444,
  npsScore: 34,
  npsDelta: 6,
  responseRate: 42,

  sentimentTopics: [
    { topic: 'Staff Friendliness', score: 84, delta: 7, reviews: 62, trend: 'up' },
    { topic: 'Product Quality', score: 76, delta: 2, reviews: 58, trend: 'up' },
    { topic: 'Store Cleanliness', score: 73, delta: 0, reviews: 31, trend: 'flat' },
    { topic: 'Wait Times', score: 38, delta: -5, reviews: 74, trend: 'down' },
    { topic: 'Online Ordering', score: 61, delta: 12, reviews: 45, trend: 'up' },
    { topic: 'Product Selection', score: 70, delta: -1, reviews: 40, trend: 'flat' },
  ],

  locationSentiment: [
    { location: 'River North, IL', score: 78, delta: 6, flag: null },
    { location: 'Fort Lee, NJ', score: 72, delta: 8, flag: 'improving' },
    { location: 'Grand Rapids, MI', score: 65, delta: -3, flag: 'watch' },
    { location: 'Springfield, IL', score: 52, delta: -9, flag: 'alert' },
  ],

  sentimentBySrc: [
    { source: 'Google', reviews: 168, avg: 3.9 },
    { source: 'Leafly', reviews: 112, avg: 4.1 },
    { source: 'Weedmaps', reviews: 87, avg: 3.6 },
    { source: 'Dutchie', reviews: 77, avg: 4.3 },
  ],

  sentimentActions: [
    { priority: 'high', action: 'Springfield IL: SMS surveys + QR data show wait time complaints in 68% of negative feedback — add 2 afternoon staff', impact: 'Est. +8pt unified sentiment lift' },
    { priority: 'high', action: 'Voice CSAT at Springfield is 3.1 vs 4.5 elsewhere — accent recognition model needs tuning for Central IL dialect', impact: 'Est. +1.2 CSAT improvement' },
    { priority: 'medium', action: 'River North first-party score (82) is 8pts above Google Reviews (74) — prompt happy SMS respondents to leave public reviews', impact: 'Est. +0.4 Google star rating' },
    { priority: 'medium', action: 'Reddit sentiment on Select brand dropped 15% — confirmed by 23% of SMS respondents mentioning "expensive"', impact: 'Price adjustment or promotion needed' },
    { priority: 'low', action: 'Kiosk reactions capture 3.2x more data than ecomm — move emoji prompt to the "order confirmed" screen on ecomm', impact: 'Est. +40% reaction capture rate' },
  ],

  // SMS Micro-Surveys
  smsChannel: {
    sent: 1_842,
    responded: 926,
    responseRate: 50.3,
    avgSentiment: 74,
    sentimentDelta: 6,
    todaySent: 48,
    todayResponded: 26,
    topInsight: 'Budtender recommendations driving repeat purchases — 62% of positive SMS mentions staff by name.',
    recentConversations: [
      {
        store: 'River North',
        time: '2:34 PM',
        messages: [
          { from: 'system', text: 'How was your experience at River North today? Reply with a quick thought.' },
          { from: 'customer', text: "Great! Marcus recommended the Ozone gummies and they're exactly what I needed. Will be back." },
        ],
        sentiment: 'positive',
        mappedTo: { budtender: 'Marcus T.', product: 'Ozone Cake Mints Gummies', txnId: 'TXN-8834' },
      },
      {
        store: 'Springfield',
        time: '1:12 PM',
        messages: [
          { from: 'system', text: "How was your visit to Springfield today? We'd love to hear." },
          { from: 'customer', text: 'Waited 20 min even though I ordered ahead online. Pretty frustrating.' },
        ],
        sentiment: 'negative',
        mappedTo: { budtender: 'Jamie R.', product: null, txnId: 'TXN-8821' },
      },
      {
        store: 'Fort Lee',
        time: '11:45 AM',
        messages: [
          { from: 'system', text: 'How was your pickup at Fort Lee today? Quick reply is all we need!' },
          { from: 'customer', text: 'Smooth and fast. Love the new online ordering flow too.' },
        ],
        sentiment: 'positive',
        mappedTo: { budtender: 'Alex K.', product: null, txnId: 'TXN-8807' },
      },
    ],
  },

  // Ecomm/Kiosk Reactions
  ecommChannel: {
    totalReactions: 3_214,
    withFreeText: 486,
    freeTextRate: 15.1,
    reactionsToday: 87,
    breakdown: [
      { emoji: '\u{1F929}', label: 'Love it', count: 1_286, pct: 40 },
      { emoji: '\u{1F60A}', label: 'Good', count: 1_028, pct: 32 },
      { emoji: '\u{1F610}', label: 'Meh', count: 579, pct: 18 },
      { emoji: '\u{1F612}', label: 'Not great', count: 321, pct: 10 },
    ],
    topProductSentiment: [
      { product: 'Ozone Cake Mints 3.5g', loves: 84, goods: 31, mehs: 5, bads: 2, score: 91 },
      { product: 'Select Elite Cart 1g', loves: 62, goods: 28, mehs: 12, bads: 8, score: 74 },
      { product: 'Simply Herb Gummies', loves: 44, goods: 38, mehs: 18, bads: 14, score: 63 },
    ],
    topInsight: 'Kiosk users leave 3.2x more reactions than ecomm — place feedback prompt on the "order confirmed" screen for maximum capture.',
  },

  // Voice AI CSAT
  voiceSurveyChannel: {
    surveyed: 156,
    completed: 141,
    completionRate: 90.4,
    avgCsat: 4.2,
    csatDelta: 0.3,
    distribution: [
      { rating: 5, count: 68, pct: 48.2 },
      { rating: 4, count: 39, pct: 27.7 },
      { rating: 3, count: 19, pct: 13.5 },
      { rating: 2, count: 10, pct: 7.1 },
      { rating: 1, count: 5, pct: 3.5 },
    ],
    recentVerbatim: [
      { rating: 5, text: 'The AI was super helpful, got my order placed in like 30 seconds. Way better than waiting on hold.', store: 'Grand Rapids' },
      { rating: 2, text: "Couldn't understand me when I asked about strain effects. Had to repeat myself three times.", store: 'Springfield' },
      { rating: 4, text: 'Quick and easy. Would be nice if it remembered my usual order though.', store: 'Fort Lee' },
    ],
    topInsight: 'Voice CSAT at Springfield is 3.1 vs 4.5 at other stores — accent recognition model needs tuning for Central IL dialect.',
  },

  // QR Code Captures
  qrChannel: {
    printed: 5_420,
    scanned: 423,
    completed: 287,
    scanRate: 7.8,
    completionRate: 67.8,
    avgScore: 4.1,
    topStore: { name: 'River North', scanRate: 12.3 },
    worstStore: { name: 'Grand Rapids', scanRate: 3.1 },
    budtenderLeaderboard: [
      { name: 'Marcus T.', store: 'River North', surveys: 34, avgScore: 4.8, topComment: 'Always knows exactly what to recommend' },
      { name: 'Alex K.', store: 'Fort Lee', surveys: 28, avgScore: 4.6, topComment: 'Super patient and knowledgeable' },
      { name: 'Jamie R.', store: 'Springfield', surveys: 19, avgScore: 3.2, topComment: "Seemed rushed, didn't answer my questions" },
    ],
    topInsight: 'QR surveys with budtender auto-mapping reveal Jamie R. at Springfield is tied to 68% of negative feedback — coaching opportunity.',
  },

  // Unified Pipeline
  unifiedPipeline: {
    totalSignals: 5_314,
    firstPartySignals: 2_380,
    thirdPartySignals: 2_934,
    firstPartyPct: 44.8,
    unifiedScore: 71,
    unifiedDelta: 5,
    channelScores: [
      { channel: 'SMS Micro-Surveys', type: 'first-party', signals: 926, score: 74, icon: 'sms' },
      { channel: 'Ecomm/Kiosk Reactions', type: 'first-party', signals: 3_214, score: 72, icon: 'ecomm' },
      { channel: 'Voice AI CSAT', type: 'first-party', signals: 141, score: 76, icon: 'voice' },
      { channel: 'QR Receipt Surveys', type: 'first-party', signals: 287, score: 68, icon: 'qr' },
      { channel: 'Google Reviews', type: 'third-party', signals: 168, score: 64, icon: 'google' },
      { channel: 'Leafly', type: 'third-party', signals: 112, score: 72, icon: 'leafly' },
      { channel: 'Weedmaps', type: 'third-party', signals: 87, score: 58, icon: 'weedmaps' },
      { channel: 'Reddit', type: 'third-party', signals: 203, score: 52, icon: 'reddit' },
      { channel: 'Dutchie Reviews', type: 'third-party', signals: 77, score: 78, icon: 'dutchie' },
    ],
    divergences: [
      { store: 'Springfield, IL', firstParty: 48, thirdParty: 61, delta: -13, insight: 'In-store NPS is 48, but Google Reviews show 61 — customers leaving positive public reviews but negative private feedback about wait times.' },
      { store: 'River North, IL', firstParty: 82, thirdParty: 74, delta: 8, insight: 'First-party signals 8pts higher — happy customers not leaving public reviews. Prompt top SMS respondents to post on Google.' },
    ],
    keyInsight: 'Your in-store NPS is 72, but Reddit sentiment on your Select brand dropped 15% this month — price complaints on r/ILTrees driving it. First-party SMS data confirms: 23% of Select purchasers mention "expensive" in post-purchase feedback.',
  },
};

// ==========================================================================
// SHARED COMPONENTS
// ==========================================================================

function NexusTile({ children, className = '', span = 1 }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md ${span === 2 ? 'lg:col-span-2' : ''} ${className}`}>
      {children}
    </div>
  );
}

function TileHeader({ icon: Icon, title, subtitle, action, actionLabel, iconBg = 'bg-dutchie-50 text-dutchie-900' }) {
  return (
    <div className="flex items-start justify-between border-b border-gray-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-navy-800">{title}</h3>
          {subtitle && <p className="text-xs text-panel-300">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button onClick={action} className="flex items-center gap-1 rounded-lg bg-gold-500 px-3 py-1.5 text-xs font-semibold text-navy-800 transition-colors hover:bg-gold-400">
          {actionLabel}<ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function StatRow({ label, value, sub, trend, color }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-panel-300">{label}</span>
      <div className="text-right">
        <span className={`text-lg font-bold ${color || 'text-navy-800'}`}>{value}</span>
        {sub && <p className="text-[11px] text-panel-300">{sub}</p>}
        {trend !== undefined && (
          <span className={`ml-2 text-xs font-medium ${trend >= 0 ? 'text-dutchie-300' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}

function TrendIcon({ trend }) {
  if (trend === 'up') return <ArrowUpRight size={12} className="text-green-500" />;
  if (trend === 'down') return <ArrowDownRight size={12} className="text-red-500" />;
  return <Minus size={12} className="text-gray-400" />;
}

// ==========================================================================
// AGENT BAR
// ==========================================================================

function AgentBar() {
  const [prompt, setPrompt] = useState('');
  const suggestions = [
    'Show me which stores have the biggest gap between first-party and public sentiment',
    'Draft a win-back SMS for lapsed customers at Springfield',
    'What are the top product complaints from Voice AI calls this week?',
  ];
  return (
    <div className="rounded-2xl border border-navy-100 bg-gradient-to-r from-navy-800 to-navy-900 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500">
          <Bot size={20} className="text-navy-800" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Dutchie Agent</h3>
          <p className="text-xs text-navy-300">Ask anything, execute any action</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Create a promo for slow-moving edibles at Fort Lee..."
          className="flex-1 rounded-xl border border-navy-600 bg-navy-700/50 px-4 py-3 text-sm text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500" />
        <button className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-800 transition-colors hover:bg-gold-400">
          <Send size={16} />Run
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setPrompt(s)}
            className="rounded-full border border-navy-600 px-3 py-1 text-[11px] text-navy-300 transition-colors hover:border-gold-500 hover:text-gold-400">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
// SALES TILE
// ==========================================================================

function SalesTodayTile() {
  const pct = Math.round((NEXUS_DATA.todaySales / NEXUS_DATA.salesGoal) * 100);
  return (
    <NexusTile span={2}>
      <TileHeader icon={BarChart3} title="Contextualized Insights" subtitle="Real-time performance across all locations" />
      <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-panel-300">Today's Sales</p>
          <p className="mt-1 text-3xl font-bold text-navy-800">${NEXUS_DATA.todaySales.toLocaleString()}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-dutchie-300 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-panel-300">{pct}% of ${NEXUS_DATA.salesGoal.toLocaleString()} goal</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-panel-300">Top Store</p>
          <p className="mt-1 text-lg font-bold text-navy-800">{NEXUS_DATA.topStore}</p>
          <p className="text-sm text-dutchie-300">${NEXUS_DATA.topStoreRevenue.toLocaleString()} today</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-panel-300">Traffic</p>
          <p className="mt-1 text-3xl font-bold text-navy-800">{NEXUS_DATA.traffic.today}</p>
          <p className="text-xs text-dutchie-300"><TrendingUp size={12} className="inline mr-0.5" />+{NEXUS_DATA.traffic.today - NEXUS_DATA.traffic.yesterday} vs yesterday</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-red-600">Needs Attention</p>
          <p className="mt-1 text-lg font-bold text-red-700">{NEXUS_DATA.underperformer}</p>
          <p className="text-sm text-red-600">{NEXUS_DATA.underperformerDelta}% below avg</p>
          <button className="mt-2 rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">Investigate</button>
        </div>
      </div>
    </NexusTile>
  );
}

// ==========================================================================
// CONSUMER SENTIMENT TILE (full-width)
// ==========================================================================

function SentimentTile() {
  const priorityStyles = { high: 'border-red-200 bg-red-50', medium: 'border-amber-200 bg-amber-50', low: 'border-blue-200 bg-blue-50' };
  const priorityDot = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-blue-500' };

  return (
    <NexusTile span={2}>
      <TileHeader icon={MessageSquare} title="Consumer Sentiment Intelligence"
        subtitle={`${NEXUS_DATA.unifiedPipeline.totalSignals.toLocaleString()} signals across ${NEXUS_DATA.unifiedPipeline.channelScores.length} channels — first-party + third-party`}
        iconBg="bg-navy-50 text-navy-600" action={() => {}} actionLabel="Deep Dive" />
      <div className="p-6">
        <div className="grid gap-6 sm:grid-cols-3 mb-6">
          {/* Score gauge */}
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#6ABA48" strokeWidth="8"
                  strokeDasharray={`${(NEXUS_DATA.overallSentiment / 100) * 251.3} 251.3`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-2xl font-bold text-navy-800">{NEXUS_DATA.overallSentiment}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-800">Overall Sentiment</p>
              <p className="flex items-center gap-1 text-xs text-dutchie-300 font-medium"><TrendingUp size={12} />+{NEXUS_DATA.sentimentDelta} pts this month</p>
              <div className="mt-2 flex gap-3">
                <div>
                  <p className="text-lg font-bold text-navy-800">{NEXUS_DATA.npsScore}</p>
                  <p className="text-[10px] text-panel-300 uppercase tracking-wide">NPS</p>
                </div>
                <div className="border-l border-gray-200 pl-3">
                  <p className="text-lg font-bold text-dutchie-300">+{NEXUS_DATA.npsDelta}</p>
                  <p className="text-[10px] text-panel-300 uppercase tracking-wide">vs last mo</p>
                </div>
              </div>
            </div>
          </div>
          {/* Review volume */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Review Volume</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-2xl font-bold text-navy-800">{NEXUS_DATA.totalReviews}</span>
              <span className="text-xs text-panel-300 mb-1">this month</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div className="bg-green-400" style={{ width: `${(NEXUS_DATA.positiveReviews / NEXUS_DATA.totalReviews) * 100}%` }} />
              <div className="bg-gray-300" style={{ width: `${(NEXUS_DATA.neutralReviews / NEXUS_DATA.totalReviews) * 100}%` }} />
              <div className="bg-red-400" style={{ width: `${(NEXUS_DATA.negativeReviews / NEXUS_DATA.totalReviews) * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px]">
              <span className="flex items-center gap-1 text-green-600"><ThumbsUp size={10} /> {NEXUS_DATA.positiveReviews} positive</span>
              <span className="text-gray-400">{NEXUS_DATA.neutralReviews} neutral</span>
              <span className="flex items-center gap-1 text-red-500"><ThumbsDown size={10} /> {NEXUS_DATA.negativeReviews} negative</span>
            </div>
            <p className="mt-2 text-xs text-panel-300">Response rate: <span className="font-semibold text-navy-800">{NEXUS_DATA.responseRate}%</span></p>
          </div>
          {/* Source breakdown */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">By Platform</p>
            <div className="space-y-2">
              {NEXUS_DATA.sentimentBySrc.map((s) => (
                <div key={s.source} className="flex items-center justify-between">
                  <span className="text-sm text-navy-800">{s.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-panel-300">{s.reviews} reviews</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} size={10} className={star <= Math.round(s.avg) ? 'text-gold-500 fill-gold-500' : 'text-gray-200'} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-navy-800 w-6 text-right">{s.avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topics + Locations */}
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Topic Breakdown</p>
            <div className="space-y-2.5">
              {NEXUS_DATA.sentimentTopics.map((t) => (
                <div key={t.topic}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5"><TrendIcon trend={t.trend} /><span className="text-sm text-navy-800">{t.topic}</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-panel-300">{t.reviews} mentions</span>
                      <span className={`text-xs font-bold ${t.score >= 60 ? 'text-green-600' : 'text-red-500'}`}>{t.score}</span>
                      <span className={`text-[11px] font-medium ${t.delta > 0 ? 'text-green-500' : t.delta < 0 ? 'text-red-500' : 'text-gray-400'}`}>{t.delta > 0 ? '+' : ''}{t.delta}</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full transition-all ${t.score >= 70 ? 'bg-green-400' : t.score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${t.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">By Location</p>
            <div className="space-y-2">
              {NEXUS_DATA.locationSentiment.map((loc) => (
                <div key={loc.location} className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
                  loc.flag === 'alert' ? 'bg-red-50 border border-red-100' : loc.flag === 'watch' ? 'bg-amber-50 border border-amber-100' : loc.flag === 'improving' ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={loc.flag === 'alert' ? 'text-red-500' : loc.flag === 'watch' ? 'text-amber-500' : loc.flag === 'improving' ? 'text-green-500' : 'text-navy-400'} />
                    <div>
                      <p className="text-sm font-medium text-navy-800">{loc.location}</p>
                      {loc.flag === 'alert' && <p className="text-[10px] text-red-600 font-medium uppercase">Needs attention</p>}
                      {loc.flag === 'improving' && <p className="text-[10px] text-green-600 font-medium uppercase">Improving</p>}
                      {loc.flag === 'watch' && <p className="text-[10px] text-amber-600 font-medium uppercase">Watch</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${loc.score >= 65 ? 'text-navy-800' : 'text-red-600'}`}>{loc.score}</span>
                    <p className={`text-xs font-medium ${loc.delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>{loc.delta >= 0 ? '+' : ''}{loc.delta} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <div className="flex items-center gap-2 mb-3"><Sparkles size={14} className="text-gold-500" /><p className="text-xs font-medium uppercase tracking-wider text-panel-300">AI-Powered Suggestions</p></div>
          <div className="space-y-2">
            {NEXUS_DATA.sentimentActions.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${priorityStyles[item.priority]}`}>
                <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${priorityDot[item.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-800">{item.action}</p>
                  <p className="mt-0.5 text-xs text-panel-300 font-medium">{item.impact}</p>
                </div>
                <button className="flex-shrink-0 rounded-lg bg-white/80 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-white transition-colors">Execute</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NexusTile>
  );
}

// ==========================================================================
// OMNICHANNEL SENTIMENT COLLECTION TILE
// ==========================================================================

function OmnichannelTile() {
  const [activeTab, setActiveTab] = useState('sms');
  const tabs = [
    { id: 'sms', label: 'SMS Surveys', icon: Smartphone },
    { id: 'ecomm', label: 'Ecomm/Kiosk', icon: Monitor },
    { id: 'voice', label: 'Voice CSAT', icon: Mic },
    { id: 'qr', label: 'QR Captures', icon: QrCode },
  ];

  return (
    <NexusTile span={2}>
      <TileHeader icon={Radio} title="Omnichannel Sentiment Collection"
        subtitle="Proprietary first-party signals — no competitor can replicate this"
        iconBg="bg-violet-50 text-violet-600" action={() => {}} actionLabel="Configure Channels" />
      <div className="p-6">
        {/* Tab selector cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {tabs.map(({ id, label, icon: TabIcon }) => {
            const isActive = activeTab === id;
            const stats = {
              sms: { signals: NEXUS_DATA.smsChannel.responded, rate: `${NEXUS_DATA.smsChannel.responseRate}%`, rateLabel: 'response' },
              ecomm: { signals: NEXUS_DATA.ecommChannel.totalReactions, rate: `${NEXUS_DATA.ecommChannel.freeTextRate}%`, rateLabel: 'w/ text' },
              voice: { signals: NEXUS_DATA.voiceSurveyChannel.completed, rate: `${NEXUS_DATA.voiceSurveyChannel.avgCsat}/5`, rateLabel: 'avg CSAT' },
              qr: { signals: NEXUS_DATA.qrChannel.completed, rate: `${NEXUS_DATA.qrChannel.scanRate}%`, rateLabel: 'scan rate' },
            }[id];
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`rounded-xl border p-3 text-left transition-all ${isActive ? 'border-violet-300 bg-violet-50 ring-1 ring-violet-200' : 'border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TabIcon size={14} className={isActive ? 'text-violet-600' : 'text-panel-300'} />
                  <span className={`text-xs font-semibold ${isActive ? 'text-violet-700' : 'text-panel-300'}`}>{label}</span>
                </div>
                <p className="text-xl font-bold text-navy-800">{stats.signals.toLocaleString()}</p>
                <p className="text-[11px] text-panel-300">{stats.rate} {stats.rateLabel}</p>
              </button>
            );
          })}
        </div>

        {/* SMS Tab */}
        {activeTab === 'sms' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Live Conversation Feed</p>
              <div className="space-y-3">
                {NEXUS_DATA.smsChannel.recentConversations.map((convo, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${convo.sentiment === 'positive' ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><MapPin size={12} className="text-panel-300" /><span className="text-xs font-medium text-navy-800">{convo.store}</span></div>
                      <span className="text-[11px] text-panel-300">{convo.time}</span>
                    </div>
                    {convo.messages.map((msg, j) => (
                      <div key={j} className={`flex ${msg.from === 'system' ? 'justify-start' : 'justify-end'} mb-1`}>
                        <div className={`rounded-lg px-3 py-1.5 text-xs max-w-[85%] ${msg.from === 'system' ? 'bg-navy-800 text-white' : convo.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {convo.mappedTo && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {convo.mappedTo.budtender && <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[10px] text-panel-300">Staff: {convo.mappedTo.budtender}</span>}
                        {convo.mappedTo.product && <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[10px] text-panel-300">Product: {convo.mappedTo.product}</span>}
                        <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[10px] text-panel-300">{convo.mappedTo.txnId}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Channel Stats</p>
              <div className="space-y-2 mb-4">
                <StatRow label="Surveys Sent" value={NEXUS_DATA.smsChannel.sent.toLocaleString()} sub="this month" />
                <StatRow label="Responses" value={NEXUS_DATA.smsChannel.responded.toLocaleString()} sub={`${NEXUS_DATA.smsChannel.responseRate}% rate`} />
                <StatRow label="Avg Sentiment" value={NEXUS_DATA.smsChannel.avgSentiment} trend={NEXUS_DATA.smsChannel.sentimentDelta} />
                <StatRow label="Today" value={`${NEXUS_DATA.smsChannel.todayResponded}/${NEXUS_DATA.smsChannel.todaySent}`} sub="responded/sent" />
              </div>
              <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
                <div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-violet-600" /><span className="text-xs font-semibold text-violet-700">AI Insight</span></div>
                <p className="text-xs text-violet-800">{NEXUS_DATA.smsChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ecomm/Kiosk Tab */}
        {activeTab === 'ecomm' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Reaction Distribution</p>
              <div className="space-y-3 mb-4">
                {NEXUS_DATA.ecommChannel.breakdown.map((r) => (
                  <div key={r.emoji}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2"><span className="text-lg">{r.emoji}</span><span className="text-sm text-navy-800">{r.label}</span></div>
                      <span className="text-sm font-bold text-navy-800">{r.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full transition-all ${r.emoji === '\u{1F929}' ? 'bg-green-400' : r.emoji === '\u{1F60A}' ? 'bg-emerald-300' : r.emoji === '\u{1F610}' ? 'bg-amber-300' : 'bg-red-400'}`} style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-panel-300"><span className="font-semibold text-navy-800">{NEXUS_DATA.ecommChannel.withFreeText.toLocaleString()}</span> reactions included free-text feedback ({NEXUS_DATA.ecommChannel.freeTextRate}%)</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Product-Level Sentiment</p>
              <div className="space-y-3 mb-4">
                {NEXUS_DATA.ecommChannel.topProductSentiment.map((p) => (
                  <div key={p.product} className="rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-navy-800">{p.product}</span>
                      <span className={`text-sm font-bold ${p.score >= 75 ? 'text-green-600' : p.score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{p.score}</span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-panel-300">
                      <span>{'\u{1F929}'} {p.loves}</span><span>{'\u{1F60A}'} {p.goods}</span><span>{'\u{1F610}'} {p.mehs}</span><span>{'\u{1F612}'} {p.bads}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
                <div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-violet-600" /><span className="text-xs font-semibold text-violet-700">AI Insight</span></div>
                <p className="text-xs text-violet-800">{NEXUS_DATA.ecommChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}

        {/* Voice CSAT Tab */}
        {activeTab === 'voice' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">CSAT Distribution</p>
              <div className="flex items-end gap-6 mb-4">
                <div>
                  <p className="text-4xl font-bold text-navy-800">{NEXUS_DATA.voiceSurveyChannel.avgCsat}</p>
                  <p className="text-xs text-panel-300">Avg CSAT (1-5)</p>
                  <p className="text-xs font-medium text-green-500">+{NEXUS_DATA.voiceSurveyChannel.csatDelta} this month</p>
                </div>
                <div className="flex-1">
                  {NEXUS_DATA.voiceSurveyChannel.distribution.map((d) => (
                    <div key={d.rating} className="flex items-center gap-2 mb-1">
                      <span className="w-4 text-xs text-right text-panel-300">{d.rating}</span>
                      <div className="flex-1 h-3 overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full rounded-full ${d.rating >= 4 ? 'bg-green-400' : d.rating === 3 ? 'bg-amber-300' : 'bg-red-400'}`} style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="w-10 text-xs text-panel-300 text-right">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 text-xs text-panel-300">
                <span>Surveyed: <span className="font-semibold text-navy-800">{NEXUS_DATA.voiceSurveyChannel.surveyed}</span></span>
                <span>Completed: <span className="font-semibold text-navy-800">{NEXUS_DATA.voiceSurveyChannel.completed}</span></span>
                <span>Rate: <span className="font-semibold text-navy-800">{NEXUS_DATA.voiceSurveyChannel.completionRate}%</span></span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Recent Verbatim</p>
              <div className="space-y-3 mb-4">
                {NEXUS_DATA.voiceSurveyChannel.recentVerbatim.map((v, i) => (
                  <div key={i} className={`rounded-lg border p-3 ${v.rating >= 4 ? 'border-green-100 bg-green-50/30' : v.rating <= 2 ? 'border-red-100 bg-red-50/30' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((s) => (<Star key={s} size={10} className={s <= v.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-200'} />))}
                      </div>
                      <span className="text-[11px] text-panel-300">{v.store}</span>
                    </div>
                    <p className="text-xs text-navy-800 italic">"{v.text}"</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
                <div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-violet-600" /><span className="text-xs font-semibold text-violet-700">AI Insight</span></div>
                <p className="text-xs text-violet-800">{NEXUS_DATA.voiceSurveyChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}

        {/* QR Tab */}
        {activeTab === 'qr' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Budtender Leaderboard</p>
              <div className="space-y-2 mb-4">
                {NEXUS_DATA.qrChannel.budtenderLeaderboard.map((b, i) => (
                  <div key={b.name} className={`rounded-lg border p-3 ${i === 0 ? 'border-gold-200 bg-gold-50/30' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-gold-500 text-white' : i === 1 ? 'bg-gray-300 text-white' : 'bg-orange-300 text-white'}`}>{i + 1}</div>
                        <div><span className="text-sm font-medium text-navy-800">{b.name}</span><span className="text-[11px] text-panel-300 ml-2">{b.store}</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-panel-300">{b.surveys} surveys</span>
                        <span className={`text-sm font-bold ${b.avgScore >= 4 ? 'text-green-600' : b.avgScore >= 3 ? 'text-amber-600' : 'text-red-500'}`}>{b.avgScore}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-panel-300 italic ml-8">"{b.topComment}"</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-panel-300 mb-3">Channel Stats</p>
              <div className="space-y-2 mb-4">
                <StatRow label="QR Codes Printed" value={NEXUS_DATA.qrChannel.printed.toLocaleString()} />
                <StatRow label="Scans" value={NEXUS_DATA.qrChannel.scanned} sub={`${NEXUS_DATA.qrChannel.scanRate}% scan rate`} />
                <StatRow label="Completions" value={NEXUS_DATA.qrChannel.completed} sub={`${NEXUS_DATA.qrChannel.completionRate}% completion`} />
                <StatRow label="Avg Score" value={`${NEXUS_DATA.qrChannel.avgScore}/5`} />
              </div>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 rounded-lg border border-green-100 bg-green-50/30 p-2.5 text-center">
                  <p className="text-xs text-panel-300">Best scan rate</p>
                  <p className="text-sm font-bold text-green-600">{NEXUS_DATA.qrChannel.topStore.name}</p>
                  <p className="text-xs text-green-600">{NEXUS_DATA.qrChannel.topStore.scanRate}%</p>
                </div>
                <div className="flex-1 rounded-lg border border-red-100 bg-red-50/30 p-2.5 text-center">
                  <p className="text-xs text-panel-300">Lowest scan rate</p>
                  <p className="text-sm font-bold text-red-500">{NEXUS_DATA.qrChannel.worstStore.name}</p>
                  <p className="text-xs text-red-500">{NEXUS_DATA.qrChannel.worstStore.scanRate}%</p>
                </div>
              </div>
              <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
                <div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-violet-600" /><span className="text-xs font-semibold text-violet-700">AI Insight</span></div>
                <p className="text-xs text-violet-800">{NEXUS_DATA.qrChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </NexusTile>
  );
}

// ==========================================================================
// UNIFIED SENTIMENT PIPELINE TILE
// ==========================================================================

function UnifiedPipelineTile() {
  const d = NEXUS_DATA.unifiedPipeline;
  const firstParty = d.channelScores.filter((c) => c.type === 'first-party');
  const thirdParty = d.channelScores.filter((c) => c.type === 'third-party');
  const channelIcons = { sms: Smartphone, ecomm: Monitor, voice: Mic, qr: QrCode, google: Star, leafly: Star, weedmaps: Star, reddit: MessageSquare, dutchie: Star };

  return (
    <NexusTile span={2}>
      <TileHeader icon={Layers} title="Unified Sentiment Pipeline"
        subtitle={`${d.totalSignals.toLocaleString()} signals from ${d.channelScores.length} channels — first-party + third-party merged`}
        iconBg="bg-indigo-50 text-indigo-600" />
      <div className="p-6">
        {/* Hero insight */}
        <div className="rounded-xl bg-gradient-to-r from-navy-800 to-navy-900 p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold-500"><Sparkles size={18} className="text-navy-800" /></div>
            <div>
              <p className="text-sm font-semibold text-gold-400 mb-1">The Unified View</p>
              <p className="text-sm text-gray-300 leading-relaxed">{d.keyInsight}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Unified score */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center mb-3">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="56" cy="56" r="48" fill="none" stroke="#6ABA48" strokeWidth="10"
                  strokeDasharray={`${(d.unifiedScore / 100) * 301.6} 301.6`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-3xl font-bold text-navy-800">{d.unifiedScore}</span>
            </div>
            <p className="text-sm font-semibold text-navy-800">Unified Sentiment Score</p>
            <p className="text-xs font-medium text-green-500">+{d.unifiedDelta} pts this month</p>
            <div className="mt-3 flex gap-4 text-center">
              <div><p className="text-lg font-bold text-violet-600">{d.firstPartyPct}%</p><p className="text-[10px] text-panel-300 uppercase">First-party</p></div>
              <div className="border-l border-gray-200 pl-4"><p className="text-lg font-bold text-blue-600">{(100 - d.firstPartyPct).toFixed(1)}%</p><p className="text-[10px] text-panel-300 uppercase">Third-party</p></div>
            </div>
          </div>

          {/* Channel breakdown */}
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3"><div className="h-2 w-2 rounded-full bg-violet-500" /><p className="text-xs font-semibold uppercase tracking-wider text-violet-600">First-Party (Proprietary)</p></div>
              <div className="space-y-2">
                {firstParty.map((c) => { const Icon = channelIcons[c.icon]; return (
                  <div key={c.channel} className="flex items-center justify-between rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2">
                    <div className="flex items-center gap-2"><Icon size={12} className="text-violet-500" /><span className="text-sm text-navy-800">{c.channel}</span></div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-panel-300">{c.signals.toLocaleString()}</span>
                      <span className={`text-sm font-bold ${c.score >= 70 ? 'text-green-600' : c.score >= 55 ? 'text-amber-600' : 'text-red-500'}`}>{c.score}</span>
                    </div>
                  </div>
                ); })}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3"><div className="h-2 w-2 rounded-full bg-blue-500" /><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Third-Party (Scraped)</p></div>
              <div className="space-y-2">
                {thirdParty.map((c) => { const Icon = channelIcons[c.icon]; return (
                  <div key={c.channel} className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/30 px-3 py-2">
                    <div className="flex items-center gap-2"><Icon size={12} className="text-blue-500" /><span className="text-sm text-navy-800">{c.channel}</span></div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-panel-300">{c.signals.toLocaleString()}</span>
                      <span className={`text-sm font-bold ${c.score >= 70 ? 'text-green-600' : c.score >= 55 ? 'text-amber-600' : 'text-red-500'}`}>{c.score}</span>
                    </div>
                  </div>
                ); })}
              </div>
            </div>
          </div>
        </div>

        {/* Signal Divergences */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3"><Activity size={14} className="text-amber-500" /><p className="text-xs font-medium uppercase tracking-wider text-panel-300">Signal Divergences — Where First-Party ≠ Third-Party</p></div>
          <div className="space-y-2">
            {d.divergences.map((div, i) => (
              <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/30 px-4 py-3">
                <div className="flex items-center gap-4 mb-1.5">
                  <span className="text-sm font-semibold text-navy-800">{div.store}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700 font-medium">1st: {div.firstParty}</span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 font-medium">3rd: {div.thirdParty}</span>
                    <span className={`font-bold ${div.delta > 0 ? 'text-green-600' : 'text-red-500'}`}>{div.delta > 0 ? '+' : ''}{div.delta} gap</span>
                  </div>
                </div>
                <p className="text-xs text-amber-800">{div.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NexusTile>
  );
}

// ==========================================================================
// VOICE AI TILE
// ==========================================================================

function VoiceAITile() {
  return (
    <NexusTile>
      <TileHeader icon={PhoneCall} title="Voice AI Ordering" subtitle="Dutchie Voice AI performance" iconBg="bg-gold-50 text-gold-700" action={() => {}} actionLabel="Deep Dive" />
      <div className="p-6 space-y-1">
        <StatRow label="Total Calls" value={NEXUS_DATA.voiceCalls} />
        <StatRow label="Orders Placed" value={NEXUS_DATA.voiceOrders} sub={`${Math.round((NEXUS_DATA.voiceOrders / NEXUS_DATA.voiceCalls) * 100)}% conversion`} />
        <StatRow label="Voice Revenue" value={`$${NEXUS_DATA.voiceRevenue.toLocaleString()}`} color="text-dutchie-300" />
        <StatRow label="Avg Order" value={`$${NEXUS_DATA.voiceAvgOrder}`} />
        <StatRow label="Resolution" value={`${NEXUS_DATA.voiceResolution}%`} />
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-dutchie-50 p-3">
          <Bot size={16} className="text-dutchie-400" />
          <p className="text-xs text-dutchie-800"><span className="font-semibold">AI Insight:</span> Voice orders have 18% higher AOV than online orders. Consider promoting phone ordering during peak hours.</p>
        </div>
      </div>
    </NexusTile>
  );
}

// ==========================================================================
// REMAINING TILES
// ==========================================================================

function InventoryTile() {
  return (
    <NexusTile>
      <TileHeader icon={Package} title="Inventory & Reordering" subtitle={`${NEXUS_DATA.lowStockAlerts} low-stock alerts`} iconBg="bg-orange-50 text-orange-600" action={() => {}} actionLabel="Draft Reorder" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100"><AlertTriangle size={24} className="text-red-600" /></div>
          <div><p className="text-2xl font-bold text-red-600">{NEXUS_DATA.stockoutRisk}</p><p className="text-xs text-panel-300">Products at stockout risk</p></div>
        </div>
        <div className="space-y-3">
          {NEXUS_DATA.topLowStock.map((item) => (
            <div key={item.product} className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50/50 px-3 py-2">
              <div><p className="text-sm font-medium text-navy-800">{item.product}</p><p className="text-xs text-panel-300">{item.store}</p></div>
              <p className={`text-sm font-bold ${item.daysLeft <= 1 ? 'text-red-600' : 'text-orange-600'}`}>{item.daysLeft}d left</p>
            </div>
          ))}
        </div>
      </div>
    </NexusTile>
  );
}

function LoyaltyTile() {
  return (
    <NexusTile>
      <TileHeader icon={Users} title="Loyalty Score" subtitle="Customer retention health" iconBg="bg-purple-50 text-purple-600" action={() => {}} actionLabel="Win-back Campaign" />
      <div className="p-6 space-y-1">
        <StatRow label="Active Members" value={NEXUS_DATA.activeMembers.toLocaleString()} />
        <StatRow label="Loyalty Score" value={NEXUS_DATA.loyaltyScore} trend={NEXUS_DATA.loyaltyTrend} />
        <StatRow label="Avg Visit Freq" value={`${NEXUS_DATA.avgVisitFreq}x/mo`} />
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50/50 p-3">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><AlertTriangle size={14} className="text-red-500" /><span className="text-sm font-semibold text-red-700">At-risk customers</span></div><span className="text-lg font-bold text-red-600">{NEXUS_DATA.atRiskCustomers.toLocaleString()}</span></div>
          <p className="mt-1 text-xs text-red-600">Haven't visited in 30+ days</p>
        </div>
      </div>
    </NexusTile>
  );
}

function PricingTile() {
  return (
    <NexusTile>
      <TileHeader icon={DollarSign} title="Pricing & Discounts" subtitle="Margin protection" iconBg="bg-emerald-50 text-emerald-600" action={() => {}} actionLabel="Optimize" />
      <div className="p-6 space-y-1">
        <StatRow label="Market Price Gap" value={NEXUS_DATA.marketPriceGap} sub="Above local avg" />
        <StatRow label="Discount Waste" value={`$${NEXUS_DATA.discountWaste.toLocaleString()}`} color="text-red-500" sub="No ROI impact" />
        <StatRow label="Underperforming Promos" value={NEXUS_DATA.underperformingPromos} />
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 p-3">
          <Zap size={16} className="text-amber-600" />
          <p className="text-xs text-amber-800"><span className="font-semibold">Suggestion:</span> Kill "{NEXUS_DATA.topWastedPromo}" — zero incremental sales last 2 weeks.</p>
        </div>
      </div>
    </NexusTile>
  );
}

function BrandTile() {
  return (
    <NexusTile>
      <TileHeader icon={Star} title="Brand Awareness" subtitle="Partner performance" iconBg="bg-sky-50 text-sky-600" action={() => {}} actionLabel="View Brands" />
      <div className="p-6 space-y-1">
        <StatRow label="Top Brand" value={NEXUS_DATA.topBrand} sub={`Score: ${NEXUS_DATA.topBrandScore}/100`} />
        <StatRow label="Brand Funding" value={`$${NEXUS_DATA.brandFundingAvailable.toLocaleString()}`} color="text-dutchie-300" sub="Available credits" />
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-sky-50 p-3">
          <Sparkles size={16} className="text-sky-600" />
          <p className="text-xs text-sky-800"><span className="font-semibold">Opportunity:</span> Ozone has $1,200 in unused brand-funded credits. Apply to top SKUs to boost margin.</p>
        </div>
      </div>
    </NexusTile>
  );
}

// ==========================================================================
// MAIN PAGE
// ==========================================================================

export default function NexusHome() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Nexus Command Center</h1>
          <p className="text-sm text-panel-300">Live homepage — all stores · Mar 2, 2026</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-dutchie-50 px-3 py-1.5 text-xs font-medium text-dutchie-800">
          <span className="h-2 w-2 rounded-full bg-dutchie-300 animate-pulse" />Live
        </span>
      </div>

      <AgentBar />

      <div className="grid gap-5 lg:grid-cols-2">
        <SalesTodayTile />
        <SentimentTile />
        <OmnichannelTile />
        <UnifiedPipelineTile />
        <VoiceAITile />
        <InventoryTile />
        <LoyaltyTile />
        <PricingTile />
        <BrandTile />
      </div>
    </div>
  );
}
