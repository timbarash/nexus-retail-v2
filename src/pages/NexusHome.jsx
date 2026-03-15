import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerBridge from './CustomerBridge';
import { useStores } from '../contexts/StoreContext';
import { useDateRange } from '../contexts/DateRangeContext';
import { locations } from '../data/mockData';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
  ZAxis, Cell, BarChart, Bar, AreaChart, Area,
  PieChart, Pie,
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, ShoppingBag, PhoneCall,
  Users, Package, DollarSign, Zap, ArrowRight, Star, MessageSquare,
  BarChart3, Target, Send, Sparkles, ChevronRight, MapPin, ThumbsUp,
  ThumbsDown, Clock, Bot, Mic, AlertCircle, ExternalLink, ArrowUpRight,
  ArrowDownRight, Minus, CheckCircle2, Eye, Smartphone, QrCode, Monitor,
  Layers, Hash, Radio, Wifi, Activity, Percent, Receipt, Store,
  Megaphone, ShoppingCart, ChevronDown, Shield, Lock, Heart, Rocket,
} from 'lucide-react';
import NexusIcon from '../components/NexusIcon';

// ---------------------------------------------------------------------------
// Per-store metrics — deterministically generated for all 39 Ascend stores
// State-based parameters from real MSO dispensary data (2024 earnings)
// Revenue in thousands per month; ranges reflect limited-license vs saturated markets
// ---------------------------------------------------------------------------

function _seedRng(seed) {
  let s = seed | 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// State-level parameters: monthly revenue (thousands), basket ($), margin (%)
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

  // Revenue: outlets get bottom of range, flagships get top
  const tierShift = isOutlet ? -0.30 : (rng() > 0.6 ? 0.25 : 0);
  const baseRev = sp.revMid + (rng() - 0.5) * (sp.revHigh - sp.revLow) * 0.6;
  const revenue = Math.round(Math.max(sp.revLow * 0.8, baseRev * (1 + tierShift)) * 10) / 10;

  // Basket: drawn from state range with small noise
  const avgBasket = Math.round((sp.basketLow + rng() * (sp.basketHigh - sp.basketLow) + (isOutlet ? -3 : 0)) * 100) / 100;

  // Transactions: derived from revenue / basket (keeps the math consistent)
  const transactions = Math.round((revenue * 1000) / avgBasket);

  // Margin: from state range, outlets get -1 to -2 pp
  const margin = Math.round((sp.gmLow + rng() * (sp.gmHigh - sp.gmLow) + (isOutlet ? -(1 + rng()) : 0)) * 10) / 10;

  const sentimentScore = Math.round(50 + rng() * 40);
  const sentimentDelta = Math.round((rng() * 20 - 10) * 10) / 10;
  const sentimentFlag = sentimentDelta <= -6 ? 'alert' : sentimentDelta >= 6 ? 'improving' : sentimentDelta <= -3 ? 'watch' : null;
  const vsBenchmark = Math.round((rng() * 30 - 8) * 10) / 10;
  return {
    name: loc.name, state: loc.state, city: loc.city,
    revenue, transactions, avgBasket, margin,
    sentimentScore, sentimentDelta, sentimentFlag, vsBenchmark,
    revenueWeight: Math.round((revenue / 1000) * 100) / 100,
  };
});

// ---------------------------------------------------------------------------
// Mock Nexus data — blending existing sentiment data with Nexus tile metrics
// ---------------------------------------------------------------------------

const NEXUS_DATA = {
  // Contextualized Insights (base = 30-day period)
  todaySales: 13_640_000,
  salesGoal: 15_000_000,
  salesVsGoalPct: -8,
  topStore: 'Logan Square, Chicago',
  topStoreRevenue: 750_000,
  underperformer: 'Morenci, MI',
  underperformerDelta: -23,
  traffic: { today: 175_500, yesterday: 169_200, trend: 'up' },

  // Inventory
  lowStockAlerts: 7,
  stockoutRisk: 3,
  topLowStock: [
    { product: 'Ozone Cake Mints 3.5g', store: 'Logan Square', daysLeft: 1.5 },
    { product: 'Simply Herb Gummies 100mg', store: 'Fort Lee', daysLeft: 2 },
    { product: 'Tunnel Vision 5-Pack', store: 'Boston', daysLeft: 0.5 },
  ],

  // Loyalty
  activeMembers: 18_420,
  atRiskCustomers: 1_247,
  loyaltyScore: 72,
  loyaltyTrend: -3,
  avgVisitFreq: 2.4,

  // Pricing & Discounts
  discountWaste: 127_400,
  underperformingPromos: 3,
  marketPriceGap: '+6%',
  topWastedPromo: '20% Off Edibles (Mon)',

  // Brand Awareness
  topBrand: 'Ozone',
  topBrandScore: 82,
  brandFundingAvailable: 2_150,
  brandTrend: 'up',

  // Voice AI
  voiceCalls: 200,
  voiceOrders: 67,
  voiceRevenue: 6_843,
  voiceAvgOrder: 102,
  voiceSentiment: 0.31,
  voiceResolution: 78,

  // Sentiment (from consumer intelligence)
  overallSentiment: 68,
  sentimentTrend: 'up',
  sentimentDelta: +4,
  positiveReviews: 220,
  neutralReviews: 89,
  negativeReviews: 135,
  totalReviews: 444,
  topPositiveTopic: 'Staff Friendliness',
  topNegativeTopic: 'Wait Times',
  npsScore: 34,
  npsDelta: +6,
  responseRate: 42,

  // Topic-level sentiment
  sentimentTopics: [
    { topic: 'Staff Friendliness', score: 84, delta: +7, reviews: 62, trend: 'up' },
    { topic: 'Product Quality', score: 76, delta: +2, reviews: 58, trend: 'up' },
    { topic: 'Store Cleanliness', score: 73, delta: 0, reviews: 31, trend: 'flat' },
    { topic: 'Wait Times', score: 38, delta: -5, reviews: 74, trend: 'down' },
    { topic: 'Online Ordering', score: 61, delta: +12, reviews: 45, trend: 'up' },
    { topic: 'Product Selection', score: 70, delta: -1, reviews: 40, trend: 'flat' },
  ],

  // Location sentiment
  locationSentiment: [
    { location: 'Logan Square, Chicago', score: 78, delta: +6, flag: null },
    { location: 'Fort Lee, NJ', score: 72, delta: +8, flag: 'improving' },
    { location: 'Boston, MA', score: 65, delta: -3, flag: 'watch' },
    { location: 'Morenci, MI', score: 52, delta: -9, flag: 'alert' },
  ],

  // Source breakdown
  sentimentBySrc: [
    { source: 'Google', reviews: 168, avg: 3.9 },
    { source: 'Leafly', reviews: 112, avg: 4.1 },
    { source: 'Weedmaps', reviews: 87, avg: 3.6 },
    { source: 'Dutchie', reviews: 77, avg: 4.3 },
  ],

  // AI suggestions
  sentimentActions: [
    { priority: 'high', action: 'Morenci MI: SMS surveys + QR data show wait time complaints in 68% of negative feedback — add 2 afternoon staff', impact: 'Est. +8pt unified sentiment lift' },
    { priority: 'high', action: 'Voice CSAT at Morenci is 3.1 vs 4.5 elsewhere — speech recognition model needs tuning for regional accent variations', impact: 'Est. +1.2 CSAT improvement' },
    { priority: 'medium', action: 'Logan Square first-party score (82) is 8pts above Google Reviews (74) — prompt happy SMS respondents to leave public reviews', impact: 'Est. +0.4 Google star rating' },
    { priority: 'medium', action: 'Reddit sentiment on Ozone Reserve brand dropped 15% — confirmed by 23% of SMS respondents mentioning "expensive"', impact: 'Price adjustment or promotion needed' },
    { priority: 'low', action: 'Kiosk reactions capture 3.2x more data than ecomm — move emoji prompt to the "order confirmed" screen on ecomm', impact: 'Est. +40% reaction capture rate' },
  ],

  // -------------------------------------------------------------------------
  // Omnichannel First-Party Sentiment Collection
  // -------------------------------------------------------------------------

  // Post-Purchase SMS Micro-Surveys
  smsChannel: {
    sent: 1_842,
    responded: 926,
    responseRate: 50.3,
    avgSentiment: 74,
    sentimentDelta: +6,
    todaySent: 48,
    todayResponded: 26,
    topInsight: 'Budtender recommendations driving repeat purchases — 62% of positive SMS mentions staff by name.',
    recentConversations: [
      {
        store: 'Logan Square',
        time: '2:34 PM',
        messages: [
          { from: 'system', text: 'How was your experience at Logan Square today? Reply with a quick thought.' },
          { from: 'customer', text: 'Great! Marcus recommended the Ozone gummies and they\'re exactly what I needed. Will be back.' },
        ],
        sentiment: 'positive',
        mappedTo: { budtender: 'Marcus T.', product: 'Ozone Cake Mints Gummies', txnId: 'TXN-8834' },
      },
      {
        store: 'Fort Lee',
        time: '1:12 PM',
        messages: [
          { from: 'system', text: 'How was your visit to Fort Lee today? We\'d love to hear.' },
          { from: 'customer', text: 'Waited 20 min even though I ordered ahead online. Pretty frustrating.' },
        ],
        sentiment: 'negative',
        mappedTo: { budtender: 'Jamie R.', product: null, txnId: 'TXN-8821' },
      },
      {
        store: 'Boston',
        time: '11:45 AM',
        messages: [
          { from: 'system', text: 'How was your pickup at Boston today? Quick reply is all we need!' },
          { from: 'customer', text: 'Smooth and fast. Love the new online ordering flow too.' },
        ],
        sentiment: 'positive',
        mappedTo: { budtender: 'Alex K.', product: null, txnId: 'TXN-8807' },
      },
    ],
  },

  // In-Menu Embedded Sentiment (Ecomm/Kiosk)
  ecommChannel: {
    totalReactions: 3_214,
    withFreeText: 486,
    freeTextRate: 15.1,
    reactionsToday: 87,
    breakdown: [
      { emoji: '😍', label: 'Love it', count: 1_286, pct: 40 },
      { emoji: '😊', label: 'Good', count: 1_028, pct: 32 },
      { emoji: '😐', label: 'Meh', count: 579, pct: 18 },
      { emoji: '😒', label: 'Not great', count: 321, pct: 10 },
    ],
    topProductSentiment: [
      { product: 'Ozone Cake Mints 3.5g', loves: 84, goods: 31, mehs: 5, bads: 2, score: 91 },
      { product: 'Ozone Reserve Elite Cart 1g', loves: 62, goods: 28, mehs: 12, bads: 8, score: 74 },
      { product: 'Simply Herb Gummies', loves: 44, goods: 38, mehs: 18, bads: 14, score: 63 },
    ],
    topInsight: 'Kiosk users leave 3.2x more reactions than ecomm — place feedback prompt on the "order confirmed" screen for maximum capture.',
  },

  // AI Voice Survey (Post-Call CSAT)
  voiceSurveyChannel: {
    surveyed: 156,
    completed: 141,
    completionRate: 90.4,
    avgCsat: 4.2,
    csatDelta: +0.3,
    distribution: [
      { rating: 5, count: 68, pct: 48.2 },
      { rating: 4, count: 39, pct: 27.7 },
      { rating: 3, count: 19, pct: 13.5 },
      { rating: 2, count: 10, pct: 7.1 },
      { rating: 1, count: 5, pct: 3.5 },
    ],
    recentVerbatim: [
      { rating: 5, text: 'The AI was super helpful, got my order placed in like 30 seconds. Way better than waiting on hold.', store: 'Boston' },
      { rating: 2, text: 'Couldn\'t understand me when I asked about strain effects. Had to repeat myself three times.', store: 'Morenci' },
      { rating: 4, text: 'Quick and easy. Would be nice if it remembered my usual order though.', store: 'Fort Lee' },
    ],
    topInsight: 'Voice CSAT at Morenci is 3.1 vs 4.5 at other stores — speech recognition model needs tuning for regional accent variations.',
  },

  // QR Code "Moment of Truth"
  qrChannel: {
    printed: 5_420,
    scanned: 423,
    completed: 287,
    scanRate: 7.8,
    completionRate: 67.8,
    avgScore: 4.1,
    topStore: { name: 'Logan Square', scanRate: 12.3 },
    worstStore: { name: 'Morenci', scanRate: 3.1 },
    budtenderLeaderboard: [
      { name: 'Marcus T.', store: 'Logan Square', surveys: 34, avgScore: 4.8, topComment: 'Always knows exactly what to recommend' },
      { name: 'Alex K.', store: 'Fort Lee', surveys: 28, avgScore: 4.6, topComment: 'Super patient and knowledgeable' },
      { name: 'Jamie R.', store: 'Morenci', surveys: 19, avgScore: 3.2, topComment: 'Seemed rushed, didn\'t answer my questions' },
    ],
    topInsight: 'QR surveys with budtender auto-mapping reveal Jamie R. at Morenci is tied to 68% of negative feedback — coaching opportunity.',
  },

  // Unified Pipeline — first-party + third-party merged
  unifiedPipeline: {
    totalSignals: 5_314,
    firstPartySignals: 2_380,
    thirdPartySignals: 2_934,
    firstPartyPct: 44.8,
    unifiedScore: 71,
    unifiedDelta: +5,
    channelScores: [
      { channel: 'SMS Micro-Surveys', type: 'first-party', signals: 926, score: 74, icon: 'sms' },
      { channel: 'Ecomm/Kiosk Reactions', type: 'first-party', signals: 3_214, score: 72, icon: 'ecomm', note: 'weighted by free-text' },
      { channel: 'Voice AI CSAT', type: 'first-party', signals: 141, score: 76, icon: 'voice' },
      { channel: 'QR Receipt Surveys', type: 'first-party', signals: 287, score: 68, icon: 'qr' },
      { channel: 'Google Reviews', type: 'third-party', signals: 168, score: 64, icon: 'google' },
      { channel: 'Leafly', type: 'third-party', signals: 112, score: 72, icon: 'leafly' },
      { channel: 'Weedmaps', type: 'third-party', signals: 87, score: 58, icon: 'weedmaps' },
      { channel: 'Reddit', type: 'third-party', signals: 203, score: 52, icon: 'reddit' },
      { channel: 'Dutchie Reviews', type: 'third-party', signals: 77, score: 78, icon: 'dutchie' },
    ],
    divergences: [
      { store: 'Morenci, MI', firstParty: 48, thirdParty: 61, delta: -13, insight: 'In-store NPS is 48, but Google Reviews show 61 — customers leaving positive public reviews but negative private feedback about wait times.' },
      { store: 'Logan Square, Chicago', firstParty: 82, thirdParty: 74, delta: +8, insight: 'First-party signals 8pts higher — happy customers not leaving public reviews. Prompt top SMS respondents to post on Google.' },
    ],
    keyInsight: 'Your in-store NPS is 72, but Reddit sentiment on your Ozone Reserve brand dropped 15% this month — price complaints on r/ILTrees driving it. First-party SMS data confirms: 23% of Ozone Reserve purchasers mention "expensive" in post-purchase feedback.',
  },
};

