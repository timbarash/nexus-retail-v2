// ═══════════════════════════════════════════════════════════════════
//  SLACK WORKSPACE MOCK DATA — Ascend Wellness
// ═══════════════════════════════════════════════════════════════════

export const TEAM_MEMBERS = {
  rachel: {
    id: 'rachel',
    name: 'Rachel Torres',
    role: 'General Manager',
    initials: 'RT',
    color: '#00C27C',
    status: 'online',
    isBot: false,
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Chen',
    role: 'Marketing Director',
    initials: 'MC',
    color: '#64A8E0',
    status: 'online',
    isBot: false,
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia Rodriguez',
    role: 'Inventory Manager',
    initials: 'SR',
    color: '#D4A03A',
    status: 'online',
    isBot: false,
  },
  james: {
    id: 'james',
    name: 'James Okafor',
    role: 'Head Budtender',
    initials: 'JO',
    color: '#F97583',
    status: 'away',
    isBot: false,
  },
  nina: {
    id: 'nina',
    name: 'Nina Patel',
    role: 'Compliance Officer',
    initials: 'NP',
    color: '#B392F0',
    status: 'online',
    isBot: false,
  },
  derek: {
    id: 'derek',
    name: 'Derek Williams',
    role: 'Operations Lead',
    initials: 'DW',
    color: '#F8E3A1',
    status: 'offline',
    isBot: false,
  },
  lisa: {
    id: 'lisa',
    name: 'Lisa Chang',
    role: 'Customer Experience Lead',
    initials: 'LC',
    color: '#79C0FF',
    status: 'online',
    isBot: false,
  },
  bridge: {
    id: 'bridge',
    name: 'Customer Bridge',
    role: 'Dutchie AI Agent',
    initials: 'CB',
    color: '#00C27C',
    status: 'online',
    isBot: true,
  },
};

export const CHANNELS = [
  // General
  { id: 'general', name: 'general', section: 'General', description: 'Company-wide announcements and discussion', members: 8, unread: 0 },
  { id: 'random', name: 'random', section: 'General', description: 'Non-work banter and water cooler', members: 8, unread: 0 },
  // Departments
  { id: 'marketing', name: 'marketing', section: 'Departments', description: 'Marketing campaigns, promotions, and branding', members: 4, unread: 2 },
  { id: 'inventory', name: 'inventory', section: 'Departments', description: 'Stock levels, reorders, and supplier updates', members: 4, unread: 0 },
  { id: 'operations', name: 'operations', section: 'Departments', description: 'Day-to-day operations and scheduling', members: 5, unread: 0 },
  { id: 'customer-experience', name: 'customer-experience', section: 'Departments', description: 'Customer feedback, support tickets, and CX strategy', members: 5, unread: 3 },
  { id: 'compliance', name: 'compliance', section: 'Departments', description: 'Regulatory updates and compliance tracking', members: 3, unread: 0 },
  // Dutchie Bridge
  { id: 'bridge-alerts', name: 'bridge-alerts', section: 'Dutchie Bridge', description: 'Automated alerts from Customer Bridge AI', members: 8, unread: 5 },
  { id: 'bridge-campaigns', name: 'bridge-campaigns', section: 'Dutchie Bridge', description: 'AI-generated campaign launches and performance', members: 6, unread: 4 },
  { id: 'bridge-sentiment', name: 'bridge-sentiment', section: 'Dutchie Bridge', description: 'Sentiment trends and review alerts', members: 7, unread: 3 },
];

export const WORKFLOW_ROUTING = {
  marketing: { channel: 'bridge-campaigns', taggedMembers: ['marcus'] },
  inventory: { channel: 'bridge-alerts', taggedMembers: ['sofia'] },
  operations: { channel: 'bridge-alerts', taggedMembers: ['derek'] },
  'customer-experience': { channel: 'bridge-sentiment', taggedMembers: ['lisa', 'rachel'] },
  compliance: { channel: 'bridge-alerts', taggedMembers: ['nina'] },
  escalation: { channel: 'bridge-alerts', taggedMembers: ['rachel', 'derek'] },
};

