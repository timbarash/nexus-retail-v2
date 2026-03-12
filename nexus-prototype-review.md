---
title: "Dutchie Nexus Prototype Review"
subtitle: "Multi-Agent Analysis & Improvement Plan"
date: "March 8, 2026"
---

# Dutchie Nexus — Prototype Review & Improvement Plan

**Prepared by:** AI Review Panel (5 Agents) | **Date:** March 8, 2026
**Scope:** Full prototype at sa-demo.dutchie.dev | **Codebase:** sentiment-analysis/src/

---

## Executive Summary

Five specialized agents reviewed the entire Dutchie Nexus prototype from their domain perspectives: a Frontend Architect, a Dispensary Operations Manager ("Jordan"), a Cannabis Marketing Director ("Aaliyah"), a Compliance & Regulatory Expert ("David"), and a Multi-Location Executive ("Maria", COO).

**Overall verdict:** The prototype is the most complete cannabis retail intelligence platform any reviewer has seen. The unified sentiment pipeline is genuinely differentiated. The AI agent architecture is sound. The multi-location data model is correct. However, there are critical compliance gaps in AI-generated content, data accuracy issues with brand catalogs, and several quick fixes that would significantly improve demo credibility.

### Review Score by Domain

| Domain | Score | Key Finding |
|--------|-------|-------------|
| Architecture & Code Quality | B+ | Solid patterns, robust error handling, needs error boundary |
| Data Accuracy & Realism | B- | Sentiment data excellent; agent brand catalogs wrong-market |
| Marketing & Campaign Quality | B | Preset campaigns strong; AI guardrails missing |
| Compliance & Regulatory | C | No content filtering, no state-specific logic, PA/MA violations |
| Strategic Value & Demo Readiness | A- | Genuinely differentiated; numbers need scaling fix |

---

## Critical Issues (Blocks Demo Credibility)

### CRIT-1: No AI Content Compliance Filter [Compliance Agent]

**Risk: RED** | **Files:** `gemini.js` (systemic), `NexusLanding.jsx:63-99`

There is zero post-generation content filtering anywhere in the codebase. AI-generated content goes directly from the Gemini API response to the user interface with no check for prohibited terms ("cure", "treat", "heal", "safe", "harmless", "no side effects"). The `MARKETING_CAMPAIGN_SYSTEM` prompt (gemini.js:126-215) contains no instructions prohibiting health claims. The landing page generates testimonials at temperature 0.9 with no compliance constraints.

**Fix:** Add a `complianceScan()` function that runs on all AI-generated customer-facing text before rendering. Add explicit prohibitions to all AI system prompts. Lower landing page temperature from 0.9 to 0.6.

```javascript
const PROHIBITED_TERMS = [
  /\bcure[sd]?\b/i, /\btreat[s]?\b/i, /\bheal[s]?\b/i,
  /\bsafe\b/i, /\bharmless\b/i, /\bno side effects\b/i,
  /\ball.?natural\b/i, /\borganic\b/i, /\btherapeutic\b/i
];
```

---

### CRIT-2: Pennsylvania Medical-Only Violation [Compliance Agent]

**Risk: RED** | **Files:** `gemini.js:214`, `mockData.js:55-59`, `MarketingCampaigns.jsx`

PA operates a medical-only cannabis program. The prototype treats PA locations (Cranberry, Monaca, Scranton, Wayne, Whitehall) identically to adult-use states. Recreational brand marketing campaigns like "15% off all Jeeter products" are broadcast to PA locations. PA regulations prohibit advertising cannabis products to the general public.

**Fix:** Add state-type metadata to locations (`{ type: 'medical' | 'adult-use' }`). Filter PA locations from recreational campaigns. Create PA-specific patient-focused templates. Add to `MARKETING_CAMPAIGN_SYSTEM`: "For PA locations, all messaging must be patient-focused."

---

### CRIT-3: Massachusetts CCC Compliance Failures [Compliance Agent]

**Risk: RED** | **Files:** `MarketingCampaigns.jsx`, `NexusLanding.jsx:45`

