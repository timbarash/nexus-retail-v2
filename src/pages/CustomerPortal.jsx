import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Ticket, Bug, Lightbulb, Rocket, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock,
  Receipt, DollarSign, CheckCircle2, ShoppingCart, Monitor, CreditCard,
  BarChart3, Sparkles, Smartphone, Calendar, FileText, Download,
  Megaphone, Tag, Zap, Gift, ArrowRight, Package, ExternalLink,
  Shield, Gauge, Users, Star, BookOpen, MessageCircle, Send, X, Headphones,
  AlertTriangle, Video, Check,
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import { usePortal } from '../contexts/PortalContext';
import {
  KNOWLEDGE_BASE, searchKB, detectIntent, synthesizeResponse,
  generateTicketId, KBArticleCard, BugReportCard, BugDetailGatherer,
} from './CustomerBridge';
import { generateBridgeResponse, isGeminiAvailable } from '../utils/gemini';

/* ═══════════════════════════════════════════════════════════════════
   SHARED CONFIG
   ═══════════════════════════════════════════════════════════════════ */

const TYPE_CONFIG = {
  ticket: { label: 'Ticket', icon: Ticket, color: '#64A8E0', bg: 'rgba(100,168,224,0.12)' },
  bug: { label: 'Bug Report', icon: Bug, color: '#D4A03A', bg: 'rgba(212,160,58,0.12)' },
  feature: { label: 'Feature', icon: Lightbulb, color: '#B598E8', bg: 'rgba(181,152,232,0.12)' },
  demo: { label: 'Demo', icon: Rocket, color: '#00C27C', bg: 'rgba(0,194,124,0.12)' },
};

const STATUS_CONFIG = {
  Open: { color: '#64A8E0', bg: 'rgba(100,168,224,0.12)' },
  'In Progress': { color: '#D4A03A', bg: 'rgba(212,160,58,0.12)' },
  Resolved: { color: '#00C27C', bg: 'rgba(0,194,124,0.12)' },
  Submitted: { color: '#B598E8', bg: 'rgba(181,152,232,0.12)' },
};

const PRIORITY_INDICATOR = {
  High: { dot: 'bg-[#E87068]', label: 'High' },
  Medium: { dot: 'bg-[#D4A03A]', label: 'Med' },
  Low: { dot: 'bg-[#8B949E]', label: 'Low' },
};

const INTERACTION_TABS = [
  { key: 'all', label: 'All' },
  { key: 'ticket', label: 'Tickets' },
  { key: 'bug', label: 'Bugs' },
  { key: 'feature', label: 'Features' },
  { key: 'demo', label: 'Demos' },
];

/* ═══════════════════════════════════════════════════════════════════
   BILLING DATA
   ═══════════════════════════════════════════════════════════════════ */

const PRODUCT_CATALOG = {
  ecommerce:  { name: 'Dutchie Ecommerce', icon: ShoppingCart, color: '#00C27C', tier: 'Core', monthlyFee: 799 },
  pos:        { name: 'Dutchie POS', icon: Monitor, color: '#64A8E0', tier: 'Core', monthlyFee: 599 },
  payments:   { name: 'Dutchie Pay', icon: CreditCard, color: '#B598E8', tier: 'Core', monthlyFee: 349 },
  analytics:  { name: 'Advanced Analytics', icon: BarChart3, color: '#00C27C', tier: 'Core', monthlyFee: 199 },
};

const ADDON_CATALOG = {
  whiteLabel: { name: 'White Label App', icon: Smartphone, color: '#EC4899', tier: 'Premium', monthlyFee: 499 },
  menuBoards: { name: 'Digital Menu Boards', icon: Monitor, color: '#0EA5E9', tier: 'Premium', monthlyFee: 149 },
  b2cAI:      { name: 'B2C AI Suite', icon: Sparkles, color: '#F97316', tier: 'AI', monthlyFee: 299 },
};

