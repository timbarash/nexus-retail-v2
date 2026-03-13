import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bot, Sparkles, Send, ArrowLeft, ChevronRight, Zap, TrendingUp,
  ShoppingBag, Package, Truck, AlertTriangle, CheckCircle2, Clock,
  DollarSign, BarChart3, Star, Hash, ArrowUpDown, RefreshCw,
  ChevronDown, ChevronUp, Check, X, Search, Filter, Store,
  Layers, Box, ShoppingCart, Award, Percent, Heart, Eye,
  Building2, Phone, Mail, Globe, MapPin, Calendar, ArrowRight,
  PackageCheck, PackageX, TrendingDown, CircleDollarSign, Shield
} from 'lucide-react';
import { generateConnectResponse, generateConnectAnalysis, isGeminiAvailable } from '../utils/gemini';

/* ═══════════════════════════════════════════════════════════════════
   ICON MAP & RESOLVER
   ═══════════════════════════════════════════════════════════════════ */

const ICON_MAP = {
  PackageX, CircleDollarSign, RefreshCw, TrendingDown, TrendingUp,
  Building2, Truck, Package, ShoppingBag, ShoppingCart, Clock,
  DollarSign, BarChart3, Star, Award, Percent, Heart, Zap,
  Sparkles, Eye, Store, Layers, Box, MapPin, Calendar, Search,
  AlertTriangle, CheckCircle2, PackageCheck, Mail, Phone, Globe,
};

function resolveIcon(icon) {
  if (typeof icon === 'function') return icon;
  return ICON_MAP[icon] || Sparkles;
}

/* ═══════════════════════════════════════════════════════════════════
   BRAND DATA
   ═══════════════════════════════════════════════════════════════════ */

const BRANDS = {
  jeeter: { name: 'Jeeter', color: '#7B2D8E', category: 'Pre-Rolls & Vapes' },
  stiiizy: { name: 'STIIIZY', color: '#000000', category: 'Vapes & Pods' },
  rawgarden: { name: 'Raw Garden', color: '#4CAF50', category: 'Live Resin' },
  kiva: { name: 'Kiva', color: '#8B4513', category: 'Edibles' },
  plusproducts: { name: 'PLUS', color: '#FF6B35', category: 'Edibles' },
  alienlabs: { name: 'Alien Labs', color: '#00BCD4', category: 'Flower & Pre-Rolls' },
  cookies: { name: 'Cookies', color: '#2196F3', category: 'Flower' },
  wyld: { name: 'Wyld', color: '#E91E63', category: 'Edibles' },
  papabarkley: { name: 'Papa & Barkley', color: '#2E7D32', category: 'Topicals' },
};

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CATALOG DATA
   ═══════════════════════════════════════════════════════════════════ */

const OUT_OF_STOCK_PRODUCTS = [
  {
    id: 'stz-001',
    brand: 'STIIIZY',
    name: 'STIIIZY OG Kush Pod',
    type: 'Vape Pod · 1g',
    thc: '86%',
    lastPrice: '$35.00',
    avgWeeklySales: 42,
    daysOutOfStock: 3,
    urgency: 'high',
    supplier: 'STIIIZY Direct',
    leadTime: '2-3 days',
    brandColor: '#1a1a1a',
    image: '/brands/stiiizy-pods.png',
    recommendedQty: 36,
  },
  {
    id: 'kv-001',
    brand: 'Kiva',
    name: 'Camino Pineapple Habanero Gummies',
    type: 'Edible · 100mg',
    thc: '10mg/pc',
    lastPrice: '$22.00',
    avgWeeklySales: 38,
    daysOutOfStock: 1,
    urgency: 'high',
    supplier: 'Kiva Sales Inc.',
    leadTime: '3-5 days',
    brandColor: '#8B4513',
    image: '/brands/kiva-camino.jpg',
    recommendedQty: 24,
  },
  {
    id: 'rg-001',
    brand: 'Raw Garden',
    name: 'Refined Live Resin Cart — Slippery Susan',
    type: 'Vape Cart · 1g',
    thc: '82%',
    lastPrice: '$40.00',
    avgWeeklySales: 28,
    daysOutOfStock: 5,
    urgency: 'medium',
    supplier: 'Raw Garden LLC',
    leadTime: '3-4 days',
    brandColor: '#4CAF50',
    image: '/brands/raw-garden-cart.webp',
    recommendedQty: 18,
  },
  {
    id: 'wy-001',
    brand: 'Wyld',
    name: 'Elderberry Gummies — Indica',
    type: 'Edible · 100mg',
    thc: '10mg/pc',
    lastPrice: '$18.00',
    avgWeeklySales: 22,
    daysOutOfStock: 2,
    urgency: 'medium',
    supplier: 'Wyld Distribution',
    leadTime: '4-5 days',
    brandColor: '#E91E63',
    image: '/brands/wyld-elderberry.png',
    recommendedQty: 18,
  },
  {
    id: 'jt-001',
    brand: 'Jeeter',
    name: 'Baby Jeeter Infused — Churros',
    type: '5pk Pre-Rolls · 2.5g',
    thc: '46%',
    lastPrice: '$25.00',
    avgWeeklySales: 56,
    daysOutOfStock: 0,
    urgency: 'low',
    supplier: 'DreamFields (Jeeter)',
    leadTime: '2-3 days',
    note: 'Low stock — 8 units remaining',
    brandColor: '#7B2D8E',
    image: '/brands/jeeter-baby-churros.webp',
    recommendedQty: 48,
  },
];

