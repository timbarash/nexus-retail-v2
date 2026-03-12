// Dutchie Voice AI — Mock call data for AWH sentiment dashboard
// ~200 deterministically generated call records spanning Oct 2025 – Feb 2026

import { locations, type LocationMeta } from './reviews';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VoiceAIIntent =
  | 'order_placement'
  | 'order_status'
  | 'menu_inquiry'
  | 'store_hours'
  | 'product_availability'
  | 'pricing_question'
  | 'complaint'
  | 'loyalty_program'
  | 'new_patient_info'
  | 'delivery_inquiry'
  | 'general_inquiry';

export type Resolution = 'resolved' | 'escalated' | 'callback' | 'abandoned';

export interface TranscriptLine {
  speaker: 'agent' | 'caller';
  text: string;
  time: string; // relative, e.g. "0:15"
}

export interface VoiceAICall {
  id: number;
  timestamp: string;
  duration: number; // seconds
  callerName: string;
  callerPhone: string;
  location: string;
  state: string;
  intent: VoiceAIIntent;
  intentLabel: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  resolution: Resolution;
  voiceAgent: string;
  transcript: TranscriptLine[];
  satisfactionRating: number | null;
  tags: string[];
  // Ordering data — populated when the call results in an order
  orderPlaced: boolean;
  orderTotal: number | null;     // dollars
  orderItems: number | null;     // item count
  orderCategory: string | null;  // e.g. "Flower", "Edibles", "Concentrates"
}

export interface VoiceAgentConfig {
  id: string;
  name: string;
  voiceId: string;
  voiceLabel: string;
  personality: string;
  greeting: string;
  goals: string[];
  escalationThreshold: number;
  isActive: boolean;
}

export interface VoiceOption {
  id: string;
  label: string;
  description: string;
}

export interface VoiceAIMetrics {
  totalCalls: number;
  avgDuration: number;
  avgSentimentScore: number;
  resolutionRate: number;
  escalationRate: number;
  avgSatisfaction: number;
  callsToday: number;
  callsTrend: 'up' | 'down' | 'flat';
  sentimentTrend: 'up' | 'down' | 'flat';
  // Ordering metrics
  totalOrders: number;
  orderConversionRate: number; // % of calls that result in orders
  totalRevenue: number;
  avgOrderValue: number;
}

export interface OrderCategoryBreakdown {
  category: string;
  orders: number;
  revenue: number;
  avgValue: number;
}

export interface OrderMonthlyTrend {
  month: string;
  orders: number;
  revenue: number;
  avgValue: number;
}