// Mini pricing scatter data — mirrors PricingAgent's PRICING_PRODUCTS
const MINI_PRICING_PRODUCTS = [
  { id: 'pp-1', name: 'Baby Jeeter Churros', brand: 'Jeeter', grossPrice: 35, marketAvg: 33, weeklyUnits: 62 },
  { id: 'pp-2', name: 'OG Kush Pod 1g', brand: 'STIIIZY', grossPrice: 45, marketAvg: 42, weeklyUnits: 42 },
  { id: 'pp-3', name: 'Camino Pineapple Habanero', brand: 'Kiva', grossPrice: 22, marketAvg: 22, weeklyUnits: 55 },
  { id: 'pp-4', name: 'Slippery Susan Cart 1g', brand: 'Raw Garden', grossPrice: 40, marketAvg: 38, weeklyUnits: 28 },
  { id: 'pp-5', name: 'Elderberry Indica Gummies', brand: 'Wyld', grossPrice: 18, marketAvg: 18, weeklyUnits: 35 },
  { id: 'pp-6', name: 'Gary Payton 3.5g', brand: 'Cookies', grossPrice: 55, marketAvg: 52, weeklyUnits: 18 },
  { id: 'pp-7', name: 'Atomic Apple 3.5g', brand: 'Alien Labs', grossPrice: 50, marketAvg: 48, weeklyUnits: 22 },
  { id: 'pp-8', name: 'Sour Watermelon Gummies', brand: 'PLUS', grossPrice: 20, marketAvg: 19, weeklyUnits: 30 },
];

const MINI_SCATTER_DATA = MINI_PRICING_PRODUCTS.map(p => ({
  x: p.marketAvg,
  y: p.grossPrice,
  z: p.weeklyUnits,
  name: p.name,
  brand: p.brand,
  gap: ((p.grossPrice - p.marketAvg) / p.marketAvg * 100),
}));

const MINI_PRICE_MIN = Math.min(...MINI_PRICING_PRODUCTS.map(p => Math.min(p.marketAvg, p.grossPrice))) - 3;
const MINI_PRICE_MAX = Math.max(...MINI_PRICING_PRODUCTS.map(p => Math.max(p.marketAvg, p.grossPrice))) + 3;

// ---------------------------------------------------------------------------
// Sales Reporting Data
// ---------------------------------------------------------------------------

const SALES_DATA = {
  periods: {
    today: {
      revenue: 454_700, revenueGoal: 500_000, revenueDelta: -8,
      transactions: 5_460, transactionsDelta: +7.5,
      avgBasket: 83.28, avgBasketDelta: -2.1,
      grossMargin: 48.2, grossMarginDelta: +0.8,
      marketBenchmark: { revenue: 418_000, avgBasket: 78, margin: 45.6, transactions: 5_120 },
    },
    week: {
      revenue: 3_183_000, revenueGoal: 3_500_000, revenueDelta: +3.2,
      transactions: 38_220, transactionsDelta: +5.1,
      avgBasket: 83.30, avgBasketDelta: -0.4,
      grossMargin: 47.8, grossMarginDelta: +1.2,
      marketBenchmark: { revenue: 2_926_000, avgBasket: 79, margin: 44.9, transactions: 35_800 },
    },
    month: {
      revenue: 13_640_000, revenueGoal: 15_000_000, revenueDelta: +6.8,
      transactions: 163_700, transactionsDelta: +8.3,
      avgBasket: 83.32, avgBasketDelta: +1.5,
      grossMargin: 47.4, grossMarginDelta: +0.6,
      marketBenchmark: { revenue: 12_540_000, avgBasket: 80, margin: 44.2, transactions: 152_000 },
    },
  },
  categories: [
    { name: 'Flower', revenue: 5_196_000, pct: 38.1, units: 62_400, margin: 42.9, marketShare: 35, color: '#E87068' },
    { name: 'Vapes', revenue: 3_093_000, pct: 22.7, units: 49_600, margin: 45.9, marketShare: 24, color: '#00BCD4' },
    { name: 'Edibles', revenue: 2_401_000, pct: 17.6, units: 82_000, margin: 55.0, marketShare: 19, color: '#B598E8' },
    { name: 'Pre-Rolls', revenue: 1_610_000, pct: 11.8, units: 31_200, margin: 48.6, marketShare: 12, color: '#FF6B35' },
    { name: 'Concentrates', revenue: 887_000, pct: 6.5, units: 15_600, margin: 44.7, marketShare: 7, color: '#E91E63' },
    { name: 'Other', revenue: 453_000, pct: 3.2, units: 12_800, margin: 52.3, marketShare: 3, color: '#8B949E' },
  ],
  brands: [
    { name: 'Jeeter', revenue: 2_401_000, units: 48_200, margin: 48.6, avgPrice: 34.94, trend: +12.3, rank: 1 },
    { name: 'STIIIZY', revenue: 1_951_000, units: 30_400, margin: 46.7, avgPrice: 45.00, trend: +5.1, rank: 2 },
    { name: 'Cookies', revenue: 1_506_000, units: 19_200, margin: 41.8, avgPrice: 55.00, trend: -3.2, rank: 3 },
    { name: 'Kiva', revenue: 1_318_000, units: 42_000, margin: 54.5, avgPrice: 22.00, trend: +8.7, rank: 4 },
    { name: 'Raw Garden', revenue: 1_119_000, units: 19_600, margin: 45.0, avgPrice: 40.00, trend: +1.4, rank: 5 },
    { name: 'Wyld', revenue: 899_000, units: 35_000, margin: 55.6, avgPrice: 18.00, trend: +15.2, rank: 6 },
  ],
  stores: STORE_METRICS.sort((a, b) => b.revenue - a.revenue).slice(0, 10).map((s, i, arr) => {
    const totalRev = arr.reduce((sum, x) => sum + x.revenue, 0);
    return {
      name: s.name.replace('Ascend ', ''), revenue: Math.round(s.revenue * 1000),
      pct: Math.round((s.revenue / totalRev) * 1000) / 10,
      transactions: s.transactions, avgBasket: s.avgBasket, margin: s.margin, vsBenchmark: Math.round(s.vsBenchmark),
    };
  }),
};

// Category bar chart data for recharts
const CATEGORY_BAR_DATA = SALES_DATA.categories.map(c => ({
  name: c.name,
  revenue: c.revenue,
  marketShare: c.marketShare,
  yourShare: c.pct,
  margin: c.margin,
  color: c.color,
}));

// Time-series data for the sales line chart — keyed by period
const SALES_TIMESERIES = {
  today: [
    { time: '9 AM',  revenue: 22_700, transactions: 273, avgBasket: 83, margin: 49.1, marketRevenue: 20_800 },
    { time: '10 AM', revenue: 68_200, transactions: 819, avgBasket: 83, margin: 48.6, marketRevenue: 62_700 },
    { time: '11 AM', revenue: 136_400, transactions: 1_638, avgBasket: 83, margin: 48.2, marketRevenue: 125_300 },
    { time: '12 PM', revenue: 204_600, transactions: 2_457, avgBasket: 83, margin: 47.8, marketRevenue: 188_000 },
    { time: '1 PM',  revenue: 272_800, transactions: 3_276, avgBasket: 83, margin: 48.0, marketRevenue: 250_800 },
    { time: '2 PM',  revenue: 318_300, transactions: 3_822, avgBasket: 83, margin: 48.3, marketRevenue: 292_500 },
    { time: '3 PM',  revenue: 363_800, transactions: 4_368, avgBasket: 83, margin: 48.1, marketRevenue: 334_200 },
    { time: '4 PM',  revenue: 400_100, transactions: 4_806, avgBasket: 83, margin: 48.0, marketRevenue: 367_700 },
    { time: '5 PM',  revenue: 431_900, transactions: 5_187, avgBasket: 83, margin: 48.2, marketRevenue: 396_800 },
    { time: '6 PM',  revenue: 454_700, transactions: 5_460, avgBasket: 83, margin: 48.2, marketRevenue: 418_000 },
  ],
  week: [
    { time: 'Mon', revenue: 409_200, transactions: 4_914, avgBasket: 83, margin: 47.2, marketRevenue: 376_200 },
    { time: 'Tue', revenue: 418_000, transactions: 5_024, avgBasket: 83, margin: 47.6, marketRevenue: 384_200 },
    { time: 'Wed', revenue: 459_200, transactions: 5_520, avgBasket: 83, margin: 48.1, marketRevenue: 422_200 },
    { time: 'Thu', revenue: 440_800, transactions: 5_298, avgBasket: 83, margin: 47.8, marketRevenue: 405_200 },
    { time: 'Fri', revenue: 500_200, transactions: 6_010, avgBasket: 83, margin: 48.4, marketRevenue: 459_800 },
    { time: 'Sat', revenue: 527_300, transactions: 6_336, avgBasket: 83, margin: 48.2, marketRevenue: 484_600 },
    { time: 'Sun', revenue: 428_300, transactions: 5_118, avgBasket: 84, margin: 46.8, marketRevenue: 393_800 },
  ],
  month: [
    { time: 'Week 1',  revenue: 3_092_000, transactions: 37_200, avgBasket: 83, margin: 47.1, marketRevenue: 2_840_000 },
    { time: 'Week 2',  revenue: 3_274_000, transactions: 39_390, avgBasket: 83, margin: 47.4, marketRevenue: 3_008_000 },
    { time: 'Week 3',  revenue: 3_592_000, transactions: 43_200, avgBasket: 83, margin: 47.8, marketRevenue: 3_302_000 },
    { time: 'Week 4',  revenue: 3_682_000, transactions: 44_310, avgBasket: 83, margin: 47.2, marketRevenue: 3_390_000 },
  ],
};

