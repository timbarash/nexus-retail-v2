// ═══════════════════════════════════════════════════════════════════
//  SLACK BRIDGE ENGINE — Intent Detection & Response Generation
//  Ports the Customer Bridge logic into Slack-formatted messages
// ═══════════════════════════════════════════════════════════════════

import { TEAM_MEMBERS, WORKFLOW_ROUTING } from '../../data/slackMockData';
import { resolveCampaign } from '../dtch/dtchBridgeEngine';

/* ─── Intent Detection (ported from CustomerBridge.jsx) ─── */

function detectIntent(text) {
  const lower = text.toLowerCase();

  // Marketing campaign detection
  const marketingPatterns = /\b(marketing campaign|run a campaign|launch a campaign|create a campaign|brand spotlight|flash sale|promotional campaign|email campaign|sms campaign|push campaign|promote|win.?back|re-?engage|lapsed customers|birthday campaign|loyalty campaign|4\/20 campaign|seasonal campaign|holiday campaign|product launch campaign)\b/;
  if (marketingPatterns.test(lower)) return { lane: 'marketing' };
  if (/\b(campaign|marketing|promote)\b/.test(lower) && /\b(jeeter|stiiizy|kiva|wyld|cookies|raw garden|alien labs|plus gummies|edibles|pre.?rolls?|vapes?)\b/.test(lower)) {
    return { lane: 'marketing' };
  }

  // Review feed
  const reviewFeedPatterns = /\b(show me reviews?|recent reviews?|latest reviews?|last week'?s? reviews?|this week'?s? reviews?|this month'?s? reviews?|5[- ]star|4[- ]star|3[- ]star|2[- ]star|1[- ]star|read reviews?|pull up reviews?|find reviews?|reviews? (about|mentioning|for|from|with|containing)|worst reviews?|best reviews?|top rated|lowest rated|angry reviews?|bad reviews?|good reviews?|great reviews?)\b/;
  if (reviewFeedPatterns.test(lower)) return { lane: 'reviews' };

  // Sentiment / NPS
  const sentimentPatterns = /\b(sentiment|nps|net promoter|customer feedback|customer sentiment|what are (customers|people) saying|brand sentiment|brand perception|reputation|ratings|customer complaints?|complaints?|how do customers feel|happy customers?|unhappy customers?|satisfaction|customer satisfaction|csat|feedback trends?|review trends?|what do people think|word cloud|top words?|mentions)\b/;
  if (sentimentPatterns.test(lower)) return { lane: 'sentiment' };

  // Reporting / analytics
  const reportingPatterns = /\b(sales|revenue|performance|report|reporting|analytics|metrics|kpi|average order|aov|basket size|transactions|conversion|year over year|yoy|week over week|wow|month over month|mom|compare|how are we doing|how did we do|top sellers|best sellers|top products|worst products|bottom products|daily sales|weekly sales|monthly sales|quarterly|growth rate|trend|customer count|units sold|gross margin|profit margin|net revenue)\b/;
  if (reportingPatterns.test(lower)) return { lane: 'reporting' };

  // Connect / inventory — broad inventory & purchasing detection
  const connectPatterns = /\b(reorder|re-?stock|out of stock|stockout|low stock|low inventory|inventory analysis|inventory check|check inventory|inventory report|purchasing|explore new products|trending products|margin analysis|vendor comparison|supplier|dead stock|replenish|what should we stock|catalog gaps|order optimization|seasonal forecast|running low|run out|running out|don't run out|need to order|need more|stock up|keep stocked|well.?stocked|fully stocked|shelf|fill the shelves?|supply chain|purchase order|po for|place.?an? order|order more|what do (i|we) need|what should (i|we) (buy|order)|inventory$|inventory\b|stock level|stock check|top up)\b/;
  if (connectPatterns.test(lower)) return { lane: 'connect' };
  // Brand + inventory/stock context → connect (not marketing)
  if (/\b(jeeter|stiiizy|kiva|wyld|cookies|raw garden|alien labs|plus|papa.?barkley)\b/.test(lower) && /\b(stock|inventory|order|supply|run out|running low|need more|reorder|enough)\b/.test(lower)) {
    return { lane: 'connect' };
  }

  // Bug / issue detection
  const bugPatterns = /\b(bug|broken|crash|error|glitch|lag|lagging|slow|not working|issue|problem|fix|doesn't work|won't load|stuck|freeze|freezing|down|outage|failing|fail)\b/;
  if (bugPatterns.test(lower)) {
    if (/inventory|stock|count|quantity/.test(lower) && /wrong|incorrect|off|mismatch|discrepancy/.test(lower)) {
      return { lane: 'support' };
    }
    return { lane: 'feedback', type: 'bug' };
  }

  // Feature request
  const featurePatterns = /\b(feature request|wish list|would be nice|suggest|idea|could you add|want to see|enhancement|new feature|please add|would love|be great if|can you build)\b/;
  if (featurePatterns.test(lower)) return { lane: 'factory', type: 'feature' };

  // Default — general support / conversational
  return { lane: 'support' };
}

/* ─── Ticket ID Generator ─── */
let ticketCounter = 4200;
function generateTicketId() {
  ticketCounter += Math.floor(Math.random() * 10) + 1;
  return `CB-${ticketCounter}`;
}

/* ─── Response Generators ─── */
// Each returns { text, attachment?, targetChannel? }

function generateMarketingResponse(userText) {
  const lower = userText.toLowerCase();

  let campaignName = 'Targeted Engagement Campaign';
  let segment = '2,400 customers — Active last 60 days';
  let channels = 'SMS, Email, Push Notification';
  let offer = '20% off select products';
  let projectedRevenue = '$14,800 — $22,200';
  let launchWindow = 'Next available Friday 10am → Sunday 11:59pm';

  if (lower.includes('jeeter') || lower.includes('pre-roll')) {
    campaignName = 'Brand Spotlight: Jeeter';
    segment = '12,847 customers — Jeeter loyalists + pre-roll enthusiasts';
    offer = '15% off all Jeeter products — code JEETER15';
    projectedRevenue = '$18,400 — $24,200';
  } else if (lower.includes('edible') || lower.includes('gumm')) {
    campaignName = 'Edibles Flash Sale';
    segment = '3,100 customers — Edible purchasers + browsers';
    offer = '25% off all edibles + free delivery';
    projectedRevenue = '$12,600 — $18,400';
  } else if (lower.includes('win') && lower.includes('back') || lower.includes('lapsed') || lower.includes('re-engage')) {
    campaignName = 'Win-Back: "We Miss You" Re-Engagement';
    segment = '1,840 customers — Lapsed 30+ days';
    offer = '30% off next order + free pre-roll';
    projectedRevenue = '$8,200 — $14,600';
  } else if (lower.includes('birthday') || lower.includes('loyalty')) {
    campaignName = 'Birthday & Loyalty Celebration';
    segment = '890 customers — Birthdays this month + top-tier loyalty';
    offer = 'Free 1g pre-roll + birthday discount 20%';
    projectedRevenue = '$6,400 — $9,800';
  } else if (lower.includes('4/20') || lower.includes('420')) {
    campaignName = '4/20 Mega Sale Event';
    segment = '8,200 customers — Full customer base';
    channels = 'SMS, Email, Push, In-Store Signage';
    offer = 'Up to 42% off storewide + mystery gift';
    projectedRevenue = '$42,000 — $68,000';
  } else if (lower.includes('stiiizy')) {
    campaignName = 'Brand Spotlight: STIIIZY';
    segment = '5,600 customers — Vape enthusiasts + STIIIZY purchasers';
    offer = 'Buy 2 STIIIZY pods, get 1 free';
    projectedRevenue = '$15,200 — $21,800';
  } else if (lower.includes('flash sale') || lower.includes('weekend')) {
    campaignName = 'Weekend Flash Sale';
    segment = '4,100 customers — High-engagement segment';
    offer = '30% off selected categories';
    projectedRevenue = '$16,200 — $23,400';
    launchWindow = 'This Friday 5pm → Sunday 11:59pm';
  }

  return {
    text: `📢 Campaign plan generated and ready for review. @Marcus Chen — please confirm creative assets and targeting.`,
    mentions: ['marcus'],
    attachment: {
      color: '#00C27C',
      title: `🚀 ${campaignName}`,
      fields: [
        { label: 'Channels', value: channels },
        { label: 'Target Segment', value: segment },
        { label: 'Offer', value: offer },
        { label: 'Launch Window', value: launchWindow },
        { label: 'Projected Revenue', value: projectedRevenue },
      ],
      footer: 'Customer Bridge • Campaign Engine v2.4',
    },
    deepLink: {
      type: 'campaign',
      label: 'View Campaign Plan',
      data: resolveCampaign(userText),
    },
    targetChannel: 'bridge-campaigns',
  };
}

function generateReportingResponse(userText) {
  const lower = userText.toLowerCase();

  let timeframe = 'This Week';
  let revenue = '$87,240';
  let growth = '+12.3%';
  let orders = '1,847';
  let aov = '$47.22';
  let topProduct = 'Blue Dream 3.5g (142 units)';

  if (lower.includes('month') || lower.includes('monthly')) {
    timeframe = 'This Month (March)';
    revenue = '$342,800';
    growth = '+8.7%';
    orders = '7,240';
    aov = '$47.35';
  } else if (lower.includes('quarter') || lower.includes('q1')) {
    timeframe = 'Q1 2026';
    revenue = '$1,028,400';
    growth = '+14.2%';
    orders = '21,720';
    aov = '$47.35';
    topProduct = 'Jeeter Baby Churros (2,180 units)';
  } else if (lower.includes('yesterday') || lower.includes('daily')) {
    timeframe = 'Yesterday';
    revenue = '$12,480';
    growth = '+3.1%';
    orders = '264';
    aov = '$47.27';
  }

  return {
    text: `📊 Performance report generated. @Rachel Torres — here's your ${timeframe.toLowerCase()} snapshot.`,
    mentions: ['rachel'],
    attachment: {
      color: '#58A6FF',
      title: `📈 Performance Report — ${timeframe}`,
      fields: [
        { label: 'Total Revenue', value: `${revenue} (${growth} vs prior period)` },
        { label: 'Total Orders', value: orders },
        { label: 'Avg Order Value', value: aov },
        { label: 'Top Seller', value: topProduct },
        { label: 'Customer Satisfaction', value: '4.3 / 5.0 (NPS: +42)' },
      ],
      footer: 'Customer Bridge • Analytics Engine',
    },
    deepLink: {
      type: 'report',
      label: 'View Full Report',
      data: null,
    },
    targetChannel: 'bridge-alerts',
  };
}

function generateReviewsResponse(userText) {
  const lower = userText.toLowerCase();

  let filterDesc = 'All recent reviews';
  let totalReviews = 142;
  let avgScore = '4.3';
  let sampleReview = '"Friendly staff and great product selection. Will definitely come back!" — Google';
  let sentiment = '78% Positive';

  if (lower.includes('negative') || lower.includes('bad') || lower.includes('worst') || lower.includes('angry') || lower.includes('1-star') || lower.includes('1 star')) {
    filterDesc = 'Negative reviews (1-2 stars)';
    totalReviews = 11;
    avgScore = '1.6';
    sampleReview = '"Waited 45 mins for my online order pickup. Staff seemed confused." — Google';
    sentiment = '100% Negative';
  } else if (lower.includes('5-star') || lower.includes('5 star') || lower.includes('best') || lower.includes('top')) {
    filterDesc = '5-star reviews';
    totalReviews = 64;
    avgScore = '5.0';
    sampleReview = '"Best dispensary in NYC hands down. Staff really knows their products." — Leafly';
    sentiment = '100% Positive';
  } else if (lower.includes('wait') || lower.includes('slow') || lower.includes('time')) {
    filterDesc = 'Reviews mentioning wait times';
    totalReviews = 18;
    avgScore = '2.8';
    sampleReview = '"Product is great but the wait times on weekends are getting worse." — Weedmaps';
    sentiment = '33% Positive, 67% Negative';
  }

  return {
    text: `📋 Found ${totalReviews} reviews matching "${filterDesc}". Average score: ${avgScore}/5.0. @Lisa Chang — here's the breakdown.`,
    mentions: ['lisa'],
    attachment: {
      color: totalReviews > 0 && parseFloat(avgScore) < 3 ? '#F85149' : '#00C27C',
      title: `⭐ Review Feed — ${filterDesc}`,
      fields: [
        { label: 'Total Reviews', value: `${totalReviews} matching reviews` },
        { label: 'Average Rating', value: `${avgScore} / 5.0` },
        { label: 'Sentiment', value: sentiment },
        { label: 'Sample', value: sampleReview },
        { label: 'Sources', value: 'Google (52%), Leafly (28%), Weedmaps (20%)' },
      ],
      footer: 'Customer Bridge • Review Monitor',
    },
    deepLink: {
      type: 'reviews',
      label: 'View Review Feed',
      data: null,
    },
    targetChannel: 'bridge-sentiment',
  };
}

function generateSentimentResponse(userText) {
  const lower = userText.toLowerCase();

  let focus = 'Overall';
  let topPraise = '"Friendly staff", "Great selection", "Fast delivery"';
  let topConcern = '"Wait times" (mentioned in 18 reviews)';
  let nps = '+42';

  if (lower.includes('delivery') || lower.includes('online')) {
    focus = 'Delivery & Online Orders';
    topPraise = '"Fast delivery", "Easy ordering", "Good packaging"';
    topConcern = '"Missing items in delivery" (mentioned in 6 reviews)';
  } else if (lower.includes('staff') || lower.includes('service')) {
    focus = 'Staff & Service';
    topPraise = '"Knowledgeable staff", "Friendly", "Patient with questions"';
    topConcern = '"Seemed rushed during peak hours" (mentioned in 4 reviews)';
  }

  return {
    text: `🌡️ Sentiment analysis complete. @Lisa Chang @Rachel Torres — here's the latest customer sentiment snapshot.`,
    mentions: ['lisa', 'rachel'],
    attachment: {
      color: '#00C27C',
      title: `📊 Sentiment Dashboard — ${focus}`,
      fields: [
        { label: 'Overall Score', value: '4.3 / 5.0 (+0.2 vs last week)' },
        { label: 'NPS', value: nps },
        { label: 'Positive', value: '78% ████████░░ (+5%)' },
        { label: 'Top Praise', value: topPraise },
        { label: 'Top Concern', value: topConcern },
        { label: 'Recommendation', value: 'Address wait time complaints — consider Saturday afternoon staffing' },
      ],
      footer: 'Customer Bridge • Sentiment Analyzer',
    },
    deepLink: {
      type: 'sentiment',
      label: 'View Sentiment Dashboard',
      data: null,
    },
    targetChannel: 'bridge-sentiment',
  };
}

function generateConnectResponse(userText) {
  const lower = userText.toLowerCase();

  let title = 'Inventory Recommendations';
  let fields = [
    { label: 'Action Items', value: '3 High Priority, 2 Medium, 1 Low' },
    { label: 'Top Priority', value: 'Blue Dream 3.5g — restock immediately (4 units left, threshold: 20)' },
    { label: 'Second Priority', value: 'Sour Diesel Cart 1g — rush order placed (7 units left)' },
    { label: 'Trending Product', value: 'Jeeter Baby Churros — +340% velocity, consider doubling order' },
    { label: 'Dead Stock Alert', value: '2 SKUs with 0 sales in 30 days — review for clearance' },
    { label: 'Estimated Lost Revenue', value: '$3,400/week from stockouts' },
  ];

  if (lower.includes('reorder') || lower.includes('out of stock') || lower.includes('restock')) {
    title = 'Reorder Analysis — Critical Stock';
    fields = [
      { label: 'Critical (Reorder NOW)', value: '3 SKUs below safety threshold' },
      { label: 'Blue Dream 3.5g', value: '4 units left — sells 8/day — ETA: Thursday' },
      { label: 'Sour Diesel Cart 1g', value: '7 units left — sells 5/day — ETA: Friday' },
      { label: 'Gummy Bears 10pk', value: '12 units left — sells 6/day — rush order recommended' },
      { label: 'Total Lost Revenue', value: '$3,400/week if not restocked' },
      { label: 'Supplier Status', value: 'Green Valley: responding ✅ | Peak Supply: pending ⏳' },
    ];
  } else if (lower.includes('trending') || lower.includes('explore') || lower.includes('new product')) {
    title = 'Trending Products Analysis';
    fields = [
      { label: 'Trending Up', value: 'Live Resin Carts (+42% velocity this month)' },
      { label: 'Market Gap', value: 'No THC beverages in catalog — $4.2K/mo opportunity' },
      { label: 'Competitor Watch', value: 'Green Leaf stocking Cann drinks — high demand' },
      { label: 'Recommendation', value: 'Add 3-4 beverage SKUs from Cann or Keef Brands' },
      { label: 'Margin Opportunity', value: 'Live resin margin 62% vs standard cart 48%' },
    ];
  }

  return {
    text: `📦 Inventory analysis complete. @Sofia Rodriguez — action items require your attention.`,
    mentions: ['sofia'],
    attachment: {
      color: '#D29922',
      title: `📋 ${title}`,
      fields,
      footer: 'Customer Bridge • Connect Agent',
    },
    deepLink: {
      type: 'reorder',
      label: 'View Inventory Analysis',
      data: null,
    },
    targetChannel: 'bridge-alerts',
  };
}

function generateBugResponse(userText) {
  const ticketId = generateTicketId();

  return {
    text: `🎫 Support ticket created. @Derek Williams @Rachel Torres — this issue has been logged and escalated to the engineering team.`,
    mentions: ['derek', 'rachel'],
    attachment: {
      color: '#F85149',
      title: `🐛 Bug Report — ${ticketId}`,
      fields: [
        { label: 'Reported Issue', value: userText.length > 100 ? userText.slice(0, 100) + '...' : userText },
        { label: 'Ticket ID', value: ticketId },
        { label: 'Status', value: 'In Queue — Engineering notified' },
        { label: 'Priority', value: 'P2 — Estimated response within 4 hours' },
        { label: 'Tracking', value: 'You\'ll receive updates here as the issue progresses' },
      ],
      footer: 'Customer Bridge • Support Escalation Engine',
    },
    deepLink: {
      type: 'bug',
      label: 'View Ticket',
      data: null,
    },
    targetChannel: 'bridge-alerts',
  };
}

function generateFeatureResponse(userText) {
  const ticketId = generateTicketId();

  return {
    text: `💡 Feature request submitted. @Rachel Torres — this has been added to the product backlog for review.`,
    mentions: ['rachel'],
    attachment: {
      color: '#B392F0',
      title: `✨ Feature Request — ${ticketId}`,
      fields: [
        { label: 'Request', value: userText.length > 100 ? userText.slice(0, 100) + '...' : userText },
        { label: 'Ticket ID', value: ticketId },
        { label: 'Status', value: 'Submitted — Product team notified' },
        { label: 'Next Steps', value: 'Product team will review in next sprint planning' },
      ],
      footer: 'Customer Bridge • Product Feedback',
    },
    deepLink: {
      type: 'feature',
      label: 'View Request',
      data: null,
    },
    targetChannel: 'bridge-alerts',
  };
}

function generateSupportResponse(userText) {
  const lower = userText.toLowerCase();

  let topic = 'General Inquiry';
  let answer = 'I\'ve searched our knowledge base for relevant information. Here\'s what I found:';
  let kbArticles = 'Getting Started Guide, Account Settings, FAQ';
  let relatedArticle = 'See our full documentation at Help Center';

  if (lower.includes('delivery') || lower.includes('shipping')) {
    topic = 'Delivery & Fulfillment';
    answer = 'Delivery is available within a 15-mile radius. Orders placed before 2pm typically arrive same-day. You can configure delivery zones and fees in Dutchie Admin → Settings → Delivery.';
    kbArticles = 'Delivery Setup, Zone Configuration, Driver Management';
  } else if (lower.includes('discount') || lower.includes('promo') || lower.includes('coupon')) {
    topic = 'Discounts & Promotions';
    answer = 'You can create discounts in Dutchie Admin → Marketing → Discounts. Supports percentage off, dollar amount off, BOGO, bundle deals, and loyalty rewards.';
    kbArticles = 'Creating Discounts, Promo Codes, Loyalty Programs';
  } else if (lower.includes('integration') || lower.includes('connect') || lower.includes('api')) {
    topic = 'Integrations';
    answer = 'Dutchie integrates with major platforms including Leafly, Weedmaps, Google Business, and over 20 POS systems. Integration setup is in Admin → Integrations.';
    kbArticles = 'Integration Guide, API Documentation, POS Sync';
  } else if ((lower.includes('menu') || lower.includes('product') || lower.includes('catalog')) && !/reorder|stock|inventory|order more|running low|run out|replenish|supply/.test(lower)) {
    topic = 'Menu & Product Management';
    answer = 'Manage your product catalog in Dutchie Admin → Products. You can bulk import via CSV, set up categories, add product photos, and configure pricing tiers.';
    kbArticles = 'Product Setup, Bulk Import, Category Management';
  } else if (lower.includes('payment') || lower.includes('pay')) {
    topic = 'Payments';
    answer = 'Dutchie supports debit, cashless ATM, Pay-by-Bank (ACH), and cash payments. Configure payment methods in Admin → Settings → Payments.';
    kbArticles = 'Payment Setup, Pay-by-Bank Guide, Cashless ATM';
  } else if (lower.includes('compliance') || lower.includes('regulation') || lower.includes('license')) {
    topic = 'Compliance';
    answer = 'Dutchie maintains compliance with state regulations automatically. Verify your compliance settings in Admin → Compliance. Reports can be generated for state submissions.';
    kbArticles = 'Compliance Dashboard, State Reporting, Label Requirements';
  } else if (/\b(hi|hello|hey|thanks|thank you|good morning|good afternoon)\b/.test(lower)) {
    return {
      text: `Hey there! 👋 I'm Customer Bridge, your AI assistant. I can help with campaigns, inventory, reports, reviews, sentiment analysis, and more. Just ask me anything!`,
      targetChannel: null, // stay in current channel
    };
  }

  return {
    text: `📚 Here's what I found on **${topic}**:\n\n${answer}`,
    attachment: {
      color: '#58A6FF',
      title: `📖 Knowledge Base — ${topic}`,
      fields: [
        { label: 'Related Articles', value: kbArticles },
        { label: 'Quick Tip', value: relatedArticle },
      ],
      footer: 'Customer Bridge • Knowledge Base',
    },
    targetChannel: null,
  };
}

/* ─── Main Engine ─── */

export function processSlackMessage(userText, currentChannel) {
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

  // If we're already in the target channel, or there's no specific target, post in current channel
  if (!response.targetChannel || response.targetChannel === currentChannel) {
    response.targetChannel = currentChannel;
  }

  return {
    intent: intent.lane,
    ...response,
  };
}