MA has the strictest rules of all 7 states. Issues: lifestyle-oriented brand marketing that MA prohibits, no required health warnings, no actual 21+ audience verification (hardcoded "pass"), and a testimonial attributed to "Priya Patel, Ascend Wellness, MA" on the landing page.

**Fix:** Add MA-specific content filters, require CCC health warning in campaigns targeting MA locations, implement actual age verification logic, gate MA-attributed testimonials behind age verification.

---

### CRIT-4: Brand Catalog Mismatch [Ops Manager]

**Risk: HIGH** | **Files:** `PricingAgent.jsx:37-45`, `ConnectAgent.jsx:50-132`, `gemini.js:213`

The operational agents (Pricing, Connect) use California/multi-state brands (Jeeter, STIIIZY, Cookies, Alien Labs, Raw Garden, Kiva, Wyld, PLUS) that are NOT available in Ascend's actual markets (IL, MD, MA, MI, NJ, OH, PA). Meanwhile, the sentiment data correctly uses Ascend's real brands (Ozone, Ozone Reserve, Simply Herb, Common Goods, Tunnel Vision). Any Ascend operations person would immediately say "we don't carry half of these."

**Fix:** Replace the agent brand catalogs with brands available in Ascend's operating states, or make brand catalogs configurable per operator. At minimum, reconcile with the brands already in `mockData.js`.

---

## High-Impact Improvements

### HIGH-1: Add Error Boundary Around Routes [Architect]

**File:** `App.jsx:67-84` | **Effort:** 5 min

If any page component throws during render (e.g., bad data from Gemini causes `.map()` on undefined), the entire app crashes to a white screen. Adding a simple React error boundary prevents embarrassing crashes during live demos.

```jsx
<ErrorBoundary FallbackComponent={FallbackComponent}>
  <Routes>...</Routes>
</ErrorBoundary>
```

---

### HIGH-2: Fix CampaignPlan Stale State on Re-generation [Architect]

**File:** `MarketingCampaigns.jsx:592` | **Effort:** 1 min

The `CampaignPlan` component initializes state from props on mount. If the parent passes new campaign data (generating a second AI campaign), the plan shows stale data from the first generation.

**Fix:** Add a `key` prop: `<CampaignPlan key={campaignData.title} data={campaignData} />`

---

### HIGH-3: Revenue Numbers Don't Scale to 39 Locations [Executive]

**Files:** `NexusHome.jsx:56-63` | **Effort:** 30 min

Today's sales: $47,820 across 39 locations = ~$1,226/store/day. Ascend's actual average is ~$4.2M/store/year (~$11,500/day). The prototype is running at about 9% of actual revenue. A CTO would catch this in the first 5 minutes.

**Fix:** Scale all revenue figures by ~10x, or set the dashboard context to show a single region/state rather than the full portfolio.

---

### HIGH-4: Add State-Specific Disclaimers [Compliance]

**Files:** `gemini.js:291`, `MarketingCampaigns.jsx:101,217,293` | **Effort:** 45 min

Campaigns include "Must be 21+" but omit state-specific warnings. No "Keep out of reach of children" (required in IL, NJ, MA), no Michigan license number, no MA health warning, no PA patient-only language.

**Fix:** Build a disclaimer matrix keyed by state. The normalizer function should append state-specific disclaimers based on `locationTargeting` data.

---

### HIGH-5: Role-Based Dashboard Views [Executive]

**File:** `NexusHome.jsx` (2,064 lines) | **Effort:** 2-3 hours

The NexusHome renders 11 tiles with enormous information density. Store managers won't scroll past the third tile. Need role-based views: COO sees portfolio, Regional Manager sees their region, Store Manager sees their location's 3 most critical metrics.

**Fix:** Add a role selector (COO / Regional / Store) that shows/hides tiles and adjusts data scope.

---

### HIGH-6: Sentiment-to-Campaign Pipeline [Marketing Director]

**Effort:** 2-3 hours

The sentiment analytics identify problems (e.g., Morenci wait time complaints) but there's no workflow to automatically draft a response campaign. Connecting the sentiment pipeline to the marketing agent ("We heard you — shorter wait times at Morenci") would be the single most compelling cross-agent demo flow.

