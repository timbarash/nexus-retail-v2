import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, BarChart3, ShoppingCart, Megaphone, ArrowRight, Star, Quote, Zap, Shield, TrendingUp, Users, MapPin, Bot, Signal, RotateCw, Lock, Check, Mail, MessageSquare, BookOpen, Package, AlertTriangle, Play, ChevronRight } from 'lucide-react';
import { callGeminiJSON } from '../utils/gemini';

/* ─── IntersectionObserver hook ─────────────────────────────── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.15, ...opts });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Sticky nav scroll hook ──────────────────────────────── */
function useScrolled(threshold = 100) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return scrolled;
}

/* ─── Animated counter hook ─────────────────────────────────── */
function useAnimatedCounter(target, inView, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (isNaN(numericTarget) || numericTarget === 0) { setValue(numericTarget); return; }
    const startTime = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * numericTarget));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

function AnimatedStat({ value, inView }) {
  const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
  if (!match) return <span>{value}</span>;
  const [, prefix, numStr, suffix] = match;
  const cleanNum = numStr.replace(/,/g, '');
  const animated = useAnimatedCounter(cleanNum, inView);
  const formatted = numStr.includes(',') ? animated.toLocaleString() : String(animated);
  return <span>{prefix}{formatted}{suffix}</span>;
}

