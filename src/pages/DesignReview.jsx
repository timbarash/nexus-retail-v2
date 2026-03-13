import React, { useEffect } from "react";

const DESIGN_REVIEW_CSS = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg-deep: #0D0C0A;
  --bg-card: #1C1B1A;
  --bg-card-alt: #242320;
  --bg-surface: #2E2D2A;
  --border: #38332B;
  --border-subtle: #2E2D2A;
  --text-bright: #F0EDE8;
  --text-normal: #C8C3BA;
  --text-muted: #ADA599;
  --text-faint: #7A7468;
  --green: #00C27C;
  --green-dim: rgba(0,194,124,0.12);
  --blue: #64A8E0;
  --blue-dim: rgba(100,168,224,0.12);
  --amber: #D4A03A;
  --amber-dim: rgba(212,160,58,0.12);
  --purple: #B598E8;
  --purple-dim: rgba(181,152,232,0.12);
  --red: #E87068;
  --red-dim: rgba(232,112,104,0.12);
  --pink: #E880A0;
  --pink-dim: rgba(232,128,160,0.12);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-deep);
  color: var(--text-normal);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* ─── HERO ─── */
.hero {
  text-align: center;
  padding: 80px 0 60px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 60px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--green-dim);
  border: 1px solid rgba(0,194,124,0.2);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--green);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
}
.hero-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.hero h1 {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--green), var(--blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.hero .subtitle {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 32px;
}
.hero-meta {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
.hero-meta .tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-faint);
}
.hero-meta .tag strong { color: var(--text-muted); font-weight: 600; }

/* ─── EXECUTIVE SUMMARY ─── */
.exec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 60px;
}
.exec-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
}
.exec-card .num {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-bright);
  line-height: 1;
  margin-bottom: 6px;
}
.exec-card .label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-faint);
}

/* ─── SECTIONS ─── */
.section {
  margin-bottom: 64px;
}
.section-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.section-num {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--green);
  margin-bottom: 8px;
}
.section-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-bright);
  line-height: 1.2;
  margin-bottom: 8px;
}
.section-desc {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 700px;
}

/* ─── RECOMMENDATION CARDS ─── */
.rec-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
}
.rec-card .rec-num {
  position: absolute;
  top: -12px;
  left: 24px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.rec-num.green { background: var(--green); }
.rec-num.blue { background: var(--blue); }
.rec-num.amber { background: var(--amber); }
.rec-num.purple { background: var(--purple); }
.rec-num.red { background: var(--red); }
.rec-num.pink { background: var(--pink); }

.rec-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-bright);
  margin-bottom: 4px;
}
.rec-card .rec-subtitle {
  font-size: 13px;
  color: var(--text-faint);
  margin-bottom: 16px;
}
.rec-card p, .rec-card li {
  font-size: 14px;
  color: var(--text-normal);
  line-height: 1.7;
}
.rec-card ul {
  list-style: none;
  margin: 12px 0;
}
.rec-card ul li {
  padding-left: 20px;
  position: relative;
  margin-bottom: 6px;
}
.rec-card ul li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--green);
  font-weight: 600;
}

/* ─── IMPACT BADGES ─── */
.impact {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 100px;
  margin-left: 12px;
  vertical-align: middle;
}
.impact.critical { background: var(--red-dim); color: var(--red); border: 1px solid rgba(232,112,104,0.2); }
.impact.high { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(212,160,58,0.2); }
.impact.medium { background: var(--blue-dim); color: var(--blue); border: 1px solid rgba(100,168,224,0.2); }
.impact.low { background: var(--purple-dim); color: var(--purple); border: 1px solid rgba(181,152,232,0.2); }

/* ─── SOURCE BADGES ─── */
.source-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.source-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid;
}
.source-badge.pmm { background: var(--green-dim); color: var(--green); border-color: rgba(0,194,124,0.2); }
.source-badge.design { background: var(--blue-dim); color: var(--blue); border-color: rgba(100,168,224,0.2); }
.source-badge.ops { background: var(--amber-dim); color: var(--amber); border-color: rgba(212,160,58,0.2); }
.source-badge.finance { background: var(--purple-dim); color: var(--purple); border-color: rgba(181,152,232,0.2); }
.source-badge.architect { background: var(--pink-dim); color: var(--pink); border-color: rgba(232,152,188,0.2); }

/* ─── BEFORE / AFTER MOCKUPS ─── */
.mockup-container {
  margin: 24px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 700px) {
  .mockup-container { grid-template-columns: 1fr; }
}
.mockup-panel {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  transition: box-shadow 0.3s;
}
.mockup-panel:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
.mockup-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mockup-label.before {
  background: rgba(232,112,104,0.08);
  color: var(--red);
  border-bottom: 1px solid rgba(232,112,104,0.15);
}
.mockup-label.after {
  background: rgba(0,194,124,0.08);
  color: var(--green);
  border-bottom: 1px solid rgba(0,194,124,0.15);
}
.mockup-body {
  background: linear-gradient(180deg, #141312 0%, #0F0E0D 100%);
  padding: 20px 24px 24px;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-muted);
  white-space: pre;
  overflow-x: auto;
  min-height: 220px;
}
.mockup-body .hl-green { color: var(--green); text-shadow: 0 0 8px rgba(0,194,124,0.2); }
.mockup-body .hl-blue { color: var(--blue); text-shadow: 0 0 8px rgba(100,168,224,0.15); }
.mockup-body .hl-amber { color: var(--amber); text-shadow: 0 0 8px rgba(212,160,58,0.15); }
.mockup-body .hl-red { color: var(--red); text-shadow: 0 0 8px rgba(232,112,104,0.2); }
.mockup-body .hl-purple { color: var(--purple); text-shadow: 0 0 8px rgba(181,152,232,0.15); }
.mockup-body .hl-bright { color: var(--text-bright); font-weight: 600; }
.mockup-body .hl-dim { color: var(--text-faint); }
.mockup-body .hl-pink { color: var(--pink); text-shadow: 0 0 8px rgba(232,128,160,0.15); }

/* ─── FULL-WIDTH MOCKUP ─── */
.mockup-full {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.mockup-full .mockup-body {
  min-height: 260px;
}

/* ─── PRIORITY TABLE ─── */
.priority-table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 13px;
}
.priority-table th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}
.priority-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-normal);
  vertical-align: top;
}
.priority-table tr:nth-child(even) td {
  background: rgba(255,255,255,0.015);
}
.priority-table .phase {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
.phase.p1 { background: var(--green-dim); color: var(--green); }
.phase.p2 { background: var(--blue-dim); color: var(--blue); }
.phase.p3 { background: var(--amber-dim); color: var(--amber); }

/* ─── TOC ─── */
.toc {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 60px;
}
.toc h2 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-bright);
  margin-bottom: 16px;
}
.toc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 32px;
}
@media (max-width: 600px) {
  .toc-grid { grid-template-columns: 1fr; }
}
.toc a {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 14px;
  padding: 6px 0;
  transition: color 0.15s;
}
.toc a:hover { color: var(--text-bright); }
.toc a .toc-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

/* ─── DIVIDER ─── */
.divider {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 64px 0;
}

/* ─── CALLOUT ─── */
.callout {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--green);
  border-radius: 8px;
  padding: 16px 20px;
  margin: 20px 0;
  font-size: 13px;
  color: var(--text-muted);
}
.callout strong { color: var(--text-bright); }
.callout.warn { border-left-color: var(--amber); }
.callout.info { border-left-color: var(--blue); }

/* ─── FOOTER ─── */
.report-footer {
  text-align: center;
  padding: 40px 0;
  border-top: 1px solid var(--border);
  margin-top: 60px;
}
.report-footer p {
  font-size: 13px;
  color: var(--text-faint);
}
.report-footer .logo {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--green), var(--blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

/* ─── AGENT CONTRIBUTORS ─── */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 56px;
}
@media (max-width: 900px) { .agents-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 800px) { .agents-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .agents-grid { grid-template-columns: 1fr; } }
.agent-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px 16px;
  text-align: center;
  transition: transform 0.25s, box-shadow 0.25s;
}
.agent-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.agent-card.c-green  { border-top: 2px solid var(--green); }
.agent-card.c-blue   { border-top: 2px solid var(--blue); }
.agent-card.c-amber  { border-top: 2px solid var(--amber); }
.agent-card.c-purple { border-top: 2px solid var(--purple); }
.agent-card.c-pink   { border-top: 2px solid var(--pink); }
.agent-icon {
  width: 56px; height: 56px; border-radius: 50%;
  margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;
  font-size: 24px;
}
.c-green  .agent-icon { background: var(--green-dim); }
.c-blue   .agent-icon { background: var(--blue-dim); }
.c-amber  .agent-icon { background: var(--amber-dim); }
.c-purple .agent-icon { background: var(--purple-dim); }
.c-pink   .agent-icon { background: var(--pink-dim); }
.agent-name { font-size: 14px; font-weight: 700; color: var(--text-bright); margin-bottom: 4px; }
.agent-role {
  display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; padding: 2px 8px; border-radius: 100px; margin-bottom: 10px;
}
.c-green  .agent-role { background: var(--green-dim); color: var(--green); }
.c-blue   .agent-role { background: var(--blue-dim); color: var(--blue); }
.c-amber  .agent-role { background: var(--amber-dim); color: var(--amber); }
.c-purple .agent-role { background: var(--purple-dim); color: var(--purple); }
.c-pink   .agent-role { background: var(--pink-dim); color: var(--pink); }
.agent-desc { font-size: 12px; color: var(--text-muted); line-height: 1.6; }

/* ─── OPERATOR QUOTES ─── */
.op-quote {
  background: linear-gradient(135deg, rgba(28,27,26,0.8), rgba(36,35,32,0.5));
  border: 1px solid var(--border);
  border-left: 3px solid var(--amber);
  border-radius: 10px;
  padding: 18px 22px;
  margin: 24px 0;
  font-size: 14px;
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.7;
}
.op-quote .attr { font-style: normal; font-weight: 600; color: var(--text-faint); display: block; margin-top: 8px; font-size: 12px; }

/* ─── HERO GLOW ─── */
.hero { position: relative; }
.hero::before {
  content: '';
  position: absolute;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(0,194,124,0.06) 0%, transparent 70%);
  pointer-events: none;
}

/* ─── GLASS CARDS ─── */
.rec-card {
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.rec-card:hover { border-color: rgba(56,51,43,0.9); box-shadow: 0 8px 32px rgba(0,0,0,0.3); transform: translateY(-2px); }

/* ─── SECTION GRADIENT LINE ─── */
.section-header { border-bottom: none; position: relative; }
.section-header::after {
  content: '';
  display: block;
  height: 2px;
  margin-top: 20px;
  border-radius: 1px;
  background: linear-gradient(90deg, var(--green) 0%, var(--blue) 40%, transparent 100%);
  opacity: 0.4;
}

/* ─── MOCKUP FULL-WIDTH STACKED ─── */
.mockup-stacked {
  margin: 24px 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* ─── DIVIDER UPGRADE ─── */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}

/* ─── READING PROGRESS BAR ─── */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--green), var(--blue));
  z-index: 10001;
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
  width: 0%;
}

/* ─── STICKY NAV ─── */
.sticky-nav {
  position: fixed;
  top: 3px;
  left: 0;
  right: 0;
  z-index: 10000;
  background: rgba(13,12,10,0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}
.sticky-nav.visible { transform: translateY(0); }
.sticky-nav .nav-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-bright);
  white-space: nowrap;
}
.sticky-nav .nav-links {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.sticky-nav .nav-links::-webkit-scrollbar { display: none; }
.sticky-nav .nav-link {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-faint);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  transition: color 0.15s, background 0.15s;
}
.sticky-nav .nav-link:hover { color: var(--text-bright); background: var(--bg-surface); }

/* ─── PART DIVIDER ─── */
.part-divider {
  text-align: center;
  padding: 56px 0;
  margin: 64px 0;
  position: relative;
}
.part-divider::before, .part-divider::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}
.part-divider::before { top: 0; }
.part-divider::after { bottom: 0; }
.part-divider .part-num {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-faint);
  margin-bottom: 12px;
}
.part-divider .part-title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--green), var(--blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}
.part-divider .part-desc {
  font-size: 14px;
  color: var(--text-muted);
}

/* ─── SCROLL REVEAL ─── */
.section, .toc, .part-divider, .agents-grid {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.section.visible, .toc.visible, .part-divider.visible, .agents-grid.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ─── TOC HOVER UPGRADE ─── */
.toc a {
  padding: 8px 12px;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s, transform 0.15s;
}
.toc a:hover {
  background: var(--bg-surface);
  transform: translateX(4px);
}
.toc a .toc-num { transition: transform 0.2s; }
.toc a:hover .toc-num { transform: scale(1.15); }

/* ─── EXEC CARD HOVER ─── */
.exec-card {
  transition: transform 0.25s, box-shadow 0.25s;
}
.exec-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
}

/* ─── IMPACT/SOURCE HOVER ─── */
.impact { transition: transform 0.15s; cursor: default; }
.impact:hover { transform: scale(1.05); }
.source-badge { transition: transform 0.15s, filter 0.15s; cursor: default; }
.source-badge:hover { transform: translateY(-1px); filter: brightness(1.2); }

/* ─── OP-QUOTE HOVER ─── */
.op-quote { transition: border-left-width 0.2s, padding-left 0.2s; }
.op-quote:hover { border-left-width: 5px; padding-left: 20px; }

/* ─── CTA BUTTON ─── */
.cta-btn {
  display: inline-block;
  padding: 14px 36px;
  background: var(--green);
  color: #0D0C0A;
  font-weight: 700;
  font-size: 15px;
  border-radius: 10px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,194,124,0.3);
}