function generateBillingHistory() {
  const now = new Date();
  const bills = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const isCurrentMonth = i === 0;
    const coreProducts = Object.entries(PRODUCT_CATALOG).map(([key, p]) => ({
      key, name: p.name, icon: p.icon, color: p.color, tier: p.tier, amount: p.monthlyFee,
    }));
    // Addons ramping up: older months have fewer addons
    const addonEntries = Object.entries(ADDON_CATALOG);
    const addonsActive = i <= 1 ? addonEntries.slice(0, 2) : i <= 3 ? addonEntries.slice(0, 1) : [];
    const addonProducts = addonsActive.map(([key, p]) => ({
      key, name: p.name, icon: p.icon, color: p.color, tier: p.tier, amount: p.monthlyFee,
    }));
    const lineItems = [...coreProducts, ...addonProducts];
    const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
    // 3-location multiplier for POS
    const locationMultiplier = 3;
    const posIdx = lineItems.findIndex(li => li.key === 'pos');
    if (posIdx >= 0) {
      lineItems[posIdx] = { ...lineItems[posIdx], amount: lineItems[posIdx].amount * locationMultiplier, locations: locationMultiplier };
    }
    const total = lineItems.reduce((s, li) => s + li.amount, 0);

    bills.push({
      id: `inv-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      date: date.toISOString(),
      monthLabel: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      status: isCurrentMonth ? 'Current' : 'Paid',
      lineItems,
      total,
    });
  }
  return bills;
}

const BILLING_HISTORY = generateBillingHistory();

/* ═══════════════════════════════════════════════════════════════════
   RELEASE NOTES DATA
   ═══════════════════════════════════════════════════════════════════ */

const RELEASE_NOTES = [
  {
    id: 'rel-1',
    version: 'v4.12.0',
    title: 'Loyalty Points at Checkout',
    summary: 'View and redeem loyalty points right from the POS.',
    description: 'Budtenders can now view and redeem customer loyalty points directly from the POS checkout screen. Points balance, tier status, and available rewards are displayed in real time. Customers earn points on every purchase and can redeem toward discounts or free products.',
    highlights: ['Real-time points balance display', 'Tier status and rewards visible at checkout', 'One-tap redemption for budtenders'],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'POS',
    categoryColor: '#64A8E0',
    icon: Gift,
    tags: ['loyalty', 'points', 'checkout', 'pos', 'rewards', 'budtender', 'customer'],
    docUrl: 'https://business.dutchie.com/pos',
  },
  {
    id: 'rel-2',
    version: 'v4.11.0',
    title: 'Scheduled SMS Campaigns',
    summary: 'Plan and schedule SMS campaigns up to 30 days out.',
    description: 'You can now schedule SMS campaigns up to 30 days in advance. Set one-time or recurring sends with audience segmentation and preview before publishing. Includes A/B subject line testing and compliance auto-checks for cannabis marketing regulations.',
    highlights: ['Schedule up to 30 days in advance', 'Recurring send options', 'Audience segmentation with filters', 'Compliance auto-checks'],
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Marketing',
    categoryColor: '#00C27C',
    icon: Megaphone,
    tags: ['sms', 'campaign', 'schedule', 'scheduling', 'bulk', 'marketing', 'recurring'],
    docUrl: 'https://business.dutchie.com/marketing',
  },
  {
    id: 'rel-3',
    version: 'v4.10.2',
    title: 'Menu Board Auto-Sync',
    summary: 'Menu boards now sync inventory and pricing in real time.',
    description: 'Digital Menu Boards now auto-sync inventory and pricing changes within 60 seconds. No more manual refreshes — out-of-stock items are hidden automatically. Supports multi-location boards with per-store pricing and availability.',
    highlights: ['60-second auto-sync', 'Auto-hide out-of-stock items', 'Per-location pricing support'],
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Menu Boards',
    categoryColor: '#0EA5E9',
    icon: Monitor,
    tags: ['menu', 'boards', 'display', 'inventory', 'pricing', 'sync', 'signage'],
    docUrl: 'https://business.dutchie.com/ecommerce',
  },
  {
    id: 'rel-4',
    version: 'v4.10.0',
    title: 'Bulk Inventory CSV Import v2',
    summary: 'Redesigned CSV import with validation and rollback.',
    description: 'Redesigned CSV import with duplicate SKU detection, validation previews, and rollback support. Import up to 10,000 SKUs in a single upload. Error rows are highlighted for quick correction without re-uploading the entire file.',
    highlights: ['Duplicate SKU detection', 'Validation preview before commit', 'Rollback support', 'Up to 10,000 SKUs per upload'],
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Inventory',
    categoryColor: '#D4A03A',
    icon: Package,
    tags: ['inventory', 'csv', 'import', 'bulk', 'sku', 'stock'],
    docUrl: 'https://business.dutchie.com/pos',
  },
  {
    id: 'rel-5',
    version: 'v4.9.0',
    title: 'AI Product Recommendations',
    summary: 'Personalized product suggestions on your ecommerce storefront.',
    description: 'B2C AI Suite now powers personalized product recommendations on your ecommerce storefront based on customer purchase history and browsing behavior. Includes "Customers also bought" carousels, strain preference matching, and AI-powered reorder reminders.',
    highlights: ['"Customers also bought" carousels', 'Strain preference matching', 'AI-powered reorder reminders', '+18% avg basket size in beta'],
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'AI',
    categoryColor: '#F97316',
    icon: Sparkles,
    tags: ['ai', 'recommendation', 'ecommerce', 'personalized', 'product', 'customer'],
    docUrl: 'https://business.dutchie.com/ecommerce',
  },
  {
    id: 'rel-6',
    version: 'v4.8.5',
    title: 'POS Discount Stacking Fix',
    summary: 'Fixed incorrect stacking of BOGO and percentage discounts.',
    description: 'Fixed an issue where BOGO deals and percentage discounts could incorrectly stack on the same item. Discount priority rules are now enforced at checkout with clear visual indicators showing which discounts are applied.',
    highlights: ['Discount priority enforcement', 'Visual applied-discount indicators', 'Correct BOGO + percentage handling'],
    date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'POS',
    categoryColor: '#64A8E0',
    icon: Tag,
    tags: ['discount', 'bogo', 'stacking', 'pos', 'checkout', 'fix', 'pricing'],
    docUrl: 'https://business.dutchie.com/pos',
  },
  {
    id: 'rel-7',
    version: 'v4.8.0',
    title: 'Advanced Analytics Dashboards',
    summary: 'Custom dashboards with drag-and-drop widgets and email reports.',
    description: 'New customizable dashboards with drag-and-drop widgets, scheduled email reports, and per-location performance comparisons. Pin your most important metrics and share dashboards across your team.',
    highlights: ['Drag-and-drop widget builder', 'Scheduled email reports', 'Per-location comparisons', 'Team dashboard sharing'],
    date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Analytics',
    categoryColor: '#00C27C',
    icon: BarChart3,
    tags: ['analytics', 'dashboard', 'report', 'performance', 'location', 'insights'],
    docUrl: 'https://business.dutchie.com/analytics',
  },
  {
    id: 'rel-8',
    version: 'v4.7.0',
    title: 'Pay-by-Bank Integration',
    summary: 'ACH bank transfers with zero processing fees.',
    description: 'Dutchie Pay now supports ACH bank transfers at checkout with zero processing fees. Customers link their bank account once for seamless future payments. Supports real-time verification and instant confirmation receipts.',
    highlights: ['Zero processing fees', 'One-time bank account linking', 'Real-time verification', 'Instant confirmation receipts'],
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Payments',
    categoryColor: '#B598E8',
    icon: CreditCard,
    tags: ['payment', 'bank', 'ach', 'checkout', 'fee', 'processing'],
    docUrl: 'https://business.dutchie.com/payments',
  },
  {
    id: 'rel-9',
    version: 'v4.6.0',
    title: 'Multi-Location Staff Permissions',
    summary: 'Granular role-based access control across all your locations.',
    description: 'Admins can now set granular, role-based permissions that apply across one or many locations. Create custom roles like "Inventory Manager" or "Shift Lead" with specific POS, reporting, and admin access levels. Includes audit logs for all permission changes.',
    highlights: ['Custom role builder', 'Per-location permission scoping', 'Audit log for changes', 'Bulk role assignment'],
    date: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Platform',
    categoryColor: '#8B949E',
    icon: Shield,
    tags: ['permission', 'role', 'staff', 'location', 'admin', 'security', 'access'],
    docUrl: 'https://business.dutchie.com/pos',
  },
  {
    id: 'rel-10',
    version: 'v4.5.5',
    title: 'Ecommerce Page Speed Boost',
    summary: 'Storefront pages now load 40% faster with optimized rendering.',
    description: 'Major performance improvements to the Dutchie Ecommerce storefront. Product listing and detail pages load 40% faster through image optimization, lazy loading, and edge caching. Mobile performance scores improved from 65 to 92 on Lighthouse.',
    highlights: ['40% faster page loads', 'Optimized image delivery', 'Edge caching for static assets', 'Mobile Lighthouse score: 92'],
    date: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Ecommerce',
    categoryColor: '#00C27C',
    icon: Gauge,
    tags: ['ecommerce', 'performance', 'speed', 'page', 'loading', 'mobile', 'storefront'],
    docUrl: 'https://business.dutchie.com/ecommerce',
  },
  {
    id: 'rel-11',
    version: 'v4.5.0',
    title: 'Customer 360 Profile',
    summary: 'Unified customer view with purchase history, preferences, and loyalty.',
    description: 'A new unified customer profile combining purchase history, product preferences, loyalty status, and communication history. Accessible from POS during checkout and from the admin panel. Helps budtenders personalize every interaction.',
    highlights: ['Unified purchase history', 'Product preference tracking', 'Loyalty + communication timeline', 'POS quick-access during checkout'],
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Platform',
    categoryColor: '#8B949E',
    icon: Users,
    tags: ['customer', 'profile', 'purchase', 'history', 'loyalty', 'preference', 'budtender'],
    docUrl: 'https://business.dutchie.com/pos',
  },
];

function matchReleaseNotes(featureRequests) {
  if (!featureRequests.length) return RELEASE_NOTES.slice(0, 5);

  const scored = RELEASE_NOTES.map(release => {
    let score = 0;
    const matchedRequests = [];
    featureRequests.forEach(fr => {
      const text = `${fr.title} ${fr.description}`.toLowerCase();
      const hits = release.tags.filter(tag => text.includes(tag));
      if (hits.length > 0) {
        score += hits.length;
        matchedRequests.push({ ticketId: fr.ticketId, title: fr.title, hits: hits.length });
      }
    });
    return { ...release, score, matchedRequests };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTION ROW
   ═══════════════════════════════════════════════════════════════════ */

function InteractionRow({ interaction }) {
  const [expanded, setExpanded] = useState(false);
  const type = TYPE_CONFIG[interaction.type] || TYPE_CONFIG.ticket;
  const status = STATUS_CONFIG[interaction.status] || STATUS_CONFIG.Open;
  const priority = PRIORITY_INDICATOR[interaction.priority] || PRIORITY_INDICATOR.Medium;
  const TypeIcon = type.icon;

  return (
    <div className="border border-[#38332B] rounded-lg bg-[#1C1B1A] hover:border-[#38332B] transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: type.bg }}>
          <TypeIcon className="w-4 h-4" style={{ color: type.color }} />
        </div>
        <span className="flex-shrink-0 text-xs font-mono text-[#ADA599] w-16">{interaction.ticketId}</span>
        <span className="flex-1 text-sm text-[#F0EDE8] truncate min-w-0">{interaction.title}</span>
        <span
          className="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: status.bg, color: status.color }}
        >
          {interaction.status}
        </span>
        <div className="flex-shrink-0 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
          <span className="text-[11px] text-[#ADA599]">{priority.label}</span>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-[#6B6359] w-16 justify-end">
          <Clock className="w-3 h-3" />
          <span className="text-[11px]">{relativeTime(interaction.createdAt)}</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#6B6359] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6B6359] flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#38332B]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ background: type.bg, color: type.color }}>
              {type.label}
            </span>
            <span className="text-xs text-[#6B6359]">Created {new Date(interaction.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-[#ADA599] whitespace-pre-wrap">{interaction.description}</p>
          {interaction.screenshotData && (
            <div className="mt-3">
              <p className="text-[11px] text-[#6B6359] uppercase tracking-wider font-medium mb-1.5">Attachment</p>
              <img
                src={interaction.screenshotData}
                alt="Attached screenshot"
                className="max-h-64 rounded-lg border border-[#38332B] cursor-pointer hover:border-[#38332B] transition-colors"
                onClick={() => window.open(interaction.screenshotData, '_blank')}
              />
            </div>
          )}
          {interaction.productKey && (
            <p className="mt-2 text-xs text-[#ADA599]">Product: <span className="text-[#F0EDE8]">{interaction.productKey}</span></p>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INVOICE ROW
   ═══════════════════════════════════════════════════════════════════ */

function InvoiceRow({ invoice }) {
  const [expanded, setExpanded] = useState(false);
  const isCurrent = invoice.status === 'Current';

  return (
    <div className="border border-[#38332B] rounded-lg bg-[#1C1B1A] hover:border-[#38332B] transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${isCurrent ? 'bg-[rgba(100,168,224,0.12)]' : 'bg-[rgba(0,194,124,0.12)]'}`}>
          <FileText className={`w-4.5 h-4.5 ${isCurrent ? 'text-[#64A8E0]' : 'text-[#00C27C]'}`} />
        </div>

        {/* Invoice ID */}
        <span className="flex-shrink-0 text-xs font-mono text-[#ADA599] w-24">{invoice.id}</span>

        {/* Month */}
        <span className="flex-1 text-sm font-medium text-[#F0EDE8]">{invoice.monthLabel}</span>

        {/* Product count */}
        <span className="flex-shrink-0 text-[11px] text-[#ADA599]">{invoice.lineItems.length} items</span>

        {/* Status */}
        <span
          className={`flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${
            isCurrent
              ? 'bg-[rgba(100,168,224,0.12)] text-[#64A8E0]'
              : 'bg-[rgba(0,194,124,0.12)] text-[#00C27C]'
          }`}
        >
          {isCurrent ? 'Current' : 'Paid'}
        </span>

        {/* Total */}
        <span className="flex-shrink-0 text-sm font-semibold text-[#F0EDE8] w-20 text-right">
          {formatCurrency(invoice.total)}
        </span>

        {/* Chevron */}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#6B6359] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6B6359] flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#38332B]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#6B6359]" />
              <span className="text-xs text-[#6B6359]">Billing period: {invoice.monthLabel}</span>
            </div>
            {!isCurrent && (
              <div className="flex items-center gap-1 text-[#00C27C]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Paid</span>
              </div>
            )}
          </div>

          {/* Line items */}
          <div className="space-y-1">
            {invoice.lineItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141210] border border-[#38332B]/50">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: item.color + '18' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#F0EDE8] truncate">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: item.color + '15', color: item.color }}>
                        {item.tier}
                      </span>
                      {item.locations && (
                        <span className="text-[10px] text-[#ADA599]">{item.locations} locations</span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#F0EDE8] flex-shrink-0">{formatCurrency(item.amount)}</span>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#38332B]">
            <span className="text-xs font-medium text-[#ADA599]">Monthly Total</span>
            <span className="text-base font-bold text-[#F0EDE8]">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RELEASE NOTES PANEL
   ═══════════════════════════════════════════════════════════════════ */

function ReleaseNoteCard({ release }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = release.icon;
  const hasMatches = release.matchedRequests && release.matchedRequests.length > 0;

  return (
    <div className={`rounded-lg border transition-all ${hasMatches ? 'border-[#B598E8]/30 bg-[#B598E8]/[0.04]' : 'border-[#38332B] bg-[#141210]'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3.5 py-3"
      >
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: release.categoryColor + '18' }}>
            <Icon className="w-3.5 h-3.5" style={{ color: release.categoryColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono text-[#6B6359]">{release.version}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: release.categoryColor + '15', color: release.categoryColor }}>
                {release.category}
              </span>
            </div>
            <p className="text-xs font-medium text-[#F0EDE8] leading-snug">{release.title}</p>
            <p className="text-[10px] text-[#6B6359] mt-0.5">{relativeTime(release.date)}</p>
            {hasMatches && (
              <div className="mt-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#B598E8]" />
                <span className="text-[10px] font-medium text-[#B598E8]">
                  Related to {release.matchedRequests.length === 1 ? 'your request' : `${release.matchedRequests.length} requests`}
                </span>
              </div>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#6B6359] flex-shrink-0 mt-1" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#6B6359] flex-shrink-0 mt-1" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="px-3.5 pb-3 pt-0">
          <p className="text-xs text-[#ADA599] leading-relaxed mb-2">{release.description}</p>
          {hasMatches && (
            <div className="space-y-1">
              <p className="text-[10px] text-[#6B6359] uppercase tracking-wider font-medium">Related requests</p>
              {release.matchedRequests.map(mr => (
                <div key={mr.ticketId} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#B598E8]/[0.06] border border-[#B598E8]/10">
                  <Lightbulb className="w-3 h-3 text-[#B598E8] flex-shrink-0" />
                  <span className="text-[10px] font-mono text-[#ADA599] flex-shrink-0">{mr.ticketId}</span>
                  <span className="text-[10px] text-[#F0EDE8] truncate">{mr.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReleaseNotesPanel({ featureRequests }) {
  const scored = useMemo(() => matchReleaseNotes(featureRequests), [featureRequests]);
  const relevant = scored.filter(r => r.score > 0);
  const other = scored.filter(r => r.score === 0);

  return (
    <div className="border border-[#38332B] rounded-xl bg-[#1C1B1A] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#38332B] flex items-center gap-2">
        <Megaphone className="w-4 h-4 text-[#00C27C]" />
        <h3 className="text-sm font-semibold text-[#F0EDE8]">Recent Releases</h3>
        <span className="ml-auto text-[10px] text-[#6B6359]">{RELEASE_NOTES.length} updates</span>
      </div>

      <div className="p-3 space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {/* Relevant releases first */}
        {relevant.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 px-1 mb-1">
              <Zap className="w-3 h-3 text-[#B598E8]" />
              <span className="text-[10px] font-semibold text-[#B598E8] uppercase tracking-wider">Related to your requests</span>
            </div>
            {relevant.map(release => (
              <ReleaseNoteCard key={release.id} release={release} />
            ))}
          </>
        )}

        {/* Other releases */}
        {other.length > 0 && (
          <>
            {relevant.length > 0 && (
              <div className="flex items-center gap-1.5 px-1 mt-3 mb-1">
                <Package className="w-3 h-3 text-[#6B6359]" />
                <span className="text-[10px] font-semibold text-[#6B6359] uppercase tracking-wider">Other updates</span>
              </div>
            )}
            {other.map(release => (
              <ReleaseNoteCard key={release.id} release={release} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIONS SECTION
   ═══════════════════════════════════════════════════════════════════ */

function InteractionsSection({ interactions }) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return interactions;
    return interactions.filter(i => i.type === activeTab);
  }, [interactions, activeTab]);

  const featureRequests = useMemo(() => interactions.filter(i => i.type === 'feature'), [interactions]);
  const showReleaseNotes = activeTab === 'feature';

  const counts = useMemo(() => ({
    tickets: interactions.filter(i => i.type === 'ticket' && i.status !== 'Resolved').length,
    bugs: interactions.filter(i => i.type === 'bug' && i.status !== 'Resolved').length,
    features: interactions.filter(i => i.type === 'feature').length,
    demos: interactions.filter(i => i.type === 'demo' && i.status !== 'Resolved').length,
  }), [interactions]);

  return (
    <>
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Open Tickets" value={counts.tickets} icon={Ticket} color="blue" />
        <MetricCard title="Bug Reports" value={counts.bugs} icon={Bug} color="amber" />
        <MetricCard title="Feature Requests" value={counts.features} icon={Lightbulb} color="purple" />
        <MetricCard title="Demo Requests" value={counts.demos} icon={Rocket} color="dutchie" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-[#38332B]">
        {INTERACTION_TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                isActive ? 'text-[#F0EDE8]' : 'text-[#ADA599] hover:text-[#F0EDE8]'
              }`}
            >
              {tab.label}
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C27C] rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Interaction list — two-column when Features tab active */}
      {showReleaseNotes ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          {/* Feature requests */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-16 border border-[#38332B] rounded-xl bg-[#1C1B1A]">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgba(139,148,158,0.1)] flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-[#6B6359]" />
                </div>
                <p className="text-[#ADA599] text-sm">No feature requests yet</p>
                <p className="text-[#6B6359] text-xs mt-1">Submit feature requests via Nexus Chat</p>
              </div>
            ) : (
              filtered.map(interaction => (
                <InteractionRow key={interaction.id} interaction={interaction} />
              ))
            )}
          </div>
          {/* Release notes sidebar */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <ReleaseNotesPanel featureRequests={featureRequests} />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-[#38332B] rounded-xl bg-[#1C1B1A]">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgba(139,148,158,0.1)] flex items-center justify-center">
                <Ticket className="w-6 h-6 text-[#6B6359]" />
              </div>
              <p className="text-[#ADA599] text-sm">No {activeTab === 'all' ? '' : activeTab} interactions yet</p>
              <p className="text-[#6B6359] text-xs mt-1">Interactions created via Nexus Chat will appear here</p>
            </div>
          ) : (
            filtered.map(interaction => (
              <InteractionRow key={interaction.id} interaction={interaction} />
            ))
          )}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BILLING SECTION
   ═══════════════════════════════════════════════════════════════════ */

function BillingSection() {
  const currentBill = BILLING_HISTORY[0];
  const activeProductCount = currentBill.lineItems.length;

  return (
    <>
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Current Monthly" value={formatCurrency(currentBill.total)} icon={DollarSign} color="dutchie" />
        <MetricCard title="Active Products" value={activeProductCount} icon={ShoppingCart} color="blue" />
        <MetricCard title="Invoices" value={BILLING_HISTORY.length} icon={FileText} color="purple" subtitle="Last 6 months" />
        <MetricCard
          title="Avg Monthly"
          value={formatCurrency(Math.round(BILLING_HISTORY.reduce((s, b) => s + b.total, 0) / BILLING_HISTORY.length))}
          icon={Receipt}
          color="amber"
        />
      </div>

      {/* Invoice list */}
      <div className="space-y-2">
        {BILLING_HISTORY.map(invoice => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   WHAT'S NEW — FULL-PAGE RELEASE NOTES
   ═══════════════════════════════════════════════════════════════════ */

function scoreReleasesAgainstAll(interactions) {
  return RELEASE_NOTES.map(release => {
    let score = 0;
    const matched = [];
    interactions.forEach(inter => {
      const text = `${inter.title} ${inter.description}`.toLowerCase();
      const hits = release.tags.filter(tag => text.includes(tag));
      if (hits.length > 0) {
        score += hits.length;
        matched.push({
          ticketId: inter.ticketId,
          title: inter.title,
          type: inter.type,
          hits: hits.length,
        });
      }
    });
    return { ...release, relevanceScore: score, matchedInteractions: matched };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.date) - new Date(a.date));
}

function WhatsNewHeroCard({ release }) {
  const Icon = release.icon;
  const hasMatches = release.matchedInteractions.length > 0;

  return (
    <div className="relative rounded-2xl border overflow-hidden" style={{ borderColor: release.categoryColor + '40' }}>
      {/* Gradient top accent */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${release.categoryColor}, ${release.categoryColor}66)` }} />

      <div className="p-6 bg-[#1C1B1A]">
        <div className="flex items-start gap-5">
          {/* Large icon */}
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: release.categoryColor + '18' }}>
            <Icon className="w-7 h-7" style={{ color: release.categoryColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#6B6359]">{release.version}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: release.categoryColor + '18', color: release.categoryColor }}>
                {release.category}
              </span>
              {hasMatches && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#B598E8]/15 text-[#B598E8] flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> Relevant to you
                </span>
              )}
              <span className="text-xs text-[#6B6359] ml-auto flex-shrink-0">{relativeTime(release.date)}</span>
            </div>
            <h2 className="text-xl font-bold text-[#F0EDE8] mb-2">{release.title}</h2>
            <p className="text-sm text-[#ADA599] leading-relaxed mb-4">{release.description}</p>

            {/* Highlights */}
            {release.highlights && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {release.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[#141210] border border-[#38332B]/50">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: release.categoryColor }} />
                    <span className="text-xs text-[#F0EDE8]">{h}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Matched interactions */}
            {hasMatches && (
              <div className="mb-4">
                <p className="text-[10px] text-[#B598E8] uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Related to your interactions
                </p>
                <div className="flex flex-wrap gap-2">
                  {release.matchedInteractions.map(mi => {
                    const tc = TYPE_CONFIG[mi.type] || TYPE_CONFIG.ticket;
                    const MiIcon = tc.icon;
                    return (
                      <div key={mi.ticketId} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#B598E8]/[0.06] border border-[#B598E8]/15">
                        <MiIcon className="w-3 h-3" style={{ color: tc.color }} />
                        <span className="text-[10px] font-mono text-[#ADA599]">{mi.ticketId}</span>
                        <span className="text-[10px] text-[#F0EDE8] max-w-[200px] truncate">{mi.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Doc link */}
            {release.docUrl && (
              <a
                href={release.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:underline"
                style={{ color: release.categoryColor }}
              >
                Learn more on business.dutchie.com <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatsNewCard({ release }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = release.icon;
  const hasMatches = release.matchedInteractions.length > 0;

  return (
    <div
      className={`rounded-xl border transition-all ${
        hasMatches ? 'border-[#B598E8]/25 bg-[#1C1B1A]' : 'border-[#38332B] bg-[#1C1B1A]'
      } hover:border-[#38332B]`}
    >
      {/* Color accent strip */}
      <div className="h-0.5 rounded-t-xl" style={{ background: release.categoryColor + (hasMatches ? '' : '44') }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: release.categoryColor + '15' }}>
            <Icon className="w-5 h-5" style={{ color: release.categoryColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-[10px] font-mono text-[#6B6359]">{release.version}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: release.categoryColor + '15', color: release.categoryColor }}>
                {release.category}
              </span>
              {hasMatches && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#B598E8]/12 text-[#B598E8] flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5" /> Relevant
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-[#F0EDE8] mb-1">{release.title}</h3>
            <p className="text-xs text-[#ADA599] leading-relaxed">{release.summary}</p>

            {/* Matched interactions inline */}
            {hasMatches && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {release.matchedInteractions.slice(0, 3).map(mi => {
                  const tc = TYPE_CONFIG[mi.type] || TYPE_CONFIG.ticket;
                  return (
                    <span key={mi.ticketId} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#B598E8]/[0.06] border border-[#B598E8]/10 text-[#F0EDE8]">
                      <span className="font-mono text-[#ADA599]">{mi.ticketId}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-[11px] font-medium text-[#6B6359] hover:text-[#ADA599] transition-colors flex items-center gap-1"
            >
              {expanded ? 'Show less' : 'Show details'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {expanded && (
              <div className="mt-3 space-y-3">
                <p className="text-xs text-[#ADA599] leading-relaxed">{release.description}</p>
                {release.highlights && (
                  <div className="space-y-1">
                    {release.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: release.categoryColor }} />
                        <span className="text-xs text-[#F0EDE8]">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
                {release.docUrl && (
                  <a
                    href={release.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors hover:underline"
                    style={{ color: release.categoryColor }}
                  >
                    Learn more <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-[#6B6359] flex-shrink-0 mt-1">{relativeTime(release.date)}</span>
        </div>
      </div>
    </div>
  );
}

function WhatsNewSection({ interactions }) {
  const scored = useMemo(() => scoreReleasesAgainstAll(interactions), [interactions]);
  const relevant = scored.filter(r => r.relevanceScore > 0);
  const other = scored.filter(r => r.relevanceScore === 0);
  const hero = relevant[0] || scored[0];
  const rest = scored.filter(r => r.id !== hero.id);

  const categories = useMemo(() => {
    const cats = {};
    RELEASE_NOTES.forEach(r => {
      cats[r.category] = (cats[r.category] || 0) + 1;
    });
    return cats;
  }, []);

  return (
    <>
      {/* Personalization banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#B598E8]/[0.08] to-[#00C27C]/[0.04] border border-[#B598E8]/15">
        <div className="w-8 h-8 rounded-lg bg-[#B598E8]/15 flex items-center justify-center flex-shrink-0">
          <Star className="w-4 h-4 text-[#B598E8]" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-[#F0EDE8]">Personalized for Ascend</p>
          <p className="text-[10px] text-[#ADA599]">
            Release notes are ordered by relevance to your {interactions.length} interactions — tickets, bug reports, feature requests, and demos.
          </p>
        </div>
        {relevant.length > 0 && (
          <div className="flex-shrink-0 text-right">
            <p className="text-lg font-bold text-[#B598E8]">{relevant.length}</p>
            <p className="text-[10px] text-[#ADA599]">relevant</p>
          </div>
        )}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Releases" value={RELEASE_NOTES.length} icon={Megaphone} color="dutchie" />
        <MetricCard title="Relevant to You" value={relevant.length} icon={Zap} color="purple" />
        <MetricCard title="Categories" value={Object.keys(categories).length} icon={Tag} color="blue" />
        <MetricCard title="Latest" value={scored[0]?.version || '-'} icon={Rocket} color="amber" subtitle={relativeTime(scored[0]?.date)} />
      </div>

      {/* Hero release */}
      <WhatsNewHeroCard release={hero} />

      {/* Remaining releases grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {rest.map(release => (
          <WhatsNewCard key={release.id} release={release} />
        ))}
      </div>

      {/* Feature Adoption + Training Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
        {/* Feature Adoption */}
        <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-5">
          <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-4">Your Product Adoption</h3>
          <div className="space-y-3">
            {[
              { name: 'POS', pct: 92, color: '#00C27C', active: true },
              { name: 'Ecommerce', pct: 78, color: '#00C27C', active: true },
              { name: 'Payments', pct: 45, color: '#D4A03A', active: true },
              { name: 'Analytics', pct: 31, color: '#D4A03A', active: true },
              { name: 'White Label', pct: 0, color: '#484F58', active: false, price: '$499/mo' },
              { name: 'Menu Boards', pct: 0, color: '#484F58', active: false, price: '$149/mo' },
            ].map(f => (
              <div key={f.name} className="flex items-center gap-3">
                <span className="text-sm text-[#F0EDE8] w-24">{f.name}</span>
                <div className="flex-1 bg-[#282724] rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
                </div>
                {f.active ? (
                  <span className="text-sm font-medium text-[#F0EDE8] w-12 text-right">{f.pct}%</span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded border border-[#38332B] text-[#ADA599]">{f.price}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Training Resources */}
        <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-5">
          <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-4">Training Resources</h3>
          <div className="space-y-2">
            {[
              { title: 'POS Quick Start Guide', category: 'POS' },
              { title: 'Ecommerce Menu Management', category: 'Ecommerce' },
              { title: 'Payment Processing Setup', category: 'Payments' },
              { title: 'Analytics Dashboard Tutorial', category: 'Analytics' },
              { title: 'Campaign Best Practices', category: 'Marketing' },
            ].map((link, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#141210] border border-[#21262D] hover:bg-[#282724] transition-colors cursor-pointer">
                <BookOpen className="w-4 h-4 text-[#64A8E0] flex-shrink-0" />
                <span className="text-sm text-[#F0EDE8] flex-1">{link.title}</span>
                <span className="text-xs text-[#6B6359]">{link.category}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6B6359]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMING SOON DATA + SECTION
   ═══════════════════════════════════════════════════════════════════ */

const COMING_SOON = [
  {
    id: 'cs-1',
    title: 'Dutchie AI Budtender Copilot',
    tagline: 'Your smartest employee — on every shift.',
    description: 'An AI assistant that lives inside the POS, trained on your product catalog, customer preferences, and sales data. It suggests perfect pairings, answers product questions in real time, and coaches new budtenders through complex transactions. Early beta partners are seeing 22% higher attachment rates.',
    eta: 'April 2026',
    phase: 'Beta',
    phaseColor: '#F97316',
    icon: Sparkles,
    gradient: 'from-[#F97316]/20 via-[#F97316]/5 to-transparent',
    borderColor: '#F97316',
    highlights: ['Real-time product pairing suggestions', 'Customer preference-aware recommendations', 'New budtender coaching mode', 'Trained on your catalog + sales history'],
    docUrl: 'https://business.dutchie.com/pos',
    tags: ['ai', 'budtender', 'pos', 'recommendation', 'product', 'customer'],
  },
  {
    id: 'cs-2',
    title: 'Unified Commerce Dashboard',
    tagline: 'One screen to run your entire operation.',
    description: 'A single pane of glass combining POS sales, ecommerce orders, inventory levels, marketing performance, and customer analytics. Real-time data from every location, every channel. Set custom alerts, build executive summaries, and share dashboards with your team — no more switching between tabs.',
    eta: 'April 2026',
    phase: 'Early Access',
    phaseColor: '#00C27C',
    icon: BarChart3,
    gradient: 'from-[#00C27C]/20 via-[#00C27C]/5 to-transparent',
    borderColor: '#00C27C',
    highlights: ['Cross-channel real-time metrics', 'Multi-location at a glance', 'Custom alert thresholds', 'Executive summary builder'],
    docUrl: 'https://business.dutchie.com/analytics',
    tags: ['analytics', 'dashboard', 'report', 'location', 'performance', 'insights'],
  },
  {
    id: 'cs-3',
    title: 'Tap-to-Pay on iPhone',
    tagline: 'Accept payments anywhere in the store.',
    description: 'Turn any iPhone into a contactless payment terminal. Budtenders can accept Dutchie Pay, debit, and pay-by-bank transactions directly from their phone — perfect for line-busting during peak hours, curbside pickup, and pop-up events. No additional hardware required.',
    eta: 'May 2026',
    phase: 'In Development',
    phaseColor: '#64A8E0',
    icon: Smartphone,
    gradient: 'from-[#64A8E0]/20 via-[#64A8E0]/5 to-transparent',
    borderColor: '#64A8E0',
    highlights: ['iPhone as payment terminal', 'Line-busting during rush hours', 'Curbside + pop-up ready', 'No extra hardware needed'],
    docUrl: 'https://business.dutchie.com/payments',
    tags: ['payment', 'mobile', 'iphone', 'checkout', 'contactless'],
  },
  {
    id: 'cs-4',
    title: 'Automated Compliance Engine',
    tagline: 'Stay compliant without thinking about it.',
    description: 'Automatic regulatory compliance monitoring across all your locations. Purchase limits, ID verification rules, METRC/BioTrack sync, and state-specific reporting are continuously validated. Get proactive alerts before issues become violations — and generate audit-ready reports in one click.',
    eta: 'May 2026',
    phase: 'In Development',
    phaseColor: '#64A8E0',
    icon: Shield,
    gradient: 'from-[#B598E8]/20 via-[#B598E8]/5 to-transparent',
    borderColor: '#B598E8',
    highlights: ['Real-time purchase limit enforcement', 'METRC / BioTrack auto-sync', 'Proactive violation alerts', 'One-click audit reports'],
    docUrl: 'https://business.dutchie.com/pos',
    tags: ['compliance', 'regulation', 'metrc', 'audit', 'security', 'reporting'],
  },
  {
    id: 'cs-5',
    title: 'Customer Loyalty 2.0',
    tagline: 'Loyalty that feels personal, not programmatic.',
    description: 'Next-generation loyalty with tiered rewards, birthday surprises, referral bonuses, and AI-powered personalized offers based on purchase patterns. Customers manage their rewards through your branded app or ecommerce site. Includes gamification with streak bonuses and surprise-and-delight drops.',
    eta: 'June 2026',
    phase: 'Planning',
    phaseColor: '#D4A03A',
    icon: Gift,
    gradient: 'from-[#EC4899]/20 via-[#EC4899]/5 to-transparent',
    borderColor: '#EC4899',
    highlights: ['Tiered rewards with auto-upgrade', 'Birthday + referral bonuses', 'AI personalized offers', 'Gamification: streaks + surprise drops'],
    docUrl: 'https://business.dutchie.com/ecommerce',
    tags: ['loyalty', 'rewards', 'customer', 'points', 'referral', 'personalized'],
  },
  {
    id: 'cs-6',
    title: 'White Label 2.0 — App Clips & Instant Ordering',
    tagline: 'Your brand, instantly in their pocket.',
    description: 'Next evolution of the White Label App with iOS App Clips and Android Instant Apps — customers scan a QR code in-store or tap an NFC tag and immediately start ordering, no download required. Includes push notification campaigns, in-app loyalty, and deep analytics on mobile conversion funnels.',
    eta: 'June 2026',
    phase: 'Planning',
    phaseColor: '#D4A03A',
    icon: Smartphone,
    gradient: 'from-[#0EA5E9]/20 via-[#0EA5E9]/5 to-transparent',
    borderColor: '#0EA5E9',
    highlights: ['App Clips — no download needed', 'NFC + QR instant ordering', 'Push notification campaigns', 'Mobile conversion analytics'],
    docUrl: 'https://business.dutchie.com/ecommerce',
    tags: ['app', 'mobile', 'ecommerce', 'qr', 'ordering', 'brand', 'white label'],
  },
];

const PHASE_ORDER = { 'Beta': 0, 'Early Access': 1, 'In Development': 2, 'Planning': 3 };

function ComingSoonHero({ item, interactions }) {
  const Icon = item.icon;
  const matchCount = useMemo(() => {
    return interactions.filter(inter => {
      const text = `${inter.title} ${inter.description}`.toLowerCase();
      return item.tags.some(tag => text.includes(tag));
    }).length;
  }, [interactions, item.tags]);

  return (
    <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: item.borderColor + '35' }}>
      {/* Gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} pointer-events-none`} />
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Icon + Phase */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: item.borderColor + '20', boxShadow: `0 0 30px ${item.borderColor}15` }}>
              <Icon className="w-8 h-8" style={{ color: item.borderColor }} />
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: item.phaseColor + '18', color: item.phaseColor }}>
              {item.phase}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: item.borderColor }}>
              Coming {item.eta}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-[#F0EDE8] mb-1">{item.title}</h2>
            <p className="text-sm font-medium text-[#F0EDE8] italic mb-3">{item.tagline}</p>
            <p className="text-sm text-[#ADA599] leading-relaxed mb-5">{item.description}</p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {item.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-[#141210]/60 border border-[#38332B]/50 backdrop-blur-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: item.borderColor }} />
                  <span className="text-xs text-[#F0EDE8]">{h}</span>
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center gap-3 flex-wrap">
              {matchCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#B598E8]/12 text-[#B598E8] border border-[#B598E8]/15">
                  <Zap className="w-3 h-3" />
                  Related to {matchCount} of your interaction{matchCount !== 1 ? 's' : ''}
                </span>
              )}
              {item.docUrl && (
                <a
                  href={item.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors"
                  style={{ color: item.borderColor, borderColor: item.borderColor + '30' }}
                >
                  Learn more <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({ item, interactions }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;
  const matchCount = useMemo(() => {
    return interactions.filter(inter => {
      const text = `${inter.title} ${inter.description}`.toLowerCase();
      return item.tags.some(tag => text.includes(tag));
    }).length;
  }, [interactions, item.tags]);

  return (
    <div className="relative rounded-xl overflow-hidden border hover:border-[#38332B] transition-all group" style={{ borderColor: item.borderColor + '20' }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
      <div className="relative p-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.borderColor + '18' }}>
            <Icon className="w-5.5 h-5.5" style={{ color: item.borderColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider" style={{ background: item.phaseColor + '15', color: item.phaseColor }}>
                {item.phase}
              </span>
              <span className="text-[10px] text-[#6B6359]">{item.eta}</span>
              {matchCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#B598E8]/12 text-[#B598E8] flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5" /> Relevant
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-[#F0EDE8] mb-0.5">{item.title}</h3>
            <p className="text-xs text-[#F0EDE8] italic mb-1.5">{item.tagline}</p>
            <p className="text-xs text-[#ADA599] leading-relaxed">{expanded ? item.description : item.description.slice(0, 120) + '...'}</p>

            {expanded && (
              <div className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: item.borderColor }} />
                      <span className="text-xs text-[#F0EDE8]">{h}</span>
                    </div>
                  ))}
                </div>
                {item.docUrl && (
                  <a
                    href={item.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors hover:underline"
                    style={{ color: item.borderColor }}
                  >
                    Learn more <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-[11px] font-medium text-[#6B6359] hover:text-[#ADA599] transition-colors flex items-center gap-1"
            >
              {expanded ? 'Show less' : 'Show more'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoonSection({ interactions }) {
  // Sort: items with interaction matches first, then by phase proximity
  const sorted = useMemo(() => {
    return [...COMING_SOON].sort((a, b) => {
      const aMatch = interactions.some(inter => {
        const text = `${inter.title} ${inter.description}`.toLowerCase();
        return a.tags.some(tag => text.includes(tag));
      }) ? 1 : 0;
      const bMatch = interactions.some(inter => {
        const text = `${inter.title} ${inter.description}`.toLowerCase();
        return b.tags.some(tag => text.includes(tag));
      }) ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
      return (PHASE_ORDER[a.phase] || 9) - (PHASE_ORDER[b.phase] || 9);
    });
  }, [interactions]);

  const hero = sorted[0];
  const rest = sorted.slice(1);
  const relevantCount = sorted.filter(item =>
    interactions.some(inter => {
      const text = `${inter.title} ${inter.description}`.toLowerCase();
      return item.tags.some(tag => text.includes(tag));
    })
  ).length;

  // Timeline months
  const months = [...new Set(COMING_SOON.map(c => c.eta))].sort();

  return (
    <>
      {/* Intro banner */}
      <div className="relative rounded-xl overflow-hidden border border-[#38332B]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00C27C]/[0.06] via-[#B598E8]/[0.04] to-[#F97316]/[0.06] pointer-events-none" />
        <div className="relative flex items-center gap-4 px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C27C]/20 to-[#B598E8]/20 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-[#00C27C]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#F0EDE8]">Dutchie Product Roadmap — Next 90 Days</p>
            <p className="text-xs text-[#ADA599]">
              Here's what's coming to the platform. Features are prioritized by customer feedback{relevantCount > 0 ? ` — ${relevantCount} upcoming features relate to your interactions` : ''}.
            </p>
          </div>
          {/* Timeline pills */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {months.map(m => (
              <span key={m} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#38332B] text-[#ADA599]">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1B1A] border border-[#38332B]">
          <Package className="w-5 h-5 text-[#00C27C]" />
          <div>
            <p className="text-lg font-bold text-[#F0EDE8]">{COMING_SOON.length}</p>
            <p className="text-[10px] text-[#ADA599]">Upcoming features</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1B1A] border border-[#38332B]">
          <Zap className="w-5 h-5 text-[#B598E8]" />
          <div>
            <p className="text-lg font-bold text-[#F0EDE8]">{relevantCount}</p>
            <p className="text-[10px] text-[#ADA599]">Relevant to you</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1B1A] border border-[#38332B]">
          <Rocket className="w-5 h-5 text-[#F97316]" />
          <div>
            <p className="text-lg font-bold text-[#F0EDE8]">{COMING_SOON.filter(c => c.phase === 'Beta' || c.phase === 'Early Access').length}</p>
            <p className="text-[10px] text-[#ADA599]">In beta / early access</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1B1A] border border-[#38332B]">
          <Calendar className="w-5 h-5 text-[#64A8E0]" />
          <div>
            <p className="text-lg font-bold text-[#F0EDE8]">{months[0]}</p>
            <p className="text-[10px] text-[#ADA599]">Next launch</p>
          </div>
        </div>
      </div>

      {/* Hero feature */}
      <ComingSoonHero item={hero} interactions={interactions} />

      {/* Remaining features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {rest.map(item => (
          <ComingSoonCard key={item.id} item={item} interactions={interactions} />
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCHEDULE SECTION DATA
   ═══════════════════════════════════════════════════════════════════ */

const TEAM_MEMBERS = [
  { id: 'sarah', name: 'Sarah Chen', role: 'Customer Success Manager', initial: 'SC', color: '#00C27C', email: 'sarah.chen@dutchie.com' },
  { id: 'marcus', name: 'Marcus Johnson', role: 'Account Manager', initial: 'MJ', color: '#64A8E0', email: 'marcus.johnson@dutchie.com' },
  { id: 'priya', name: 'Priya Patel', role: 'Solutions Engineer', initial: 'PP', color: '#B598E8', email: 'priya.patel@dutchie.com' },
];

const MEETING_TYPES = [
  { key: 'review', label: 'Account Review', duration: 30, description: 'Review account health, usage metrics, and goals', icon: BarChart3, color: '#00C27C' },
  { key: 'demo', label: 'Product Demo', duration: 45, description: 'See new features and product capabilities in action', icon: Monitor, color: '#64A8E0' },
  { key: 'support', label: 'Technical Support', duration: 30, description: 'Get help with technical issues or integrations', icon: Headphones, color: '#D4A03A' },
];

function generateAvailableSlots() {
  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let weekdayCount = 0;
  let dayOffset = 1;

  while (weekdayCount < 14) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) { dayOffset++; continue; }
    weekdayCount++;

    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    for (const member of TEAM_MEMBERS) {
      for (let hour = 9; hour < 17; hour++) {
        for (let min = 0; min < 60; min += 30) {
          // Deterministic availability using modulo seeding
          const seed = (date.getDate() * 31 + hour * 7 + min * 3 + member.id.charCodeAt(0) * 13) % 100;
          if (seed < 60) {
            const slotTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
            slots.push({ dateKey, memberId: member.id, time: slotTime, hour, min });
          }
        }
      }
    }
    dayOffset++;
  }
  return slots;
}

const AVAILABLE_SLOTS = generateAvailableSlots();

const MOCK_UPCOMING_MEETINGS = [
  {
    id: 'mtg-1',
    type: 'review',
    memberId: 'sarah',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00',
    duration: 30,
  },
  {
    id: 'mtg-2',
    type: 'demo',
    memberId: 'marcus',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '14:00',
    duration: 45,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   SCHEDULE SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function MiniCalendar({ viewMonth, viewYear, selectedDate, onSelectDate, onPrevMonth, onNextMonth, availableDates }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-4 w-[340px] flex-shrink-0">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ADA599] hover:text-[#F0EDE8] hover:bg-[#282724] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-[#F0EDE8]">{monthName}</span>
        <button onClick={onNextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ADA599] hover:text-[#F0EDE8] hover:bg-[#282724] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayHeaders.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-[#6B6359] py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const cellDate = new Date(viewYear, viewMonth, day);
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = cellDate.getTime() === today.getTime();
          const isPast = cellDate < today;
          const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
          const isAvailable = availableDates.has(dateKey);
          const isSelected = selectedDate === dateKey;
          const isDisabled = isPast || isWeekend;

          return (
            <button
              key={dateKey}
              disabled={isDisabled || !isAvailable}
              onClick={() => onSelectDate(dateKey)}
              className={`relative w-full aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#00C27C] text-white'
                  : isDisabled
                    ? 'text-[#6B6359] cursor-not-allowed'
                    : isAvailable
                      ? 'text-[#F0EDE8] hover:bg-[#282724] cursor-pointer'
                      : 'text-[#6B6359] cursor-not-allowed'
              } ${isToday && !isSelected ? 'ring-1 ring-[#00C27C]' : ''}`}
            >
              {day}
              {isAvailable && !isSelected && !isDisabled && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00C27C]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeSlotList({ slots, selectedSlot, onSelectSlot, selectedMember }) {
  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="w-8 h-8 text-[#6B6359] mb-2" />
        <p className="text-sm text-[#ADA599]">No available slots for this date</p>
        <p className="text-xs text-[#6B6359] mt-1">Try another date or team member</p>
      </div>
    );
  }

  // Group by member when showing "Any Available"
  if (!selectedMember) {
    const grouped = {};
    slots.forEach(s => {
      if (!grouped[s.memberId]) grouped[s.memberId] = [];
      grouped[s.memberId].push(s);
    });

    return (
      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {Object.entries(grouped).map(([memberId, memberSlots]) => {
          const member = TEAM_MEMBERS.find(m => m.id === memberId);
          return (
            <div key={memberId}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: member.color }}>
                  {member.initial}
                </div>
                <span className="text-xs font-medium text-[#ADA599]">{member.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {memberSlots.map(slot => {
                  const key = `${slot.memberId}-${slot.time}`;
                  const isSelected = selectedSlot && selectedSlot.memberId === slot.memberId && selectedSlot.time === slot.time;
                  return (
                    <button
                      key={key}
                      onClick={() => onSelectSlot(slot)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#00C27C] text-white'
                          : 'bg-[#141210] border border-[#38332B] text-[#F0EDE8] hover:border-[#00C27C]/50 hover:text-[#F0EDE8]'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
      {slots.map(slot => {
        const key = `${slot.memberId}-${slot.time}`;
        const isSelected = selectedSlot && selectedSlot.memberId === slot.memberId && selectedSlot.time === slot.time;
        return (
          <button
            key={key}
            onClick={() => onSelectSlot(slot)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? 'bg-[#00C27C] text-white'
                : 'bg-[#141210] border border-[#38332B] text-[#F0EDE8] hover:border-[#00C27C]/50 hover:text-[#F0EDE8]'
            }`}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}

function BookingConfirmation({ meetingType, member, date, time, onConfirm, onCancel, confirmed, inviteEmails, onAddEmail, onRemoveEmail }) {
  const typeInfo = MEETING_TYPES.find(t => t.key === meetingType);
  const memberInfo = TEAM_MEMBERS.find(m => m.id === member);
  const TypeIcon = typeInfo?.icon || Calendar;
  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleAddEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address');
      return;
    }
    if (inviteEmails.includes(email)) {
      setEmailError('Already added');
      return;
    }
    setEmailError('');
    setEmailInput('');
    onAddEmail(email);
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  if (confirmed) {
    return (
      <div className="rounded-xl border border-[#00C27C]/30 bg-[#00C27C]/[0.04] p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#00C27C]/15 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-[#00C27C]" />
        </div>
        <h3 className="text-base font-semibold text-[#F0EDE8] mb-1">Meeting Booked!</h3>
        <p className="text-sm text-[#ADA599] mb-3">
          {typeInfo?.label} with {memberInfo?.name}
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141210] border border-[#38332B] text-xs text-[#F0EDE8]">
          <Calendar className="w-3.5 h-3.5 text-[#00C27C]" />
          {displayDate} at {time}
          <span className="text-[#6B6359]">·</span>
          {typeInfo?.duration}min
        </div>
        {inviteEmails.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] text-[#6B6359] uppercase tracking-wider font-medium mb-1.5">Also invited</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {inviteEmails.map(email => (
                <span key={email} className="text-[11px] px-2 py-0.5 rounded-full bg-[#141210] border border-[#38332B] text-[#ADA599]">
                  {email}
                </span>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-[#6B6359] mt-3">A calendar invite has been sent to {inviteEmails.length > 0 ? 'all participants' : 'your email'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#38332B] bg-[#1C1B1A] p-4">
      <h3 className="text-sm font-semibold text-[#F0EDE8] mb-3">Confirm Booking</h3>
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141210] border border-[#38332B]/50">
          <TypeIcon className="w-4 h-4" style={{ color: typeInfo?.color }} />
          <div>
            <p className="text-xs font-medium text-[#F0EDE8]">{typeInfo?.label}</p>
            <p className="text-[10px] text-[#6B6359]">{typeInfo?.duration} minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141210] border border-[#38332B]/50">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: memberInfo?.color }}>
            {memberInfo?.initial}
          </div>
          <div>
            <p className="text-xs font-medium text-[#F0EDE8]">{memberInfo?.name}</p>
            <p className="text-[10px] text-[#6B6359]">{memberInfo?.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141210] border border-[#38332B]/50">
          <Calendar className="w-4 h-4 text-[#00C27C]" />
          <div>
            <p className="text-xs font-medium text-[#F0EDE8]">{displayDate}</p>
            <p className="text-[10px] text-[#6B6359]">{time}</p>
          </div>
        </div>

        {/* Invite additional people */}
        <div className="px-3 py-2.5 rounded-lg bg-[#141210] border border-[#38332B]/50">
          <p className="text-[10px] text-[#6B6359] uppercase tracking-wider font-medium mb-2">Invite others (optional)</p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
              onKeyDown={handleEmailKeyDown}
              placeholder="colleague@company.com"
              className="flex-1 bg-[#1C1B1A] border border-[#38332B] rounded-lg px-3 py-1.5 text-xs text-[#F0EDE8] placeholder-[#484F58] outline-none focus:border-[#00C27C]/50 transition-colors"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              disabled={!emailInput.trim()}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-[#38332B] text-[#F0EDE8] hover:bg-[#1C1B1A] transition-colors disabled:opacity-30"
            >
              Add
            </button>
          </div>
          {emailError && <p className="text-[10px] text-[#E87068] mt-1">{emailError}</p>}
          {inviteEmails.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {inviteEmails.map(email => (
                <span key={email} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#1C1B1A] border border-[#38332B] text-[#ADA599]">
                  {email}
                  <button type="button" onClick={() => onRemoveEmail(email)} className="text-[#6B6359] hover:text-[#E87068] transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-[#ADA599] bg-[#141210] border border-[#38332B] hover:border-[#38332B] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#00C27C] hover:bg-[#00A066] transition-colors flex items-center justify-center gap-2"
        >
          <Video className="w-4 h-4" />
          Confirm
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCHEDULE SECTION
   ═══════════════════════════════════════════════════════════════════ */

function ScheduleSection() {
  const [selectedType, setSelectedType] = useState('review');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [inviteEmails, setInviteEmails] = useState([]);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Filter slots by selected member
  const filteredSlots = useMemo(() => {
    if (!selectedMember) return AVAILABLE_SLOTS;
    return AVAILABLE_SLOTS.filter(s => s.memberId === selectedMember);
  }, [selectedMember]);

  // Available dates set (for calendar dots)
  const availableDates = useMemo(() => {
    return new Set(filteredSlots.map(s => s.dateKey));
  }, [filteredSlots]);

  // Slots for selected date
  const dateSlots = useMemo(() => {
    if (!selectedDate) return [];
    return filteredSlots.filter(s => s.dateKey === selectedDate);
  }, [filteredSlots, selectedDate]);

  // Cascading resets
  const handleMemberChange = (memberId) => {
    setSelectedMember(memberId === selectedMember ? null : memberId);
    setSelectedSlot(null);
    setConfirmedBooking(null);
  };

  const handleDateChange = (dateKey) => {
    setSelectedDate(dateKey);
    setSelectedSlot(null);
    setConfirmedBooking(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setConfirmedBooking(null);
  };

  const handleConfirm = () => {
    setConfirmedBooking({
      type: selectedType,
      memberId: selectedSlot.memberId,
      date: selectedDate,
      time: selectedSlot.time,
    });
  };

  const handleCancelConfirm = () => {
    setSelectedSlot(null);
    setConfirmedBooking(null);
    setInviteEmails([]);
  };

  // KPI data
  const nextMeeting = MOCK_UPCOMING_MEETINGS[0];
  const nextMeetingMember = TEAM_MEMBERS.find(m => m.id === nextMeeting.memberId);
  const nextMeetingDate = new Date(nextMeeting.date);
  const daysUntilNext = Math.ceil((nextMeetingDate - now) / (1000 * 60 * 60 * 24));

  return (
    <>
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Upcoming Meetings" value={MOCK_UPCOMING_MEETINGS.length} icon={Video} color="dutchie" />
        <MetricCard title="Next Meeting" value={`${daysUntilNext}d`} icon={Calendar} color="blue" subtitle={`with ${nextMeetingMember?.name}`} />
        <MetricCard title="Avg Response" value="< 2h" icon={Clock} color="amber" subtitle="Booking confirmation" />
        <MetricCard title="Your Team" value={TEAM_MEMBERS.length} icon={Users} color="purple" subtitle="Assigned members" />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Meeting type pills */}
        <div className="flex items-center gap-1.5">
          {MEETING_TYPES.map(mt => {
            const isActive = selectedType === mt.key;
            const MtIcon = mt.icon;
            return (
              <button
                key={mt.key}
                onClick={() => setSelectedType(mt.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'bg-[#1C1B1A] border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8] hover:border-[#38332B]'
                }`}
                style={isActive ? { background: mt.color } : undefined}
              >
                <MtIcon className="w-3.5 h-3.5" />
                {mt.label}
                <span className="text-[10px] opacity-70">{mt.duration}m</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Team member pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleMemberChange(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !selectedMember
                ? 'bg-[#00C27C]/15 text-[#00C27C] border border-[#00C27C]/30'
                : 'bg-[#1C1B1A] border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8]'
            }`}
          >
            Any Available
          </button>
          {TEAM_MEMBERS.map(m => {
            const isActive = selectedMember === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMemberChange(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'border text-[#F0EDE8]'
                    : 'bg-[#1C1B1A] border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8]'
                }`}
                style={isActive ? { background: m.color + '18', borderColor: m.color + '50' } : undefined}
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: m.color }}>
                  {m.initial}
                </div>
                {m.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column layout: Calendar | Slots + Confirmation */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
        <MiniCalendar
          viewMonth={viewMonth}
          viewYear={viewYear}
          selectedDate={selectedDate}
          onSelectDate={handleDateChange}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          availableDates={availableDates}
        />

        <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-4">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-8 h-8 text-[#6B6359] mb-2" />
              <p className="text-sm text-[#ADA599]">Select a date to view available times</p>
              <p className="text-xs text-[#6B6359] mt-1">Available dates are marked with a green dot</p>
            </div>
          ) : selectedSlot ? (
            <BookingConfirmation
              meetingType={selectedType}
              member={selectedSlot.memberId}
              date={selectedDate}
              time={selectedSlot.time}
              onConfirm={handleConfirm}
              onCancel={handleCancelConfirm}
              confirmed={!!confirmedBooking}
              inviteEmails={inviteEmails}
              onAddEmail={(email) => setInviteEmails(prev => [...prev, email])}
              onRemoveEmail={(email) => setInviteEmails(prev => prev.filter(e => e !== email))}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#F0EDE8]">
                  Available Times — {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                <span className="text-[10px] text-[#6B6359]">{dateSlots.length} slots</span>
              </div>
              <TimeSlotList
                slots={dateSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={handleSlotSelect}
                selectedMember={selectedMember}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SUPPORT CHAT WIDGET — KB + Bug reporting only
   ═══════════════════════════════════════════════════════════════════ */

const WIDGET_SUGGESTIONS = [
  { key: 'menu', label: 'How do I set up my menu?' },
  { key: 'delivery', label: 'Configure delivery zones' },
  { key: 'bug', label: 'Report a bug or issue' },
  { key: 'orders', label: 'Troubleshoot order issues' },
];

function PortalSupportWidget() {
  const { addInteraction } = usePortal();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current && expanded) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking, expanded]);

  const processMessage = async (text) => {
    setExpanded(true);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setThinking('Analyzing your message...');

    const intent = detectIntent(text, null);
    await new Promise(r => setTimeout(r, 500));

    if (intent.lane === 'feedback' && intent.type === 'bug') {
      const kbResults = searchKB(text);
      setThinking(null);
      setMessages(prev => [...prev, {
        role: 'agent',
        text: "Looks like you've found an issue. Let me collect a few details to help our engineers fix this quickly.",
        component: 'bug_gather',
        data: { userMessage: text, kbResults },
      }]);
    } else {
      setThinking('Searching knowledge base...');
      const results = searchKB(text);

      if (results.length > 0) {
        let responseText = null;
        if (isGeminiAvailable()) {
          setThinking('Composing a detailed answer...');
          responseText = await generateBridgeResponse(text, results);
        }
        if (!responseText) {
          responseText = synthesizeResponse(text, results);
        }
        setThinking(null);
        setMessages(prev => [...prev, {
          role: 'agent',
          text: responseText,
          component: 'kb',
          data: results,
        }]);
      } else {
        let responseText = null;
        if (isGeminiAvailable()) {
          setThinking('No exact match — checking broader knowledge...');
          responseText = await generateBridgeResponse(text, KNOWLEDGE_BASE.slice(0, 10));
        }
        setThinking(null);
        if (responseText) {
          setMessages(prev => [...prev, { role: 'agent', text: responseText }]);
        } else {
          const ticketId = generateTicketId();
          addInteraction({ type: 'ticket', title: text, description: text, ticketId, priority: 'Medium' });
          setMessages(prev => [...prev, {
            role: 'agent',
            text: "I couldn't find a specific article for that, but I want to make sure you get help. I've created a support ticket so our team can assist you directly.",
            component: 'ticket',
            data: { ticketId, userMessage: text },
          }]);
        }
      }
    }
  };

  const handleBugSubmit = async (userMessage, kbResults, extraDetails) => {
    const ticketId = generateTicketId();
    let enrichedMessage = userMessage;
    if (extraDetails) {
      const parts = [];
      if (extraDetails.pageUrl) parts.push(`Page URL: ${extraDetails.pageUrl}`);
      if (extraDetails.affectedUser) parts.push(`Affected user: ${extraDetails.affectedUser}`);
      if (extraDetails.occurredAt) parts.push(`When it happened: ${extraDetails.occurredAt}`);
      if (extraDetails.orderOrRegister) parts.push(`Order/Register #: ${extraDetails.orderOrRegister}`);
      if (extraDetails.steps) parts.push(`Steps to reproduce: ${extraDetails.steps}`);
      if (extraDetails.browser) parts.push(`Browser/Device: ${extraDetails.browser}`);
      if (extraDetails.screenshot) parts.push(`Screenshot attached: ${extraDetails.screenshot}`);
      if (parts.length > 0) enrichedMessage += '\n\n' + parts.join('\n');
    }
    addInteraction({ type: 'bug', title: userMessage, description: enrichedMessage, ticketId, priority: 'High', screenshotData: extraDetails?.screenshotData || null });
    setMessages(prev => prev.filter(m => m.component !== 'bug_gather'));
    setThinking('Creating support ticket...');
    await new Promise(r => setTimeout(r, 400));

    let responseText = null;
    if (isGeminiAvailable() && kbResults && kbResults.length > 0) {
      setThinking('Finding troubleshooting steps...');
      responseText = await generateBridgeResponse(
        `Customer reported a bug/issue: "${userMessage}". A support ticket ${ticketId} has been created. Provide a brief empathetic acknowledgment and mention any relevant troubleshooting steps.`,
        kbResults.slice(0, 2)
      );
    }
    setThinking(null);
    const hasExtra = extraDetails && (extraDetails.steps || extraDetails.browser || extraDetails.screenshot);
    if (kbResults && kbResults.length > 0) {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: responseText || `I've logged this issue and created a support ticket.${hasExtra ? " Thanks for the extra details — that'll help our team resolve this faster." : ''} Here are some troubleshooting steps that might help in the meantime:`,
        component: 'bug_with_kb',
        data: { ticketId, userMessage: enrichedMessage, articles: kbResults.slice(0, 2) },
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: `I've logged this issue and created a support ticket.${hasExtra ? " Thanks for the extra details — that'll help our team resolve this faster." : ''} Our engineering team will investigate:`,
        component: 'bug',
        data: { ticketId, userMessage: enrichedMessage },
      }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    const text = input.trim();
    setInput('');
    processMessage(text);
  };

  return (
    <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] overflow-hidden">
      {/* Collapsed bar / Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-[#00C27C]/15 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-4 h-4 text-[#00C27C]" />
        </div>
        <span className="text-sm font-semibold text-[#F0EDE8]">Support Assistant</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00C27C] animate-pulse" />
          <span className="text-[10px] text-[#00C27C] font-medium">Online</span>
        </div>
        <div className="flex-1" />
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-[#6B6359] flex-shrink-0" />
        ) : null}
      </button>

      {/* Collapsed inline input — visible when NOT expanded */}
      {!expanded && (
        <form onSubmit={handleSubmit} className="px-4 pb-3 -mt-1">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or describe an issue..."
              disabled={!!thinking}
              className="flex-1 bg-[#141210] border border-[#38332B] rounded-lg px-3 py-2 text-sm text-[#F0EDE8] placeholder-[#484F58] outline-none focus:border-[#00C27C]/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || !!thinking}
              className="w-8 h-8 rounded-lg bg-[#00C27C] text-white flex items-center justify-center hover:bg-[#00A066] transition-colors disabled:opacity-30 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Expanded area */}
      {expanded && (
        <>
          {/* Messages area */}
          <div className="max-h-[400px] overflow-y-auto px-5 py-4 space-y-4 bg-[#141210]/50 border-t border-[#38332B]">
            {messages.length === 0 && !thinking && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00C27C]/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#00C27C]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F0EDE8]">How can we help?</p>
                  <p className="text-xs text-[#ADA599] mt-1">Search our knowledge base or report an issue</p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                  {WIDGET_SUGGESTIONS.map(s => (
                    <button
                      key={s.key}
                      onClick={() => processMessage(s.label)}
                      className="text-left px-3 py-2.5 rounded-lg text-xs text-[#ADA599] hover:text-[#F0EDE8] bg-[#1C1B1A] hover:bg-[#1C2129] border border-[#38332B] hover:border-[#38332B] transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[75%] bg-[#00C27C]/15 border border-[#00C27C]/20 rounded-2xl rounded-br-md px-4 py-2.5">
                      <p className="text-sm text-[#F0EDE8]">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#00C27C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Headphones className="w-3.5 h-3.5 text-[#00C27C]" />
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      {msg.text && (
                        <div className="bg-[#1C1B1A] border border-[#38332B] rounded-2xl rounded-tl-md px-4 py-2.5">
                          <p className="text-sm text-[#F0EDE8] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      )}
                      {msg.component === 'kb' && msg.data && (
                        <div className="space-y-2">
                          {msg.data.slice(0, 3).map(article => (
                            <KBArticleCard key={article.id} article={article} />
                          ))}
                        </div>
                      )}
                      {msg.component === 'ticket' && msg.data && (
                        <BugReportCard userMessage={msg.data.userMessage} ticketId={msg.data.ticketId} />
                      )}
                      {msg.component === 'bug_gather' && msg.data && (
                        <BugDetailGatherer
                          userMessage={msg.data.userMessage}
                          onSubmit={(extraDetails) => handleBugSubmit(msg.data.userMessage, msg.data.kbResults, extraDetails)}
                        />
                      )}
                      {msg.component === 'bug_with_kb' && msg.data && (
                        <div className="space-y-2">
                          <BugReportCard userMessage={msg.data.userMessage} ticketId={msg.data.ticketId} />
                          {msg.data.articles?.map(article => (
                            <KBArticleCard key={article.id} article={article} />
                          ))}
                        </div>
                      )}
                      {msg.component === 'bug' && msg.data && (
                        <BugReportCard userMessage={msg.data.userMessage} ticketId={msg.data.ticketId} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#00C27C]/10 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-3.5 h-3.5 text-[#00C27C]" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1C1B1A] border border-[#38332B] rounded-2xl rounded-tl-md">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-[#ADA599]">{thinking}</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="px-5 py-3 border-t border-[#38332B]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question or describe an issue..."
                disabled={!!thinking}
                className="flex-1 bg-[#141210] border border-[#38332B] rounded-xl px-4 py-2.5 text-sm text-[#F0EDE8] placeholder-[#484F58] outline-none focus:border-[#00C27C]/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || !!thinking}
                className="w-10 h-10 rounded-xl bg-[#00C27C] text-white flex items-center justify-center hover:bg-[#00A066] transition-colors disabled:opacity-30 disabled:hover:bg-[#00C27C] flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NEW HOME SECTION
   ═══════════════════════════════════════════════════════════════════ */

function HomeSection({ interactions }) {
  const score = 82;
  const color = score >= 80 ? '#00C27C' : score >= 60 ? '#D4A03A' : '#E87068';
  const alerts = [
    { id: 1, icon: Receipt, text: 'Invoice INV-2026-03 due in 5 days', color: '#D4A03A', bg: 'rgba(212,160,58,0.12)' },
    { id: 2, icon: Sparkles, text: 'New feature available: AI Product Recs', color: '#B598E8', bg: 'rgba(181,152,232,0.12)' },
    { id: 3, icon: Ticket, text: 'Ticket CB-5201 updated — fix deployed', color: '#00C27C', bg: 'rgba(0,194,124,0.12)' },
  ];
  const quickActions = [
    { label: 'Open Ticket', icon: Ticket, color: '#64A8E0' },
    { label: 'Search KB', icon: BookOpen, color: '#00C27C' },
    { label: 'View Billing', icon: Receipt, color: '#D4A03A' },
    { label: 'Schedule Demo', icon: Video, color: '#B598E8' },
  ];
  const recentInteractions = interactions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="flex items-center gap-6 p-5 rounded-2xl border border-[#38332B] bg-[#1C1B1A]">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#21262D" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="3"
              strokeDasharray={`${score * 0.975} 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color }}>{score}</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#F0EDE8]">Account Health</h3>
          <p className="text-sm text-[#ADA599]">Your account is in great shape. All systems operational.</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-2">
        {alerts.map(a => {
          const Icon = a.icon;
          return (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#38332B] bg-[#141210]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.bg }}>
                <Icon className="w-4 h-4" style={{ color: a.color }} />
              </div>
              <p className="text-sm text-[#F0EDE8] flex-1">{a.text}</p>
              <ArrowRight className="w-4 h-4 text-[#6B6359]" />
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(a => {
            const Icon = a.icon;
            return (
              <button key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#38332B] bg-[#1C1B1A] hover:bg-[#282724] transition-colors">
                <Icon className="w-5 h-5" style={{ color: a.color }} />
                <span className="text-xs font-medium text-[#F0EDE8]">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Interactions */}
      {recentInteractions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-3">Recent Interactions</h3>
          <div className="space-y-2">
            {recentInteractions.map(inter => {
              const cfg = TYPE_CONFIG[inter.type] || TYPE_CONFIG.ticket;
              const Icon = cfg.icon;
              const statusCfg = STATUS_CONFIG[inter.status] || STATUS_CONFIG.Open;
              return (
                <div key={inter.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#38332B] bg-[#141210]">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F0EDE8] truncate">{inter.subject}</p>
                    <p className="text-xs text-[#ADA599]">{inter.id}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}>{inter.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NEW SUPPORT SECTION (replaces floating widget)
   ═══════════════════════════════════════════════════════════════════ */

function SupportSection() {
  const { addInteraction } = usePortal();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const processMessage = async (text) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setThinking('Analyzing your message...');

    const intent = detectIntent(text, null);
    await new Promise(r => setTimeout(r, 500));

    if (intent.lane === 'feedback' && intent.type === 'bug') {
      const kbResults = searchKB(text);
      setThinking(null);
      setMessages(prev => [...prev, {
        role: 'agent',
        text: "Looks like you've found an issue. Let me collect a few details to help our engineers fix this quickly.",
        component: 'bug_gather',
        data: { userMessage: text, kbResults },
      }]);
    } else {
      setThinking('Searching knowledge base...');
      const results = searchKB(text);

      if (results.length > 0) {
        let responseText = null;
        if (isGeminiAvailable()) {
          setThinking('Composing a detailed answer...');
          responseText = await generateBridgeResponse(text, results);
        }
        if (!responseText) {
          responseText = synthesizeResponse(text, results);
        }
        setThinking(null);
        setMessages(prev => [...prev, {
          role: 'agent',
          text: responseText,
          component: 'kb',
          data: results,
        }]);
      } else {
        let responseText = null;
        if (isGeminiAvailable()) {
          setThinking('No exact match — checking broader knowledge...');
          responseText = await generateBridgeResponse(text, KNOWLEDGE_BASE.slice(0, 10));
        }
        setThinking(null);
        if (responseText) {
          setMessages(prev => [...prev, { role: 'agent', text: responseText }]);
        } else {
          const ticketId = generateTicketId();
          addInteraction({ type: 'ticket', subject: text.slice(0, 60), status: 'Open', priority: 'Medium', id: ticketId });
          setMessages(prev => [...prev, {
            role: 'agent',
            text: `I wasn't able to find a direct match for that. I've opened a support ticket (**${ticketId}**) so our team can help. We typically respond within 4 hours.`,
          }]);
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    const text = input.trim();
    setInput('');
    processMessage(text);
  };

  const handleBugSubmit = (bugData) => {
    const ticketId = generateTicketId();
    addInteraction({ type: 'bug', subject: bugData.title, status: 'Open', priority: bugData.severity === 'Critical' ? 'High' : 'Medium', id: ticketId });
    setMessages(prev => [...prev, {
      role: 'agent',
      text: `Bug report **${ticketId}** filed. Priority: ${bugData.severity}. Our engineering team has been notified and will begin investigation.`,
      component: 'bug_report',
      data: { ...bugData, ticketId },
    }]);
  };

  const integrations = [
    { name: 'POS System', status: 'ok' },
    { name: 'Ecommerce', status: 'ok' },
    { name: 'Payments', status: 'ok' },
    { name: 'METRC', status: 'warn' },
  ];
  const statusDot = { ok: 'bg-[#00C27C]', warn: 'bg-[#D4A03A]' };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or describe an issue..."
            disabled={!!thinking}
            className="w-full bg-[#141210] border border-[#38332B] rounded-xl px-4 py-3 text-sm text-[#F0EDE8] placeholder-[#484F58] outline-none focus:border-[#00C27C]/50 transition-colors disabled:opacity-50"
          />
          <button type="submit" disabled={!input.trim() || !!thinking}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#00C27C] text-white flex items-center justify-center hover:bg-[#00A066] transition-colors disabled:opacity-30">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="rounded-2xl border border-[#38332B] bg-[#141210] max-h-[400px] overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'agent' && (
                <div className="w-7 h-7 rounded-lg bg-[#00C27C]/10 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-3.5 h-3.5 text-[#00C27C]" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-[#00C27C]/15 border border-[#00C27C]/30 rounded-2xl rounded-tr-md px-4 py-2.5' : ''}`}>
                <p className="text-sm text-[#F0EDE8] whitespace-pre-wrap">{msg.text}</p>
                {msg.component === 'kb' && msg.data?.map((article, j) => <KBArticleCard key={j} article={article} />)}
                {msg.component === 'bug_gather' && <BugDetailGatherer onSubmit={handleBugSubmit} kbResults={msg.data.kbResults} />}
                {msg.component === 'bug_report' && <BugReportCard data={msg.data} />}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#00C27C]/10 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-3.5 h-3.5 text-[#00C27C]" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1C1B1A] border border-[#38332B] rounded-2xl rounded-tl-md">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-[#ADA599]">{thinking}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Integration Health */}
      <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-4">
        <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-3">Integration Health</h3>
        <div className="space-y-2">
          {integrations.map(i => (
            <div key={i.name} className="flex items-center justify-between p-2.5 rounded-lg bg-[#141210] border border-[#21262D]">
              <span className="text-xs text-[#F0EDE8]">{i.name}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${statusDot[i.status]}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NEW ACCOUNT SECTION (billing + 280E)
   ═══════════════════════════════════════════════════════════════════ */

function AccountSection() {
  const taxData = {
    revenue: 13600000,
    cogs: 7085600,
    cogsPercent: 52.1,
    deductible: 6800000,
    quarterlySavings: 89400,
  };
  const categories = [
    { name: 'Inventory Purchases', amount: '$4.2M', deductible: true },
    { name: 'Employee Wages (Direct)', amount: '$1.8M', deductible: true },
    { name: 'Packaging & Labels', amount: '$420K', deductible: true },
    { name: 'Marketing & Advertising', amount: '$380K', deductible: false },
    { name: 'Rent & Utilities', amount: '$290K', deductible: false },
  ];

  return (
    <div className="space-y-6">
      {/* Existing Billing */}
      <BillingSection />

      {/* 280E Tax Optimization */}
      <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#B598E8]" />
          <h3 className="text-lg font-bold text-[#F0EDE8]">280E Tax Optimization</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-[#141210] rounded-lg p-3 text-center border border-[#21262D]">
            <p className="text-lg font-bold text-[#F0EDE8]">$13.6M</p>
            <p className="text-[10px] text-[#ADA599] uppercase">Revenue</p>
          </div>
          <div className="bg-[#141210] rounded-lg p-3 text-center border border-[#21262D]">
            <p className="text-lg font-bold text-[#D4A03A]">$7.1M</p>
            <p className="text-[10px] text-[#ADA599] uppercase">COGS ({taxData.cogsPercent}%)</p>
          </div>
          <div className="bg-[#141210] rounded-lg p-3 text-center border border-[#21262D]">
            <p className="text-lg font-bold text-[#00C27C]">$6.8M</p>
            <p className="text-[10px] text-[#ADA599] uppercase">Deductible</p>
          </div>
          <div className="bg-[#141210] rounded-lg p-3 text-center border border-[#21262D]">
            <p className="text-lg font-bold text-[#00C27C]">$89.4K</p>
            <p className="text-[10px] text-[#ADA599] uppercase">Qtrly Savings</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#38332B] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#141210] text-[10px] text-[#ADA599] uppercase">
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-right px-3 py-2">Amount</th>
                <th className="text-center px-3 py-2">280E Deductible</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={i} className="border-t border-[#21262D]">
                  <td className="px-3 py-2 text-sm text-[#F0EDE8]">{cat.name}</td>
                  <td className="px-3 py-2 text-sm text-[#F0EDE8] text-right font-medium">{cat.amount}</td>
                  <td className="px-3 py-2 text-center">
                    {cat.deductible
                      ? <Check className="w-4 h-4 text-[#00C27C] mx-auto" />
                      : <X className="w-4 h-4 text-[#6B6359] mx-auto" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border border-[#38332B] text-sm text-[#ADA599] hover:text-[#F0EDE8] hover:bg-[#282724] transition-colors">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NEW PRODUCT SECTION
   ═══════════════════════════════════════════════════════════════════ */

function ProductSection({ interactions }) {
  const features = [
    { name: 'POS', pct: 92, color: '#00C27C', active: true },
    { name: 'Ecommerce', pct: 78, color: '#00C27C', active: true },
    { name: 'Payments', pct: 45, color: '#D4A03A', active: true },
    { name: 'Analytics', pct: 31, color: '#D4A03A', active: true },
    { name: 'White Label', pct: 0, color: '#484F58', active: false, price: '$499/mo' },
    { name: 'Menu Boards', pct: 0, color: '#484F58', active: false, price: '$149/mo' },
  ];
  const benchmarks = [
    { metric: 'Avg Basket', yours: '$83', peers: '$78', pctile: 72 },
    { metric: 'Conversion', yours: '3.2%', peers: '2.8%', pctile: 81 },
    { metric: 'Reviews', yours: '4.3', peers: '4.1', pctile: 68 },
  ];
  const trainingLinks = [
    { title: 'POS Quick Start Guide', category: 'POS' },
    { title: 'Ecommerce Menu Management', category: 'Ecommerce' },
    { title: 'Payment Processing Setup', category: 'Payments' },
    { title: 'Analytics Dashboard Tutorial', category: 'Analytics' },
    { title: 'Campaign Best Practices', category: 'Marketing' },
  ];

  return (
    <div className="space-y-6">
      {/* Feature Adoption */}
      <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-5">
        <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-4">Feature Adoption</h3>
        <div className="space-y-3">
          {features.map(f => (
            <div key={f.name} className="flex items-center gap-3">
              <span className="text-sm text-[#F0EDE8] w-24">{f.name}</span>
              <div className="flex-1 bg-[#282724] rounded-full h-2.5 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
              </div>
              {f.active ? (
                <span className="text-sm font-medium text-[#F0EDE8] w-12 text-right">{f.pct}%</span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded border border-[#38332B] text-[#ADA599]">{f.price}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Peer Benchmarks */}
      <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-5">
        <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-4">Peer Benchmarks</h3>
        <div className="space-y-2">
          {benchmarks.map(b => (
            <div key={b.metric} className="flex items-center justify-between p-3 rounded-lg bg-[#141210] border border-[#21262D]">
              <div>
                <p className="text-sm font-medium text-[#F0EDE8]">{b.metric}</p>
                <p className="text-xs text-[#ADA599]">You: {b.yours} vs Peers: {b.peers}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${b.pctile >= 75 ? 'bg-[#00C27C]/15 text-[#00C27C]' : 'bg-[#D4A03A]/15 text-[#D4A03A]'}`}>
                P{b.pctile}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Release Notes */}
      <WhatsNewSection interactions={interactions} />

      {/* Training Resources */}
      <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-5">
        <h3 className="text-sm font-semibold text-[#ADA599] uppercase tracking-wider mb-4">Training Resources</h3>
        <div className="space-y-2">
          {trainingLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#141210] border border-[#21262D] hover:bg-[#282724] transition-colors cursor-pointer">
              <BookOpen className="w-4 h-4 text-[#64A8E0] flex-shrink-0" />
              <span className="text-sm text-[#F0EDE8] flex-1">{link.title}</span>
              <span className="text-xs text-[#6B6359]">{link.category}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6B6359]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PORTAL PAGE
   ═══════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { key: 'interactions', label: 'Interactions', icon: Ticket },
  { key: 'whats-new', label: "What's New", icon: Megaphone },
  { key: 'coming-soon', label: 'Coming Soon', icon: Rocket },
  { key: 'schedule', label: 'Schedule', icon: Calendar },
  { key: 'billing', label: 'Billing', icon: Receipt },
];

export default function CustomerPortal() {
  const { interactions } = usePortal();
  const [section, setSection] = useState('interactions');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0EDE8]">Customer Portal</h1>
          <p className="text-sm text-[#ADA599] mt-1">All your interactions with Dutchie in one place</p>
        </div>
      </div>

      {/* Section toggle */}
      <div className="flex items-center gap-1 bg-[#1C1B1A] rounded-lg p-1 border border-[#38332B] w-fit">
        {SECTIONS.map(s => {
          const isActive = section === s.key;
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#00C27C]/15 text-[#00C27C]'
                  : 'text-[#ADA599] hover:text-[#F0EDE8] hover:bg-[#282724]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Section content */}
      {section === 'interactions' && <InteractionsSection interactions={interactions} />}
      {section === 'whats-new' && <WhatsNewSection interactions={interactions} />}
      {section === 'coming-soon' && <ComingSoonSection interactions={interactions} />}
      {section === 'schedule' && <ScheduleSection />}
      {section === 'billing' && <BillingSection />}

      {/* Support chat widget */}
      <PortalSupportWidget />
    </div>
  );
}
