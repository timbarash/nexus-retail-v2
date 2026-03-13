import { useEffect } from "react";

const MOBILE_APP_CSS = `
  /* ── Reset & Base ─────────────────────────────── */
  [data-nma-root] {
    --bg: #0D0C0A;
    --surface: #1A1918;
    --surface2: #242320;
    --border: #2E2D2A;
    --text: #F5F0E8;
    --text2: #A09A8C;
    --green: #00C27C;
    --purple: #A855F7;
    --orange: #F59E0B;
    --red: #EF4444;
    --blue: #3B82F6;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  [data-nma-root] * { box-sizing: border-box; margin: 0; padding: 0; }
  [data-nma-root] a { color: inherit; text-decoration: none; }

  /* ── Top Bar ──────────────────────────────────── */
  .nma-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 32px;
    background: rgba(13,12,10,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nma-back {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--text2);
    transition: color 0.2s;
  }
  .nma-back:hover { color: var(--green); }
  .nma-wordmark {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .nma-wordmark span { color: var(--purple); }

  /* ── Hero ──────────────────────────────────────── */
  .nma-hero {
    text-align: center;
    padding: 100px 24px 80px;
    max-width: 800px;
    margin: 0 auto;
  }
  .nma-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    background: rgba(168,85,247,0.12);
    color: var(--purple);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 24px;
  }
  .nma-hero h1 {
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
  }
  .nma-hero h1 em {
    font-style: normal;
    background: linear-gradient(135deg, var(--purple), var(--green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .nma-hero p {
    font-size: 18px;
    color: var(--text2);
    max-width: 540px;
    margin: 0 auto 48px;
    line-height: 1.7;
  }

  /* ── Phone Frame ──────────────────────────────── */
  .nma-phone {
    width: 280px;
    min-height: 520px;
    border: 2px solid var(--border);
    border-radius: 32px;
    background: var(--bg);
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 0 60px rgba(168,85,247,0.08), 0 0 0 1px rgba(168,85,247,0.05);
  }
  .nma-phone-notch {
    width: 100px;
    height: 6px;
    border-radius: 3px;
    background: var(--border);
    margin: 12px auto 0;
  }
  .nma-phone-screen {
    padding: 16px;
    min-height: 460px;
  }
  .nma-phone-home {
    width: 40px;
    height: 5px;
    border-radius: 3px;
    background: var(--border);
    margin: 8px auto 12px;
  }

  /* Phone screen content helpers */
  .nma-screen-header {
    font-size: 11px;
    color: var(--text2);
    margin-bottom: 4px;
  }
  .nma-screen-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 14px;
  }
  .nma-screen-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 10px;
  }
  .nma-screen-card-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .nma-screen-card-value {
    font-size: 22px;
    font-weight: 700;
  }
  .nma-screen-card-sub {
    font-size: 10px;
    color: var(--text2);
    margin-top: 2px;
  }
  .nma-screen-row {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  .nma-screen-row .nma-screen-card { flex: 1; }
  .nma-screen-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 10px;
  }
  .nma-screen-alert-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }
  .nma-screen-alert-text { flex: 1; }
  .nma-screen-alert-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .nma-screen-alert-desc {
    font-size: 10px;
    color: var(--text2);
  }
  .nma-screen-alert-time {
    font-size: 10px;
    color: var(--text2);
    flex-shrink: 0;
  }
  .nma-screen-btn {
    display: block;
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: default;
    margin-bottom: 8px;
  }
  .nma-screen-btn.green { background: var(--green); color: #000; }
  .nma-screen-btn.red { background: rgba(232,112,104,0.15); color: var(--red); }
  .nma-screen-btn.outline { background: transparent; border: 1px solid var(--border); color: var(--text2); }

  /* ── Feature Sections ─────────────────────────── */
  .nma-feature {
    display: flex;
    align-items: center;
    gap: 80px;
    max-width: 1000px;
    margin: 0 auto;
    padding: 80px 32px;
  }
  .nma-feature.reverse { flex-direction: row-reverse; }
  .nma-feature-text { flex: 1; }
  .nma-feature-label {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }
  .nma-feature-label.green { background: rgba(0,194,124,0.12); color: var(--green); }
  .nma-feature-label.purple { background: rgba(168,85,247,0.12); color: var(--purple); }
  .nma-feature-label.orange { background: rgba(245,158,11,0.12); color: var(--orange); }
  .nma-feature-label.blue { background: rgba(100,168,224,0.12); color: var(--blue); }
  .nma-feature h2 {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }
  .nma-feature p {
    font-size: 16px;
    color: var(--text2);
    line-height: 1.7;
    margin-bottom: 20px;
  }
  .nma-feature-bullets {
    list-style: none;
    padding: 0;
  }
  .nma-feature-bullets li {
    position: relative;
    padding-left: 20px;
    font-size: 14px;
    color: var(--text2);
    margin-bottom: 8px;
  }
  .nma-feature-bullets li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--green);
  }

  /* ── Dividers ─────────────────────────────────── */
  .nma-divider {
    max-width: 1000px;
    margin: 0 auto;
    border: none;
    border-top: 1px solid var(--border);
  }

  /* ── Interactive Prototype ────────────────────── */
  .nma-proto {
    max-width: 800px;
    margin: 0 auto;
    padding: 80px 32px;
    text-align: center;
  }
  .nma-proto h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  .nma-proto > p {
    color: var(--text2);
    margin-bottom: 40px;
    font-size: 16px;
  }
  .nma-proto-tabs {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 32px;
  }
  .nma-proto-tab {
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text2);
    background: var(--surface);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
  }
  .nma-proto-tab:hover { color: var(--text); border-color: var(--text2); }
  .nma-proto-tab.active {
    background: var(--purple);
    color: #fff;
    border-color: var(--purple);
  }
  .nma-proto-phone {
    display: inline-block;
  }

  /* ── Ecosystem ────────────────────────────────── */
  .nma-ecosystem {
    max-width: 900px;
    margin: 0 auto;
    padding: 80px 32px;
    text-align: center;
  }
  .nma-ecosystem h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  .nma-ecosystem > p {
    color: var(--text2);
    margin-bottom: 48px;
    font-size: 16px;
  }
  .nma-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }
  .nma-flow-step {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px 20px;
    width: 180px;
    text-align: center;
  }
  .nma-flow-step-icon {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .nma-flow-step-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .nma-flow-step-desc {
    font-size: 12px;
    color: var(--text2);
  }
  .nma-flow-arrow {
    font-size: 20px;
    color: var(--text2);
    padding: 0 12px;
  }

  /* ── CTA Footer ───────────────────────────────── */
  .nma-cta {
    text-align: center;
    padding: 80px 32px 100px;
    max-width: 600px;
    margin: 0 auto;
  }
  .nma-cta .nma-badge { margin-bottom: 20px; }
  .nma-cta h2 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }
  .nma-cta p {
    color: var(--text2);
    font-size: 16px;
    margin-bottom: 32px;
  }
  .nma-cta-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 12px;
    background: var(--purple);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  .nma-cta-link:hover { opacity: 0.85; }

  /* ── Responsive ───────────────────────────────── */
  @media (max-width: 768px) {
    .nma-feature { flex-direction: column !important; gap: 40px; padding: 48px 20px; }
    .nma-phone { width: 260px; min-height: 480px; }
    .nma-topbar { padding: 12px 16px; }
    .nma-hero { padding: 64px 20px 48px; }
    .nma-proto-tabs { flex-wrap: wrap; }
    .nma-flow { gap: 8px; }
    .nma-flow-arrow { display: none; }
  }

  /* ── Animations ───────────────────────────────── */
  .nma-fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .nma-fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* ── Phone screen content for each tab ──────────── */
const SCREEN_BRIEFING = `
  <div class="nma-screen-header">Good morning, Sarah</div>
  <div class="nma-screen-title">Daily Briefing</div>
  <div class="nma-screen-row">
    <div class="nma-screen-card">
      <div class="nma-screen-card-title">Yesterday</div>
      <div class="nma-screen-card-value" style="color:var(--green)">$14,280</div>
      <div class="nma-screen-card-sub">+8% vs avg</div>
    </div>
    <div class="nma-screen-card">
      <div class="nma-screen-card-title">Health</div>
      <div class="nma-screen-card-value" style="color:var(--green)">94</div>
      <div class="nma-screen-card-sub">Store score</div>
    </div>
  </div>
  <div class="nma-screen-card">
    <div class="nma-screen-card-title">Today's Schedule</div>
    <div style="font-size:11px;color:var(--text2);margin-top:4px">
      <div style="padding:4px 0;border-bottom:1px solid var(--border)">9:00a — Open shift (3 staff)</div>
      <div style="padding:4px 0;border-bottom:1px solid var(--border)">11:00a — Vendor check-in: Kiva</div>
      <div style="padding:4px 0">2:00p — Safe count due</div>
    </div>
  </div>
  <div class="nma-screen-card">
    <div class="nma-screen-card-title">Open Issues</div>
    <div style="font-size:11px;color:var(--orange);margin-top:4px">2 items need attention</div>
  </div>