/* ─── MOBILE RESPONSIVE ─── */
@media (max-width: 600px) {
  .container { padding: 24px 16px 60px; }
  .hero { padding: 48px 0 40px; }
  .hero h1 { font-size: 32px; }
  .hero .subtitle { font-size: 15px; }
  .exec-card .num { font-size: 24px; }
  .section-title { font-size: 24px; }
  .rec-card { padding: 20px 16px; border-radius: 12px; }
  .rec-card h3 { font-size: 17px; }
  .mockup-body { font-size: 10px; line-height: 1.5; padding: 12px 10px; }
  .priority-table { display: block; overflow-x: auto; }
  .op-quote { padding: 14px 16px; font-size: 13px; }
  .sticky-nav { display: none; }
  .part-divider .part-title { font-size: 22px; }
}
@media (max-width: 400px) {
  .hero h1 { font-size: 26px; }
  .exec-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .mockup-body { font-size: 9px; }
}`;

const DESIGN_REVIEW_HTML = `
<div class="progress-bar"></div>
<div class="sticky-nav">
  <span class="nav-title">Nexus Blueprint</span>
  <div class="nav-links">
    <a class="nav-link" href="#portal-health">Health</a>
    <a class="nav-link" href="#dtch-layout">Layout</a>
    <a class="nav-link" href="#dtch-spaces">Spaces</a>
    <a class="nav-link" href="#dtch-alerts">Alerts</a>
    <a class="nav-link" href="#portal-support">Support</a>
    <a class="nav-link" href="#portal-billing">Billing</a>
    <a class="nav-link" href="#dtch-integrations">POS</a>
    <a class="nav-link" href="#dtch-cards">Cards</a>
    <a class="nav-link" href="#portal-adoption">Adoption</a>
    <a class="nav-link" href="#dtch-commands">Cmds</a>
    <a class="nav-link" href="#roadmap">Roadmap</a>
    <a class="nav-link" href="#internal-intel">Internal</a>
    <a class="nav-link" href="#ideas-beyond">Ideas</a>
  </div>
</div>
<div class="container">

<!-- ════════════════════════════════════════ HERO ════════════════════════════════════════ -->
<section class="hero">
  <div class="hero-badge"><span class="dot"></span> Operator Intelligence Blueprint</div>
  <h1>Dutchie Nexus<br>Every Decision, One Screen</h1>
  <p class="subtitle">26 upgrades that cut daily busywork in half and make Nexus the only screen your team needs open all day.</p>
  <div class="hero-meta">
    <span class="tag"><strong>5</strong> Expert Agents</span>
    <span class="tag"><strong>36</strong> Recommendations</span>
    <span class="tag"><strong>7</strong> Modules</span>
    <span class="tag"><strong>3</strong> Phases</span>
    <span class="tag">March 2026</span>
  </div>
</section>

<!-- ════════════════════════════════════════ EXEC SUMMARY ═══════════════════════════════ -->
<div class="exec-grid">
  <div class="exec-card"><div class="num" style="color:var(--green)">5</div><div class="label">Expert Agents</div></div>
  <div class="exec-card"><div class="num" style="color:var(--blue)">36</div><div class="label">Recommendations</div></div>
  <div class="exec-card"><div class="num" style="color:var(--amber)">7</div><div class="label">Modules Reviewed</div></div>
  <div class="exec-card"><div class="num" style="color:var(--purple)">22</div><div class="label">UI Mockups</div></div>
  <div class="exec-card"><div class="num" style="color:var(--pink)">3</div><div class="label">Phases</div></div>
</div>

<!-- ════════════════════════════ AGENT CONTRIBUTORS ════════════════════════════════ -->
<div style="margin-bottom:16px;">
  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-faint);margin-bottom:16px;">Expert Agent Panel</div>
  <div class="agents-grid">
    <div class="agent-card c-green">
      <div class="agent-icon">&#x1F4CA;</div>
      <div class="agent-name">PMM Agent</div>
      <div class="agent-role">Go-to-Market</div>
      <div class="agent-desc">Market positioning, competitive analysis, messaging, and operator adoption strategy.</div>
    </div>
    <div class="agent-card c-blue">
      <div class="agent-icon">&#x1F3A8;</div>
      <div class="agent-name">Design Agent</div>
      <div class="agent-role">UX / UI</div>
      <div class="agent-desc">Information architecture, interaction patterns, visual hierarchy, and progressive disclosure.</div>
    </div>
    <div class="agent-card c-amber">
      <div class="agent-icon">&#x1F3EA;</div>
      <div class="agent-name">Cannabis Ops</div>
      <div class="agent-role">Operations</div>
      <div class="agent-desc">Dispensary floor workflows, METRC compliance, cash handling, and shift operations across 7 states.</div>
    </div>
    <div class="agent-card c-purple">
      <div class="agent-icon">&#x1F4B0;</div>
      <div class="agent-name">Finance Agent</div>
      <div class="agent-role">Billing &amp; 280E</div>
      <div class="agent-desc">280E tax optimization, billing intelligence, cost allocation, and peer benchmarking.</div>
    </div>
    <div class="agent-card c-pink">
      <div class="agent-icon">&#x1F3D7;</div>
      <div class="agent-name">Architect Agent</div>
      <div class="agent-role">Systems &amp; Feasibility</div>
      <div class="agent-desc">Technical feasibility, cross-cutting infrastructure, scalability, integration architecture, and dependency mapping.</div>
    </div>
  </div>
</div>

<!-- ═══════════════════ EXECUTIVE NARRATIVE ═══════════════════ -->
<div class="callout" style="border-left-color:var(--green);font-size:14px;line-height:1.8;margin-bottom:24px;">
  <strong>Executive Summary:</strong> Dutchie Nexus is the operating system for cannabis retail — but today it underdelivers across every surface. The Overview dashboard shows data without insight. Team Chat forces a full-screen modal that blocks multitasking. The Customer Portal leads with tickets instead of health. Inventory lacks predictive intelligence. Compliance is buried. AI capabilities exist but aren't surfaced where operators need them.
  <br><br>
  This review synthesizes recommendations from five expert perspectives (PMM, Design, Cannabis Ops, Finance, and Software Architecture) into a <strong>26-item, three-phase roadmap</strong> spanning 7 platform modules. <strong>Phase 1 is achievable in a single quarter</strong> and addresses the highest-impact gaps: health-first portal, tri-state chat panel, and space restructure.
</div>

<!-- ═══════════════════ DAY IN THE LIFE ═══════════════════ -->
<div class="callout" style="border-left-color:var(--amber);font-size:14px;line-height:1.8;margin-bottom:24px;">
  <strong>Marcus opens his store at 8 AM. Today vs. Tomorrow:</strong><br><br>
  <strong style="color:var(--red);">Today:</strong> Check sales in Nexus dashboard. Open a new tab for METRC compliance. Text his inventory manager on GroupMe about low stock. Open the Dutchie portal to check on a POS bug ticket. Export yesterday's numbers to a Google Sheet his accountant built. Toggle to DTCH — full screen modal covers his dashboard. Give up, call his GM instead.<br><br>
  <strong style="color:var(--green);">Tomorrow with Nexus:</strong> Marcus opens Nexus. His shift handoff card shows 3 open items from last night — safe count verified, one pending METRC transfer, and a POS batch that needs closing. Integration health: all green. The AI alerts rail flags Guru Live Resin at 4 units — he taps "Reorder" and Priya confirms the PO in the chat sidebar without either of them leaving the dashboard. He checks the 280E snapshot, reviews the day's schedule, and walks the floor. <strong>Total time: 15 minutes instead of 45. Zero tabs. Zero texts. Zero spreadsheets.</strong>
</div>

<!-- ═══════════════════ SHIP THIS WEEK ═══════════════════ -->
<div class="callout" style="border-left-color:var(--green);margin-bottom:48px;">
  <strong>Ship This Week — Zero Engineering Required:</strong>
  <ul style="list-style:none;margin-top:12px;">
    <li style="padding-left:20px;position:relative;margin-bottom:8px;font-size:14px;color:var(--text-normal);">
      <span style="position:absolute;left:0;color:var(--green);font-weight:600;">1.</span>
      <strong>Rename 5 DTCH spaces</strong> to plain English (Stock Room → Inventory, Floor Ops → Sales Floor, Guest XP → Customer Issues). Config change only. Instant clarity.
    </li>
    <li style="padding-left:20px;position:relative;margin-bottom:8px;font-size:14px;color:var(--text-normal);">
      <span style="position:absolute;left:0;color:var(--green);font-weight:600;">2.</span>
      <strong>Kill Watercooler and Growth Lab.</strong> Zero messages this week. Removing them signals DTCH is for work, not socializing.
    </li>
    <li style="padding-left:20px;position:relative;margin-bottom:8px;font-size:14px;color:var(--text-normal);">
      <span style="position:absolute;left:0;color:var(--green);font-weight:600;">3.</span>
      <strong>Change Portal landing headline</strong> from "Interactions" to "Account Health." Move ticket list below the fold. Copy + CSS change.
    </li>
    <li style="padding-left:20px;position:relative;margin-bottom:8px;font-size:14px;color:var(--text-normal);">
      <span style="position:absolute;left:0;color:var(--green);font-weight:600;">4.</span>
      <strong>Merge Bridge Feed + Bridge Pulse</strong> into a single "AI Alerts" space. Eliminates the #1 source of operator confusion.
    </li>
  </ul>
</div>

<!-- ════════════════════════════════════════ TOC ════════════════════════════════════════ -->
<div class="toc">
  <h2>Table of Contents</h2>
  <div class="toc-grid">
    <div style="grid-column:1/-1;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-faint);margin:4px 0 -4px;">Part I — Immediate Impact</div>
    <a href="#portal-health"><span class="toc-num" style="background:var(--green)">1</span> Account Health Dashboard</a>
    <a href="#dtch-layout"><span class="toc-num" style="background:var(--blue)">2</span> Tri-State Panel Layout</a>
    <a href="#dtch-spaces"><span class="toc-num" style="background:var(--amber)">3</span> DTCH Space Restructure</a>
    <div style="grid-column:1/-1;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-faint);margin:8px 0 -4px;">Part II — Intelligence Layer</div>
    <a href="#dtch-alerts"><span class="toc-num" style="background:var(--red)">4</span> Alert Tiers &amp; Shift Handoff</a>
    <a href="#portal-support"><span class="toc-num" style="background:var(--purple)">5</span> AI-First Support</a>
    <a href="#portal-billing"><span class="toc-num" style="background:var(--pink)">6</span> Billing Intelligence</a>
    <div style="grid-column:1/-1;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-faint);margin:8px 0 -4px;">Part III — Platform Completeness</div>
    <a href="#dtch-integrations"><span class="toc-num" style="background:var(--green)">7</span> POS &amp; Compliance Integrations</a>
    <a href="#dtch-cards"><span class="toc-num" style="background:var(--blue)">8</span> Layered Card System</a>
    <a href="#portal-adoption"><span class="toc-num" style="background:var(--amber)">9</span> Product Adoption &amp; Benchmarking</a>
    <a href="#dtch-commands"><span class="toc-num" style="background:var(--purple)">10</span> Command Palette &amp; Actions</a>
    <div style="grid-column:1/-1;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-faint);margin:8px 0 -4px;">Roadmap</div>
    <a href="#roadmap"><span class="toc-num" style="background:var(--red)">11</span> Implementation Roadmap</a>
    <div style="grid-column:1/-1;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--text-faint);margin:8px 0 -4px;">Internal &amp; Future</div>
    <a href="#internal-intel"><span class="toc-num" style="background:var(--pink)">12</span> Customer Intelligence (Internal)</a>
    <a href="#ideas-beyond"><span class="toc-num" style="background:var(--purple)">13</span> Ideas Beyond This Prototype</a>
  </div>
</div>

<!-- ═══════════════════ WHY NOW ═══════════════════ -->
<div class="section" style="margin-bottom:40px;">
  <div class="section-header">
    <div class="section-num">Context</div>
    <h2 class="section-title">Why a Full Platform Review, Why Now</h2>
  </div>
  <div class="callout warn">
    <strong>The Core Tension:</strong> Dispensary operators run high-stakes, cash-intensive, compliance-regulated businesses on 12-hour shifts with 50% annual staff turnover. They need a platform that matches the speed and pressure of their floor — not a collection of disconnected modules with inconsistent UX patterns. Today, each Nexus surface (Dashboard, Insights, Inventory, Revenue, Chat, Portal) operates as a silo. Operators context-switch between 4-6 screens to answer one question: <em>"How is my business doing and what should I do next?"</em> The Nexus platform must become a unified operating system, not a feature catalog.
  </div>
  <div class="callout" style="border-left-color:var(--purple);">
    <strong>Dutchie's Moat:</strong> No competitor owns the full stack — POS, ecommerce, payments, compliance, analytics, and team communication in a single platform. The opportunity is <strong>cross-module intelligence</strong> where an inventory alert triggers a reorder recommendation, updates the cash flow projection, and notifies the right team member — all automatically. That connected intelligence is Dutchie's defensible advantage.
  </div>
</div>


<!-- ══════════════════════════════════════════════════════════════════════════════════════ -->

<div class="part-divider">
  <div class="part-num">Part I</div>
  <div class="part-title">Immediate Impact</div>
  <div class="part-desc">Sections 01-03 &middot; The three changes that transform operator experience overnight</div>
</div>

