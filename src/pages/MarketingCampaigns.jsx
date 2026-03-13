import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Sparkles, Send, ArrowLeft, Megaphone, UserX, Cake, Clock,
  Target, Mail, Smartphone, Bell, BarChart3, Users, DollarSign,
  CheckCircle2, ChevronRight, Zap, TrendingUp, Gift, Star, Hash,
  ShoppingBag, Heart, Calendar, MapPin, Tag, Settings, Sliders,
  Shield, Eye, Copy, FlaskConical, ChevronDown, ChevronUp, Store,
  Percent, Award, AlertCircle, Lock, Globe, Image, Type, ToggleLeft,
  Layers, Filter, X, Check, RefreshCw, Package, AlertTriangle
} from 'lucide-react';
import { generateMarketingResponse, generateMarketingCampaignPlan, isGeminiAvailable } from '../utils/gemini';

/* ═══════════════════════════════════════════════════════════════════
   ICON MAP & RESOLVER
   ═══════════════════════════════════════════════════════════════════ */

const ICON_MAP = {
  Star, Heart, Cake, Zap, Calendar, Package, Gift, Megaphone,
  ShoppingBag, Tag, Sparkles, Target, Mail, Smartphone, Bell,
  TrendingUp, DollarSign, BarChart3, Award, Percent, RefreshCw,
  Users, MapPin, Shield, Clock, Eye, Store, Filter, Layers,
};

function resolveIcon(icon) {
  if (typeof icon === 'function') return icon;
  return ICON_MAP[icon] || Sparkles;
}

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT INVENTORY — used to check stock before campaign launch
   ═══════════════════════════════════════════════════════════════════ */

const PRODUCT_INVENTORY = [
  { brand: 'Jeeter', name: 'Baby Jeeter Infused', strain: 'Churros', currentStock: 8, avgWeeklySales: 56 },
  { brand: 'Jeeter', name: 'Baby Jeeter Infused', strain: 'Honeydew', currentStock: 14, avgWeeklySales: 34 },
  { brand: 'Jeeter', name: 'Jeeter Juice', strain: 'Blue Zkittlez', currentStock: 22, avgWeeklySales: 28 },
  { brand: 'Jeeter', name: 'Jeeter XL Infused', strain: 'Horchata', currentStock: 6, avgWeeklySales: 18 },
  { brand: 'STIIIZY', name: 'STIIIZY OG Kush Pod', strain: null, currentStock: 0, avgWeeklySales: 42 },
  { brand: 'Kiva', name: 'Camino Pineapple Habanero Gummies', strain: null, currentStock: 0, avgWeeklySales: 38 },
  { brand: 'Raw Garden', name: 'Refined Live Resin Cart', strain: 'Slippery Susan', currentStock: 0, avgWeeklySales: 28 },
  { brand: 'Wyld', name: 'Elderberry Gummies', strain: 'Indica', currentStock: 0, avgWeeklySales: 22 },
  { brand: 'Cookies', name: 'Gary Payton', strain: null, currentStock: 18, avgWeeklySales: 24 },
  { brand: 'PLUS', name: 'Dual Chamber Gummies', strain: null, currentStock: 32, avgWeeklySales: 16 },
];

function getInventoryForProducts(featuredProducts) {
  if (!featuredProducts) return [];
  return featuredProducts.map(fp => {
    const match = PRODUCT_INVENTORY.find(inv =>
      fp.name.includes(inv.name) || inv.name.includes(fp.name)
    );
    if (!match) return null;
    const dailySales = match.avgWeeklySales / 7;
    const daysOfSupply = dailySales > 0 ? Math.round(match.currentStock / dailySales) : 999;
    return { ...fp, ...match, daysOfSupply, dailySales };
  }).filter(p => p && p.daysOfSupply < 30);
}

/* ═══════════════════════════════════════════════════════════════════
   CAMPAIGN DATA
   ═══════════════════════════════════════════════════════════════════ */