---

### HIGH-7: THC Percentage Guardrails for AI [Compliance]

**Files:** `gemini.js:185` | **Effort:** 15 min

The AI system prompt includes `thc` as a field but provides no guidance on realistic ranges. The AI could generate `thc: '99%'` for flower.

**Fix:** Add to `MARKETING_CAMPAIGN_SYSTEM`: "THC percentages must be realistic: Flower 15-35%, Infused Pre-Rolls 30-50%, Edibles 5-100mg per piece, Vape Carts 60-95%, Concentrates 60-95%."

---

## Quick Wins (< 30 minutes each)

### QW-1: Add `sendingRef` Guard to Agent Chat [Architect]
**Effort:** ~5 min | **Files:** All agent pages

Prevent double-click duplicate messages in chat by adding a ref guard to all `handleSend` functions.

---

### QW-2: Add `aria-label` to CX Floating Button [Architect]
**Effort:** ~2 min | **File:** `App.jsx:120`

The CX button and close button lack screen reader labels. Quick accessibility win.

---

### QW-3: Fix Loyalty Member Count [Ops Manager]
**Effort:** ~2 min | **File:** `NexusHome.jsx:75`

Active loyalty members: 18,420 across 39 stores = 472/store. A well-run program has 3,000-5,000 per location. Should be 120,000-150,000.

---

### QW-4: Fix BOGO Edibles Redemption Count [Ops Manager]
**Effort:** ~2 min | **File:** `PricingAgent.jsx:61`

156 BOGO redemptions across 39 stores = 4 per store. Laughably low. Should be 10-15x that number.

---

### QW-5: Fix SMS Cost Per Message [Marketing Director]
**Effort:** ~2 min | **Files:** `MarketingCampaigns.jsx:85, gemini.js:267`

$0.015/msg is below cannabis industry rates ($0.02-0.03/msg due to carrier surcharges). Update to $0.025/msg for credibility.

---

### QW-6: Fix NPS Score Presentation [Ops Manager]
**Effort:** ~5 min | **File:** `NexusHome.jsx:111`

NPS of 34 is presented with a green upward arrow as if it's good. For cannabis retail, 34 is mediocre. Either raise the mock NPS to 42+ or change the indicator to yellow/neutral.

---

### QW-7: Remove "Deep Muscle Relief" Therapeutic Claim [Compliance]
**Effort:** ~1 min | **File:** `ConnectAgent.jsx:222`

"Award-winning topical for deep muscle relief" is a therapeutic claim. Change to "premium topical application."

---

### QW-8: Add "Demo Data" Disclaimer to Landing Page Testimonials [Compliance]
**Effort:** ~5 min | **File:** `NexusLanding.jsx:43-46`

Testimonials attribute specific claims to named fictional individuals at real Ascend locations. Add a visible "(Demo data — not real testimonials)" tag or use anonymized case study format.

---

### QW-9: Move SMS Opt-Out Into Primary Message Body [Compliance]
**Effort:** ~5 min | **File:** `MarketingCampaigns.jsx:104-107`

"Reply STOP to opt out" is in a separate SMS bubble. Append it to the primary message body instead.

---

### QW-10: Add Brand Voice Configuration to AI Prompts [Marketing Director]
**Effort:** ~15 min | **File:** `gemini.js:126`

The AI system prompts have no brand voice guide. Add: "Ascend's brand voice is: approachable, knowledgeable, never condescending. Never use slang like 'dank' or 'lit'. Professional but not corporate."

---

## Future Considerations

### FC-1: METRC Integration [Ops Manager]
Add compliance/track-and-trace status to the dashboard. Even just "Last METRC sync: 2 hours ago, 3 discrepancies" would show understanding of dispensary operations. This is the single biggest credibility gap with dispensary operators.

### FC-2: Inter-Store Inventory Transfers [Ops Manager]
The Connect Agent should suggest transfers between locations before reordering. "Logan Square has 24 excess units of Ozone Cake Mints — transfer 12 to Fort Lee" is how multi-store ops actually handle stockouts.

