import React, { useState } from "react";

/* ───────────────────────────────────────────────────
   NEXUS HOME REDESIGN REVIEW — Visual Mockup Page
   Public URL: /nexus-retail-v2/#/nexus-redesign
   ─────────────────────────────────────────────────── */

const T = {
  bg: '#0D0C0A', card: '#1C1B1A', cardAlt: '#242320', surface: '#2E2D2A',
  border: '#38332B', borderSubtle: '#2E2D2A',
  bright: '#F0EDE8', normal: '#C8C3BA', muted: '#ADA599', faint: '#7A7468',
  green: '#00C27C', blue: '#64A8E0', amber: '#D4A03A', purple: '#B598E8',
  red: '#E87068', pink: '#E880A0',
};

const NEXUS_PATHS = [
  "M1.09298 3.77513C2.37765 2.73678 3.97946 2.0563 5.63517 2.03136C6.52119 2.02138 7.42036 2.21229 8.19531 2.65596C9.49936 3.38567 10.4511 4.98775 9.99627 6.50004C9.97393 6.56024 9.88716 6.53663 9.9013 6.4721C10.0219 6.00215 9.9943 5.5026 9.85857 5.0423C9.50166 3.82202 8.42108 2.92403 7.22515 2.61638C6.65791 2.46373 6.05781 2.42648 5.47413 2.48102C5.37521 2.48667 5.22272 2.51062 5.12347 2.52293C4.96178 2.5492 4.76262 2.58845 4.60356 2.62636C3.91735 2.79598 3.2571 3.07436 2.65273 3.44354C2.24948 3.68866 1.86858 3.97102 1.51595 4.28466C1.37956 4.40639 1.1712 4.39308 1.05125 4.25472C0.927348 4.11271 0.94641 3.89253 1.09298 3.77513Z",
  "M0.154329 9.19302C0.556918 7.16755 1.70388 5.19961 3.53377 4.19918C3.95608 3.9677 4.42078 3.80074 4.89304 3.7116C4.98079 3.69963 5.09154 3.67735 5.17962 3.67003C5.32981 3.6544 5.51057 3.64309 5.66043 3.64409C5.70775 3.64608 5.80536 3.64874 5.85268 3.65107C6.58457 3.69132 7.31712 3.93909 7.88929 4.40938C8.2853 4.73199 8.60573 5.15804 8.7671 5.64628C8.77564 5.67255 8.76184 5.70082 8.73587 5.7098C8.71057 5.71845 8.68362 5.70515 8.67409 5.68054C8.49826 5.22156 8.17488 4.8321 7.78642 4.54507C7.15543 4.07512 6.35058 3.88023 5.57498 3.93144C5.47244 3.93577 5.32225 3.95506 5.21906 3.97102C5.17009 3.97668 5.0922 3.99464 5.04323 4.00428C4.85887 4.0392 4.66201 4.10173 4.48421 4.1626C3.88312 4.3861 3.331 4.74363 2.86235 5.18431C1.71966 6.25459 1.03477 7.76621 0.8011 9.30876C0.774151 9.49102 0.605557 9.61641 0.425789 9.58814C0.241091 9.55987 0.116535 9.37827 0.154329 9.19302Z",
  "M2.8763 13.9537C1.88248 12.1148 1.51506 9.81461 2.32681 7.83936C2.53057 7.35378 2.81222 6.89513 3.16485 6.506C4.03149 5.54183 5.42855 4.97942 6.6912 5.38451C6.93736 5.46433 7.17168 5.5814 7.37938 5.73639C7.4014 5.75269 7.406 5.78428 7.3899 5.80657C7.37412 5.82818 7.34422 5.83317 7.32253 5.81854C6.27119 5.11677 4.84127 5.42109 3.91416 6.19669C3.39688 6.62274 2.99757 7.18715 2.7455 7.81009C2.27949 8.94788 2.26601 10.236 2.54405 11.4237C2.61405 11.7144 2.70508 12.0227 2.81057 12.3024C2.9818 12.761 3.19542 13.2027 3.44584 13.6211C3.54082 13.7781 3.4912 13.9836 3.33575 14.0791C3.17636 14.1775 2.96537 14.12 2.8763 13.9537Z",
  "M7.98536 15.8302C6.03453 15.0599 4.27136 13.5097 3.6591 11.4347C3.47407 10.7944 3.41688 10.1076 3.52567 9.44811C3.70741 8.2754 4.45638 7.13994 5.58856 6.73385C5.83505 6.64604 6.09599 6.59748 6.35693 6.59848C6.38421 6.59848 6.40623 6.6211 6.40623 6.6487C6.40623 6.67564 6.38487 6.69726 6.35858 6.69859C6.11012 6.70923 5.86495 6.76644 5.63523 6.86056C4.21549 7.45856 3.58877 9.13248 3.83985 10.6002C4.07286 12.0187 4.98353 13.242 6.1019 14.0914C6.29285 14.2328 6.50909 14.3841 6.71285 14.5048C7.18479 14.7932 7.69057 15.0246 8.21114 15.2049C8.38302 15.2641 8.47504 15.453 8.41621 15.627C8.3564 15.8062 8.15889 15.8994 7.98536 15.8302Z",
  "M13.0909 13.9441C11.0458 14.6455 8.61317 14.5783 6.81483 13.2716C6.71032 13.1921 6.6022 13.1086 6.50459 13.0201C6.46417 12.9835 6.3945 12.925 6.35703 12.8854C6.17135 12.7055 5.98139 12.494 5.83284 12.2824C5.05626 11.2228 4.79729 9.68958 5.48514 8.52119C5.61988 8.29403 5.79078 8.08815 5.99289 7.92053C6.01393 7.9029 6.04515 7.90623 6.06257 7.92751C6.07933 7.94813 6.0767 7.97873 6.05731 7.99669C5.87195 8.16532 5.71913 8.36786 5.60148 8.5887C5.00664 9.71286 5.30669 11.1353 6.07834 12.0935C6.22393 12.2824 6.4083 12.4704 6.58741 12.628C6.64887 12.6852 6.73629 12.7497 6.80103 12.8036C7.81161 13.5709 9.10679 13.8822 10.357 13.8436C10.656 13.8356 10.9778 13.8057 11.2726 13.7565C11.8178 13.6703 12.3531 13.5187 12.8671 13.3178C13.0364 13.2513 13.227 13.3364 13.2924 13.5077C13.3604 13.6836 13.2681 13.8842 13.0909 13.9441Z",
  "M15.8043 9.17773C15.0162 10.4845 13.8797 11.6003 12.4951 12.2362C10.9877 12.941 9.16927 12.9945 7.79258 11.9652C7.16356 11.4962 6.67881 10.7971 6.54111 10.0115C6.49608 9.75145 6.49148 9.48371 6.53453 9.22396C6.53913 9.19669 6.56444 9.17839 6.59172 9.18272C6.61801 9.18704 6.63576 9.21165 6.6328 9.23826C6.60289 9.4877 6.61899 9.74114 6.67289 9.98526C6.89243 10.9694 7.67065 11.7496 8.58001 12.1162C9.72205 12.5941 11.0373 12.4325 12.1333 11.9013C12.8527 11.5587 13.5005 11.0668 14.05 10.4868C14.516 9.9969 14.9126 9.43815 15.236 8.84348C15.3235 8.6825 15.5233 8.62363 15.6823 8.7121C15.8463 8.8029 15.9019 9.01676 15.8043 9.17773Z",
  "M14.8547 3.76181C15.136 5.63862 14.8136 7.66941 13.6916 9.22194C13.1181 10.0182 12.3097 10.6607 11.3711 10.9451C10.1577 11.3326 8.63609 11.0605 7.87265 9.96262C7.83913 9.90808 7.91143 9.85287 7.95284 9.90375C8.25191 10.2985 8.68013 10.5789 9.14187 10.7339C10.0709 11.0475 11.1098 10.8696 11.9422 10.3727C13.6367 9.35199 14.3854 7.25268 14.3591 5.33097C14.3528 4.8424 14.3016 4.35548 14.2079 3.87722C14.1718 3.69662 14.2878 3.52068 14.4662 3.4851C14.6493 3.44785 14.8271 3.5749 14.8547 3.76181Z",
  "M10.6884 0.230376C12.1883 1.56639 13.2774 3.49674 13.2755 5.55348C13.2702 6.16611 13.1562 6.78506 12.9215 7.3508C12.5485 8.23382 11.8629 9.01042 10.9753 9.37494C10.5083 9.56984 9.98935 9.64999 9.49145 9.56485C9.42934 9.55055 9.4415 9.46008 9.50592 9.46574C10.9828 9.63536 12.2908 8.43637 12.6997 7.0681C12.8433 6.61311 12.9061 6.12687 12.8942 5.6496C12.8696 4.50615 12.4542 3.39397 11.8284 2.45008C11.6658 2.20496 11.4807 1.95752 11.2888 1.73535C10.9782 1.37282 10.6351 1.03957 10.2661 0.739904C10.1238 0.625161 10.1008 0.415296 10.2145 0.271617C10.3311 0.123615 10.5487 0.104657 10.6884 0.230376Z",
  "M5.25308 0.235702C7.19405 0.283595 9.19319 1.00897 10.5025 2.50131C11.005 3.07369 11.3829 3.76415 11.5558 4.51148C11.7382 5.31202 11.6883 6.18574 11.3376 6.93174C11.1253 7.38839 10.8039 7.79714 10.3918 8.08017C10.3691 8.0958 10.3382 8.08982 10.3231 8.06687C10.3083 8.04458 10.3132 8.01465 10.3342 7.99869C10.7161 7.70834 11.0027 7.30424 11.1835 6.86223C11.4802 6.14217 11.4888 5.32666 11.2824 4.58232C11.0734 3.83998 10.6435 3.17214 10.0937 2.64133C9.67334 2.23024 9.17774 1.89466 8.65586 1.63025C8.02453 1.31795 7.34523 1.10343 6.6508 0.994672C6.1884 0.920837 5.71975 0.889906 5.25275 0.900882C5.07101 0.905538 4.91984 0.759864 4.91589 0.575941C4.91096 0.386698 5.06608 0.230713 5.25308 0.235702Z",
];