`;

const SCREEN_ALERTS = `
  <div class="nma-screen-header">Notifications</div>
  <div class="nma-screen-title">Smart Alerts</div>
  <div class="nma-screen-alert">
    <div class="nma-screen-alert-icon" style="background:rgba(232,112,104,0.15);color:var(--red)">!</div>
    <div class="nma-screen-alert-text">
      <div class="nma-screen-alert-title">METRC Sync Failed</div>
      <div class="nma-screen-alert-desc">Package #PKG-4421 rejected — weight mismatch</div>
    </div>
    <div class="nma-screen-alert-time">2m</div>
  </div>
  <div class="nma-screen-alert">
    <div class="nma-screen-alert-icon" style="background:rgba(245,158,11,0.15);color:var(--orange)">⏰</div>
    <div class="nma-screen-alert-text">
      <div class="nma-screen-alert-title">Safe Count Due</div>
      <div class="nma-screen-alert-desc">Daily count due by 2:00 PM — 3 hrs remaining</div>
    </div>
    <div class="nma-screen-alert-time">15m</div>
  </div>
  <div class="nma-screen-alert">
    <div class="nma-screen-alert-icon" style="background:rgba(168,85,247,0.15);color:var(--purple)">↓</div>
    <div class="nma-screen-alert-text">
      <div class="nma-screen-alert-title">Low Inventory</div>
      <div class="nma-screen-alert-desc">Blue Dream 1g — 4 units left (threshold: 10)</div>
    </div>
    <div class="nma-screen-alert-time">1h</div>
  </div>
  <div class="nma-screen-alert">
    <div class="nma-screen-alert-icon" style="background:rgba(0,194,124,0.15);color:var(--green)">✓</div>
    <div class="nma-screen-alert-text">
      <div class="nma-screen-alert-title">PO Delivered</div>
      <div class="nma-screen-alert-desc">Order #PO-882 from Kiva — 48 units received</div>
    </div>
    <div class="nma-screen-alert-time">2h</div>
  </div>