<!-- ─── 01. ACCOUNT HEALTH DASHBOARD ─── -->
<section class="section" id="portal-health">
  <div class="section-header">
    <div class="section-num">Section 01 — Customer Portal</div>
    <h2 class="section-title">Account Health Dashboard</h2>
    <p class="section-desc">Replace the current ticket-first landing page with an Account Health Dashboard that immediately shows operators what matters: their health score, feature adoption, and what needs attention.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num green">9</div>
    <h3>Account Health Score (0-100) <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">All 4 agents: "First thing an operator wants to know — am I in good shape?"</p>
    <p>A composite health score replacing the current "Open Tickets" KPI row. Components:</p>
    <ul>
      <li><strong>POS Uptime</strong> (25% weight) — system availability over 30 days</li>
      <li><strong>Ecommerce Conversion</strong> (25%) — online menu → checkout completion rate</li>
      <li><strong>Payment Volume</strong> (25%) — transactions processed vs capacity</li>
      <li><strong>Support Velocity</strong> (25%) — open ticket age and resolution time</li>
    </ul>
    <div class="source-row">
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
      <span class="source-badge design">Design</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num green">10</div>
    <h3>Integration Status + Feature Adoption <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">Ops agent: "The #1 thing operators want when they open the portal is: IS MY STUFF WORKING?"</p>
    <p>Replace the ticket-first landing with a health-first home tab:</p>
    <ul>
      <li><strong>Integration Status:</strong> POS online/offline, ecommerce sync, payment processing, METRC connection — all at a glance</li>
      <li><strong>Health Score:</strong> Weighted score across all systems (POS uptime, ecom conversion, payment success, support velocity)</li>
      <li><strong>Feature Adoption:</strong> Visual bar chart showing which Dutchie features the operator is using and which are available to turn on</li>
      <li><strong>Quick Actions:</strong> "Turn on Loyalty," "Schedule Training," "View What's New" — direct paths from the home tab</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge design">Design</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — Ticket-First Portal (trains operators to associate Dutchie with problems)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Dutchie Customer Portal</span>                                <span class="hl-dim">👤 Marcus Chen</span>  <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">[Interactions]</span>    <span class="hl-dim">[Billing]</span>    <span class="hl-dim">[+ New Request]</span>                       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>    <span class="hl-red">3</span>     <span class="hl-dim">│  │</span>    <span class="hl-red">2</span>     <span class="hl-dim">│  │</span>    <span class="hl-amber">5</span>     <span class="hl-dim">│  │</span>    <span class="hl-dim">1</span>     <span class="hl-dim">│</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>   <span class="hl-dim">Open</span>   <span class="hl-dim">│  │</span>   <span class="hl-dim">Bug</span>    <span class="hl-dim">│  │</span>  <span class="hl-dim">Feature</span>  <span class="hl-dim">│  │</span>   <span class="hl-dim">Demo</span>   <span class="hl-dim">│</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">Tickets</span> <span class="hl-dim">│  │</span>  <span class="hl-dim">Reports</span> <span class="hl-dim">│  │</span>   <span class="hl-dim">Reqs</span>   <span class="hl-dim">│  │</span>   <span class="hl-dim">Reqs</span>   <span class="hl-dim">│</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└──────────┘  └──────────┘  └──────────┘  └──────────┘</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Recent Interactions</span>                                                   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-red">●</span> TKT-2024  POS freezes during batch close       <span class="hl-red">Open 3d</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-red">●</span> BUG-442   Menu sync delay on weekends          <span class="hl-red">Open 5d</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">●</span> FEAT-891  Add loyalty tier support             <span class="hl-amber">Pending</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">●</span> FEAT-892  Kiosk mode for patient check-in      <span class="hl-amber">Planned</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-green">●</span> BUG-389   Discount rounding issue              <span class="hl-green">Resolved</span>    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ First thing operator sees = open tickets and bugs</span>                   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No health signal — operator has no idea if things are working</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No value story — zero evidence their subscription is worthwhile</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No self-service — every problem requires filing a ticket</span>            <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Health-First Portal (partner, not vendor)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Dutchie Customer Portal</span>                                <span class="hl-dim">👤 Marcus Chen</span>  <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">[Home]</span>    <span class="hl-dim">[Support]</span>    <span class="hl-dim">[Account]</span>    <span class="hl-dim">[Product]</span>                      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Account Health</span>                             <span class="hl-bright">Integration Status</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌───────────────────────────────────┐</span>      <span class="hl-dim">┌──────────────────────┐</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                   <span class="hl-dim">│</span>      <span class="hl-dim">│</span>                      <span class="hl-dim">│</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>   <span class="hl-green">████████████████████</span><span class="hl-dim">░░░</span> <span class="hl-green">87</span>/100   <span class="hl-dim">│</span>      <span class="hl-dim">│</span>  <span class="hl-green">●</span> POS   <span class="hl-green">Online</span>     <span class="hl-dim">│</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                   <span class="hl-dim">│</span>      <span class="hl-dim">│</span>  <span class="hl-green">●</span> Ecom  <span class="hl-green">Synced</span>     <span class="hl-dim">│</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">POS</span>  <span class="hl-green">99.9%</span> <span class="hl-dim">·</span> <span class="hl-dim">Ecom</span> <span class="hl-amber">72%</span> <span class="hl-dim">·</span> <span class="hl-dim">Pay</span> <span class="hl-green">94%</span> <span class="hl-dim">│</span>      <span class="hl-dim">│</span>  <span class="hl-green">●</span> Pay   <span class="hl-green">100%</span>      <span class="hl-dim">│</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">Support</span> <span class="hl-green">91%</span>                      <span class="hl-dim">│</span>      <span class="hl-dim">│</span>  <span class="hl-green">●</span> METRC <span class="hl-green">2m ago</span>     <span class="hl-dim">│</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                   <span class="hl-dim">│</span>      <span class="hl-dim">│</span>                      <span class="hl-dim">│</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└───────────────────────────────────┘</span>      <span class="hl-dim">└──────────────────────┘</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Feature Adoption</span>  <span class="hl-dim">·</span>  <span class="hl-green">6</span><span class="hl-dim">/</span><span class="hl-bright">9</span> <span class="hl-dim">features active</span>                              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">█████████████████████████████████████████</span> POS       <span class="hl-green">100%</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">████████████████████████████████</span><span class="hl-dim">░░░░░░░░░</span> Ecom       <span class="hl-green">82%</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-amber">████████████████</span><span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░</span> Loyalty    <span class="hl-amber">42%</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Delivery   <span class="hl-dim"> 0%</span> <span class="hl-blue">[On]</span> <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">[View all features →]</span>                                        <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Leads with health score — operator sees their business is healthy</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Integration status answers "is my stuff working?" at a glance</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Feature adoption shows what they're using and what's available</span>      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Four-tab architecture maps to operator mental models</span>                <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "Every time I open the Dutchie portal, the first thing I see is my open bugs. It feels like Dutchie is broken. I want to see that my business is healthy and that I'm getting my money's worth."
    <span class="attr">— Owner, 2-location Arizona dispensary</span>
  </div>
</section>

<!-- ─── 02. TRI-STATE PANEL LAYOUT ─── -->
<!-- ─── 2. TRI-STATE PANEL ─── -->
<section class="section" id="dtch-layout">
  <div class="section-header">
    <div class="section-num">Section 02 — DTCH Team Chat</div>
    <h2 class="section-title">Tri-State Panel Layout</h2>
    <p class="section-desc">Replace the current full-screen modal with a three-state panel: collapsed icon rail, sidebar, and full-width view. Users stay in context while chatting.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num blue">2</div>
    <h3>Three-State Progressive Disclosure <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">Design agent primary recommendation — backed by Ops "nobody wants a full-screen takeover" feedback</p>
    <p>The current DTCH panel is a full-screen modal overlay that completely removes the user from their workflow. Budtenders on the floor need to glance at messages while working in POS. Replace with a right-anchored panel that has three states:</p>
    <ul>
      <li><strong>Rail (48px):</strong> Icon strip showing space icons with unread badges. Always visible, zero context-switch cost.</li>
      <li><strong>Sidebar (320px):</strong> Click a rail icon to expand. Shows messages in current space. Click again or ESC to collapse back to rail.</li>
      <li><strong>Full (640px+):</strong> Double-click or drag to expand fully. Shows message list + detail panel side-by-side. For deep investigation.</li>
    </ul>
    <div class="source-row">
      <span class="source-badge design">Design</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — Full-Screen Modal Takeover</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">│</span>  <span class="hl-bright">DTCH Team Chat</span>                              <span class="hl-dim">🔍  🔔  ✕</span>  <span class="hl-red">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">│</span> <span class="hl-dim">┌──────────┬─────────────────────────────────────────┐</span> <span class="hl-red">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">│</span> <span class="hl-dim">│ Spaces   │ Marcus: Has anyone counted Reg 2?      │</span> <span class="hl-red">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">│</span> <span class="hl-dim">│ Floor Ops│ Priya: Guru Live Resin is at 4 units   │</span> <span class="hl-red">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">│</span> <span class="hl-dim">│ Stock Rm │ Jordan: Customer asking about edibles  │</span> <span class="hl-red">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">│</span> <span class="hl-dim">│ Guest XP │                                         │</span> <span class="hl-red">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">│</span> <span class="hl-dim">│          │ [________________________________]     │</span> <span class="hl-red">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">▓▓▓▓▓▓▓▓▓▓ NEXUS DASHBOARD COMPLETELY HIDDEN ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">▓▓▓  Sales: ???   Sentiment: ???   Inventory: ???   ▓▓▓▓▓▓▓▓▓▓</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">▓▓▓  Can't see KPIs while chatting with team       ▓▓▓▓▓▓▓▓▓▓</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-red">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Tri-State Right Panel (Rail / Sidebar / Full)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-bright">Nexus Dashboard</span> <span class="hl-dim">(fully visible)</span>               <span class="hl-dim">│</span><span class="hl-green">RAIL</span><span class="hl-dim">│</span> <span class="hl-bright">SIDEBAR</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                <span class="hl-dim">│</span>    <span class="hl-dim">│</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">┌───────────┐ ┌───────────┐ ┌───────────┐</span>  <span class="hl-dim">│</span><span class="hl-green">🛒</span><span class="hl-red">2</span><span class="hl-dim">│</span> <span class="hl-bright">Sales Floor</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">│</span> <span class="hl-bright">Revenue</span>   <span class="hl-dim">│ │</span> <span class="hl-bright">Sentiment</span> <span class="hl-dim">│ │</span> <span class="hl-bright">Inventory</span> <span class="hl-dim">│</span>  <span class="hl-dim">│</span><span class="hl-green">📦</span><span class="hl-green">3</span><span class="hl-dim">│</span> <span class="hl-dim">───────────</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">│</span> <span class="hl-green">$454.7K</span>   <span class="hl-dim">│ │</span> <span class="hl-green">4.2/5</span>     <span class="hl-dim">│ │</span> <span class="hl-green">94.2%</span>     <span class="hl-dim">│</span>  <span class="hl-dim">│</span><span class="hl-amber">💵</span><span class="hl-red">1</span><span class="hl-dim">│</span> Marcus:        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">│</span> <span class="hl-dim">+8% vs LW</span> <span class="hl-dim">│ │</span> <span class="hl-dim">+0.3 pts</span>  <span class="hl-dim">│ │</span> <span class="hl-dim">in-stock</span>  <span class="hl-dim">│</span>  <span class="hl-dim">│</span><span class="hl-dim">😊 </span><span class="hl-dim">│</span> <span class="hl-dim">Guru Resin at</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">└───────────┘ └───────────┘ └───────────┘</span>  <span class="hl-dim">│</span><span class="hl-dim">📋</span><span class="hl-amber">2</span><span class="hl-dim">│</span> <span class="hl-dim">4 units. Need</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                <span class="hl-dim">│</span><span class="hl-dim">🤖</span><span class="hl-green">5</span><span class="hl-dim">│</span> <span class="hl-dim">to reorder</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">┌────────────────────────────────────────┐</span>  <span class="hl-dim">│</span>    <span class="hl-dim">│</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">│ Sales Chart  ▁▂▃▄▅▆▇█▇▅▃▂▃▅▆▇█▇▆▅▄</span>  <span class="hl-dim">│</span>  <span class="hl-dim">│</span>    <span class="hl-dim">│</span> Priya:         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">│ Traffic      ▂▃▄▅▆▅▄▃▂▃▅▆▇▆▅▄▃▂▃▄</span>  <span class="hl-dim">│</span>  <span class="hl-dim">│</span>    <span class="hl-dim">│</span> <span class="hl-dim">On it, placing</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">└────────────────────────────────────────┘</span>  <span class="hl-dim">│</span>    <span class="hl-dim">│</span> <span class="hl-dim">PO now.</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                <span class="hl-dim">│</span>    <span class="hl-dim">│</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-dim">Location Performance  ·  Top Categories</span>     <span class="hl-dim">│</span>    <span class="hl-dim">│</span> <span class="hl-dim">[__________]</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                <span class="hl-dim">│</span>    <span class="hl-dim">│</span> <span class="hl-dim">Message #floor</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span>
 <span class="hl-dim">             Dashboard Content                Rail  Sidebar (320px)</span></div>
    </div>
  </div>

  <div class="op-quote">
    "When I open DTCH, it takes over my whole screen and I lose my sales dashboard. I'm literally choosing between communicating with my team and seeing my numbers. So I just text them instead."
    <span class="attr">— Owner-Operator, single store, Oklahoma</span>
  </div>
</section>