function NexusLogo({ size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A1710 0%, #2A2318 100%)', boxShadow: '0 0 24px rgba(212,160,58,0.35), inset 0 1px 0 rgba(212,160,58,0.15)', border: '1px solid rgba(212,160,58,0.25)' }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 16 16" fill="none">
        <defs>
          <radialGradient id="ng" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8 8) rotate(90) scale(8)">
            <stop offset="0.35" stopColor="#D4A03A" />
            <stop offset="0.7" stopColor="#FFC02A" />
            <stop offset="1" stopColor="#FFD666" />
          </radialGradient>
        </defs>
        {NEXUS_PATHS.map((d, i) => <path key={i} d={d} fill="url(#ng)" />)}
      </svg>
    </div>
  );
}

/* ─── Mockup Components ─── */

function MockupFrame({ title, children, wide }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8, background: T.bg }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#E87068' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#D4A03A' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00C27C' }} />
        </div>
        <span style={{ fontSize: 12, color: T.faint, marginLeft: 8, fontFamily: 'monospace' }}>{title}</span>
      </div>
      <div style={{ padding: wide ? 0 : 24 }}>{children}</div>
    </div>
  );
}

function PulsingDot({ color = T.green, size = 8 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: color, opacity: 0.4, animation: 'pulse-ring 1.5s infinite' }} />
      <span style={{ width: '100%', height: '100%', borderRadius: '50%', background: color }} />
    </span>
  );
}