`;

const SCREEN_ACTIONS = `
  <div class="nma-screen-header">Pending</div>
  <div class="nma-screen-title">Quick Actions</div>
  <div class="nma-screen-card" style="border-left:3px solid var(--purple)">
    <div class="nma-screen-card-title">Approve Purchase Order</div>
    <div style="font-size:11px;color:var(--text2);margin:4px 0 10px">PO-884 · Wyld · 120 units · $2,400</div>
    <div style="display:flex;gap:8px">
      <div class="nma-screen-btn green" style="flex:1">Approve</div>
      <div class="nma-screen-btn outline" style="flex:1">Review</div>
    </div>
  </div>
  <div class="nma-screen-card" style="border-left:3px solid var(--blue)">
    <div class="nma-screen-card-title">DTCH Message</div>
    <div style="font-size:11px;color:var(--text2);margin:4px 0 10px">Kiva rep: "Confirming Tuesday delivery — need updated count?"</div>
    <div class="nma-screen-btn outline">Reply</div>
  </div>
  <div class="nma-screen-card" style="border-left:3px solid var(--orange)">
    <div class="nma-screen-card-title">Acknowledge Alert</div>
    <div style="font-size:11px;color:var(--text2);margin:4px 0 10px">Inventory threshold hit — Blue Dream 1g</div>
    <div style="display:flex;gap:8px">
      <div class="nma-screen-btn outline" style="flex:1">Reorder</div>
      <div class="nma-screen-btn outline" style="flex:1">Dismiss</div>
    </div>
  </div>