<!-- ─── 03. DTCH SPACE RESTRUCTURE ─── -->
<section class="section" id="dtch-spaces">
  <div class="section-header">
    <div class="section-num">Section 03 — DTCH Team Chat</div>
    <h2 class="section-title">Space Restructure</h2>
    <p class="section-desc">Reorganize chat spaces around actual dispensary workflows. Kill dead spaces, add mission-critical ones, rename jargon to operator language.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num green">1</div>
    <h3>Restructure Spaces for Real Workflows <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">All 4 agents agreed: current spaces don't match how dispensary teams actually work</p>
    <p>The current 8 spaces mix abstract concepts ("Growth Lab", "Pulse") with operational needs. Budtenders told the Ops agent they only use 3-4 spaces max. Restructure into clear operational zones:</p>
    <ul>
      <li><strong>Keep &amp; Rename:</strong> Stock Room → Inventory, Floor Ops → Sales Floor, Guest XP → Customer Issues</li>
      <li><strong>Add:</strong> 💵 Cash Desk (cash mgmt, safe counts, armored car), 📋 Compliance (METRC, audits, regulatory), 🏪 Manager's Office (private ops, P&amp;L, staffing), 🤝 Vendor Alley (supplier comms, purchase orders)</li>
      <li><strong>Kill:</strong> Watercooler (no one uses social chat at work), merge Bridge Feed + Pulse → single "AI Alerts" space</li>
      <li><strong>Add MSO support:</strong> Location scoping — filter all spaces by store for multi-location operators</li>
    </ul>
    <div class="source-row">
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge design">Design</span>
      <span class="source-badge ops">Ops</span>
      <span class="source-badge finance">Finance</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — Current DTCH Sidebar (8 spaces, 3 dead)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">DTCH</span> <span class="hl-green">●</span>                                                                 <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">SPACES</span>  <span class="hl-dim">Hub + Ops</span>                                                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-green">▌</span> 📦 Stock Room           <span class="hl-green">3</span>   <span class="hl-dim">Inventory questions, reorder requests</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     🏪 Floor Ops                <span class="hl-dim">General floor chatter</span>                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     😊 Guest XP             <span class="hl-green">1</span>   <span class="hl-dim">Customer complaints and feedback</span>          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     📈 Growth Lab               <span class="hl-dim">Marketing ideas</span>   <span class="hl-red">← nobody posts here</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     ☕ Watercooler              <span class="hl-dim">Social chat</span>       <span class="hl-red">← 0 messages this week</span><span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">AGENTS</span>  <span class="hl-dim">Bridge AI</span>                                                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     🤖 Bridge Feed          <span class="hl-green">5</span>   <span class="hl-dim">AI-generated alerts</span>  <span class="hl-red">← redundant w/ Pulse</span><span class="hl-dim">║</span>
<span class="hl-dim">║</span>     🧠 Bridge Pulse              <span class="hl-dim">AI analytics feed</span>   <span class="hl-red">← same as Feed?</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     💡 Bridge Assist             <span class="hl-dim">Ask AI anything</span>                          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-blue">TEAM</span>  <span class="hl-dim">Members</span>                                                       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     <span class="hl-green">●</span> Marcus Chen (GM)        <span class="hl-dim">  🏪 Floor Ops &middot; Active 2m ago</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     <span class="hl-green">●</span> Priya Patel (Inv Mgr)   <span class="hl-dim">  📦 Stock Room &middot; Active 5m ago</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     <span class="hl-amber">●</span> Jordan Lee (Budtender)  <span class="hl-dim">  🏪 Floor Ops &middot; Idle 45m</span>             <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     <span class="hl-dim">●</span> Alex Rivera (Compliance)<span class="hl-dim">  ☕ Watercooler &middot; Offline</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ 8 spaces — only 3 get used (Stock Room, Floor Ops, Guest XP)</span>         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No cash management, compliance, or vendor spaces</span>                     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Jargon names — budtenders don't know what "Growth Lab" means</span>         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No location scoping for MSOs — all 39 stores in one feed</span>             <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Operator-First Spaces (9 spaces, all operational)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">DTCH</span> <span class="hl-green">●</span>  <span class="hl-dim">Collinsville, IL ▾</span>    <span class="hl-green">← location scoped for MSOs</span>              <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">OPS</span>  <span class="hl-dim">Daily Operations</span>                                                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>   <span class="hl-green">▌</span> 🛒 Sales Floor          <span class="hl-green">2</span>   <span class="hl-dim">POS issues, floor comms, queue mgmt</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     📦 Inventory            <span class="hl-green">3</span>   <span class="hl-dim">Reorders, stock counts, receiving</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     💵 Cash Desk            <span class="hl-red">1</span>   <span class="hl-dim">Safe counts, drops, armored car</span>  <span class="hl-green">NEW</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     😊 Customer Issues          <span class="hl-dim">Complaints, returns, escalations</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">MANAGEMENT</span>  <span class="hl-dim">Leadership &amp; Back-Office</span>                                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     📋 Compliance           <span class="hl-amber">2</span>   <span class="hl-dim">METRC, audits, license tracking</span>  <span class="hl-green">NEW</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     🏢 Manager's Office         <span class="hl-dim">P&amp;L, staffing, private ops</span>       <span class="hl-green">NEW</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     📈 Marketing                <span class="hl-dim">Promos, loyalty, campaigns</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     🤝 Vendor Alley             <span class="hl-dim">Supplier comms, PO tracking</span>      <span class="hl-green">NEW</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">AI</span>  <span class="hl-dim">Bridge Intelligence</span>                                               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     🤖 AI Alerts            <span class="hl-green">5</span>   <span class="hl-dim">Merged Feed + Pulse — one stream</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     💡 Bridge Assist             <span class="hl-dim">Ask AI anything</span>                         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-blue">TEAM</span>  <span class="hl-dim">Collinsville Staff</span>                                              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     <span class="hl-green">●</span> Marcus Chen (GM)        <span class="hl-dim">  🛒 Sales Floor &middot; Active now</span>          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>     <span class="hl-green">●</span> Priya Patel (Inv Mgr)   <span class="hl-dim">  📦 Inventory &middot; Active 3m ago</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ 9 spaces — every one maps to a real daily workflow</span>                   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Plain-English names budtenders instantly understand</span>                  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Location scoping — each store sees only their messages</span>               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Cash, Compliance, Vendor spaces fill critical operational gaps</span>       <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "I have eight spaces in DTCH and my team uses three of them. Growth Lab? Watercooler? My budtenders don't know what those are. They just DM each other on their phones. I need a channel for cash, a channel for compliance, and a channel for the floor. That's it."
    <span class="attr">— GM, 3-location Illinois MSO</span>
  </div>
</section>

<div class="part-divider">
  <div class="part-num">Part II</div>
  <div class="part-title">Intelligence Layer</div>
  <div class="part-desc">Sections 04-06 &middot; AI-powered alerts, support, and financial intelligence</div>
</div>

<!-- ─── 04. ALERT TIERS &amp; SHIFT HANDOFF ─── -->
<!-- ─── 5. ALERTS & SHIFT HANDOFF ─── -->
<section class="section" id="dtch-alerts">
  <div class="section-header">
    <div class="section-num">Section 04 — DTCH Team Chat</div>
    <h2 class="section-title">Alert Tiers &amp; Shift Handoff</h2>
    <p class="section-desc">Three-tier alert system replaces the single notification bell. Shift handoff protocol ensures nothing falls through the cracks at shift change.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num red">5</div>
    <h3>Three-Tier Alert System <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Ops agent: "A reorder notice and a METRC audit alert should NOT look the same"</p>
    <ul>
      <li><span style="color:var(--red)">■ CRITICAL</span> — Red banner, sound alert, persists until acknowledged. POS down, compliance violation, cash discrepancy, METRC sync failure.</li>
      <li><span style="color:var(--amber)">■ ACTION</span> — Amber badge, no sound, dismissible. Low stock reorder, shift handoff pending, customer complaint escalation.</li>
      <li><span style="color:var(--blue)">■ INFO</span> — Subtle inline, auto-dismiss after read. Daily sales summary, sentiment trend update, team member joined.</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge design">Design</span>
      <span class="source-badge finance">Finance</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num red">6</div>
    <h3>Shift Handoff Protocol <span class="impact high">High</span></h3>
    <p class="rec-subtitle">PMM + Ops: "Biggest operational gap — things get dropped between shifts"</p>
    <p>Add a <code>/handoff</code> command or ⌘K action that generates an AI-powered shift summary:</p>
    <ul>
      <li>Open issues from current shift (unresolved customer complaints, pending reorders)</li>
      <li>Cash status (current safe balance, variance from expected)</li>
      <li>Inventory alerts triggered during shift</li>
      <li>Key metrics vs goals (sales pacing, traffic, basket size)</li>
      <li>Free-text notes from outgoing shift lead</li>
    </ul>
    <div class="source-row">
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — No shift handoff, verbal pass or sticky notes</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Shift Change: 3:00 PM</span>  <span class="hl-dim">Ascend Collinsville</span>                              <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Marcus (outgoing):</span>                                                   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">"Hey Jordan, pretty normal day. Uh, we had a customer complaint</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim"> about a wrong strain... I think. Oh and Guru is low. Also I</span>          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim"> think the armored car is coming at some point? Check the sticky</span>      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim"> note on the safe. Good luck!"</span>                                       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Jordan (incoming):</span>                                                   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">"Wait, what customer? What strain? How low is Guru? What time</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red"> is the armored car? Did we hit goal today?"</span>                         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Verbal handoff = things get dropped every single shift</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No structured format — each GM does it differently</span>                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No accountability — no record of what was communicated</span>             <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — AI-Generated Shift Handoff Card</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-green">🔄 SHIFT HANDOFF</span>  <span class="hl-dim">·</span> <span class="hl-bright">AM → PM</span>  <span class="hl-dim">·</span> <span class="hl-dim">Marcus Chen → Jordan Lee</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span> <span class="hl-dim">Generated 2:58 PM · Ascend Collinsville</span>                                 <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">📊 SHIFT PERFORMANCE</span>                                                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Revenue</span> <span class="hl-green">$18.4K</span>  <span class="hl-dim">·</span>  <span class="hl-dim">Trans</span> <span class="hl-green">204</span>  <span class="hl-dim">·</span>  <span class="hl-dim">Basket</span> <span class="hl-bright">$90</span>  <span class="hl-dim">·</span>  <span class="hl-dim">vs Goal</span> <span class="hl-green">+8%</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-amber">⚠ OPEN ITEMS (3)</span>                                                     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-red">●</span> Customer complaint re: wrong strain — <span class="hl-red">needs callback</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-amber">●</span> Guru Live Resin reorder placed — ETA tomorrow 10am                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-blue">●</span> Armored car pickup scheduled <span class="hl-bright">4:30 PM</span>                              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">💵 CASH STATUS</span>                                                       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    Safe: <span class="hl-green">$24,350</span>  <span class="hl-dim">|</span>  Registers: <span class="hl-bright">$3,200</span>  <span class="hl-dim">|</span>  Variance: <span class="hl-green">$0</span>               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">💬 NOTES FROM MARCUS:</span>                                                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">"New patient flow was heavy — first-timers got 15% discount.</span>          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim"> Flu season = lots of edible requests for sore throat."</span>               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">[✓ Acknowledge Handoff]</span>  <span class="hl-dim">[Add Notes]</span>  <span class="hl-dim">[View Full Shift Report]</span>      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ AI auto-generates from shift activity — zero manual work</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Structured format: metrics, open items, cash, notes</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Incoming shift must "Acknowledge" — nothing falls through</span>          <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "Things fall through the cracks every single shift change. We tried a paper log but nobody fills it out. If Bridge could auto-generate a handoff from what actually happened during the shift — that's gold."
    <span class="attr">— Regional Manager, 6-location Missouri MSO</span>
  </div>
</section>

