// ═══════════════════════════════════════════════════════════════════
//  DTCH MOCK DATA — Spaces, Routing, and Seeded Messages
//  Ascend Wellness — Team Chat Multi-Channel Architecture
// ═══════════════════════════════════════════════════════════════════

import { TEAM_MEMBERS, CURRENT_USER } from './slackMockData';

// Re-export for convenience
export { TEAM_MEMBERS, CURRENT_USER };

/* ─── Spaces (not Channels) ─── */

export const DTCH_SPACES = [
  // Hub
  { id: 'lounge',           name: 'Lounge',           emoji: '💬', section: 'Hub', description: 'Team announcements, shout-outs, and general vibes' },
  // Ops
  { id: 'campaigns',        name: 'Campaigns',        emoji: '🚀', section: 'Ops', description: 'Campaign launches, approvals, and performance tracking' },
  { id: 'inventory',        name: 'Inventory',        emoji: '📦', section: 'Ops', description: 'Inventory alerts, reorder tracking, and supplier updates' },
  { id: 'sales-floor',      name: 'Sales Floor',      emoji: '🏪', section: 'Ops', description: 'Scheduling, shift coverage, and floor operations' },
  { id: 'customer-issues',  name: 'Customer Issues',  emoji: '⭐', section: 'Ops', description: 'Customer feedback, support tickets, and experience metrics' },
  { id: 'cash-desk',        name: 'Cash Desk',        emoji: '💰', section: 'Ops', description: 'Cash counts, drawer reconciliation, and payment issues' },
  { id: 'compliance',       name: 'Compliance',       emoji: '🛡', section: 'Ops', description: 'METRC tracking, license renewals, and regulatory alerts' },
  { id: 'managers-office',  name: "Manager's Office", emoji: '📋', section: 'Ops', description: 'P&L reviews, goal tracking, and management decisions' },
  { id: 'vendor-alley',     name: 'Vendor Alley',     emoji: '🤝', section: 'Ops', description: 'Purchase orders, vendor comms, and delivery tracking' },
  // AI
  { id: 'ai-alerts',        name: 'AI Alerts',        emoji: '🤖', section: 'AI',  description: 'AI-powered insights, reports, sentiment, and automated alerts' },
];

export const DTCH_SECTIONS = ['Hub', 'Ops', 'AI'];

/* ─── Routing Config — Intent → Target Space ─── */

export const INTENT_ROUTING = {
  marketing:  'campaigns',
  reporting:  'ai-alerts',
  connect:    'ai-alerts',
  feedback:   'ai-alerts',
  factory:    'ai-alerts',
  reviews:    'ai-alerts',
  sentiment:  'ai-alerts',
  support:    null, // stays in current space
};

/* ─── Helper to create timestamps relative to "now" ─── */

function timeAgo(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
}

/* ─── Seeded Messages (~45 across all 8 spaces) ─── */