### FC-3: State Tax Calculations [Ops Manager]
Illinois has THC-potency-based tax structure. The pricing agent doesn't account for this. "Your Price $35 vs Market Avg $33" is meaningless without knowing pre-tax vs post-tax.

### FC-4: Cash Reconciliation Visibility [Ops Manager]
Cannabis is still largely cash. $47K/day across 39 stores means managing tens of thousands in physical cash daily. No mention anywhere.

### FC-5: Purchase Limit Tracking [Ops Manager]
IL recreational: 30g flower, 5g concentrate, 500mg edibles. This is a compliance-critical workflow invisible in the prototype.

### FC-6: Seasonal Campaign Calendar [Marketing Director]
The AI should proactively suggest campaigns based on the current date — 4/20, Green Wednesday, summer beverages, holiday gifting, back-to-school edibles.

### FC-7: Full Location Support [Marketing Director]
Location targeting (MarketingCampaigns.jsx:173-178) hardcodes 4 locations. Pull from the actual 39-store list in mockData.js.

### FC-8: Lazy Loading Routes [Architect]
All 15+ page components are eagerly imported. For demo performance on slower connections, use `React.lazy()` with Suspense.

### FC-9: YoY Trend Lines [Executive]
The board wants trajectory, not snapshots. Add quarter-over-quarter trend lines to every KPI for investor presentation readiness.

### FC-10: 90-Day Implementation Roadmap [Executive]
For the demo to convert to a contract, stakeholders need a visible path from prototype to production with specific milestones.

---

## Implementation Priority Matrix

| Priority | Item | Effort | Impact | Agent |
|----------|------|--------|--------|-------|
| **P0** | CRIT-1: AI Content Compliance Filter | 1-2 hrs | Prevents regulatory action | Compliance |
| **P0** | CRIT-2: PA Medical-Only Fix | 1 hr | Prevents licensing risk | Compliance |
| **P0** | CRIT-3: MA CCC Compliance | 1 hr | Prevents enforcement action | Compliance |
| **P0** | CRIT-4: Brand Catalog Reconciliation | 2 hrs | Prevents instant loss of credibility | Ops Manager |
| **P1** | HIGH-1: Error Boundary | 5 min | Prevents white-screen crash | Architect |
| **P1** | HIGH-2: CampaignPlan Stale State | 1 min | Prevents stale data on re-gen | Architect |
| **P1** | HIGH-3: Revenue Number Scaling | 30 min | Prevents CTO catching bad math | Executive |
| **P1** | HIGH-7: THC % Guardrails | 15 min | Prevents absurd AI claims | Compliance |
| **P1** | QW-3 through QW-10 (batch) | 45 min | Polish & credibility | All |
| **P2** | HIGH-4: State-Specific Disclaimers | 45 min | Full compliance coverage | Compliance |
| **P2** | HIGH-5: Role-Based Views | 2-3 hrs | Improves demo for different audiences | Executive |
| **P2** | HIGH-6: Sentiment-to-Campaign Pipeline | 2-3 hrs | Best cross-agent demo flow | Marketing |
| **P3** | FC-1 through FC-10 | Days | Long-term product roadmap | All |

---

## Appendix: Agent Profiles

| Agent | Persona | Focus Area |
|-------|---------|------------|
| Architect | Senior Frontend Engineer | Code quality, React patterns, performance, a11y, error resilience |
| Ops Manager | "Jordan" — 6yr cannabis retail vet, manages 3 IL locations | Data accuracy, workflow relevance, credibility |
| Marketing Director | "Aaliyah" — VP Marketing, $180K/mo spend, 42K SMS subs | Campaign quality, brand voice, metrics realism |
| Compliance Expert | "David" — Former state regulator, 15yr compliance, 7-state coverage | State-specific advertising rules, disclaimers, health claims |
| Executive | "Maria" — COO, $180M P&L, 39+ locations, board presenter | Strategic value, ROI, demo credibility, competitive positioning |

---

*Generated by Dutchie Nexus Dev Review Agent Cluster — March 8, 2026*