export interface VoiceAIMonthlyTrend {
  month: string;
  totalCalls: number;
  avgSentiment: number;
  resolutionRate: number;
  avgDuration: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface IntentDistribution {
  intent: VoiceAIIntent;
  label: string;
  count: number;
  percentage: number;
  avgSentiment: number;
  resolutionRate: number;
}

export interface HourlyCallVolume {
  hour: number;
  label: string;
  count: number;
  avgDuration: number;
}

// ---------------------------------------------------------------------------
// PRNG (Mulberry32) — same pattern as reviews.ts
// ---------------------------------------------------------------------------

function createRng(seed: number): () => number {
  let state = seed | 0;
  return function next() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function rngPick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function rngFloat(rng: () => number, min: number, max: number): number {
  return rng() * (max - min) + min;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const INTENT_LABELS: Record<VoiceAIIntent, string> = {
  order_placement: 'Order Placement',
  order_status: 'Order Status',
  menu_inquiry: 'Menu Inquiry',
  store_hours: 'Store Hours',
  product_availability: 'Product Availability',
  pricing_question: 'Pricing Question',
  complaint: 'Complaint',
  loyalty_program: 'Loyalty Program',
  new_patient_info: 'New Patient Info',
  delivery_inquiry: 'Delivery Inquiry',
  general_inquiry: 'General Inquiry',
};

const INTENTS: VoiceAIIntent[] = Object.keys(INTENT_LABELS) as VoiceAIIntent[];

// Weighted — order_placement and menu_inquiry are most common
const INTENT_WEIGHTS: VoiceAIIntent[] = [
  'order_placement', 'order_placement', 'order_placement', 'order_placement',
  'order_status', 'order_status', 'order_status',
  'menu_inquiry', 'menu_inquiry', 'menu_inquiry',
  'store_hours', 'store_hours',
  'product_availability', 'product_availability',
  'pricing_question',
  'complaint',
  'loyalty_program',
  'new_patient_info', 'new_patient_info',
  'delivery_inquiry',
  'general_inquiry', 'general_inquiry',
];

const ORDER_CATEGORIES = ['Flower', 'Edibles', 'Concentrates', 'Pre-Rolls', 'Vapes', 'Tinctures'];

const FIRST_NAMES = [
  'Sarah', 'Mike', 'Jessica', 'David', 'Emily', 'Chris', 'Amanda', 'James',
  'Lauren', 'Brian', 'Megan', 'Ryan', 'Ashley', 'Josh', 'Rachel', 'Tyler',
  'Nicole', 'Kevin', 'Stephanie', 'Matt', 'Alex', 'Jordan', 'Taylor', 'Morgan',
];

const LAST_INITIALS = 'ABCDEFGHIJKLMNOPRSTW';

const AGENTS = ['Sage', 'Ivy'];

// ---------------------------------------------------------------------------
// Transcript templates by intent
// ---------------------------------------------------------------------------

const TRANSCRIPTS: Record<VoiceAIIntent, TranscriptLine[][]> = {
  order_placement: [
    [
      { speaker: 'agent', text: "Thanks for calling Ascend! I can help you place an order. What are you looking for today?", time: '0:04' },
      { speaker: 'caller', text: "I want to order an eighth of Ozone Cake Mints and a pack of Simply Herb gummies.", time: '0:14' },
      { speaker: 'agent', text: "Great choices! I have the Ozone Cake Mints eighth at $45 and the Simply Herb Watermelon gummies at $20. That brings your total to $65 before tax. Would you like pickup or delivery?", time: '0:28' },
      { speaker: 'caller', text: "Pickup is fine. I can be there in about 30 minutes.", time: '0:34' },
      { speaker: 'agent', text: "Perfect! Your order is confirmed for pickup. You'll get a text when it's ready. Is there anything else I can add?", time: '0:42' },
      { speaker: 'caller', text: "Nope, that's it. Thanks!", time: '0:46' },
    ],
    [
      { speaker: 'agent', text: "Hi! Welcome to Ascend. Would you like to place an order today?", time: '0:03' },
      { speaker: 'caller', text: "Yeah, I want to try some of those Tunnel Vision pre-rolls. The 5-pack. And do you have any deals on vapes?", time: '0:13' },
      { speaker: 'agent', text: "The Tunnel Vision 5-pack is $35. And yes! We have 20% off all Ozone vape carts this week — a half-gram would be $32 instead of $40. Want me to add one?", time: '0:28' },
      { speaker: 'caller', text: "Yeah, add the vape too. What flavors do you have?", time: '0:33' },
      { speaker: 'agent', text: "We have Gelato, Wedding Cake, and Blue Dream in the half-gram. All excellent options.", time: '0:40' },
      { speaker: 'caller', text: "Gelato sounds good. So what's my total?", time: '0:45' },
      { speaker: 'agent', text: "$67 before tax. I'll have that ready for pickup. You'll receive a confirmation text shortly!", time: '0:52' },
    ],
  ],
  order_status: [
    [
      { speaker: 'agent', text: "Thanks for calling Ascend! I'd be happy to check on your order. Can you give me the order number or the name it's under?", time: '0:05' },
      { speaker: 'caller', text: "Yeah, it's under my name. I placed it about an hour ago online.", time: '0:12' },
      { speaker: 'agent', text: "I found your order right here. It looks like it's being prepared now and should be ready for pickup in about 15 minutes.", time: '0:22' },
      { speaker: 'caller', text: 'Perfect, thanks!', time: '0:28' },
    ],
    [
      { speaker: 'agent', text: "Hi there! Welcome to Ascend. How can I help you today?", time: '0:04' },
      { speaker: 'caller', text: "I placed an order earlier and got a confirmation text but nothing since. Just want to make sure it went through.", time: '0:14' },
      { speaker: 'agent', text: "Let me pull that up. Yes, I can see your order is confirmed and currently being fulfilled. You should receive a ready-for-pickup notification within the next 20 minutes.", time: '0:28' },
      { speaker: 'caller', text: "Great, appreciate it.", time: '0:33' },
    ],
  ],
  menu_inquiry: [
    [
      { speaker: 'agent', text: "Thank you for calling Ascend! What can I help you find today?", time: '0:04' },
      { speaker: 'caller', text: "I'm looking for any Ozone concentrates you have in stock. Specifically live resin if you have it.", time: '0:14' },
      { speaker: 'agent', text: "We currently have three Ozone live resin options — Cake Mints, South Beach, and MCR. They're all half-gram jars. Would you like me to set one aside for you?", time: '0:28' },
      { speaker: 'caller', text: "Yeah, put the Cake Mints aside. I'll be there in 30.", time: '0:35' },
    ],
    [
      { speaker: 'agent', text: "Hi! Thanks for calling. How can I help?", time: '0:03' },
      { speaker: 'caller', text: "Do you guys carry any edibles under $30?", time: '0:09' },
      { speaker: 'agent', text: "Absolutely! We have several options in that range. Our Simply Herb gummies start at $20 for a 100mg package, and we have Ozone chocolate bars at $25. Would you like more details on any of those?", time: '0:24' },
      { speaker: 'caller', text: "The gummies sound good. What flavors?", time: '0:30' },
      { speaker: 'agent', text: "We have Watermelon, Blue Raspberry, and Mixed Berry currently in stock.", time: '0:36' },
    ],
  ],
  store_hours: [
    [
      { speaker: 'agent', text: "Thanks for calling Ascend! How can I help?", time: '0:03' },
      { speaker: 'caller', text: "What are your hours today?", time: '0:07' },
      { speaker: 'agent', text: "We're open today from 9 AM to 9 PM. Is there anything else I can help with?", time: '0:13' },
      { speaker: 'caller', text: "Nope, that's it. Thanks!", time: '0:16' },
    ],
  ],
  product_availability: [
    [
      { speaker: 'agent', text: "Hi, welcome to Ascend! How can I assist you?", time: '0:04' },
      { speaker: 'caller', text: "I was wondering if you still have those Tunnel Vision pre-rolls. I got them last week and they were fire.", time: '0:14' },
      { speaker: 'agent', text: "Great choice! Yes, we do have Tunnel Vision pre-rolls in stock. We have both the singles and the 5-packs available.", time: '0:24' },
      { speaker: 'caller', text: "I'll take a 5-pack. Can I order for pickup?", time: '0:30' },
      { speaker: 'agent', text: "Absolutely! I can set that aside for you or I can walk you through placing an online order. Which would you prefer?", time: '0:38' },
    ],
  ],
  pricing_question: [
    [
      { speaker: 'agent', text: "Thank you for calling Ascend! What can I help you with?", time: '0:04' },
      { speaker: 'caller', text: "What's the price difference between an eighth and a quarter of Ozone flower?", time: '0:12' },
      { speaker: 'agent', text: "Our Ozone eighths are $45 and quarters are $80, so you save $10 when you go with the quarter. We also have a first-time patient discount of 20% if you haven't used that yet.", time: '0:28' },
      { speaker: 'caller', text: "Oh nice, I haven't used that yet. I'll come in today.", time: '0:34' },
    ],
  ],
  complaint: [
    [
      { speaker: 'agent', text: "Thank you for calling Ascend. How can I assist you today?", time: '0:04' },
      { speaker: 'caller', text: "I picked up an order yesterday and one of the cartridges is defective. It won't hit at all.", time: '0:13' },
      { speaker: 'agent', text: "I'm really sorry to hear that. I completely understand how frustrating that must be. Let me connect you with our customer care team who can arrange an exchange for you right away.", time: '0:26' },
      { speaker: 'caller', text: "Okay, please do. This is the second time this has happened.", time: '0:32' },
      { speaker: 'agent', text: "I apologize for the repeat issue. I'm noting that in your account. Let me transfer you now — they'll be able to help you with both the exchange and a goodwill credit.", time: '0:44' },
    ],
  ],
  loyalty_program: [
    [
      { speaker: 'agent', text: "Hi! Thanks for calling Ascend. How can I help?", time: '0:04' },
      { speaker: 'caller', text: "I want to know about your rewards program. How does it work?", time: '0:11' },
      { speaker: 'agent', text: "Great question! Our loyalty program gives you 1 point for every dollar spent. Once you reach 200 points, you get $10 off your next purchase. You also get double points on your birthday month!", time: '0:26' },
      { speaker: 'caller', text: "That sounds good. Can I sign up over the phone?", time: '0:31' },
      { speaker: 'agent', text: "You can! I just need your name, phone number, and email to get you set up. It takes about a minute.", time: '0:38' },
    ],
  ],
  new_patient_info: [
    [
      { speaker: 'agent', text: "Welcome to Ascend! How can I help you today?", time: '0:04' },
      { speaker: 'caller', text: "Hi, I just got my medical card and I've never been to a dispensary before. What do I need to bring?", time: '0:14' },
      { speaker: 'agent', text: "Congratulations on getting your card! You'll need to bring your state-issued medical cannabis card and a valid government-issued photo ID. We also offer a 20% first-visit discount!", time: '0:29' },
      { speaker: 'caller', text: "Awesome. And can someone help me pick out products? I don't really know what I'm looking for yet.", time: '0:38' },
      { speaker: 'agent', text: "Absolutely! Our patient consultants are there to help first-time patients find the right products for their needs. I'd recommend scheduling a consultation — would you like me to set that up?", time: '0:50' },
    ],
  ],
  delivery_inquiry: [
    [
      { speaker: 'agent', text: "Thanks for calling Ascend! What can I do for you?", time: '0:04' },
      { speaker: 'caller', text: "Do you offer delivery to my area? I'm in the south side of Chicago.", time: '0:11' },
      { speaker: 'agent', text: "Yes, we do deliver to most areas in Chicago! Delivery is free on orders over $100, and there's a $10 fee for orders under that. Typical delivery windows are 1-3 hours.", time: '0:25' },
      { speaker: 'caller', text: "Cool, and can I pay with debit on delivery?", time: '0:30' },
      { speaker: 'agent', text: "Yes, we accept debit cards on delivery as well as cash. Would you like to place a delivery order now?", time: '0:37' },
    ],
  ],
  general_inquiry: [
    [
      { speaker: 'agent', text: "Hi, thanks for calling Ascend! How can I help you today?", time: '0:04' },
      { speaker: 'caller', text: "I was just wondering if your parking lot situation has improved. Last time it was packed.", time: '0:12' },
      { speaker: 'agent', text: "Thanks for the feedback! We actually added additional parking in the back of the building last month. There's now overflow parking available as well. You shouldn't have any trouble finding a spot.", time: '0:26' },
      { speaker: 'caller', text: "Good to know. I'll stop by this weekend then.", time: '0:31' },
    ],
  ],
};

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

const voiceRng = createRng(7749);

function generateCalls(count: number): VoiceAICall[] {
  const calls: VoiceAICall[] = [];
  // Date range: 2025-10-01 to 2026-02-26
  const startMs = new Date('2025-10-01T09:00:00').getTime();
  const endMs = new Date('2026-02-26T21:00:00').getTime();
  const rangeMs = endMs - startMs;

  for (let i = 0; i < count; i++) {
    const timestampMs = startMs + Math.floor(voiceRng() * rangeMs);
    const date = new Date(timestampMs);
    // Clamp hours to 9 AM – 9 PM (business hours)
    const hour = 9 + rngInt(voiceRng, 0, 11);
    date.setHours(hour, rngInt(voiceRng, 0, 59), rngInt(voiceRng, 0, 59));

    const intent = rngPick(voiceRng, INTENT_WEIGHTS);
    const loc: LocationMeta = rngPick(voiceRng, locations);
    const firstName = rngPick(voiceRng, FIRST_NAMES);
    const lastInit = LAST_INITIALS[rngInt(voiceRng, 0, LAST_INITIALS.length - 1)];

    // Sentiment — complaints skew negative, others skew positive
    let sentimentScore: number;
    if (intent === 'complaint') {
      sentimentScore = rngFloat(voiceRng, -0.9, -0.1);
    } else {
      const roll = voiceRng();
      if (roll < 0.55) sentimentScore = rngFloat(voiceRng, 0.2, 0.9);
      else if (roll < 0.85) sentimentScore = rngFloat(voiceRng, -0.15, 0.2);
      else sentimentScore = rngFloat(voiceRng, -0.7, -0.15);
    }
    const sentiment: VoiceAICall['sentiment'] =
      sentimentScore > 0.15 ? 'positive' : sentimentScore < -0.15 ? 'negative' : 'neutral';

    // Resolution
    let resolution: Resolution;
    if (intent === 'complaint') {
      resolution = rngPick(voiceRng, ['escalated', 'escalated', 'callback', 'resolved']);
    } else {
      const r = voiceRng();
      if (r < 0.72) resolution = 'resolved';
      else if (r < 0.85) resolution = 'escalated';
      else if (r < 0.95) resolution = 'callback';
      else resolution = 'abandoned';
    }

    // Duration — resolved calls shorter, escalated/complaint longer
    let baseDuration: number;
    if (intent === 'store_hours') baseDuration = rngInt(voiceRng, 20, 60);
    else if (intent === 'complaint') baseDuration = rngInt(voiceRng, 120, 420);
    else if (resolution === 'escalated') baseDuration = rngInt(voiceRng, 90, 300);
    else baseDuration = rngInt(voiceRng, 45, 210);

    // Transcript
    const templates = TRANSCRIPTS[intent];
    const transcript = rngPick(voiceRng, templates);

    // Satisfaction — only 60% of calls get a rating
    let satisfactionRating: number | null = null;
    if (voiceRng() < 0.6) {
      if (sentiment === 'positive') satisfactionRating = rngInt(voiceRng, 4, 5);
      else if (sentiment === 'neutral') satisfactionRating = rngInt(voiceRng, 3, 4);
      else satisfactionRating = rngInt(voiceRng, 1, 3);
    }

    // Ordering — order_placement calls always place orders,
    // menu_inquiry & product_availability sometimes convert
    let orderPlaced = false;
    let orderTotal: number | null = null;
    let orderItems: number | null = null;
    let orderCategory: string | null = null;

    if (intent === 'order_placement' && resolution === 'resolved') {
      orderPlaced = true;
    } else if ((intent === 'menu_inquiry' || intent === 'product_availability') && resolution === 'resolved') {
      orderPlaced = voiceRng() < 0.35; // 35% conversion
    }

    if (orderPlaced) {
      orderItems = rngInt(voiceRng, 1, 5);
      orderTotal = Math.round(rngFloat(voiceRng, 20, 180) * 100) / 100;
      orderCategory = rngPick(voiceRng, ORDER_CATEGORIES);
    }

    // Tags
    const tags: string[] = [intent.replace(/_/g, '-')];
    if (resolution === 'escalated') tags.push('escalated');
    if (satisfactionRating !== null && satisfactionRating >= 5) tags.push('top-rated');
    if (baseDuration > 300) tags.push('long-call');
    if (orderPlaced) tags.push('order-placed');

    calls.push({
      id: i + 1,
      timestamp: date.toISOString(),
      duration: baseDuration,
      callerName: `${firstName} ${lastInit}.`,
      callerPhone: `(555) ***-${String(rngInt(voiceRng, 1000, 9999))}`,
      location: loc.name,
      state: loc.state,
      intent,
      intentLabel: INTENT_LABELS[intent],
      sentiment,
      sentimentScore: Math.round(sentimentScore * 100) / 100,
      resolution,
      voiceAgent: rngPick(voiceRng, AGENTS),
      transcript,
      satisfactionRating,
      tags,
      orderPlaced,
      orderTotal,
      orderItems,
      orderCategory,
    });
  }

  // Sort chronologically
  calls.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return calls;
}

export const voiceAICalls = generateCalls(200);

// ---------------------------------------------------------------------------
// Pre-computed aggregates
// ---------------------------------------------------------------------------

function computeMetrics(calls: VoiceAICall[]): VoiceAIMetrics {
  const totalCalls = calls.length;
  const avgDuration = Math.round(calls.reduce((s, c) => s + c.duration, 0) / totalCalls);
  const avgSentimentScore = Math.round((calls.reduce((s, c) => s + c.sentimentScore, 0) / totalCalls) * 100) / 100;
  const resolved = calls.filter(c => c.resolution === 'resolved').length;
  const escalated = calls.filter(c => c.resolution === 'escalated').length;
  const rated = calls.filter(c => c.satisfactionRating !== null);
  const avgSatisfaction = Math.round((rated.reduce((s, c) => s + (c.satisfactionRating ?? 0), 0) / rated.length) * 10) / 10;

  // "Today" calls (last day in dataset range)
  const lastDate = calls[calls.length - 1]?.timestamp.slice(0, 10) ?? '';
  const callsToday = calls.filter(c => c.timestamp.startsWith(lastDate)).length;

  // Ordering metrics
  const orderedCalls = calls.filter(c => c.orderPlaced);
  const totalOrders = orderedCalls.length;
  const totalRevenue = Math.round(orderedCalls.reduce((s, c) => s + (c.orderTotal ?? 0), 0) * 100) / 100;

  return {
    totalCalls,
    avgDuration,
    avgSentimentScore,
    resolutionRate: Math.round((resolved / totalCalls) * 100) / 100,
    escalationRate: Math.round((escalated / totalCalls) * 100) / 100,
    avgSatisfaction,
    callsToday,
    callsTrend: 'up',
    sentimentTrend: 'up',
    totalOrders,
    orderConversionRate: Math.round((totalOrders / totalCalls) * 100) / 100,
    totalRevenue,
    avgOrderValue: totalOrders ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
  };
}

export const voiceAIMetrics = computeMetrics(voiceAICalls);

// Monthly trend
function computeMonthlyTrend(calls: VoiceAICall[]): VoiceAIMonthlyTrend[] {
  const months: Record<string, VoiceAICall[]> = {};
  for (const c of calls) {
    const m = c.timestamp.slice(0, 7); // "2025-10"
    (months[m] ??= []).push(c);
  }

  const labels: Record<string, string> = {
    '2025-10': 'Oct', '2025-11': 'Nov', '2025-12': 'Dec',
    '2026-01': 'Jan', '2026-02': 'Feb',
  };

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, mc]) => {
      const pos = mc.filter(c => c.sentiment === 'positive').length;
      const neg = mc.filter(c => c.sentiment === 'negative').length;
      const neu = mc.filter(c => c.sentiment === 'neutral').length;
      const resolved = mc.filter(c => c.resolution === 'resolved').length;
      return {
        month: labels[key] ?? key,
        totalCalls: mc.length,
        avgSentiment: Math.round((mc.reduce((s, c) => s + c.sentimentScore, 0) / mc.length) * 100) / 100,
        resolutionRate: Math.round((resolved / mc.length) * 100) / 100,
        avgDuration: Math.round(mc.reduce((s, c) => s + c.duration, 0) / mc.length),
        positive: pos,
        neutral: neu,
        negative: neg,
      };
    });
}