export const CAMPAIGNS = {
  jeeter: {
    title: 'Brand Spotlight: Jeeter',
    subtitle: 'Showcase the latest Jeeter drop to your most engaged customers',
    icon: 'Star',
    accentFrom: '#7B2D8E',
    accentTo: '#4F46E5',
    heroGradient: 'from-purple-900/60 via-indigo-900/40 to-violet-900/60',
    heroBorder: 'border-purple-500/30',
    heroTag: 'Product Launch',
    heroImage: '/brands/jeeter-infused-cover.webp',
    audience: {
      size: '12,847',
      description: 'Customers who have purchased Jeeter products in the past 90 days, browsed Jeeter products 3+ times, or have "pre-rolls" in their top 3 categories by spend.',
      segments: [
        { name: 'Jeeter Loyalists', count: '4,210', desc: '3+ Jeeter purchases' },
        { name: 'Pre-Roll Enthusiasts', count: '5,890', desc: 'Top category: pre-rolls' },
        { name: 'High-Intent Browsers', count: '2,747', desc: 'Viewed Jeeter 3+ times, no purchase' },
      ],
    },
    channels: [
      { name: 'SMS', icon: 'Smartphone', reach: '9,200', rate: '94%', metric: 'open rate', cost: '$0.015/msg' },
      { name: 'Email', icon: 'Mail', reach: '11,400', rate: '38%', metric: 'open rate', cost: '$0.003/msg' },
      { name: 'Push', icon: 'Bell', reach: '6,100', rate: '12%', metric: 'tap rate', cost: 'Free' },
    ],
    schedule: {
      launch: 'Friday, March 6 · 10:00 AM PT',
      duration: '7 days',
      optimalSend: 'ML-optimized per customer timezone',
      followUp: 'Non-openers get SMS reminder on Day 3. Non-converters get "last chance" on Day 6.',
    },
    content: {
      headline: 'The Jeeter Drop You\'ve Been Waiting For 🔥',
      preheader: 'Baby Jeeter Churros + new Jeeter Juice flavors just landed',
      body: 'New Baby Jeeter Infused pre-rolls in Churros and Honeydew just hit the shelves at Ascend — plus Jeeter Juice Liquid Diamonds in Blue Zkittlez. As a Jeeter fan, you get early access and 15% off your first Jeeter pickup this weekend.',
      cta: 'Shop Jeeter Now →',
      offer: '15% off all Jeeter products — code JEETER15 — valid 7 days',
      finePrint: 'Limit one use per customer. Cannot be combined with other offers. Must be 21+.',
      smsPreview: 'Ascend: New Jeeter just dropped 🔥 Baby Jeeter Churros + Jeeter Juice Blue Zkittlez. Get 15% off with code JEETER15.',
    },
    smsMessages: [
      'Ascend: New Jeeter just dropped 🔥 Baby Jeeter Churros + Jeeter Juice Blue Zkittlez. Get 15% off this weekend with code JEETER15. Shop now → ascendwellness.com/jeeter',
      'Reply STOP to opt out',
    ],
    featuredProducts: [
      {
        name: 'Baby Jeeter Infused',
        type: '5pk Pre-Rolls · 2.5g',
        strain: 'Churros',
        thc: '46%',
        price: '$25.00',
        category: 'Infused Pre-Roll',
        badgeColor: '#9333EA',
        badgeText: 'BEST SELLER',
        image: '/brands/jeeter-baby-churros.webp',
      },
      {
        name: 'Jeeter Juice',
        type: 'Liquid Diamonds · 1g Cart',
        strain: 'Blue Zkittlez',
        thc: '84%',
        price: '$45.00',
        category: 'Vape Cartridge',
        badgeColor: '#2563EB',
        badgeText: 'NEW',
        image: '/brands/jeeter-juice.webp',
      },
      {
        name: 'Baby Jeeter Infused',
        type: '5pk Pre-Rolls · 2.5g',
        strain: 'Honeydew',
        thc: '41%',
        price: '$25.00',
        category: 'Infused Pre-Roll',
        badgeColor: '#16A34A',
        badgeText: 'POPULAR',
        image: '/brands/jeeter-baby-honeydew.webp',
      },
      {
        name: 'Jeeter XL Infused',
        type: 'Pre-Roll · 2g',
        strain: 'Horchata',
        thc: '38%',
        price: '$22.00',
        category: 'Infused Pre-Roll',
        badgeColor: '#EA580C',
        badgeText: 'STAFF PICK',
        image: '/brands/jeeter-xl-horchata.webp',
      },
    ],
    abTests: [
      { variant: 'A', subject: 'The Jeeter Drop You\'ve Been Waiting For 🔥', split: 50 },
      { variant: 'B', subject: 'New Baby Jeeter Churros Just Landed — 15% Off', split: 50 },
    ],
    compliance: [
      { label: 'Age gate verified (21+)', status: 'pass' },
      { label: 'Opt-in consent validated', status: 'pass' },
      { label: 'State cannabis advertising rules', status: 'pass' },
      { label: 'Disclaimer & fine print included', status: 'pass' },
      { label: 'Unsubscribe mechanism present', status: 'pass' },
    ],
    projections: {
      revenue: '$18,400 — $24,200',
      orders: '340 — 480',
      roi: '6.2x',
      reactivated: '~120 lapsed customers',
      aov: '$52.40',
      redemptionRate: '14.2%',
    },
    locationTargeting: [
      { name: 'Ascend — Logan Square', id: 'logan-square', count: '4,200' },
      { name: 'Ascend — Fort Lee', id: 'fort-lee', count: '3,600' },
      { name: 'Ascend — Boston', id: 'boston', count: '3,100' },
      { name: 'Ascend — Detroit', id: 'detroit', count: '2,800' },
    ],
    budget: { totalCost: '$186.40', costPerConversion: '$0.48' },
  },

  winback: {
    title: 'Win Back: "We Miss You" Re-Engagement',
    subtitle: 'Personalized re-engagement for lapsed high-value customers',
    icon: 'Heart',
    accentFrom: '#DC2626',
    accentTo: '#EA580C',
    heroGradient: 'from-red-900/60 via-orange-900/40 to-amber-900/60',
    heroBorder: 'border-red-500/30',
    heroTag: 'Re-Engagement',
    audience: {
      size: '4,312',
      description: 'Customers with 2+ orders and AOV above $40 who haven\'t purchased in 60-120 days. Excludes opted-out, customers outside delivery range, and those with pending compliance holds.',
      segments: [
        { name: '60-90 Day Lapsed', count: '2,840', desc: 'Avg previous AOV: $58' },
        { name: '90-120 Day Lapsed', count: '1,472', desc: 'Avg previous AOV: $64' },
        { name: 'VIP Lapsed', count: '380', desc: '$500+ lifetime spend' },
      ],
    },
    channels: [
      { name: 'SMS', icon: 'Smartphone', reach: '3,800', rate: '91%', metric: 'open rate', cost: '$0.015/msg' },
      { name: 'Email', icon: 'Mail', reach: '4,100', rate: '28%', metric: 'open rate', cost: '$0.003/msg' },
      { name: 'Push', icon: 'Bell', reach: '2,200', rate: '8%', metric: 'tap rate', cost: 'Free' },
    ],
    schedule: {
      launch: 'Tuesday, March 10 · 11:00 AM PT',
      duration: '14 days (3-touch escalation)',
      optimalSend: 'ML-optimized per customer timezone',
      followUp: 'Day 1: 10% off → Day 7: 20% off → Day 12: 25% off + free delivery',
    },
    content: {
      headline: 'It\'s Been a While — We Saved Something for You',
      preheader: 'Your favorites are waiting + a special offer inside',
      body: 'Hey {first_name}, we noticed it\'s been a minute! Since your last visit, we\'ve added 40+ new products including top-rated Kiva edibles, new STIIIZY pods, and fresh flower drops. Here\'s a personalized offer based on what you used to love:',
      cta: 'See What\'s New →',
      offer: 'Escalating: 10% → 20% → 25% off + free delivery',
      finePrint: 'Offers valid for single use. Each escalation replaces the previous. Must be 21+.',
      smsPreview: 'Hey! 👋 It\'s been a while since your last visit to Ascend. We\'ve got 40+ new products — plus here\'s 20% off your next order.',
    },
    smsMessages: [
      'Hey! 👋 It\'s been a while since your last visit to Ascend. We\'ve got 40+ new products — plus here\'s 20% off your next order. See what\'s new → ascendwellness.com/welcome-back',
      'Reply STOP to opt out',
    ],
    personalizedProducts: [
      { name: 'Based on your history', items: ['STIIIZY OG Kush Pod', 'Kiva Camino Gummies', 'Raw Garden Refined Live Resin'] },
      { name: 'New since you left', items: ['Alien Labs Xeno', 'Jeeter Juice Liquid Diamonds', 'PLUS Dual Chamber Gummies'] },
    ],
    abTests: [
      { variant: 'A', subject: 'It\'s Been a While — We Saved Something for You', split: 33 },
      { variant: 'B', subject: 'Your 20% Off is About to Expire ⏰', split: 33 },
      { variant: 'C', subject: '{first_name}, We Miss You at Ascend', split: 34 },
    ],
    compliance: [
      { label: 'Age gate verified (21+)', status: 'pass' },
      { label: 'Opt-in consent validated', status: 'pass' },
      { label: 'State cannabis advertising rules', status: 'pass' },
      { label: 'Disclaimer & fine print included', status: 'pass' },
      { label: 'Unsubscribe mechanism present', status: 'pass' },
      { label: 'Suppression list applied', status: 'pass' },
    ],
    projections: {
      revenue: '$9,800 — $14,600',
      orders: '210 — 340',
      roi: '4.8x',
      reactivated: '~280 customers',
      aov: '$48.20',
      redemptionRate: '11.8%',
    },
    locationTargeting: [
      { name: 'Ascend — Logan Square', id: 'logan-square', count: '1,400' },
      { name: 'Ascend — Fort Lee', id: 'fort-lee', count: '1,200' },
      { name: 'Ascend — Boston', id: 'boston', count: '980' },
      { name: 'Ascend — Detroit', id: 'detroit', count: '732' },
    ],
    budget: { totalCost: '$124.60', costPerConversion: '$0.52' },
  },

  birthday: {
    title: 'Birthday Rewards: Loyalty Celebration',
    subtitle: 'Tier-based automated birthday rewards for loyalty members',
    icon: 'Cake',
    accentFrom: '#EC4899',
    accentTo: '#8B5CF6',
    heroGradient: 'from-pink-900/60 via-fuchsia-900/40 to-purple-900/60',
    heroBorder: 'border-pink-500/30',
    heroTag: 'Automated Flow',
    audience: {
      size: '~890/month',
      description: 'Active loyalty program members with verified birthdays on file. Triggered automatically 3 days before each customer\'s birthday. Rewards scale by loyalty tier — Standard, Gold, and VIP members receive different offers.',
      segments: [
        { name: 'Standard Members', count: '~520/mo', desc: 'Free pre-roll + 15% off' },
        { name: 'Gold Members', count: '~290/mo', desc: 'Free 1/8th + 20% off' },
        { name: 'VIP Members', count: '~80/mo', desc: 'Free 1/4oz + 30% off + merch' },
      ],
    },
    channels: [
      { name: 'SMS', icon: 'Smartphone', reach: '820/mo', rate: '96%', metric: 'open rate', cost: '$0.015/msg' },
      { name: 'Email', icon: 'Mail', reach: '870/mo', rate: '52%', metric: 'open rate', cost: '$0.003/msg' },
      { name: 'Push', icon: 'Bell', reach: '540/mo', rate: '18%', metric: 'tap rate', cost: 'Free' },
    ],
    schedule: {
      launch: 'Automated — triggers 3 days before birthday',
      duration: '10-day redemption window',
      optimalSend: '10:00 AM customer local time',
      followUp: 'Birthday day: "Happy Birthday!" · Day 8: "2 days left to redeem"',
    },
    content: {
      headline: 'Happy Birthday, {first_name}! 🎂 Your Gift is Ready',
      preheader: 'A special birthday reward from Ascend — just for you',
      body: 'Your birthday is almost here and we want to celebrate with you! As a {tier_name} loyalty member, here\'s your exclusive birthday reward — on us. Stop by any Ascend location within the next 10 days to claim it.',
      cta: 'Claim My Birthday Gift →',
      offer: 'Tier-based: Free pre-roll to free 1/4oz + 15-30% off',
      finePrint: 'One birthday reward per member per year. Must present loyalty card or app. Must be 21+.',
      smsPreview: 'Happy early birthday! 🎂 Your gift from Ascend is ready: a FREE pre-roll + 15% off your entire order.',
    },
    smsMessages: [
      'Happy early birthday! 🎂 Your gift from Ascend is ready: a FREE pre-roll + 15% off your entire order. Valid for 10 days. Claim it → ascendwellness.com/birthday',
      'Reply STOP to opt out',
    ],
    tierRewards: [
      { tier: 'Standard', reward: 'Free Pre-Roll', discount: '15% off entire order', color: '#8B949E' },
      { tier: 'Gold', reward: 'Free 1/8th', discount: '20% off entire order', color: '#D4A03A' },
      { tier: 'VIP', reward: 'Free 1/4oz + Merch Pack', discount: '30% off entire order', color: '#B598E8' },
    ],
    abTests: [
      { variant: 'A', subject: 'Happy Birthday, {first_name}! 🎂 Your Gift is Ready', split: 50 },
      { variant: 'B', subject: '🎁 {first_name}, Unwrap Your Birthday Reward', split: 50 },
    ],
    compliance: [
      { label: 'Age gate verified (21+)', status: 'pass' },
      { label: 'Opt-in consent validated', status: 'pass' },
      { label: 'State cannabis advertising rules', status: 'pass' },
      { label: 'Birthday data PII handling', status: 'pass' },
      { label: 'Unsubscribe mechanism present', status: 'pass' },
    ],
    projections: {
      revenue: '$6,200 — $8,400/mo',
      orders: '180 — 260/mo',
      roi: '8.1x',
      reactivated: '~45 first-time loyalty redemptions/mo',
      aov: '$62.30',
      redemptionRate: '34.5%',
    },
    locationTargeting: [
      { name: 'Ascend — Logan Square', id: 'logan-square', count: '280/mo' },
      { name: 'Ascend — Fort Lee', id: 'fort-lee', count: '250/mo' },
      { name: 'Ascend — Boston', id: 'boston', count: '210/mo' },
      { name: 'Ascend — Detroit', id: 'detroit', count: '150/mo' },
    ],
    budget: { totalCost: '$42.80/mo', costPerConversion: '$0.18' },
  },
};