// Helper to create timestamps relative to "now"
function timeAgo(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
}

export const INITIAL_MESSAGES = {
  // ─── #bridge-campaigns ───────────────────────────────────────
  'bridge-campaigns': [
    {
      id: 'bc-1',
      userId: 'bridge',
      timestamp: timeAgo(180),
      text: '📢 New campaign launched and ready for review. @Marcus Chen — please confirm creative assets.',
      mentions: ['marcus'],
      attachment: {
        color: '#00C27C',
        title: '🌿 "Spring Into Savings" — Weekend Flash Sale',
        fields: [
          { label: 'Channels', value: 'SMS, Email, Push Notification' },
          { label: 'Target Segment', value: '2,341 customers — Lapsed 30+ days' },
          { label: 'Offer', value: '25% off all edibles + free delivery' },
          { label: 'Launch Window', value: 'Fri 5pm → Sun 11:59pm' },
          { label: 'Projected Revenue', value: '$18,400 — $24,200' },
        ],
        footer: 'Customer Bridge • Campaign Engine v2.4',
      },
      reactions: [{ emoji: '🚀', count: 3, users: ['rachel', 'marcus', 'lisa'] }],
    },
    {
      id: 'bc-2',
      userId: 'marcus',
      timestamp: timeAgo(165),
      text: 'Love the targeting on this one. Creative assets approved — let\'s push it live. Can we also get a variant for the VIP segment?',
    },
    {
      id: 'bc-3',
      userId: 'bridge',
      timestamp: timeAgo(160),
      text: '✅ Campaign is now **LIVE**. VIP variant created with 30% discount threshold. I\'ll post performance metrics here at T+24h and T+48h.',
      mentions: [],
      reactions: [{ emoji: '✅', count: 2, users: ['marcus', 'rachel'] }],
    },
    {
      id: 'bc-4',
      userId: 'bridge',
      timestamp: timeAgo(60),
      text: '📊 **T+24h Performance Update** — "Spring Into Savings" is outperforming projections. @Marcus Chen',
      mentions: ['marcus'],
      attachment: {
        color: '#64A8E0',
        title: '📈 Campaign Performance — 24hr Snapshot',
        fields: [
          { label: 'SMS Delivered', value: '2,118 / 2,341 (90.5%)' },
          { label: 'Open Rate', value: '68.2% (+14% vs avg)' },
          { label: 'Click-through', value: '23.1% (+8% vs avg)' },
          { label: 'Orders Placed', value: '187 orders ($12,340 revenue)' },
          { label: 'Est. Final Revenue', value: '$26,100 (above projection)' },
        ],
        footer: 'Customer Bridge • Auto-report',
      },
      reactions: [{ emoji: '🎉', count: 4, users: ['marcus', 'rachel', 'lisa', 'sofia'] }],
    },
    {
      id: 'bc-5',
      userId: 'bridge',
      timestamp: timeAgo(30),
      text: '💡 **Campaign Recommendation**: Based on the Spring Into Savings success, I recommend launching a follow-up "Edible Enthusiast" loyalty campaign targeting the 187 converters. @Marcus Chen — shall I draft it?',
      mentions: ['marcus'],
      reactions: [{ emoji: '👍', count: 1, users: ['marcus'] }],
    },
  ],

  // ─── #bridge-alerts ──────────────────────────────────────────
  'bridge-alerts': [
    {
      id: 'ba-1',
      userId: 'bridge',
      timestamp: timeAgo(240),
      text: '🔴 **Low Stock Alert** — Critical inventory levels detected. @Sofia Rodriguez — immediate attention required.',
      mentions: ['sofia'],
      attachment: {
        color: '#E87068',
        title: '⚠️ Inventory Alert — 3 SKUs Below Threshold',
        fields: [
          { label: 'Blue Dream 3.5g', value: '4 units remaining (threshold: 20)' },
          { label: 'Sour Diesel Cart 1g', value: '7 units remaining (threshold: 15)' },
          { label: 'Gummy Bears 10pk', value: '12 units remaining (threshold: 25)' },
        ],
        footer: 'Customer Bridge • Inventory Monitor',
      },
      reactions: [{ emoji: '👀', count: 1, users: ['sofia'] }],
    },
    {
      id: 'ba-2',
      userId: 'sofia',
      timestamp: timeAgo(230),
      text: 'On it. Blue Dream PO already submitted yesterday — ETA Thursday. Placing rush orders for the other two now.',
    },
    {
      id: 'ba-3',
      userId: 'bridge',
      timestamp: timeAgo(228),
      text: '✅ Noted. I\'ve updated the forecast model. The Sour Diesel reorder will also affect the "Weekend Vape Special" campaign — I\'ll notify @Marcus Chen if stock won\'t arrive in time.',
      mentions: ['marcus'],
    },
    {
      id: 'ba-4',
      userId: 'bridge',
      timestamp: timeAgo(120),
      text: '🎫 **Escalated Support Ticket** — A VIP customer has submitted a complaint requiring manager attention. @Derek Williams @Rachel Torres',
      mentions: ['derek', 'rachel'],
      attachment: {
        color: '#D4A03A',
        title: '🎫 Ticket #4892 — VIP Customer Complaint',
        fields: [
          { label: 'Customer', value: 'Michael R. (Loyalty Tier: Gold, LTV: $4,200)' },
          { label: 'Issue', value: 'Received wrong product in delivery order #GNY-20260228' },
          { label: 'Sentiment', value: '😤 Negative — "This is the second time this month"' },
          { label: 'Risk Level', value: 'HIGH — Churn probability 72%' },
          { label: 'Suggested Action', value: 'Full refund + 20% next order + personal call from manager' },
        ],
        footer: 'Customer Bridge • Support Escalation Engine',
      },
      reactions: [{ emoji: '🚨', count: 2, users: ['derek', 'rachel'] }],
    },
    {
      id: 'ba-5',
      userId: 'derek',
      timestamp: timeAgo(110),
      text: 'I\'ll call Michael directly. Rachel, can you approve the refund + discount? Bridge — pull his full order history for me.',
    },
    {
      id: 'ba-6',
      userId: 'bridge',
      timestamp: timeAgo(108),
      text: '📋 Michael R. — Order History: 47 orders since Jan 2025, avg $89/order, 2 complaints (both fulfillment errors). Sending full detail to your DM.',
      reactions: [{ emoji: '🙏', count: 1, users: ['derek'] }],
    },
    {
      id: 'ba-7',
      userId: 'rachel',
      timestamp: timeAgo(105),
      text: 'Refund approved. Let\'s also flag this with the fulfillment team — two errors for a Gold customer is unacceptable.',
    },
    {
      id: 'ba-8',
      userId: 'bridge',
      timestamp: timeAgo(15),
      text: '⚖️ **Compliance Reminder**: Monthly state reporting deadline in 3 days. 2 product labels need updated THC content verification. @Nina Patel',
      mentions: ['nina'],
      attachment: {
        color: '#B392F0',
        title: '📋 Compliance Action Items — March 2026',
        fields: [
          { label: 'State Report', value: 'Due: March 7 — 94% data complete' },
          { label: 'Label Updates', value: 'SKU-4421 "Moon Rocks", SKU-4455 "Indica Gummies"' },
          { label: 'Status', value: 'Pending lab results from GreenTest Labs' },
        ],
        footer: 'Customer Bridge • Compliance Tracker',
      },
    },
  ],

  // ─── #bridge-sentiment ───────────────────────────────────────
  'bridge-sentiment': [
    {
      id: 'bs-1',
      userId: 'bridge',
      timestamp: timeAgo(300),
      text: '📈 **Weekly Sentiment Digest** — Overall sentiment trending positive this week. @Lisa Chang @Rachel Torres',
      mentions: ['lisa', 'rachel'],
      attachment: {
        color: '#00C27C',
        title: '🌡️ Sentiment Overview — Feb 24 to Mar 3',
        fields: [
          { label: 'Overall Score', value: '4.3 / 5.0 (+0.2 vs last week)' },
          { label: 'Total Reviews', value: '142 new reviews across all platforms' },
          { label: 'Positive', value: '78% ████████░░ (+5%)' },
          { label: 'Neutral', value: '14% █░░░░░░░░░ (-2%)' },
          { label: 'Negative', value: '8% ░░░░░░░░░░ (-3%)' },
          { label: 'Top Praise', value: '"Friendly staff", "Great selection", "Fast delivery"' },
        ],
        footer: 'Customer Bridge • Sentiment Analyzer',
      },
      reactions: [{ emoji: '📊', count: 3, users: ['lisa', 'rachel', 'james'] }],
    },
    {
      id: 'bs-2',
      userId: 'lisa',
      timestamp: timeAgo(290),
      text: 'Great numbers! The staff training we did last month is clearly paying off. James — your team deserves a shout-out.',
    },
    {
      id: 'bs-3',
      userId: 'bridge',
      timestamp: timeAgo(90),
      text: '🔴 **Negative Review Alert** — New 1-star review detected on Google requiring response. @Lisa Chang',
      mentions: ['lisa'],
      attachment: {
        color: '#E87068',
        title: '⚠️ Negative Review — Google Maps',
        fields: [
          { label: 'Rating', value: '★☆☆☆☆ (1/5)' },
          { label: 'Customer', value: 'Anonymous User "CannabisCritic420"' },
          { label: 'Review', value: '"Waited 45 mins for my online order pickup. Staff seemed confused and couldn\'t find my order. Won\'t be coming back."' },
          { label: 'Category', value: 'Wait Time / Order Fulfillment' },
          { label: 'Suggested Response', value: 'Apologize, offer expedited service next visit, investigate root cause' },
        ],
        footer: 'Customer Bridge • Review Monitor',
      },
      reactions: [{ emoji: '😬', count: 2, users: ['lisa', 'rachel'] }],
    },
    {
      id: 'bs-4',
      userId: 'lisa',
      timestamp: timeAgo(85),
      text: 'I\'ll draft a response. Bridge — can you check if we had any system issues during that time window?',
    },
    {
      id: 'bs-5',
      userId: 'bridge',
      timestamp: timeAgo(83),
      text: '🔍 Found it — POS system had a 12-minute sync delay between 2:15–2:27 PM on Saturday. 6 online orders were affected. This matches the review timeline. I\'ve flagged this with @Derek Williams for the ops postmortem.',
      mentions: ['derek'],
      reactions: [{ emoji: '🔍', count: 1, users: ['lisa'] }],
    },
    {
      id: 'bs-6',
      userId: 'bridge',
      timestamp: timeAgo(20),
      text: '🏆 **Positive Trend Alert** — "Delivery speed" mentions are up 34% this week with 92% positive sentiment. Your logistics improvements are resonating with customers. @Rachel Torres',
      mentions: ['rachel'],
      reactions: [{ emoji: '🎉', count: 3, users: ['rachel', 'derek', 'lisa'] }],
    },
  ],

  // ─── #marketing ──────────────────────────────────────────────
  marketing: [
    {
      id: 'mk-1',
      userId: 'marcus',
      timestamp: timeAgo(400),
      text: 'Team — we need to finalize the March promo calendar by EOD Thursday. Any last-minute additions?',
    },
    {
      id: 'mk-2',
      userId: 'rachel',
      timestamp: timeAgo(390),
      text: 'Can we add a St. Patrick\'s Day theme? Green-branded products could be a fun angle.',
    },
    {
      id: 'mk-3',
      userId: 'marcus',
      timestamp: timeAgo(380),
      text: 'Love it! Bridge — can you pull together a campaign concept for a St. Patrick\'s Day promo? Green-themed products, maybe "Luck of the Green" branding.',
    },
    {
      id: 'mk-4',
      userId: 'bridge',
      timestamp: timeAgo(378),
      text: '🍀 Here\'s a quick concept for "Luck of the Green" — @Marcus Chen',
      mentions: ['marcus'],
      attachment: {
        color: '#00C27C',
        title: '🍀 Campaign Concept: "Luck of the Green"',
        fields: [
          { label: 'Theme', value: 'St. Patrick\'s Day — Green-branded product spotlight' },
          { label: 'Products', value: 'Green Crack, Green Goddess, Emerald OG, Mint Gummies' },
          { label: 'Offer', value: 'Buy 2 "green" products, get 17% off (St. Pat\'s = March 17)' },
          { label: 'Target', value: '3,200 customers — Active in last 60 days' },
          { label: 'Est. Revenue', value: '$14,800 — $19,200' },
        ],
        footer: 'Customer Bridge • Campaign Draft',
      },
      reactions: [{ emoji: '🍀', count: 3, users: ['marcus', 'rachel', 'lisa'] }, { emoji: '🔥', count: 2, users: ['marcus', 'james'] }],
    },
    {
      id: 'mk-5',
      userId: 'marcus',
      timestamp: timeAgo(370),
      text: 'This is perfect. Let\'s finalize creative by Monday and schedule for March 14th launch.',
    },
  ],

  // ─── #customer-experience ────────────────────────────────────
  'customer-experience': [
    {
      id: 'cx-1',
      userId: 'lisa',
      timestamp: timeAgo(350),
      text: 'Quick update — we\'ve closed 23 support tickets this week. Average resolution time down to 4.2 hours from 6.8 last month.',
      reactions: [{ emoji: '🎯', count: 2, users: ['rachel', 'derek'] }],
    },
    {
      id: 'cx-2',
      userId: 'bridge',
      timestamp: timeAgo(340),
      text: '📊 Supporting Lisa\'s update with data — here\'s the CX performance breakdown for the week. @Lisa Chang @James Okafor',
      mentions: ['lisa', 'james'],
      attachment: {
        color: '#79C0FF',
        title: '📋 CX Weekly Performance',
        fields: [
          { label: 'Tickets Resolved', value: '23 / 26 (88.5% resolution rate)' },
          { label: 'Avg Resolution Time', value: '4.2 hrs (↓38% vs last month)' },
          { label: 'CSAT Score', value: '4.6 / 5.0 (from post-ticket surveys)' },
          { label: 'Top Issue Category', value: 'Order Fulfillment (9 tickets)' },
          { label: 'Repeat Contacts', value: '3 customers — all resolved on 2nd contact' },
        ],
        footer: 'Customer Bridge • CX Analytics',
      },
    },
    {
      id: 'cx-3',
      userId: 'james',
      timestamp: timeAgo(330),
      text: 'The fulfillment issues keep coming up. Most of these are happening during the Saturday rush. We might need an extra person on the floor 12–4pm.',
    },
    {
      id: 'cx-4',
      userId: 'lisa',
      timestamp: timeAgo(325),
      text: 'Agreed. Bridge — can you correlate the fulfillment complaint times with our staffing schedule?',
    },
    {
      id: 'cx-5',
      userId: 'bridge',
      timestamp: timeAgo(323),
      text: '📈 Correlation confirmed: 78% of fulfillment-related tickets occur between 12–4pm Saturday, when you have 3 staff vs. an average of 47 orders/hour. Adding 1 budtender during this window would reduce the error rate by an estimated 60%. @Rachel Torres — scheduling recommendation attached.',
      mentions: ['rachel'],
      reactions: [{ emoji: '💯', count: 2, users: ['james', 'lisa'] }],
    },
  ],

  // ─── #general ────────────────────────────────────────────────
  general: [
    {
      id: 'gn-1',
      userId: 'rachel',
      timestamp: timeAgo(500),
      text: 'Good morning team! Reminder — our Q1 review is this Friday at 2pm. Please have your department summaries ready. Bridge will be generating the data dashboards for each department.',
      reactions: [{ emoji: '👍', count: 5, users: ['marcus', 'sofia', 'james', 'lisa', 'derek'] }],
    },
    {
      id: 'gn-2',
      userId: 'bridge',
      timestamp: timeAgo(498),
      text: '📋 Q1 dashboards are in progress. Each department lead will receive a personalized report by Thursday EOD. Preview available in your respective Bridge channels. Ping me if you need custom data cuts.',
      reactions: [{ emoji: '🤖', count: 2, users: ['rachel', 'marcus'] }],
    },
    {
      id: 'gn-3',
      userId: 'james',
      timestamp: timeAgo(450),
      text: 'Just hit 500 five-star reviews on Google! 🎉 Huge thanks to the whole team.',
      reactions: [{ emoji: '🎉', count: 6, users: ['rachel', 'marcus', 'sofia', 'lisa', 'derek', 'nina'] }, { emoji: '⭐', count: 4, users: ['rachel', 'marcus', 'lisa', 'nina'] }],
    },
    {
      id: 'gn-4',
      userId: 'rachel',
      timestamp: timeAgo(440),
      text: 'Amazing milestone! @James Okafor your team\'s customer-first approach is making a real difference.',
      mentions: ['james'],
    },
    {
      id: 'gn-5',
      userId: 'bridge',
      timestamp: timeAgo(435),
      text: '🏆 Fun fact: Ascend\'s 4.3 avg rating puts you in the **top 8% of multi-state operators** by customer sentiment. Your strongest differentiator vs. competitors is "Staff Knowledge" — mentioned positively in 34% of reviews.',
      reactions: [{ emoji: '🔥', count: 3, users: ['rachel', 'james', 'marcus'] }],
    },
  ],

  // ─── #random ─────────────────────────────────────────────────
  random: [
    {
      id: 'rn-1',
      userId: 'james',
      timestamp: timeAgo(600),
      text: 'Anyone else try that new ramen spot on 8th Ave? 🍜',
      reactions: [{ emoji: '🍜', count: 3, users: ['sofia', 'derek', 'lisa'] }],
    },
    {
      id: 'rn-2',
      userId: 'sofia',
      timestamp: timeAgo(590),
      text: 'Yes! The spicy miso is incredible. We should do a team lunch there.',
    },
    {
      id: 'rn-3',
      userId: 'derek',
      timestamp: timeAgo(580),
      text: 'I\'m in. Friday after the Q1 review?',
    },
  ],

  // ─── #inventory ──────────────────────────────────────────────
  inventory: [
    {
      id: 'inv-1',
      userId: 'sofia',
      timestamp: timeAgo(360),
      text: 'Weekly inventory count complete. We\'re in good shape except for the items flagged in #bridge-alerts.',
    },
    {
      id: 'inv-2',
      userId: 'sofia',
      timestamp: timeAgo(200),
      text: 'Blue Dream restock confirmed for Thursday delivery. Sour Diesel rush order placed — ETA Friday morning.',
      reactions: [{ emoji: '✅', count: 1, users: ['rachel'] }],
    },
  ],

  // ─── #operations ─────────────────────────────────────────────
  operations: [
    {
      id: 'ops-1',
      userId: 'derek',
      timestamp: timeAgo(420),
      text: 'Updated the Saturday schedule — added an extra 12-4pm shift per Bridge\'s recommendation. @James Okafor can you find coverage?',
      mentions: ['james'],
    },
    {
      id: 'ops-2',
      userId: 'james',
      timestamp: timeAgo(410),
      text: 'Already on it. Tanya confirmed she can cover Saturdays for the rest of March.',
      reactions: [{ emoji: '🙌', count: 2, users: ['derek', 'rachel'] }],
    },
  ],

  // ─── #compliance ─────────────────────────────────────────────
  compliance: [
    {
      id: 'cmp-1',
      userId: 'nina',
      timestamp: timeAgo(500),
      text: 'February compliance audit passed with zero findings. Report filed with the state.',
      reactions: [{ emoji: '🎉', count: 3, users: ['rachel', 'derek', 'sofia'] }],
    },
    {
      id: 'cmp-2',
      userId: 'nina',
      timestamp: timeAgo(100),
      text: 'Working on the March report now. Waiting on GreenTest Labs for the two label verifications flagged by Bridge.',
    },
  ],
};

export const CURRENT_USER = TEAM_MEMBERS.rachel;
