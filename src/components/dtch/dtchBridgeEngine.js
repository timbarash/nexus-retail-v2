// ═══════════════════════════════════════════════════════════════════
//  DTCH BRIDGE ENGINE — Intent Detection & Rich Component Responses
//  Same intent detection as slackBridgeEngine but returns { text, component, data }
// ═══════════════════════════════════════════════════════════════════

import { CAMPAIGNS } from '../../pages/MarketingCampaigns';
import { INTENT_ROUTING } from '../../data/dtchMockData';

/* ─── Campaign Theme Definitions (for dynamic generation) ─── */

const CAMPAIGN_THEMES = {
  stiiizy: {
    title: 'Brand Spotlight: STIIIZY',
    subtitle: 'Showcase the latest STIIIZY pods and batteries to vape enthusiasts',
    icon: 'Zap',
    accentFrom: '#2563EB',
    accentTo: '#0EA5E9',
    heroTag: 'Product Launch',
    product: 'STIIIZY',
    category: 'Vapes',
    discount: '15%',
    code: 'STIIIZY15',
  },
  edibles: {
    title: 'Edibles Week: Taste the Difference',
    subtitle: 'Spotlight your top-selling edibles with curated recommendations',
    icon: 'Cookie',
    accentFrom: '#D29922',
    accentTo: '#EA580C',
    heroTag: 'Category Spotlight',
    product: 'Edibles',
    category: 'Edibles & Gummies',
    discount: '20%',
    code: 'EDIBLES20',
  },
  flashsale: {
    title: 'Flash Sale: Weekend Blowout',
    subtitle: 'Limited-time deals to drive foot traffic and clear seasonal stock',
    icon: 'Timer',
    accentFrom: '#DC2626',
    accentTo: '#F97316',
    heroTag: 'Flash Sale',
    product: 'store-wide',
    category: 'All Categories',
    discount: '25%',
    code: 'FLASH25',
  },
  seasonal: {
    title: 'Spring Into Savings',
    subtitle: 'Seasonal campaign with curated picks for the new season',
    icon: 'Sun',
    accentFrom: '#16A34A',
    accentTo: '#22D3EE',
    heroTag: 'Seasonal',
    product: 'seasonal picks',
    category: 'Curated Selection',
    discount: '15%',
    code: 'SPRING15',
  },
  _420: {
    title: '4/20 Celebration: The Big One',
    subtitle: 'The biggest cannabis holiday — go all out with tiered deals and exclusives',
    icon: 'Flame',
    accentFrom: '#16A34A',
    accentTo: '#84CC16',
    heroTag: '4/20 Event',
    product: '4/20 exclusives',
    category: 'All Categories',
    discount: '30%',
    code: '420ASCEND',
  },
  general: {
    title: 'Promotional Campaign',
    subtitle: 'Targeted promotion based on customer behavior and purchase history',
    icon: 'Megaphone',
    accentFrom: '#7C3AED',
    accentTo: '#EC4899',
    heroTag: 'Promotion',
    product: 'featured products',
    category: 'Top Sellers',
    discount: '15%',
    code: 'ASCEND15',
  },
};

/* ─── Build a full campaign object from user prompt ─── */