export const DTCH_INITIAL_MESSAGES = {
  // ─── Lounge (Hub) ─────────────────────────────────────────
  lounge: [
    {
      id: 'lo-1',
      userId: 'rachel',
      timestamp: timeAgo(480),
      text: 'Morning team! Quick reminder — Q1 review is this Friday at 2pm. Department leads, please have your summaries ready by Thursday EOD.',
      reactions: [{ emoji: '👍', count: 4, users: ['marcus', 'sofia', 'derek', 'lisa'] }],
    },
    {
      id: 'lo-2',
      userId: 'bridge',
      timestamp: timeAgo(478),
      text: 'I\'ll have auto-generated dashboards ready for each department by Thursday morning. Ping me if you need custom data cuts.',
      reactions: [{ emoji: '🤖', count: 2, users: ['rachel', 'marcus'] }],
    },
    {
      id: 'lo-3',
      userId: 'james',
      timestamp: timeAgo(400),
      text: 'We just hit **500 five-star reviews** on Google! Huge milestone for the team. Couldn\'t have done it without everyone\'s effort.',
      reactions: [{ emoji: '🎉', count: 6, users: ['rachel', 'marcus', 'sofia', 'lisa', 'derek', 'nina'] }, { emoji: '⭐', count: 3, users: ['rachel', 'lisa', 'marcus'] }],
    },
    {
      id: 'lo-4',
      userId: 'rachel',
      timestamp: timeAgo(395),
      text: 'Incredible! @James Okafor your customer-first approach is a real differentiator. Proud of this team.',
      mentions: ['james'],
    },
    {
      id: 'lo-5',
      userId: 'nina',
      timestamp: timeAgo(200),
      text: 'February compliance audit passed with **zero findings**. Report filed with the state. We\'re in great shape heading into Q2.',
      reactions: [{ emoji: '✅', count: 3, users: ['rachel', 'derek', 'sofia'] }],
    },
    {
      id: 'lo-6',
      userId: 'bridge',
      timestamp: timeAgo(180),
      text: '🏆 Fun fact: Ascend\'s 4.3 avg rating puts you in the **top 8% of multi-state operators** by customer sentiment. Your strongest differentiator is "Staff Knowledge" — mentioned positively in 34% of reviews.',
      reactions: [{ emoji: '🔥', count: 3, users: ['rachel', 'james', 'marcus'] }],
    },
  ],

  // ─── Campaigns (Ops) ──────────────────────────────────────
  campaigns: [
    {
      id: 'cp-1',
      userId: 'bridge',
      timestamp: timeAgo(360),
      text: '📢 New campaign drafted and ready for review. @Marcus Chen — please confirm creative assets and targeting.',
      mentions: ['marcus'],
      reactions: [{ emoji: '🚀', count: 2, users: ['rachel', 'marcus'] }],
    },
    {
      id: 'cp-2',
      userId: 'marcus',
      timestamp: timeAgo(350),
      text: 'Love the targeting on this one. Creative approved — let\'s schedule it for the next available window. Can we also get a VIP variant with a 30% threshold?',
    },
    {
      id: 'cp-3',
      userId: 'bridge',
      timestamp: timeAgo(348),
      text: '✅ Campaign is now **LIVE**. VIP variant created with 30% discount. I\'ll post performance metrics at T+24h and T+48h.',
      reactions: [{ emoji: '✅', count: 2, users: ['marcus', 'rachel'] }],
    },
    {
      id: 'cp-4',
      userId: 'bridge',
      timestamp: timeAgo(120),
      text: '📊 **T+24h Performance Update** — "Spring Into Savings" is outperforming projections.\n\n• SMS Delivered: 2,118 / 2,341 (90.5%)\n• Open Rate: 68.2% (+14% vs avg)\n• Click-through: 23.1% (+8% vs avg)\n• Revenue: $12,340 from 187 orders\n• Est. Final: $26,100 (above projection)',
      reactions: [{ emoji: '🎉', count: 3, users: ['marcus', 'rachel', 'lisa'] }],
    },
    {
      id: 'cp-5',
      userId: 'marcus',
      timestamp: timeAgo(100),
      text: 'Numbers look fantastic. Let\'s brief Rachel on the follow-up "Edible Enthusiast" campaign targeting the 187 converters.',
    },
    {
      id: 'cp-6',
      userId: 'rachel',
      timestamp: timeAgo(90),
      text: 'Great results. Approved for the follow-up — let\'s keep the momentum going into March.',
      reactions: [{ emoji: '💪', count: 2, users: ['marcus', 'bridge'] }],
    },
  ],

  // ─── Inventory (Ops) ─────────────────────────────────────
  inventory: [
    {
      id: 'sr-1',
      userId: 'bridge',
      timestamp: timeAgo(240),
      text: '🔴 **Low Stock Alert** — Critical levels detected on 3 SKUs. @Sofia Rodriguez — immediate attention required.\n\n• Blue Dream 3.5g: 4 units (threshold: 20)\n• Sour Diesel Cart 1g: 7 units (threshold: 15)\n• Gummy Bears 10pk: 12 units (threshold: 25)',
      mentions: ['sofia'],
      reactions: [{ emoji: '👀', count: 1, users: ['sofia'] }],
      urgency: 'critical',
    },
    {
      id: 'sr-2',
      userId: 'sofia',
      timestamp: timeAgo(230),
      text: 'On it. Blue Dream PO already submitted yesterday — ETA Thursday. Placing rush orders for the other two now.',
    },
    {
      id: 'sr-3',
      userId: 'bridge',
      timestamp: timeAgo(228),
      text: '✅ Noted. Forecast model updated. The Sour Diesel reorder may affect the "Weekend Vape Special" — I\'ll notify @Marcus Chen if stock won\'t arrive in time.',
      mentions: ['marcus'],
    },
    {
      id: 'sr-4',
      userId: 'sofia',
      timestamp: timeAgo(150),
      text: 'Weekly inventory count complete. We\'re in good shape except for the items flagged above. Blue Dream restock confirmed for Thursday delivery.',
      reactions: [{ emoji: '✅', count: 1, users: ['rachel'] }],
    },
    {
      id: 'sr-5',
      userId: 'bridge',
      timestamp: timeAgo(60),
      text: '📦 **Vendor Update**: GreenLeaf Supply confirmed Sour Diesel rush order — ETA Friday morning. All 3 critical SKUs will be restocked by end of week.',
      reactions: [{ emoji: '🙌', count: 2, users: ['sofia', 'rachel'] }],
    },
  ],

  // ─── Sales Floor (Ops) ──────────────────────────────────────
  'sales-floor': [
    {
      id: 'fo-1',
      userId: 'derek',
      timestamp: timeAgo(420),
      text: 'Updated the Saturday schedule — added an extra 12–4pm shift per Bridge\'s staffing recommendation. @James Okafor can you find coverage?',
      mentions: ['james'],
    },
    {
      id: 'fo-2',
      userId: 'james',
      timestamp: timeAgo(410),
      text: 'Already on it. Tanya confirmed she can cover Saturdays for the rest of March.',
      reactions: [{ emoji: '🙌', count: 2, users: ['derek', 'rachel'] }],
    },
    {
      id: 'fo-3',
      userId: 'bridge',
      timestamp: timeAgo(320),
      text: '📈 Staffing correlation update: 78% of fulfillment complaints occur between 12–4pm Saturday when you have 3 staff vs 47 orders/hour. Adding 1 budtender should reduce errors by ~60%.',
      mentions: ['rachel'],
      reactions: [{ emoji: '💯', count: 2, users: ['james', 'derek'] }],
    },
    {
      id: 'fo-4',
      userId: 'rachel',
      timestamp: timeAgo(310),
      text: 'Data doesn\'t lie. Good call on the extra shift, Derek. Let\'s monitor for 2 weeks and see if the complaint rate drops.',
    },
    {
      id: 'fo-5',
      userId: 'derek',
      timestamp: timeAgo(45),
      text: 'POS system maintenance window scheduled for Tuesday 6–7am. No impact to store hours. @Nina Patel — any compliance implications?',
      mentions: ['nina'],
    },
    {
      id: 'fo-6',
      userId: 'bridge',
      timestamp: timeAgo(15),
      text: '🔴 **POS Register 2 OFFLINE** at Logan Square — terminal unresponsive for 12 minutes. 2 voids flagged, register speed alert.',
      urgency: 'critical',
      component: 'pos-alert',
      componentData: {
        terminals: [
          { name: 'Register 1', status: 'online', txns: 47 },
          { name: 'Register 2', status: 'offline', downtime: '12 min', voids: 2 },
          { name: 'Register 3', status: 'online', txns: 39 },
        ],
        speedAlert: 'Avg transaction time 4.2 min (target: 2.5 min)',
      },
    },
    {
      id: 'fo-7',
      userId: 'bridge',
      timestamp: timeAgo(5),
      text: '📋 **Shift Handoff Summary** — AM → PM shift transition report ready.',
      urgency: 'action',
      component: 'shift-handoff',
      componentData: {
        openIssues: 3,
        cashStatus: { actual: 2340, expected: 2318 },
        inventoryAlerts: ['Blue Dream 3.5g: 4 units remaining', 'Gummy Bears 10pk: restocked'],
        metrics: { transactions: 127, avgBasket: 83 },
        notes: 'VIP customer Michael R. refund processed. Register 2 intermittent — IT notified.',
      },
    },
  ],

  // ─── Customer Issues (Ops) ───────────────────────────────────────
  'customer-issues': [
    {
      id: 'gx-1',
      userId: 'lisa',
      timestamp: timeAgo(350),
      text: 'Quick update — closed 23 support tickets this week. Avg resolution time down to **4.2 hours** from 6.8 last month. CSAT at 4.6/5.0.',
      reactions: [{ emoji: '🎯', count: 2, users: ['rachel', 'derek'] }],
    },
    {
      id: 'gx-2',
      userId: 'bridge',
      timestamp: timeAgo(340),
      text: '📊 Supporting Lisa\'s update — CX breakdown:\n\n• Tickets Resolved: 23/26 (88.5%)\n• Avg Resolution: 4.2 hrs (↓38% vs last month)\n• Top Issue: Order Fulfillment (9 tickets)\n• Repeat Contacts: 3 customers (all resolved on 2nd contact)',
    },
    {
      id: 'gx-3',
      userId: 'bridge',
      timestamp: timeAgo(120),
      text: '🎫 **Escalated Ticket** — VIP customer complaint requiring manager attention. @Derek Williams @Rachel Torres\n\n• Customer: Michael R. (Gold Tier, LTV: $4,200)\n• Issue: Wrong product in delivery order #GNY-20260228\n• Sentiment: "This is the second time this month"\n• Risk: HIGH — 72% churn probability\n• Suggested: Full refund + 20% next order + personal call',
      mentions: ['derek', 'rachel'],
      reactions: [{ emoji: '🚨', count: 2, users: ['derek', 'rachel'] }],
      urgency: 'critical',
    },
    {
      id: 'gx-4',
      userId: 'derek',
      timestamp: timeAgo(110),
      text: 'I\'ll call Michael directly. Rachel, can you approve the refund + discount? Bridge — pull his full order history for me.',
    },
    {
      id: 'gx-5',
      userId: 'rachel',
      timestamp: timeAgo(105),
      text: 'Refund approved. Let\'s also flag this with fulfillment — two errors for a Gold customer is unacceptable.',
      reactions: [{ emoji: '✅', count: 1, users: ['derek'] }],
    },
  ],

  // ─── Cash Desk (Ops) ─────────────────────────────────────
  'cash-desk': [
    {
      id: 'cd-1',
      userId: 'derek',
      timestamp: timeAgo(180),
      text: 'Morning cash count complete — all 3 drawers verified. Starting cash: $1,500 per register.',
      reactions: [{ emoji: '✅', count: 1, users: ['rachel'] }],
    },
    {
      id: 'cd-2',
      userId: 'bridge',
      timestamp: timeAgo(90),
      text: '💰 **End-of-Day Reconciliation** — Register 1: balanced. Register 2: **-$22.50** variance. Register 3: balanced. Total cash collected: $4,812.',
      reactions: [{ emoji: '👀', count: 1, users: ['derek'] }],
      urgency: 'action',
    },
    {
      id: 'cd-3',
      userId: 'derek',
      timestamp: timeAgo(80),
      text: 'Looking into the Register 2 variance — likely the refund we processed manually for the Thompson order.',
    },
  ],

  // ─── Compliance (Ops) ──────────────────────────────────────
  compliance: [
    {
      id: 'cm-1',
      userId: 'nina',
      timestamp: timeAgo(300),
      text: 'METRC manifest #MF-20260308 submitted for today\'s deliveries. 14 packages tagged and tracked.',
      reactions: [{ emoji: '✅', count: 1, users: ['rachel'] }],
    },
    {
      id: 'cm-2',
      userId: 'bridge',
      timestamp: timeAgo(100),
      text: '🛡 **Compliance Dashboard** — License renewal in **47 days**. Monthly state report 94% complete. 3 packages pending METRC reconciliation.',
      urgency: 'action',
      component: 'compliance',
      componentData: {
        manifestDue: '3 days',
        reconciliationPct: 94,
        licenseRenewal: '47 days',
        pendingPackages: 3,
      },
    },
    {
      id: 'cm-3',
      userId: 'nina',
      timestamp: timeAgo(50),
      text: 'GreenTest Labs results expected tomorrow for SKU-4421 and SKU-4455. Will update labels immediately upon receipt.',
    },
  ],

  // ─── Manager's Office (Ops) ────────────────────────────────
  'managers-office': [
    {
      id: 'mo-1',
      userId: 'rachel',
      timestamp: timeAgo(400),
      text: 'February P&L draft is in. Revenue $142K (+6% MoM), COGS at 52.1%. Margin holding steady at 47.9%. Team, great month.',
      reactions: [{ emoji: '🔥', count: 3, users: ['marcus', 'derek', 'sofia'] }],
    },
    {
      id: 'mo-2',
      userId: 'bridge',
      timestamp: timeAgo(200),
      text: '📋 **Goal Tracker** — Q1 targets: Revenue 88% on track, NPS 92% on track, New Customers 76% — needs attention. Recommend increasing marketing spend by 12% to close the gap.',
    },
    {
      id: 'mo-3',
      userId: 'rachel',
      timestamp: timeAgo(60),
      text: 'Let\'s discuss the customer acquisition gap at Friday\'s review. @Marcus Chen bring the campaign conversion funnel data.',
      mentions: ['marcus'],
    },
  ],

  // ─── Vendor Alley (Ops) ────────────────────────────────────
  'vendor-alley': [
    {
      id: 'va-1',
      userId: 'sofia',
      timestamp: timeAgo(350),
      text: 'PO #4892 submitted to GreenLeaf Supply — Blue Dream 3.5g (200 units), Sour Diesel Cart 1g (150 units). ETA Thursday.',
      reactions: [{ emoji: '📦', count: 1, users: ['rachel'] }],
    },
    {
      id: 'va-2',
      userId: 'bridge',
      timestamp: timeAgo(150),
      text: '🤝 **Vendor Scorecard Update** — GreenLeaf Supply: 94% on-time delivery, 4.7/5 quality rating. Kiva Confections: 88% on-time, 4.9 quality. Consider increasing Kiva order volume.',
    },
    {
      id: 'va-3',
      userId: 'sofia',
      timestamp: timeAgo(40),
      text: 'New vendor application from "Pacific Roots" — premium flower line. Samples arriving next week. @Rachel Torres should we schedule a tasting?',
      mentions: ['rachel'],
    },
  ],

  // ─── AI Alerts (AI — merged Bridge Feed + Bridge Pulse) ────
  'ai-alerts': [
    {
      id: 'bf-1',
      userId: 'bridge',
      timestamp: timeAgo(500),
      text: '📋 **Automated Report** — Weekly sales summary generated for Q1 review.\n\n• Revenue: $62,800 (+8.2% WoW)\n• Orders: 1,080 (+4.1%)\n• AOV: $58.15\n• Top Seller: Baby Jeeter Churros (284 units)',
      reactions: [{ emoji: '📊', count: 2, users: ['rachel', 'marcus'] }],
    },
    {
      id: 'bf-2',
      userId: 'bridge',
      timestamp: timeAgo(380),
      text: '🔧 **Bug Report Filed** — Ticket CB-5201 created for POS sync delay issue reported on Saturday. Engineering notified. @Derek Williams — tracking below.\n\nPriority: High | Status: Investigating',
      mentions: ['derek'],
    },
    {
      id: 'bp-1',
      userId: 'bridge',
      timestamp: timeAgo(300),
      text: '📈 **Weekly Sentiment Digest** — Overall sentiment trending positive.\n\n• Overall Score: 4.3/5.0 (+0.2 vs last week)\n• Total Reviews: 142 new across all platforms\n• Positive: 78% (+5%)\n• Neutral: 14% (-2%)\n• Negative: 8% (-3%)\n• Top Praise: "Friendly staff", "Great selection", "Fast delivery"',
      reactions: [{ emoji: '📊', count: 3, users: ['lisa', 'rachel', 'james'] }],
    },
    {
      id: 'bp-2',
      userId: 'lisa',
      timestamp: timeAgo(290),
      text: 'Great numbers! The staff training we did last month is clearly paying off. @James Okafor — your team deserves a shout-out.',
      mentions: ['james'],
    },
    {
      id: 'bf-3',
      userId: 'bridge',
      timestamp: timeAgo(250),
      text: '💡 **Feature Request Logged** — Ticket CB-5208: "Add bulk discount editor for seasonal promotions." Submitted to product backlog. @Rachel Torres',
      mentions: ['rachel'],
    },
    {
      id: 'bf-4',
      userId: 'bridge',
      timestamp: timeAgo(100),
      text: '⚖️ **Compliance Reminder**: Monthly state reporting deadline in 3 days. 2 product labels need updated THC content verification. @Nina Patel\n\n• State Report: Due March 7 — 94% data complete\n• Label Updates: SKU-4421 "Moon Rocks", SKU-4455 "Indica Gummies"\n• Status: Pending lab results from GreenTest Labs',
      mentions: ['nina'],
    },
    {
      id: 'bf-5',
      userId: 'nina',
      timestamp: timeAgo(95),
      text: 'Working on it. GreenTest Labs should have the results back by tomorrow. I\'ll update the labels as soon as they come in.',
    },
    {
      id: 'bp-3',
      userId: 'bridge',
      timestamp: timeAgo(90),
      text: '🔴 **Negative Review Alert** — New 1-star review on Google requiring response. @Lisa Chang\n\n• Rating: ★☆☆☆☆\n• Customer: "CannabisCritic420"\n• Review: "Waited 45 mins for my online order pickup. Staff seemed confused and couldn\'t find my order."\n• Category: Wait Time / Order Fulfillment\n• Suggested: Apologize, offer expedited service, investigate root cause',
      mentions: ['lisa'],
      reactions: [{ emoji: '😬', count: 2, users: ['lisa', 'rachel'] }],
      urgency: 'action',
    },
    {
      id: 'bp-4',
      userId: 'lisa',
      timestamp: timeAgo(85),
      text: 'I\'ll draft a response. Bridge — can you check if we had any system issues during that time window?',
    },
    {
      id: 'bp-5',
      userId: 'bridge',
      timestamp: timeAgo(83),
      text: '🔍 Found it — POS system had a 12-minute sync delay between 2:15–2:27 PM on Saturday. 6 online orders affected. Matches the review timeline. Flagged with @Derek Williams for the ops postmortem.',
      mentions: ['derek'],
      reactions: [{ emoji: '🔍', count: 1, users: ['lisa'] }],
    },
    {
      id: 'bf-6',
      userId: 'bridge',
      timestamp: timeAgo(30),
      text: '📦 **Inventory Intelligence**: Based on current sell-through rates, I recommend increasing the Kiva Camino Gummies order by 25% for next week. This SKU has been trending +18% over the last 3 weeks. @Sofia Rodriguez',
      mentions: ['sofia'],
      reactions: [{ emoji: '👍', count: 1, users: ['sofia'] }],
    },
    {
      id: 'bp-6',
      userId: 'bridge',
      timestamp: timeAgo(20),
      text: '🏆 **Positive Trend Alert** — "Delivery speed" mentions are up **34% this week** with 92% positive sentiment. Your logistics improvements are resonating with customers. @Rachel Torres',
      mentions: ['rachel'],
      reactions: [{ emoji: '🎉', count: 3, users: ['rachel', 'derek', 'lisa'] }],
    },
  ],
};

/* ─── Initial Unread Counts ─── */

export const DTCH_INITIAL_UNREADS = {
  lounge: 0,
  campaigns: 2,
  inventory: 1,
  'sales-floor': 0,
  'customer-issues': 3,
  'cash-desk': 1,
  compliance: 0,
  'managers-office': 1,
  'vendor-alley': 0,
  'ai-alerts': 6,
};