<!-- ─── 05. AI-FIRST SUPPORT EXPERIENCE ─── -->
<!-- ─── 8. AI-FIRST SUPPORT ─── -->
<section class="section" id="portal-support">
  <div class="section-header">
    <div class="section-num">Section 05 — Customer Portal</div>
    <h2 class="section-title">AI-First Support Experience</h2>
    <p class="section-desc">Replace the ticket-first support model with search-first + KB + smart escalation. Most operators want to self-serve.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num blue">11</div>
    <h3>Search → KB → Escalation Flow <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">Ops agent: "Operators don't want to file a ticket. They want an answer NOW."</p>
    <p>Redesign the support tab around instant resolution:</p>
    <ul>
      <li><strong>Search bar front and center:</strong> "How do I set up loyalty points?" → instant KB article results</li>
      <li><strong>AI-powered answers:</strong> If no exact match, Bridge AI synthesizes an answer from KB + past tickets</li>
      <li><strong>Smart escalation:</strong> Only after search + AI fails, offer ticket creation with pre-filled context from the search</li>
      <li><strong>Integration status dashboard:</strong> POS online/offline, API status, sync lag — the #1 reason operators contact support</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge design">Design</span>
      <span class="source-badge pmm">PMM</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num blue">12</div>
    <h3>Integration Health Dashboard <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">Ops agent: "The #1 thing operators want in a portal is: IS MY STUFF WORKING?"</p>
    <ul>
      <li><strong>POS Status:</strong> Online/offline per register, uptime %, last heartbeat</li>
      <li><strong>Ecommerce Sync:</strong> Menu sync status, last successful sync, items out of sync</li>
      <li><strong>Payment Processing:</strong> Terminal status, transaction success rate, batch close status</li>
      <li><strong>METRC Connection:</strong> Sync lag, last successful report, pending transfers</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge finance">Finance</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — "New Request" button is the only option</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Dutchie Support</span>                                          <span class="hl-dim">👤 Marcus</span>     <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Need help? Submit a request and we'll get back to you.</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-blue">[+ New Request]</span>                                                     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Average response time: 4-6 hours</span>                                     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">← Operator's POS is down. They can't wait 4 hours.</span>                   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">← No way to check: "Is it just me or is everyone down?"</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Only option: file a ticket and wait</span>                                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No self-service search or knowledge base</span>                           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No system status — can't tell if it's a widespread outage</span>          <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Search-first + AI + Integration Health</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-dim">[Home]</span> <span class="hl-blue">[Support]</span> <span class="hl-dim">[Account] [Product]</span>                     <span class="hl-dim">👤 Marcus</span>     <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">🔍</span> <span class="hl-bright">How can we help?</span>                                                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│ Search knowledge base, past tickets, or ask AI...</span>             <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">System Status</span>  <span class="hl-green">All Systems Operational</span>                                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">●</span> <span class="hl-bright">POS</span> <span class="hl-green">99.9%</span>  <span class="hl-dim">·</span>  <span class="hl-green">●</span> <span class="hl-bright">Ecom</span> <span class="hl-green">Synced</span>  <span class="hl-dim">·</span>  <span class="hl-green">●</span> <span class="hl-bright">Pay</span> <span class="hl-green">100%</span>  <span class="hl-dim">·</span>  <span class="hl-green">●</span> <span class="hl-bright">METRC</span> <span class="hl-green">2m</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Quick Links</span>                                                          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    📚 <span class="hl-dim">Setup Guides</span>   🎓 <span class="hl-dim">Training Videos</span>   💬 <span class="hl-dim">Live Chat</span>   🤖 <span class="hl-dim">Ask AI</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Recent Tickets</span> <span class="hl-dim">(3 open)</span>                                              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-amber">●</span> TKT-2024  POS freeze on batch close      <span class="hl-amber">In Progress</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-green">●</span> BUG-442   Menu sync delay               <span class="hl-green">Resolved</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">●</span> FEAT-891  Loyalty tier support           <span class="hl-dim">Planned</span>                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Search + AI resolves 70% of questions without a ticket</span>             <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ System status answers "is it just me?" instantly</span>                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Tickets still exist but are last resort, not first action</span>          <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "My POS went down on a Saturday afternoon and the only option was 'Submit a Request.' I needed to know RIGHT NOW if it was my hardware or a Dutchie outage. I ended up calling three other dispensaries to ask if they were down too."
    <span class="attr">— GM, single-location Washington dispensary</span>
  </div>
</section>

<!-- ─── 06. BILLING INTELLIGENCE ─── -->
<!-- ─── 10. BILLING INTELLIGENCE ─── -->
<section class="section" id="portal-billing">
  <div class="section-header">
    <div class="section-num">Section 06 — Customer Portal</div>
    <h2 class="section-title">Billing Intelligence</h2>
    <p class="section-desc">Transform the billing tab from a static invoice list into intelligent cost analysis with utilization insights and 280E optimization.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">16</div>
    <h3>Usage-Based Billing Nudges <span class="impact medium">Medium</span></h3>
    <p class="rec-subtitle">Finance: "Show operators what they're paying for vs what they're using"</p>
    <ul>
      <li>Each line item shows utilization % alongside cost</li>
      <li>Underutilized features highlighted with "You're paying $X/mo for this but only using Y%"</li>
      <li>Right-size recommendations: "Switch to Tier 1 and save $200/mo" or "Upgrade — you've outgrown this tier"</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">17</div>
    <h3>280E Tax Optimization Report <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Finance: "Every cannabis operator struggles with 280E. Help them."</p>
    <ul>
      <li>Automated COGS allocation report for 280E compliance</li>
      <li>Deductible vs non-deductible expense categorization</li>
      <li>Quarterly tax liability estimate based on current margins</li>
      <li>Export-ready reports for accountants (CSV/PDF)</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">18</div>
    <h3>New Tab Architecture: HOME / SUPPORT / ACCOUNT / PRODUCT <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">Design agent: "Three tabs aren't enough. Four tabs map to operator mental models."</p>
    <ul>
      <li><strong>HOME:</strong> Health dashboard, feature adoption, alerts, quick actions</li>
      <li><strong>SUPPORT:</strong> Search + KB + AI + integration health + tickets</li>
      <li><strong>ACCOUNT:</strong> Billing, invoices, usage analytics, 280E report, subscription management</li>
      <li><strong>PRODUCT:</strong> Feature adoption, peer benchmarks, What's New, Coming Soon, Dutchie University</li>
    </ul>
    <div class="source-row">
      <span class="source-badge design">Design</span>
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — Static invoice list, no cost intelligence</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Billing &amp; Invoices</span>                                       <span class="hl-dim">👤 Marcus</span>     <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Invoices</span>                                                             <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌───────────────┬────────────┬──────────┬──────────────────────┐</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-dim">Date</span>          <span class="hl-dim">│</span> <span class="hl-dim">Invoice #</span>  <span class="hl-dim">│</span> <span class="hl-dim">Amount</span>   <span class="hl-dim">│</span> <span class="hl-dim">Status</span>               <span class="hl-dim">│</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> Mar 1, 2026   <span class="hl-dim">│</span> INV-04821  <span class="hl-dim">│</span> $3,800   <span class="hl-dim">│</span> <span class="hl-green">Paid</span>                 <span class="hl-dim">│</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> Feb 1, 2026   <span class="hl-dim">│</span> INV-04722  <span class="hl-dim">│</span> $3,800   <span class="hl-dim">│</span> <span class="hl-green">Paid</span>                 <span class="hl-dim">│</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> Jan 1, 2026   <span class="hl-dim">│</span> INV-04618  <span class="hl-dim">│</span> $3,800   <span class="hl-dim">│</span> <span class="hl-green">Paid</span>                 <span class="hl-dim">│</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> Dec 1, 2025   <span class="hl-dim">│</span> INV-04510  <span class="hl-dim">│</span> $3,800   <span class="hl-dim">│</span> <span class="hl-green">Paid</span>                 <span class="hl-dim">│</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└───────────────┴────────────┴──────────┴──────────────────────┘</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">← Same amount every month. No breakdown of what you're paying for.</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">← No connection between spend and business outcomes.</span>                  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Invoice-only view — operator sees cost with zero context</span>           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No per-product cost breakdown or utilization insight</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No 280E tax support — operators manually track COGS</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Billing feels like a bill, not a value statement</span>                   <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Billing Intelligence + 280E Tax Optimization</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-dim">[Home] [Support]</span> <span class="hl-blue">[Account]</span> <span class="hl-dim">[Product]</span>                       <span class="hl-dim">👤 Marcus</span>    <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Monthly Spend</span>  <span class="hl-dim">$3,800/mo</span>                 <span class="hl-bright">Plan</span>  <span class="hl-dim">Growth Tier</span>          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Cost Breakdown by Product</span>                                             <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────┬──────────┬──────────┬────────────────────────┐</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-dim">Product</span>        <span class="hl-dim">│</span> <span class="hl-dim">Cost/mo</span>  <span class="hl-dim">│</span> <span class="hl-dim">Usage</span>    <span class="hl-dim">│</span> <span class="hl-dim">Recommendation</span>       <span class="hl-dim">│</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">├────────────────┼──────────┼──────────┼────────────────────────┤</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">POS</span>            <span class="hl-dim">│</span> $1,200   <span class="hl-dim">│</span> <span class="hl-green">100%</span>     <span class="hl-dim">│</span> <span class="hl-green">Optimal ✓</span>            <span class="hl-dim">│</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Ecommerce</span>      <span class="hl-dim">│</span> $900     <span class="hl-dim">│</span> <span class="hl-green">82%</span>      <span class="hl-dim">│</span> <span class="hl-green">Good value</span>           <span class="hl-dim">│</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Payments</span>       <span class="hl-dim">│</span> $800     <span class="hl-dim">│</span> <span class="hl-green">68%</span>      <span class="hl-dim">│</span> <span class="hl-green">Good value</span>           <span class="hl-dim">│</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Loyalty</span>        <span class="hl-dim">│</span> $500     <span class="hl-dim">│</span> <span class="hl-amber">42%</span>      <span class="hl-dim">│</span> <span class="hl-amber">Underused — train ⚡</span> <span class="hl-dim">│</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Analytics</span>      <span class="hl-dim">│</span> $400     <span class="hl-dim">│</span> <span class="hl-red">12%</span>      <span class="hl-dim">│</span> <span class="hl-red">Downgrade or train</span>   <span class="hl-dim">│</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────┴──────────┴──────────┴────────────────────────┘</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">280E Tax Optimization</span>  <span class="hl-dim">·</span>  <span class="hl-dim">Q1 2026 Estimate</span>                           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                                                <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-bright">Gross Revenue</span>         <span class="hl-dim">────────────────────────</span>  $1,420,000    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-red">COGS (Deductible)</span>     <span class="hl-red">████████████████████</span>      ($780,000)   <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-amber">Gross Profit</span>          <span class="hl-amber">═══════════════════</span>        $640,000    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-red">Non-Deductible Exp</span>    <span class="hl-red">████████████████</span>          ($412,000)   <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">──────────────────────────────────────────────────────────</span>    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-bright">Taxable Income</span>        <span class="hl-dim">═══════════════════</span>        $640,000    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-red">Est. Tax (280E)</span>       <span class="hl-red">█████████████████</span>         ($230,400)   <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">Net After Tax</span>                                    <span class="hl-red">-$2,400</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                                                <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">💡 Reclassify $42K in labor as COGS → save $15.1K in tax</span>        <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-blue">[Download 280E Report (PDF)]</span>  <span class="hl-dim">[Export for Accountant (CSV)]</span>   <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                                                <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Every dollar tied to a product and its utilization</span>                  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Actionable nudges — train, downgrade, or lean in</span>                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ 280E waterfall makes tax complexity visual and actionable</span>           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ One-click export saves operators 8+ hours per quarter</span>               <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "280E is the single biggest financial pain in cannabis. I pay my accountant $8,000 a quarter to manually sort COGS. If Dutchie automated that report, I'd never leave the platform."
    <span class="attr">— CFO, 5-location Colorado dispensary group</span>
  </div>

  <div class="callout" style="border-left-color:var(--text-faint);font-size:12px;color:var(--text-muted);">
    <strong>Note:</strong> The 280E Tax Intelligence feature provides COGS allocation data and reports for your accountant. It is not tax advice. Consult a qualified cannabis CPA before filing. If Section 280E is modified or repealed, this intelligence transitions to full P&amp;L optimization, margin analysis, and category-level profitability — ensuring lasting value regardless of the tax landscape.
  </div>
</section>

<div class="part-divider">
  <div class="part-num">Part III</div>
  <div class="part-title">Platform Completeness</div>
  <div class="part-desc">Sections 07-10 &middot; Deep integrations, design patterns, and growth levers</div>
</div>

<!-- ─── 07. POS &amp; COMPLIANCE INTEGRATIONS ─── -->
<!-- ─── 6. INTEGRATIONS ─── -->
<section class="section" id="dtch-integrations">
  <div class="section-header">
    <div class="section-num">Section 07 — DTCH Team Chat</div>
    <h2 class="section-title">POS &amp; Compliance Integrations</h2>
    <p class="section-desc">Real-time POS transaction triggers and METRC compliance integration surface operational events directly in DTCH spaces.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num pink">7</div>
    <h3>POS Real-Time Transaction Triggers <span class="impact medium">Medium</span></h3>
    <p class="rec-subtitle">Finance + Ops: "DTCH should know about big sales, voids, and discount abuse as they happen"</p>
    <ul>
      <li><strong>Large Order Alert:</strong> Transaction > $500 → Cash Desk + Manager's Office</li>
      <li><strong>Void/Return Alert:</strong> Any void > $50 or return → Manager's Office for review</li>
      <li><strong>Discount Threshold:</strong> Discount > 25% or cumulative shift discounts > $500 → Manager's Office</li>
      <li><strong>Speed Alert:</strong> Transaction time > 8 min → Sales Floor (may need backup)</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num pink">8</div>
    <h3>METRC &amp; Compliance Integration <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Ops agent: "Compliance is the #1 existential risk. It should be front and center."</p>
    <ul>
      <li><strong>Harvest Ready:</strong> METRC harvest batch ready for processing → Compliance space</li>
      <li><strong>Manifest Due:</strong> Transfer manifest needs filing within 24h → Critical alert</li>
      <li><strong>Inventory Reconciliation:</strong> METRC vs POS variance detected → Compliance space + Manager</li>
      <li><strong>License Renewal:</strong> 30/60/90 day reminders for license expiration</li>
      <li><strong>Audit Mode:</strong> One-click "audit prep" that generates required METRC reports</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge finance">Finance</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — POS events and METRC alerts are invisible in DTCH</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">POS Terminal</span>  <span class="hl-dim">Reg 2 · 11:47 AM</span>                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Transaction #4892</span>                                                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">VOID — $127.50 (employee discount override)</span>                          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">← Manager never sees this. It's buried in the POS audit log.</span>         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">← METRC manifest due in 18 hours. Nobody is notified.</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">← License renewal in 28 days. Sitting in an email inbox.</span>             <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ POS events don't surface anywhere in DTCH</span>                          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Compliance deadlines tracked in separate systems or memory</span>         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Voids/discounts discovered days later during reconciliation</span>        <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Real-time POS triggers + Compliance alerts in DTCH</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">DTCH</span>  <span class="hl-dim">Manager's Office</span>                                                 <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">■ CRITICAL</span>                                                          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-red">🚨</span> <span class="hl-bright">METRC Manifest Due</span> <span class="hl-dim">·</span> Transfer #MT-4421 <span class="hl-dim">·</span> <span class="hl-red">18 hrs left</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-dim">120 units · Vendor: Green Thumb · </span><span class="hl-green">[File Now]</span> <span class="hl-dim">[Snooze 4h]</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-amber">■ ACTION</span>                                                             <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">⚠</span> <span class="hl-bright">Void Alert</span> <span class="hl-dim">·</span> Reg 2 <span class="hl-dim">·</span> $127.50 <span class="hl-dim">·</span> <span class="hl-dim">Employee discount</span>  <span class="hl-dim">11:47a</span> <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">⚠</span> <span class="hl-bright">Discount Threshold</span> <span class="hl-dim">·</span> Shift total $485/$500 limit     <span class="hl-dim">11:52a</span> <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-blue">■ INFO</span>                                                               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-blue">ℹ</span> <span class="hl-dim">License renewal: 28 days remaining · IL Cannabis License</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-blue">ℹ</span> <span class="hl-dim">Large order: $520 transaction completed · Reg 1</span>   <span class="hl-dim">11:38a</span>    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Three tiers: Critical (red banner) · Action (amber) · Info (blue)</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ POS events auto-route to the right DTCH space</span>                      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Compliance deadlines surface before they become emergencies</span>        <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "A $127 void happened on Tuesday and I didn't find out until Friday when I was reconciling. If that had hit my phone in real-time I could've addressed it in 30 seconds."
    <span class="attr">— Owner, single-location Oregon dispensary</span>
  </div>
