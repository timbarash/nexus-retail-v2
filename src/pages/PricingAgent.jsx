import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, ZAxis, Cell
} from 'recharts';
import {
  Bot, Sparkles, Send, ArrowLeft, ChevronRight, Zap, TrendingUp,
  DollarSign, BarChart3, Scale, CircleDollarSign, Percent,
  Calculator, ArrowUpDown, Check, X, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle2, Star, Package, Tag, Megaphone,
  ShoppingBag, Store, MapPin, Eye, Award, Target, Info,
  ArrowRight, TrendingDown, Shield, Clock, Layers, Plus
} from 'lucide-react';
import { generatePricingResponse, generatePricingAnalysis, generateMarketingCampaignPlan, isGeminiAvailable } from '../utils/gemini';
import { CampaignPlan } from './MarketingCampaigns';
import { useStores } from '../contexts/StoreContext';
import { locations } from '../data/mockData';

// Per-store revenue weights (mirrors NexusHome's STORE_METRICS generation)
function _seedRng(seed) {
  let s = seed | 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const STORE_WEIGHTS = locations.map((loc, i) => {
  const rng = _seedRng(i * 7919 + 31);
  const isOutlet = loc.name.includes('Outlet');
  return { name: loc.name, weight: isOutlet ? 600 + rng() * 600 : 800 + rng() * 1200 };
});
const TOTAL_WEIGHT = STORE_WEIGHTS.reduce((sum, s) => sum + s.weight, 0);

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════ */

const PRICING_PRODUCTS = [
  { id: 'pp-1', brand: 'Jeeter', name: 'Baby Jeeter Churros', category: 'Pre-Rolls', grossPrice: 35, cost: 18, netPerUnit: 17, margin: 48.6, marketAvg: 33, marketLow: 30, marketHigh: 38, weeklyUnits: 62, brandColor: '#7B2D8E' },
  { id: 'pp-2', brand: 'STIIIZY', name: 'OG Kush Pod 1g', category: 'Vapes', grossPrice: 45, cost: 24, netPerUnit: 21, margin: 46.7, marketAvg: 42, marketLow: 38, marketHigh: 48, weeklyUnits: 42, brandColor: '#1a1a1a' },
  { id: 'pp-3', brand: 'Kiva', name: 'Camino Pineapple Habanero', category: 'Edibles', grossPrice: 22, cost: 10, netPerUnit: 12, margin: 54.5, marketAvg: 22, marketLow: 19, marketHigh: 25, weeklyUnits: 55, brandColor: '#8B4513' },
  { id: 'pp-4', brand: 'Raw Garden', name: 'Slippery Susan Cart 1g', category: 'Vapes', grossPrice: 40, cost: 22, netPerUnit: 18, margin: 45.0, marketAvg: 38, marketLow: 35, marketHigh: 42, weeklyUnits: 28, brandColor: '#4CAF50' },
  { id: 'pp-5', brand: 'Wyld', name: 'Elderberry Indica Gummies', category: 'Edibles', grossPrice: 18, cost: 8, netPerUnit: 10, margin: 55.6, marketAvg: 18, marketLow: 16, marketHigh: 20, weeklyUnits: 35, brandColor: '#E91E63' },
  { id: 'pp-6', brand: 'Cookies', name: 'Gary Payton 3.5g', category: 'Flower', grossPrice: 55, cost: 32, netPerUnit: 23, margin: 41.8, marketAvg: 52, marketLow: 48, marketHigh: 58, weeklyUnits: 18, brandColor: '#2196F3' },
  { id: 'pp-7', brand: 'Alien Labs', name: 'Atomic Apple 3.5g', category: 'Flower', grossPrice: 50, cost: 28, netPerUnit: 22, margin: 44.0, marketAvg: 48, marketLow: 45, marketHigh: 55, weeklyUnits: 22, brandColor: '#00BCD4' },
  { id: 'pp-8', brand: 'PLUS', name: 'Sour Watermelon Gummies', category: 'Edibles', grossPrice: 20, cost: 9, netPerUnit: 11, margin: 55.0, marketAvg: 19, marketLow: 17, marketHigh: 22, weeklyUnits: 30, brandColor: '#FF6B35' },
];

const CATEGORY_PRICING = [
  { category: 'Flower', avgGross: 52.50, avgCost: 30.00, avgNet: 22.50, marketAvg: 49.00, monthlyRevenue: '$28,500', margin: 42.9, color: '#E87068' },
  { category: 'Vapes', avgGross: 42.50, avgCost: 23.00, avgNet: 19.50, marketAvg: 40.00, monthlyRevenue: '$22,300', margin: 45.9, color: '#00BCD4' },
  { category: 'Edibles', avgGross: 20.00, avgCost: 9.00, avgNet: 11.00, marketAvg: 19.67, monthlyRevenue: '$18,400', margin: 55.0, color: '#B598E8' },
  { category: 'Pre-Rolls', avgGross: 35.00, avgCost: 18.00, avgNet: 17.00, marketAvg: 33.00, monthlyRevenue: '$15,200', margin: 48.6, color: '#FF6B35' },
  { category: 'Concentrates', avgGross: 38.00, avgCost: 21.00, avgNet: 17.00, marketAvg: 36.00, monthlyRevenue: '$12,100', margin: 44.7, color: '#E91E63' },
  { category: 'Tinctures', avgGross: 32.00, avgCost: 14.50, avgNet: 17.50, marketAvg: 30.00, monthlyRevenue: '$5,100', margin: 54.7, color: '#64A8E0' },
  { category: 'Topicals', avgGross: 28.00, avgCost: 11.75, avgNet: 16.25, marketAvg: 27.00, monthlyRevenue: '$4,200', margin: 58.0, color: '#00C27C' },
  { category: 'Beverages', avgGross: 12.00, avgCost: 6.25, avgNet: 5.75, marketAvg: 11.00, monthlyRevenue: '$3,200', margin: 47.9, color: '#D4A03A' },
];

const PROMOTIONS = [
  { name: 'Happy Hour 15% Off', type: 'Time-based', discountAmount: '15% off', spend: '$2,100', redemptions: 342, grossRevenue: '$8,420', incrementalRevenue: '$3,200', roi: 1.5, verdict: 'Keep' },
  { name: 'First-Time 20% Off', type: 'New Customer', discountAmount: '20% off first order', spend: '$3,400', redemptions: 189, grossRevenue: '$12,600', incrementalRevenue: '$8,100', roi: 2.4, verdict: 'Keep' },
  { name: 'BOGO Edibles', type: 'Category', discountAmount: 'Buy 1 get 1 free', spend: '$4,800', redemptions: 156, grossRevenue: '$6,200', incrementalRevenue: '$1,400', roi: 0.3, verdict: 'Kill' },
  { name: 'Loyalty 10% Off', type: 'Loyalty', discountAmount: '10% off for members', spend: '$1,900', redemptions: 420, grossRevenue: '$9,800', incrementalRevenue: '$4,600', roi: 2.4, verdict: 'Keep' },
  { name: 'Weekend Bundle', type: 'Bundle', discountAmount: '$10 off $60+', spend: '$2,200', redemptions: 78, grossRevenue: '$3,900', incrementalRevenue: '$920', roi: 0.4, verdict: 'Optimize' },
];

/* ═══════════════════════════════════════════════════════════════════
   SUGGESTION CARDS
   ═══════════════════════════════════════════════════════════════════ */

const SUGGESTIONS = [
  { id: 'market_comparison', icon: Scale, color: '#64A8E0', label: 'Market Price Comparison', desc: 'See how your prices compare to market in your region', confidence: 'high' },
  { id: 'price_cost_overview', icon: DollarSign, color: '#00C27C', label: 'Price & Cost Overview', desc: 'Gross prices, costs, and net revenue by product' },
  { id: 'discount_review', icon: Percent, color: '#D4A03A', label: 'Discount & Promo Review', desc: 'Performance of all your active discounts', confidence: 'medium' },
  { id: 'price_scenarios', icon: Calculator, color: '#B598E8', label: 'What-If Pricing', desc: 'Model price changes and see projected impact' },
  { id: 'change_prices', icon: ArrowUpDown, color: '#00BCD4', label: 'Change Prices', desc: 'Select products and update prices now', confidence: 'high' },
  { id: 'create_discount', icon: Plus, color: '#E87068', label: 'Create New Discount', desc: 'Set up a new promo and optionally launch a campaign' },
];

/* ═══════════════════════════════════════════════════════════════════
   VIEW COMPONENTS (exported for reuse in CustomerBridge)
   ═══════════════════════════════════════════════════════════════════ */

// ─── Market Price Comparison ───
export function MarketComparisonView({ data, onBack }) {
  const products = data?.products?.length ? data.products : PRICING_PRODUCTS.map(p => ({
    id: p.id, name: p.name, brand: p.brand, category: p.category,
    yourPrice: p.grossPrice, marketAvg: p.marketAvg, marketLow: p.marketLow, marketHigh: p.marketHigh,
    gap: `${((p.grossPrice - p.marketAvg) / p.marketAvg * 100) >= 0 ? '+' : ''}${((p.grossPrice - p.marketAvg) / p.marketAvg * 100).toFixed(1)}%`,
    recommendation: p.grossPrice > p.marketAvg * 1.08 ? 'lower' : p.grossPrice < p.marketAvg * 0.95 ? 'raise' : 'keep',
    reason: p.grossPrice > p.marketAvg * 1.08 ? 'Above regional average — consider lowering to stay competitive' : p.grossPrice < p.marketAvg * 0.95 ? 'Below market — room to increase without losing customers' : 'In line with market in your region',
  }));
  const categoryComparison = data?.categoryComparison?.length ? data.categoryComparison : CATEGORY_PRICING.map(c => ({
    category: c.category, yourAvg: c.avgGross, marketAvg: c.marketAvg,
    gap: `${((c.avgGross - c.marketAvg) / c.marketAvg * 100) >= 0 ? '+' : ''}${((c.avgGross - c.marketAvg) / c.marketAvg * 100).toFixed(1)}%`,
    color: c.color,
  }));

  const recColor = { raise: '#00C27C', lower: '#E87068', keep: '#8B949E' };
  const recBg = { raise: 'rgba(0,194,124,0.12)', lower: 'rgba(232,112,104,0.12)', keep: 'rgba(139,148,158,0.08)' };

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(100,168,224,0.12)] flex items-center justify-center">
          <Scale className="w-5 h-5 text-[#64A8E0]" />
        </div>
        <div>
          <h3 className="text-[#F0EDE8] font-semibold text-lg">{data?.title || 'Market Price Comparison'}</h3>
          <p className="text-[#ADA599] text-sm">{data?.subtitle || 'Your prices vs the market in your region'}</p>
        </div>
      </div>

      {/* Category comparison */}
      <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
        <p className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider mb-3">Category Avg Price vs Regional Market</p>
        <div className="space-y-2.5">
          {categoryComparison.map((c) => {
            const gapNum = parseFloat(c.gap);
            return (
              <div key={c.category} className="flex items-center gap-3">
                <span className="text-[#ADA599] text-sm w-24 flex-shrink-0 truncate">{c.category}</span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 w-28">
                    <span className="text-[#F0EDE8] text-sm font-medium">${c.yourAvg.toFixed(2)}</span>
                    <span className="text-[#6B6359] text-xs">you</span>
                  </div>
                  <div className="flex items-center gap-1.5 w-28">
                    <span className="text-[#ADA599] text-sm">${c.marketAvg.toFixed(2)}</span>
                    <span className="text-[#6B6359] text-xs">market</span>
                  </div>
                  <span className={`text-xs font-bold ${gapNum > 3 ? 'text-[#D4A03A]' : gapNum < -3 ? 'text-[#64A8E0]' : 'text-[#ADA599]'}`}>{c.gap}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product table */}
      <div className="bg-[#141210] rounded-xl border border-[#38332B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#38332B]">
                <th className="text-left text-[#ADA599] font-medium px-4 py-3">Product</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Your Price</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Market Avg</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Market Range</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Gap</th>
                <th className="text-center text-[#ADA599] font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[#21262D] hover:bg-[#1C1B1A] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[#F0EDE8] font-medium">{p.name}</span>
                    <span className="text-[#ADA599] text-xs ml-2">{p.brand}</span>
                  </td>
                  <td className="text-right px-4 py-3 text-[#F0EDE8] font-medium">${typeof p.yourPrice === 'number' ? p.yourPrice.toFixed(2) : p.yourPrice}</td>
                  <td className="text-right px-4 py-3 text-[#ADA599]">${typeof p.marketAvg === 'number' ? p.marketAvg.toFixed(2) : p.marketAvg}</td>
                  <td className="text-right px-4 py-3 text-[#6B6359] text-xs">${typeof p.marketLow === 'number' ? p.marketLow.toFixed(2) : p.marketLow} – ${typeof p.marketHigh === 'number' ? p.marketHigh.toFixed(2) : p.marketHigh}</td>
                  <td className="text-right px-4 py-3">
                    <span className={`font-medium ${parseFloat(p.gap) > 0 ? 'text-[#D4A03A]' : parseFloat(p.gap) < 0 ? 'text-[#64A8E0]' : 'text-[#ADA599]'}`}>{p.gap}</span>
                  </td>
                  <td className="text-center px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize" style={{ color: recColor[p.recommendation], background: recBg[p.recommendation] }}>
                      {p.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data?.summary && (
        <div className="bg-[rgba(100,168,224,0.08)] rounded-xl p-4 border border-[rgba(100,168,224,0.2)]">
          <p className="text-[#64A8E0] text-sm">{data.summary}</p>
        </div>
      )}
    </div>
  );
}

// ─── Price & Cost Overview ───
export function PriceCostView({ data, onBack }) {
  const products = data?.products?.length ? data.products : PRICING_PRODUCTS.map(p => ({
    name: p.name, brand: p.brand, category: p.category,
    grossPrice: p.grossPrice, cost: p.cost, netPerUnit: p.netPerUnit, margin: p.margin,
    weeklyUnits: p.weeklyUnits,
    weeklyRevenue: p.grossPrice * p.weeklyUnits,
    weeklyCost: p.cost * p.weeklyUnits,
    weeklyNet: p.netPerUnit * p.weeklyUnits,
  }));
  const categoryBreakdown = data?.categoryBreakdown?.length ? data.categoryBreakdown : CATEGORY_PRICING.map(c => ({
    category: c.category, avgGrossPrice: c.avgGross, avgCost: c.avgCost, avgNet: c.avgNet,
    monthlyRevenue: c.monthlyRevenue, margin: c.margin, color: c.color,
  }));
  const suggestions = data?.suggestions?.length ? data.suggestions : [
    { action: 'Raise Flower prices $2-3 — your avg is $52.50 vs $49 market, but premium brands support it', impact: '+$1,800/mo', effort: 'Low' },
    { action: 'Negotiate Cookies wholesale cost — $32 is high for the category', impact: '+$864/mo net', effort: 'Medium' },
    { action: 'Edibles have best net per unit at 55% margin — consider expanding selection', impact: '+$2,200/mo', effort: 'Medium' },
  ];

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(0,194,124,0.12)] flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-[#00C27C]" />
        </div>
        <div>
          <h3 className="text-[#F0EDE8] font-semibold text-lg">{data?.title || 'Price & Cost Overview'}</h3>
          <p className="text-[#ADA599] text-sm">{data?.subtitle || 'Gross prices, costs, and net revenue by product'}</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
        <p className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider mb-3">Category Pricing Breakdown</p>
        <div className="space-y-2.5">
          {categoryBreakdown.map((c) => (
            <div key={c.category} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span className="text-[#ADA599] text-sm w-24 flex-shrink-0 truncate">{c.category}</span>
              <div className="flex-1 flex items-center gap-4 text-xs">
                <div className="w-20"><span className="text-[#6B6359]">Gross </span><span className="text-[#F0EDE8] font-medium">${c.avgGrossPrice.toFixed(2)}</span></div>
                <div className="w-20"><span className="text-[#6B6359]">Cost </span><span className="text-[#ADA599]">${c.avgCost.toFixed(2)}</span></div>
                <div className="w-20"><span className="text-[#6B6359]">Net </span><span className="text-[#00C27C] font-medium">${c.avgNet.toFixed(2)}</span></div>
                <span className="text-[#6B6359]">{c.margin}% margin</span>
              </div>
              <span className="text-[#6B6359] text-xs w-24 text-right flex-shrink-0">{c.monthlyRevenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product table */}
      <div className="bg-[#141210] rounded-xl border border-[#38332B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#38332B]">
                <th className="text-left text-[#ADA599] font-medium px-4 py-3">Product</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Gross Price</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Cost</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Net / Unit</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Weekly Units</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-3">Weekly Net</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b border-[#21262D] hover:bg-[#1C1B1A] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[#F0EDE8] font-medium">{p.name}</span>
                    <span className="text-[#ADA599] text-xs ml-2">{p.brand}</span>
                  </td>
                  <td className="text-right px-4 py-3 text-[#F0EDE8] font-medium">${p.grossPrice.toFixed(2)}</td>
                  <td className="text-right px-4 py-3 text-[#ADA599]">${p.cost.toFixed(2)}</td>
                  <td className="text-right px-4 py-3 text-[#00C27C] font-medium">${p.netPerUnit.toFixed(2)}</td>
                  <td className="text-right px-4 py-3 text-[#ADA599]">{p.weeklyUnits}</td>
                  <td className="text-right px-4 py-3 text-[#F0EDE8] font-bold">${p.weeklyNet.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
        <p className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider mb-3">Pricing Suggestions</p>
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#21262D] last:border-0">
            <CheckCircle2 className="w-4 h-4 text-[#00C27C] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#F0EDE8] text-sm">{s.action}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[#00C27C] text-xs font-semibold">{s.impact}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${s.effort === 'Low' ? 'bg-[rgba(0,194,124,0.12)] text-[#00C27C]' : s.effort === 'High' ? 'bg-[rgba(232,112,104,0.12)] text-[#E87068]' : 'bg-[rgba(212,160,58,0.12)] text-[#D4A03A]'}`}>
                  {s.effort} effort
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Discount & Promo Review ───
export function DiscountReviewView({ data, onBack }) {
  const totalSpend = data?.totalDiscountSpend || '$14,400';
  const wastedSpend = data?.wastedSpend || '$4,320';
  const avgROI = data?.avgROI || '1.4x';
  const promotions = data?.promotions?.length ? data.promotions : PROMOTIONS;
  const recommendations = data?.recommendations?.length ? data.recommendations : [
    'Kill BOGO Edibles — 0.3x ROI, cannibalizing full-price sales',
    'Optimize Weekend Bundle — reduce to $5 off $60+ and track incremental lift',
    'First-Time 20% Off has highest ROI at 2.4x — consider increasing budget',
  ];

  const verdictColor = { Keep: '#00C27C', Optimize: '#D4A03A', Kill: '#E87068' };
  const verdictBg = { Keep: 'rgba(0,194,124,0.12)', Optimize: 'rgba(212,160,58,0.12)', Kill: 'rgba(232,112,104,0.12)' };

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(212,160,58,0.12)] flex items-center justify-center">
          <Percent className="w-5 h-5 text-[#D4A03A]" />
        </div>
        <div>
          <h3 className="text-[#F0EDE8] font-semibold text-lg">{data?.title || 'Discount & Promo Review'}</h3>
          <p className="text-[#ADA599] text-sm">{data?.subtitle || 'Performance of all your active discounts'}</p>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4 text-center">
          <p className="text-[#ADA599] text-xs mb-1">Total Discount Spend</p>
          <p className="text-[#F0EDE8] text-xl font-bold">{totalSpend}</p>
          <p className="text-[#6B6359] text-[10px]">per month</p>
        </div>
        <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4 text-center">
          <p className="text-[#ADA599] text-xs mb-1">Wasted Spend</p>
          <p className="text-[#E87068] text-xl font-bold">{wastedSpend}</p>
          <p className="text-[#6B6359] text-[10px]">no measurable ROI</p>
        </div>
        <div className="bg-[#141210] rounded-xl border border-[#38332B] p-4 text-center">
          <p className="text-[#ADA599] text-xs mb-1">Avg ROI</p>
          <p className="text-[#D4A03A] text-xl font-bold">{avgROI}</p>
          <p className="text-[#6B6359] text-[10px]">across all promos</p>
        </div>
      </div>

      {/* Promo cards */}
      <div className="space-y-3">
        {promotions.map((p, i) => (
          <div key={i} className="bg-[#141210] rounded-xl border border-[#38332B] p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[#F0EDE8] font-medium">{p.name}</span>
                <span className="text-[#6B6359] text-xs ml-2">{p.type}</span>
                {p.discountAmount && <span className="text-[#64A8E0] text-xs ml-2">{p.discountAmount}</span>}
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ color: verdictColor[p.verdict], background: verdictBg[p.verdict] }}>
                {p.verdict}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div><span className="text-[#6B6359]">Spend</span><p className="text-[#F0EDE8] font-medium">{p.spend}</p></div>
              <div><span className="text-[#6B6359]">Redemptions</span><p className="text-[#F0EDE8] font-medium">{p.redemptions}</p></div>
              <div><span className="text-[#6B6359]">Incremental Rev</span><p className="text-[#F0EDE8] font-medium">{p.incrementalRevenue}</p></div>
              <div><span className="text-[#6B6359]">ROI</span><p className={`font-bold ${p.roi >= 1.5 ? 'text-[#00C27C]' : p.roi < 1 ? 'text-[#E87068]' : 'text-[#D4A03A]'}`}>{p.roi}x</p></div>
            </div>
            {p.reason && <p className="text-[#ADA599] text-xs mt-2">{p.reason}</p>}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-[rgba(212,160,58,0.08)] rounded-xl p-4 border border-[rgba(212,160,58,0.2)]">
          <p className="text-[#D4A03A] text-xs font-semibold uppercase tracking-wider mb-2">Recommendations</p>
          <ul className="space-y-1.5">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#D4A03A]/80">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── What-If Pricing Scenarios ───
export function PriceScenariosView({ data, onBack }) {
  const scenarios = data?.scenarios?.length ? data.scenarios : [
    {
      name: 'Conservative Growth', strategy: 'Raise premium brands $1-2 where you\'re already at or below market',
      recommended: true, riskLevel: 'Low',
      projections: { revenueChange: '+$3,200/mo', netProfitChange: '+$3,200/mo', customerImpact: 'Minimal — targets products already priced competitively' },
      changes: [
        { product: 'Cookies Gary Payton', currentPrice: 55, newPrice: 57, change: '+3.6%' },
        { product: 'Alien Labs Atomic Apple', currentPrice: 50, newPrice: 52, change: '+4.0%' },
        { product: 'Jeeter Baby Churros', currentPrice: 35, newPrice: 36, change: '+2.9%' },
      ],
    },
    {
      name: 'Market Alignment', strategy: 'Move all products to within 3% of regional market average',
      recommended: false, riskLevel: 'Medium',
      projections: { revenueChange: '+$1,800/mo', netProfitChange: '+$1,400/mo', customerImpact: 'Balanced — some prices up, some down' },
      changes: [
        { product: 'STIIIZY OG Kush Pod', currentPrice: 45, newPrice: 43, change: '-4.4%' },
        { product: 'Cookies Gary Payton', currentPrice: 55, newPrice: 53, change: '-3.6%' },
        { product: 'PLUS Sour Watermelon', currentPrice: 20, newPrice: 19, change: '-5.0%' },
      ],
    },
    {
      name: 'Aggressive Growth', strategy: 'Raise all products to top of regional market range',
      recommended: false, riskLevel: 'High',
      projections: { revenueChange: '+$8,400/mo', netProfitChange: '+$8,400/mo', customerImpact: 'May lose 5-8% of price-sensitive customers' },
      changes: [
        { product: 'STIIIZY OG Kush Pod', currentPrice: 45, newPrice: 48, change: '+6.7%' },
        { product: 'Raw Garden Cart', currentPrice: 40, newPrice: 42, change: '+5.0%' },
        { product: 'Cookies Gary Payton', currentPrice: 55, newPrice: 58, change: '+5.5%' },
        { product: 'Alien Labs Atomic Apple', currentPrice: 50, newPrice: 55, change: '+10.0%' },
      ],
    },
  ];

  const [expandedScenario, setExpandedScenario] = useState(null);
  const [applied, setApplied] = useState(null);
  const riskColor = { Low: '#00C27C', Medium: '#D4A03A', High: '#E87068' };

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(163,113,247,0.12)] flex items-center justify-center">
          <Calculator className="w-5 h-5 text-[#B598E8]" />
        </div>
        <div>
          <h3 className="text-[#F0EDE8] font-semibold text-lg">{data?.title || 'What-If Pricing Scenarios'}</h3>
          <p className="text-[#ADA599] text-sm">{data?.subtitle || 'Model price changes and see projected revenue impact'}</p>
        </div>
      </div>

      {scenarios.map((s, i) => (
        <div key={i} className={`bg-[#141210] rounded-xl border ${s.recommended ? 'border-[#00C27C]' : 'border-[#38332B]'} p-4 hover:border-[#38332B] transition-colors`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#F0EDE8] font-semibold">{s.name}</span>
              {s.recommended && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(0,194,124,0.15)] text-[#00C27C]">RECOMMENDED</span>
              )}
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ color: riskColor[s.riskLevel], background: `${riskColor[s.riskLevel]}20` }}>
              {s.riskLevel} Risk
            </span>
          </div>
          <p className="text-[#ADA599] text-sm mb-3">{s.strategy}</p>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-[#1C1B1A] rounded-lg p-2.5 text-center">
              <p className="text-[#6B6359] text-[10px]">Gross Revenue</p>
              <p className="text-[#00C27C] font-bold text-sm">{s.projections.revenueChange}</p>
            </div>
            <div className="bg-[#1C1B1A] rounded-lg p-2.5 text-center">
              <p className="text-[#6B6359] text-[10px]">Net Profit</p>
              <p className="text-[#64A8E0] font-bold text-sm">{s.projections.netProfitChange}</p>
            </div>
            <div className="bg-[#1C1B1A] rounded-lg p-2.5 text-center">
              <p className="text-[#6B6359] text-[10px]">Customer Impact</p>
              <p className="text-[#ADA599] font-medium text-xs">{s.projections.customerImpact}</p>
            </div>
          </div>

          <button onClick={() => setExpandedScenario(expandedScenario === i ? null : i)} className="text-[#64A8E0] text-xs flex items-center gap-1 mb-2 hover:underline">
            {expandedScenario === i ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expandedScenario === i ? 'Hide' : 'Show'} {s.changes.length} price changes
          </button>

          {expandedScenario === i && (
            <div className="space-y-1.5 mb-3">
              {s.changes.map((c, j) => (
                <div key={j} className="flex items-center justify-between bg-[#1C1B1A] rounded-lg px-3 py-2 text-xs">
                  <span className="text-[#F0EDE8]">{c.product}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#6B6359]">${c.currentPrice}</span>
                    <ArrowRight className="w-3 h-3 text-[#6B6359]" />
                    <span className="text-[#F0EDE8] font-medium">${c.newPrice}</span>
                    <span className={`font-bold ${c.change.startsWith('+') ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>{c.change}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setApplied(i)}
            disabled={applied === i}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${applied === i ? 'bg-[rgba(0,194,124,0.15)] text-[#00C27C] cursor-default' : 'bg-[#00C27C] text-white hover:bg-[#00A868]'}`}
          >
            {applied === i ? (
              <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Prices Updated</span>
            ) : 'Apply This Scenario'}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Change Prices ───
export function ChangePricesView({ data, onBack }) {
  const initialChanges = data?.changes?.length ? data.changes : PRICING_PRODUCTS.filter(p => Math.abs(p.grossPrice - p.marketAvg) / p.marketAvg > 0.03).map(p => {
    const target = p.grossPrice > p.marketAvg ? Math.round(p.marketAvg * 1.02) : Math.round(p.marketAvg * 0.98);
    const diff = target - p.grossPrice;
    return {
      id: p.id, name: p.name, brand: p.brand, category: p.category,
      currentPrice: p.grossPrice, newPrice: target,
      changePercent: `${diff >= 0 ? '+' : ''}${((diff / p.grossPrice) * 100).toFixed(1)}%`,
      weeklyUnits: p.weeklyUnits,
      revenueImpact: `${diff >= 0 ? '+' : '-'}$${Math.abs(diff * p.weeklyUnits)}/wk`,
      netImpact: `${diff >= 0 ? '+' : '-'}$${Math.abs(diff * p.weeklyUnits)}/wk`,
    };
  });

  const [selected, setSelected] = useState(new Set(initialChanges.map(c => c.id)));
  const [applied, setApplied] = useState(false);

  const activeChanges = initialChanges.filter(c => selected.has(c.id));
  const totalRevenueImpact = data?.totalRevenueImpact || (() => {
    const total = activeChanges.reduce((sum, c) => {
      const match = c.revenueImpact.match(/[+-]?\$?([\d,]+)/);
      const val = match ? parseInt(match[1].replace(',', '')) : 0;
      return sum + (c.revenueImpact.startsWith('-') ? -val : val);
    }, 0) * 4;
    return `${total >= 0 ? '+' : '-'}$${Math.abs(total).toLocaleString()}/mo`;
  })();

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(0,188,212,0.12)] flex items-center justify-center">
          <ArrowUpDown className="w-5 h-5 text-[#00BCD4]" />
        </div>
        <div>
          <h3 className="text-[#F0EDE8] font-semibold text-lg">{data?.title || 'Change Prices'}</h3>
          <p className="text-[#ADA599] text-sm">{data?.subtitle || 'Select products, preview impact, and apply changes'}</p>
        </div>
      </div>

      <div className="space-y-2">
        {initialChanges.map((c) => (
          <div
            key={c.id}
            onClick={() => !applied && toggleSelect(c.id)}
            className={`bg-[#141210] rounded-xl border p-4 transition-all cursor-pointer ${selected.has(c.id) ? 'border-[#00C27C] bg-[rgba(0,194,124,0.04)]' : 'border-[#38332B] hover:border-[#38332B]'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected.has(c.id) ? 'bg-[#00C27C] border-[#00C27C]' : 'border-[#38332B]'}`}>
                {selected.has(c.id) && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#F0EDE8] font-medium text-sm">{c.name}</span>
                    <span className="text-[#ADA599] text-xs ml-2">{c.brand}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#6B6359]">${c.currentPrice}</span>
                    <ArrowRight className="w-3 h-3 text-[#6B6359]" />
                    <span className="text-[#F0EDE8] font-bold">${c.newPrice}</span>
                    <span className={`text-xs font-bold ${c.changePercent.startsWith('+') ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>{c.changePercent}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-[#6B6359]">
                  <span>{c.weeklyUnits} units/wk</span>
                  <span className={c.revenueImpact.startsWith('+') ? 'text-[#00C27C]' : 'text-[#E87068]'}>Gross: {c.revenueImpact}</span>
                  <span className={c.netImpact.startsWith('+') ? 'text-[#00C27C]' : 'text-[#E87068]'}>Net: {c.netImpact}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Check */}
      <div className="mt-4 p-3 rounded-xl border border-[#38332B] bg-[#141210]">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#64A8E0]" />
          <span className="text-xs font-semibold text-[#64A8E0]">Compliance Check</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00C27C]/20 flex items-center justify-center"><span className="text-[8px] text-[#00C27C]">✓</span></div>
            <span className="text-[#F0EDE8]">Price within state maximum markup</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00C27C]/20 flex items-center justify-center"><span className="text-[8px] text-[#00C27C]">✓</span></div>
            <span className="text-[#F0EDE8]">No minimum price violation</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00C27C]/20 flex items-center justify-center"><span className="text-[8px] text-[#00C27C]">✓</span></div>
            <span className="text-[#F0EDE8]">Tax calculation updated automatically</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#64A8E0]/20 flex items-center justify-center"><span className="text-[8px] text-[#64A8E0]">i</span></div>
            <span className="text-[#ADA599]">Price change reported in next METRC sync</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[#ADA599] text-sm">{activeChanges.length} products selected</span>
          <span className="text-[#00C27C] font-bold text-sm">Est. {totalRevenueImpact} revenue</span>
        </div>
        {!applied ? (
          <button onClick={() => setApplied(true)} disabled={activeChanges.length === 0}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#00C27C] text-white hover:bg-[#00A868] transition-colors disabled:opacity-50">
            Apply Changes
          </button>
        ) : (
          <span className="flex items-center gap-2 text-[#00C27C] font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" /> Prices Updated
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Create New Discount ───
export function CreateDiscountView({ data, onBack }) {
  const discountData = data?.discount || null;
  const [name, setName] = useState(discountData?.name || '');
  const [type, setType] = useState(discountData?.type || 'Percentage');
  const [amount, setAmount] = useState(discountData?.amount || '');
  const [appliesTo, setAppliesTo] = useState(discountData?.appliesTo || 'All Products');
  const [schedule, setSchedule] = useState(discountData?.schedule || 'Always active');
  const [created, setCreated] = useState(false);
  const [showCampaignPrompt, setShowCampaignPrompt] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [generatingCampaign, setGeneratingCampaign] = useState(false);

  const handleCreate = () => {
    setCreated(true);
    setShowCampaignPrompt(true);
  };

  const handleLaunchCampaign = async () => {
    setShowCampaignPrompt(false);
    setGeneratingCampaign(true);
    const discountDesc = `${name || 'New discount'}: ${amount || type} — applies to ${appliesTo}, ${schedule}`;
    const plan = await generateMarketingCampaignPlan(
      `Create a marketing campaign to promote a new discount at Ascend: ${discountDesc}. Highlight the savings and drive customer traffic.`
    );
    setCampaignData(plan);
    setGeneratingCampaign(false);
  };

  const hasPreset = !!discountData;

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(232,112,104,0.12)] flex items-center justify-center">
          <Plus className="w-5 h-5 text-[#E87068]" />
        </div>
        <div>
          <h3 className="text-[#F0EDE8] font-semibold text-lg">{data?.title || 'Create New Discount'}</h3>
          <p className="text-[#ADA599] text-sm">{data?.subtitle || 'Set up a new promo and optionally launch a marketing campaign'}</p>
        </div>
      </div>

      {!created ? (
        <div className="bg-[#141210] rounded-xl border border-[#38332B] p-5 space-y-4">
          <div>
            <label className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider block mb-1.5">Discount Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Sale 15% Off"
              className="w-full bg-[#1C1B1A] border border-[#38332B] rounded-lg px-3 py-2 text-sm text-[#F0EDE8] placeholder-[#6E7681] outline-none focus:border-[#64A8E0] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider block mb-1.5">Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full bg-[#1C1B1A] border border-[#38332B] rounded-lg px-3 py-2 text-sm text-[#F0EDE8] outline-none focus:border-[#64A8E0]">
                <option>Percentage</option>
                <option>Dollar Off</option>
                <option>BOGO</option>
                <option>Bundle</option>
              </select>
            </div>
            <div>
              <label className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider block mb-1.5">Amount</label>
              <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 15% off or $5 off"
                className="w-full bg-[#1C1B1A] border border-[#38332B] rounded-lg px-3 py-2 text-sm text-[#F0EDE8] placeholder-[#6E7681] outline-none focus:border-[#64A8E0]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider block mb-1.5">Applies To</label>
              <select value={appliesTo} onChange={e => setAppliesTo(e.target.value)}
                className="w-full bg-[#1C1B1A] border border-[#38332B] rounded-lg px-3 py-2 text-sm text-[#F0EDE8] outline-none focus:border-[#64A8E0]">
                <option>All Products</option>
                <option>Flower</option>
                <option>Edibles</option>
                <option>Vapes</option>
                <option>Pre-Rolls</option>
                <option>Concentrates</option>
              </select>
            </div>
            <div>
              <label className="text-[#ADA599] text-xs font-semibold uppercase tracking-wider block mb-1.5">Schedule</label>
              <select value={schedule} onChange={e => setSchedule(e.target.value)}
                className="w-full bg-[#1C1B1A] border border-[#38332B] rounded-lg px-3 py-2 text-sm text-[#F0EDE8] outline-none focus:border-[#64A8E0]">
                <option>Always active</option>
                <option>Weekdays 4-7pm</option>
                <option>Weekends only</option>
                <option>Limited time (7 days)</option>
                <option>Limited time (30 days)</option>
              </select>
            </div>
          </div>

          {hasPreset && discountData && (
            <div className="bg-[#1C1B1A] rounded-lg p-3 grid grid-cols-3 gap-3 text-xs">
              <div><span className="text-[#6B6359]">Est. Redemptions</span><p className="text-[#F0EDE8] font-medium">{discountData.estimatedRedemptions}/mo</p></div>
              <div><span className="text-[#6B6359]">Est. Cost</span><p className="text-[#F0EDE8] font-medium">{discountData.estimatedCost}/mo</p></div>
              <div><span className="text-[#6B6359]">Projected ROI</span><p className="text-[#00C27C] font-bold">{discountData.projectedROI}</p></div>
            </div>
          )}

          <button onClick={handleCreate} disabled={!name.trim() || !amount.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#00C27C] text-white hover:bg-[#00A868] transition-colors disabled:opacity-50">
            Create Discount
          </button>
        </div>
      ) : (
        <div className="bg-[rgba(0,194,124,0.08)] rounded-xl border border-[rgba(0,194,124,0.2)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-[#00C27C]" />
            <span className="text-[#00C27C] font-semibold">Discount Created</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-1">
            <div><span className="text-[#6B6359]">Name: </span><span className="text-[#F0EDE8]">{name || 'New Discount'}</span></div>
            <div><span className="text-[#6B6359]">Amount: </span><span className="text-[#F0EDE8]">{amount || type}</span></div>
            <div><span className="text-[#6B6359]">Applies to: </span><span className="text-[#F0EDE8]">{appliesTo}</span></div>
            <div><span className="text-[#6B6359]">Schedule: </span><span className="text-[#F0EDE8]">{schedule}</span></div>
          </div>
        </div>
      )}

      {/* Campaign prompt */}
      {showCampaignPrompt && (
        <div className="bg-[#1C1B1A] rounded-xl border border-[#64A8E0] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-[#64A8E0]" />
            <span className="text-[#F0EDE8] font-semibold">Promote this discount?</span>
          </div>
          <p className="text-[#ADA599] text-sm mb-4">
            Would you like to use the <span className="text-[#64A8E0] font-medium">Marketing Agent</span> to create a campaign highlighting this new discount to relevant customers?
          </p>
          <div className="flex items-center gap-3">
            <button onClick={handleLaunchCampaign}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#64A8E0] text-white hover:bg-[#4A90E2] transition-colors flex items-center gap-2">
              <Megaphone className="w-4 h-4" /> Yes, Create Campaign
            </button>
            <button onClick={() => setShowCampaignPrompt(false)}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#282724] text-[#ADA599] hover:text-[#F0EDE8] hover:bg-[#38332B] transition-colors">
              No, Skip
            </button>
          </div>
        </div>
      )}

      {generatingCampaign && (
        <div className="flex items-center gap-3 text-[#ADA599] text-sm p-4">
          <div className="w-5 h-5 border-2 border-[#64A8E0] border-t-transparent rounded-full animate-spin" />
          Creating campaign to promote your new discount...
        </div>
      )}

      {campaignData && (
        <div className="mt-2">
          <p className="text-[#F0EDE8] font-medium text-sm mb-2">Here's a campaign to promote your new discount:</p>
          <CampaignPlan data={campaignData} onBack={null} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRICING DASHBOARD (mode === 'dashboard')
   ═══════════════════════════════════════════════════════════════════ */

function PricingDashboard() {
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [priceApplied, setPriceApplied] = useState(null);
  const { selectedStoreNames, isAllSelected, selectionLabel } = useStores();

  // Compute store weight ratio for scaling volume metrics
  const weightRatio = useMemo(() => {
    if (isAllSelected) return 1;
    const selWeight = STORE_WEIGHTS.filter(s => selectedStoreNames.has(s.name)).reduce((sum, s) => sum + s.weight, 0);
    return TOTAL_WEIGHT > 0 ? selWeight / TOTAL_WEIGHT : 0;
  }, [selectedStoreNames, isAllSelected]);

  // Prepare scatter data: x = market avg, y = your price, z = weekly units (bubble size) — scaled by store selection
  const scatterData = useMemo(() => PRICING_PRODUCTS.map(p => ({
    x: p.marketAvg,
    y: p.grossPrice,
    z: Math.round(p.weeklyUnits * weightRatio),
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    gap: ((p.grossPrice - p.marketAvg) / p.marketAvg * 100),
    cost: p.cost,
    netPerUnit: p.netPerUnit,
    brandColor: p.brandColor,
  })), [weightRatio]);

  const minPrice = Math.min(...PRICING_PRODUCTS.map(p => Math.min(p.marketAvg, p.grossPrice))) - 5;
  const maxPrice = Math.max(...PRICING_PRODUCTS.map(p => Math.max(p.marketAvg, p.grossPrice))) + 5;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const gapStr = `${d.gap >= 0 ? '+' : ''}${d.gap.toFixed(1)}%`;
    return (
      <div className="bg-[#282724] border border-[#38332B] rounded-xl px-4 py-3 shadow-xl" style={{ minWidth: 200 }}>
        <p className="text-[#F0EDE8] font-semibold text-sm">{d.name}</p>
        <p className="text-[#ADA599] text-xs mb-2">{d.brand} · {d.category}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-[#6B6359]">Your Price</span>
          <span className="text-[#F0EDE8] font-medium text-right">${d.y.toFixed(2)}</span>
          <span className="text-[#6B6359]">Market Avg</span>
          <span className="text-[#ADA599] text-right">${d.x.toFixed(2)}</span>
          <span className="text-[#6B6359]">Gap</span>
          <span className={`font-bold text-right ${d.gap > 3 ? 'text-[#D4A03A]' : d.gap < -3 ? 'text-[#64A8E0]' : 'text-[#ADA599]'}`}>{gapStr}</span>
          <span className="text-[#6B6359]">Net / Unit</span>
          <span className="text-[#00C27C] font-medium text-right">${d.netPerUnit.toFixed(2)}</span>
          <span className="text-[#6B6359]">Weekly Units</span>
          <span className="text-[#ADA599] text-right">{d.z}</span>
        </div>
        <p className="text-[#64A8E0] text-[10px] mt-2 font-medium">Click to adjust price</p>
      </div>
    );
  };

  const handleDotClick = (entry) => {
    const p = PRICING_PRODUCTS.find(pr => pr.id === entry.id);
    if (p) {
      setEditingProduct(p);
      const target = p.grossPrice > p.marketAvg ? Math.round(p.marketAvg * 1.02) : p.grossPrice;
      setNewPrice(String(target));
      setPriceApplied(null);
    }
  };

  const handleApplyPrice = () => {
    setPriceApplied(editingProduct.id);
    setTimeout(() => {
      setEditingProduct(null);
      setPriceApplied(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0EDE8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,194,124,0.12)] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#00C27C]" />
            </div>
            Pricing Tool
          </h1>
          <p className="text-[#ADA599] mt-1">Understand your pricing, compare to market, and make changes fast — {selectionLabel}</p>
        </div>
        <Link to="/agents/pricing" className="px-4 py-2 rounded-lg bg-[#00C27C] text-white font-semibold text-sm hover:bg-[#00A868] transition-colors flex items-center gap-2">
          <Bot className="w-4 h-4" /> Open Pricing Agent
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Gross Price', value: '$35.63', sub: 'Across all products', icon: DollarSign, color: '#00C27C' },
          { label: 'vs Market', value: '+6%', sub: 'Above regional average', icon: Scale, color: '#64A8E0' },
          { label: 'Active Discounts', value: '5', sub: '3 healthy, 2 underperforming', icon: Percent, color: '#D4A03A' },
          { label: 'Monthly Discount Spend', value: `$${Math.round(14400 * weightRatio).toLocaleString()}`, sub: `$${Math.round(4320 * weightRatio).toLocaleString()} with no ROI`, icon: TrendingDown, color: '#E87068' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#ADA599] text-sm">{kpi.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15` }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#F0EDE8]">{kpi.value}</p>
            <p className="text-[#6B6359] text-xs mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Scatter Plot: Your Price vs Market */}
      <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-[#F0EDE8] font-semibold text-lg">Your Price vs Market</h2>
            <p className="text-[#6B6359] text-xs mt-0.5">Products above the line are priced higher than market — click any dot to adjust</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#ADA599]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D4A03A]" /> Above market</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B949E]" /> At market</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#64A8E0]" /> Below market</span>
          </div>
        </div>
        <div className="h-[320px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis
                type="number" dataKey="x" name="Market Avg"
                domain={[minPrice, maxPrice]}
                tick={{ fill: '#6B6359', fontSize: 11 }}
                tickFormatter={v => `$${v}`}
                label={{ value: 'Market Avg Price', position: 'bottom', offset: 0, fill: '#ADA599', fontSize: 11 }}
                stroke="#e5e7eb"
              />
              <YAxis
                type="number" dataKey="y" name="Your Price"
                domain={[minPrice, maxPrice]}
                tick={{ fill: '#6B6359', fontSize: 11 }}
                tickFormatter={v => `$${v}`}
                label={{ value: 'Your Price', angle: -90, position: 'insideLeft', offset: 10, fill: '#ADA599', fontSize: 11 }}
                stroke="#e5e7eb"
              />
              <ZAxis type="number" dataKey="z" range={[80, 400]} name="Weekly Units" />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#484F58' }} />
              <ReferenceLine
                segment={[{ x: minPrice, y: minPrice }, { x: maxPrice, y: maxPrice }]}
                stroke="#484F58" strokeDasharray="6 4" strokeWidth={1.5}
                label={{ value: 'Market parity', position: 'end', fill: '#ADA599', fontSize: 10 }}
              />
              <Scatter data={scatterData} cursor="pointer" onClick={handleDotClick}>
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.gap > 3 ? '#D4A03A' : entry.gap < -3 ? '#64A8E0' : '#8B949E'}
                    fillOpacity={0.85}
                    stroke={entry.gap > 3 ? '#D4A03A' : entry.gap < -3 ? '#64A8E0' : '#8B949E'}
                    strokeWidth={2}
                    strokeOpacity={0.4}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inline price editor modal */}
      {editingProduct && (
        <div className="bg-[#1C1B1A] rounded-xl border-2 border-[#64A8E0] p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${editingProduct.brandColor}20` }}>
                <ArrowUpDown className="w-4 h-4" style={{ color: editingProduct.brandColor }} />
              </div>
              <div>
                <p className="text-[#F0EDE8] font-semibold">{editingProduct.name}</p>
                <p className="text-[#ADA599] text-xs">{editingProduct.brand} · {editingProduct.category}</p>
              </div>
            </div>
            <button onClick={() => setEditingProduct(null)} className="text-[#ADA599] hover:text-[#F0EDE8] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-[#141210] rounded-lg p-3 text-center">
              <p className="text-[#6B6359] text-[10px] mb-1">Current Price</p>
              <p className="text-[#F0EDE8] font-bold text-lg">${editingProduct.grossPrice.toFixed(2)}</p>
            </div>
            <div className="bg-[#141210] rounded-lg p-3 text-center">
              <p className="text-[#6B6359] text-[10px] mb-1">Market Avg</p>
              <p className="text-[#ADA599] font-bold text-lg">${editingProduct.marketAvg.toFixed(2)}</p>
            </div>
            <div className="bg-[#141210] rounded-lg p-3 text-center">
              <p className="text-[#6B6359] text-[10px] mb-1">Market Range</p>
              <p className="text-[#ADA599] font-medium text-sm mt-1">${editingProduct.marketLow} – ${editingProduct.marketHigh}</p>
            </div>
            <div className="bg-[#141210] rounded-lg p-3 text-center">
              <p className="text-[#6B6359] text-[10px] mb-1">New Price</p>
              <input
                type="number"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full bg-transparent text-[#64A8E0] font-bold text-lg text-center outline-none"
                step="1"
                min="1"
              />
            </div>
          </div>
          {newPrice && (
            <div className="flex items-center justify-between bg-[#141210] rounded-lg px-4 py-3 mb-4">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#6B6359]">Change:</span>
                <span className={`font-bold ${(parseFloat(newPrice) - editingProduct.grossPrice) >= 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                  {(parseFloat(newPrice) - editingProduct.grossPrice) >= 0 ? '+' : ''}{(parseFloat(newPrice) - editingProduct.grossPrice).toFixed(2)}
                  ({(((parseFloat(newPrice) - editingProduct.grossPrice) / editingProduct.grossPrice) * 100).toFixed(1)}%)
                </span>
                <span className="text-[#6B6359]">New net/unit:</span>
                <span className="text-[#00C27C] font-bold">${(parseFloat(newPrice) - editingProduct.cost).toFixed(2)}</span>
                <span className="text-[#6B6359]">Weekly impact:</span>
                <span className={`font-bold ${(parseFloat(newPrice) - editingProduct.grossPrice) >= 0 ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                  {(parseFloat(newPrice) - editingProduct.grossPrice) >= 0 ? '+' : ''}${((parseFloat(newPrice) - editingProduct.grossPrice) * Math.round(editingProduct.weeklyUnits * weightRatio)).toFixed(0)}/wk
                </span>
              </div>
              {priceApplied === editingProduct.id ? (
                <span className="flex items-center gap-2 text-[#00C27C] font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Updated
                </span>
              ) : (
                <button onClick={handleApplyPrice}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#00C27C] text-white hover:bg-[#00A868] transition-colors">
                  Apply
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Product pricing vs market */}
      <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-6">
        <h2 className="text-[#F0EDE8] font-semibold text-lg mb-4">Your Prices vs Regional Market</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#38332B]">
                <th className="text-left text-[#ADA599] font-medium px-4 py-2">Product</th>
                <th className="text-left text-[#ADA599] font-medium px-4 py-2">Category</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-2">Your Price</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-2">Market Avg</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-2">Cost</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-2">Net / Unit</th>
                <th className="text-right text-[#ADA599] font-medium px-4 py-2">Gap</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_PRODUCTS.map((p) => {
                const gap = ((p.grossPrice - p.marketAvg) / p.marketAvg * 100);
                return (
                  <tr key={p.id} className="border-b border-[#21262D] hover:bg-[#141210] transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="text-[#F0EDE8] font-medium">{p.name}</span>
                      <span className="text-[#6B6359] text-xs ml-2">{p.brand}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[#ADA599] text-xs">{p.category}</td>
                    <td className="text-right px-4 py-2.5 text-[#F0EDE8] font-medium">${p.grossPrice.toFixed(2)}</td>
                    <td className="text-right px-4 py-2.5 text-[#ADA599]">${p.marketAvg.toFixed(2)}</td>
                    <td className="text-right px-4 py-2.5 text-[#6B6359]">${p.cost.toFixed(2)}</td>
                    <td className="text-right px-4 py-2.5 text-[#00C27C] font-medium">${p.netPerUnit.toFixed(2)}</td>
                    <td className="text-right px-4 py-2.5">
                      <span className={`font-medium text-xs ${gap > 3 ? 'text-[#D4A03A]' : gap < -3 ? 'text-[#64A8E0]' : 'text-[#ADA599]'}`}>
                        {gap >= 0 ? '+' : ''}{gap.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active discounts + Category pricing side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active discounts */}
        <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-6">
          <h2 className="text-[#F0EDE8] font-semibold text-lg mb-4">Active Discounts</h2>
          <div className="space-y-3">
            {PROMOTIONS.map((p) => {
              const vc = { Keep: '#00C27C', Optimize: '#D4A03A', Kill: '#E87068' };
              return (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-[#21262D] last:border-0">
                  <div>
                    <span className="text-[#F0EDE8] font-medium text-sm">{p.name}</span>
                    <p className="text-[#6B6359] text-xs">{p.discountAmount} · {p.redemptions} redemptions</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className={`font-bold text-sm ${p.roi >= 1.5 ? 'text-[#00C27C]' : p.roi < 1 ? 'text-[#E87068]' : 'text-[#D4A03A]'}`}>{p.roi}x ROI</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: vc[p.verdict], background: `${vc[p.verdict]}20` }}>{p.verdict}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category pricing */}
        <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-6">
          <h2 className="text-[#F0EDE8] font-semibold text-lg mb-4">Category Pricing vs Market</h2>
          <div className="space-y-3">
            {CATEGORY_PRICING.map((c) => {
              const gap = ((c.avgGross - c.marketAvg) / c.marketAvg * 100);
              return (
                <div key={c.category} className="flex items-center gap-3 py-1">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-[#ADA599] text-sm w-24 flex-shrink-0">{c.category}</span>
                  <div className="flex-1 flex items-center gap-3 text-xs">
                    <span className="text-[#F0EDE8] font-medium w-14">${c.avgGross.toFixed(2)}</span>
                    <span className="text-[#6B6359]">vs ${c.marketAvg.toFixed(2)}</span>
                    <span className={`font-bold ${gap > 3 ? 'text-[#D4A03A]' : gap < -3 ? 'text-[#64A8E0]' : 'text-[#ADA599]'}`}>
                      {gap >= 0 ? '+' : ''}{gap.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[#6B6359] text-xs w-24 text-right">{c.monthlyRevenue}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-[rgba(0,194,124,0.06)] rounded-xl border border-[rgba(0,194,124,0.15)] p-6">
        <h2 className="text-[#00C27C] font-semibold text-lg mb-3 flex items-center gap-2"><Zap className="w-5 h-5" /> Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-[#F0EDE8] font-medium text-sm">Adjust Prices Above Market</p>
            <p className="text-[#ADA599] text-xs">3 products are 8%+ above regional average — review and align</p>
            <Link to="/agents/pricing" className="text-[#00C27C] text-xs font-semibold hover:underline inline-flex items-center gap-1">Open Agent <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-1">
            <p className="text-[#F0EDE8] font-medium text-sm">Cut Underperforming Discounts</p>
            <p className="text-[#ADA599] text-xs">$4,320/mo spent on discounts with sub-1x ROI</p>
            <Link to="/agents/pricing" className="text-[#00C27C] text-xs font-semibold hover:underline inline-flex items-center gap-1">Open Agent <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-1">
            <p className="text-[#F0EDE8] font-medium text-sm">Create a New Discount</p>
            <p className="text-[#ADA599] text-xs">Set up a new promo and launch a marketing campaign</p>
            <Link to="/agents/pricing" className="text-[#00C27C] text-xs font-semibold hover:underline inline-flex items-center gap-1">Open Agent <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRICING AGENT CHAT (mode === 'agent')
   ═══════════════════════════════════════════════════════════════════ */

function PricingAgentChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const viewComponents = {
    market_comparison: MarketComparisonView,
    price_cost_overview: PriceCostView,
    discount_review: DiscountReviewView,
    price_scenarios: PriceScenariosView,
    change_prices: ChangePricesView,
    create_discount: CreateDiscountView,
  };

  const handleSuggestion = async (suggestion) => {
    setMessages(prev => [...prev, { role: 'user', text: suggestion.label }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 800));

    let analysis = null;
    if (isGeminiAvailable()) {
      analysis = await generatePricingAnalysis(suggestion.label);
    }

    setIsTyping(false);

    if (analysis && analysis.title) {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: `Here's your **${analysis.title}** analysis:`,
        component: analysis.workflowType,
        data: analysis,
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: `Here's your **${suggestion.label}** based on current data:`,
        component: suggestion.id,
        data: null,
      }]);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600));

    // Try structured analysis first
    let analysis = null;
    if (isGeminiAvailable()) {
      analysis = await generatePricingAnalysis(text);
    }

    if (analysis && analysis.title) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'agent',
        text: `Here's your **${analysis.title}** analysis:`,
        component: analysis.workflowType,
        data: analysis,
      }]);
      return;
    }

    // Fall back to text response
    let responseText = null;
    if (isGeminiAvailable()) {
      responseText = await generatePricingResponse(text);
    }

    setIsTyping(false);

    if (responseText) {
      setMessages(prev => [...prev, { role: 'agent', text: responseText }]);
    } else {
      // Keyword-based fallback
      const lower = text.toLowerCase();
      let fallbackComponent = 'market_comparison';
      if (/cost|net|gross|revenue per/.test(lower)) fallbackComponent = 'price_cost_overview';
      else if (/discount|promo|coupon|roi|deal/.test(lower)) fallbackComponent = 'discount_review';
      else if (/scenario|what.if|model|simul/.test(lower)) fallbackComponent = 'price_scenarios';
      else if (/change|raise|lower|adjust|update.*price/.test(lower)) fallbackComponent = 'change_prices';
      else if (/create|new|add.*discount|new.*promo|set up/.test(lower)) fallbackComponent = 'create_discount';

      setMessages(prev => [...prev, {
        role: 'agent',
        text: `Here's a pricing analysis based on your current data:`,
        component: fallbackComponent,
        data: null,
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.length === 0;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00C27C] to-[#00BCD4] flex items-center justify-center shadow-lg">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F0EDE8]">Pricing Agent</h1>
          <p className="text-[#ADA599] text-sm">Understand your pricing, compare to market, make changes</p>
        </div>
      </div>

      {/* Pricing at a Glance */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-grid">
        {[
          { label: 'Avg Price Gap', value: '+6%', sub: 'above market average', color: '#D4A03A', subColor: '#ADA599' },
          { label: 'Opportunity', value: '$4,200', sub: '/mo from 3 adjustments', color: '#00C27C', subColor: '#ADA599' },
          { label: 'Active Promos', value: '5', sub: '2 underperforming', color: '#F0EDE8', subColor: '#D4A03A' },
          { label: 'Compliance', value: 'All Clear', sub: 'Prices within state limits', color: '#00C27C', subColor: '#00C27C' },
        ].map(k => (
          <div key={k.label} className="p-3 rounded-xl border border-[#38332B] border-l-[3px] bg-[#1C1B1A] hover:brightness-110 transition-all" style={{ borderLeftColor: k.color }}>
            <p className="text-[10px] uppercase tracking-wider text-[#ADA599] mb-1">{k.label}</p>
            <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px]" style={{ color: k.subColor }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {showSuggestions && (
          <div>
            <p className="text-[#ADA599] text-sm mb-4">What would you like to do?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSuggestion(s)}
                  className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-4 text-left hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    {s.confidence === 'high' && <span className="text-[9px] font-semibold text-[#00C27C] bg-[#00C27C]/10 px-1.5 py-0.5 rounded border border-[#00C27C]/30">High Confidence</span>}
                    {s.confidence === 'medium' && <span className="text-[9px] font-semibold text-[#D4A03A] bg-[#D4A03A]/10 px-1.5 py-0.5 rounded border border-dashed border-[#D4A03A]/30">Review Suggested</span>}
                  </div>
                  <p className="text-[#F0EDE8] font-medium text-sm mb-1">{s.label}</p>
                  <p className="text-[#6B6359] text-xs">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user'
              ? 'bg-[#00C27C] text-white rounded-2xl rounded-br-md px-4 py-3'
              : 'bg-[#1C1B1A] border border-[#38332B] text-[#F0EDE8] rounded-2xl rounded-bl-md px-5 py-4'
            }`}>
              {msg.role === 'agent' && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-[#00C27C]" />
                  <span className="text-[#00C27C] text-xs font-semibold">Pricing Agent</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p>
              {msg.component && viewComponents[msg.component] && (
                <div className="mt-3">
                  {React.createElement(viewComponents[msg.component], { data: msg.data, onBack: null })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1C1B1A] border border-[#38332B] rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#00C27C]" />
                <span className="text-[#00C27C] text-xs font-semibold">Pricing Agent</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-[#1C1B1A] rounded-2xl border border-[#38332B] p-3 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your prices, discounts, market comparison..."
          className="flex-1 bg-transparent text-[#F0EDE8] placeholder-[#6E7681] outline-none text-sm"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-xl bg-[#00C27C] text-white flex items-center justify-center hover:bg-[#00A868] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════ */

export default function PricingAgent({ mode = 'agent' }) {
  if (mode === 'dashboard') return <PricingDashboard />;
  return <PricingAgentChat />;
}