function buildCampaignFromPrompt(userText) {
  const lower = userText.toLowerCase();

  // Determine theme
  let themeKey = 'general';
  if (lower.includes('stiiizy') || lower.includes('vape') || lower.includes('pod') || lower.includes('cartridge')) themeKey = 'stiiizy';
  else if (lower.includes('edible') || lower.includes('gumm') || lower.includes('kiva') || lower.includes('wyld') || lower.includes('plus gummies')) themeKey = 'edibles';
  else if (lower.includes('flash') || lower.includes('weekend') || lower.includes('blowout') || lower.includes('clearance')) themeKey = 'flashsale';
  else if (lower.includes('4/20') || lower.includes('420') || lower.includes('four twenty')) themeKey = '_420';
  else if (lower.includes('seasonal') || lower.includes('holiday') || lower.includes('spring') || lower.includes('summer') || lower.includes('fall') || lower.includes('winter')) themeKey = 'seasonal';

  const theme = CAMPAIGN_THEMES[themeKey];

  // Try to extract a custom title from the prompt
  let title = theme.title;
  let subtitle = theme.subtitle;

  // Extract custom discount if mentioned
  const discountMatch = lower.match(/(\d+)\s*%\s*(off|discount)/);
  const discount = discountMatch ? `${discountMatch[1]}%` : theme.discount;
  const code = discountMatch ? `ASCEND${discountMatch[1]}` : theme.code;

  // If user specified a brand/product not in presets, customize the title
  let brandOverride = null;
  const brandNames = ['cookies', 'raw garden', 'alien labs', 'plus', 'wana', 'select', 'pax', 'dosist', 'mary jones'];
  for (const brand of brandNames) {
    if (lower.includes(brand)) {
      const capitalized = brand.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      title = `Brand Spotlight: ${capitalized}`;
      subtitle = `Showcase ${capitalized} products to your most engaged customers`;
      brandOverride = brand;
      break;
    }
  }

  // Featured products per theme — real product images and data
  const FEATURED_PRODUCTS = {
    stiiizy: [
      { name: 'STIIIZY OG Kush', type: 'Half Gram Pod', strain: 'OG Kush', thc: '86%', price: '$35.00', category: 'Vape Pod', badgeColor: '#1a1a1a', badgeText: 'BEST SELLER', image: '/brands/stiiizy-pods.png' },
      { name: 'STIIIZY Blue Dream', type: 'Full Gram Pod', strain: 'Blue Dream', thc: '84%', price: '$55.00', category: 'Vape Pod', badgeColor: '#2563EB', badgeText: 'POPULAR' },
      { name: 'STIIIZY Starter Kit', type: 'Battery + Pod', strain: 'Skywalker OG', thc: '88%', price: '$45.00', category: 'Vape Kit', badgeColor: '#16A34A', badgeText: 'NEW' },
      { name: 'STIIIZY CDT Pod', type: 'Cannabis Derived Terps · 1g', strain: 'Biscotti', thc: '90%', price: '$60.00', category: 'Premium Pod', badgeColor: '#9333EA', badgeText: 'PREMIUM' },
    ],
    edibles: [
      { name: 'Kiva Camino Gummies', type: 'Edible · 100mg', strain: 'Pineapple Habanero', thc: '5mg/pc', price: '$22.00', category: 'Gummies', badgeColor: '#D29922', badgeText: 'BEST SELLER', image: '/brands/kiva-camino.jpg' },
      { name: 'Wyld Elderberry', type: 'Indica Gummies · 100mg', strain: 'Elderberry', thc: '10mg/pc', price: '$18.00', category: 'Gummies', badgeColor: '#E91E63', badgeText: 'POPULAR', image: '/brands/wyld-elderberry.png' },
      { name: 'PLUS Dual Chamber', type: 'Uplift/Chill · 200mg', strain: 'Hybrid', thc: '10mg/pc', price: '$28.00', category: 'Gummies', badgeColor: '#FF6B35', badgeText: 'NEW', image: '/brands/plus-gummies.jpg' },
      { name: 'Wyld Raspberry', type: 'Sativa Gummies · 100mg', strain: 'Raspberry', thc: '10mg/pc', price: '$22.00', category: 'Gummies', badgeColor: '#E91E63', badgeText: 'STAFF PICK', image: '/brands/wyld-raspberry.png' },
    ],
    flashsale: [
      { name: 'Baby Jeeter Infused', type: '5pk Pre-Rolls · 2.5g', strain: 'Churros', thc: '46%', price: '$25.00', category: 'Pre-Roll', badgeColor: '#9333EA', badgeText: 'BEST SELLER', image: '/brands/jeeter-baby-churros.webp' },
      { name: 'STIIIZY OG Kush', type: 'Half Gram Pod', strain: 'OG Kush', thc: '86%', price: '$35.00', category: 'Vape Pod', badgeColor: '#1a1a1a', badgeText: 'TOP SELLER', image: '/brands/stiiizy-pods.png' },
      { name: 'Kiva Camino Gummies', type: 'Edible · 100mg', strain: 'Pineapple Habanero', thc: '5mg/pc', price: '$22.00', category: 'Gummies', badgeColor: '#D29922', badgeText: 'POPULAR', image: '/brands/kiva-camino.jpg' },
      { name: 'Alien Labs Xeno', type: 'Live Resin Disposable · 1g', strain: 'Xeno', thc: '88%', price: '$48.00', category: 'Disposable', badgeColor: '#00BCD4', badgeText: 'NEW', image: '/brands/alien-xeno.png' },
    ],
    seasonal: [
      { name: 'Jeeter Juice', type: 'Liquid Diamonds · 1g Cart', strain: 'Blue Zkittlez', thc: '84%', price: '$45.00', category: 'Vape Cart', badgeColor: '#2563EB', badgeText: 'TRENDING', image: '/brands/jeeter-juice.webp' },
      { name: 'Cookies Gary Payton', type: 'Flower · 3.5g', strain: 'Gary Payton', thc: '28%', price: '$55.00', category: 'Flower', badgeColor: '#2196F3', badgeText: 'ICONIC', image: '/brands/cookies-gary-payton.png' },
      { name: 'Raw Garden Lemon Glaze', type: 'Refined Live Resin · 1g', strain: 'Lemon Glaze', thc: '85%', price: '$42.00', category: 'Vape Cart', badgeColor: '#4CAF50', badgeText: 'POPULAR', image: '/brands/raw-garden-cart.webp' },
      { name: 'Wyld Elderberry', type: 'Indica Gummies · 100mg', strain: 'Elderberry', thc: '10mg/pc', price: '$18.00', category: 'Gummies', badgeColor: '#E91E63', badgeText: 'STAFF PICK', image: '/brands/wyld-elderberry.png' },
    ],
    _420: [
      { name: 'Baby Jeeter Infused', type: '5pk Pre-Rolls · 2.5g', strain: 'Churros', thc: '46%', price: '$25.00', category: 'Pre-Roll', badgeColor: '#9333EA', badgeText: '4/20 DEAL', image: '/brands/jeeter-baby-churros.webp' },
      { name: 'Jeeter XL Infused', type: 'Pre-Roll · 2g', strain: 'Horchata', thc: '38%', price: '$22.00', category: 'Pre-Roll', badgeColor: '#EA580C', badgeText: '4/20 DEAL', image: '/brands/jeeter-xl-horchata.webp' },
      { name: 'STIIIZY OG Kush', type: 'Half Gram Pod', strain: 'OG Kush', thc: '86%', price: '$35.00', category: 'Vape Pod', badgeColor: '#1a1a1a', badgeText: '4/20 DEAL', image: '/brands/stiiizy-pods.png' },
      { name: 'Alien Labs Xeno', type: 'Live Resin Disposable · 1g', strain: 'Xeno', thc: '88%', price: '$48.00', category: 'Disposable', badgeColor: '#00BCD4', badgeText: '4/20 EXCLUSIVE', image: '/brands/alien-xeno.png' },
    ],
    general: [
      { name: 'Baby Jeeter Infused', type: '5pk Pre-Rolls · 2.5g', strain: 'Churros', thc: '46%', price: '$25.00', category: 'Pre-Roll', badgeColor: '#9333EA', badgeText: 'BEST SELLER', image: '/brands/jeeter-baby-churros.webp' },
      { name: 'Jeeter Juice', type: 'Liquid Diamonds · 1g Cart', strain: 'Blue Zkittlez', thc: '84%', price: '$45.00', category: 'Vape Cart', badgeColor: '#2563EB', badgeText: 'TRENDING', image: '/brands/jeeter-juice.webp' },
      { name: 'STIIIZY OG Kush', type: 'Half Gram Pod', strain: 'OG Kush', thc: '86%', price: '$35.00', category: 'Vape Pod', badgeColor: '#1a1a1a', badgeText: 'TOP SELLER', image: '/brands/stiiizy-pods.png' },
      { name: 'Alien Labs Xeno', type: 'Live Resin Disposable · 1g', strain: 'Xeno', thc: '88%', price: '$48.00', category: 'Disposable', badgeColor: '#00BCD4', badgeText: 'NEW', image: '/brands/alien-xeno.png' },
    ],
  };

  // Audience size varies by theme
  const audienceSizes = { stiiizy: '9,430', edibles: '11,200', flashsale: '18,600', seasonal: '14,800', _420: '22,000', general: '12,500' };
  const audienceSize = audienceSizes[themeKey];

  const featuredProducts = FEATURED_PRODUCTS[themeKey] || FEATURED_PRODUCTS.general;

  return {
    title,
    subtitle,
    icon: theme.icon,
    accentFrom: theme.accentFrom,
    accentTo: theme.accentTo,
    heroTag: theme.heroTag,
    featuredProducts,
    audience: {
      size: audienceSize,
      description: `Customers who have purchased ${theme.category} products in the past 90 days, browsed related products 3+ times, or match the campaign's behavioral targeting criteria.`,
      segments: [
        { name: 'High-Intent Shoppers', count: Math.round(parseInt(audienceSize.replace(',', '')) * 0.4).toLocaleString(), desc: `3+ ${theme.category} purchases` },
        { name: 'Active Browsers', count: Math.round(parseInt(audienceSize.replace(',', '')) * 0.35).toLocaleString(), desc: 'Viewed category 3+ times' },
        { name: 'Lookalike Audience', count: Math.round(parseInt(audienceSize.replace(',', '')) * 0.25).toLocaleString(), desc: 'Similar purchase patterns' },
      ],
    },
    channels: [
      { name: 'SMS', icon: 'Smartphone', reach: Math.round(parseInt(audienceSize.replace(',', '')) * 0.72).toLocaleString(), rate: '94%', metric: 'open rate', cost: '$0.015/msg' },
      { name: 'Email', icon: 'Mail', reach: Math.round(parseInt(audienceSize.replace(',', '')) * 0.88).toLocaleString(), rate: '38%', metric: 'open rate', cost: '$0.003/msg' },
      { name: 'Push', icon: 'Bell', reach: Math.round(parseInt(audienceSize.replace(',', '')) * 0.48).toLocaleString(), rate: '12%', metric: 'tap rate', cost: 'Free' },
    ],
    schedule: {
      launch: 'Friday, March 6 · 10:00 AM PT',
      duration: themeKey === 'flashsale' ? '48 hours' : '7 days',
      optimalSend: 'ML-optimized per customer timezone',
      followUp: `Non-openers get SMS reminder on Day ${themeKey === 'flashsale' ? '1' : '3'}. Non-converters get "last chance" on Day ${themeKey === 'flashsale' ? '2' : '6'}.`,
    },
    content: {
      headline: themeKey === 'flashsale'
        ? `${discount} Off Everything — This Weekend Only 🔥`
        : `${title} — ${discount} Off for You`,
      preheader: `Exclusive ${discount} off ${theme.product} at Ascend`,
      body: `We've curated ${theme.product} picks just for you based on your shopping history. As a valued Ascend customer, enjoy ${discount} off with code ${code}. Don't miss out — this offer won't last long.`,
      cta: themeKey === 'flashsale' ? 'Shop the Sale →' : `Shop ${theme.category} →`,
      offer: `${discount} off ${theme.product} — code ${code}`,
      finePrint: 'Limit one use per customer. Cannot be combined with other offers. Must be 21+.',
      smsPreview: `Ascend: ${discount} off ${theme.product}! Use code ${code} at checkout. Shop now → ascendwellness.com/deals`,
    },
    smsMessages: [
      `Ascend: ${discount} off ${theme.product}! Use code ${code} at checkout. Shop now → ascendwellness.com/deals`,
      'Reply STOP to opt out',
    ],
    abTests: [
      { variant: 'A', subject: `${title} — ${discount} Off for You`, split: 50 },
      { variant: 'B', subject: `Don't Miss: ${discount} Off ${theme.category} at Ascend`, split: 50 },
    ],
    compliance: [
      { label: 'Age gate verified (21+)', status: 'pass' },
      { label: 'Opt-in consent validated', status: 'pass' },
      { label: 'State cannabis advertising rules', status: 'pass' },
      { label: 'Disclaimer & fine print included', status: 'pass' },
      { label: 'Unsubscribe mechanism present', status: 'pass' },
    ],
    projections: {
      revenue: themeKey === 'flashsale' ? '$22,400 — $31,000' : '$14,200 — $19,800',
      orders: themeKey === 'flashsale' ? '420 — 620' : '280 — 410',
      roi: themeKey === 'flashsale' ? '7.4x' : '5.8x',
      reactivated: `~${themeKey === 'flashsale' ? '180' : '95'} lapsed customers`,
      aov: '$54.20',
      redemptionRate: themeKey === 'flashsale' ? '16.8%' : '12.4%',
    },
    locationTargeting: [
      { name: 'Ascend — Logan Square', id: 'logan-square', count: Math.round(parseInt(audienceSize.replace(',', '')) * 0.18).toLocaleString() },
      { name: 'Ascend — Fort Lee', id: 'fort-lee', count: Math.round(parseInt(audienceSize.replace(',', '')) * 0.16).toLocaleString() },
      { name: 'Ascend — Boston', id: 'boston', count: Math.round(parseInt(audienceSize.replace(',', '')) * 0.14).toLocaleString() },
      { name: 'Ascend — Detroit', id: 'detroit', count: Math.round(parseInt(audienceSize.replace(',', '')) * 0.12).toLocaleString() },
    ],
    budget: { totalCost: themeKey === 'flashsale' ? '$248.20' : '$164.80', costPerConversion: themeKey === 'flashsale' ? '$0.44' : '$0.52' },
  };
}