/* ─── Agent Preview Cards ──────────────────────────────────── */
function MarketingPreview({ color }) {
  return (
    <div className="min-h-[12rem] flex flex-col gap-2 text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-[#F0EDE8] text-[11px] uppercase tracking-wider">Campaign Draft</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00C27C]/20 text-[#00C27C]">Compliant</span>
      </div>
      <div className="rounded-lg border border-[#38332B] bg-[#141210] p-3 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#F0EDE8] font-medium text-[11px]">
          <Megaphone className="w-3.5 h-3.5" style={{ color }} />
          Weekend Flower Drop — 20% off top shelf
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#ADA599]">
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> SMS</span>
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>
          <span className="ml-auto text-[#ADA599]">4,280 recipients</span>
        </div>
        <div className="border-t border-[#38332B] pt-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-[#00C27C]" />
            <span className="text-[10px] text-[#ADA599]">State marketing rules — passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-[#00C27C]" />
            <span className="text-[10px] text-[#ADA599]">Purchase-limit language — passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-[#00C27C]" />
            <span className="text-[10px] text-[#ADA599]">Opt-out footer — included</span>
          </div>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-[#ADA599]">Projected Revenue</span>
            <span className="font-semibold" style={{ color }}>$12,840</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#38332B] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '72%', background: color }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectPreview({ color }) {
  const rows = [
    { name: 'Blue Dream 3.5g', stock: 8, status: 'critical', pct: 12 },
    { name: 'Gummy Bears 10pk', stock: 34, status: 'warning', pct: 45 },
    { name: 'Live Rosin Cart 1g', stock: 112, status: 'good', pct: 85 },
  ];
  const statusColors = { critical: '#E87068', warning: '#D4A03A', good: '#00C27C' };
  const statusLabels = { critical: 'Low', warning: 'Monitor', good: 'Stocked' };
  return (
    <div className="min-h-[12rem] flex flex-col gap-2 text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-[#F0EDE8] text-[11px] uppercase tracking-wider">Inventory Watch</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E87068]/20 text-[#E87068]">1 Alert</span>
      </div>
      <div className="rounded-lg border border-[#38332B] bg-[#141210] p-3 flex-1 flex flex-col">
        <div className="flex items-center text-[10px] text-[#ADA599] uppercase tracking-wider pb-1.5 border-b border-[#38332B] mb-1">
          <span className="flex-1">Product</span>
          <span className="w-12 text-center">Qty</span>
          <span className="w-16 text-right">Status</span>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          {rows.map((r, j) => (
            <div key={j} className="flex items-center text-[11px]">
              <div className="flex-1 flex items-center gap-1.5 text-[#F0EDE8] truncate">
                <Package className="w-3 h-3 flex-shrink-0" style={{ color }} />
                {r.name}
              </div>
              <span className="w-12 text-center text-[#ADA599]">{r.stock}</span>
              <span className="w-16 text-right">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: `${statusColors[r.status]}20`, color: statusColors[r.status] }}>
                  {statusLabels[r.status]}
                </span>
              </span>
            </div>
          ))}
        </div>
        <button className="mt-auto w-full py-1.5 rounded-md text-[10px] font-semibold transition-colors" style={{ background: `${color}20`, color }}>
          Generate Reorder Draft
        </button>
      </div>
    </div>
  );
}

function PricingPreview({ color }) {
  const dots = [
    { x: 15, y: 72, status: 'under' },
    { x: 28, y: 58, status: 'under' },
    { x: 40, y: 48, status: 'at' },
    { x: 52, y: 42, status: 'at' },
    { x: 60, y: 32, status: 'at' },
    { x: 72, y: 28, status: 'over' },
    { x: 82, y: 15, status: 'over' },
    { x: 35, y: 65, status: 'under' },
    { x: 65, y: 22, status: 'over' },
    { x: 48, y: 52, status: 'at' },
  ];
  const dotColors = { under: '#00C27C', at: '#D4A03A', over: '#E87068' };
  return (
    <div className="min-h-[12rem] flex flex-col gap-2 text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-[#F0EDE8] text-[11px] uppercase tracking-wider">Price vs Market</span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00C27C]" />Under</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#D4A03A]" />At</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#E87068]" />Over</span>
        </div>
      </div>
      <div className="rounded-lg border border-[#38332B] bg-[#141210] p-3 flex-1 relative overflow-hidden">
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#6B6359]">Your Price</span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-[#6B6359]">Market</span>
        <svg className="absolute inset-3" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="5" y1="90" x2="95" y2="5" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4 3" />
          {dots.map((d, j) => (
            <circle key={j} cx={d.x} cy={d.y} r="3.5" fill={dotColors[d.status]} opacity="0.85" />
          ))}
        </svg>
        <div className="absolute bottom-2 right-3 left-10 flex items-center justify-end gap-3 text-[10px]">
          <span className="text-[#00C27C] font-semibold">3 under-priced</span>
          <span className="text-[#ADA599]">|</span>
          <span className="font-semibold" style={{ color }}>+$2.1K/mo opportunity</span>
        </div>
      </div>
    </div>
  );
}

function CustomerBridgePreview({ color }) {
  return (
    <div className="min-h-[12rem] flex flex-col gap-2 text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-[#F0EDE8] text-[11px] uppercase tracking-wider">Support Chat</span>
        <span className="flex items-center gap-1 text-[10px] text-[#ADA599]"><BookOpen className="w-3 h-3" /> KB Active</span>
      </div>
      <div className="rounded-lg border border-[#38332B] bg-[#141210] flex-1 flex overflow-hidden">
        <div className="flex-1 p-3 flex flex-col gap-2 justify-center">
          <div className="flex justify-end">
            <div className="px-2.5 py-1.5 rounded-lg rounded-br-sm bg-[#38332B] text-[11px] text-[#F0EDE8] max-w-[85%]">
              How do I set up METRC integration for my new location?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="px-2.5 py-1.5 rounded-lg rounded-bl-sm text-[11px] text-[#F0EDE8] max-w-[85%]" style={{ background: `${color}15`, borderLeft: `2px solid ${color}` }}>
              Go to <span className="font-semibold">Settings &gt; Integrations &gt; METRC</span>, enter your API key, then select the facility license. I can walk you through each step.
            </div>
          </div>
          <div className="flex justify-start items-center gap-1 text-[10px] text-[#ADA599] pl-1">
            <Bot className="w-3 h-3" style={{ color }} />
            <span>Sources: METRC Setup Guide, Admin Docs</span>
          </div>
        </div>
        <div className="w-24 border-l border-[#38332B] bg-[#1C1B1A] p-2 flex flex-col gap-1.5">
          <span className="text-[10px] text-[#6B6359] uppercase tracking-wider font-semibold">Sources</span>
          <div className="flex-1 flex flex-col gap-1">
            <div className="rounded px-1 py-0.5 text-[10px] text-[#ADA599] bg-[#141210] truncate">METRC Guide</div>
            <div className="rounded px-1 py-0.5 text-[10px] text-[#ADA599] bg-[#141210] truncate">Admin Docs</div>
            <div className="rounded px-1 py-0.5 text-[10px] text-[#ADA599] bg-[#141210] truncate">API Reference</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AGENT_PREVIEWS = [MarketingPreview, ConnectPreview, PricingPreview, CustomerBridgePreview];

/* ─── Agent block with individual scroll trigger ───────────── */
function AgentBlock({ agent, i }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const Icon = agent.icon;
  const isReversed = i % 2 === 1;
  return (
    <div ref={ref} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${agent.color}20` }}>
            <Icon className="w-5 h-5" style={{ color: agent.color }} />
          </div>
          <h3 className="text-2xl font-bold">{agent.name}</h3>
        </div>
        <p className="text-[#ADA599] mb-6 leading-relaxed">{agent.description}</p>
        <ul className="space-y-2 mb-6">
          {agent.capabilities.map((cap, j) => (
            <li key={j} className="flex items-center gap-2 text-sm text-[#F0EDE8]">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: agent.color }} />
              {cap}
            </li>
          ))}
        </ul>
        <Link
          to={agent.route}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: agent.color }}
        >
          Try {agent.name} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex-1 min-w-0 w-full">
        <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-6 relative overflow-hidden" style={{ boxShadow: `0 0 60px ${agent.color}18` }}>
          <div className="absolute inset-0 opacity-[0.07]" style={{ background: `radial-gradient(circle at 50% 50%, ${agent.color}, transparent 70%)` }} />
          <div className="relative">
            {React.createElement(AGENT_PREVIEWS[i], { color: agent.color })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Defaults ──────────────────────────────────────────────── */
const DEFAULT_CONTENT = {
  hero: {
    headline: 'See Every Insight. Automate Every Task. Grow Every Store.',
    subheadline: 'Practical AI built on $20B+ in cannabis transactions across 6,500+ retailers. Dutchie Nexus turns your data into insights, automates the busywork, and helps you grow revenue — all within the compliance framework your business requires.',
    cta: 'Book a Demo',
    badge: 'Powering 6,500+ dispensaries across 40+ markets',
  },
  pillars: [
    { title: 'Know Your Market', description: 'See how customers rate your flower, edibles, and service across Google, Leafly, and Weedmaps in one dashboard. Spot trends before they hit your bottom line.', icon: 'BarChart3' },
    { title: 'Automate the Busywork', description: 'Four AI agents handle reorder drafts, campaign creation, price optimization, and support tickets without manual effort. You review and approve — they execute.', icon: 'Brain' },
    { title: 'Stock Smarter', description: 'Get alerts before your top strains sell out, compare your pricing against the local market, and model margin scenarios in seconds. No more spreadsheet guesswork.', icon: 'ShoppingCart' },
    { title: 'Grow Revenue, Stay Compliant', description: 'Launch compliant SMS campaigns, win-back flows, and loyalty offers personalized to each segment. Every message respects your state\'s marketing regulations.', icon: 'Megaphone' },
  ],
  stats: [
    { value: '$20B+', label: 'Cannabis Sales Processed Annually', icon: 'TrendingUp' },
    { value: '6,500+', label: 'Retail & Brand Partners', icon: 'ShoppingCart' },
    { value: '40+', label: 'Markets Served', icon: 'MapPin' },
    { value: '85%', label: 'Less Time on Reporting', icon: 'Signal' },
    { value: '56%', label: 'Faster Campaign Launch', icon: 'Bot' },
    { value: '90%', label: 'Compliance Research Automated', icon: 'Shield' },
  ],
  testimonials: [
    { quote: 'We used to spend every Monday morning pulling reports from three different systems. Nexus cut that from 6 hours to 15 minutes — now we spend Mondays acting on insights, not assembling them.', author: 'Sarah Chen', company: 'VP of Operations, Ascend Wellness (IL)', metric: '-85% reporting time' },
    { quote: 'The pricing agent surfaced $4,200 in monthly margin we were leaving on the table — mostly on edibles we had underpriced versus the local market. It paid for itself in the first week.', author: 'Marcus Rivera', company: 'Regional Director, Ascend Wellness (NJ)', metric: '+$4.2K/mo margin' },
    { quote: 'Our SMS campaigns went from 2% conversion to 8.4% once we switched to AI-generated copy with smart segmentation. And every message is compliant out of the box — no more legal review bottlenecks.', author: 'Priya Patel', company: 'Marketing Lead, Ascend Wellness (MA)', metric: '4.2x conversion lift' },
  ],
  cta: {
    headline: 'Your Data Is Already Working. Put It to Work for You.',
    subheadline: 'See how Dutchie Nexus turns $20B+ in cannabis retail intelligence into actionable insights for your business — with compliance built in, not bolted on.',
    button: 'Book a Demo',
  },
};

const AGENTS = [
  { name: 'Marketing Campaigns', description: 'Generates full campaign plans with audience segmentation, multi-channel delivery, A/B testing, and compliance checks — all from a single prompt.', capabilities: ['AI-generated SMS & email copy', 'Smart audience segmentation', 'Revenue projections & ROI tracking', 'Cannabis compliance built-in'], route: '/agents/marketing', color: '#B598E8', icon: Megaphone },
  { name: 'Connect (Purchasing)', description: 'Monitors inventory levels, detects stockouts, discovers trending products, and generates purchase orders optimized for margin and velocity.', capabilities: ['Real-time stockout detection', 'Trending product discovery', 'Vendor comparison & negotiation', 'Margin-optimized reorder quantities'], route: '/agents/connect', color: '#64A8E0', icon: ShoppingCart },
  { name: 'Pricing Agent', description: 'Compares your prices to anonymous regional market data, models what-if scenarios, and suggests optimizations to maximize net revenue.', capabilities: ['Regional market price comparison', 'What-if scenario modeling', 'Discount performance analysis', 'Net revenue optimization'], route: '/agents/pricing', color: '#00C27C', icon: TrendingUp },
  { name: 'Nexus Chat', description: 'An AI support agent trained on Dutchie\'s full product knowledge base — answers operator questions instantly with step-by-step guidance.', capabilities: ['Instant product support', 'Troubleshooting workflows', 'Admin navigation guidance', 'Knowledge base–grounded answers'], route: '/agents/bridge', color: '#D4A03A', icon: Users },
];

const ICON_MAP = { Brain, BarChart3, ShoppingCart, Megaphone, MapPin, Users, Shield, Bot, Signal, TrendingUp };

/* ─── Integration logos (text-based placeholders) ──────────── */
const INTEGRATION_LOGOS = [
  { name: 'METRC', color: '#00C27C' },
  { name: 'BioTrack', color: '#64A8E0' },
  { name: 'Leafly', color: '#00C27C' },
  { name: 'Weedmaps', color: '#D4A03A' },
  { name: 'Dutchie POS', color: '#B598E8' },
  { name: 'Google Reviews', color: '#64A8E0' },
];

/* ─── AI prompt ─────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are an expert vertical SaaS copywriter for Dutchie Nexus — an AI-powered command center for multi-location cannabis retail operations. Platform: sentiment analysis, 4 AI agents (Marketing, Purchasing, Pricing, Customer Bridge), inventory intelligence, dynamic pricing, and marketing automation. Dutchie platform scale: $20B+ cannabis sales processed annually, 6,500+ retail and brand partners, 40+ markets. Pilot customer: Ascend Wellness Holdings (39+ locations, 7 states). Tone rules: (1) Anti-hype — use "practical," "proven," "trusted," never "revolutionary" or "game-changing." (2) Cannabis-specific language — mention strains, compliance, state regulations, seed-to-sale, METRC where relevant. (3) Human-in-the-loop — always convey "AI recommends, you decide." (4) Compliance-as-feature — compliance is a selling point, not a footnote. (5) Follow the UNDERSTAND > AUTOMATE > GROW value framework. Use concrete numbers and operational outcomes.`;

const USER_PROMPT = `Generate fresh marketing copy for the Dutchie Nexus landing page. Follow the UNDERSTAND > AUTOMATE > GROW framework. Use anti-hype tone (Veeva-style: "practical," "proven," "trusted"). Include human-in-the-loop messaging ("AI recommends, you decide"). Use cannabis-specific language (strains, compliance, state regulations). Return JSON matching this exact schema:
{
  "hero": {
    "headline": "Outcome-first headline (8-12 words, use Action Verb + Outcome formula)",
    "subheadline": "2-sentence value prop: open with data moat ($20B+, 6,500+ retailers), end with compliance promise (under 250 chars)",
    "cta": "CTA button text (2-4 words, action-oriented like 'Book a Demo')",
    "badge": "Platform scale signal (use Dutchie numbers: 6,500+ dispensaries, 40+ markets, $20B+ processed)"
  },
  "pillars": [
    { "title": "Know Your Market", "description": "2 sentences: what it does + what you gain. Use cannabis terms (flower, edibles, Leafly, Weedmaps)." },
    { "title": "Automate the Busywork", "description": "2 sentences: what it does + what you gain. Include human-in-the-loop (you approve, AI executes)." },
    { "title": "Stock Smarter", "description": "2 sentences: what it does + what you gain. Use terms like strains, margin, local market." },
    { "title": "Grow Revenue, Stay Compliant", "description": "2 sentences: what it does + what you gain. Mention compliance." }
  ],
  "stats": [
    { "value": "$20B+", "label": "short label for processed sales" },
    { "value": "6,500+", "label": "short label for partners" },
    { "value": "40+", "label": "short label for markets" },
    { "value": "85%", "label": "short label for time savings" },
    { "value": "56%", "label": "short label for speed improvement" },
    { "value": "90%", "label": "short label for automation" }
  ],
  "testimonials": [
    { "quote": "1-2 sentence testimonial with specific operational metric and cannabis context", "author": "Full Name", "company": "Title, Company (State)", "metric": "key metric badge" },
    { "quote": "...", "author": "...", "company": "...", "metric": "..." },
    { "quote": "...", "author": "...", "company": "...", "metric": "..." }
  ],
  "cta": {
    "headline": "Anti-hype closing headline (6-10 words, avoid 'transform' or 'revolutionize')",
    "subheadline": "1 sentence weaving data moat + compliance differentiator",
    "button": "CTA text (2-4 words)"
  }
}
Stats values must stay exactly as given — only change labels. Pillar titles must stay exactly as given. Make testimonials feel authentic with operational specifics (mention Monday meetings, specific product categories, compliance bottlenecks). Include job titles in testimonial company field. Be creative and vary the tone each time.`;

/* ─── Component ─────────────────────────────────────────────── */
export default function NexusLanding() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [aiReady, setAiReady] = useState(false);
  const scrolled = useScrolled(100);

  useEffect(() => {
    let cancelled = false;
    callGeminiJSON({ system: SYSTEM_PROMPT, prompt: USER_PROMPT, temperature: 0.7, maxTokens: 2048 })
      .then(data => {
        if (cancelled || !data) return;
        setContent(prev => ({
          hero: { ...prev.hero, ...data.hero },
          pillars: Array.isArray(data.pillars) ? data.pillars.map((p, i) => ({
            ...prev.pillars[i],
            title: p.title || prev.pillars[i].title,
            description: p.description || prev.pillars[i].description,
          })) : prev.pillars,
          stats: Array.isArray(data.stats) ? data.stats.map((s, i) => ({
            ...prev.stats[i],
            value: prev.stats[i].value,
            label: s.label || prev.stats[i].label,
          })) : prev.stats,
          testimonials: Array.isArray(data.testimonials) && data.testimonials.length >= 3
            ? data.testimonials.slice(0, 3).map((t, i) => ({ ...prev.testimonials[i], ...t }))
            : prev.testimonials,
          cta: { ...prev.cta, ...data.cta },
        }));
        setAiReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  const heroRef = useRef(null);
  const heroIn = true;
  const [pillarsRef, pillarsIn] = useInView();
  const [howRef, howIn] = useInView();
  const [statsRef, statsIn] = useInView();
  const [testimonialsRef, testimonialsIn] = useInView();
  const [complianceRef, complianceIn] = useInView();
  const [ctaRef, ctaIn] = useInView();

  const anim = (visible) => `transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 bg-[#0A0E14] text-[#F0EDE8] overflow-hidden">
      <style>{`
        .nexus-grid {
          background-image:
            linear-gradient(rgba(48,54,61,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(48,54,61,0.3) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        .nexus-glow-green {
          background: radial-gradient(600px circle at 50% 40%, rgba(0,194,124,0.12), transparent 70%);
        }
        .nexus-glow-purple {
          background: radial-gradient(400px circle at 80% 20%, rgba(163,113,247,0.08), transparent 70%);
        }
        .nexus-glow-blue {
          background: radial-gradient(400px circle at 20% 60%, rgba(100,168,224,0.06), transparent 70%);
        }
      `}</style>

      {/* ═══ STICKY NAV ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0E14]/80 backdrop-blur-lg border-b border-[#38332B]/50 shadow-lg shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00C27C]" />
            <span className="font-bold text-lg">Dutchie Nexus</span>
          </div>
          <div className={`flex items-center gap-4 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#00C27C] hover:bg-[#00A868] text-[#0A0E14] font-semibold text-sm transition-all"
            >
              Book a Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative nexus-grid opacity-100">
        <div className="nexus-glow-green absolute inset-0 pointer-events-none" />
        <div className="nexus-glow-purple absolute inset-0 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-36 md:pt-44 pb-20 md:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00C27C]/30 bg-[#00C27C]/10 text-[#00C27C] text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>{content.hero.badge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            {content.hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-[#ADA599] max-w-2xl mx-auto mb-10 leading-relaxed">
            {content.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00C27C] hover:bg-[#00A868] text-[#0A0E14] font-semibold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-[#00C27C]/20"
            >
              {content.hero.cta}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#agents"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[#38332B] bg-[#F0F6FC]/5 hover:bg-[#F0F6FC]/10 hover:border-[#38332B] text-[#F0EDE8] font-semibold text-lg transition-all hover:scale-[1.02]"
            >
              See It in Action
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ LOGO BAR ═══ */}
      <section className="relative py-10 border-y border-[#38332B]/40">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-[#6B6359] uppercase tracking-widest text-center mb-6 font-medium">Integrated with the tools you already use</p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {INTEGRATION_LOGOS.map((logo) => (
              <div key={logo.name} className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
                <div className="w-2 h-2 rounded-full" style={{ background: logo.color }} />
                <span className="text-sm font-semibold text-[#F0EDE8] tracking-wide">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PILLARS ═══ */}
      <section ref={pillarsRef} className="relative py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className={`text-sm font-semibold text-[#00C27C] uppercase tracking-widest mb-3 text-center transition-all duration-700 ${pillarsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Understand. Automate. Grow.</p>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 transition-all duration-700 ${pillarsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Practical AI Built for Cannabis Retail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.pillars.map((p, i) => {
              const IconComp = ICON_MAP[DEFAULT_CONTENT.pillars[i]?.icon] || Zap;
              const colors = ['#B598E8', '#64A8E0', '#00C27C', '#D4A03A'];
              const c = colors[i];
              const frameworkLabels = ['Understand', 'Automate', 'Automate', 'Grow'];
              return (
                <div
                  key={i}
                  className={`group p-6 rounded-2xl border border-[#38332B] bg-[#141210] hover:border-[#38332B] transition-[opacity,transform] duration-700 hover:-translate-y-1 hover:transition-transform hover:duration-200 ${pillarsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: pillarsIn ? `${i * 100}ms` : '0ms' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${c}15` }}>
                      <IconComp className="w-6 h-6" style={{ color: c }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ color: c, background: `${c}10` }}>{frameworkLabels[i]}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-[#ADA599] text-sm leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={howRef} className={`relative py-24 bg-[#141210] ${anim(howIn)}`}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-[#00C27C] uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">Three Steps. No Integration Project.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Connect Your Data', desc: 'Nexus is native to Dutchie — your POS, ecommerce, and menu data flows in automatically. No CSV exports, no API keys, no IT project.', icon: Zap, color: '#B598E8' },
              { step: '2', title: 'AI Analyzes & Recommends', desc: 'Four agents benchmark your store against $20B+ in anonymized market data, then draft campaigns, reorder lists, and pricing changes for your review.', icon: Brain, color: '#64A8E0' },
              { step: '3', title: 'You Approve & Execute', desc: 'Review every recommendation before it goes live. Full audit trail, state-level compliance checks, and one-click execution. You stay in control.', icon: Check, color: '#00C27C' },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${s.color}15` }}>
                  <s.icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0A0E14] border-2 flex items-center justify-center text-xs font-bold" style={{ borderColor: s.color, color: s.color }}>{s.step}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[#ADA599] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AGENT SHOWCASE ═══ */}
      <section id="agents" className="relative py-24">
        <div className="nexus-glow-blue absolute inset-0 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-sm font-semibold text-[#00C27C] uppercase tracking-widest mb-3 text-center">Powered by Dutchie Intelligence</p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Four Agents That Work. You Approve.</h2>
          <p className="text-[#ADA599] text-center max-w-2xl mx-auto mb-16">Each agent analyzes your data, drafts a recommendation, and waits for your sign-off. No black boxes. Full audit trail.</p>
          <div className="space-y-20">
            {AGENTS.map((agent, i) => (
              <AgentBlock key={i} agent={agent} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MID-PAGE CTA ═══ */}
      <section className="relative py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="p-8 rounded-2xl border border-[#00C27C]/20 bg-[#00C27C]/5">
            <h3 className="text-xl md:text-2xl font-bold mb-3">See Nexus in action with your data</h3>
            <p className="text-[#ADA599] mb-6">Get a personalized walkthrough showing how Nexus works with your store, your state's regulations, and your product mix.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00C27C] hover:bg-[#00A868] text-[#0A0E14] font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-[#00C27C]/20"
              >
                Book a Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#38332B] bg-[#F0F6FC]/5 hover:bg-[#F0F6FC]/10 text-[#F0EDE8] font-semibold transition-all"
              >
                <Play className="w-4 h-4" />
                Explore the Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section ref={statsRef} className={`relative py-24 ${anim(statsIn)}`}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm font-semibold text-[#00C27C] uppercase tracking-widest mb-3 text-center">The Dutchie Data Advantage</p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Your Benchmarks Come From Real Transactions, Not Surveys</h2>
          <p className="text-[#ADA599] text-center max-w-2xl mx-auto mb-16">Because Dutchie powers the transaction for thousands of dispensaries, Nexus benchmarks your performance against real market data — not estimates or panel samples.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {content.stats.map((s, i) => {
              const IconComp = ICON_MAP[DEFAULT_CONTENT.stats[i]?.icon] || Zap;
              return (
                <div key={i} className="text-center p-6 rounded-2xl border border-[#38332B] bg-[#141210]">
                  <IconComp className="w-6 h-6 text-[#00C27C] mx-auto mb-3 opacity-60" />
                  <div className="text-3xl md:text-4xl font-extrabold text-[#00C27C] mb-1">
                    <AnimatedStat value={s.value} inView={statsIn} />
                  </div>
                  <div className="text-xs text-[#ADA599] uppercase tracking-wider">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section ref={testimonialsRef} className={`relative py-24 bg-[#141210] ${anim(testimonialsIn)}`}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm font-semibold text-[#00C27C] uppercase tracking-widest mb-3 text-center">Operator Results</p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Measured in Margin, Not Promises</h2>
          <p className="text-[#ADA599] text-center mb-16">Results from Ascend Wellness Holdings — 39 locations across 7 states.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-[#38332B] bg-[#1C1B1A] flex flex-col">
                <Quote className="w-8 h-8 text-[#D4A03A] opacity-60 mb-4 flex-shrink-0" />
                <p className="text-[#F0EDE8] leading-relaxed flex-1 mb-6 text-sm md:text-base">"{t.quote}"</p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-sm font-semibold">{t.author}</p>
                    <p className="text-xs text-[#ADA599]">{t.company}</p>
                  </div>
                  <span className="text-xs font-bold text-[#00C27C] bg-[#00C27C]/10 px-2 py-1 rounded">{t.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPLIANCE (moved after testimonials — objection handler before CTA) ═══ */}
      <section ref={complianceRef} className={`relative py-24 ${anim(complianceIn)}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-[#00C27C] uppercase tracking-widest mb-3">Compliance Built In</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">AI That Respects Your License</h2>
          <p className="text-lg text-[#ADA599] max-w-2xl mx-auto mb-16">
            Every recommendation Dutchie Nexus makes is filtered through your state's regulatory requirements.
            It won't suggest campaigns that violate marketing rules, prices that break compliance thresholds,
            or inventory moves that conflict with seed-to-sale tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[#38332B] bg-[#141210] hover:border-[#38332B] hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 rounded-xl bg-[#64A8E0]/10 flex items-center justify-center mx-auto mb-5">
                <Shield className="w-7 h-7 text-[#64A8E0]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">State-Specific Rules</h3>
              <p className="text-sm text-[#ADA599]">Configured for IL, MA, MD, MI, NJ, OH, PA and more — each state's marketing restrictions, purchase limits, and reporting requirements.</p>
            </div>
            <div className="p-6 rounded-2xl border border-[#38332B] bg-[#141210] hover:border-[#38332B] hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 rounded-xl bg-[#64A8E0]/10 flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7 text-[#64A8E0]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">You Review. You Approve.</h3>
              <p className="text-sm text-[#ADA599]">AI generates recommendations. Your team makes the final call. Full audit trail on every action.</p>
            </div>
            <div className="p-6 rounded-2xl border border-[#38332B] bg-[#141210] hover:border-[#38332B] hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 rounded-xl bg-[#64A8E0]/10 flex items-center justify-center mx-auto mb-5">
                <RotateCw className="w-7 h-7 text-[#64A8E0]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Seed-to-Sale Integrated</h3>
              <p className="text-sm text-[#ADA599]">Works within your existing METRC and BioTrack workflows. No parallel systems, no compliance gaps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} className="relative nexus-grid py-28 opacity-100">
        <div className="nexus-glow-green absolute inset-0 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          {/* Pull-quote */}
          <div className="mb-10 max-w-xl mx-auto">
            <Quote className="w-6 h-6 text-[#D4A03A] opacity-60 mx-auto mb-3" />
            <p className="text-[#F0EDE8] italic leading-relaxed text-sm md:text-base">
              "{content.testimonials[1].quote}"
            </p>
            <p className="text-xs text-[#ADA599] mt-2">{content.testimonials[1].author}, {content.testimonials[1].company}</p>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{content.cta.headline}</h2>
          <p className="text-[#ADA599] text-lg mb-8">{content.cta.subheadline}</p>

          {/* Trust signals row */}
          <div className="flex items-center justify-center gap-3 flex-wrap text-sm text-[#ADA599] mb-8">
            <span className="font-semibold text-[#F0EDE8]">$20B+ processed</span>
            <span className="text-[#6B6359] hidden sm:inline">&bull;</span>
            <span className="font-semibold text-[#F0EDE8]">6,500+ retailers</span>
            <span className="text-[#6B6359] hidden sm:inline">&bull;</span>
            <span className="font-semibold text-[#F0EDE8]">40+ markets</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00C27C] hover:bg-[#00A868] text-[#0A0E14] font-semibold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-[#00C27C]/20"
            >
              {content.cta.button}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[#38332B] bg-[#F0F6FC]/5 hover:bg-[#F0F6FC]/10 text-[#F0EDE8] font-semibold text-lg transition-all"
            >
              <Play className="w-4 h-4" />
              Explore the Demo
            </Link>
          </div>

          {/* Pricing signal */}
          <p className="text-xs text-[#6B6359] mt-6">Available for all Dutchie retailers — from single-location operators to enterprise MSOs.</p>
        </div>
      </section>

      {/* Data privacy trust signal */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-sm text-[#ADA599]">
          <Lock className="w-4 h-4 inline mr-1 opacity-60" />
          Your data stays yours. Dutchie Nexus processes insights within Dutchie's secure infrastructure.
          Your transaction data is never shared with competitors, third parties, or used to train models outside your account.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-[#38332B] bg-[#141210]/40 py-8 text-center text-sm text-[#6B6359] space-y-2">
        <p>AI recommendations require operator review and approval. Dutchie Nexus is configured for your state's specific regulatory requirements.</p>
        <p>&copy; 2026 Dutchie. All data referenced reflects platform-wide metrics. Individual results may vary.</p>
      </div>
    </div>
  );
}