const NEW_PRODUCTS = [
  {
    id: 'al-new-001',
    brand: 'Alien Labs',
    name: 'Xeno — Live Resin Disposable',
    type: 'Disposable Vape · 1g',
    thc: '88%',
    wholesalePrice: '$28.00',
    suggestedRetail: '$48.00',
    margin: '42%',
    trending: true,
    rating: 4.8,
    brandColor: '#00BCD4',
    description: 'New live resin disposable. Top seller across CA dispensaries last 30 days.',
    image: '/brands/alien-xeno.png',
  },
  {
    id: 'ck-new-001',
    brand: 'Cookies',
    name: 'Gary Payton — 3.5g Flower',
    type: 'Flower · 3.5g',
    thc: '28%',
    wholesalePrice: '$32.00',
    suggestedRetail: '$55.00',
    margin: '42%',
    trending: true,
    rating: 4.9,
    brandColor: '#2196F3',
    description: 'Iconic strain. Consistent top-5 seller in NYC metro dispensaries.',
    image: '/brands/cookies-gary-payton.png',
  },
  {
    id: 'ps-new-001',
    brand: 'PLUS',
    name: 'Dual Chamber Gummies — Uplift/Chill',
    type: 'Edible · 200mg',
    thc: '10mg/pc',
    wholesalePrice: '$14.00',
    suggestedRetail: '$28.00',
    margin: '50%',
    trending: false,
    rating: 4.6,
    brandColor: '#FF6B35',
    description: 'Two-flavor gummy pack. Great for cross-selling to edible customers.',
    image: '/brands/plus-gummies.jpg',
  },
  {
    id: 'rg-new-001',
    brand: 'Raw Garden',
    name: 'Refined Live Resin — Lemon Glaze',
    type: 'Vape Cart · 1g',
    thc: '85%',
    wholesalePrice: '$24.00',
    suggestedRetail: '$42.00',
    margin: '43%',
    trending: false,
    rating: 4.7,
    brandColor: '#4CAF50',
    description: 'New strain addition. Pairs well with existing Raw Garden inventory.',
    image: '/brands/raw-garden-cart.webp',
  },
  {
    id: 'wy-new-001',
    brand: 'Wyld',
    name: 'Raspberry Gummies — Sativa',
    type: 'Edible · 100mg',
    thc: '10mg/pc',
    wholesalePrice: '$11.00',
    suggestedRetail: '$22.00',
    margin: '50%',
    trending: true,
    rating: 4.9,
    brandColor: '#E91E63',
    description: 'America\'s #1 selling cannabis gummy. Real fruit, sativa-enhanced terpenes for uplifting energy.',
    image: '/brands/wyld-raspberry.png',
  },
  {
    id: 'pb-new-001',
    brand: 'Papa & Barkley',
    name: 'Releaf Balm 1:3 — THC Rich',
    type: 'Topical · 50ml',
    thc: '300mg THC',
    wholesalePrice: '$24.00',
    suggestedRetail: '$48.00',
    margin: '50%',
    trending: false,
    rating: 4.8,
    brandColor: '#2E7D32',
    description: 'Award-winning topical for deep muscle relief. Solventless, full-spectrum cannabis infusion.',
    image: '/brands/papa-barkley-balm.jpg',
  },
];

const REORDER_RECOMMENDATIONS = [
  { brand: 'Jeeter', product: 'Baby Jeeter Churros 5pk', qty: 48, reason: 'Sells out within 4 days avg', unitPrice: 15.00, avgWeeklySales: 56 },
  { brand: 'STIIIZY', product: 'OG Kush Pod 1g', qty: 36, reason: 'Currently out of stock, high demand', unitPrice: 21.00, avgWeeklySales: 42 },
  { brand: 'Kiva', product: 'Camino Pineapple Habanero', qty: 24, reason: '1 day out of stock, trending up', unitPrice: 13.00, avgWeeklySales: 38 },
  { brand: 'Wyld', product: 'Elderberry Indica Gummies', qty: 18, reason: '2 days out of stock', unitPrice: 11.00, avgWeeklySales: 22 },
];

/* Brand Funded Discounts — derive from product brand so discounts always match */
const BRAND_DISCOUNT_RATES = {
  'Jeeter':       15,
  'STIIIZY':      10,
  'Kiva':          8,
  'Raw Garden':   10,
  'Wyld':         12,
  'Cookies':      10,
  'Alien Labs':    8,
  'PLUS':         10,
  'Papa & Barkley': 8,
};

function getBrandDiscount(brand) {
  const pct = BRAND_DISCOUNT_RATES[brand];
  if (!pct) return null;
  return { brand, pct, label: `${brand} ${pct}% Brand Funded` };
}

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARDS
   ═══════════════════════════════════════════════════════════════════ */