`;

const SCREEN_OVERRIDES = `
  <div class="nma-screen-header">Approval Required</div>
  <div class="nma-screen-title">Overrides</div>
  <div class="nma-screen-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div class="nma-screen-card-title">Discount Override</div>
      <div style="font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(245,158,11,0.12);color:var(--orange)">Pending</div>
    </div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:6px">Budtender: <span style="color:var(--text)">Marcus J.</span></div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:6px">Customer: Loyalty Tier Gold</div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:6px">Discount: <span style="color:var(--orange)">25% off</span> (max policy: 20%)</div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:12px">Cart: $87.50 → $65.63</div>
    <div style="display:flex;gap:8px">
      <div class="nma-screen-btn green" style="flex:1">Approve</div>
      <div class="nma-screen-btn red" style="flex:1">Deny</div>
    </div>
  </div>
  <div class="nma-screen-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div class="nma-screen-card-title">Void Transaction</div>
      <div style="font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(245,158,11,0.12);color:var(--orange)">Pending</div>
    </div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:6px">Budtender: <span style="color:var(--text)">Alex R.</span></div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:6px">Transaction: #TXN-9921 · $42.00</div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:12px">Reason: Customer changed mind</div>
    <div style="display:flex;gap:8px">
      <div class="nma-screen-btn green" style="flex:1">Approve</div>
      <div class="nma-screen-btn red" style="flex:1">Deny</div>
    </div>
  </div>