</section>

<!-- ─── 08. LAYERED CARD SYSTEM ─── -->
<!-- ─── 4. LAYERED CARDS ─── -->
<section class="section" id="dtch-cards">
  <div class="section-header">
    <div class="section-num">Section 08 — DTCH Team Chat</div>
    <h2 class="section-title">Layered Card System</h2>
    <p class="section-desc">Replace walls of text with progressive-disclosure cards: collapsed summary → expanded detail → full panel.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">4</div>
    <h3>Three-Layer Information Cards <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Design + Ops consensus: "AI Bridge dumps too much info. Budtenders need the headline, not the essay."</p>
    <p>When Bridge AI surfaces a report, alert, or data card, show it in progressive layers:</p>
    <ul>
      <li><strong>Layer 1 — Collapsed (1 line):</strong> Icon + headline + key metric + timestamp. "📦 Low Stock Alert: Guru Concentrates — 4 units left"</li>
      <li><strong>Layer 2 — Expanded (in-chat):</strong> Click to expand within the message. Shows data table, chart, or action buttons. No navigation away.</li>
      <li><strong>Layer 3 — Detail Panel:</strong> Click "View full" to open a side panel with complete data, history, and action options.</li>
    </ul>
    <div class="source-row">
      <span class="source-badge design">Design</span>
      <span class="source-badge ops">Ops</span>
      <span class="source-badge pmm">PMM</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — AI Bridge dumps wall of text, no hierarchy</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">DTCH</span>  <span class="hl-dim">AI Alerts</span>                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">🤖 Bridge AI  10:32 AM</span>                                               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Inventory Alert: Guru Concentrates Live Resin 1g is running low</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">at 4 units remaining with a velocity of 2.1 units per day, which</span>      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">means you have approximately 1.9 days of stock left. Also, Badder</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">3.5g is at 12 units with 1.4/day velocity (8.6 days) and Sauce</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Cart is at 38 units with 0.8/day velocity (47.5 days). You may</span>       <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">want to consider reordering Live Resin soon. Last order was...</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">TL;DR — budtender sees this, doesn't read it, moves on</span>               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ AI dumps paragraphs — nobody reads past line 2 on the floor</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No visual hierarchy — critical data buried in prose</span>                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No inline actions — must leave chat to do anything</span>                  <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Progressive Disclosure Cards (3 layers)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">DTCH</span>  <span class="hl-dim">AI Alerts</span>                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">LAYER 1 — Collapsed (default view)</span>                                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">⚠</span> <span class="hl-bright">Low Stock</span> <span class="hl-dim">·</span> Guru Live Resin <span class="hl-dim">·</span> <span class="hl-red">4 units</span> <span class="hl-dim">·</span> <span class="hl-red">1.9 days</span>  <span class="hl-dim">▸</span>  <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">LAYER 2 — Expanded (tap to reveal)</span>                                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">⚠</span> <span class="hl-bright">Low Stock</span> <span class="hl-dim">·</span> Guru Concentrates                         <span class="hl-dim">▾</span>  <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>   <span class="hl-dim">Product</span>          <span class="hl-dim">Stock</span>   <span class="hl-dim">Velocity</span>  <span class="hl-dim">Days Left</span>             <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>   <span class="hl-bright">Live Resin 1g</span>    <span class="hl-red">  4</span>     <span class="hl-dim">2.1/day</span>     <span class="hl-red">1.9</span>               <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>   <span class="hl-bright">Badder 3.5g</span>      <span class="hl-amber"> 12</span>     <span class="hl-dim">1.4/day</span>     <span class="hl-amber">8.6</span>               <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>   <span class="hl-bright">Sauce Cart</span>       <span class="hl-green"> 38</span>     <span class="hl-dim">0.8/day</span>    <span class="hl-green">47.5</span>               <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                                              <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>   <span class="hl-green">[⟳ Reorder Now]</span>  <span class="hl-dim">[View Full →]</span>                            <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ One line = one decision. Budtenders scan, act, move on</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Inline actions — reorder without leaving chat</span>                      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Layer 3 detail panel opens for deep investigation</span>                  <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "Bridge dumps a whole essay about inventory levels. My budtenders see a wall of text and just scroll past it. Give me one line with a number and a button."
    <span class="attr">— GM, 4-location Michigan MSO</span>
  </div>
</section>

<!-- ─── 09. PRODUCT ADOPTION &amp; BENCHMARKING ─── -->
<!-- ─── 9. PRODUCT ADOPTION ─── -->
<section class="section" id="portal-adoption">
  <div class="section-header">
    <div class="section-num">Section 09 — Customer Portal</div>
    <h2 class="section-title">Product Adoption &amp; Benchmarking</h2>
    <p class="section-desc">Show operators which features they're using (and which they're leaving on the table), with peer benchmarking to drive adoption.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num amber">13</div>
    <h3>Feature Utilization Dashboard <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Finance: "Most operators pay for features they don't use. Show them."</p>
    <ul>
      <li>Visual grid of all Dutchie features with utilization % (0-100%)</li>
      <li>Color-coded: Green (active), Amber (underutilized), Gray (not activated)</li>
      <li>Click any feature → setup guide, training video, or "Turn on" button</li>
      <li>Monthly progress tracker showing adoption improvement</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
      <span class="source-badge pmm">PMM</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num amber">14</div>
    <h3>Peer Benchmarking with Gap Analysis <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Finance agent's detailed model: "Stores like yours see +23% repeat rate with loyalty"</p>
    <ul>
      <li><strong>Cohort:</strong> Compare against "stores like yours" (same state, similar size, similar product mix)</li>
      <li><strong>Metrics:</strong> Ecommerce conversion, avg basket, loyalty enrollment, repeat rate, online order %</li>
      <li><strong>Gap Analysis:</strong> Point-gap comparison vs peer median across all key metrics</li>
      <li><strong>Action items:</strong> Specific recommendations ranked by gap severity and effort</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num amber">15</div>
    <h3>Dutchie University — Training Center <span class="impact medium">Medium</span></h3>
    <p class="rec-subtitle">Ops: "New hires are my biggest pain point. I need a training path, not a manual."</p>
    <ul>
      <li>Role-based onboarding paths: Budtender (3 modules), Manager (5 modules), Admin (7 modules)</li>
      <li>Interactive tutorials with screenshots from their actual store configuration</li>
      <li>Certification badges that show in team profiles</li>
      <li>New feature training auto-added when features launch</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge pmm">PMM</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — Product page is a feature list with no usage data</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Dutchie — Your Products</span>                                  <span class="hl-dim">👤 Marcus</span>     <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Your Subscription</span>                                                    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌─────────────────────────────────────────────────────────────────┐</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">✓</span> Point of Sale              <span class="hl-dim">Active</span>                            <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">✓</span> Ecommerce                  <span class="hl-dim">Active</span>                            <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">✓</span> Payments                   <span class="hl-dim">Active</span>                            <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">✓</span> Loyalty                    <span class="hl-dim">Active</span>                            <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">○</span> Kiosk                      <span class="hl-dim">Not Activated</span>                     <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">○</span> Analytics                  <span class="hl-dim">Not Activated</span>                     <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">○</span> Delivery                   <span class="hl-dim">Not Activated</span>                     <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└─────────────────────────────────────────────────────────────────┘</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">← That's it. No usage data, no adoption %, no benchmarks.</span>             <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">← Operator has no idea if they're getting value from each product.</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Binary active/inactive — no utilization depth</span>                      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No peer comparison — "Am I using this as well as others?"</span>           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No adoption benchmarks — am I getting full value from my subscription?</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No training or setup guidance for unused features</span>                  <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Product Tab with Adoption, Benchmarking & Guided Activation</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-dim">[Home] [Support] [Account]</span> <span class="hl-amber">[Product]</span>                       <span class="hl-dim">👤 Marcus</span>    <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Feature Adoption</span>  <span class="hl-dim">·</span>  <span class="hl-green">6</span><span class="hl-dim">/</span><span class="hl-bright">9</span> <span class="hl-dim">features active</span>  <span class="hl-dim">·</span>  <span class="hl-amber">+12% this quarter</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">████████████████████████████████████████</span> POS      <span class="hl-green">100%</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">████████████████████████████████</span><span class="hl-dim">░░░░░░░░</span> Ecom      <span class="hl-green">82%</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">██████████████████████████</span><span class="hl-dim">░░░░░░░░░░░░░░</span> Payments  <span class="hl-green">68%</span>              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-amber">████████████████</span><span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░</span> Loyalty   <span class="hl-amber">42%</span> <span class="hl-amber">⚡ Train</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-amber">██████████</span><span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Kiosk     <span class="hl-amber">26%</span> <span class="hl-amber">⚡ Try</span>      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">█████</span><span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Analytics <span class="hl-red">12%</span> <span class="hl-red">⚡ Enable</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Delivery  <span class="hl-dim"> 0%</span> <span class="hl-blue">[Turn On]</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Marketing <span class="hl-dim"> 0%</span> <span class="hl-blue">[Turn On]</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Nexus AI  <span class="hl-dim"> 0%</span> <span class="hl-blue">[Turn On]</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Peer Benchmarking</span>  <span class="hl-dim">·</span>  <span class="hl-dim">vs 23 similar IL dispensaries</span>                  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌──────────────┬──────────┬──────────┬──────────────────┐</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-dim">Metric</span>       <span class="hl-dim">│</span> <span class="hl-dim">You</span>      <span class="hl-dim">│</span> <span class="hl-dim">Peers</span>    <span class="hl-dim">│</span> <span class="hl-dim">Gap</span>              <span class="hl-dim">│</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">├──────────────┼──────────┼──────────┼──────────────────┤</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Online %</span>     <span class="hl-dim">│</span> <span class="hl-red">18%</span>      <span class="hl-dim">│</span> <span class="hl-green">31%</span>      <span class="hl-dim">│</span> <span class="hl-amber">-13 pts</span>         <span class="hl-dim">│</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Loyalty</span>      <span class="hl-dim">│</span> <span class="hl-red">12%</span>      <span class="hl-dim">│</span> <span class="hl-green">34%</span>      <span class="hl-dim">│</span> <span class="hl-amber">-22 pts</span>         <span class="hl-dim">│</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Avg Basket</span>   <span class="hl-dim">│</span> <span class="hl-green">$92</span>      <span class="hl-dim">│</span> <span class="hl-dim">$88</span>      <span class="hl-dim">│</span> <span class="hl-green">Ahead ✓</span>         <span class="hl-dim">│</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Repeat Rate</span>  <span class="hl-dim">│</span> <span class="hl-red">41%</span>      <span class="hl-dim">│</span> <span class="hl-green">58%</span>      <span class="hl-dim">│</span> <span class="hl-amber">-17 pts</span>         <span class="hl-dim">│</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">Ecom Conv</span>   <span class="hl-dim">│</span> <span class="hl-amber">2.1%</span>     <span class="hl-dim">│</span> <span class="hl-green">3.8%</span>     <span class="hl-dim">│</span> <span class="hl-amber">-1.7 pts</span>        <span class="hl-dim">│</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└──────────────┴──────────┴──────────┴──────────────────┘</span>            <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-amber">⚡ 4 of 5 metrics below peer median — focus: Loyalty &amp; Online</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">[View Recommendations →]</span>  <span class="hl-dim">[Download Benchmark Report]</span>                 <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Utilization bars show depth, not just active/inactive</span>               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Action nudges on underused features drive adoption</span>          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Peer benchmarks create healthy competitive pull</span>                     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ One-click "Turn On" removes activation friction</span>                     <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "I've been paying for Loyalty for six months and didn't even realize we were only using 42% of it. If someone had shown me this bar chart on day one, I would've trained my staff immediately."
    <span class="attr">— Owner, 3-location Illinois dispensary</span>
  </div>
</section>