/* ─── Intent Detection (same as slackBridgeEngine) ─── */

function detectIntent(text) {
  const lower = text.toLowerCase();

  const marketingPatterns = /\b(marketing campaign|run a campaign|launch a campaign|create a campaign|brand spotlight|flash sale|promotional campaign|email campaign|sms campaign|push campaign|promote|win.?back|re-?engage|lapsed customers|birthday campaign|loyalty campaign|4\/20 campaign|seasonal campaign|holiday campaign|product launch campaign)\b/;
  if (marketingPatterns.test(lower)) return { lane: 'marketing' };
  if (/\b(campaign|marketing|promote)\b/.test(lower) && /\b(jeeter|stiiizy|kiva|wyld|cookies|raw garden|alien labs|plus gummies|edibles|pre.?rolls?|vapes?)\b/.test(lower)) {
    return { lane: 'marketing' };
  }

  const reviewFeedPatterns = /\b(show me reviews?|recent reviews?|latest reviews?|last week'?s? reviews?|this week'?s? reviews?|this month'?s? reviews?|5[- ]star|4[- ]star|3[- ]star|2[- ]star|1[- ]star|read reviews?|pull up reviews?|find reviews?|reviews? (about|mentioning|for|from|with|containing)|worst reviews?|best reviews?|top rated|lowest rated|angry reviews?|bad reviews?|good reviews?|great reviews?)\b/;
  if (reviewFeedPatterns.test(lower)) return { lane: 'reviews' };

  const sentimentPatterns = /\b(sentiment|nps|net promoter|customer feedback|customer sentiment|what are (customers|people) saying|brand sentiment|brand perception|reputation|ratings|customer complaints?|complaints?|how do customers feel|happy customers?|unhappy customers?|satisfaction|customer satisfaction|csat|feedback trends?|review trends?|what do people think|word cloud|top words?|mentions)\b/;
  if (sentimentPatterns.test(lower)) return { lane: 'sentiment' };

  const reportingPatterns = /\b(sales|revenue|performance|report|reporting|analytics|metrics|kpi|average order|aov|basket size|transactions|conversion|year over year|yoy|week over week|wow|month over month|mom|compare|how are we doing|how did we do|top sellers|best sellers|top products|worst products|bottom products|daily sales|weekly sales|monthly sales|quarterly|growth rate|trend|customer count|units sold|gross margin|profit margin|net revenue)\b/;
  if (reportingPatterns.test(lower)) return { lane: 'reporting' };

  // Connect / inventory — broad inventory & purchasing detection
  const connectPatterns = /\b(reorder|re-?stock|out of stock|stockout|low stock|low inventory|inventory analysis|inventory check|check inventory|inventory report|purchasing|explore new products|trending products|margin analysis|vendor comparison|supplier|dead stock|replenish|what should we stock|catalog gaps|order optimization|seasonal forecast|running low|run out|running out|don't run out|need to order|need more|stock up|keep stocked|well.?stocked|fully stocked|shelf|fill the shelves?|supply chain|purchase order|po for|place.?an? order|order more|what do (i|we) need|what should (i|we) (buy|order)|inventory$|inventory\b|stock level|stock check|top up)\b/;
  if (connectPatterns.test(lower)) return { lane: 'connect' };
  // Brand + inventory/stock context → connect (not marketing)
  if (/\b(jeeter|stiiizy|kiva|wyld|cookies|raw garden|alien labs|plus|papa.?barkley)\b/.test(lower) && /\b(stock|inventory|order|supply|run out|running low|need more|reorder|enough)\b/.test(lower)) {
    return { lane: 'connect' };
  }

  const bugPatterns = /\b(bug|broken|crash|error|glitch|lag|lagging|slow|not working|issue|problem|fix|doesn't work|won't load|stuck|freeze|freezing|down|outage|failing|fail)\b/;
  if (bugPatterns.test(lower)) {
    if (/inventory|stock|count|quantity/.test(lower) && /wrong|incorrect|off|mismatch|discrepancy/.test(lower)) {
      return { lane: 'support' };
    }
    return { lane: 'feedback', type: 'bug' };
  }

  const featurePatterns = /\b(feature request|wish list|would be nice|suggest|idea|could you add|want to see|enhancement|new feature|please add|would love|be great if|can you build)\b/;
  if (featurePatterns.test(lower)) return { lane: 'factory', type: 'feature' };

  return { lane: 'support' };
}

/* ─── Ticket ID Generator ─── */
let ticketCounter = 5200;
function generateTicketId() {
  ticketCounter += Math.floor(Math.random() * 10) + 1;
  return `CB-${ticketCounter}`;
}

/* ─── Report Data Generator (ported from CustomerBridge.jsx) ─── */

function generateReportData(query) {
  const lower = query.toLowerCase();

  let timeframe = 'week';
  if (/month|monthly|last month|this month|30 day/i.test(lower)) timeframe = 'month';
  else if (/quarter|quarterly|q[1-4]|90 day/i.test(lower)) timeframe = 'quarter';
  else if (/year|annual|yearly|yoy|12 month/i.test(lower)) timeframe = 'year';
  else if (/today|daily/i.test(lower)) timeframe = 'day';

  let focus = 'overview';
  if (/top (seller|product|selling)|best seller|popular/i.test(lower)) focus = 'top_products';
  else if (/category|categories|breakdown|by type/i.test(lower)) focus = 'categories';
  else if (/location|store|by store|per store/i.test(lower)) focus = 'locations';
  else if (/vs market|versus market|benchmark|compare.*market|market average/i.test(lower)) focus = 'market';

  const labels = {
    day: { label: 'Today', trendLabels: ['8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm'] },
    week: { label: 'Last 7 Days', trendLabels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    month: { label: 'Last 30 Days', trendLabels: ['Wk 1','Wk 2','Wk 3','Wk 4'] },
    quarter: { label: 'This Quarter', trendLabels: ['Jan','Feb','Mar'] },
    year: { label: 'Last 12 Months', trendLabels: ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'] },
  };

  const tf = labels[timeframe];
  const seed = query.length;
  const r = (min, max) => min + ((seed * 7 + min * 13) % (max - min));

  const baseRevenue = { day: 8400, week: 62800, month: 248000, quarter: 710000, year: 2940000 }[timeframe];
  const baseOrders = { day: 145, week: 1080, month: 4200, quarter: 12400, year: 51200 }[timeframe];
  const baseAOV = 52.40 + (seed % 8);

  const trendData = tf.trendLabels.map((label, i) => {
    const variance = 0.75 + (((seed * (i + 1) * 7) % 50) / 100);
    const periodRev = (baseRevenue / tf.trendLabels.length) * variance;
    const prevVariance = 0.68 + (((seed * (i + 2) * 11) % 45) / 100);
    const prevRev = (baseRevenue / tf.trendLabels.length) * prevVariance;
    return { label, current: Math.round(periodRev), previous: Math.round(prevRev) };
  });

  const totalCurrent = trendData.reduce((s, d) => s + d.current, 0);
  const totalPrevious = trendData.reduce((s, d) => s + d.previous, 0);
  const growthPct = (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1);

  const topProducts = [
    { name: 'Baby Jeeter Churros', category: 'Pre-Rolls', units: 284 + r(0,80), revenue: 7100 + r(0,2000) },
    { name: 'STIIIZY OG Kush Pod', category: 'Vapes', units: 210 + r(0,60), revenue: 6300 + r(0,1500) },
    { name: 'Kiva Camino Gummies', category: 'Edibles', units: 195 + r(0,50), revenue: 3900 + r(0,1000) },
    { name: 'Raw Garden Refined LR', category: 'Concentrates', units: 142 + r(0,40), revenue: 5680 + r(0,1200) },
    { name: 'Wyld Elderberry Gummies', category: 'Edibles', units: 138 + r(0,35), revenue: 2760 + r(0,700) },
  ];

  const categoryData = [
    { name: 'Pre-Rolls', revenue: Math.round(baseRevenue * 0.28), pct: 28, color: '#9333EA' },
    { name: 'Flower', revenue: Math.round(baseRevenue * 0.24), pct: 24, color: '#16A34A' },
    { name: 'Vapes', revenue: Math.round(baseRevenue * 0.20), pct: 20, color: '#0EA5E9' },
    { name: 'Edibles', revenue: Math.round(baseRevenue * 0.15), pct: 15, color: '#D29922' },
    { name: 'Concentrates', revenue: Math.round(baseRevenue * 0.08), pct: 8, color: '#F85149' },
    { name: 'Other', revenue: Math.round(baseRevenue * 0.05), pct: 5, color: '#8B949E' },
  ];

  return {
    timeframe,
    timeframeLabel: tf.label,
    focus,
    revenue: totalCurrent,
    previousRevenue: totalPrevious,
    growthPct: parseFloat(growthPct),
    orders: baseOrders,
    aov: baseAOV,
    topProducts,
    categoryData,
  };
}

/* ─── Prompt-Driven Campaign Resolution ─── */

export function resolveCampaign(text) {
  const lower = text.toLowerCase();

  // Only use hardcoded presets for exact brand matches that have full preset data
  if (lower.includes('jeeter') || lower.includes('pre-roll')) return CAMPAIGNS.jeeter;
  if ((lower.includes('win') && lower.includes('back')) || lower.includes('lapsed') || lower.includes('re-engage') || lower.includes('inactive') || lower.includes('churn') || lower.includes('dormant')) return CAMPAIGNS.winback;
  if (lower.includes('birthday') || lower.includes('loyalty') || lower.includes('reward')) return CAMPAIGNS.birthday;

  // Everything else: generate a dynamic campaign from the prompt
  return buildCampaignFromPrompt(text);
}

/* ─── Connect Sub-Type Matcher ─── */

function matchConnectType(text) {
  const lower = text.toLowerCase();
  if (lower.includes('explore') || lower.includes('trending') || lower.includes('new product')) return 'explore';
  if (lower.includes('recommend') || lower.includes('margin') || lower.includes('dead stock') || lower.includes('optimization')) return 'recommendations';
  return 'reorder'; // default for reorder/stock/inventory
}

/* ─── Response Generators ─── */

function generateMarketingResponse(userText) {
  const campaign = resolveCampaign(userText);
  return {
    text: `I've put together a full campaign plan for **${campaign.title}**. Take a look at the targeting, channels, and creative below. @Marcus Chen — please review and approve.`,
    mentions: ['marcus'],
    component: 'campaign',
    data: campaign,
  };
}

function generateReportingResponse(userText) {
  const reportData = generateReportData(userText);
  return {
    text: `Here's your **${reportData.timeframeLabel}** performance report. Revenue is ${reportData.growthPct > 0 ? 'up' : 'down'} **${Math.abs(reportData.growthPct)}%** vs prior period. @Rachel Torres — key metrics below.`,
    mentions: ['rachel'],
    component: 'report',
    data: reportData,
  };
}

function generateReviewsResponse(userText) {
  const lower = userText.toLowerCase();
  let filterDesc = 'All recent reviews';
  let totalReviews = 142;
  let avgRating = 4.3;
  let positivePercent = 78;
  let excerpts = [
    { text: 'Friendly staff and great product selection. Will definitely come back!', source: 'Google', stars: 5 },
    { text: 'Best dispensary in NYC hands down. Staff really knows their products.', source: 'Leafly', stars: 5 },
    { text: 'Quick service even on a Saturday afternoon. Impressed!', source: 'Weedmaps', stars: 4 },
  ];

  if (lower.includes('negative') || lower.includes('bad') || lower.includes('worst') || lower.includes('angry')) {
    filterDesc = 'Negative reviews (1-2 stars)';
    totalReviews = 11;
    avgRating = 1.6;
    positivePercent = 0;
    excerpts = [
      { text: 'Waited 45 mins for my online order pickup. Staff seemed confused.', source: 'Google', stars: 1 },
      { text: 'Product was dried out and overpriced. Won\'t be back.', source: 'Weedmaps', stars: 2 },
    ];
  } else if (lower.includes('5-star') || lower.includes('5 star') || lower.includes('best')) {
    filterDesc = '5-star reviews';
    totalReviews = 64;
    avgRating = 5.0;
    positivePercent = 100;
  }

  return {
    text: `Found **${totalReviews} reviews** matching "${filterDesc}". Average: **${avgRating}/5.0**. @Lisa Chang — breakdown below.`,
    mentions: ['lisa'],
    component: 'reviews',
    data: { filterDesc, totalReviews, avgRating, positivePercent, excerpts },
  };
}

function generateSentimentResponse(userText) {
  const lower = userText.toLowerCase();
  let focus = 'Overall';
  if (lower.includes('delivery') || lower.includes('online')) focus = 'Delivery & Online';
  else if (lower.includes('staff') || lower.includes('service')) focus = 'Staff & Service';

  return {
    text: `Sentiment analysis complete for **${focus}**. NPS is trending up. @Lisa Chang @Rachel Torres — details below.`,
    mentions: ['lisa', 'rachel'],
    component: 'sentiment',
    data: {
      focus,
      overallScore: 4.3,
      nps: 42,
      positivePercent: 78,
      negativePercent: 14,
      neutralPercent: 8,
      categories: [
        { label: 'Staff Friendliness', score: 92, color: '#00C27C' },
        { label: 'Product Quality', score: 88, color: '#00C27C' },
        { label: 'Store Cleanliness', score: 85, color: '#58A6FF' },
        { label: 'Wait Times', score: 54, color: '#F85149' },
        { label: 'Online Experience', score: 72, color: '#D29922' },
      ],
    },
  };
}

function generateConnectResponse(userText) {
  const subType = matchConnectType(userText);
  return {
    text: `Inventory analysis complete. @Sofia Rodriguez — action items below.`,
    mentions: ['sofia'],
    component: subType,
    data: null, // ConnectAgent views handle null data with their own fallback data
  };
}

function generateBugResponse(userText) {
  const ticketId = generateTicketId();
  return {
    text: `Support ticket **${ticketId}** created and escalated to engineering. @Derek Williams @Rachel Torres — tracking below.`,
    mentions: ['derek', 'rachel'],
    component: 'bug',
    data: { ticketId, issue: userText.length > 120 ? userText.slice(0, 120) + '...' : userText },
  };
}

function generateFeatureResponse(userText) {
  const ticketId = generateTicketId();
  return {
    text: `Feature request **${ticketId}** submitted to the product backlog. @Rachel Torres — details below.`,
    mentions: ['rachel'],
    component: 'feature',
    data: { ticketId, request: userText.length > 120 ? userText.slice(0, 120) + '...' : userText },
  };
}

function generateSupportResponse(userText) {
  const lower = userText.toLowerCase();

  let topic = 'General Inquiry';
  let answer = 'I\'ve searched our knowledge base for relevant information.';
  let articles = ['Getting Started Guide', 'Account Settings', 'FAQ'];

  if (lower.includes('delivery') || lower.includes('shipping')) {
    topic = 'Delivery & Fulfillment';
    answer = 'Delivery is available within a 15-mile radius. Orders placed before 2pm typically arrive same-day. Configure delivery zones in Dutchie Admin > Settings > Delivery.';
    articles = ['Delivery Setup', 'Zone Configuration', 'Driver Management'];
  } else if (lower.includes('discount') || lower.includes('promo') || lower.includes('coupon')) {
    topic = 'Discounts & Promotions';
    answer = 'Create discounts in Dutchie Admin > Marketing > Discounts. Supports percentage off, BOGO, bundle deals, and loyalty rewards.';
    articles = ['Creating Discounts', 'Promo Codes', 'Loyalty Programs'];
  } else if ((lower.includes('menu') || lower.includes('product') || lower.includes('catalog')) && !/reorder|stock|inventory|order more|running low|run out|replenish|supply/.test(lower)) {
    topic = 'Menu & Product Management';
    answer = 'Manage your product catalog in Dutchie Admin > Products. Bulk import via CSV, set up categories, add photos, and configure pricing.';
    articles = ['Product Setup', 'Bulk Import', 'Category Management'];
  } else if (lower.includes('payment') || lower.includes('pay')) {
    topic = 'Payments';
    answer = 'Dutchie supports debit, cashless ATM, Pay-by-Bank (ACH), and cash. Configure in Admin > Settings > Payments.';
    articles = ['Payment Setup', 'Pay-by-Bank Guide', 'Cashless ATM'];
  } else if (lower.includes('compliance') || lower.includes('regulation')) {
    topic = 'Compliance';
    answer = 'Dutchie maintains compliance with state regulations automatically. Verify settings in Admin > Compliance.';
    articles = ['Compliance Dashboard', 'State Reporting', 'Label Requirements'];
  } else if (/\b(hi|hello|hey|thanks|thank you|good morning|good afternoon)\b/.test(lower)) {
    return {
      text: `Hey there! I'm Customer Bridge, your AI assistant. I can help with campaigns, inventory, reports, reviews, sentiment analysis, and more. Just ask me anything!`,
      component: null,
      data: null,
    };
  }

  return {
    text: `Here's what I found on **${topic}**:\n\n${answer}`,
    component: 'kb',
    data: { topic, answer, articles },
  };
}

/* ─── Main Engine ─── */

export function processDtchMessage(userText, currentSpace) {
  const intent = detectIntent(userText);

  let response;
  switch (intent.lane) {
    case 'marketing':
      response = generateMarketingResponse(userText);
      break;
    case 'reporting':
      response = generateReportingResponse(userText);
      break;
    case 'reviews':
      response = generateReviewsResponse(userText);
      break;
    case 'sentiment':
      response = generateSentimentResponse(userText);
      break;
    case 'connect':
      response = generateConnectResponse(userText);
      break;
    case 'feedback':
      response = generateBugResponse(userText);
      break;
    case 'factory':
      response = generateFeatureResponse(userText);
      break;
    case 'support':
    default:
      response = generateSupportResponse(userText);
      break;
  }

  // Determine target space from intent routing
  const mappedSpace = INTENT_ROUTING[intent.lane] || null;
  const targetSpace = (mappedSpace && mappedSpace !== currentSpace) ? mappedSpace : null;

  return {
    intent: intent.lane,
    targetSpace,
    ...response,
  };
}