/* ═══════════════════════════════════════════════════════════════════
   CAMPAIGN BASELINES — numeric values for dynamic projection engine
   ═══════════════════════════════════════════════════════════════════ */

const CAMPAIGN_BASELINES = {
  jeeter: {
    baseAudienceSize: 12847,
    baseRevenueLow: 18400, baseRevenueHigh: 24200,
    baseOrdersLow: 340, baseOrdersHigh: 480,
    baseROI: 6.2, baseTotalCost: 186.40, baseAOV: 52.40,
    channelCosts: { SMS: 0.015, Email: 0.003, Push: 0 },
    channelReach: { SMS: 0.716, Email: 0.887, Push: 0.475 },
    channelConversionRate: { SMS: 0.038, Email: 0.012, Push: 0.006 },
    locationWeights: { 'logan-square': 0.33, 'fort-lee': 0.30, boston: 0.21, detroit: 0.16 },
  },
  winback: {
    baseAudienceSize: 4312,
    baseRevenueLow: 9800, baseRevenueHigh: 14600,
    baseOrdersLow: 210, baseOrdersHigh: 340,
    baseROI: 4.8, baseTotalCost: 124.60, baseAOV: 48.20,
    channelCosts: { SMS: 0.015, Email: 0.003, Push: 0 },
    channelReach: { SMS: 0.881, Email: 0.950, Push: 0.510 },
    channelConversionRate: { SMS: 0.032, Email: 0.009, Push: 0.004 },
    locationWeights: { 'logan-square': 0.32, 'fort-lee': 0.28, boston: 0.23, detroit: 0.17 },
  },
  birthday: {
    baseAudienceSize: 890,
    baseRevenueLow: 6200, baseRevenueHigh: 8400,
    baseOrdersLow: 180, baseOrdersHigh: 260,
    baseROI: 8.1, baseTotalCost: 42.80, baseAOV: 62.30,
    channelCosts: { SMS: 0.015, Email: 0.003, Push: 0 },
    channelReach: { SMS: 0.921, Email: 0.978, Push: 0.607 },
    channelConversionRate: { SMS: 0.042, Email: 0.018, Push: 0.008 },
    locationWeights: { 'logan-square': 0.31, 'fort-lee': 0.28, boston: 0.24, detroit: 0.17 },
  },
};

/* ═══════════════════════════════════════════════════════════════════
   UNIFIED PRODUCT CARD
   ═══════════════════════════════════════════════════════════════════ */