<!-- ─── 10. COMMAND PALETTE &amp; ACTIONS ─── -->
<!-- ─── 3. COMMAND PALETTE ─── -->
<section class="section" id="dtch-commands">
  <div class="section-header">
    <div class="section-num">Section 10 — DTCH Team Chat</div>
    <h2 class="section-title">Command Palette &amp; Actions</h2>
    <p class="section-desc">Replace slash commands with a searchable command palette (⌘K) that surfaces contextual actions based on the active space.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num amber">3</div>
    <h3>Contextual Command Palette <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Design agent: "Slash commands are a power-user tax. 90% of operators don't know they exist."</p>
    <p>Current slash commands (/inventory, /sentiment, /report, etc.) require memorization. Replace with a unified ⌘K command palette that:</p>
    <ul>
      <li>Shows context-aware actions based on active space (Inventory shows reorder/audit, Cash Desk shows safe count/reconcile)</li>
      <li>Fuzzy search across all commands, spaces, team members, and recent conversations</li>
      <li>Recent actions section for quick re-use</li>
      <li>Keyboard-first but also accessible via the toolbar button</li>
    </ul>
    <div class="source-row">
      <span class="source-badge design">Design</span>
      <span class="source-badge pmm">PMM</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — Hidden slash commands only 10% discover</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">DTCH</span> <span class="hl-green">●</span>  <span class="hl-dim">Sales Floor</span>                                                    <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Marcus: Has anyone counted Reg 2 today?</span>                  <span class="hl-dim">10:32 AM</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Priya: Guru Live Resin is at 4 units, need to reorder</span>    <span class="hl-dim">10:45 AM</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Jordan: Customer asking about edible dosing guide</span>        <span class="hl-dim">11:02 AM</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-bright">/</span><span class="hl-dim">inventory                                                    </span><span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">├────────────────────────────────────────────────────────────────┤</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">/inventory</span>   <span class="hl-dim">Check stock levels</span>                                <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">/sentiment</span>   <span class="hl-dim">View customer sentiment</span>                           <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">/report</span>      <span class="hl-dim">Generate report</span>                                   <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">/handoff</span>     <span class="hl-dim">Shift handoff</span>                                     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">... 12 more commands ...</span>                                      <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Must type "/" first — 90% of operators never discover this</span>         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Flat alphabetical list — no context awareness</span>                      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Only inside message input — not accessible from dashboard</span>          <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — ⌘K Command Palette (accessible everywhere)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Nexus Dashboard</span>                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌──────────┐ ┌──────────┐ ┌──────────┐</span>                              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│ Revenue  │ │ Sentim.. │ │ Invent.. │</span>                              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└──────────┘ └──────────┘ └──────────┘</span>                              <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">┌──────────────────────────────────────────────────────────┐</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span> <span class="hl-dim">🔍</span> <span class="hl-bright">safe cou</span><span class="hl-dim">nt...</span>                            <span class="hl-dim">⌘K</span>       <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">├──────────────────────────────────────────────────────────┤</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>  <span class="hl-amber">SUGGESTED</span> <span class="hl-dim">· based on</span> <span class="hl-bright">Cash Desk</span> <span class="hl-dim">context</span>                    <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>   <span class="hl-green">▸</span> 💵 <span class="hl-bright">Log Safe Count</span>                                    <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>     <span class="hl-dim">Record safe balance · Last: $24,350 @ 2pm</span>             <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>     💰 <span class="hl-bright">Cash Reconciliation</span>                                <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>     <span class="hl-dim">Compare POS totals vs physical safe count</span>             <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>  <span class="hl-dim">RECENT</span>                                                  <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>     📦 <span class="hl-dim">Reorder Guru Live Resin</span>           <span class="hl-dim">2 hours ago</span>     <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>     📊 <span class="hl-dim">Generate Weekly Sales Report</span>      <span class="hl-dim">Yesterday</span>       <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">├──────────────────────────────────────────────────────────┤</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">│</span>  <span class="hl-dim">⌘K anywhere · ↑↓ navigate · ↵ run · esc close</span>            <span class="hl-dim">│</span>        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>    <span class="hl-dim">└──────────────────────────────────────────────────────────┘</span>        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Fuzzy search across commands, spaces, people, and history</span>          <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Context-aware: shows Cash Desk actions in Cash Desk space</span>         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Accessible from anywhere — dashboard, chat, or any Nexus page</span>     <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "I've been using DTCH for six months and just found out there are slash commands. Nobody on my team knows they exist."
    <span class="attr">— Inventory Manager, 5-location Colorado MSO</span>
  </div>
</section>

<div class="part-divider">
  <div class="part-num">Roadmap</div>
  <div class="part-title">Roadmap &amp; Phasing</div>
  <div class="part-desc">Infrastructure foundation + three-phase implementation plan with effort estimates per line item</div>
</div>