`;

const MOBILE_APP_HTML = `
  <!-- Top Bar -->
  <div class="nma-topbar">
    <a href="/design-review#ideas-beyond" class="nma-back">← Back to Design Review</a>
    <div class="nma-wordmark">Nexus <span>Mobile</span></div>
  </div>

  <!-- Hero -->
  <div class="nma-hero nma-fade-in">
    <div class="nma-badge">NEXUS MOBILE COMPANION</div>
    <h1>Your Dispensary<br/><em>in Your Pocket</em></h1>
    <p>Dispensary managers spend 80% of their day on the floor, not at a desk. Nexus Mobile puts critical insights, alerts, and actions right where they are.</p>
    <div class="nma-phone" style="margin:0 auto">
      <div class="nma-phone-notch"></div>
      <div class="nma-phone-screen">${SCREEN_BRIEFING}</div>
      <div class="nma-phone-home"></div>
    </div>
  </div>

  <hr class="nma-divider"/>

  <!-- Feature 1: Morning Briefing -->
  <div class="nma-feature nma-fade-in">
    <div class="nma-phone">
      <div class="nma-phone-notch"></div>
      <div class="nma-phone-screen">${SCREEN_BRIEFING}</div>
      <div class="nma-phone-home"></div>
    </div>
    <div class="nma-feature-text">
      <div class="nma-feature-label green">MORNING BRIEFING</div>
      <h2>10-second morning briefing before you walk the floor</h2>
      <p>Everything you need to know at a glance — yesterday's performance, today's schedule, and anything that needs your attention.</p>
      <ul class="nma-feature-bullets">
        <li>Yesterday's sales with comparison to average</li>
        <li>Store health score at a glance</li>
        <li>Today's schedule and vendor check-ins</li>
        <li>Open issues flagged for your review</li>
      </ul>
    </div>
  </div>

  <hr class="nma-divider"/>

  <!-- Feature 2: Smart Alerts -->
  <div class="nma-feature reverse nma-fade-in">
    <div class="nma-phone">
      <div class="nma-phone-notch"></div>
      <div class="nma-phone-screen">${SCREEN_ALERTS}</div>
      <div class="nma-phone-home"></div>
    </div>
    <div class="nma-feature-text">
      <div class="nma-feature-label purple">SMART ALERTS</div>
      <h2>Know what's wrong before your team tells you</h2>
      <p>Push notifications for the things that matter. Compliance failures, inventory thresholds, and operational deadlines — prioritized by urgency.</p>
      <ul class="nma-feature-bullets">
        <li>METRC sync failures with package details</li>
        <li>Safe count reminders with countdown</li>
        <li>Inventory threshold alerts by product</li>
        <li>Delivery confirmations and PO updates</li>
      </ul>
    </div>
  </div>

  <hr class="nma-divider"/>

  <!-- Feature 3: Quick Actions -->
  <div class="nma-feature nma-fade-in">
    <div class="nma-phone">
      <div class="nma-phone-notch"></div>
      <div class="nma-phone-screen">${SCREEN_ACTIONS}</div>
      <div class="nma-phone-home"></div>
    </div>
    <div class="nma-feature-text">
      <div class="nma-feature-label orange">QUICK ACTIONS</div>
      <h2>Approve, respond, resolve — without opening a laptop</h2>
      <p>Swipeable action cards for the tasks that pile up during the day. Handle purchase orders, messages, and alerts in seconds.</p>
      <ul class="nma-feature-bullets">
        <li>One-tap purchase order approvals</li>
        <li>Quick replies to DTCH vendor messages</li>
        <li>Reorder or dismiss inventory alerts</li>
        <li>All context inline — no app switching</li>
      </ul>
    </div>
  </div>

  <hr class="nma-divider"/>

  <!-- Feature 4: Manager Overrides -->
  <div class="nma-feature reverse nma-fade-in">
    <div class="nma-phone">
      <div class="nma-phone-notch"></div>
      <div class="nma-phone-screen">${SCREEN_OVERRIDES}</div>
      <div class="nma-phone-home"></div>
    </div>
    <div class="nma-feature-text">
      <div class="nma-feature-label blue">MANAGER OVERRIDES</div>
      <h2>Sign off on overrides from anywhere in the store</h2>
      <p>Budtenders request discount overrides, voids, and refunds. You approve or deny right from your pocket — no walking back to the office.</p>
      <ul class="nma-feature-bullets">
        <li>Full context: budtender, customer tier, amounts</li>
        <li>Policy violation highlights (over max discount)</li>
        <li>One-tap approve or deny</li>
        <li>Audit trail logged automatically</li>
      </ul>
    </div>
  </div>

  <hr class="nma-divider"/>

  <!-- Interactive Prototype -->
  <div class="nma-proto nma-fade-in">
    <div class="nma-badge">INTERACTIVE</div>
    <h2>Try the Prototype</h2>
    <p>Click through the tabs to explore each screen</p>
    <div class="nma-proto-tabs">
      <div class="nma-proto-tab active" data-tab="briefing">Briefing</div>
      <div class="nma-proto-tab" data-tab="alerts">Alerts</div>
      <div class="nma-proto-tab" data-tab="actions">Actions</div>
      <div class="nma-proto-tab" data-tab="overrides">Overrides</div>
    </div>
    <div class="nma-proto-phone">
      <div class="nma-phone" style="margin:0 auto">
        <div class="nma-phone-notch"></div>
        <div class="nma-phone-screen" id="nma-proto-screen">${SCREEN_BRIEFING}</div>
        <div class="nma-phone-home"></div>
      </div>
    </div>
  </div>

  <hr class="nma-divider"/>

  <!-- Ecosystem -->
  <div class="nma-ecosystem nma-fade-in">
    <div class="nma-badge">CONNECTED ECOSYSTEM</div>
    <h2>Mobile Ties Everything Together</h2>
    <p>Every mobile interaction flows back into the Nexus platform</p>
    <div class="nma-flow">
      <div class="nma-flow-step">
        <div class="nma-flow-step-icon">🖥</div>
        <div class="nma-flow-step-title">POS Event</div>
        <div class="nma-flow-step-desc">Override requested at register</div>
      </div>
      <div class="nma-flow-arrow">→</div>
      <div class="nma-flow-step">
        <div class="nma-flow-step-icon">📱</div>
        <div class="nma-flow-step-title">Mobile Alert</div>
        <div class="nma-flow-step-desc">Push notification to manager</div>
      </div>
      <div class="nma-flow-arrow">→</div>
      <div class="nma-flow-step">
        <div class="nma-flow-step-icon">⚡</div>
        <div class="nma-flow-step-title">Quick Action</div>
        <div class="nma-flow-step-desc">Approve from the floor</div>
      </div>
      <div class="nma-flow-arrow">→</div>
      <div class="nma-flow-step">
        <div class="nma-flow-step-icon">✓</div>
        <div class="nma-flow-step-title">Confirmation</div>
        <div class="nma-flow-step-desc">POS updated, audit logged</div>
      </div>
    </div>
  </div>

  <hr class="nma-divider"/>

  <!-- CTA -->
  <div class="nma-cta nma-fade-in">
    <div class="nma-badge">COMING IN PHASE 3</div>
    <h2>The Floor is Your Office</h2>
    <p>Nexus Mobile brings the command center to where dispensary operators actually work — on their feet, with their team.</p>
    <a href="/design-review#ideas-beyond" class="nma-cta-link">← Back to Full Design Review</a>
  </div>