function ProductCard({ product, accentColor }) {
  const accent = accentColor || product.badgeColor || '#9333EA';
  return (
    <div className="bg-[#141210] rounded-xl border border-[#38332B] overflow-hidden hover:border-purple-500/40 transition-all group">
      {/* Product visual */}
      <div className="relative h-44 overflow-hidden" style={{ background: product.image ? '#1a0a2e' : `linear-gradient(135deg, ${accent}22, ${accent}11)` }}>
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.name} ${product.strain || ''}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-10 h-10" style={{ color: accent + '66' }} />
          </div>
        )}
        {/* Badge */}
        {product.badgeText && (
          <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-lg" style={{ background: product.badgeColor || accent }}>
            {product.badgeText}
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3.5">
        {product.category && <p className="text-xs text-purple-400 font-medium">{product.category}</p>}
        <p className="text-sm font-semibold text-[#F0EDE8] mt-0.5">{product.name}</p>
        <p className="text-xs text-[#ADA599]">{product.type}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {product.strain && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">{product.strain}</span>}
            {product.thc && <span className="text-xs text-[#ADA599]">THC {product.thc}</span>}
          </div>
          {product.price && <span className="text-sm font-bold text-[#F0EDE8]">{product.price}</span>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHONE MOCKUP for SMS preview
   ═══════════════════════════════════════════════════════════════════ */

function PhoneMockup({ messages, brandColor }) {
  return (
    <div className="relative mx-auto" style={{ width: '220px' }}>
      {/* Phone bezel */}
      <div className="rounded-[24px] border-2 border-[#38332B] bg-[#1a1a2e] p-2 shadow-2xl">
        {/* Notch */}
        <div className="flex justify-center mb-1">
          <div className="w-16 h-4 rounded-full bg-[#141210]" />
        </div>
        {/* Screen */}
        <div className="bg-[#141210] rounded-[16px] p-3 min-h-[240px]">
          <div className="text-center mb-3">
            <p className="text-[9px] text-[#ADA599]">Today 10:02 AM</p>
          </div>
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <div className="rounded-2xl rounded-bl-sm px-3 py-2 text-[11px] leading-relaxed" style={{
                background: brandColor + '22',
                border: `1px solid ${brandColor}33`,
                color: '#F0F6FC',
              }}>
                {msg}
              </div>
            </div>
          ))}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-7 rounded-full bg-[#1C1B1A] border border-[#38332B]" />
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: brandColor }}>
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EMAIL PREVIEW MOCKUP
   ═══════════════════════════════════════════════════════════════════ */

function EmailPreview({ data }) {
  const c = data;
  const content = c.content || {};
  return (
    <div className="bg-[#141210] rounded-xl border border-[#38332B] overflow-hidden">
      {/* Email client chrome */}
      <div className="px-4 py-2.5 border-b border-[#38332B] flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E87068]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4A03A]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C27C]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-[#ADA599]">Ascend &lt;hello@ascendwellness.com&gt;</span>
        </div>
      </div>
      {/* Subject */}
      <div className="px-4 py-2 border-b border-[#38332B]">
        <p className="text-xs font-semibold text-[#F0EDE8]">{content.headline || ''}</p>
        <p className="text-[10px] text-[#ADA599]">{content.preheader || ''}</p>
      </div>
      {/* Body */}
      <div className="p-4">
        {/* Hero banner */}
        <div className="rounded-lg overflow-hidden mb-3 h-28 flex items-center justify-center relative" style={{
          background: `linear-gradient(135deg, ${c.accentFrom}44, ${c.accentTo}44)`,
        }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${c.accentFrom} 0%, transparent 50%)`,
          }} />
          <div className="relative text-center">
            <p className="text-lg font-bold text-[#F0EDE8]">{(content.headline || '').replace(/ 🔥| 🎂/g, '')}</p>
            <p className="text-[10px] text-[#ADA599] mt-1">{content.offer || ''}</p>
          </div>
        </div>
        <p className="text-[11px] text-[#ADA599] leading-relaxed mb-3">{(content.body || '').substring(0, 120)}...</p>
        <div className="text-center">
          <span className="inline-block text-[11px] px-5 py-2 rounded-full font-semibold text-white" style={{
            background: `linear-gradient(135deg, ${c.accentFrom || '#4F46E5'}, ${c.accentTo || '#7B2D8E'})`,
          }}>{content.cta || 'Shop Now'}</span>
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-6 py-4 hover:bg-[#282724] transition-colors"
      >
        <Icon className="w-5 h-5 flex-shrink-0" style={{ color: iconColor }} />
        <h2 className="text-base font-semibold text-[#F0EDE8]">{title}</h2>
        {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C27C]/10 text-[#00C27C] font-medium">{badge}</span>}
        <div className="ml-auto">
          {open ? <ChevronUp className="w-4 h-4 text-[#ADA599]" /> : <ChevronDown className="w-4 h-4 text-[#ADA599]" />}
        </div>
      </button>
      {open && <div className="px-6 pb-5 border-t border-[#38332B] pt-4">{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LOW STOCK ALERT — warns when featured products have < 30 days supply
   ═══════════════════════════════════════════════════════════════════ */

function LowStockAlert({ featuredProducts }) {
  const lowStockItems = useMemo(() => getInventoryForProducts(featuredProducts), [featuredProducts]);
  const [dismissed, setDismissed] = useState(false);

  if (!lowStockItems.length || dismissed) return null;

  return (
    <div className="bg-[#D4A03A]/[0.08] border border-[#D4A03A]/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#D4A03A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-[#D4A03A]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-[#D4A03A]">Low Inventory Alert</h3>
            <button onClick={() => setDismissed(true)} className="text-[#6B6359] hover:text-[#ADA599] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-[#F0EDE8] mb-3">
            {lowStockItems.length} featured product{lowStockItems.length !== 1 ? 's have' : ' has'} less than 30 days of inventory. If this campaign is successful, you could run out of stock.
          </p>
          <div className="space-y-2 mb-4">
            {lowStockItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#141210]/60 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Package className="w-3.5 h-3.5 text-[#D4A03A] flex-shrink-0" />
                  <span className="text-xs text-[#F0EDE8] font-medium truncate">{item.name}{item.strain ? ` — ${item.strain}` : ''}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] text-[#ADA599]">{item.currentStock} units left</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    item.daysOfSupply <= 3 ? 'bg-[#E87068]/15 text-[#E87068]' : 'bg-[#D4A03A]/15 text-[#D4A03A]'
                  }`}>
                    {item.daysOfSupply === 0 ? 'Out of stock' : `~${item.daysOfSupply}d supply`}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/agents/connect"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#D4A03A] hover:bg-[#E5A823] text-white shadow-sm shadow-[#D4A03A]/20 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reorder low stock so you don't run out
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CAMPAIGN PLAN VIEW (unified — handles both preset and AI data)
   ═══════════════════════════════════════════════════════════════════ */

export function CampaignPlan({ data, onBack }) {
  const c = data;
  const Icon = resolveIcon(c.icon);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [budgetDaily, setBudgetDaily] = useState(50);
  const [selectedLocations, setSelectedLocations] = useState(['all']);
  const [abEnabled, setAbEnabled] = useState(true);
  const [testSent, setTestSent] = useState(false);

  // Editable campaign fields
  const [editAudienceSize, setEditAudienceSize] = useState(c.audience?.size || '0');
  const [editAudienceDesc, setEditAudienceDesc] = useState(c.audience?.description || '');
  const [editSegments, setEditSegments] = useState(() => (c.audience?.segments || []).map(s => ({ ...s })));
  const [editOffer, setEditOffer] = useState(c.content?.offer || '');
  const [editSchedule, setEditSchedule] = useState(() => ({ ...(c.schedule || {}) }));
  const [enabledChannels, setEnabledChannels] = useState(() => new Set((c.channels || []).map(ch => ch.name)));
  const [editRefinement, setEditRefinement] = useState(() => ({
    minAge: '21+', maxDistance: '15 mi', minSpend: '$0', lastActive: '365 days',
  }));
  const [editSmsPreview, setEditSmsPreview] = useState(c.content?.smsPreview || c.smsMessages?.[0] || 'Check out our latest deals!');

  // Detect campaign key for baselines
  const campaignKey = Object.keys(CAMPAIGNS).find(k => CAMPAIGNS[k].title === c.title);
  const baseline = CAMPAIGN_BASELINES[campaignKey] || CAMPAIGN_BASELINES.jeeter;

  // Dynamic projection engine
  const dynamicProjections = useMemo(() => {
    // Parse audience size (remove commas, ~/mo suffixes)
    const parsedAudience = parseInt(String(editAudienceSize).replace(/[^0-9]/g, '')) || baseline.baseAudienceSize;
    const audienceScale = parsedAudience / baseline.baseAudienceSize;

    // Location scale
    let locationScale = 1.0;
    if (!selectedLocations.includes('all') && selectedLocations.length > 0) {
      locationScale = selectedLocations.reduce((sum, locId) => sum + (baseline.locationWeights[locId] || 0), 0);
    } else if (selectedLocations.length === 0) {
      locationScale = 0;
    }

    // Per-channel math
    let totalChannelCost = 0;
    let totalConversions = 0;
    const channelNames = ['SMS', 'Email', 'Push'];
    channelNames.forEach(ch => {
      if (!enabledChannels.has(ch)) return;
      const reach = (baseline.channelReach[ch] || 0) * parsedAudience * locationScale;
      const cost = reach * (baseline.channelCosts[ch] || 0);
      const conversions = reach * (baseline.channelConversionRate[ch] || 0);
      totalChannelCost += cost;
      totalConversions += conversions;
    });

    // Budget cap: scale down if daily natural cost > budgetDaily
    const campaignDays = 7;
    const naturalDailyCost = totalChannelCost / campaignDays;
    const bdgt = parseFloat(budgetDaily) || 50;
    let budgetScale = 1;
    if (naturalDailyCost > bdgt && naturalDailyCost > 0) {
      budgetScale = bdgt / naturalDailyCost;
      totalChannelCost = bdgt * campaignDays;
      totalConversions = totalConversions * budgetScale;
    }

    const ordersLow = Math.round(totalConversions * 0.75);
    const ordersHigh = Math.round(totalConversions * 1.15);
    const aov = baseline.baseAOV;
    const revenueLow = ordersLow * aov;
    const revenueHigh = ordersHigh * aov;
    const roi = totalChannelCost > 0 ? ((revenueLow + revenueHigh) / 2) / totalChannelCost : 0;
    const costPerConversion = totalConversions > 0 ? totalChannelCost / totalConversions : 0;
    const reactivated = Math.round(totalConversions * 0.35);

    const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const fmtCost = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return {
      revenue: `${fmt(revenueLow)} — ${fmt(revenueHigh)}`,
      orders: `${ordersLow.toLocaleString()} — ${ordersHigh.toLocaleString()}`,
      roi: `${roi.toFixed(1)}x`,
      aov: fmtCost(aov),
      redemptionRate: `${(totalConversions / (parsedAudience * locationScale || 1) * 100).toFixed(1)}%`,
      reactivated: `~${reactivated} customers`,
      totalCost: fmtCost(totalChannelCost),
      costPerConversion: fmtCost(costPerConversion),
      noChannels: enabledChannels.size === 0,
      noLocations: selectedLocations.length === 0,
    };
  }, [editAudienceSize, enabledChannels, selectedLocations, budgetDaily, baseline]);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 2200);
  };

  const smsMessages = c.smsMessages || [c.content?.smsPreview || 'Check out our latest deals!', 'Reply STOP to opt out'];

  // Hero styling: use Tailwind gradient classes if available (hardcoded presets), otherwise inline styles
  const hasHeroGradient = !!c.heroGradient;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* back */}
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#ADA599] hover:text-[#F0EDE8] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Agent
        </button>
      )}

      {/* AI attribution */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#00C27C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-[#00C27C]" />
        </div>
        <div>
          <p className="text-sm text-[#ADA599]">
            <span className="text-[#F0EDE8] font-medium">Dutchie Agent</span> generated this campaign plan based on your customer data and purchase history
          </p>
        </div>
      </div>

      {/* ───── hero ───── */}
      <div className={`relative rounded-2xl border ${c.heroBorder || ''} overflow-hidden`} style={!c.heroBorder ? { borderColor: c.accentFrom + '40' } : undefined}>
        {c.heroImage ? (
          <img src={c.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        ) : null}
        {hasHeroGradient ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${c.heroGradient}`} />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c.accentFrom}30, ${c.accentTo}10)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        <div className="relative px-8 py-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20 text-white/70 uppercase tracking-wider">{c.heroTag}</span>
            {!hasHeroGradient && <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#B598E8]/15 text-[#B598E8]">AI Generated</span>}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})` }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F0EDE8]">{c.title}</h1>
              <p className="text-sm text-[#ADA599]">{c.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Featured Products ───── */}
      {c.featuredProducts && c.featuredProducts.length > 0 && (
        <Section title="Featured Products" icon={Package} iconColor="#9333EA" badge={`${c.featuredProducts.length} SKUs`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {c.featuredProducts.map((p, i) => <ProductCard key={i} product={p} accentColor={c.accentFrom} />)}
          </div>
        </Section>
      )}

      {/* ───── Low Stock Alert ───── */}
      <LowStockAlert featuredProducts={c.featuredProducts} />

      {/* ───── Personalized Recommendations (re_engagement / winback) ───── */}
      {c.personalizedProducts && c.personalizedProducts.length > 0 && (
        <Section title="Personalized Product Recommendations" icon={Sparkles} iconColor="#EA580C" badge="ML-powered">
          <p className="text-xs text-[#ADA599] mb-4">Each customer receives product recommendations based on their purchase history and browsing behavior.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.personalizedProducts.map((group, i) => (
              <div key={i} className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
                <p className="text-xs font-medium text-[#F0EDE8] mb-3 flex items-center gap-2">
                  {i === 0 ? <Heart className="w-3.5 h-3.5 text-red-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  {group.name}
                </p>
                {group.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 py-1.5 border-b border-[#38332B] last:border-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: `linear-gradient(135deg, ${['#DC2626', '#2563EB', '#16A34A'][j % 3]}22, ${['#DC2626', '#2563EB', '#16A34A'][j % 3]}11)`,
                    }}>
                      <Package className="w-3.5 h-3.5" style={{ color: ['#DC2626', '#2563EB', '#16A34A'][j % 3] }} />
                    </div>
                    <span className="text-xs text-[#F0EDE8]">{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── Tier Rewards (automated_flow / birthday) ───── */}
      {c.tierRewards && c.tierRewards.length > 0 && (
        <Section title="Tier-Based Birthday Rewards" icon={Gift} iconColor="#EC4899" badge={`${c.tierRewards.length} tiers`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {c.tierRewards.map((t, i) => (
              <div key={i} className="bg-[#141210] rounded-xl p-5 border border-[#38332B] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: t.color }} />
                <Award className="w-6 h-6 mx-auto mb-2" style={{ color: t.color }} />
                <p className="text-sm font-bold text-[#F0EDE8]">{t.tier}</p>
                <p className="text-lg font-bold mt-2" style={{ color: t.color }}>{t.reward}</p>
                <p className="text-xs text-[#ADA599] mt-1">+ {t.discount}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── audience ───── */}
      <Section title="Target Audience" icon={Target} iconColor="#64A8E0">
        <div className="flex items-center justify-between mb-3 gap-3">
          <input
            type="text"
            value={editAudienceDesc}
            onChange={(e) => setEditAudienceDesc(e.target.value)}
            className="text-sm text-[#F0EDE8] leading-relaxed flex-1 bg-[#141210] border border-[#38332B] rounded-lg px-3 py-2 focus:border-[#64A8E0] focus:outline-none transition-colors"
          />
          <input
            type="text"
            value={editAudienceSize}
            onChange={(e) => setEditAudienceSize(e.target.value)}
            className="text-sm font-mono text-[#64A8E0] bg-[#64A8E0]/10 px-3 py-1.5 rounded-full whitespace-nowrap w-32 text-center border border-transparent focus:border-[#64A8E0] focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {editSegments.map((s, idx) => (
            <div key={idx} className="bg-[#141210] rounded-lg p-3.5 border border-[#38332B]">
              <div className="flex items-center justify-between mb-1 gap-2">
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => { const next = [...editSegments]; next[idx] = { ...next[idx], name: e.target.value }; setEditSegments(next); }}
                  className="text-xs font-medium text-[#F0EDE8] bg-transparent border-b border-transparent focus:border-[#64A8E0] focus:outline-none flex-1 min-w-0"
                />
                <input
                  type="text"
                  value={s.count}
                  onChange={(e) => { const next = [...editSegments]; next[idx] = { ...next[idx], count: e.target.value }; setEditSegments(next); }}
                  className="text-xs font-mono text-[#64A8E0] bg-transparent border-b border-transparent focus:border-[#64A8E0] focus:outline-none w-16 text-right"
                />
              </div>
              <input
                type="text"
                value={s.desc}
                onChange={(e) => { const next = [...editSegments]; next[idx] = { ...next[idx], desc: e.target.value }; setEditSegments(next); }}
                className="text-[11px] text-[#ADA599] bg-transparent border-b border-transparent focus:border-[#64A8E0] focus:outline-none w-full"
              />
            </div>
          ))}
        </div>
        {/* Audience refinement controls */}
        <div className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 text-[#ADA599]" />
            <span className="text-xs font-medium text-[#ADA599] uppercase tracking-wider">Audience Refinement</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Min Age', key: 'minAge', icon: Users },
              { label: 'Max Distance', key: 'maxDistance', icon: MapPin },
              { label: 'Min Lifetime Spend', key: 'minSpend', icon: DollarSign },
              { label: 'Last Active Within', key: 'lastActive', icon: Calendar },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1C1B1A] border border-[#38332B]">
                <f.icon className="w-3 h-3 text-[#6B6359]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#6B6359]">{f.label}</p>
                  <input
                    type="text"
                    value={editRefinement[f.key]}
                    onChange={(e) => setEditRefinement(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="text-xs text-[#F0EDE8] font-medium bg-transparent border-b border-transparent focus:border-[#64A8E0] focus:outline-none w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───── channels ───── */}
      <Section title="Channel Strategy" icon={Megaphone} iconColor="#B598E8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {(c.channels || []).map((ch) => {
            const ChannelIcon = resolveIcon(ch.icon);
            const isEnabled = enabledChannels.has(ch.name);
            return (
              <div key={ch.name} className={`bg-[#141210] rounded-lg p-4 border transition-opacity ${isEnabled ? 'border-[#38332B]' : 'border-[#38332B] opacity-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChannelIcon className="w-4 h-4 text-[#B598E8]" />
                    <span className="text-sm font-medium text-[#F0EDE8]">{ch.name}</span>
                  </div>
                  <button
                    onClick={() => setEnabledChannels(prev => {
                      const next = new Set(prev);
                      if (next.has(ch.name)) next.delete(ch.name); else next.add(ch.name);
                      return next;
                    })}
                    className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${isEnabled ? 'bg-[#00C27C]/30 justify-end' : 'bg-[#38332B] justify-start'}`}
                  >
                    <div className={`w-3 h-3 rounded-full transition-colors ${isEnabled ? 'bg-[#00C27C]' : 'bg-[#1C1B1A]'}`} />
                  </button>
                </div>
                <p className="text-xl font-bold text-[#F0EDE8]">{ch.reach}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[#ADA599]">{ch.rate} {ch.metric}</p>
                  <p className="text-[10px] text-[#6B6359]">{ch.cost}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ───── creative preview ───── */}
      <Section title="Creative Preview" icon={Image} iconColor="#EC4899" badge="Editable">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SMS Preview */}
          <div>
            <p className="text-xs font-medium text-[#ADA599] mb-2 flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5" /> SMS Preview
            </p>
            <textarea
              value={editSmsPreview}
              onChange={(e) => setEditSmsPreview(e.target.value)}
              rows={2}
              className="w-full text-xs text-[#F0EDE8] bg-[#141210] border border-[#38332B] rounded-lg px-3 py-2 mb-2 focus:border-[#EC4899] focus:outline-none resize-none"
            />
            <PhoneMockup messages={[editSmsPreview, 'Reply STOP to opt out']} brandColor={c.accentFrom} />
          </div>
          {/* Email Preview */}
          <div>
            <p className="text-xs font-medium text-[#ADA599] mb-2 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Preview
            </p>
            <div className="mb-2 space-y-1.5">
              <input
                type="text"
                value={editOffer}
                onChange={(e) => setEditOffer(e.target.value)}
                placeholder="Offer text..."
                className="w-full text-xs text-[#F0EDE8] bg-[#141210] border border-[#38332B] rounded-lg px-3 py-2 focus:border-[#EC4899] focus:outline-none"
              />
            </div>
            <EmailPreview data={{ ...c, content: { ...(c.content || {}), offer: editOffer || c.content?.offer || '' } }} />
          </div>
        </div>
      </Section>

      {/* ───── A/B testing ───── */}
      {c.abTests && c.abTests.length > 0 && (
        <Section title="A/B Testing" icon={FlaskConical} iconColor="#D4A03A" defaultOpen={false}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#ADA599]">Test multiple subject lines to optimize open rates</p>
            <button
              onClick={() => setAbEnabled(!abEnabled)}
              className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${abEnabled ? 'bg-[#00C27C] justify-end' : 'bg-[#38332B] justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-[#1C1B1A] shadow" />
            </button>
          </div>
          {abEnabled && (
            <div className="space-y-3">
              {c.abTests.map((t) => (
                <div key={t.variant} className="flex items-center gap-3 bg-[#141210] rounded-lg p-3 border border-[#38332B]">
                  <span className="text-xs font-bold text-[#D4A03A] bg-[#D4A03A]/10 w-7 h-7 rounded-lg flex items-center justify-center">{t.variant}</span>
                  <p className="text-xs text-[#F0EDE8] flex-1">{t.subject}</p>
                  <span className="text-xs text-[#ADA599]">{t.split}%</span>
                </div>
              ))}
              <p className="text-[10px] text-[#6B6359]">Winner determined after 2 hours based on open rate. Remaining sends use winning variant.</p>
            </div>
          )}
        </Section>
      )}

      {/* ───── schedule & timing ───── */}
      <Section title="Schedule & Timing" icon={Clock} iconColor="#D4A03A">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            {Object.entries(editSchedule).map(([key, val]) => (
              <div key={key} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4A03A] mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-[#6B6359] uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setEditSchedule(prev => ({ ...prev, [key]: e.target.value }))}
                    className="text-xs text-[#F0EDE8] bg-transparent border-b border-transparent focus:border-[#D4A03A] focus:outline-none w-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
            <p className="text-xs font-medium text-[#ADA599] mb-3">Send Window</p>
            <div className="space-y-2">
              {['9 AM — 12 PM', '12 PM — 3 PM', '3 PM — 6 PM', '6 PM — 9 PM'].map((w, i) => (
                <div key={w} className="flex items-center gap-2">
                  <div className={`flex-1 h-3 rounded-full ${i < 3 ? 'bg-[#00C27C]/30' : 'bg-[#38332B]'}`}>
                    <div className="h-3 rounded-full bg-[#00C27C]" style={{ width: [85, 70, 45, 0][i] + '%' }} />
                  </div>
                  <span className="text-[10px] text-[#ADA599] w-24 text-right">{w}</span>
                </div>
              ))}
              <p className="text-[10px] text-[#6B6359] mt-2">Optimal send times based on historical engagement data</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ───── multi-location targeting ───── */}
      {c.locationTargeting && c.locationTargeting.length > 0 && (
        <Section title="Location Targeting" icon={Store} iconColor="#64A8E0" defaultOpen={false}>
          <div className="space-y-2">
            <div
              onClick={() => setSelectedLocations(prev => prev.includes('all') ? [] : ['all'])}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141210] border border-[#38332B] cursor-pointer hover:border-[#38332B] transition-colors"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                selectedLocations.includes('all') ? 'bg-[#00C27C] border-[#00C27C]' : 'border-[#38332B]'
              }`}>
                {selectedLocations.includes('all') && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-xs text-[#F0EDE8] flex-1">All Locations</span>
              <span className="text-xs text-[#ADA599] font-mono">{c.audience?.size || '0'}</span>
            </div>
            {c.locationTargeting.map((loc) => (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedLocations(prev => {
                    const without = prev.filter(id => id !== 'all');
                    return without.includes(loc.id) ? without.filter(id => id !== loc.id) : [...without, loc.id];
                  });
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#141210] border border-[#38332B] cursor-pointer hover:border-[#38332B] transition-colors"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  selectedLocations.includes(loc.id) || selectedLocations.includes('all') ? 'bg-[#00C27C] border-[#00C27C]' : 'border-[#38332B]'
                }`}>
                  {(selectedLocations.includes(loc.id) || selectedLocations.includes('all')) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs text-[#F0EDE8] flex-1">{loc.name}</span>
                <span className="text-xs text-[#ADA599] font-mono">{loc.count}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── budget ───── */}
      <Section title="Budget & Spend" icon={DollarSign} iconColor="#00C27C" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
            <p className="text-[10px] text-[#6B6359]">Est. Total Cost</p>
            <p className="text-lg font-bold text-[#F0EDE8]">{dynamicProjections.totalCost}</p>
            <p className="text-[10px] text-[#ADA599]">Across {enabledChannels.size} channel{enabledChannels.size !== 1 ? 's' : ''}</p>
          </div>
          <div className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
            <p className="text-[10px] text-[#6B6359]">Cost per Conversion</p>
            <p className="text-lg font-bold text-[#F0EDE8]">{dynamicProjections.costPerConversion}</p>
            <p className="text-[10px] text-[#ADA599]">Based on projected conversion</p>
          </div>
          <div className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
            <p className="text-[10px] text-[#6B6359]">Daily Budget Cap</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-[#F0EDE8]">${budgetDaily}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={budgetDaily}
              onChange={(e) => setBudgetDaily(e.target.value)}
              className="w-full h-1 mt-2 rounded-full appearance-none bg-[#38332B] accent-[#00C27C]"
            />
          </div>
        </div>
      </Section>

      {/* ───── compliance ───── */}
      <Section title="Compliance Review" icon={Shield} iconColor="#00C27C" badge="All Passed">
        <div className="space-y-2">
          {(c.compliance || []).map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C27C] flex-shrink-0" />
              <span className="text-xs text-[#F0EDE8]">{item.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ───── projected performance ───── */}
      <Section title="Projected Performance" icon={TrendingUp} iconColor="#00C27C">
        {(dynamicProjections.noChannels || dynamicProjections.noLocations) && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-xs text-amber-400">
              {dynamicProjections.noChannels && 'No channels selected — projections are zero. '}
              {dynamicProjections.noLocations && 'No locations selected — projections are zero.'}
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Est. Revenue', value: dynamicProjections.revenue, icon: DollarSign, color: '#00C27C' },
            { label: 'Est. Orders', value: dynamicProjections.orders, icon: ShoppingBag, color: '#64A8E0' },
            { label: 'Projected ROI', value: dynamicProjections.roi, icon: TrendingUp, color: '#B598E8' },
            { label: 'Avg Order Value', value: dynamicProjections.aov, icon: BarChart3, color: '#D4A03A' },
            { label: 'Redemption Rate', value: dynamicProjections.redemptionRate, icon: Percent, color: '#EC4899' },
            { label: 'Reactivated', value: dynamicProjections.reactivated, icon: RefreshCw, color: '#EA580C' },
          ].filter(m => m.value && m.value !== '—').map((m) => (
            <div key={m.label} className="bg-[#141210] rounded-lg p-4 border border-[#38332B]">
              <m.icon className="w-4 h-4 mb-2" style={{ color: m.color }} />
              <p className="text-[10px] text-[#6B6359]">{m.label}</p>
              <p className="text-sm font-bold text-[#F0EDE8] mt-0.5">{m.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───── send controls ───── */}
      <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-6">
        {sent ? (
          <div className="flex items-center gap-3 justify-center py-4 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-[#00C27C]" />
            <div>
              <p className="text-[#F0EDE8] font-semibold">Campaign Queued Successfully</p>
              <p className="text-sm text-[#ADA599]">{c.title} will begin sending on {c.schedule?.launch || 'schedule TBD'}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {(dynamicProjections.noChannels || dynamicProjections.noLocations) && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs text-amber-400">
                  {dynamicProjections.noChannels ? 'Enable at least one channel to launch.' : 'Select at least one location to launch.'}
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="text-[#F0EDE8] font-medium">Ready to launch?</p>
                <p className="text-sm text-[#ADA599]">
                  This will queue messages to {editAudienceSize} customers across {enabledChannels.size} channel{enabledChannels.size !== 1 ? 's' : ''}.
                  <span className="text-[#F0EDE8] font-medium ml-1">Est. cost: {dynamicProjections.totalCost}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTestSent(true)}
                  disabled={testSent}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-[#38332B] text-[#ADA599] hover:text-[#F0EDE8] hover:border-[#38332B] transition-colors disabled:opacity-50"
                >
                  {testSent ? <><Check className="w-4 h-4 text-[#00C27C]" /> Test Sent</> : <><Eye className="w-4 h-4" /> Send Test</>}
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || dynamicProjections.noChannels || dynamicProjections.noLocations}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})` }}
                >
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Queuing...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Launch Campaign</>
                  )}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-[#6B6359]">
              {c.content?.finePrint || ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TYPING INDICATOR
   ═══════════════════════════════════════════════════════════════════ */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-[#00C27C]/20 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-[#00C27C]" />
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
    key: 'jeeter-spotlight',
    label: 'Jeeter Brand Spotlight',
    prompt: 'Create a Jeeter brand spotlight campaign with their top pre-rolls and vapes, targeting loyal pre-roll buyers',
    description: 'Showcase Baby Jeeter Churros, Jeeter Juice, and XL Infused to your most engaged pre-roll customers',
    icon: Star,
    gradient: 'from-purple-600/20 to-indigo-600/20',
    border: 'hover:border-purple-500/40',
    tag: 'Product Launch',
    tagColor: '#9333EA',
    confidence: 'high',
  },
  {
    key: 'winback-lapsed',
    label: 'Win-Back Lapsed',
    prompt: 'Design a win-back campaign for customers who haven\'t visited in 60+ days with escalating discounts',
    description: 'Personalized 3-touch re-engagement for lapsed customers with escalating offers and product recs',
    icon: Heart,
    gradient: 'from-red-600/20 to-orange-600/20',
    border: 'hover:border-red-500/40',
    tag: 'Re-Engagement',
    tagColor: '#DC2626',
    confidence: 'high',
  },
  {
    key: 'birthday-rewards',
    label: 'Birthday Rewards',
    prompt: 'Build an automated birthday loyalty campaign with tiered rewards for Bronze/Silver/Gold members',
    description: 'Automated tier-based birthday rewards: free pre-roll to free 1/4oz depending on loyalty tier',
    icon: Cake,
    gradient: 'from-pink-600/20 to-purple-600/20',
    border: 'hover:border-pink-500/40',
    tag: 'Automated Flow',
    tagColor: '#EC4899',
    confidence: 'medium',
  },
  {
    key: 'flash-sale-edibles',
    label: 'Flash Sale — Edibles',
    prompt: 'Create a 48-hour flash sale campaign for edibles featuring Kiva, Wyld, and PLUS gummies with steep discounts to drive urgency',
    description: 'Time-limited edibles blowout with Kiva, Wyld, and PLUS gummies at limited-time pricing',
    icon: Zap,
    gradient: 'from-amber-600/20 to-orange-600/20',
    border: 'hover:border-amber-500/40',
    tag: 'Flash Sale',
    tagColor: '#D4A03A',
  },
  {
    key: 'new-product-launch',
    label: 'New Product Launch',
    prompt: 'Design a new product drop campaign for a just-arrived product line, with VIP early access, teasers, and launch-day excitement',
    description: 'Build hype for a new product drop with VIP early access and launch-day buzz',
    icon: Package,
    gradient: 'from-blue-600/20 to-cyan-600/20',
    border: 'hover:border-blue-500/40',
    tag: 'New Drop',
    tagColor: '#2563EB',
  },
  {
    key: 'holiday-420',
    label: 'Holiday 4/20 Campaign',
    prompt: 'Create a comprehensive 4/20 holiday campaign with week-long deals, daily drops, bundle offers, and social media tie-ins for our biggest sales event of the year',
    description: 'The biggest cannabis holiday — week-long deals, daily drops, bundle offers and social tie-ins',
    icon: Calendar,
    gradient: 'from-green-600/20 to-emerald-600/20',
    border: 'hover:border-green-500/40',
    tag: 'Seasonal',
    tagColor: '#16A34A',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function MarketingCampaigns() {
  const [view, setView] = useState('idle');
  const [campaignData, setCampaignData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const handleSuggestionClick = async (key) => {
    const suggestion = SUGGESTIONS.find((s) => s.key === key);
    setMessages((prev) => [...prev, { role: 'user', text: suggestion.label }]);
    setView('typing');

    if (isGeminiAvailable()) {
      const plan = await generateMarketingCampaignPlan(suggestion.prompt);
      if (plan && plan.title) {
        setCampaignData(plan);
        setMessages((prev) => [...prev, {
          role: 'agent',
          text: `I've analyzed your customer data and built a comprehensive **${plan.title}** campaign. Here's the full plan with creative, targeting, and projected performance:`
        }]);
        setView('plan');
        return;
      }
      // Gemini JSON failed — fall through to preset campaign card below
    }

    // Fallback: preset campaign card (always shows proper CampaignPlan)
    const presetMap = {
      'jeeter-spotlight': 'jeeter', 'winback-lapsed': 'winback', 'birthday-rewards': 'birthday',
      'flash-sale-edibles': 'jeeter', 'new-product-launch': 'jeeter', 'holiday-420': 'birthday',
    };
    const presetKey = presetMap[key] || 'jeeter';
    setCampaignData(CAMPAIGNS[presetKey]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'agent',
        text: `I've built a comprehensive **${CAMPAIGNS[presetKey].title}** campaign based on your customer data. Here's the full plan:`
      }]);
      setView('plan');
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
      const plan = await generateMarketingCampaignPlan(text);
      if (plan && plan.title) {
        setCampaignData(plan);
        setMessages((prev) => [...prev, {
          role: 'agent',
          text: `I've generated a complete **${plan.title}** campaign plan based on your request. Here's the full plan with targeting, creative, and projected performance:`
        }]);
        setView('plan');
        return;
      }
      // JSON parse failed — fall back to text response
      const textResponse = await generateMarketingResponse(text, `Store: Ascend (multi-state cannabis dispensary)\nProduct brands: Jeeter, STIIIZY, Kiva, Raw Garden, Cookies, Alien Labs, Wyld, PLUS\nChannels: SMS, Email, Push Notifications`);
      if (textResponse) {
        setMessages((prev) => [...prev, { role: 'agent', text: textResponse }]);
        setView('idle');
        return;
      }
    }

    // No Gemini key — graceful degradation via keyword matching to presets
    const lower = text.toLowerCase();
    let matchKey = null;
    if (lower.includes('win back') || lower.includes('lost') || lower.includes('lapsed') || lower.includes('re-engage') || lower.includes('inactive') || lower.includes('churn') || lower.includes('haven\'t visited') || lower.includes('dormant')) matchKey = 'winback';
    else if (lower.includes('birthday') || lower.includes('bday') || lower.includes('loyalty') || lower.includes('reward') || lower.includes('tier') || lower.includes('automated') || lower.includes('4/20') || lower.includes('holiday') || lower.includes('seasonal') || lower.includes('event')) matchKey = 'birthday';
    else if (lower.includes('jeeter') || lower.includes('brand spotlight')) matchKey = 'jeeter';
    // For other brands/products, use winback as a more generic preset (brand-neutral)
    else matchKey = 'winback';
    setCampaignData(CAMPAIGNS[matchKey]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'agent',
        text: `Great idea! I've built a comprehensive **${CAMPAIGNS[matchKey].title}** campaign based on your customer data. Take a look at the full plan:`
      }]);
      setView('plan');
    }, 1500);
  };

  const handleBack = () => { setView('idle'); setCampaignData(null); };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, view]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      {/* header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C27C] to-[#00A86B] flex items-center justify-center shadow-lg shadow-[#00C27C]/20">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F0EDE8]">Marketing Campaigns</h1>
          <p className="text-xs text-[#ADA599]">Powered by Dutchie AI Agent</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00C27C]/10 border border-[#00C27C]/20">
          <div className="w-2 h-2 rounded-full bg-[#00C27C] animate-pulse" />
          <span className="text-xs text-[#00C27C] font-medium">Online</span>
        </div>
      </div>

      {/* Marketing at a Glance */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-[#38332B] bg-[#1C1B1A]">
          <p className="text-[10px] uppercase tracking-wider text-[#ADA599] mb-1">Active Campaigns</p>
          <p className="text-xl font-bold text-[#F0EDE8]">2</p>
          <p className="text-[10px] text-[#00C27C]">Jeeter Spotlight, Birthday Rewards</p>
        </div>
        <div className="p-3 rounded-xl border border-[#38332B] bg-[#1C1B1A]">
          <p className="text-[10px] uppercase tracking-wider text-[#ADA599] mb-1">This Week</p>
          <p className="text-xl font-bold text-[#F0EDE8]">9,200</p>
          <p className="text-[10px] text-[#ADA599]">SMS sent · 94% open rate</p>
        </div>
        <div className="p-3 rounded-xl border border-[#38332B] bg-[#1C1B1A]">
          <p className="text-[10px] uppercase tracking-wider text-[#ADA599] mb-1">Ready for Review</p>
          <p className="text-xl font-bold text-[#D4A03A]">1</p>
          <p className="text-[10px] text-[#ADA599]">Win-Back Re-Engagement</p>
        </div>
        <div className="p-3 rounded-xl border border-[#38332B] bg-[#1C1B1A]">
          <p className="text-[10px] uppercase tracking-wider text-[#ADA599] mb-1">Compliance</p>
          <p className="text-xl font-bold text-[#00C27C]">All Clear</p>
          <p className="text-[10px] text-[#00C27C]">All campaigns passing</p>
        </div>
      </div>

      {/* chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {/* welcome */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00C27C]/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-[#00C27C]" />
          </div>
          <div className="bg-[#1C1B1A] border border-[#38332B] rounded-2xl rounded-tl-sm px-5 py-4 max-w-2xl">
            <p className="text-sm text-[#F0EDE8] leading-relaxed">
              Hey! I'm your Marketing Campaign agent. I can build full campaign plans with audience targeting,
              A/B testing, creative assets, channel strategy, compliance review, and projected ROI — all from a single prompt.
            </p>
            <p className="text-sm text-[#ADA599] mt-2 leading-relaxed">
              Select a campaign below or describe one you'd like to create.
            </p>
          </div>
        </div>

        {/* messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-[#00C27C]/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#00C27C]" />
              </div>
            )}
            <div className={`rounded-2xl px-5 py-3 max-w-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#00C27C] text-white rounded-tr-sm'
                : 'bg-[#1C1B1A] border border-[#38332B] text-[#F0EDE8] rounded-tl-sm'
            }`}>
              <span className="whitespace-pre-wrap">{msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</span>
            </div>
          </div>
        ))}

        {view === 'typing' && <TypingIndicator />}

        {view === 'plan' && campaignData && (
          <CampaignPlan data={campaignData} onBack={handleBack} />
        )}

        {/* suggestions */}
        {view === 'idle' && (
          <div className="pt-2 animate-fade-in">
            <p className="text-xs text-[#ADA599] mb-3 ml-11">Suggested campaigns</p>
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
                  <div className="flex items-center gap-1 mt-3 text-xs text-[#00C27C] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-3 h-3" /> Generate plan <ChevronRight className="w-3 h-3" />
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
        <div className="flex items-center gap-3 bg-[#1C1B1A] border border-[#38332B] rounded-2xl px-4 py-3 focus-within:border-[#00C27C]/50 transition-colors">
          <Sparkles className="w-5 h-5 text-[#ADA599] flex-shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe a campaign you want to run..."
            className="flex-1 bg-transparent text-sm text-[#F0EDE8] placeholder-[#484F58] outline-none"
            disabled={view === 'typing'}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || view === 'typing'}
            className="w-8 h-8 rounded-lg bg-[#00C27C] flex items-center justify-center text-white disabled:opacity-30 hover:bg-[#00D68A] transition-colors disabled:hover:bg-[#00C27C]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-[#6B6359] mt-2">
          Dutchie AI Agent generates projections from historical data. Review all details before launching.
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