<section class="section" id="roadmap">
  <div class="section-header">
    <div class="section-num">Section 11 — Roadmap</div>
    <h2 class="section-title">Implementation Roadmap</h2>
    <p class="section-desc">Phased rollout prioritized by operator impact, implementation complexity, and retention value.</p>
  </div>

  <div class="callout" style="border-left-color:var(--purple);margin-bottom:24px;">
    <strong style="color:var(--purple);">Phase 0 — Infrastructure Foundation</strong> <span class="source-badge" style="background:var(--pink-dim);color:var(--pink);margin-left:8px;">Architect</span>
    <p style="margin:8px 0 12px;font-size:14px;">Multiple Phase 2-3 features depend on shared platform infrastructure that does not exist today. The Architect Agent recommends building these foundations in parallel with Phase 1 features:</p>
    <ul style="font-size:14px;margin:0;padding-left:18px;line-height:1.8;">
      <li><strong>Event Bus</strong> — Unified event stream (Kafka/EventBridge) for POS transactions, METRC sync, alerts, and shift data. Required by: Alert Tiers, Shift Handoff, POS Triggers, Integration Health.</li>
      <li><strong>Analytics Data Warehouse</strong> — Aggregation layer for health scores, benchmarking, and 280E reports. Prevents 15+ API calls per portal page load.</li>
      <li><strong>Bridge AI Contract</strong> — Structured output schema for layered cards, shift handoff summaries, and KB search. Includes confidence scoring and fallback behavior.</li>
      <li><strong>RBAC Permissions</strong> — Space-level access control for sensitive data (Cash Desk, Manager's Office, 280E reports). Budtenders should not see P&amp;L data.</li>
      <li><strong>Feature Flagging</strong> — Per-tenant, per-feature rollout via LaunchDarkly for gradual phasing. Critical for health score tuning and 280E legal review.</li>
    </ul>
  </div>

  <table class="priority-table">
    <thead>
      <tr>
        <th>Phase</th>
        <th>Change</th>
        <th>Module</th>
        <th>Impact</th>
        <th>Effort</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="phase p1">Phase 1</span></td>
        <td>Restructure spaces (kill dead spaces, add Cash/Compliance/Vendor)</td>
        <td>DTCH</td>
        <td><span class="impact critical" style="margin:0">Critical</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p1">Phase 1</span></td>
        <td>Tri-state panel (rail → sidebar → full)</td>
        <td>DTCH</td>
        <td><span class="impact critical" style="margin:0">Critical</span></td>
        <td>Large</td>
      </tr>
      <tr>
        <td><span class="phase p1">Phase 1</span></td>
        <td>Account Health Dashboard + feature adoption</td>
        <td>Portal</td>
        <td><span class="impact critical" style="margin:0">Critical</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p1">Phase 1</span></td>
        <td>Four-tab architecture (Home / Support / Account / Product)</td>
        <td>Portal</td>
        <td><span class="impact critical" style="margin:0">Critical</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p2">Phase 2</span></td>
        <td>Three-tier alert system + shift handoff</td>
        <td>DTCH</td>
        <td><span class="impact high" style="margin:0">High</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p2">Phase 2</span></td>
        <td>Command palette (⌘K) + layered cards</td>
        <td>DTCH</td>
        <td><span class="impact high" style="margin:0">High</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p2">Phase 2</span></td>
        <td>AI-first support (search → KB → escalation)</td>
        <td>Portal</td>
        <td><span class="impact critical" style="margin:0">Critical</span></td>
        <td>Large</td>
      </tr>
      <tr>
        <td><span class="phase p2">Phase 2</span></td>
        <td>Integration health dashboard</td>
        <td>Portal</td>
        <td><span class="impact critical" style="margin:0">Critical</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p2">Phase 2</span></td>
        <td>280E tax optimization report</td>
        <td>Portal</td>
        <td><span class="impact high" style="margin:0">High</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p3">Phase 3</span></td>
        <td>POS transaction triggers + METRC compliance</td>
        <td>DTCH</td>
        <td><span class="impact high" style="margin:0">High</span></td>
        <td>Large</td>
      </tr>
      <tr>
        <td><span class="phase p3">Phase 3</span></td>
        <td>Feature adoption + peer benchmarking</td>
        <td>Portal</td>
        <td><span class="impact high" style="margin:0">High</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td><span class="phase p3">Phase 3</span></td>
        <td>Dutchie University + usage-based billing</td>
        <td>Portal</td>
        <td><span class="impact medium" style="margin:0">Medium</span></td>
        <td>Large</td>
      </tr>
    </tbody>
  </table>

  <div class="callout">
    <strong>Agent Consensus:</strong> Phase 1 items were unanimously prioritized by all five expert agents. The Account Health Dashboard and tri-state panel represent the highest-impact, highest-visibility changes that immediately transform the operator experience. These are the changes that make operators say <em>"finally, someone understands my business."</em>
  </div>

  <div class="callout info">
    <strong>Reference Prototype:</strong> The design patterns used in this review are informed by the Dutchie Connect 2.0 prototype at dutchie-connect.pages.dev, which demonstrates the level of polish and detail achievable for prototype-stage work.
  </div>
</section>

<!-- ─── 12. INTERNAL CUSTOMER INTELLIGENCE ─── -->
<div class="part-divider">
  <div class="part-num">Internal</div>
  <div class="part-title">Dutchie Team Intelligence</div>
  <div class="part-desc">Back-end dashboards for CS, AMs, and leadership &middot; Not customer-facing</div>
</div>

<section class="section" id="internal-intel">
  <div class="section-header">
    <div class="section-num">Section 12 — Internal Tooling</div>
    <h2 class="section-title">Customer Intelligence Dashboard</h2>
    <p class="section-desc">Give CS reps, account managers, and leadership a single internal view of every account's health, adoption depth, and churn signals — so they know who to call, what to say, and when to act.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num green">27</div>
    <h3>Account Health Score — Internal View <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">Ops agent: "CSMs shouldn't have to dig through Salesforce + Zendesk + Looker to know if an account is healthy."</p>
    <p>A composite 0-100 health score visible only to Dutchie team members. Same data as the customer-facing portal, but with internal-only signals:</p>
    <ul>
      <li><strong>Product Adoption Depth</strong> — % of paid features actively used (not just "active")</li>
      <li><strong>Support Velocity</strong> — Open ticket count, avg resolution time, escalation rate</li>
      <li><strong>Engagement Trend</strong> — Login frequency, portal visits, DTCH activity over 30/60/90 days</li>
      <li><strong>Contract Risk</strong> — Renewal date proximity, payment history, feature downgrades</li>
    </ul>
    <div class="source-row">
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num green">28</div>
    <h3>Triage Priority Queue <span class="impact critical">Critical</span></h3>
    <p class="rec-subtitle">Finance agent: "An AM with 80 accounts needs to know which 5 to call today."</p>
    <ul>
      <li><strong>Auto-ranked account list</strong> sorted by health score drop velocity (who's trending down fastest)</li>
      <li><strong>Risk flags:</strong> "Login dropped 60% in 14 days," "3 P1 tickets in a week," "Renewal in 30 days + declining adoption"</li>
      <li><strong>Suggested talking points:</strong> Pre-loaded context based on what's driving the score down</li>
      <li><strong>One-click outreach:</strong> Trigger a personalized check-in email or schedule a call from the dashboard</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num blue">29</div>
    <h3>Adoption Heatmap by Cohort <span class="impact high">High</span></h3>
    <p class="rec-subtitle">PMM agent: "We need to see adoption patterns across segments, not just individual accounts."</p>
    <ul>
      <li><strong>Segment view:</strong> Single-location vs MSO, by state, by plan tier, by tenure</li>
      <li><strong>Feature matrix:</strong> Heatmap showing adoption % for each product across cohorts</li>
      <li><strong>Activation funnel:</strong> How many accounts have each feature enabled → configured → actively using</li>
      <li><strong>Peer comparison data:</strong> Powers the customer-facing benchmarking — internal team sees the full dataset</li>
    </ul>
    <div class="source-row">
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge design">Design</span>
    </div>
  </div>

  <div class="mockup-stacked">
    <div class="mockup-panel">
      <div class="mockup-label before">✕ Before — AM workflow: Salesforce + Zendesk + Looker + gut feel</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Current AM Workflow</span>                                                     <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Tab 1: Salesforce</span>          <span class="hl-dim">Tab 2: Zendesk</span>        <span class="hl-dim">Tab 3: Looker</span>      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌──────────────────┐</span>     <span class="hl-dim">┌──────────────┐</span>    <span class="hl-dim">┌──────────────┐</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│ Contract info    │</span>     <span class="hl-dim">│ Open tickets │</span>    <span class="hl-dim">│ Usage data   │</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│ Last touch date  │</span>     <span class="hl-dim">│ CSAT score   │</span>    <span class="hl-dim">│ Adoption %   │</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│ Renewal date     │</span>     <span class="hl-dim">│ Escalations  │</span>    <span class="hl-dim">│ Login freq   │</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└──────────────────┘</span>     <span class="hl-dim">└──────────────┘</span>    <span class="hl-dim">└──────────────┘</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">Tab 4: Google Sheets</span>      <span class="hl-dim">Tab 5: Slack</span>                               <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌──────────────────┐</span>     <span class="hl-dim">┌──────────────┐</span>                           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│ Manual notes     │</span>     <span class="hl-dim">│ #acct-health │</span>                           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│ "At risk" flags  │</span>     <span class="hl-dim">│ Anecdotes    │</span>                           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└──────────────────┘</span>     <span class="hl-dim">└──────────────┘</span>                           <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ 5 tools to answer one question: "Is this account healthy?"</span>         <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No leading indicators — only see problems after they escalate</span>      <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ Prioritization is gut-based — loudest customer gets attention</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-red">✗ No adoption data — AM doesn't know which features are underused</span>  <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
    <div class="mockup-panel">
      <div class="mockup-label after">✓ After — Unified Customer Intelligence Dashboard (internal only)</div>
      <div class="mockup-body">
<span class="hl-dim">╔══════════════════════════════════════════════════════════════════════════╗</span>
<span class="hl-dim">║</span> <span class="hl-bright">Dutchie — Customer Intelligence</span>                     <span class="hl-dim">👤 Sarah (CSM)</span>    <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">My Portfolio</span>  <span class="hl-dim">·</span>  <span class="hl-dim">82 accounts</span>  <span class="hl-dim">·</span>  <span class="hl-red">5 need attention</span>  <span class="hl-dim">·</span>  <span class="hl-amber">12 watch</span>     <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Priority Queue</span>  <span class="hl-dim">(sorted by risk · auto-updated daily)</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────┬─────────────────────┬───────┬───────────────────────────────┐</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-dim">#</span>  <span class="hl-dim">│</span> <span class="hl-dim">Account</span>             <span class="hl-dim">│</span> <span class="hl-dim">Score</span> <span class="hl-dim">│</span> <span class="hl-dim">Risk Signal</span>                   <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">├────┼─────────────────────┼───────┼───────────────────────────────┤</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-red">!</span>  <span class="hl-dim">│</span> <span class="hl-bright">Green Leaf IL</span>       <span class="hl-dim">│</span> <span class="hl-red">34</span>    <span class="hl-dim">│</span> <span class="hl-red">Login ↓62% · 3 P1s · renew 28d</span><span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-red">!</span>  <span class="hl-dim">│</span> <span class="hl-bright">Rocky Mtn Remedies</span>  <span class="hl-dim">│</span> <span class="hl-red">41</span>    <span class="hl-dim">│</span> <span class="hl-red">Loyalty disabled · POS errors</span>  <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">▲</span>  <span class="hl-dim">│</span> <span class="hl-bright">Desert Bloom AZ</span>     <span class="hl-dim">│</span> <span class="hl-amber">58</span>    <span class="hl-dim">│</span> <span class="hl-amber">Ecom conv ↓ · 0% Kiosk usage</span>  <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-amber">▲</span>  <span class="hl-dim">│</span> <span class="hl-bright">Canopy Care MI</span>      <span class="hl-dim">│</span> <span class="hl-amber">63</span>    <span class="hl-dim">│</span> <span class="hl-amber">New store opened · needs setup</span> <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span> <span class="hl-green">✓</span>  <span class="hl-dim">│</span> <span class="hl-bright">Harvest House CO</span>    <span class="hl-dim">│</span> <span class="hl-green">91</span>    <span class="hl-dim">│</span> <span class="hl-green">All systems healthy · champion</span> <span class="hl-dim">│</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────┴─────────────────────┴───────┴───────────────────────────────┘</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-bright">Green Leaf IL</span>  <span class="hl-dim">·</span>  <span class="hl-red">Score: 34/100 ↓18 pts in 14 days</span>                <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">┌────────────────────────────────────────────────────────────────┐</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-bright">Adoption</span>                                                      <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">██████████████████████████████████████████</span> POS      <span class="hl-green">100%</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">████████████████████████████████</span><span class="hl-dim">░░░░░░░░</span> Ecom      <span class="hl-green">78%</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">██████████████████████████</span><span class="hl-dim">░░░░░░░░░░░░░░</span> Payments  <span class="hl-green">65%</span>     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-red">████</span><span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Loyalty   <span class="hl-red">8%</span> <span class="hl-red">↓</span>    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Kiosk      <span class="hl-dim">0%</span>      <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-dim">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</span> Analytics  <span class="hl-dim">0%</span>      <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                                              <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-bright">Suggested Talking Points</span>                                     <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-amber">1.</span> Loyalty dropped from 42% → 8% — ask if staff training needed <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-amber">2.</span> 3 P1 tickets about menu sync — offer escalation path         <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-amber">3.</span> Renewal in 28 days — schedule QBR before renewal decision    <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>                                                              <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">│</span>  <span class="hl-green">[Schedule Call]</span>  <span class="hl-blue">[Send Check-in Email]</span>  <span class="hl-dim">[View Full Profile]</span> <span class="hl-dim">│</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-dim">└────────────────────────────────────────────────────────────────┘</span>   <span class="hl-dim">║</span>
<span class="hl-dim">║</span>                                                                        <span class="hl-dim">║</span>
<span class="hl-dim">╠══════════════════════════════════════════════════════════════════════════╣</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ One screen replaces 5 tools — health, adoption, tickets, contract</span>  <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Auto-prioritized queue — data decides who to call, not gut feel</span>    <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Leading indicators catch churn risk before the customer complains</span> <span class="hl-dim">║</span>
<span class="hl-dim">║</span>  <span class="hl-green">✓ Pre-loaded context turns a cold check-in into a helpful one</span>       <span class="hl-dim">║</span>
<span class="hl-dim">╚══════════════════════════════════════════════════════════════════════════╝</span></div>
    </div>
  </div>

  <div class="op-quote">
    "If I could see which accounts have Loyalty enabled but barely using it, I'd have a concrete reason to call them instead of a generic check-in. That's the difference between an AM call that helps and one that annoys."
    <span class="attr">— Account Manager, Dutchie CS Team</span>
  </div>
</section>

<!-- ─── 13. IDEAS BEYOND THIS PROTOTYPE ─── -->
<section class="section" id="ideas-beyond">
  <div class="section-header">
    <div class="section-num">Section 13 — Future Thinking</div>
    <h2 class="section-title">Ideas Beyond This Prototype</h2>
    <p class="section-desc">Concepts the agent group flagged as high-potential for retailers — outside the scope of the current prototype, but worth exploring.</p>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">30</div>
    <h3>Predictive Staffing Engine <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Ops agent: "Every dispensary over-staffs slow days and under-staffs rush days."</p>
    <ul>
      <li>Use POS transaction history + foot traffic patterns to predict hourly demand per day of week</li>
      <li>Recommend optimal staff count by role (budtender, cashier, intake) for each shift</li>
      <li>Flag overstaffing/understaffing in real-time with a "Staff Score" that updates hourly</li>
      <li>Integrate with scheduling tools (Homebase, Deputy) to auto-suggest shift adjustments</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge finance">Finance</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">31</div>
    <h3>Vendor Intelligence &amp; Purchase Optimization <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Finance agent: "Dispensaries reorder the same products from the same vendors without ever comparing."</p>
    <ul>
      <li>Aggregate anonymized purchasing data across Dutchie network to show price benchmarks per SKU category</li>
      <li>"You're paying $X for this concentrate category — 70% of similar stores pay $Y" (opt-in, anonymized)</li>
      <li>Vendor scorecards: fill rate, delivery reliability, return rate, margin contribution</li>
      <li>Auto-generate reorder suggestions based on velocity, seasonality, and margin targets</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">32</div>
    <h3>Multi-Location P&amp;L Rollup <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Finance agent: "MSOs with 5+ locations can't see consolidated performance without exporting to Excel."</p>
    <ul>
      <li>Cross-location financial summary: per-store contribution, labor %, COGS %, margin comparison</li>
      <li>Identify underperforming stores vs the operator's own portfolio (not just industry benchmarks)</li>
      <li>State-level regulatory cost comparison for multi-state operators</li>
      <li>Exportable board-ready reports with YoY trends</li>
    </ul>
    <div class="source-row">
      <span class="source-badge finance">Finance</span>
      <span class="source-badge architect">Architect</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">33</div>
    <h3>Customer Journey Analytics <span class="impact medium">Medium</span></h3>
    <p class="rec-subtitle">PMM agent: "Retailers can see orders but can't see the journey — where customers drop off, what drives repeat visits."</p>
    <ul>
      <li>Funnel visualization: Menu browse → Cart → Checkout → Pickup/Delivery complete</li>
      <li>Cohort analysis: First-time vs returning customers, frequency distribution, basket evolution</li>
      <li>Attribution: Which menu placements, promotions, or loyalty rewards drive the most conversions</li>
      <li>Churn prediction: Flag customers who haven't returned in their typical cycle with re-engagement suggestions</li>
    </ul>
    <div class="source-row">
      <span class="source-badge pmm">PMM</span>
      <span class="source-badge design">Design</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">34</div>
    <h3>Compliance Autopilot <span class="impact high">High</span></h3>
    <p class="rec-subtitle">Ops agent: "Compliance is the thing that keeps operators up at night. Automate everything you can."</p>
    <ul>
      <li>Auto-audit METRC manifest data against POS transactions — flag discrepancies before the state does</li>
      <li>Regulatory change alerts: When a state updates rules, highlight which store settings need updating</li>
      <li>Pre-built compliance checklists per state with auto-check items that Dutchie can verify programmatically</li>
      <li>Audit-ready report generator: One click to export everything a state inspector would ask for</li>
    </ul>
    <div class="source-row">
      <span class="source-badge ops">Ops</span>
      <span class="source-badge architect">Architect</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">35</div>
    <h3>AI Menu Merchandising <span class="impact medium">Medium</span></h3>
    <p class="rec-subtitle">Design agent: "The online menu is a flat list. It should be a smart storefront."</p>
    <ul>
      <li>Dynamic menu ordering based on margin, inventory levels, and customer purchase history</li>
      <li>A/B test menu layouts, product photos, and descriptions with built-in conversion tracking</li>
      <li>"Frequently bought together" and "Customers who liked X also liked Y" recommendations</li>
      <li>Seasonal and time-of-day menu optimization (indica-heavy recommendations in the evening)</li>
    </ul>
    <div class="source-row">
      <span class="source-badge design">Design</span>
      <span class="source-badge pmm">PMM</span>
    </div>
  </div>

  <div class="rec-card">
    <div class="rec-num purple">36</div>
    <h3><a href="/nexus-mobile" style="color:inherit;text-decoration:underline;text-decoration-color:var(--purple);">Nexus Mobile Companion App</a> <span class="impact medium">Medium</span></h3>
    <p class="rec-subtitle">Architect agent: "Operators check their phone more than their desktop. Give them a reason to open Dutchie first."</p>
    <ul>
      <li>Push notifications for critical alerts: safe count due, METRC sync failed, inventory threshold hit</li>
      <li>Glanceable daily summary: yesterday's sales, today's schedule, open issues — 10-second morning briefing</li>
      <li>Quick actions: approve a PO, respond to a DTCH message, acknowledge an alert — without opening a laptop</li>
      <li>Manager override approvals: Discount overrides, void approvals, and refund sign-offs from the floor</li>
    </ul>
    <div class="source-row">
      <span class="source-badge architect">Architect</span>
      <span class="source-badge ops">Ops</span>
    </div>
  </div>

  <div class="callout" style="border-left-color:var(--purple);">
    <strong>Agent Consensus on Future Ideas:</strong> The Predictive Staffing Engine and Vendor Intelligence concepts scored highest across all five agents. Both leverage data Dutchie already collects but doesn't surface — making them high-impact with relatively low data acquisition cost. The Mobile Companion App was flagged by the Architect as the single biggest unlock for operator engagement, since most store managers spend 80% of their day on the floor, not at a desk.
  </div>
</section>

<!-- ════════════════════════════════════════ FOOTER ═════════════════════════════════════ -->
<footer class="report-footer">
  <div class="logo">Dutchie Nexus</div>
  <p style="font-size:18px;color:var(--text-bright);margin-bottom:8px;font-weight:700;">Ready to see this live?</p>
  <p style="font-size:14px;color:var(--text-muted);max-width:500px;margin:0 auto 24px;line-height:1.6;">
    Phase 1 ships this quarter. Get early access to the tri-state chat panel, Account Health Dashboard, and predictive inventory preview.
  </p>
  <p style="margin-bottom:24px;">
    <a href="#" class="cta-btn">Request Early Access</a>
  </p>
  <p>Questions? Reach your Dutchie account team or visit the Customer Portal.</p>
  <p style="margin-top:16px;">Authored by PMM, Design, Cannabis Ops, Finance &amp; Architect expert agents &middot; March 2026</p>
  <p style="margin-top:12px;"><a href="#" style="color:var(--text-faint);text-decoration:none;font-size:13px;">↑ Back to Top</a></p>
</footer>

</div><!-- .container -->`;

export default function DesignReview() {
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-design-review", "true");
    style.textContent = DESIGN_REVIEW_CSS;
    document.head.appendChild(style);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    link.setAttribute("data-design-review", "true");
    document.head.appendChild(link);

    // Setup scroll effects after DOM paint
    const timer = setTimeout(() => {
      const root = document.querySelector("[data-dr-root]");
      if (!root) return;

      // Progress bar
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = root;
        const progress = scrollTop / (scrollHeight - clientHeight);
        const bar = root.querySelector(".progress-bar");
        if (bar) bar.style.width = (progress * 100) + "%";

        // Sticky nav
        const nav = root.querySelector(".sticky-nav");
        if (nav) nav.classList.toggle("visible", scrollTop > 500);
      };
      root.addEventListener("scroll", handleScroll, { passive: true });

      // Scroll reveal
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
      );
      root.querySelectorAll(".section, .toc, .part-divider, .agents-grid").forEach((el) => observer.observe(el));

      // Smooth scroll for anchor links
      root.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
          const id = a.getAttribute("href").slice(1);
          const target = root.querySelector("#" + id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll("[data-design-review]").forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      data-dr-root=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "auto",
        background: "#0D0C0A",
      }}
      dangerouslySetInnerHTML={{ __html: DESIGN_REVIEW_HTML }}
    />
  );
}