function ConicDonut({ score, size = 56, label }) {
  const deg = score * 3.6;
  const color = score >= 75 ? T.green : score >= 55 ? T.amber : T.red;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `conic-gradient(${color} ${deg}deg, ${T.border} 0deg)`,
      }}>
        <div style={{ width: size - 14, height: size - 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.card, fontSize: 15, fontWeight: 700, color }}>
          {score}
        </div>
      </div>
      {label && <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{label}</div>}
    </div>
  );
}

function Badge({ children, color = T.green }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div style={{ marginBottom: 32, marginTop: 64 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.amber}18`, border: `1px solid ${T.amber}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: T.amber }}>
          {number}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: T.bright }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontSize: 14, color: T.muted, marginLeft: 44 }}>{subtitle}</p>}
    </div>
  );
}

/* ─── Section Mockups ─── */

function MorningBriefingMockup() {
  return (
    <MockupFrame title="Morning Briefing — AI-Generated Narrative">
      <div style={{ background: T.bg, borderRadius: 12, padding: 24, border: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NexusLogo size={36} />
            <span style={{ fontSize: 15, fontWeight: 600, color: T.bright }}>Good morning, Tim.</span>
          </div>
          <span style={{ fontSize: 12, color: T.faint }}>Sat Mar 15 &middot; 9:42 AM</span>
        </div>
        <div style={{ background: `${T.amber}08`, border: `1px solid ${T.amber}20`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: T.normal, lineHeight: 1.7, fontStyle: 'italic' }}>
            "Yesterday was your best Friday this quarter. Springfield IL drove 34% of revenue with a 12% increase in average basket size. 3 items need reordering &mdash; I've already drafted a PO for your review. Your Google rating improved to 4.6 stars across all stores, and the March Madness campaign generated 47 SMS opt-ins."
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Revenue', value: '$47.2K', trend: '+12%', color: T.green },
            { label: 'Transactions', value: '312', trend: '+8%', color: T.green },
            { label: 'Avg Rating', value: '4.6\u2605', trend: '+0.2', color: T.amber },
            { label: 'Alerts', value: '3', trend: '', color: T.red },
            { label: 'Systems', value: 'All Live', trend: '', color: T.green },
          ].map(m => (
            <div key={m.label} style={{ minWidth: 80 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: T.faint, marginBottom: 4 }}>{m.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: T.bright, fontVariantNumeric: 'tabular-nums' }}>{m.value}</span>
                {m.trend && <span style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.trend}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

function LiveTickerMockup() {
  const events = [
    { icon: '\uD83D\uDCB0', text: '$156 sale Springfield IL', time: '2m', color: T.green },
    { icon: '\uD83D\uDCE6', text: 'PO #4421 received Hoboken NJ', time: '5m', color: T.blue },
    { icon: '\u2B50', text: '5-star Google review Detroit MI', time: '8m', color: T.amber },
    { icon: '\uD83D\uDCF1', text: 'SMS opt-in x12 Chicago IL', time: '11m', color: T.purple },
    { icon: '\uD83C\uDFAF', text: 'Campaign click x47 "Spring Sale"', time: '15m', color: T.pink },
    { icon: '\uD83D\uDCB0', text: '$89 sale Ann Arbor MI', time: '18m', color: T.green },
    { icon: '\u26A0\uFE0F', text: 'Low stock: Blue Dream 3.5g', time: '22m', color: T.red },
  ];
  return (
    <MockupFrame title="Live Activity Ticker — Real-time Event Stream" wide>
      <div style={{ background: T.bg, padding: '12px 20px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <PulsingDot />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.bright }}>Live Feed</span>
          <span style={{ fontSize: 10, color: T.faint, marginLeft: 'auto' }}>Auto-scrolling &middot; 90s cycle</span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {events.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1px solid ${T.border}`, background: T.card, whiteSpace: 'nowrap', fontSize: 12, flexShrink: 0 }}>
              <span>{e.icon}</span>
              <span style={{ color: T.bright, fontWeight: 500 }}>{e.text}</span>
              <span style={{ color: T.faint }}>{e.time}</span>
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

function CommandBarMockup() {
  const pills = [
    { icon: '\uD83D\uDCE6', label: 'Reorder Inventory', color: T.blue },
    { icon: '\uD83D\uDCE2', label: 'Launch Campaign', color: T.green },
    { icon: '\uD83D\uDCB0', label: 'Reprice Menu', color: T.amber },
    { icon: '\uD83D\uDCCA', label: 'Sales Report', color: T.blue },
    { icon: '\uD83D\uDCAC', label: 'Customer Sentiment', color: T.purple },
    { icon: '\uD83D\uDE80', label: 'Trending Products', color: T.pink },
  ];
  return (
    <MockupFrame title="Nexus Command Bar — Primary AI Interface">
      <div style={{ background: T.bg, borderRadius: 12, border: `1px solid ${T.border}`, padding: 24, borderLeft: `3px solid ${T.amber}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <NexusLogo size={32} />
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.bright }}>Nexus AI</span>
            <span style={{ fontSize: 11, color: T.faint, marginLeft: 8 }}>11 agent lanes active</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <PulsingDot />
            <span style={{ fontSize: 11, color: T.green, fontWeight: 500 }}>Online</span>
          </div>
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', padding: '10px 16px', marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: T.faint, flex: 1 }}>What would you like to do?</span>
          <span style={{ fontSize: 11, color: T.faint, background: T.surface, padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>\u2318K</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          {pills.map(p => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, cursor: 'pointer' }}>
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: T.bright }}>{p.label}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.faint }}>
          Recent: <span style={{ color: T.muted, cursor: 'pointer' }}>"Show me stockout report"</span> &middot; <span style={{ color: T.muted, cursor: 'pointer' }}>"Reprice Blue Dream"</span>
        </div>
      </div>
    </MockupFrame>
  );
}

function PulseStripMockup() {
  const metrics = [
    { label: 'REVENUE', value: '$47,230', trend: '+12%', trendUp: true, pct: 72 },
    { label: 'TRANSACTIONS', value: '312', trend: '+8%', trendUp: true, pct: 58 },
    { label: 'AVG BASKET', value: '$151.38', trend: '+3%', trendUp: true, pct: 85 },
    { label: 'MARGIN', value: '51.2%', trend: '+0.4%', trendUp: true, pct: 90 },
    { label: 'STOCKOUTS', value: '3', trend: '', trendUp: false, pct: 15, alert: true },
  ];
  return (
    <MockupFrame title="Live Pulse Strip — Animated KPI Counters with Sparklines">
      <div style={{ background: T.bg, borderRadius: 12, border: `1px solid ${T.border}`, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.bright }}>\u25B8 TODAY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PulsingDot />
            <span style={{ fontSize: 11, color: T.bright }}>Live</span>
            <span style={{ fontSize: 11, color: T.faint }}>2:34 PM</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {metrics.map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: T.faint, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: m.alert ? T.red : T.bright, fontVariantNumeric: 'tabular-nums', marginBottom: 2 }}>
                {m.value}
                {m.trend && <span style={{ fontSize: 12, fontWeight: 600, color: m.trendUp ? T.green : T.red, marginLeft: 6 }}>{m.trend}</span>}
                {m.alert && <span style={{ fontSize: 12, color: T.red, marginLeft: 4 }}>\u26A0</span>}
              </div>
              {/* Mini progress bar */}
              <div style={{ height: 4, borderRadius: 2, background: T.border, marginTop: 6 }}>
                <div style={{ height: '100%', borderRadius: 2, background: m.alert ? T.red : T.green, width: `${m.pct}%`, transition: 'width 1s ease-out' }} />
              </div>
              <div style={{ fontSize: 9, color: T.faint, marginTop: 3 }}>{m.pct}% of daily target</div>
              {/* Mini sparkline representation */}
              <svg width="100%" height="24" viewBox="0 0 100 24" style={{ marginTop: 4 }}>
                <path d={`M0,${20-Math.random()*8} ${Array.from({length:9}, (_,i) => `L${(i+1)*10},${20-Math.random()*16}`).join(' ')}`} fill="none" stroke={m.alert ? T.red : T.green} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}`, fontSize: 12 }}>
          <span style={{ color: T.muted }}>\uD83C\uDFC6 Top: <span style={{ color: T.bright, fontWeight: 600 }}>Ascend Springfield IL</span> &mdash; $8.2K</span>
          <span style={{ color: T.muted }}>\uD83D\uDCC9 Watch: <span style={{ color: T.red, fontWeight: 600 }}>Ascend Detroit MI</span> &mdash; basket down 15%</span>
        </div>
      </div>
    </MockupFrame>
  );
}

function SmartAlertsMockup() {
  const alerts = [
    { severity: 'CRITICAL', color: T.red, time: '2m ago', title: 'Blue Dream 3.5g out of stock at 4 stores', ai: 'Vendor has stock. Reorder 200 units for $2,840. Est. delivery: 2 days.', actions: ['Approve Reorder', 'Modify', 'Dismiss'] },
    { severity: 'WARNING', color: T.amber, time: '15m ago', title: 'Stiiizy Pod LLR priced 18% above market avg', ai: 'Competitors at $42 avg. Suggest $44.99 (currently $52). Projected +23% velocity.', actions: ['Apply Price', 'View Competitors'] },
    { severity: 'OPPORTUNITY', color: T.green, time: '1h ago', title: 'Sentiment spike for "Jeeter" brand (+34% WoW)', ai: 'Trending on social. 2 stores don\'t stock it yet. Contact vendor for initial order?', actions: ['Draft PO', 'View Sentiment'] },
    { severity: 'INSIGHT', color: T.blue, time: '3h ago', title: 'Tuesday traffic pattern: 62% of sales after 4pm', ai: 'Consider shifting staff coverage to match traffic.', actions: ['View Staffing', 'Acknowledge'] },
  ];

  const resolved = [
    'Auto-resolved: Springfield IL register sync issue',
    'Campaign "March Madness" launched to 3 stores',
    'Auto-reordered Stiiizy Pods (50 units) for Hoboken NJ',
  ];

  return (
    <MockupFrame title="Smart Alerts & Actions Feed — AI-Prioritized with One-Click Resolution">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, background: i === 0 ? `${a.color}06` : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Badge color={a.color}>{a.severity}</Badge>
              <span style={{ fontSize: 11, color: T.faint }}>{a.time}</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.bright, marginBottom: 6 }}>{a.title}</p>
            <div style={{ background: `${a.color}08`, border: `1px solid ${a.color}20`, borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
              <p style={{ fontSize: 12, color: T.normal, fontStyle: 'italic' }}>AI: "{a.ai}"</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {a.actions.map((action, j) => (
                <button key={j} style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: j === 0 ? a.color : 'transparent', color: j === 0 ? '#fff' : T.muted,
                  ...(j !== 0 && { border: `1px solid ${T.border}` }),
                }}>{action}</button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ padding: '12px 20px', background: `${T.green}06` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.faint, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Auto-Resolved Today</div>
          {resolved.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.muted, marginBottom: 4 }}>
              <span style={{ color: T.green }}>\u2713</span> {r}
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

function StoreHealthMockup() {
  const stores = [
    { name: 'Springfield', state: 'IL', score: 92, rev: '$8.2K', trend: '+12%', alerts: 0 },
    { name: 'Hoboken', state: 'NJ', score: 87, rev: '$6.1K', trend: '+5%', alerts: 0 },
    { name: 'Chicago Loop', state: 'IL', score: 74, rev: '$5.8K', trend: '-3%', alerts: 1 },
    { name: 'Ann Arbor', state: 'MI', score: 68, rev: '$3.2K', trend: '+2%', alerts: 2 },
    { name: 'Detroit', state: 'MI', score: 51, rev: '$2.1K', trend: '-15%', alerts: 3 },
    { name: 'Baltimore', state: 'MD', score: 82, rev: '$4.5K', trend: '+7%', alerts: 0 },
  ];
  return (
    <MockupFrame title="Store Health Matrix — Conic Gradient Health Donuts">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: T.bright }}>Store Health Matrix</span>
        <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
          <span style={{ color: T.green }}>\u25CF \u226575 Healthy</span>
          <span style={{ color: T.amber }}>\u25CF \u226555 Watch</span>
          <span style={{ color: T.red }}>\u25CF &lt;55 At Risk</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {stores.map(s => (
          <div key={s.name} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'pointer' }}>
            <ConicDonut score={s.score} size={52} />
            <div style={{ fontSize: 13, fontWeight: 600, color: T.bright, marginTop: 8 }}>{s.name}</div>
            <div style={{ fontSize: 11, color: T.faint }}>{s.state} &middot; {s.rev}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 11, color: s.trend.startsWith('+') ? T.green : T.red, fontWeight: 600 }}>{s.trend} today</span>
              {s.alerts > 0 && <span style={{ fontSize: 11, color: T.red }}>{s.alerts} alert{s.alerts > 1 ? 's' : ''}</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.faint }}>
        <span>Score = Revenue (30%) + Sentiment (25%) + Stockouts (20%) + Compliance (15%) + Marketing (10%)</span>
        <span>Click any store to drill in</span>
      </div>
    </MockupFrame>
  );
}

function ThinkingStepsMockup() {
  const steps = [
    { text: 'Pulling SKU velocity & inventory data', done: true },
    { text: 'Checking vendor availability', done: true },
    { text: 'Calculating reorder quantities', done: false, active: true },
    { text: 'Generating purchase order', done: false },
  ];
  return (
    <MockupFrame title="Agent Thinking Steps — Context-Aware Progress">
      <div style={{ maxWidth: 400 }}>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>User asked: <em>"Reorder inventory for out-of-stock items"</em></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: s.active ? '6px 12px' : '2px 6px',
              borderRadius: 8, opacity: s.done ? 0.5 : 1,
              ...(s.active && { background: `${T.green}0A`, border: `1px solid ${T.green}20` }),
            }}>
              {s.done ? (
                <span style={{ color: T.green, fontSize: 13 }}>\u2713</span>
              ) : s.active ? (
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${T.border}`, borderTopColor: T.green, animation: 'spin 1s linear infinite' }} />
              ) : (
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${T.border}` }} />
              )}
              <span style={{ fontSize: 12, color: s.active ? T.bright : T.muted, fontWeight: s.active ? 500 : 400 }}>{s.text}</span>
              {s.active && <span style={{ fontSize: 10, color: T.faint, marginLeft: 'auto' }}>2.1s</span>}
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

function FullLayoutMockup() {
  return (
    <MockupFrame title="Full Page Layout — Top to Bottom Flow" wide>
      <div style={{ padding: 20, background: T.bg }}>
        {[
          { label: 'MORNING BRIEFING', desc: 'AI narrative + KPI strip', h: 100, color: T.amber },
          { label: 'LIVE TICKER', desc: 'Scrolling event stream', h: 40, color: T.green },
          { label: 'NEXUS COMMAND BAR', desc: 'Search + pills + history', h: 120, color: T.amber },
        ].map(s => (
          <div key={s.label} style={{ background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 8, padding: 12, marginBottom: 8, minHeight: s.h, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.label}</span>
            <span style={{ fontSize: 10, color: T.faint }}>{s.desc}</span>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 8, marginBottom: 8 }}>
          <div style={{ background: `${T.blue}08`, border: `1px solid ${T.blue}25`, borderRadius: 8, padding: 12, minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue }}>LIVE PULSE STRIP</span>
            <span style={{ fontSize: 10, color: T.faint }}>5 KPI counters + sparklines</span>
          </div>
          <div style={{ background: `${T.red}08`, border: `1px solid ${T.red}25`, borderRadius: 8, padding: 12, minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.red }}>SMART ALERTS FEED</span>
            <span style={{ fontSize: 10, color: T.faint }}>AI-prioritized with 1-click resolution</span>
          </div>
        </div>
        {[
          { label: 'STORE HEALTH MATRIX', desc: 'Conic gradient health donuts', h: 80, color: T.green },
          { label: 'SALES REPORTING', desc: 'Full dashboard (existing)', h: 80, color: T.blue },
        ].map(s => (
          <div key={s.label} style={{ background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 8, padding: 12, marginBottom: 8, minHeight: s.h, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.label}</span>
            <span style={{ fontSize: 10, color: T.faint }}>{s.desc}</span>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: `${T.purple}08`, border: `1px solid ${T.purple}25`, borderRadius: 8, padding: 12, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.purple }}>SENTIMENT</span>
            <span style={{ fontSize: 10, color: T.faint }}>AI summaries + NPS</span>
          </div>
          <div style={{ background: `${T.pink}08`, border: `1px solid ${T.pink}25`, borderRadius: 8, padding: 12, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.pink }}>OMNICHANNEL</span>
            <span style={{ fontSize: 10, color: T.faint }}>SMS / Ecomm / Voice / QR</span>
          </div>
        </div>
      </div>
    </MockupFrame>
  );
}

function BeforeAfterTable() {
  const rows = [
    ['Primary interface', 'Scrolling tile dashboard', 'AI command center'],
    ['Data freshness', 'Static mock data', 'Simulated real-time with animations'],
    ['Actionability', 'View only', 'One-click resolutions, inline forms'],
    ['AI presence', 'Hidden behind FAB', 'Front and center, proactive alerts'],
    ['Store management', 'No fleet view', 'Health matrix with composite scores'],
    ['Alerts', 'None', 'Prioritized feed with AI recommendations'],
    ['Real-time feel', 'None', 'Live ticker + pulse strip + counting numbers'],
    ['Dead content', '10 low-value tiles', 'Zero \u2014 everything earns its place'],
    ['Personality', 'Corporate dashboard', 'Intelligent co-pilot'],
  ];
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: T.surface }}>
            <th style={{ padding: '10px 16px', textAlign: 'left', color: T.faint, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Aspect</th>
            <th style={{ padding: '10px 16px', textAlign: 'left', color: T.red, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Current</th>
            <th style={{ padding: '10px 16px', textAlign: 'left', color: T.green, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Proposed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([aspect, cur, next], i) => (
            <tr key={i} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 === 0 ? T.card : T.bg }}>
              <td style={{ padding: '10px 16px', color: T.bright, fontWeight: 500 }}>{aspect}</td>
              <td style={{ padding: '10px 16px', color: T.muted }}>{cur}</td>
              <td style={{ padding: '10px 16px', color: T.green, fontWeight: 500 }}>{next}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhaseRoadmap() {
  const phases = [
    { phase: 'A', label: 'Core Restructure', color: T.green, items: ['Nexus Command Bar', 'Live Pulse Strip', 'Smart Alerts Feed', 'Remove dead tiles'] },
    { phase: 'B', label: 'Live & Immersive', color: T.blue, items: ['Live Activity Ticker', 'Store Health Matrix', 'AI Morning Briefing'] },
    { phase: 'C', label: 'Deep Agentic', color: T.purple, items: ['Agent Thinking Steps', 'Auto-Resolved Log', 'NL on every tile', 'Multi-step workflows'] },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {phases.map(p => (
        <div key={p.phase} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, borderTop: `3px solid ${p.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: `${p.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: p.color }}>
              {p.phase}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.bright }}>{p.label}</span>
          </div>
          {p.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted, marginBottom: 6 }}>
              <span style={{ color: p.color }}>\u25CF</span> {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─── */

export default function NexusRedesignReview() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: T.bg, color: T.normal, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        a { color: ${T.amber}; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      {/* Hero */}
      <div style={{ padding: '48px 0', textAlign: 'center', borderBottom: `1px solid ${T.border}`, background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${T.amber}08 0%, transparent 70%)` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <NexusLogo size={56} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: T.bright, marginBottom: 8, lineHeight: 1.2 }}>
            Nexus Home Redesign Review
          </h1>
          <p style={{ fontSize: 16, color: T.muted, maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.6 }}>
            From passive dashboard to intelligent command center.<br />
            Every element is actionable. Every tile earns its place. AI is the primary interface.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Badge color={T.green}>7 New Components</Badge>
            <Badge color={T.red}>10 Tiles Removed</Badge>
            <Badge color={T.amber}>3 Implementation Phases</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Vision Statement */}
        <div style={{ margin: '48px 0', padding: 24, borderRadius: 12, background: `${T.amber}08`, border: `1px solid ${T.amber}20` }}>
          <p style={{ fontSize: 16, color: T.bright, lineHeight: 1.7, fontStyle: 'italic', textAlign: 'center' }}>
            "When a cannabis retailer opens Nexus, they should feel like they have a brilliant operations manager who already knows what needs attention, has recommendations ready, and can execute on their behalf with one click."
          </p>
        </div>

        <SectionHeader number="1" title="AI Morning Briefing" subtitle="AI-generated narrative replaces static KPI cards. Tells the story, not just the numbers." />
        <MorningBriefingMockup />

        <SectionHeader number="2" title="Live Activity Ticker" subtitle="Continuously scrolling horizontal feed of real-time store events. 90-second infinite loop." />
        <LiveTickerMockup />

        <SectionHeader number="3" title="Nexus Command Bar" subtitle="The primary AI interface. Search, action pills, command history, keyboard shortcut." />
        <CommandBarMockup />

        <SectionHeader number="4" title="Live Pulse Strip" subtitle="Animated KPI counters that count up on load. Mini sparklines. Target progress bars." />
        <PulseStripMockup />

        <SectionHeader number="5" title="Smart Alerts & Actions" subtitle="AI-prioritized alerts with context, recommendations, and one-click resolution." />
        <SmartAlertsMockup />

        <SectionHeader number="6" title="Store Health Matrix" subtitle="Fleet management view with conic gradient health scores. Sortable, filterable, clickable." />
        <StoreHealthMockup />

        <SectionHeader number="7" title="Agent Thinking Steps" subtitle="Context-aware progress indicators matching the user's query keywords." />
        <ThinkingStepsMockup />

        {/* Full Layout */}
        <SectionHeader number="8" title="Full Page Layout" subtitle="How all the sections stack together, top to bottom." />
        <FullLayoutMockup />

        {/* Before vs After */}
        <SectionHeader number="9" title="Before vs After" subtitle="Side-by-side comparison of the current state vs proposed redesign." />
        <BeforeAfterTable />

        {/* Implementation Roadmap */}
        <SectionHeader number="10" title="Implementation Roadmap" subtitle="Three phases ordered by impact. Each phase is independently deployable." />
        <PhaseRoadmap />

        {/* Footer */}
        <div style={{ marginTop: 64, padding: '24px 0', borderTop: `1px solid ${T.border}`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: T.faint }}>
            Nexus Retail v2 &middot; Dutchie AI &middot; Design Review by Agent Squad &middot; March 2026
          </p>
          <p style={{ fontSize: 12, color: T.faint, marginTop: 4 }}>
            <a href="#/">Back to Command Center</a>
          </p>
        </div>
      </div>
    </div>
  );
}