const CHART_METRICS = [
  { key: 'revenue', label: 'Revenue', color: '#00C27C', format: v => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`, benchKey: 'marketRevenue' },
  { key: 'transactions', label: 'Transactions', color: '#64A8E0', format: v => v.toLocaleString(), benchKey: null },
  { key: 'avgBasket', label: 'Avg Basket', color: '#B598E8', format: v => `$${v}`, benchKey: null },
  { key: 'margin', label: 'Margin %', color: '#D4A03A', format: v => `${v}%`, benchKey: null },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtDollar(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Tile Components
// ---------------------------------------------------------------------------

function NexusTile({ children, className = '', span = 1, onClick }) {
  const spanClass = span === 2 ? 'lg:col-span-2' : span === 3 ? 'lg:col-span-3' : '';
  return (
    <div
      className={`rounded-2xl border border-[#38332B] bg-[#1C1B1A] transition-all duration-200 hover:brightness-110 overflow-hidden ${spanClass} ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)', cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function TileHeader({ icon: Icon, title, subtitle, action, actionLabel, iconBg = 'bg-[#00C27C]/10 text-[#00C27C]', badge }) {
  return (
    <div className="flex items-start justify-between border-b border-[#38332B] px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={20} />
          {badge && (
            <span className={`absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${badge.color || 'bg-[#E87068]'}`}>
              {badge.count}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#F0EDE8]">{title}</h3>
          {subtitle && <p className="text-xs text-[#6B6359]">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          onClick={action}
          className="flex items-center gap-1 rounded-lg bg-[#00C27C] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#00B07A]"
        >
          {actionLabel}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function StatRow({ label, value, sub, trend, color }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#6B6359]">{label}</span>
      <div className="text-right">
        <span className={`text-lg font-bold ${color || 'text-[#F0EDE8]'}`}>{value}</span>
        {sub && <p className="text-[11px] text-[#6B6359]">{sub}</p>}
        {trend !== undefined && (
          <span className={`ml-2 text-xs font-medium ${trend >= 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Account Health + Integration + Feature Adoption + Peer Benchmark Tiles
// ---------------------------------------------------------------------------

function AccountHealthTile() {
  const score = 82;
  const color = score >= 80 ? '#00C27C' : score >= 60 ? '#D4A03A' : '#E87068';
  const gaugeData = [
    { name: 'score', value: score },
    { name: 'rest', value: 100 - score },
  ];
  const subMetrics = [
    { label: 'POS Uptime', value: '99.7%', color: '#00C27C' },
    { label: 'Ecomm Conv.', value: '3.2%', color: '#64A8E0' },
    { label: 'Payment Vol.', value: '$142K', color: '#B598E8' },
    { label: 'Support Vel.', value: '4.2h', color: '#D4A03A' },
  ];
  return (
    <NexusTile>
      <TileHeader icon={Heart} title="Account Health" subtitle="Overall Score" />
      <div className="flex items-center gap-4 mt-3">
        <div className="relative w-24 h-24 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={gaugeData} innerRadius={30} outerRadius={42} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                <Cell fill={color} />
                <Cell fill="#21262D" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color }}>{score}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {subMetrics.map(m => (
            <div key={m.label} className="bg-[#1C1B1A] rounded-lg p-2 text-center border border-[#21262D]">
              <p className="text-sm font-bold text-[#F0EDE8]">{m.value}</p>
              <p className="text-[10px] text-[#ADA599] uppercase">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </NexusTile>
  );
}

function IntegrationStatusTile() {
  const integrations = [
    { name: 'POS System', detail: '3 registers', status: 'partial', sub: '1 offline', icon: Monitor },
    { name: 'Ecommerce Sync', detail: 'Healthy', status: 'ok', sub: 'Last sync 2m ago', icon: ShoppingCart },
    { name: 'Payments', detail: '2 terminals', status: 'ok', sub: 'All online', icon: Receipt },
    { name: 'METRC', detail: 'Connected', status: 'warn', sub: '3 pending manifests', icon: Shield },
  ];
  const statusDot = { ok: 'bg-[#00C27C]', partial: 'bg-[#E87068]', warn: 'bg-[#D4A03A]' };
  return (
    <NexusTile>
      <TileHeader icon={Wifi} title="Integration Status" subtitle="System Health" />
      <div className="space-y-2.5 mt-3">
        {integrations.map(i => {
          const Icon = i.icon;
          return (
            <div key={i.name} className={`flex items-center gap-3 p-2.5 rounded-lg border ${i.status === 'partial' ? 'border-[#E87068]/30 bg-[#E87068]/[0.04]' : 'border-[#21262D] bg-[#1C1B1A]'}`}>
              <Icon className="w-4 h-4 text-[#ADA599] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#F0EDE8]">{i.name} — {i.detail}</p>
                <p className="text-[10px] text-[#ADA599]">{i.sub}</p>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot[i.status]}`} />
            </div>
          );
        })}
      </div>
    </NexusTile>
  );
}

function FeatureAdoptionTile() {
  const features = [
    { name: 'POS', pct: 92, color: '#00C27C' },
    { name: 'Ecommerce', pct: 78, color: '#00C27C' },
    { name: 'Payments', pct: 45, color: '#D4A03A' },
    { name: 'Analytics', pct: 31, color: '#D4A03A' },
    { name: 'White Label', pct: 0, color: '#484F58' },
    { name: 'Menu Boards', pct: 0, color: '#484F58' },
  ];
  return (
    <NexusTile>
      <TileHeader icon={Layers} title="Feature Adoption" subtitle="Product Utilization" />
      <div className="space-y-2 mt-3">
        {features.map(f => (
          <div key={f.name} className="flex items-center gap-2 text-xs">
            <span className="text-[#ADA599] w-20 text-right truncate">{f.name}</span>
            <div className="flex-1 bg-[#282724] rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
            </div>
            <span className="text-[#F0EDE8] w-8 text-right font-medium">{f.pct > 0 ? `${f.pct}%` : 'Off'}</span>
          </div>
        ))}
      </div>
    </NexusTile>
  );
}

function PeerBenchmarkTile() {
  const benchmarks = [
    { metric: 'Avg Basket', yours: '$83', peers: '$78', pctile: 72 },
    { metric: 'Conversion', yours: '3.2%', peers: '2.8%', pctile: 81 },
    { metric: 'Google Rating', yours: '4.3', peers: '4.1', pctile: 68 },
  ];
  const badgeColor = p => p >= 75 ? 'bg-[#00C27C]/15 text-[#00C27C]' : p >= 50 ? 'bg-[#D4A03A]/15 text-[#D4A03A]' : 'bg-[#E87068]/15 text-[#E87068]';
  return (
    <NexusTile>
      <TileHeader icon={Users} title="Peer Benchmarks" subtitle="Stores Like Yours" />
      <div className="space-y-3 mt-3">
        {benchmarks.map(b => (
          <div key={b.metric} className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1B1A] border border-[#21262D]">
            <div>
              <p className="text-xs font-medium text-[#F0EDE8]">{b.metric}</p>
              <p className="text-[10px] text-[#ADA599]">You: {b.yours} vs Peers: {b.peers}</p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeColor(b.pctile)}`}>
              P{b.pctile}
            </span>
          </div>
        ))}
      </div>
    </NexusTile>
  );
}

function LockedTile({ icon: Icon, title, desc }) {
  return (
    <div className="relative rounded-2xl border border-[#38332B] bg-[#141210] p-4 opacity-50">
      <div className="absolute top-3 right-3">
        <Lock className="w-3.5 h-3.5 text-[#6B6359]" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1C1B1A] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#6B6359]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#ADA599]">{title}</p>
          <p className="text-[10px] text-[#6B6359]">{desc}</p>
        </div>
      </div>
      <span className="mt-2 inline-block text-[9px] uppercase font-bold tracking-wider text-[#6B6359] bg-[#1C1B1A] rounded px-1.5 py-0.5">Phase 3</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual Tiles
// ---------------------------------------------------------------------------

function SalesTodayTile() {
  const { selectedStoreNames, isAllSelected, selectionLabel } = useStores();
  const { dateMultiplier, periodLabel, rangeLabel } = useDateRange();

  const ctx = useMemo(() => {
    const active = STORE_METRICS.filter(s => selectedStoreNames.has(s.name));
    const totalAllRev = STORE_METRICS.reduce((sum, s) => sum + s.revenue, 0);
    const selRev = active.reduce((sum, s) => sum + s.revenue, 0);
    const ratio = totalAllRev > 0 ? selRev / totalAllRev : 0;

    const sorted = [...active].sort((a, b) => b.revenue - a.revenue);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];

    const todaySales = Math.round(NEXUS_DATA.todaySales * ratio * dateMultiplier);
    const salesGoal = Math.round(NEXUS_DATA.salesGoal * ratio * dateMultiplier);

    return {
      todaySales,
      salesGoal,
      topStore: top ? `${top.name}, ${top.state}` : '—',
      topStoreRevenue: top && selRev > 0 ? Math.round(todaySales * (top.revenue / selRev)) : 0,
      underperformer: bottom && sorted.length > 1 ? `${bottom.name}, ${bottom.state}` : '—',
      underperformerDelta: bottom ? Math.round(bottom.vsBenchmark) : 0,
      trafficToday: Math.round(NEXUS_DATA.traffic.today * ratio * dateMultiplier),
      trafficYesterday: Math.round(NEXUS_DATA.traffic.yesterday * ratio * dateMultiplier),
    };
  }, [selectedStoreNames, isAllSelected, dateMultiplier]);

  const pct = ctx.salesGoal > 0 ? Math.round((ctx.todaySales / ctx.salesGoal) * 100) : 0;

  return (
    <NexusTile span={2}>
      <TileHeader
        icon={BarChart3}
        title="Contextualized Insights"
        subtitle={`${rangeLabel} — ${selectionLabel}`}
        iconBg="bg-[#00C27C]/10 text-[#00C27C]"
      />
      <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359]">Sales</p>
          <p className="mt-1 text-3xl font-bold text-[#F0EDE8]">{fmtDollar(ctx.todaySales)}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1C1B1A]">
            <div className="h-full rounded-full bg-[#00C27C] transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-[#6B6359]">{pct}% of {fmtDollar(ctx.salesGoal)} goal</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359]">Top Store</p>
          <p className="mt-1 text-lg font-bold text-[#F0EDE8]">{ctx.topStore}</p>
          <p className="text-sm text-[#00C27C]">{fmtDollar(ctx.topStoreRevenue)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359]">Traffic</p>
          <p className="mt-1 text-3xl font-bold text-[#F0EDE8]">{ctx.trafficToday}</p>
          <p className="text-xs text-[#00C27C]">
            <TrendingUp size={12} className="inline mr-0.5" />
            +{ctx.trafficToday - ctx.trafficYesterday} {periodLabel}
          </p>
        </div>
        <div className="rounded-xl bg-[rgba(232,112,104,0.12)] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[#E87068]">Needs Attention</p>
          <p className="mt-1 text-lg font-bold text-[#E87068]">{ctx.underperformer}</p>
          <p className="text-sm text-[#E87068]">{ctx.underperformerDelta}% below avg</p>
          <button className="mt-2 rounded-lg bg-[rgba(232,112,104,0.12)] px-3 py-1 text-xs font-semibold text-[#E87068] hover:bg-[#38332B] transition-colors">
            Investigate
          </button>
        </div>
      </div>
    </NexusTile>
  );
}

function VoiceAITile() {
  return (
    <NexusTile>
      <TileHeader
        icon={PhoneCall}
        title="Voice AI Ordering"
        subtitle="Dutchie Voice AI performance"
        iconBg="bg-[#00C27C]/10 text-[#00C27C]"
        action={() => {}}
        actionLabel="Deep Dive"
      />
      <div className="p-6 space-y-1">
        <StatRow label="Total Calls" value={NEXUS_DATA.voiceCalls} />
        <StatRow label="Orders Placed" value={NEXUS_DATA.voiceOrders} sub={`${Math.round((NEXUS_DATA.voiceOrders / NEXUS_DATA.voiceCalls) * 100)}% conversion`} />
        <StatRow label="Voice Revenue" value={`$${NEXUS_DATA.voiceRevenue.toLocaleString()}`} color="text-[#00C27C]" />
        <StatRow label="Avg Order" value={`$${NEXUS_DATA.voiceAvgOrder}`} />
        <StatRow label="Resolution" value={`${NEXUS_DATA.voiceResolution}%`} />
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#00C27C]/5 p-3">
          <Bot size={16} className="text-[#00C27C]" />
          <p className="text-xs text-[#F0EDE8]">
            <span className="font-semibold">AI Insight:</span> Voice orders have 18% higher AOV than online orders. Consider promoting phone ordering during peak hours.
          </p>
        </div>
      </div>
    </NexusTile>
  );
}

function SentimentTile() {
  const { selectedStoreNames } = useStores();
  const { dateMultiplier, periodLabel, rangeLabel } = useDateRange();

  // Dynamic location sentiment from selected stores
  const filteredLocationSentiment = useMemo(() => {
    const active = STORE_METRICS.filter(s => selectedStoreNames.has(s.name));
    const sorted = [...active].sort((a, b) => {
      const flagOrder = { alert: 0, watch: 1, improving: 2 };
      const aF = a.sentimentFlag ? flagOrder[a.sentimentFlag] ?? 3 : 3;
      const bF = b.sentimentFlag ? flagOrder[b.sentimentFlag] ?? 3 : 3;
      if (aF !== bF) return aF - bF;
      return Math.abs(b.sentimentDelta) - Math.abs(a.sentimentDelta);
    });
    return sorted.slice(0, 4).map(s => ({
      location: `${s.name}, ${s.state}`,
      score: s.sentimentScore,
      delta: s.sentimentDelta,
      flag: s.sentimentFlag,
    }));
  }, [selectedStoreNames]);

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <ArrowUpRight size={12} className="text-[#00C27C]" />;
    if (trend === 'down') return <ArrowDownRight size={12} className="text-[#E87068]" />;
    return <Minus size={12} className="text-[#6B6359]" />;
  };

  const priorityStyles = {
    high: 'border-[#38332B] bg-[rgba(232,112,104,0.12)]',
    medium: 'border-[#38332B] bg-[rgba(212,160,58,0.12)]',
    low: 'border-[#38332B] bg-[rgba(100,168,224,0.12)]',
  };
  const priorityDot = { high: 'bg-[#E87068]', medium: 'bg-[#D4A03A]', low: 'bg-[#64A8E0]' };

  return (
    <NexusTile span={2}>
      <TileHeader
        icon={MessageSquare}
        title="Consumer Sentiment"
        subtitle={`${Math.round(NEXUS_DATA.unifiedPipeline.totalSignals * dateMultiplier).toLocaleString()} signals across ${NEXUS_DATA.unifiedPipeline.channelScores.length} channels — ${rangeLabel}`}
        iconBg="bg-[#00C27C]/10 text-[#00C27C]"
        action={() => {}}
        actionLabel="Deep Dive"
        badge={{ count: 2, color: 'bg-[#D4A03A]' }}
      />
      <div className="p-6">
        {/* Top row — score gauge + key metrics + source breakdown */}
        <div className="grid gap-6 sm:grid-cols-3 mb-6">
          {/* Score gauge */}
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#00E08E" strokeWidth="8"
                  strokeDasharray={`${(NEXUS_DATA.overallSentiment / 100) * 251.3} 251.3`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-[#F0EDE8]">{NEXUS_DATA.overallSentiment}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F0EDE8]">Overall Sentiment</p>
              <p className="flex items-center gap-1 text-xs text-[#00C27C] font-medium">
                <TrendingUp size={12} />
                +{NEXUS_DATA.sentimentDelta} pts {periodLabel}
              </p>
              <div className="mt-2 flex gap-3">
                <div>
                  <p className="text-lg font-bold text-[#F0EDE8]">{NEXUS_DATA.npsScore}</p>
                  <p className="text-[10px] text-[#6B6359] uppercase tracking-wide">NPS</p>
                </div>
                <div className="border-l border-[#38332B] pl-3">
                  <p className="text-lg font-bold text-[#00C27C]">+{NEXUS_DATA.npsDelta}</p>
                  <p className="text-[10px] text-[#6B6359] uppercase tracking-wide">{periodLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review volume breakdown */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Review Volume</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-2xl font-bold text-[#F0EDE8]">{Math.round(NEXUS_DATA.totalReviews * dateMultiplier)}</span>
              <span className="text-xs text-[#6B6359] mb-1">{rangeLabel.toLowerCase()}</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div className="bg-[#00C27C]" style={{ width: `${(NEXUS_DATA.positiveReviews / NEXUS_DATA.totalReviews) * 100}%` }} />
              <div className="bg-[#1C1B1A]" style={{ width: `${(NEXUS_DATA.neutralReviews / NEXUS_DATA.totalReviews) * 100}%` }} />
              <div className="bg-[#E87068]" style={{ width: `${(NEXUS_DATA.negativeReviews / NEXUS_DATA.totalReviews) * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px]">
              <span className="flex items-center gap-1 text-[#00C27C]"><ThumbsUp size={10} /> {Math.round(NEXUS_DATA.positiveReviews * dateMultiplier)} positive</span>
              <span className="text-[#6B6359]">{Math.round(NEXUS_DATA.neutralReviews * dateMultiplier)} neutral</span>
              <span className="flex items-center gap-1 text-[#E87068]"><ThumbsDown size={10} /> {Math.round(NEXUS_DATA.negativeReviews * dateMultiplier)} negative</span>
            </div>
            <p className="mt-2 text-xs text-[#6B6359]">
              Response rate: <span className="font-semibold text-[#F0EDE8]">{NEXUS_DATA.responseRate}%</span>
            </p>
          </div>

          {/* Source breakdown */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">By Platform</p>
            <div className="space-y-2">
              {NEXUS_DATA.sentimentBySrc.map((s) => (
                <div key={s.source} className="flex items-center justify-between">
                  <span className="text-sm text-[#F0EDE8]">{s.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#6B6359]">{Math.round(s.reviews * dateMultiplier)} reviews</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className={star <= Math.round(s.avg) ? 'text-[#00C27C] fill-[#00C27C]' : 'text-[#6B6359]'} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#F0EDE8] w-6 text-right">{s.avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle row — Topic sentiment + Location sentiment */}
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          {/* Topic sentiment bars */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Topic Breakdown</p>
            <div className="space-y-2.5">
              {NEXUS_DATA.sentimentTopics.map((t) => (
                <div key={t.topic}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <TrendIcon trend={t.trend} />
                      <span className="text-sm text-[#F0EDE8]">{t.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#6B6359]">{Math.round(t.reviews * dateMultiplier)} mentions</span>
                      <span className={`text-xs font-bold ${t.score >= 60 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>{t.score}</span>
                      <span className={`text-[11px] font-medium ${t.delta > 0 ? 'text-[#00C27C]' : t.delta < 0 ? 'text-[#E87068]' : 'text-[#6B6359]'}`}>
                        {t.delta > 0 ? '+' : ''}{t.delta}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#1C1B1A]">
                    <div
                      className={`h-full rounded-full transition-all ${t.score >= 70 ? 'bg-[#00C27C]' : t.score >= 50 ? 'bg-[#D4A03A]' : 'bg-[#E87068]'}`}
                      style={{ width: `${t.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location sentiment */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">By Location</p>
            <div className="space-y-2">
              {filteredLocationSentiment.map((loc) => (
                <div key={loc.location} className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
                  loc.flag === 'alert' ? 'bg-[rgba(232,112,104,0.12)] border border-[#38332B]' :
                  loc.flag === 'watch' ? 'bg-[rgba(212,160,58,0.12)] border border-[#38332B]' :
                  loc.flag === 'improving' ? 'bg-[rgba(0,194,124,0.12)] border border-[#38332B]' :
                  'bg-[#141210] border border-[#38332B]'
                }`}>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={
                      loc.flag === 'alert' ? 'text-[#E87068]' :
                      loc.flag === 'watch' ? 'text-[#D4A03A]' :
                      loc.flag === 'improving' ? 'text-[#00C27C]' :
                      'text-[#6B6359]'
                    } />
                    <div>
                      <p className="text-sm font-medium text-[#F0EDE8]">{loc.location}</p>
                      {loc.flag === 'alert' && <p className="text-[10px] text-[#E87068] font-medium uppercase">Needs attention</p>}
                      {loc.flag === 'improving' && <p className="text-[10px] text-[#00C27C] font-medium uppercase">Improving</p>}
                      {loc.flag === 'watch' && <p className="text-[10px] text-[#D4A03A] font-medium uppercase">Watch</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${loc.score >= 65 ? 'text-[#F0EDE8]' : 'text-[#E87068]'}`}>{loc.score}</span>
                    <p className={`text-xs font-medium ${loc.delta >= 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                      {loc.delta >= 0 ? '+' : ''}{loc.delta} pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row — AI Suggestions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#00C27C]" />
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359]">AI-Powered Suggestions</p>
          </div>
          <div className="space-y-2">
            {NEXUS_DATA.sentimentActions.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${priorityStyles[item.priority]}`}>
                <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${priorityDot[item.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F0EDE8]">{item.action}</p>
                  <p className="mt-0.5 text-xs text-[#6B6359] font-medium">{item.impact}</p>
                </div>
                <button className="flex-shrink-0 rounded-lg bg-[#1C1B1A] border border-[#38332B] px-3 py-1.5 text-xs font-semibold text-[#F0EDE8] hover:bg-[#282724] transition-colors">
                  Execute
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NexusTile>
  );
}

// ---------------------------------------------------------------------------
// Omnichannel Sentiment Collection Tile
// ---------------------------------------------------------------------------

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
      <TileHeader
        icon={Radio}
        title="Omnichannel Sentiment Collection"
        subtitle="Proprietary first-party signals — no competitor can replicate this"
        iconBg="bg-[rgba(163,113,247,0.12)] text-[#B598E8]"
        action={() => {}}
        actionLabel="Configure Channels"
      />
      <div className="p-6">
        {/* Channel summary cards */}
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
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? 'border-[#B598E8] bg-[rgba(163,113,247,0.12)] ring-1 ring-[#B598E8]/30'
                    : 'border-[#38332B] bg-[#1C1B1A] hover:border-[#B598E8]/40 hover:bg-[rgba(163,113,247,0.06)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TabIcon size={14} className={isActive ? 'text-[#B598E8]' : 'text-[#6B6359]'} />
                  <span className={`text-xs font-semibold ${isActive ? 'text-[#B598E8]' : 'text-[#6B6359]'}`}>{label}</span>
                </div>
                <p className="text-xl font-bold text-[#F0EDE8]">{stats.signals.toLocaleString()}</p>
                <p className="text-[11px] text-[#6B6359]">{stats.rate} {stats.rateLabel}</p>
              </button>
            );
          })}
        </div>

        {/* SMS Tab */}
        {activeTab === 'sms' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Live Conversation Feed</p>
              <div className="space-y-3">
                {NEXUS_DATA.smsChannel.recentConversations.map((convo, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${
                    convo.sentiment === 'positive' ? 'border-[#38332B] bg-[rgba(0,194,124,0.12)]/30' : 'border-[#38332B] bg-[rgba(232,112,104,0.12)]/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-[#6B6359]" />
                        <span className="text-xs font-medium text-[#F0EDE8]">{convo.store}</span>
                      </div>
                      <span className="text-[11px] text-[#6B6359]">{convo.time}</span>
                    </div>
                    {convo.messages.map((msg, j) => (
                      <div key={j} className={`flex ${msg.from === 'system' ? 'justify-start' : 'justify-end'} mb-1`}>
                        <div className={`rounded-lg px-3 py-1.5 text-xs max-w-[85%] ${
                          msg.from === 'system'
                            ? 'bg-[#141210] text-white'
                            : convo.sentiment === 'positive' ? 'bg-[rgba(0,194,124,0.12)] text-[#00C27C]' : 'bg-[rgba(232,112,104,0.12)] text-[#E87068]'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {convo.mappedTo && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {convo.mappedTo.budtender && (
                          <span className="rounded-full bg-[#1C1B1A] border border-[#38332B] px-2 py-0.5 text-[10px] text-[#6B6359]">
                            Staff: {convo.mappedTo.budtender}
                          </span>
                        )}
                        {convo.mappedTo.product && (
                          <span className="rounded-full bg-[#1C1B1A] border border-[#38332B] px-2 py-0.5 text-[10px] text-[#6B6359]">
                            Product: {convo.mappedTo.product}
                          </span>
                        )}
                        <span className="rounded-full bg-[#1C1B1A] border border-[#38332B] px-2 py-0.5 text-[10px] text-[#6B6359]">
                          {convo.mappedTo.txnId}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Channel Stats</p>
              <div className="space-y-2 mb-4">
                <StatRow label="Surveys Sent" value={NEXUS_DATA.smsChannel.sent.toLocaleString()} sub="this month" />
                <StatRow label="Responses" value={NEXUS_DATA.smsChannel.responded.toLocaleString()} sub={`${NEXUS_DATA.smsChannel.responseRate}% rate`} />
                <StatRow label="Avg Sentiment" value={NEXUS_DATA.smsChannel.avgSentiment} trend={NEXUS_DATA.smsChannel.sentimentDelta} />
                <StatRow label="Today" value={`${NEXUS_DATA.smsChannel.todayResponded}/${NEXUS_DATA.smsChannel.todaySent}`} sub="responded/sent" />
              </div>
              <div className="rounded-xl bg-[rgba(163,113,247,0.08)] border border-[#B598E8]/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-[#B598E8]" />
                  <span className="text-xs font-semibold text-[#B598E8]">AI Insight</span>
                </div>
                <p className="text-xs text-[#B598E8]/80">{NEXUS_DATA.smsChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ecomm/Kiosk Tab */}
        {activeTab === 'ecomm' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Reaction Distribution</p>
              <div className="space-y-3 mb-4">
                {NEXUS_DATA.ecommChannel.breakdown.map((r) => (
                  <div key={r.emoji}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{r.emoji}</span>
                        <span className="text-sm text-[#F0EDE8]">{r.label}</span>
                      </div>
                      <span className="text-sm font-bold text-[#F0EDE8]">{r.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#1C1B1A]">
                      <div
                        className={`h-full rounded-full transition-all ${
                          r.emoji === '😍' ? 'bg-[#00C27C]' :
                          r.emoji === '😊' ? 'bg-[#00C27C]' :
                          r.emoji === '😐' ? 'bg-[#D4A03A]' :
                          'bg-[#E87068]'
                        }`}
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#6B6359]">
                <span className="font-semibold text-[#F0EDE8]">{NEXUS_DATA.ecommChannel.withFreeText.toLocaleString()}</span> reactions included free-text feedback ({NEXUS_DATA.ecommChannel.freeTextRate}%)
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Product-Level Sentiment</p>
              <div className="space-y-3 mb-4">
                {NEXUS_DATA.ecommChannel.topProductSentiment.map((p) => (
                  <div key={p.product} className="rounded-lg border border-[#38332B] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#F0EDE8]">{p.product}</span>
                      <span className={`text-sm font-bold ${p.score >= 75 ? 'text-[#00C27C]' : p.score >= 60 ? 'text-[#D4A03A]' : 'text-[#E87068]'}`}>
                        {p.score}
                      </span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-[#6B6359]">
                      <span>😍 {p.loves}</span>
                      <span>😊 {p.goods}</span>
                      <span>😐 {p.mehs}</span>
                      <span>😒 {p.bads}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-[rgba(163,113,247,0.08)] border border-[#B598E8]/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-[#B598E8]" />
                  <span className="text-xs font-semibold text-[#B598E8]">AI Insight</span>
                </div>
                <p className="text-xs text-[#B598E8]/80">{NEXUS_DATA.ecommChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}

        {/* Voice CSAT Tab */}
        {activeTab === 'voice' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">CSAT Distribution</p>
              <div className="flex items-end gap-6 mb-4">
                <div>
                  <p className="text-4xl font-bold text-[#F0EDE8]">{NEXUS_DATA.voiceSurveyChannel.avgCsat}</p>
                  <p className="text-xs text-[#6B6359]">Avg CSAT (1–5)</p>
                  <p className="text-xs font-medium text-[#00C27C]">+{NEXUS_DATA.voiceSurveyChannel.csatDelta} this month</p>
                </div>
                <div className="flex-1">
                  {NEXUS_DATA.voiceSurveyChannel.distribution.map((d) => (
                    <div key={d.rating} className="flex items-center gap-2 mb-1">
                      <span className="w-4 text-xs text-right text-[#6B6359]">{d.rating}</span>
                      <div className="flex-1 h-3 overflow-hidden rounded-full bg-[#1C1B1A]">
                        <div
                          className={`h-full rounded-full ${
                            d.rating >= 4 ? 'bg-[#00C27C]' : d.rating === 3 ? 'bg-[#D4A03A]' : 'bg-[#E87068]'
                          }`}
                          style={{ width: `${d.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-xs text-[#6B6359] text-right">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 text-xs text-[#6B6359]">
                <span>Surveyed: <span className="font-semibold text-[#F0EDE8]">{NEXUS_DATA.voiceSurveyChannel.surveyed}</span></span>
                <span>Completed: <span className="font-semibold text-[#F0EDE8]">{NEXUS_DATA.voiceSurveyChannel.completed}</span></span>
                <span>Rate: <span className="font-semibold text-[#F0EDE8]">{NEXUS_DATA.voiceSurveyChannel.completionRate}%</span></span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Recent Verbatim</p>
              <div className="space-y-3 mb-4">
                {NEXUS_DATA.voiceSurveyChannel.recentVerbatim.map((v, i) => (
                  <div key={i} className={`rounded-lg border p-3 ${
                    v.rating >= 4 ? 'border-[#38332B] bg-[rgba(0,194,124,0.12)]/30' : v.rating <= 2 ? 'border-[#38332B] bg-[rgba(232,112,104,0.12)]/30' : 'border-[#38332B]'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={10} className={s <= v.rating ? 'text-[#00C27C] fill-[#00C27C]' : 'text-[#6B6359]'} />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#6B6359]">{v.store}</span>
                    </div>
                    <p className="text-xs text-[#F0EDE8] italic">"{v.text}"</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-[rgba(163,113,247,0.08)] border border-[#B598E8]/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-[#B598E8]" />
                  <span className="text-xs font-semibold text-[#B598E8]">AI Insight</span>
                </div>
                <p className="text-xs text-[#B598E8]/80">{NEXUS_DATA.voiceSurveyChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}

        {/* QR Tab */}
        {activeTab === 'qr' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Budtender Leaderboard</p>
              <div className="space-y-2 mb-4">
                {NEXUS_DATA.qrChannel.budtenderLeaderboard.map((b, i) => (
                  <div key={b.name} className={`rounded-lg border p-3 ${
                    i === 0 ? 'border-[#00C27C]/20 bg-[#00C27C]/5' : 'border-[#38332B]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                          i === 0 ? 'bg-[#00C27C] text-white' : i === 1 ? 'bg-[#1C1B1A] text-white' : 'bg-orange-300 text-white'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#F0EDE8]">{b.name}</span>
                          <span className="text-[11px] text-[#6B6359] ml-2">{b.store}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#6B6359]">{b.surveys} surveys</span>
                        <span className={`text-sm font-bold ${b.avgScore >= 4 ? 'text-[#00C27C]' : b.avgScore >= 3 ? 'text-[#D4A03A]' : 'text-[#E87068]'}`}>
                          {b.avgScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6B6359] italic ml-8">"{b.topComment}"</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359] mb-3">Channel Stats</p>
              <div className="space-y-2 mb-4">
                <StatRow label="QR Codes Printed" value={NEXUS_DATA.qrChannel.printed.toLocaleString()} />
                <StatRow label="Scans" value={NEXUS_DATA.qrChannel.scanned} sub={`${NEXUS_DATA.qrChannel.scanRate}% scan rate`} />
                <StatRow label="Completions" value={NEXUS_DATA.qrChannel.completed} sub={`${NEXUS_DATA.qrChannel.completionRate}% completion`} />
                <StatRow label="Avg Score" value={`${NEXUS_DATA.qrChannel.avgScore}/5`} />
              </div>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 rounded-lg border border-[#38332B] bg-[rgba(0,194,124,0.12)]/30 p-2.5 text-center">
                  <p className="text-xs text-[#6B6359]">Best scan rate</p>
                  <p className="text-sm font-bold text-[#00C27C]">{NEXUS_DATA.qrChannel.topStore.name}</p>
                  <p className="text-xs text-[#00C27C]">{NEXUS_DATA.qrChannel.topStore.scanRate}%</p>
                </div>
                <div className="flex-1 rounded-lg border border-[#38332B] bg-[rgba(232,112,104,0.12)]/30 p-2.5 text-center">
                  <p className="text-xs text-[#6B6359]">Lowest scan rate</p>
                  <p className="text-sm font-bold text-[#E87068]">{NEXUS_DATA.qrChannel.worstStore.name}</p>
                  <p className="text-xs text-[#E87068]">{NEXUS_DATA.qrChannel.worstStore.scanRate}%</p>
                </div>
              </div>
              <div className="rounded-xl bg-[rgba(163,113,247,0.08)] border border-[#B598E8]/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-[#B598E8]" />
                  <span className="text-xs font-semibold text-[#B598E8]">AI Insight</span>
                </div>
                <p className="text-xs text-[#B598E8]/80">{NEXUS_DATA.qrChannel.topInsight}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </NexusTile>
  );
}

// ---------------------------------------------------------------------------
// Unified Sentiment Pipeline Tile
// ---------------------------------------------------------------------------

function UnifiedPipelineTile() {
  const d = NEXUS_DATA.unifiedPipeline;
  const firstParty = d.channelScores.filter((c) => c.type === 'first-party');
  const thirdParty = d.channelScores.filter((c) => c.type === 'third-party');

  const channelIcons = {
    sms: Smartphone, ecomm: Monitor, voice: Mic, qr: QrCode,
    google: Star, leafly: Star, weedmaps: Star, reddit: MessageSquare, dutchie: Star,
  };

  return (
    <NexusTile span={2}>
      <TileHeader
        icon={Layers}
        title="Unified Sentiment Pipeline"
        subtitle={`${d.totalSignals.toLocaleString()} signals from ${d.channelScores.length} channels — first-party + third-party merged`}
        iconBg="bg-[rgba(100,168,224,0.12)] text-[#64A8E0]"
      />
      <div className="p-6">
        {/* Hero insight */}
        <div className="rounded-xl bg-[#141210] p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00C27C]">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#00C27C] mb-1">The Unified View</p>
              <p className="text-sm text-[#F0EDE8]/70 leading-relaxed">{d.keyInsight}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Unified score */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center mb-3">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="56" cy="56" r="48" fill="none" stroke="#00E08E" strokeWidth="10"
                  strokeDasharray={`${(d.unifiedScore / 100) * 301.6} 301.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-[#F0EDE8]">{d.unifiedScore}</span>
            </div>
            <p className="text-sm font-semibold text-[#F0EDE8]">Unified Sentiment Score</p>
            <p className="text-xs font-medium text-[#00C27C]">+{d.unifiedDelta} pts this month</p>
            <div className="mt-3 flex gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-[#B598E8]">{d.firstPartyPct}%</p>
                <p className="text-[10px] text-[#6B6359] uppercase">First-party</p>
              </div>
              <div className="border-l border-[#38332B] pl-4">
                <p className="text-lg font-bold text-[#64A8E0]">{(100 - d.firstPartyPct).toFixed(1)}%</p>
                <p className="text-[10px] text-[#6B6359] uppercase">Third-party</p>
              </div>
            </div>
          </div>

          {/* Channel breakdown */}
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* First-party */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-[#B598E8]" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#B598E8]">First-Party (Proprietary)</p>
                </div>
                <div className="space-y-2">
                  {firstParty.map((c) => {
                    const Icon = channelIcons[c.icon];
                    return (
                      <div key={c.channel} className="flex items-center justify-between rounded-lg border border-[#B598E8]/20 bg-[rgba(163,113,247,0.06)] px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Icon size={12} className="text-[#B598E8]" />
                          <span className="text-sm text-[#F0EDE8]">{c.channel}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-[#6B6359]">{c.signals.toLocaleString()}</span>
                          <span className={`text-sm font-bold ${c.score >= 70 ? 'text-[#00C27C]' : c.score >= 55 ? 'text-[#D4A03A]' : 'text-[#E87068]'}`}>
                            {c.score}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Third-party */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-[#64A8E0]" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64A8E0]">Third-Party (Scraped)</p>
                </div>
                <div className="space-y-2">
                  {thirdParty.map((c) => {
                    const Icon = channelIcons[c.icon];
                    return (
                      <div key={c.channel} className="flex items-center justify-between rounded-lg border border-[#38332B] bg-[rgba(100,168,224,0.12)]/30 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Icon size={12} className="text-blue-500" />
                          <span className="text-sm text-[#F0EDE8]">{c.channel}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-[#6B6359]">{c.signals.toLocaleString()}</span>
                          <span className={`text-sm font-bold ${c.score >= 70 ? 'text-[#00C27C]' : c.score >= 55 ? 'text-[#D4A03A]' : 'text-[#E87068]'}`}>
                            {c.score}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Divergences */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-[#D4A03A]" />
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B6359]">Signal Divergences — Where First-Party ≠ Third-Party</p>
          </div>
          <div className="space-y-2">
            {d.divergences.map((div, i) => (
              <div key={i} className="rounded-xl border border-[#38332B] bg-[rgba(212,160,58,0.12)]/30 px-4 py-3">
                <div className="flex items-center gap-4 mb-1.5">
                  <span className="text-sm font-semibold text-[#F0EDE8]">{div.store}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-[rgba(163,113,247,0.15)] px-2 py-0.5 text-[#B598E8] font-medium">1st: {div.firstParty}</span>
                    <span className="rounded-full bg-[rgba(100,168,224,0.15)] px-2 py-0.5 text-[#64A8E0] font-medium">3rd: {div.thirdParty}</span>
                    <span className={`font-bold ${div.delta > 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                      {div.delta > 0 ? '+' : ''}{div.delta} gap
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#D4A03A]">{div.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NexusTile>
  );
}

function InventoryTile() {
  return (
    <NexusTile>
      <TileHeader
        icon={Package}
        title="Inventory & Reordering"
        subtitle={`${NEXUS_DATA.lowStockAlerts} low-stock alerts`}
        iconBg="bg-[rgba(255,166,87,0.12)] text-[#FFA657]"
        action={() => {}}
        actionLabel="Draft Reorder"
        badge={{ count: NEXUS_DATA.stockoutRisk, color: 'bg-[#E87068]' }}
      />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(232,112,104,0.12)]">
            <AlertTriangle size={24} className="text-[#E87068]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#E87068]">{NEXUS_DATA.stockoutRisk}</p>
            <p className="text-xs text-[#6B6359]">Products at stockout risk</p>
          </div>
        </div>
        <div className="space-y-3">
          {NEXUS_DATA.topLowStock.map((item) => (
            <div key={item.product} className="flex items-center justify-between rounded-lg border border-[#FFA657]/20 bg-[rgba(255,166,87,0.06)] px-3 py-2">
              <div>
                <p className="text-sm font-medium text-[#F0EDE8]">{item.product}</p>
                <p className="text-xs text-[#6B6359]">{item.store}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${item.daysLeft <= 1 ? 'text-[#E87068]' : 'text-[#FFA657]'}`}>
                  {item.daysLeft}d left
                </p>
              </div>
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
      <TileHeader
        icon={Users}
        title="Loyalty Score"
        subtitle="Customer retention health"
        iconBg="bg-[rgba(163,113,247,0.12)] text-[#B598E8]"
        action={() => {}}
        actionLabel="Win-back Campaign"
        badge={{ count: '!', color: 'bg-[#D4A03A]' }}
      />
      <div className="p-6 space-y-1">
        <StatRow label="Active Members" value={NEXUS_DATA.activeMembers.toLocaleString()} />
        <StatRow label="Loyalty Score" value={NEXUS_DATA.loyaltyScore} trend={NEXUS_DATA.loyaltyTrend} />
        <StatRow label="Avg Visit Freq" value={`${NEXUS_DATA.avgVisitFreq}x/mo`} />
        <div className="mt-3 rounded-xl border border-[#38332B] bg-[rgba(232,112,104,0.12)]/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-[#E87068]" />
              <span className="text-sm font-semibold text-[#E87068]">At-risk customers</span>
            </div>
            <span className="text-lg font-bold text-[#E87068]">{NEXUS_DATA.atRiskCustomers.toLocaleString()}</span>
          </div>
          <p className="mt-1 text-xs text-[#E87068]">Haven't visited in 30+ days</p>
        </div>
      </div>
    </NexusTile>
  );
}

function PricingTile() {
  const navigate = useNavigate();

  const MiniTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const gapStr = `${d.gap >= 0 ? '+' : ''}${d.gap.toFixed(1)}%`;
    return (
      <div className="bg-[#282724] border border-[#38332B] rounded-lg px-3 py-2 shadow-xl text-xs" style={{ minWidth: 140 }}>
        <p className="text-[#F0EDE8] font-semibold">{d.name}</p>
        <p className="text-[#ADA599] text-[10px] mb-1">{d.brand}</p>
        <div className="flex justify-between gap-3">
          <span className="text-[#6B6359]">You</span>
          <span className="text-[#F0EDE8] font-medium">${d.y}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[#6B6359]">Market</span>
          <span className="text-[#ADA599]">${d.x}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[#6B6359]">Gap</span>
          <span className={`font-bold ${d.gap > 3 ? 'text-[#D4A03A]' : d.gap < -3 ? 'text-[#64A8E0]' : 'text-[#ADA599]'}`}>{gapStr}</span>
        </div>
      </div>
    );
  };

  return (
    <NexusTile>
      <TileHeader
        icon={DollarSign}
        title="Pricing & Discounts"
        subtitle="Your price vs market"
        iconBg="bg-[#00C27C]/10 text-[#00C27C]"
        action={() => navigate('/pricing')}
        actionLabel="Optimize"
        badge={{ count: NEXUS_DATA.underperformingPromos, color: 'bg-[#D4A03A]' }}
      />
      <div className="px-4 pt-3 pb-2">
        {/* Mini legend */}
        <div className="flex items-center justify-end gap-3 text-[10px] text-[#ADA599] mb-1">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4A03A]" /> Above</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8B949E]" /> At</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#64A8E0]" /> Below</span>
        </div>

        {/* Mini scatterplot — click navigates to full pricing page */}
        <div
          className="h-[180px] cursor-pointer rounded-lg hover:bg-[#282724] transition-colors"
          onClick={() => navigate('/pricing')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, bottom: 16, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis
                type="number" dataKey="x" name="Market Avg"
                domain={[MINI_PRICE_MIN, MINI_PRICE_MAX]}
                tick={{ fill: '#ADA599', fontSize: 9 }}
                tickFormatter={v => `$${v}`}
                label={{ value: 'Market', position: 'bottom', offset: 0, fill: '#ADA599', fontSize: 9 }}
                stroke="#e5e7eb"
              />
              <YAxis
                type="number" dataKey="y" name="Your Price"
                domain={[MINI_PRICE_MIN, MINI_PRICE_MAX]}
                tick={{ fill: '#ADA599', fontSize: 9 }}
                tickFormatter={v => `$${v}`}
                label={{ value: 'You', angle: -90, position: 'insideLeft', offset: 8, fill: '#ADA599', fontSize: 9 }}
                stroke="#e5e7eb"
                width={32}
              />
              <ZAxis type="number" dataKey="z" range={[40, 200]} name="Weekly Units" />
              <RechartsTooltip content={<MiniTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#484F58' }} />
              <ReferenceLine
                segment={[{ x: MINI_PRICE_MIN, y: MINI_PRICE_MIN }, { x: MINI_PRICE_MAX, y: MINI_PRICE_MAX }]}
                stroke="#484F58" strokeDasharray="5 3" strokeWidth={1}
              />
              <Scatter data={MINI_SCATTER_DATA}>
                {MINI_SCATTER_DATA.map((entry, index) => (
                  <Cell
                    key={`mc-${index}`}
                    fill={entry.gap > 3 ? '#D4A03A' : entry.gap < -3 ? '#64A8E0' : '#8B949E'}
                    fillOpacity={0.85}
                    stroke={entry.gap > 3 ? '#D4A03A' : entry.gap < -3 ? '#64A8E0' : '#8B949E'}
                    strokeWidth={1.5}
                    strokeOpacity={0.4}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats below chart */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#ADA599]">Gap:</span>
            <span className="text-[#D4A03A] font-semibold">{NEXUS_DATA.marketPriceGap}</span>
            <span className="text-[#6B6359]">above avg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#ADA599]">Wasted:</span>
            <span className="text-[#E87068] font-semibold">{fmtDollar(NEXUS_DATA.discountWaste)}</span>
          </div>
        </div>
      </div>
    </NexusTile>
  );
}

function BrandTile() {
  return (
    <NexusTile>
      <TileHeader
        icon={Star}
        title="Brand Awareness"
        subtitle="Partner performance"
        iconBg="bg-[rgba(100,168,224,0.12)] text-[#64A8E0]"
        action={() => {}}
        actionLabel="View Brands"
      />
      <div className="p-6 space-y-1">
        <StatRow label="Top Brand" value={NEXUS_DATA.topBrand} sub={`Score: ${NEXUS_DATA.topBrandScore}/100`} />
        <StatRow label="Brand Funding" value={`$${NEXUS_DATA.brandFundingAvailable.toLocaleString()}`} color="text-[#00C27C]" sub="Available credits" />
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[rgba(100,168,224,0.08)] p-3">
          <Sparkles size={16} className="text-[#64A8E0]" />
          <p className="text-xs text-[#64A8E0]/80">
            <span className="font-semibold">Opportunity:</span> Ozone has $1,200 in unused brand-funded credits. Apply to top SKUs to boost margin.
          </p>
        </div>
      </div>
    </NexusTile>
  );
}

// ---------------------------------------------------------------------------
// Sales Reporting Tile
// ---------------------------------------------------------------------------

function SalesReportingTile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartMetric, setChartMetric] = useState('revenue');
  const { selectedStoreNames, isAllSelected, selectionLabel } = useStores();
  const { selectedRange, dateMultiplier, trendScale, rateOffset, periodLabel, rangeLabel } = useDateRange();

  // Map global date range to the closest sales period + an extra multiplier for quarter/year
  const period = selectedRange === 'last_week' ? 'week' : 'month';
  const salesMultiplier = selectedRange === 'last_quarter' ? 3 : selectedRange === 'last_year' ? 12 : 1;

  // Filter stores to selection
  const activeStores = useMemo(() =>
    STORE_METRICS.filter(s => selectedStoreNames.has(s.name)).sort((a, b) => b.revenue - a.revenue),
    [selectedStoreNames]);

  // Revenue ratio for scaling aggregate KPIs
  const storeRatio = useMemo(() => {
    if (isAllSelected) return 1;
    const totalRev = STORE_METRICS.reduce((sum, s) => sum + s.revenue, 0);
    const selRev = activeStores.reduce((sum, s) => sum + s.revenue, 0);
    return totalRev > 0 ? selRev / totalRev : 0;
  }, [activeStores, isAllSelected]);

  // Scaled period KPIs (store ratio + date range sales multiplier + trend/rate adjustments)
  const d = useMemo(() => {
    const base = SALES_DATA.periods[period];
    const sr = isAllSelected ? 1 : storeRatio;
    const sm = salesMultiplier;
    return {
      ...base,
      revenue: Math.round(base.revenue * sr * sm),
      revenueGoal: Math.round(base.revenueGoal * sr * sm),
      transactions: Math.round(base.transactions * sr * sm),
      revenueDelta: Math.round(base.revenueDelta * trendScale * 10) / 10,
      transactionsDelta: Math.round(base.transactionsDelta * trendScale * 10) / 10,
      avgBasket: Math.round((base.avgBasket * (1 + rateOffset)) * 100) / 100,
      avgBasketDelta: Math.round(base.avgBasketDelta * trendScale * 10) / 10,
      grossMargin: Math.round((base.grossMargin + rateOffset * 50) * 10) / 10,
      grossMarginDelta: Math.round(base.grossMarginDelta * trendScale * 10) / 10,
      marketBenchmark: {
        ...base.marketBenchmark,
        revenue: Math.round(base.marketBenchmark.revenue * sr * sm),
        transactions: Math.round(base.marketBenchmark.transactions * sr * sm),
      },
    };
  }, [period, storeRatio, isAllSelected, salesMultiplier, trendScale, rateOffset]);

  const bench = d.marketBenchmark;

  // Scaled timeseries for chart
  const scaledTimeseries = useMemo(() => {
    const series = SALES_TIMESERIES[period];
    const sr = isAllSelected ? 1 : storeRatio;
    const sm = salesMultiplier;
    return series.map(pt => ({
      ...pt,
      revenue: Math.round(pt.revenue * sr * sm),
      transactions: Math.round(pt.transactions * sr * sm),
      marketRevenue: Math.round(pt.marketRevenue * sr * sm),
    }));
  }, [period, storeRatio, isAllSelected, salesMultiplier]);

  // Store list for the stores tab
  const displayStores = useMemo(() => {
    const stores = activeStores.slice(0, 10);
    const totalRev = stores.reduce((sum, s) => sum + s.revenue, 0);
    return stores.map(s => ({
      name: s.name, revenue: Math.round(s.revenue * 1000),
      pct: totalRev > 0 ? Math.round((s.revenue / totalRev) * 1000) / 10 : 0,
      transactions: s.transactions, avgBasket: s.avgBasket, margin: s.margin,
      vsBenchmark: Math.round(s.vsBenchmark),
    }));
  }, [activeStores]);

  const activeCM = CHART_METRICS.find(m => m.key === chartMetric);

  const periodLabels = {}; // period selection now driven by global date range
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'categories', label: 'Categories' },
    { key: 'brands', label: 'Brands' },
    { key: 'stores', label: 'Stores' },
  ];

  const kpis = [
    {
      label: 'Revenue', value: fmtDollar(d.revenue), delta: d.revenueDelta,
      bench: fmtDollar(bench.revenue), benchLabel: 'Market avg',
      icon: DollarSign, color: '#00C27C',
      sub: `Goal: ${fmtDollar(d.revenueGoal)}`,
    },
    {
      label: 'Transactions', value: d.transactions.toLocaleString(), delta: d.transactionsDelta,
      bench: bench.transactions.toLocaleString(), benchLabel: 'Market avg',
      icon: Receipt, color: '#64A8E0',
    },
    {
      label: 'Avg Basket', value: `$${d.avgBasket.toFixed(2)}`, delta: d.avgBasketDelta,
      bench: `$${bench.avgBasket}`, benchLabel: 'Market avg',
      icon: ShoppingBag, color: '#B598E8',
    },
    {
      label: 'Gross Margin', value: `${d.grossMargin}%`, delta: d.grossMarginDelta,
      bench: `${bench.margin}%`, benchLabel: 'Market avg',
      icon: Percent, color: '#D4A03A',
    },
  ];

  // Custom bar tooltip
  const CatTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
      <div className="bg-[#282724] border border-[#38332B] rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="text-[#F0EDE8] font-semibold mb-1">{d.name}</p>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-4"><span className="text-[#6B6359]">Revenue</span><span className="text-[#F0EDE8]">{fmtDollar(d.revenue)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#6B6359]">Your Share</span><span className="text-[#F0EDE8]">{d.yourShare}%</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#6B6359]">Market Share</span><span className="text-[#ADA599]">{d.marketShare}%</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#6B6359]">Margin</span><span className="text-[#00C27C]">{d.margin}%</span></div>
        </div>
      </div>
    );
  };

  return (
    <NexusTile span={2}>
      {/* Header with period selector */}
      <div className="flex items-start justify-between border-b border-[#38332B] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(100,168,224,0.12)] text-[#64A8E0]">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#F0EDE8]">Sales Reporting</h3>
            <p className="text-xs text-[#6B6359]">Performance vs market benchmarks — {rangeLabel} — {selectionLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[#141210] px-3 py-1.5">
          <span className="text-xs font-medium text-[#F0EDE8]">{rangeLabel}</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-[#38332B] px-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-[#64A8E0] text-[#F0EDE8]' : 'border-transparent text-[#ADA599] hover:text-[#F0EDE8]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-grid">
              {kpis.map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="bg-[#141210] rounded-xl border border-[#38332B] border-l-[3px] p-4 hover:brightness-110 transition-all" style={{ borderLeftColor: k.color, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${k.color}18` }}>
                        <Icon size={16} style={{ color: k.color }} />
                      </div>
                    </div>
                    <p className="text-xl font-bold text-[#F0EDE8]">{k.value}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-[#ADA599]">{k.label}</span>
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${k.delta >= 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                        {k.delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {k.delta >= 0 ? '+' : ''}{k.delta}%
                      </span>
                    </div>
                    {k.sub && <p className="text-[#6B6359] text-[10px] mt-1">{k.sub}</p>}
                    <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(56,51,43,0.4)' }}>
                      <span className="text-[10px] text-[#ADA599]">{k.benchLabel}: {k.bench}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: k.delta >= 0 ? '#00C27C' : '#E87068', background: k.delta >= 0 ? 'rgba(0,194,124,0.07)' : 'rgba(232,112,104,0.07)' }}>
                        {k.delta >= 0 ? 'Above' : 'Below'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sales trend chart with metric toggle */}
            <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider">Sales Trend</p>
                <div className="flex items-center gap-1 rounded-lg bg-[#1C1B1A] p-0.5">
                  {CHART_METRICS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setChartMetric(m.key)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${chartMetric === m.key ? 'text-[#F0EDE8]' : 'text-[#6B6359] hover:text-[#ADA599]'}`}
                      style={chartMetric === m.key ? { background: `${m.color}20`, color: m.color } : {}}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mb-2 text-[10px] text-[#ADA599]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] rounded-full" style={{ background: activeCM.color }} />
                  {activeCM.label}
                </span>
                {activeCM.benchKey && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-[2px] rounded-full bg-[#1C1B1A]" style={{ borderTop: '2px dashed #484F58' }} />
                    Market Benchmark
                  </span>
                )}
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scaledTimeseries} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
                    <defs>
                      <linearGradient id={`grad-${chartMetric}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={activeCM.color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={activeCM.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: '#ADA599', fontSize: 10 }} stroke="#e5e7eb" />
                    <YAxis
                      tick={{ fill: '#ADA599', fontSize: 10 }} stroke="#e5e7eb"
                      tickFormatter={activeCM.format}
                      width={52}
                    />
                    <RechartsTooltip
                      contentStyle={{ background: '#1C1B1A', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11 }}
                      labelStyle={{ color: '#8B949E', marginBottom: 4 }}
                      formatter={(value, name) => {
                        const m = CHART_METRICS.find(cm => cm.key === name) || (name === 'marketRevenue' ? { format: v => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K` } : null);
                        return [m ? m.format(value) : value, name === 'marketRevenue' ? 'Market' : activeCM.label];
                      }}
                      cursor={{ stroke: '#484F58', strokeDasharray: '3 3' }}
                    />
                    {activeCM.benchKey && (
                      <Area
                        type="monotone" dataKey={activeCM.benchKey}
                        stroke="#484F58" strokeWidth={1.5} strokeDasharray="5 3"
                        fill="none" dot={false}
                      />
                    )}
                    <Area
                      type="monotone" dataKey={chartMetric}
                      stroke={activeCM.color} strokeWidth={2}
                      fill={`url(#grad-${chartMetric})`}
                      dot={{ r: 3, fill: activeCM.color, stroke: '#141210', strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: activeCM.color, stroke: '#141210', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue progress bar */}
            <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#ADA599] text-xs font-medium">Revenue vs Goal</span>
                <span className="text-[#F0EDE8] text-sm font-bold">{Math.round((d.revenue / d.revenueGoal) * 100)}%</span>
              </div>
              <div className="h-3 bg-[#282724] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (d.revenue / d.revenueGoal) * 100)}%`,
                    background: d.revenue >= d.revenueGoal ? '#00C27C' : d.revenue >= d.revenueGoal * 0.85 ? '#D4A03A' : '#E87068',
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#6B6359]">
                <span>{fmtDollar(d.revenue)}</span>
                <span>Goal: {fmtDollar(d.revenueGoal)}</span>
              </div>
            </div>

            {/* Quick category + store summary side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category mini breakdown */}
              <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider">Revenue by Category</p>
                  <button onClick={() => setActiveTab('categories')} className="text-[#64A8E0] text-[10px] hover:underline">Details</button>
                </div>
                <div className="space-y-2">
                  {SALES_DATA.categories.map(c => (
                    <div key={c.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="text-[#ADA599] text-xs w-20 truncate">{c.name}</span>
                      <div className="flex-1 h-2 bg-[#282724] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color, opacity: 0.8 }} />
                      </div>
                      <span className="text-[#F0EDE8] text-xs font-medium w-12 text-right">{c.pct}%</span>
                      <span className="text-[#6B6359] text-[10px] w-16 text-right">${(c.revenue / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store mini breakdown */}
              <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider">Revenue by Store</p>
                  <button onClick={() => setActiveTab('stores')} className="text-[#64A8E0] text-[10px] hover:underline">Details</button>
                </div>
                <div className="space-y-2">
                  {displayStores.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <MapPin size={10} className="text-[#6B6359] flex-shrink-0" />
                      <span className="text-[#ADA599] text-xs w-32 truncate">{s.name}</span>
                      <div className="flex-1 h-2 bg-[#282724] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#64A8E0]" style={{ width: `${s.pct}%`, opacity: 0.7 }} />
                      </div>
                      <span className="text-[#F0EDE8] text-xs font-medium w-12 text-right">{s.pct}%</span>
                      <span className={`text-[10px] font-bold w-10 text-right ${s.vsBenchmark >= 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                        {s.vsBenchmark >= 0 ? '+' : ''}{s.vsBenchmark}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Categories Tab ── */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            {/* Bar chart: Your share vs market share */}
            <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider">Your Mix vs Market Mix</p>
                <div className="flex items-center gap-3 text-[10px] text-[#ADA599]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#64A8E0]" /> You</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#1C1B1A]" /> Market</span>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CATEGORY_BAR_DATA} margin={{ top: 4, right: 4, bottom: 4, left: 4 }} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B6359', fontSize: 10 }} stroke="#e5e7eb" />
                    <YAxis tick={{ fill: '#ADA599', fontSize: 10 }} stroke="#e5e7eb" tickFormatter={v => `${v}%`} />
                    <RechartsTooltip content={<CatTooltip />} cursor={{ fill: 'rgba(100,168,224,0.06)' }} />
                    <Bar dataKey="yourShare" name="Your Share" fill="#64A8E0" radius={[3, 3, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="marketShare" name="Market Share" fill="#484F58" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category detail table */}
            <div className="bg-[#141210] rounded-xl border border-[#38332B] overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#38332B]">
                    <th className="text-left text-[#ADA599] font-medium px-4 py-2.5">Category</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Revenue</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Units</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Your %</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Market %</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {SALES_DATA.categories.map(c => (
                    <tr key={c.name} className="border-b border-[#21262D] hover:bg-[#1C1B1A] transition-colors">
                      <td className="px-4 py-2.5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                        <span className="text-[#F0EDE8] font-medium">{c.name}</span>
                      </td>
                      <td className="text-right px-4 py-2.5 text-[#F0EDE8] font-medium">{fmtDollar(c.revenue)}</td>
                      <td className="text-right px-4 py-2.5 text-[#ADA599]">{c.units}</td>
                      <td className="text-right px-4 py-2.5 text-[#F0EDE8] font-medium">{c.pct}%</td>
                      <td className="text-right px-4 py-2.5 text-[#ADA599]">{c.marketShare}%</td>
                      <td className="text-right px-4 py-2.5">
                        <span className={c.margin >= 50 ? 'text-[#00C27C] font-bold' : 'text-[#D4A03A] font-medium'}>{c.margin}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Brands Tab ── */}
        {activeTab === 'brands' && (
          <div className="space-y-4">
            <div className="bg-[#141210] rounded-xl border border-[#38332B] overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#38332B]">
                    <th className="text-left text-[#ADA599] font-medium px-4 py-2.5">#</th>
                    <th className="text-left text-[#ADA599] font-medium px-4 py-2.5">Brand</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Revenue</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Units</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Avg Price</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Margin</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {SALES_DATA.brands.map(b => (
                    <tr key={b.name} className="border-b border-[#21262D] hover:bg-[#1C1B1A] transition-colors">
                      <td className="px-4 py-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${b.rank <= 3 ? 'bg-[rgba(212,160,58,0.15)] text-[#D4A03A]' : 'bg-[#282724] text-[#6B6359]'}`}>
                          {b.rank}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[#F0EDE8] font-semibold">{b.name}</td>
                      <td className="text-right px-4 py-2.5 text-[#F0EDE8] font-medium">{fmtDollar(b.revenue)}</td>
                      <td className="text-right px-4 py-2.5 text-[#ADA599]">{b.units}</td>
                      <td className="text-right px-4 py-2.5 text-[#ADA599]">${b.avgPrice.toFixed(2)}</td>
                      <td className="text-right px-4 py-2.5">
                        <span className={b.margin >= 50 ? 'text-[#00C27C] font-bold' : 'text-[#D4A03A] font-medium'}>{b.margin}%</span>
                      </td>
                      <td className="text-right px-4 py-2.5">
                        <span className={`font-bold flex items-center justify-end gap-0.5 ${b.trend >= 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                          {b.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {b.trend >= 0 ? '+' : ''}{b.trend}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Brand insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
                <p className="text-[#6B6359] text-[10px] uppercase tracking-wider mb-1">Top Revenue</p>
                <p className="text-[#F0EDE8] text-lg font-bold">Jeeter</p>
                <p className="text-[#00C27C] text-xs font-semibold">$8,420 · +12.3%</p>
              </div>
              <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
                <p className="text-[#6B6359] text-[10px] uppercase tracking-wider mb-1">Best Margin</p>
                <p className="text-[#F0EDE8] text-lg font-bold">Wyld</p>
                <p className="text-[#D4A03A] text-xs font-semibold">55.6% margin · +15.2% trending</p>
              </div>
              <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
                <p className="text-[#6B6359] text-[10px] uppercase tracking-wider mb-1">Declining</p>
                <p className="text-[#F0EDE8] text-lg font-bold">Cookies</p>
                <p className="text-[#E87068] text-xs font-semibold">-3.2% · Lowest margin at 41.8%</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Stores Tab ── */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            <div className="bg-[#141210] rounded-xl border border-[#38332B] overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#38332B]">
                    <th className="text-left text-[#ADA599] font-medium px-4 py-2.5">Store</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Revenue</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Transactions</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Avg Basket</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">Margin</th>
                    <th className="text-right text-[#ADA599] font-medium px-4 py-2.5">vs Benchmark</th>
                  </tr>
                </thead>
                <tbody>
                  {displayStores.map(s => (
                    <tr key={s.name} className="border-b border-[#21262D] hover:bg-[#1C1B1A] transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-[#6B6359]" />
                          <span className="text-[#F0EDE8] font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="text-right px-4 py-2.5 text-[#F0EDE8] font-medium">{fmtDollar(s.revenue)}</td>
                      <td className="text-right px-4 py-2.5 text-[#ADA599]">{s.transactions}</td>
                      <td className="text-right px-4 py-2.5 text-[#ADA599]">${s.avgBasket.toFixed(2)}</td>
                      <td className="text-right px-4 py-2.5">
                        <span className={s.margin >= 48 ? 'text-[#00C27C] font-bold' : 'text-[#D4A03A] font-medium'}>{s.margin}%</span>
                      </td>
                      <td className="text-right px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.vsBenchmark >= 0 ? 'bg-[rgba(0,194,124,0.12)] text-[#00C27C]' : 'bg-[rgba(232,112,104,0.12)] text-[#E87068]'}`}>
                          {s.vsBenchmark >= 0 ? '+' : ''}{s.vsBenchmark}% vs market
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Store insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-[rgba(0,194,124,0.06)] rounded-xl border border-[rgba(0,194,124,0.15)] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpRight size={14} className="text-[#00C27C]" />
                  <span className="text-[#00C27C] text-xs font-semibold">Top Performer</span>
                </div>
                <p className="text-[#F0EDE8] text-sm font-medium">{displayStores[0]?.name || 'Top Store'}</p>
                <p className="text-[#ADA599] text-xs mt-1">${((displayStores[0]?.revenue || 0) / 1000).toFixed(1)}k revenue · {displayStores[0]?.margin || 0}% margin · +{displayStores[0]?.vsBenchmark || 0}% vs market benchmark.</p>
              </div>
              <div className="bg-[rgba(232,112,104,0.06)] rounded-xl border border-[rgba(232,112,104,0.15)] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownRight size={14} className="text-[#E87068]" />
                  <span className="text-[#E87068] text-xs font-semibold">Needs Attention</span>
                </div>
                <p className="text-[#F0EDE8] text-sm font-medium">{displayStores[displayStores.length - 1]?.name || 'Store'}</p>
                <p className="text-[#ADA599] text-xs mt-1">${((displayStores[displayStores.length - 1]?.revenue || 0) / 1000).toFixed(1)}k revenue · {displayStores[displayStores.length - 1]?.vsBenchmark || 0}% vs benchmark.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </NexusTile>
  );
}

// ---------------------------------------------------------------------------
// Agent Bar — compact CustomerBridge embedded on home page
// ---------------------------------------------------------------------------

function AgentBar() {
  return (
    <div className="rounded-2xl border border-[#38332B] bg-[#141210] p-5 shadow-lg">
      <CustomerBridge compact />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Nexus Page
// ---------------------------------------------------------------------------

const LAUNCHER_ACTIONS = [
  { key: 'inventory', label: 'Reorder Inventory', desc: 'Restock out-of-stock items', query: 'Show me a plan to reorder out-of-stock inventory', icon: ShoppingCart, tagColor: '#64A8E0' },
  { key: 'campaign', label: 'Launch Campaign', desc: 'Target your best sellers', query: 'Run a marketing campaign for my top sellers', icon: Megaphone, tagColor: '#00C27C' },
  { key: 'pricing', label: 'Benchmark Pricing', desc: 'Compare prices vs market', query: 'Compare my prices vs the market', icon: DollarSign, tagColor: '#D4A03A' },
  { key: 'sentiment', label: 'Customer Sentiment', desc: 'Google, Leafly, SMS trends', query: "How's our customer sentiment this month?", icon: Star, tagColor: '#B598E8' },
  { key: 'report', label: 'Sales Summary', desc: 'Weekly revenue & benchmarks', query: 'Give me a weekly sales performance summary', icon: BarChart3, tagColor: '#0EA5E9' },
  { key: 'explore', label: 'Trending Products', desc: 'New brands gaining traction', query: 'What trending products should I add to my menu?', icon: Rocket, tagColor: '#EC4899' },
];

function NexusLauncher({ onAction }) {
  const [inputValue, setInputValue] = useState('');
  return (
    <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] overflow-hidden" style={{ borderColor: 'rgba(0,194,124,0.15)' }}>
      <div className="px-5 py-3.5 border-b border-[#38332B] flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1C1B1A 0%, #0F1923 50%, #1C1B1A 100%)' }}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C27C, #64A8E0)' }}>
          <NexusIcon size={17} />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-[#F0EDE8]">Nexus AI</h2>
          <p className="text-[10px] text-[#6B6359]">Pick an action or ask anything</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-pulse" />
          <span className="text-[10px] text-[#00C27C] font-medium">Online</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 stagger-grid">
          {LAUNCHER_ACTIONS.map(a => (
            <button key={a.key} onClick={() => onAction(a.query)} className="group text-left rounded-xl border border-[#38332B] hover:border-white/10 bg-[#141210] p-3.5 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${a.tagColor}18` }}>
                  <a.icon className="w-3.5 h-3.5" style={{ color: a.tagColor }} />
                </div>
                <span className="text-xs font-semibold text-[#F0EDE8]">{a.label}</span>
              </div>
              <p className="text-[11px] text-[#6B6359] leading-relaxed pl-[38px]">{a.desc}</p>
              <div className="flex items-center gap-1 mt-2 pl-[38px] text-[10px] text-[#00C27C] opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="w-3 h-3" /> Open agent <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (inputValue.trim()) { onAction(inputValue.trim()); setInputValue(''); } }} className="mt-4">
          <div className="flex items-center gap-3 bg-[#141210] border border-[#38332B] rounded-xl px-4 py-2.5 focus-within:border-[#00C27C]/50 transition-colors">
            <NexusIcon size={16} className="flex-shrink-0" />
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask Nexus anything about your stores..." className="flex-1 bg-transparent text-sm text-[#F0EDE8] placeholder-[#484F58] outline-none" />
            <button type="submit" disabled={!inputValue.trim()} className="w-7 h-7 rounded-lg bg-[#00C27C] flex items-center justify-center text-white disabled:opacity-30 hover:bg-[#00B07A] transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NexusHome({ onOpenNexus }) {
  const [showAllTiles, setShowAllTiles] = useState(false);

  return (
    <div className="space-y-6">
      {/* Morning Briefing Hero */}
      <div className="rounded-2xl border border-[#38332B] overflow-hidden animate-fade-up" style={{ background: 'linear-gradient(135deg, #1C1B1A 0%, #0D2818 40%, #1C1B1A 100%)', borderColor: 'rgba(0,194,124,0.18)' }}>
        <div className="px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-sm text-[#ADA599] mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-2xl font-bold text-[#F0EDE8]">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}
            </h1>
            <p className="text-sm text-[#ADA599] mt-2">Here's what happened across your 39 stores.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-[#00C27C]/10 px-3 py-1.5 text-xs font-medium text-[#00C27C] border border-[#00C27C]/20">
              <span className="h-2 w-2 rounded-full bg-[#00C27C] animate-pulse" />
              All systems live
            </span>
          </div>
        </div>
        <div className="px-6 pb-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Yesterday Revenue', value: fmtDollar(NEXUS_DATA.todaySales), delta: '+4.2%', positive: true },
            { label: 'Traffic', value: NEXUS_DATA.traffic.today.toLocaleString(), delta: `${NEXUS_DATA.traffic.trend === 'up' ? '+' : ''}3.7%`, positive: NEXUS_DATA.traffic.trend === 'up' },
            { label: 'Stockout Alerts', value: String(NEXUS_DATA.lowStockAlerts), delta: `${NEXUS_DATA.stockoutRisk} critical`, positive: false },
            { label: 'Top Store', value: NEXUS_DATA.topStore.split(',')[0], delta: fmtDollar(NEXUS_DATA.topStoreRevenue), positive: true },
          ].map(s => (
            <div key={s.label} className="px-3 py-2 rounded-lg bg-[#141210]/60 border border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-wider text-[#6B6359]">{s.label}</p>
              <p className="text-lg font-bold text-[#F0EDE8] mt-0.5">{s.value}</p>
              <p className={`text-[11px] font-medium mt-0.5 ${s.positive ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>{s.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Status Panel */}
      <div className="mb-6 p-4 rounded-2xl border border-[#38332B] bg-[#1C1B1A]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Agent Activity
          </h3>
          <span className="text-xs text-[#6B6359]">Last 24 hours</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-grid">
          {[
            { to: '/agents/marketing', icon: Megaphone, color: '#B598E8', label: 'Marketing', desc: '1 campaign ready for review', dot: '#D4A03A', badge: '1', badgeColor: '#D4A03A' },
            { to: '/agents/connect', icon: ShoppingCart, color: '#64A8E0', label: 'Connect', desc: '3 stockout alerts flagged', dot: '#E87068', badge: '3', badgeColor: '#E87068' },
            { to: '/agents/pricing', icon: TrendingUp, color: '#00C27C', label: 'Pricing', desc: '$4.2K/mo opportunity', dot: '#00C27C' },
            { to: '/agents/bridge', icon: Users, color: '#D4A03A', label: 'Bridge', desc: '12 tickets resolved today', dot: '#00C27C' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="flex items-center gap-3 p-3 rounded-xl bg-[#141210] border border-[#38332B] hover:brightness-110 hover:border-[#4a433a] transition-all group">
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${a.color}18` }}>
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
                {a.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white" style={{ backgroundColor: a.badgeColor }}>{a.badge}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#F0EDE8] truncate">{a.label}</p>
                <p className="text-[10px] text-[#ADA599] truncate">{a.desc}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B6359] group-hover:text-[#ADA599] transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Nexus AI — Action Launcher */}
      <NexusLauncher onAction={onOpenNexus} />

      {/* Section: Performance */}
      <p className="text-[11px] font-bold text-[#6B6359] uppercase tracking-[1.5px] mt-2">Performance</p>
      <SalesReportingTile />

      {/* Section: Operational Health */}
      <p className="text-[11px] font-bold text-[#6B6359] uppercase tracking-[1.5px] mt-2">Operational Health</p>
      <div className="grid gap-5 lg:grid-cols-2 stagger-grid">
        {/* Full-width insights tile */}
        <SalesTodayTile />

        {/* Full-width consumer sentiment */}
        <SentimentTile />

        {/* Inventory (high priority — stockout alerts) */}
        <InventoryTile />

        {/* Pricing scatterplot — core operational metric */}
        <PricingTile />
      </div>

      {/* Show all tiles toggle */}
      {!showAllTiles && (
        <button
          onClick={() => setShowAllTiles(true)}
          className="w-full py-3 rounded-xl border border-[#38332B] bg-[#1C1B1A] text-sm text-[#ADA599] hover:text-[#F0EDE8] hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <ChevronDown className="w-4 h-4" />
          Show more tiles
        </button>
      )}

      {/* Secondary Tile Grid */}
      {showAllTiles && (
        <>
        <p className="text-[11px] font-bold text-[#6B6359] uppercase tracking-[1.5px] mt-2">Network & Channels</p>
        <div className="grid gap-5 lg:grid-cols-2 stagger-grid">
          {/* Full-width omnichannel collection */}
          <OmnichannelTile />

          {/* Full-width unified pipeline */}
          <UnifiedPipelineTile />

          {/* Voice AI + Loyalty side by side */}
          <VoiceAITile />
          <LoyaltyTile />

          {/* Brand tile */}
          <BrandTile />

          {/* Feature Adoption + Peer Benchmarks */}
          <FeatureAdoptionTile />
          <PeerBenchmarkTile />
        </div>
        </>
      )}

      {/* Coming Soon — Phase 3 stubs */}
      <div className="mt-2">
        <p className="text-xs font-semibold text-[#6B6359] uppercase tracking-wider mb-3">Coming in Phase 3</p>
        <div className="grid gap-3 lg:grid-cols-3 stagger-grid">
          <LockedTile icon={Users} title="Predictive Staffing" desc="AI shift optimization" />
          <LockedTile icon={Package} title="Vendor Intelligence" desc="Price benchmarks & scores" />
          <LockedTile icon={DollarSign} title="P&L Rollup" desc="Multi-location financials" />
          <LockedTile icon={TrendingUp} title="Customer Journey" desc="Funnel & churn prediction" />
          <LockedTile icon={Shield} title="Compliance Autopilot" desc="Automated METRC auditing" />
          <LockedTile icon={Sparkles} title="AI Menu Merchandising" desc="Dynamic menu optimization" />
        </div>
      </div>
    </div>
  );
}