export const voiceAIMonthlyTrend = computeMonthlyTrend(voiceAICalls);

// Intent distribution
function computeIntentDistribution(calls: VoiceAICall[]): IntentDistribution[] {
  const groups: Record<string, VoiceAICall[]> = {};
  for (const c of calls) {
    (groups[c.intent] ??= []).push(c);
  }
  return INTENTS
    .filter(i => groups[i])
    .map(intent => {
      const g = groups[intent];
      const resolved = g.filter(c => c.resolution === 'resolved').length;
      return {
        intent,
        label: INTENT_LABELS[intent],
        count: g.length,
        percentage: Math.round((g.length / calls.length) * 100),
        avgSentiment: Math.round((g.reduce((s, c) => s + c.sentimentScore, 0) / g.length) * 100) / 100,
        resolutionRate: Math.round((resolved / g.length) * 100) / 100,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export const intentDistribution = computeIntentDistribution(voiceAICalls);

// Hourly volume
function computeHourlyVolume(calls: VoiceAICall[]): HourlyCallVolume[] {
  const hours: Record<number, VoiceAICall[]> = {};
  for (const c of calls) {
    const h = new Date(c.timestamp).getHours();
    (hours[h] ??= []).push(c);
  }
  const result: HourlyCallVolume[] = [];
  for (let h = 9; h <= 20; h++) {
    const hc = hours[h] ?? [];
    const suffix = h < 12 ? 'AM' : 'PM';
    const display = h <= 12 ? h : h - 12;
    result.push({
      hour: h,
      label: `${display} ${suffix}`,
      count: hc.length,
      avgDuration: hc.length ? Math.round(hc.reduce((s, c) => s + c.duration, 0) / hc.length) : 0,
    });
  }
  return result;
}

export const hourlyCallVolume = computeHourlyVolume(voiceAICalls);

// Resolution distribution (for donut chart)
export const resolutionDistribution = (() => {
  const counts: Record<Resolution, number> = { resolved: 0, escalated: 0, callback: 0, abandoned: 0 };
  for (const c of voiceAICalls) counts[c.resolution]++;
  return [
    { name: 'Resolved', value: counts.resolved, color: '#6ABA48' },
    { name: 'Escalated', value: counts.escalated, color: '#f59e0b' },
    { name: 'Callback', value: counts.callback, color: '#6366f1' },
    { name: 'Abandoned', value: counts.abandoned, color: '#ef4444' },
  ];
})();

// ---------------------------------------------------------------------------
// Voice agent configs & voice options
// ---------------------------------------------------------------------------

export const voiceAgentConfigs: VoiceAgentConfig[] = [
  {
    id: 'sage',
    name: 'Sage',
    voiceId: 'nova',
    voiceLabel: 'Nova',
    personality: 'Professional, calm, and knowledgeable. Speaks clearly with a measured pace.',
    greeting: 'Thank you for calling Ascend Wellness. My name is Sage, how can I help you today?',
    goals: [
      'Resolve inquiries on first call without escalation',
      'Promote current daily deals and specials',
      'Collect customer satisfaction rating after each call',
      'Identify upsell opportunities for loyalty program',
    ],
    escalationThreshold: 180,
    isActive: true,
  },
  {
    id: 'ivy',
    name: 'Ivy',
    voiceId: 'shimmer',
    voiceLabel: 'Shimmer',
    personality: 'Warm, conversational, and approachable. Uses a friendly, casual tone.',
    greeting: "Hey there! Thanks for calling Ascend. I'm Ivy — what can I do for you?",
    goals: [
      'Create a welcoming first impression for new patients',
      'Answer menu and product questions accurately',
      'Collect feedback on recent dispensary visits',
      'Guide callers through online ordering process',
    ],
    escalationThreshold: 150,
    isActive: true,
  },
  {
    id: 'atlas',
    name: 'Atlas',
    voiceId: 'echo',
    voiceLabel: 'Echo',
    personality: 'Efficient, direct, and concise. Gets to the point quickly.',
    greeting: 'Ascend Wellness, this is Atlas. How may I assist you?',
    goals: [
      'Minimize average call duration while maintaining quality',
      'Handle high call volumes during peak hours',
      'Provide accurate store hours and location information',
      'Triage complaints and route to appropriate staff',
    ],
    escalationThreshold: 120,
    isActive: false,
  },
];

export const voiceOptions: VoiceOption[] = [
  { id: 'alloy', label: 'Alloy', description: 'Neutral and balanced — works well for all demographics' },
  { id: 'nova', label: 'Nova', description: 'Warm and expressive female voice — great for customer service' },
  { id: 'shimmer', label: 'Shimmer', description: 'Energetic and upbeat — ideal for younger audiences' },
  { id: 'echo', label: 'Echo', description: 'Calm and authoritative male voice — professional tone' },
  { id: 'onyx', label: 'Onyx', description: 'Deep and reassuring — builds trust and confidence' },
  { id: 'fable', label: 'Fable', description: 'Friendly storyteller — engaging and memorable' },
];

// ---------------------------------------------------------------------------
// Ordering aggregates
// ---------------------------------------------------------------------------

export const orderCategoryBreakdown: OrderCategoryBreakdown[] = (() => {
  const cats: Record<string, { orders: number; revenue: number }> = {};
  for (const c of voiceAICalls) {
    if (!c.orderPlaced || !c.orderCategory) continue;
    const cat = cats[c.orderCategory] ??= { orders: 0, revenue: 0 };
    cat.orders++;
    cat.revenue += c.orderTotal ?? 0;
  }
  return Object.entries(cats)
    .map(([category, d]) => ({
      category,
      orders: d.orders,
      revenue: Math.round(d.revenue * 100) / 100,
      avgValue: Math.round((d.revenue / d.orders) * 100) / 100,
    }))
    .sort((a, b) => b.revenue - a.revenue);
})();

export const orderMonthlyTrend: OrderMonthlyTrend[] = (() => {
  const months: Record<string, { orders: number; revenue: number }> = {};
  for (const c of voiceAICalls) {
    if (!c.orderPlaced) continue;
    const m = c.timestamp.slice(0, 7);
    const mo = months[m] ??= { orders: 0, revenue: 0 };
    mo.orders++;
    mo.revenue += c.orderTotal ?? 0;
  }
  const labels: Record<string, string> = {
    '2025-10': 'Oct', '2025-11': 'Nov', '2025-12': 'Dec',
    '2026-01': 'Jan', '2026-02': 'Feb',
  };
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, d]) => ({
      month: labels[key] ?? key,
      orders: d.orders,
      revenue: Math.round(d.revenue * 100) / 100,
      avgValue: d.orders ? Math.round((d.revenue / d.orders) * 100) / 100 : 0,
    }));
})();

// Top ordered items (simulated popular products)
export const topOrderedProducts = [
  { name: 'Ozone Cake Mints 3.5g', category: 'Flower', orders: 34, revenue: 1530 },
  { name: 'Simply Herb Gummies 100mg', category: 'Edibles', orders: 28, revenue: 560 },
  { name: 'Tunnel Vision 5-Pack', category: 'Pre-Rolls', orders: 25, revenue: 875 },
  { name: 'Ozone Live Resin 0.5g', category: 'Concentrates', orders: 22, revenue: 1320 },
  { name: "Effin' Vape Cart 0.5g", category: 'Vapes', orders: 19, revenue: 760 },
  { name: 'ASCEND Tincture 30ml', category: 'Tinctures', orders: 14, revenue: 700 },
  { name: 'Simply Herb Pre-Roll 1g', category: 'Pre-Rolls', orders: 12, revenue: 120 },
  { name: 'Ozone Wedding Cake 3.5g', category: 'Flower', orders: 11, revenue: 495 },
];