function OutOfStockCard({ product, selected, onToggle, quantity, onQuantityChange, discount, discountApplied, onToggleDiscount, subtotal, formulaQty, weeksOfCoverage }) {
  const unitPrice = parseFloat((product.lastPrice || '$0').replace('$', '')) || 0;
  const lineSubtotal = subtotal != null ? subtotal : unitPrice * quantity;

  return (
    <div
      className={`bg-[#141210] rounded-xl border p-4 transition-all ${
        selected ? 'border-[#00C27C] bg-[#00C27C]/5' : 'border-[#38332B] hover:border-[#38332B]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* checkbox */}
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors cursor-pointer ${
            selected ? 'bg-[#00C27C] border-[#00C27C]' : 'border-[#38332B]'
          }`}
          onClick={onToggle}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
        {/* product thumbnail */}
        {product.image && (
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-[#38332B]" style={{ background: `${product.brandColor}15` }}>
            <img src={product.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        {/* product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ background: product.brandColor }}>{product.brand}</span>
            {product.urgency === 'high' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Urgent</span>}
            {product.note && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">{product.note}</span>}
            {discount && (
              <button
                onClick={onToggleDiscount}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  discountApplied
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#38332B] text-[#ADA599] border border-[#38332B]'
                }`}
              >
                <Percent className="w-2.5 h-2.5" />
                {discount.label}
              </button>
            )}
          </div>
          <p className="text-sm font-medium text-[#F0EDE8]">{product.name}</p>
          <p className="text-xs text-[#ADA599]">{product.type} · THC {product.thc}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-[#ADA599]" />
              <span className="text-[11px] text-[#ADA599]">{product.avgWeeklySales}/wk avg</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#ADA599]" />
              <span className="text-[11px] text-[#ADA599]">{product.daysOutOfStock > 0 ? `${product.daysOutOfStock}d out` : 'Low stock'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#ADA599]" />
              <span className="text-[11px] text-[#ADA599]">{product.leadTime}</span>
            </div>
          </div>
          {formulaQty != null && weeksOfCoverage != null && (
            <p className="text-[10px] text-[#6B6359] mt-1.5">
              suggested: {formulaQty} ({product.avgWeeklySales}/wk × {weeksOfCoverage}wk)
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0 space-y-2">
          <div>
            <p className="text-sm font-bold text-[#F0EDE8]">{product.lastPrice}</p>
            <p className="text-[10px] text-[#ADA599]">unit cost</p>
          </div>
          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              className="w-6 h-6 rounded border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8] hover:border-[#38332B] flex items-center justify-center text-sm transition-colors"
            >−</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-12 h-6 text-center text-xs font-bold text-[#F0EDE8] bg-[#1C1B1A] border border-[#38332B] rounded focus:border-[#64A8E0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-6 h-6 rounded border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8] hover:border-[#38332B] flex items-center justify-center text-sm transition-colors"
            >+</button>
          </div>
          {selected && (
            <p className="text-[10px] font-medium text-[#F0EDE8]">
              ${lineSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              {discount && discountApplied && <span className="text-emerald-400 ml-1">(-{discount.pct}%)</span>}
            </p>
          )}
          {!selected && <p className="text-[10px] text-[#ADA599]">qty to order</p>}
        </div>
      </div>
    </div>
  );
}

function NewProductCard({ product }) {
  return (
    <div className="bg-[#141210] rounded-xl border border-[#38332B] hover:border-[#38332B] p-4 transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ background: product.brandColor }}>{product.brand}</span>
        {product.trending && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00C27C]/20 text-[#00C27C] font-medium flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" /> Trending</span>}
        <div className="ml-auto flex items-center gap-0.5">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[11px] text-amber-400 font-medium">{product.rating}</span>
        </div>
      </div>
      {/* product visual */}
      <div className="h-32 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden" style={{
        background: `linear-gradient(135deg, ${product.brandColor}22, ${product.brandColor}11)`,
      }}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 70% 30%, ${product.brandColor} 0%, transparent 60%)`,
            }} />
            <div className="relative text-center">
              {product.type.includes('Flower') ? (
                <div className="w-12 h-12 rounded-full mx-auto mb-1" style={{ background: `radial-gradient(circle, #4a7c3f, #2d5a27, #1a3a17)` }} />
              ) : product.type.includes('Vape') || product.type.includes('Disposable') ? (
                <div className="relative mx-auto w-5">
                  <div className="w-5 h-16 rounded-full mx-auto" style={{ background: `linear-gradient(to bottom, ${product.brandColor}88, ${product.brandColor}44)` }} />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-4 rounded-b-lg bg-[#1C1B1A]" />
                </div>
              ) : (
                <div className="w-14 h-10 rounded-lg mx-auto" style={{ background: `linear-gradient(135deg, ${product.brandColor}66, ${product.brandColor}33)`, border: `1px solid ${product.brandColor}44` }} />
              )}
            </div>
          </>
        )}
      </div>
      {/* info */}
      <p className="text-sm font-medium text-[#F0EDE8]">{product.name}</p>
      <p className="text-xs text-[#ADA599] mb-2">{product.type}</p>
      <p className="text-[11px] text-[#ADA599] leading-relaxed mb-3">{product.description}</p>
      {/* pricing */}
      <div className="flex items-center justify-between pt-3 border-t border-[#38332B]">
        <div>
          <p className="text-[10px] text-[#6B6359]">Wholesale</p>
          <p className="text-sm font-bold text-[#F0EDE8]">{product.wholesalePrice}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6B6359]">Retail</p>
          <p className="text-sm font-bold text-[#F0EDE8]">{product.suggestedRetail}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6B6359]">Margin</p>
          <p className="text-sm font-bold text-[#00C27C]">{product.margin}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COLLAPSIBLE SECTION
   ═══════════════════════════════════════════════════════════════════ */

function Section({ title, icon: Icon, iconColor, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-6 py-4 hover:bg-[#282724] transition-colors">
        <Icon className="w-5 h-5 flex-shrink-0" style={{ color: iconColor }} />
        <h2 className="text-base font-semibold text-[#F0EDE8]">{title}</h2>
        {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C27C]/10 text-[#00C27C] font-medium">{badge}</span>}
        <div className="ml-auto">{open ? <ChevronUp className="w-4 h-4 text-[#ADA599]" /> : <ChevronDown className="w-4 h-4 text-[#ADA599]" />}</div>
      </button>
      {open && <div className="px-6 pb-5 border-t border-[#38332B] pt-4">{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RESULT VIEWS
   ═══════════════════════════════════════════════════════════════════ */

export function ReorderView({ data, onBack }) {
  const products = data?.products || OUT_OF_STOCK_PRODUCTS;
  const recommendations = data?.recommendations || REORDER_RECOMMENDATIONS;

  const [selected, setSelected] = useState(() => new Set(products.filter(p => p.urgency === 'high').map(p => p.id)));
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [weeksOfCoverage, setWeeksOfCoverage] = useState(2);

  // Per-product brand discount toggles (default on for eligible items)
  const [discountsApplied, setDiscountsApplied] = useState(() => {
    const d = {};
    products.forEach(p => { if (getBrandDiscount(p.brand)) d[p.id] = true; });
    return d;
  });
  const [recDiscountsApplied, setRecDiscountsApplied] = useState(() => {
    const d = {};
    recommendations.forEach((r, i) => { if (getBrandDiscount(r.brand)) d[i] = true; });
    return d;
  });

  // Formula-driven quantities: avgWeeklySales × weeksOfCoverage
  const formulaQuantities = useMemo(() => {
    const q = {};
    products.forEach(p => { q[p.id] = Math.ceil((p.avgWeeklySales || 0) * weeksOfCoverage); });
    return q;
  }, [products, weeksOfCoverage]);

  const formulaRecQuantities = useMemo(() => {
    return recommendations.map(r => Math.ceil((r.avgWeeklySales || 0) * weeksOfCoverage));
  }, [recommendations, weeksOfCoverage]);

  const [quantities, setQuantities] = useState(() => {
    const q = {};
    products.forEach(p => { q[p.id] = p.recommendedQty || Math.ceil((p.avgWeeklySales || 0) * 2); });
    return q;
  });
  const [recQuantities, setRecQuantities] = useState(() => recommendations.map(r => r.qty || Math.ceil((r.avgWeeklySales || 0) * 2)));

  // Reset quantities when weeksOfCoverage changes
  useEffect(() => {
    setQuantities(() => {
      const q = {};
      products.forEach(p => { q[p.id] = Math.ceil((p.avgWeeklySales || 0) * weeksOfCoverage) || p.recommendedQty || 0; });
      return q;
    });
    setRecQuantities(recommendations.map(r => Math.ceil((r.avgWeeklySales || 0) * weeksOfCoverage) || r.qty || 0));
  }, [weeksOfCoverage, products, recommendations]);

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  // Unified cost calculation: selected out-of-stock products + recommendations
  const costBreakdown = useMemo(() => {
    // Out-of-stock products subtotal
    let productsSubtotal = 0;
    let productsSavings = 0;
    products.filter(p => selected.has(p.id)).forEach(p => {
      const price = parseFloat((p.lastPrice || '$0').replace('$', '')) || 0;
      const qty = quantities[p.id] || 0;
      const raw = price * qty;
      const disc = getBrandDiscount(p.brand);
      if (disc && discountsApplied[p.id]) {
        const saving = raw * (disc.pct / 100);
        productsSavings += saving;
        productsSubtotal += raw - saving;
      } else {
        productsSubtotal += raw;
      }
    });

    // Recommendations subtotal
    let recsSubtotal = 0;
    let recsSavings = 0;
    recommendations.forEach((r, i) => {
      const price = r.unitPrice || 0;
      const qty = recQuantities[i] || 0;
      const raw = price * qty;
      const disc = getBrandDiscount(r.brand);
      if (disc && recDiscountsApplied[i]) {
        const saving = raw * (disc.pct / 100);
        recsSavings += saving;
        recsSubtotal += raw - saving;
      } else {
        recsSubtotal += raw;
      }
    });

    const totalSavings = productsSavings + recsSavings;
    const grandTotal = productsSubtotal + recsSubtotal;

    return { productsSubtotal, recsSubtotal, totalSavings, grandTotal };
  }, [products, selected, quantities, discountsApplied, recommendations, recQuantities, recDiscountsApplied]);

  const handleOrder = () => {
    setOrdering(true);
    setTimeout(() => { setOrdering(false); setOrdered(true); }, 2200);
  };

  const heroTitle = data?.title || 'Reorder Out-of-Stock & Low-Stock Items';
  const lostRevenue = data?.lostRevenue || '$2,340/week';

  // Helper to compute per-product subtotal
  const getProductSubtotal = (p) => {
    const price = parseFloat((p.lastPrice || '$0').replace('$', '')) || 0;
    const qty = quantities[p.id] || 0;
    const raw = price * qty;
    const disc = getBrandDiscount(p.brand);
    if (disc && discountsApplied[p.id]) return raw * (1 - disc.pct / 100);
    return raw;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Agent
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#64A8E0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-[#64A8E0]" />
        </div>
        <div>
          <p className="text-sm text-[#ADA599]">
            <span className="text-[#F0EDE8] font-medium">Connect Agent</span> identified {products.length} items that need attention based on inventory levels and sales velocity
          </p>
        </div>
      </div>

      {/* inventory alert */}
      <div className="relative rounded-2xl border border-red-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-orange-900/20 to-amber-900/40" />
        <div className="relative px-8 py-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20 text-white/70 uppercase tracking-wider">Inventory Alert</span>
          </div>
          <h1 className="text-xl font-bold text-[#F0EDE8]">{heroTitle}</h1>
          <p className="text-sm text-[#ADA599] mt-1">
            {products.filter((p) => p.daysOutOfStock > 0).length} products are currently out of stock.
            Estimated lost revenue: <span className="text-red-400 font-medium">{lostRevenue}</span>
          </p>
        </div>
      </div>

      {/* weeks-of-stock slider */}
      <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-[#64A8E0]" />
          <span className="text-sm font-medium text-[#F0EDE8]">Coverage Target</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#64A8E0]/10 text-[#64A8E0] font-medium">
            {weeksOfCoverage} {weeksOfCoverage === 1 ? 'week' : 'weeks'} · {weeksOfCoverage * 7} days
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#ADA599] w-6 text-center">1</span>
          <input
            type="range"
            min="1"
            max="6"
            value={weeksOfCoverage}
            onChange={(e) => setWeeksOfCoverage(parseInt(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-[#38332B] accent-[#64A8E0] cursor-pointer"
          />
          <span className="text-xs text-[#ADA599] w-6 text-center">6</span>
        </div>
        <p className="text-[11px] text-[#6B6359] mt-2">
          Formula: avg weekly sales × {weeksOfCoverage} week{weeksOfCoverage !== 1 ? 's' : ''} — quantities auto-adjust when you move the slider
        </p>
      </div>

      {/* out of stock items */}
      <Section title="Items Needing Reorder" icon={PackageX} iconColor="#E87068" badge={`${products.length} items`}>
        <div className="space-y-3">
          {products.map((p) => (
            <OutOfStockCard
              key={p.id}
              product={p}
              selected={selected.has(p.id)}
              onToggle={() => toggle(p.id)}
              quantity={quantities[p.id] || 0}
              onQuantityChange={(val) => setQuantities(prev => ({ ...prev, [p.id]: val }))}
              discount={getBrandDiscount(p.brand)}
              discountApplied={!!discountsApplied[p.id]}
              onToggleDiscount={() => setDiscountsApplied(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
              subtotal={getProductSubtotal(p)}
              formulaQty={formulaQuantities[p.id]}
              weeksOfCoverage={weeksOfCoverage}
            />
          ))}
        </div>
      </Section>

      {/* smart reorder quantities */}
      <Section title="Recommended Order Quantities" icon={BarChart3} iconColor="#B598E8" badge="Editable">
        <p className="text-xs text-[#ADA599] mb-4">Quantities are calculated based on rolling 30-day sales velocity, seasonal trends, and lead time buffer. Adjust as needed.</p>
        <div className="space-y-2">
          {recommendations.map((r, i) => {
            const lineCost = (r.unitPrice || 0) * (recQuantities[i] || 0);
            const disc = getBrandDiscount(r.brand);
            const discApplied = !!recDiscountsApplied[i];
            const finalCost = disc && discApplied ? lineCost * (1 - disc.pct / 100) : lineCost;

            return (
              <div key={i} className="bg-[#141210] rounded-lg p-3 border border-[#38332B]">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#B598E8]/10">
                    <Package className="w-4 h-4 text-[#B598E8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-medium text-[#F0EDE8]">{r.brand} — {r.product}</p>
                      {disc && (
                        <button
                          onClick={() => setRecDiscountsApplied(prev => ({ ...prev, [i]: !prev[i] }))}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                            discApplied
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#38332B] text-[#ADA599] border border-[#38332B]'
                          }`}
                        >
                          <Percent className="w-2.5 h-2.5" />
                          {disc.label}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#ADA599]">{r.reason}</p>
                    {r.avgWeeklySales != null && r.unitPrice != null && (
                      <p className="text-[10px] text-[#6B6359] mt-0.5">
                        suggested: {formulaRecQuantities[i]} ({r.avgWeeklySales}/wk × {weeksOfCoverage}wk) · ${(r.unitPrice || 0).toFixed(2)}/unit
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setRecQuantities(prev => { const next = [...prev]; next[i] = Math.max(0, next[i] - 1); return next; })}
                        className="w-6 h-6 rounded border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8] hover:border-[#38332B] flex items-center justify-center text-sm transition-colors"
                      >−</button>
                      <input
                        type="number"
                        value={recQuantities[i]}
                        onChange={(e) => setRecQuantities(prev => { const next = [...prev]; next[i] = Math.max(0, parseInt(e.target.value) || 0); return next; })}
                        className="w-14 h-6 text-center text-xs font-bold text-[#F0EDE8] bg-[#1C1B1A] border border-[#38332B] rounded focus:border-[#B598E8] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => setRecQuantities(prev => { const next = [...prev]; next[i] = next[i] + 1; return next; })}
                        className="w-6 h-6 rounded border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8] hover:border-[#38332B] flex items-center justify-center text-sm transition-colors"
                      >+</button>
                    </div>
                    <div className="text-right w-20">
                      <p className="text-xs font-medium text-[#F0EDE8]">
                        ${finalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      {disc && discApplied && (
                        <p className="text-[10px] text-emerald-400">-{disc.pct}%</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Itemized cost breakdown */}
        <div className="mt-4 pt-4 border-t border-[#38332B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#ADA599]">Selected products ({selected.size} items)</span>
            <span className="text-xs text-[#F0EDE8]">${costBreakdown.productsSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#ADA599]">Recommendations ({recommendations.length} items)</span>
            <span className="text-xs text-[#F0EDE8]">${costBreakdown.recsSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {costBreakdown.totalSavings > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Percent className="w-3 h-3" /> Brand funded discounts
              </span>
              <span className="text-xs text-emerald-400">-${costBreakdown.totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-[#38332B]">
            <span className="text-sm font-medium text-[#F0EDE8]">Grand Total</span>
            <span className="text-lg font-bold text-[#F0EDE8]">${costBreakdown.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </Section>

      {/* supplier info */}
      <Section title="Supplier Details" icon={Building2} iconColor="#64A8E0" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...new Map(products.map((p) => [p.supplier, p])).values()].map((p) => (
            <div key={p.supplier} className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
              <p className="text-sm font-medium text-[#F0EDE8] mb-1">{p.supplier}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-[#ADA599]">
                  <Truck className="w-3 h-3" /> Lead time: {p.leadTime}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#ADA599]">
                  <Phone className="w-3 h-3" /> Account rep on file
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#ADA599]">
                  <CheckCircle2 className="w-3 h-3 text-[#00C27C]" /> Verified supplier
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Compliance Check */}
      <div className="mt-4 p-3 rounded-xl border border-[#38332B] bg-[#141210]">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#64A8E0]" />
          <span className="text-xs font-semibold text-[#64A8E0]">Compliance Check</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00C27C]/20 flex items-center justify-center"><span className="text-[8px] text-[#00C27C]">✓</span></div>
            <span className="text-[#F0EDE8]">All vendors licensed in state</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00C27C]/20 flex items-center justify-center"><span className="text-[8px] text-[#00C27C]">✓</span></div>
            <span className="text-[#F0EDE8]">Order quantity within daily receiving limit</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00C27C]/20 flex items-center justify-center"><span className="text-[8px] text-[#00C27C]">✓</span></div>
            <span className="text-[#F0EDE8]">Products match approved manifest categories</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#64A8E0]/20 flex items-center justify-center"><span className="text-[8px] text-[#64A8E0]">i</span></div>
            <span className="text-[#ADA599]">METRC transfer manifest auto-generated on receipt</span>
          </div>
        </div>
      </div>

      {/* order CTA */}
      <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-6">
        {ordered ? (
          <div className="flex items-center gap-3 justify-center py-4 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-[#00C27C]" />
            <div>
              <p className="text-[#F0EDE8] font-semibold">Purchase Orders Submitted</p>
              <p className="text-sm text-[#ADA599]">{selected.size} orders sent to suppliers. Estimated delivery in 2-5 business days.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-[#F0EDE8] font-medium">Place reorder for {selected.size} items + {recommendations.length} recommended?</p>
              <p className="text-sm text-[#ADA599]">Purchase orders will be sent to respective suppliers.
                {costBreakdown.totalSavings > 0 && <span className="text-emerald-400"> Saving ${costBreakdown.totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with brand funded discounts.</span>}
              </p>
            </div>
            <button
              onClick={handleOrder}
              disabled={ordering || selected.size === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#64A8E0] to-[#2563EB] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
            >
              {ordering ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><ShoppingCart className="w-4 h-4" /> Place Orders — ${costBreakdown.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExploreView({ data, onBack }) {
  const products = data?.products || NEW_PRODUCTS;
  const brandPerformance = data?.brandPerformance || [
    { name: 'Jeeter', revenue: '$12,400/mo', growth: '+18%', color: '#7B2D8E', pct: 85 },
    { name: 'STIIIZY', revenue: '$10,800/mo', growth: '+12%', color: '#1a1a1a', pct: 74 },
    { name: 'Kiva', revenue: '$8,200/mo', growth: '+8%', color: '#8B4513', pct: 56 },
    { name: 'Raw Garden', revenue: '$7,600/mo', growth: '+5%', color: '#4CAF50', pct: 52 },
    { name: 'Cookies', revenue: '$6,100/mo', growth: '+22%', color: '#2196F3', pct: 42 },
  ];
  const categoryGaps = data?.categoryGaps || [
    { category: 'Disposable Vapes', gap: '32% under-indexed', opportunity: '+$4,200/mo', color: '#64A8E0' },
    { category: 'Topicals & Tinctures', gap: '28% under-indexed', opportunity: '+$1,800/mo', color: '#B598E8' },
    { category: 'Beverages', gap: '45% under-indexed', opportunity: '+$2,100/mo', color: '#00C27C' },
  ];
  const [cart, setCart] = useState(new Set());

  const heroTitle = data?.title || 'Explore New Products from Top Brands';
  const heroSubtitle = data?.subtitle || `${products.length} recommended products based on market trends and catalog gap analysis`;

  return (
    <div className="space-y-4 animate-fade-in">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Agent
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#64A8E0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-[#64A8E0]" />
        </div>
        <div>
          <p className="text-sm text-[#ADA599]">
            <span className="text-[#F0EDE8] font-medium">Connect Agent</span> curated these products based on your sales data, trending products in the NYC market, and gap analysis of your current catalog
          </p>
        </div>
      </div>

      {/* hero */}
      <div className="relative rounded-2xl border border-blue-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/20 to-purple-900/40" />
        <div className="relative px-8 py-6">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20 text-white/70 uppercase tracking-wider">Product Discovery</span>
          <h1 className="text-xl font-bold text-[#F0EDE8] mt-2">{heroTitle}</h1>
          <p className="text-sm text-[#ADA599] mt-1">{heroSubtitle}</p>
        </div>
      </div>

      {/* trending products */}
      <Section title="Recommended for Your Store" icon={TrendingUp} iconColor="#00C27C" badge={`${products.length} products`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <NewProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* brand performance */}
      <Section title="Your Top Brands by Revenue" icon={Award} iconColor="#D4A03A" defaultOpen={false}>
        <div className="space-y-2">
          {brandPerformance.map((b) => (
            <div key={b.name} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: b.color + '33' }}>
                <span className="text-[10px] font-bold text-white">{b.name[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#F0EDE8]">{b.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#ADA599]">{b.revenue}</span>
                    <span className="text-[10px] text-[#00C27C]">{b.growth}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[#38332B]">
                  <div className="h-1.5 rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* category analysis */}
      <Section title="Category Gap Analysis" icon={Layers} iconColor="#EC4899" defaultOpen={false}>
        <p className="text-xs text-[#ADA599] mb-4">Categories where your store is under-indexed compared to NYC market average.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categoryGaps.map((c) => (
            <div key={c.category} className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
              <p className="text-xs font-medium text-[#F0EDE8] mb-1">{c.category}</p>
              <p className="text-[11px] text-[#ADA599] mb-2">{c.gap}</p>
              <p className="text-sm font-bold" style={{ color: c.color }}>{c.opportunity}</p>
              <p className="text-[10px] text-[#6B6359]">est. revenue opportunity</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export function RecommendationsView({ data, onBack }) {
  const metrics = data?.metrics || [
    { label: 'Stockout Rate', value: '6.2%', change: '-1.8%', iconName: 'PackageX', color: '#E87068', changeColor: '#00C27C' },
    { label: 'Avg Margin', value: '43.1%', change: '+2.4%', iconName: 'CircleDollarSign', color: '#00C27C', changeColor: '#00C27C' },
    { label: 'Inventory Turns', value: '4.8x', change: '+0.3', iconName: 'RefreshCw', color: '#64A8E0', changeColor: '#00C27C' },
    { label: 'Dead Stock', value: '$1,240', change: '-$680', iconName: 'TrendingDown', color: '#D4A03A', changeColor: '#00C27C' },
  ];
  const actionItems = data?.actionItems || [
    { action: 'Increase Jeeter Baby Jeeter Churros order qty from 36 to 48 units', reason: 'Consistently sells out 2 days before restock. Lost ~$840/mo in revenue.', priority: 'High' },
    { action: 'Add Alien Labs Xeno Disposable to catalog', reason: 'Top trending disposable in NYC. 42% margin. No disposable vapes currently in catalog.', priority: 'High' },
    { action: 'Reduce Wyld Elderberry order from 24 to 14 units', reason: 'Sales velocity dropped 30% last month. Current qty leads to 6+ days overstock.', priority: 'Medium' },
    { action: 'Negotiate bulk pricing with STIIIZY for OG Kush pods', reason: 'Your #2 seller. Increasing order to 48+ units may unlock tier 2 pricing (~8% savings).', priority: 'Medium' },
    { action: 'Consider dropping Select Elite cartridge line', reason: 'Below 2 units/week avg sales. $380 in dead stock. Shelf space better used for Raw Garden expansion.', priority: 'Low' },
  ];

  const heroTitle = data?.title || 'Purchasing Recommendations';
  const heroSubtitle = data?.subtitle || 'Maximize margins and reduce stockouts with data-driven ordering';

  const priorityColors = { High: '#E87068', Medium: '#D4A03A', Low: '#64A8E0' };

  return (
    <div className="space-y-4 animate-fade-in">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Agent
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#64A8E0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-[#64A8E0]" />
        </div>
        <p className="text-sm text-[#ADA599]">
          <span className="text-[#F0EDE8] font-medium">Connect Agent</span> analyzed your inventory performance over the last 90 days. Here are actionable purchasing recommendations:
        </p>
      </div>

      {/* hero */}
      <div className="relative rounded-2xl border border-green-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-900/20 to-teal-900/40" />
        <div className="relative px-8 py-6">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20 text-white/70 uppercase tracking-wider">Smart Purchasing</span>
          <h1 className="text-xl font-bold text-[#F0EDE8] mt-2">{heroTitle}</h1>
          <p className="text-sm text-[#ADA599] mt-1">{heroSubtitle}</p>
        </div>
      </div>

      {/* key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const MIcon = resolveIcon(m.iconName || m.icon);
          return (
            <div key={m.label} className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-4">
              <MIcon className="w-4 h-4 mb-2" style={{ color: m.color || '#64A8E0' }} />
              <p className="text-[10px] text-[#6B6359]">{m.label}</p>
              <p className="text-lg font-bold text-[#F0EDE8]">{m.value}</p>
              <p className="text-[10px] font-medium" style={{ color: m.changeColor || '#00C27C' }}>{m.change} vs last month</p>
            </div>
          );
        })}
      </div>

      {/* recommendations */}
      <Section title="Action Items" icon={Zap} iconColor="#D4A03A" badge={`${actionItems.length} recommendations`}>
        <div className="space-y-3">
          {actionItems.map((r, i) => {
            const color = priorityColors[r.priority] || '#8B949E';
            return (
              <div key={i} className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: color + '22', color }}>{r.priority}</span>
                </div>
                <p className="text-sm font-medium text-[#F0EDE8] mb-1">{r.action}</p>
                <p className="text-xs text-[#ADA599] leading-relaxed">{r.reason}</p>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TYPING INDICATOR
   ═══════════════════════════════════════════════════════════════════ */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-[#64A8E0]/20 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-[#64A8E0]" />
      </div>
      <div className="bg-[#1C1B1A] border border-[#38332B] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SUGGESTION DATA
   ═══════════════════════════════════════════════════════════════════ */

const SUGGESTIONS = [
  {
    key: 'reorder-oos',
    label: 'Reorder Out-of-Stock',
    prompt: 'Analyze our out-of-stock products and generate optimal reorder quantities with supplier details and cost estimates',
    description: 'Scan inventory for stockouts and low-stock items, generate optimal reorder quantities with cost estimates',
    icon: PackageX,
    gradient: 'from-red-600/20 to-orange-600/20',
    border: 'hover:border-red-500/40',
    tag: 'Urgent',
    tagColor: '#E87068',
    confidence: 'high',
  },
  {
    key: 'explore-new',
    label: 'Explore New Products',
    prompt: 'Identify trending products in the NYC cannabis market that we should add to our catalog, with margin analysis',
    description: 'Discover trending products from top brands based on NYC market data and your catalog gaps',
    icon: Sparkles,
    gradient: 'from-blue-600/20 to-indigo-600/20',
    border: 'hover:border-blue-500/40',
    tag: 'Discovery',
    tagColor: '#64A8E0',
    confidence: 'medium',
  },
  {
    key: 'purchasing-recs',
    label: 'Purchasing Recommendations',
    prompt: 'Generate purchasing optimization recommendations: reorder quantities, dead stock reduction, margin improvement, and supplier negotiation opportunities',
    description: 'AI-powered order optimization: adjust quantities, negotiate pricing, reduce dead stock',
    icon: TrendingUp,
    gradient: 'from-green-600/20 to-emerald-600/20',
    border: 'hover:border-green-500/40',
    tag: 'Optimization',
    tagColor: '#00C27C',
    confidence: 'high',
  },
  {
    key: 'margin-analysis',
    label: 'Margin Analysis',
    prompt: 'Perform a deep-dive margin analysis across all product categories and brands, identifying the highest and lowest margin items and opportunities to improve profitability',
    description: 'Deep-dive into margins by category and brand — find profit opportunities and underperformers',
    icon: CircleDollarSign,
    gradient: 'from-emerald-600/20 to-green-600/20',
    border: 'hover:border-emerald-500/40',
    tag: 'Profitability',
    tagColor: '#00C27C',
  },
  {
    key: 'vendor-comparison',
    label: 'Vendor Comparison',
    prompt: 'Compare our current suppliers on pricing, lead times, reliability, and minimum order quantities, and recommend which vendors to consolidate or negotiate with',
    description: 'Compare suppliers on pricing, lead times, reliability, and negotiation leverage',
    icon: Building2,
    gradient: 'from-indigo-600/20 to-purple-600/20',
    border: 'hover:border-indigo-500/40',
    tag: 'Suppliers',
    tagColor: '#B598E8',
  },
  {
    key: 'seasonal-forecast',
    label: 'Seasonal Forecast',
    prompt: 'Generate a seasonal inventory forecast for the next 3 months including 4/20 holiday planning, summer trends, and recommended stock-up quantities by category',
    description: 'Plan ahead for 4/20, summer trends, and seasonal demand shifts with stock-up recommendations',
    icon: Calendar,
    gradient: 'from-amber-600/20 to-orange-600/20',
    border: 'hover:border-amber-500/40',
    tag: 'Planning',
    tagColor: '#D4A03A',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function ConnectAgent() {
  const [view, setView] = useState('idle');
  const [activeView, setActiveView] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const handleSuggestionClick = async (key) => {
    const suggestion = SUGGESTIONS.find((s) => s.key === key);
    setMessages((prev) => [...prev, { role: 'user', text: suggestion.label }]);
    setView('typing');

    if (isGeminiAvailable()) {
      const analysis = await generateConnectAnalysis(suggestion.prompt);
      if (analysis && analysis.title) {
        const wf = analysis.workflowType || 'recommendations';
        setActiveView(wf);
        setAiAnalysis(analysis);
        setMessages((prev) => [...prev, {
          role: 'agent',
          text: `I've completed a **${analysis.title}** analysis based on your inventory data. Here's a detailed breakdown with actionable recommendations:`
        }]);
        setView('result');
        return;
      }
      // Gemini JSON failed — fall through to preset view below
    }

    // Fallback: preset view (always shows proper card/table)
    const presetMap = {
      'reorder-oos': 'reorder', 'explore-new': 'explore', 'purchasing-recs': 'recommendations',
      'margin-analysis': 'recommendations', 'vendor-comparison': 'recommendations', 'seasonal-forecast': 'recommendations',
    };
    const presetKey = presetMap[key] || 'recommendations';
    setActiveView(presetKey);
    setAiAnalysis(null);
    const responseTexts = {
      reorder: `I've scanned your inventory and found **5 items** that need immediate attention. Here's a detailed breakdown with recommended order quantities:`,
      explore: `I've analyzed NYC market trends and your catalog to curate **${NEW_PRODUCTS.length} recommended products** from top brands. Here's what I found:`,
      recommendations: `I've completed a 90-day inventory analysis for Ascend. Here are **5 actionable recommendations** to optimize your purchasing:`,
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'agent', text: responseTexts[presetKey] }]);
      setView('result');
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setView('typing');

    // Gemini first — always try AI generation
    if (isGeminiAvailable()) {
      const analysis = await generateConnectAnalysis(text);
      if (analysis && analysis.title) {
        const wf = analysis.workflowType || 'recommendations';
        setActiveView(wf);
        setAiAnalysis(analysis);
        setMessages((prev) => [...prev, {
          role: 'agent',
          text: `I've completed an analysis for your request. Here's a detailed breakdown with actionable recommendations:`
        }]);
        setView('result');
        return;
      }
      // JSON failed — fall back to text
      const inventoryContext = `Store: Ascend\nOut-of-stock: ${OUT_OF_STOCK_PRODUCTS.map(p => `${p.brand} ${p.name}`).join(', ')}\nBrands: Jeeter, STIIIZY, Kiva, Raw Garden, Cookies, Alien Labs, Wyld, PLUS`;
      const textResponse = await generateConnectResponse(text, inventoryContext);
      if (textResponse) {
        setMessages((prev) => [...prev, { role: 'agent', text: textResponse }]);
        setView('idle');
        return;
      }
    }

    // No Gemini key — graceful degradation via keyword matching to presets
    const lower = text.toLowerCase();
    let matchKey = null;
    if (lower.includes('reorder') || lower.includes('out of stock') || lower.includes('restock') || lower.includes('low stock') || lower.includes('stockout') || lower.includes('replenish') || lower.includes('running low')) matchKey = 'reorder';
    else if (lower.includes('new product') || lower.includes('explore') || lower.includes('discover') || lower.includes('trending') || lower.includes('catalog') || lower.includes('add to menu') || lower.includes('new brand') || lower.includes('what should we stock')) matchKey = 'explore';
    else if (lower.includes('recommend') || lower.includes('optimiz') || lower.includes('margin') || lower.includes('dead stock') || lower.includes('purchas') || lower.includes('vendor') || lower.includes('supplier') || lower.includes('forecast') || lower.includes('seasonal') || lower.includes('comparison') || lower.includes('negotiate') || lower.includes('inventory') || lower.includes('order')) matchKey = 'recommendations';

    // Always show a preset — default to recommendations if no specific match
    matchKey = matchKey || 'recommendations';
    setActiveView(matchKey);
    setAiAnalysis(null);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'agent', text: `Let me pull that together for you. Here's what I found:` }]);
      setView('result');
    }, 1500);
  };

  const handleBack = () => { setView('idle'); setActiveView(null); setAiAnalysis(null); };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, view]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      {/* header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#64A8E0] to-[#2563EB] flex items-center justify-center shadow-lg shadow-[#64A8E0]/20">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F0EDE8]">Connect</h1>
          <p className="text-xs text-[#ADA599]">Purchasing & Inventory Agent</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#64A8E0]/10 border border-[#64A8E0]/20">
          <div className="w-2 h-2 rounded-full bg-[#64A8E0] animate-pulse" />
          <span className="text-xs text-[#64A8E0] font-medium">Online</span>
        </div>
      </div>

      {/* Inventory at a Glance */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-grid">
        {[
          { label: 'Stock Health', value: '32/39', sub: 'stores fully stocked', color: '#00C27C', subColor: '#00C27C' },
          { label: 'Urgent', value: '3', sub: 'SKUs at stockout risk', color: '#E87068', subColor: '#E87068' },
          { label: 'Pending POs', value: '1', sub: 'draft ready · $2,847', color: '#D4A03A', subColor: '#ADA599' },
          { label: 'Last Reorder', value: '2d ago', sub: 'All items received', color: '#F0EDE8', subColor: '#00C27C' },
        ].map(k => (
          <div key={k.label} className="p-3 rounded-xl border border-[#38332B] border-l-[3px] bg-[#1C1B1A] hover:brightness-110 transition-all" style={{ borderLeftColor: k.color }}>
            <p className="text-[10px] uppercase tracking-wider text-[#ADA599] mb-1">{k.label}</p>
            <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px]" style={{ color: k.subColor }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {/* welcome */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#64A8E0]/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-[#64A8E0]" />
          </div>
          <div className="bg-[#1C1B1A] border border-[#38332B] rounded-2xl rounded-tl-sm px-5 py-4 max-w-2xl">
            <p className="text-sm text-[#F0EDE8] leading-relaxed">
              Hey! I'm your Connect purchasing agent. I can help you restock out-of-stock items,
              discover new products from top brands, and optimize your purchasing strategy — all powered by your real sales data.
            </p>
            <p className="text-sm text-[#ADA599] mt-2 leading-relaxed">
              Select an action below or tell me what you need.
            </p>
          </div>
        </div>

        {/* messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-[#64A8E0]/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#64A8E0]" />
              </div>
            )}
            <div className={`rounded-2xl px-5 py-3 max-w-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-[#64A8E0] text-white rounded-tr-sm'
                : 'bg-[#1C1B1A] border border-[#38332B] text-[#F0EDE8] rounded-tl-sm'
            }`}>
              {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}
            </div>
          </div>
        ))}

        {view === 'typing' && <TypingIndicator />}

        {view === 'result' && activeView === 'reorder' && <ReorderView data={aiAnalysis} onBack={handleBack} />}
        {view === 'result' && activeView === 'explore' && <ExploreView data={aiAnalysis} onBack={handleBack} />}
        {view === 'result' && activeView === 'recommendations' && <RecommendationsView data={aiAnalysis} onBack={handleBack} />}

        {/* suggestions */}
        {view === 'idle' && (
          <div className="pt-2 animate-fade-in">
            <p className="text-xs text-[#ADA599] mb-3 ml-11">Quick actions</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ml-11 stagger-grid">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSuggestionClick(s.key)}
                  className={`group text-left bg-[#1C1B1A] border border-[#38332B] ${s.border} rounded-xl p-4 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center`}>
                      <s.icon className="w-4 h-4 text-[#F0EDE8]" />
                    </div>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/10" style={{ color: s.tagColor }}>{s.tag}</span>
                    {s.confidence === 'high' && <span className="text-[9px] font-semibold text-[#00C27C] bg-[#00C27C]/10 px-1.5 py-0.5 rounded border border-[#00C27C]/30">High Confidence</span>}
                    {s.confidence === 'medium' && <span className="text-[9px] font-semibold text-[#D4A03A] bg-[#D4A03A]/10 px-1.5 py-0.5 rounded border border-dashed border-[#D4A03A]/30">Review Suggested</span>}
                  </div>
                  <p className="text-sm font-medium text-[#F0EDE8] mb-1">{s.label}</p>
                  <p className="text-xs text-[#ADA599] leading-relaxed">{s.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-[#64A8E0] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-3 h-3" /> Analyze <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input bar */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 pb-2">
        <div className="flex items-center gap-3 bg-[#1C1B1A] border border-[#38332B] rounded-2xl px-4 py-3 focus-within:border-[#64A8E0]/50 transition-colors">
          <Search className="w-5 h-5 text-[#ADA599] flex-shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about inventory, products, or purchasing..."
            className="flex-1 bg-transparent text-sm text-[#F0EDE8] placeholder-[#484F58] outline-none"
            disabled={view === 'typing'}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || view === 'typing'}
            className="w-8 h-8 rounded-lg bg-[#64A8E0] flex items-center justify-center text-white disabled:opacity-30 hover:bg-[#6FB4FF] transition-colors disabled:hover:bg-[#64A8E0]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-[#6B6359] mt-2">
          Connect Agent uses real-time inventory data and market analytics. Review all orders before confirming.
        </p>
      </form>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