`;

export default function NexusMobileApp() {
  useEffect(() => {
    // Inject styles
    const style = document.createElement("style");
    style.setAttribute("data-nma", "true");
    style.textContent = MOBILE_APP_CSS;
    document.head.appendChild(style);

    // Inject Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    link.setAttribute("data-nma", "true");
    document.head.appendChild(link);

    // Interactive prototype tabs
    const root = document.querySelector("[data-nma-root]");
    if (root) {
      const screens = {
        briefing: SCREEN_BRIEFING,
        alerts: SCREEN_ALERTS,
        actions: SCREEN_ACTIONS,
        overrides: SCREEN_OVERRIDES,
      };

      root.addEventListener("click", (e) => {
        const tab = e.target.closest(".nma-proto-tab");
        if (!tab) return;
        const key = tab.getAttribute("data-tab");
        if (!key || !screens[key]) return;

        // Update active tab
        root.querySelectorAll(".nma-proto-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Swap screen content
        const screen = document.getElementById("nma-proto-screen");
        if (screen) screen.innerHTML = screens[key];
      });
    }

    // Scroll-triggered fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    setTimeout(() => {
      document.querySelectorAll(".nma-fade-in").forEach((el) => observer.observe(el));
    }, 100);

    // Cleanup
    return () => {
      document.querySelectorAll("[data-nma]").forEach((el) => el.remove());
      observer.disconnect();
    };
  }, []);

  return (
    <div
      data-nma-root=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "auto",
        background: "#0D0C0A",
      }}
      dangerouslySetInnerHTML={{ __html: MOBILE_APP_HTML }}
    />
  );
}
