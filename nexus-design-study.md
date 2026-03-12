# Dutchie Nexus Design Study

**Author:** Ren Matsuda, VP of Design
**Date:** March 8, 2026
**Scope:** Comprehensive design review of the Dutchie Nexus prototype — product UI (9 pages), marketing landing page, agent interfaces, and information architecture.
**Evaluation Framework:** Agent-First Design Principles, Progressive Complexity (Layer 0-3), Cannabis Operator Constraints, Polaris/Toast/ServiceTitan patterns.

---

## Executive Summary

The Dutchie Nexus prototype demonstrates strong foundational design: a coherent dark theme, rich data density on the command center, a well-structured agent showcase on the landing page, and genuinely useful AI-powered suggestions throughout. The team has built something that feels like real vertical SaaS, not a demo. The sentiment pipeline, omnichannel data collection, and sales reporting tiles on NexusHome are particularly impressive in their depth.

However, the prototype has five structural design problems that will limit adoption across Ascend's user spectrum:

1. **The navigation is organized by system architecture, not user mental model.** "Command Center / Dutchie Agents / Analytics" maps to how the engineering team thinks, not how a dispensary operator thinks. Operators ask "How are my stores doing?" and "What should I reorder?" — they don't categorize their needs into "Agents" vs "Analytics."

2. **There is no unified agent status view.** The four agents are siloed behind individual nav links. A VP managing 39 locations cannot glance at a single surface to see what all agents are doing, what they've accomplished, or what needs approval.

3. **The agents are chat-first when they should be task-first.** Three of four agents (Marketing, Connect, Pricing) lead with a chat input and suggestion cards. This is the right direction, but the suggestion cards are doing the heavy lifting — the chat box should be the escape hatch, not the primary affordance.

4. **NexusHome is data-rich but action-poor.** The command center has 8+ tiles with deep data, but the path from "I see a problem" to "I'm fixing it" requires navigating away. The "Execute" buttons on AI suggestions are the right pattern but aren't wired to workflows.

5. **Mobile readiness is not present.** The grid layouts, small text sizes (10-11px), and hover-dependent interactions mean this product is unusable on the phones and tablets that budtenders and store managers actually carry.

The following study details every finding, organized by evaluation domain, with concrete recommendations for each issue.

---

## Part 1: Product UI Design Assessment

### 1.1 Information Architecture

#### Current State

The sidebar navigation (`Sidebar.jsx`) organizes content into four groups:

```
COMMAND CENTER
  - Nexus Home
  - Pricing Tool

DUTCHIE AGENTS
  - Marketing Campaigns
  - Connect
  - Pricing Agent
  - Customer Bridge

ANALYTICS
  - Overview
  - Brand Analysis
  - Location Insights
  - Review Explorer
  - Competitive Insights

(footer links)
  - Customer Portal
  - Nexus Website
  - Team Chat
```

**Problem:** This is a system-architecture taxonomy. The engineering team built four agents and an analytics suite, so the nav reflects that structure. But operators don't think in terms of "agents" vs "analytics." They think in tasks and questions:

- "How are my stores doing?" (needs NexusHome + Overview + Location Insights)
- "What should I reorder?" (needs Connect Agent + Inventory tile on NexusHome)
- "Are my prices competitive?" (needs Pricing Agent + Pricing Tool -- wait, those are in different nav groups)
- "How are customers feeling?" (needs Sentiment tile on NexusHome + Review Explorer + Overview)

**Critical finding:** "Pricing Tool" lives under "Command Center" while "Pricing Agent" lives under "Dutchie Agents." These are the same domain split across two nav sections. A store manager looking at pricing will not understand why there are two separate destinations.

#### Recommended State

Reorganize navigation by operator mental model:

```
MY STORES
  - Command Center (NexusHome)
  - Store Performance (current Location Insights)

CUSTOMERS
  - Sentiment & Reviews (merged Overview + Review Explorer)
  - Brand Perception (current Brand Analysis)
  - Competitive Intel

OPERATIONS
  - Inventory & Reordering (Connect Agent)
  - Pricing & Margins (merged Pricing Tool + Pricing Agent)
  - Marketing Campaigns

HELP
  - Customer Bridge (support agent)
  - Team Chat
```

**Principle violated:** Information Architecture Principle #1 — navigation should match user mental models, not system architecture. Reference: ServiceTitan's role-based views, where dispatchers see dispatch and owners see P&L.

**Additional recommendation:** The Pricing Tool (`/pricing`) and Pricing Agent (`/agents/pricing`) should be a single destination. Having two routes for the same domain creates confusion. Route `/pricing` should be the landing view; the agent's chat/suggestion interface should be accessible within that same page, not as a separate navigation destination.

---

### 1.2 Agent Visibility

#### Current State

There is no unified agent status panel. Each agent lives behind its own sidebar link. NexusHome has tiles for Inventory, Pricing, Sentiment, Sales, Loyalty, Brand, Voice AI, Omnichannel Collection, and Unified Pipeline — but none of these are "agent status" views. They show data about domains, not about what the agents are doing or have done.

The closest thing to agent visibility is the "AI-Powered Suggestions" section at the bottom of the Sentiment tile, which shows 5 prioritized suggestions with "Execute" buttons. This is the right pattern but it's buried inside one tile, not elevated as a cross-agent feature.

#### Recommended State

Add an **Agent Activity Panel** to NexusHome — a persistent, glanceable component (Layer 0/1) that shows:

```
AGENT STATUS BAR (top of NexusHome, always visible)
  [Marketing Agent]  Idle — Last: Generated Jeeter campaign (2h ago)
  [Connect Agent]    Working — Analyzing reorder needs for 3 low-stock SKUs
  [Pricing Agent]    3 recommendations ready — $4,200/mo margin opportunity
  [Customer Bridge]  Active — 12 tickets resolved today

  [View All Activity] button → full activity log with timestamps
```

Each agent line should use the named Agentic UX pattern "Overview Panel" — status is glanceable (Layer 0), clicking expands to recent activity (Layer 1), and the full activity log is Layer 2.

**Principle violated:** Agent Visibility (persona evaluation criterion #2) and the "Overview Panel" named pattern. Users should never have to visit four separate pages to understand what their AI workforce is doing.

---

### 1.3 Progressive Complexity

#### Current State

NexusHome is the best example of progressive complexity in the prototype. The tile layout provides:

- **Layer 0 (Glanceable):** Tile headers with key numbers (Today's Sales: $47,820, Sentiment: 68, Low Stock: 7 alerts)
- **Layer 1 (Scannable):** Expanding tiles with topic breakdowns, location scores, channel stats
- **Layer 2 (Actionable):** AI suggestions with "Execute" buttons, "Draft Reorder" actions
- **Layer 3 (Explorable):** Deep-dive buttons that link to full agent pages

This is well-executed. However, the individual agent pages (Marketing, Connect, Pricing) do NOT follow this layered approach. They jump directly to Layer 2-3 density — full campaign plans, product tables, scatter plots — without a Layer 0/1 entry point.

**Specific gap:** When a budtender navigates to Marketing Campaigns, they see a list of campaign suggestion cards (jeeter, winback, birthday) and a chat input. There is no "here's what your marketing is doing right now" summary. No active campaigns, no performance of recent campaigns, no "your SMS open rate this week is 94%." It's a blank canvas waiting for input, not an intelligent surface showing state.

#### Recommended State

Every agent page should open with a Layer 0/1 summary before offering Layer 2/3 interactions:

**Marketing Campaigns page — add at top:**
```
MARKETING AT A GLANCE
  Active Campaigns: 2 (Jeeter Brand Spotlight, Birthday Rewards)
  This Week: 9,200 SMS sent, 94% open rate, $18,400 projected revenue
  Ready for Review: 1 campaign draft (Win-Back Re-Engagement)
  Compliance: All active campaigns passing [green checkmarks]
```

**Connect Agent page — add at top:**
```
INVENTORY AT A GLANCE
  Stock Health: 32/39 stores fully stocked
  Urgent: 3 SKUs at stockout risk [red]
  Pending POs: 1 draft ready for approval ($2,847)
  Last reorder: 2 days ago — all items received
```

**Pricing Agent page — add at top:**
```
PRICING AT A GLANCE
  Your avg price gap: +6% above market
  Opportunity: $4,200/mo in margin from 3 product adjustments
  Active promotions: 5 (2 underperforming, consider killing)
  Last price change: 5 days ago — Wyld gummies +$1
```

**Principle violated:** Progressive Complexity Layer 0/1 (persona principle #2). Agent pages assume the user wants to take action immediately. Most of the time, the user wants to check status first.

---

### 1.4 Mobile Readiness

#### Current State

The prototype is not mobile-ready. Specific issues:

1. **Text sizes:** Extensive use of `text-[10px]`, `text-[11px]`, and `text-xs` (12px). On mobile, 10-11px text is unreadable without zooming. The WCAG minimum for body text is 16px; for secondary text, 14px is the floor.

2. **Grid layouts:** NexusHome uses `grid-cols-4` for the Contextualized Insights tile and `lg:grid-cols-2` throughout. On mobile, these collapse to single-column, which means the page becomes extremely long — scrolling past 8+ full-width tiles to find what you need.

3. **Touch targets:** The tab buttons in Omnichannel Sentiment Collection (`py-3 px-3`) are borderline at approximately 36px tall — below the 44px minimum for touch. The agent suggestion cards on Pricing Agent are similarly small.

4. **Hover interactions:** The Pricing tile's scatter plot has `hover:bg-[#1C2128]` as the only affordance that it's clickable. On touch devices, hover states don't exist. The NexusTile component uses `hover:border-[#484F58]` for interactive feedback — invisible on mobile.

5. **Data tables:** The Market Price Comparison view in PricingAgent renders a full HTML table with 6 columns. On mobile, this requires horizontal scrolling, which is a usability failure for one-handed operation.

6. **Sidebar:** The sidebar is `w-64` (256px) fixed. On mobile, this covers most of the screen. There is a close button for mobile (`lg:hidden`), which is correct, but the sidebar content itself has no mobile-specific adaptations.

#### Recommended State

**Immediate (P0):**
- Minimum text size of 14px for any content that isn't a decorative label
- All interactive elements must be minimum 44x44px touch targets
- Replace hover-only interactive feedback with visible affordances (borders, chevrons, "Tap to explore" labels)
- Data tables must stack into card layouts on mobile (< 640px)

**Short-term (P1):**
- NexusHome on mobile: show only the 3 most critical tiles by default (Sales, Sentiment, Inventory), with a "Show all tiles" expansion. This prevents the infinite-scroll problem.
- Agent pages on mobile: the Layer 0/1 summary (recommended above) becomes the primary view. Layer 2/3 content is behind a "Take Action" button.
- Bottom tab bar for mobile nav (replacing sidebar): Home / Inventory / Marketing / Pricing / Help — 5 tabs, thumb-reachable

**Principle violated:** Cannabis Operator Design Constraint #2 — "Mobile-first is not optional; budtenders and managers are standing, not sitting at desks." Also violates the "7pm Friday test" — a stressed manager with one hand on a POS terminal cannot use this interface.

---

### 1.5 Compliance Confidence

#### Current State

Compliance handling is mixed:

**Good — Marketing Campaigns:** The `CampaignPlan` component includes a dedicated compliance section with 5-6 checklist items, each with pass/fail status and green checkmarks. This is excellent. The items are specific: "Age gate verified (21+)," "State cannabis advertising rules," "Opt-in consent validated." This is the gold standard for compliance visibility in the prototype.

**Good — Landing Page:** The compliance section on `NexusLanding.jsx` has three clear pillars: State-Specific Rules, You Review/You Approve, Seed-to-Sale Integrated. The "AI recommends, you decide" messaging is strong.

**Missing — Pricing Agent:** When the Pricing Agent recommends price changes, there is no compliance check visible. Cannabis pricing is regulated in many states (maximum markup rules, minimum pricing in some markets). The "Change Prices" and "Create Discount" views show no compliance validation.

**Missing — Connect Agent:** Purchase orders generated by the Connect Agent show no compliance signals. In cannabis, purchase orders must comply with seed-to-sale tracking (METRC/BioTrack). The reorder view shows product details, quantities, and costs — but nothing about whether the order will be accepted by the state tracking system.

**Missing — NexusHome:** The AI-Powered Suggestions in the Sentiment tile recommend actions like "add 2 afternoon staff" and "speech recognition model needs tuning" — these have no compliance implications. But the suggestion to "prompt happy SMS respondents to leave public reviews" should have a compliance note about state-specific review solicitation rules.

#### Recommended State

Every agent action that touches regulated activity must include a compliance badge:

```
Pricing Agent — Change Price action:
  [shield icon] Compliance Check
  - [green] Price within state maximum markup (IL: no cap)
  - [green] No minimum price violation (IL: $1 minimum)
  - [green] Tax calculation updated automatically
  - [yellow] Note: Price change will be reported in next METRC sync

Connect Agent — Reorder action:
  [shield icon] Compliance Check
  - [green] Vendor is licensed in IL
  - [green] Order quantity within daily receiving limit
  - [green] Products match approved manifest categories
  - [info] METRC transfer manifest will be auto-generated on receipt
```

Use the "Powered by Compliance Engine" badge pattern (from ServiceTitan's "Powered by Titan Intelligence") to create a consistent compliance identity across all agent actions. The badge should be visible without clicking — it's Layer 0 information.

**Principle violated:** Cannabis Operator Design Constraint #4 — "Any action that touches compliance must show explicit confirmation of compliance status." Compliance is the #1 anxiety for cannabis operators; hiding it creates distrust in the AI.

---

### 1.6 Cognitive Load

#### Current State

**NexusHome** is the most complex page. Let me count the competing elements:

1. Contextualized Insights tile (4 metrics + progress bar + top store + traffic + needs attention)
2. Sales Reporting tile (4 KPIs + 4 tabs + chart + period selector + chart metric selector)
3. Consumer Sentiment tile (score gauge + NPS + review volume bar + source breakdown + 6 topic bars + 4 location cards + 5 AI suggestions with execute buttons)
4. Omnichannel Sentiment Collection tile (4 channel tabs + live conversation feed + channel stats + AI insights)
5. Unified Sentiment Pipeline tile (unified score + first-party/third-party breakdown + 9 channel rows + 2 divergence cards + key insight)
6. Voice AI tile (5 stat rows + AI insight)
7. Inventory tile (stockout risk count + 3 product alerts)
8. Loyalty tile (3 stat rows + at-risk customer alert)
9. Pricing tile (scatter plot + market gap + discount waste)
10. Brand tile (3 stat rows + opportunity insight)
11. Customer Bridge (embedded chat widget, always visible)

That is **11 tiles** competing for attention on a single page. Even with the 2-column grid layout, this requires significant scrolling. The visual hierarchy is somewhat flat — most tiles use the same card style, same header pattern, same text sizes. The eye doesn't know where to land first.

**Positive note:** The use of colored icon backgrounds (green, orange, purple, blue) provides some visual grouping. The "Needs Attention" red highlight in the Contextualized Insights tile is effective at drawing the eye. The AI Insight boxes with their subtle tinted backgrounds create a recognizable pattern.

#### Recommended State

**Reduce NexusHome to 6 tiles maximum in the default view:**

Priority 1 (always visible):
1. **Agent Status Bar** (new — see 1.2 above)
2. **Sales Today / This Week** (current Contextualized Insights, simplified)
3. **Needs Attention** (elevated from within tiles — a unified alert feed combining inventory alerts, sentiment drops, pricing opportunities, agent items needing approval)
4. **Sentiment Score** (simplified — just the gauge, NPS, and top negative topic)

Priority 2 (collapsed by default, expand on click):
5. **Sales Reporting** (full version with tabs)
6. **Omnichannel Collection** (with channel tabs)

Everything else (Voice AI, Brand, Loyalty, Pricing scatter, Unified Pipeline) should be accessible via the individual agent/analytics pages, not duplicated on the home screen.

**The key insight:** NexusHome should answer "what needs my attention right now?" and "is the business healthy?" — it should NOT try to be a complete analytics dashboard. That's what the Analytics section is for.

**Principle violated:** Cognitive Load — Toast's "scannable dashboards" principle. Toast reports provide a scannable overview of the metrics operators care about — no drill-down required for the 80% case. NexusHome currently requires the user to process 50+ metrics to get the same clarity.

---

### 1.7 Consistency

#### Current State

Overall consistency is good. The design system is mostly coherent:

- **Cards:** `rounded-2xl border border-[#30363D] bg-[#161B22]` used consistently across NexusHome tiles, agent pages, and analytics
- **Colors:** Brand green `#00C27C`, accent purple `#A371F7`, blue `#58A6FF`, gold `#D29922`, red `#F85149` used consistently
- **Typography:** Inter font, consistent heading hierarchy
- **Tile headers:** The `TileHeader` component on NexusHome provides a consistent pattern with icon, title, subtitle, and action button

**Inconsistencies found:**

1. **Overview page (`Overview.jsx`) uses a different card pattern** than NexusHome. It uses `MetricCard`, `DonutChart`, `TrendChart`, and `HorizontalBarChart` components that were clearly built earlier in the project's life. These use `bg-[#161B22] rounded-xl shadow-sm border border-[#30363D]` — close but not identical to NexusHome's `rounded-2xl`. The `SectionHeader` component on Overview uses a different header pattern than `TileHeader` on NexusHome.

2. **ReviewExplorer uses `rounded-full` chips** for filter toggles, while the agent pages use `rounded-lg` for similar toggle elements. The filter UX pattern differs: ReviewExplorer has inline toggle chips, while NexusHome's Sales Reporting tile uses a segmented button control for period selection.

3. **Agent page entry patterns differ:**
   - Marketing Campaigns: shows 3 campaign cards + a chat input with suggestion pills at the bottom
   - Connect Agent: shows suggestion cards in a grid + chat input
   - Pricing Agent: shows 6 suggestion cards in a 2x3 grid + chat input
   - Customer Bridge: full chat interface with sidebar knowledge base

   Each agent has a slightly different layout for what is essentially the same pattern: "here are things you can do, or type something." These should use a shared `AgentShell` component.

4. **Color inconsistency in the Overview page:** The green color is `#00C389` (in `SectionHeader`) vs `#00C27C` (everywhere else). Small but noticeable.

5. **NexusHome's Sidebar link structure:** "Pricing Tool" at `/pricing` and "Pricing Agent" at `/agents/pricing` are separate entries. From the user's perspective, these should be one thing.

#### Recommended State

- Standardize on `rounded-2xl` for all card containers (currently mixed `rounded-xl` and `rounded-2xl`)
- Create a shared `AgentShell` component that all four agents use: Layer 0/1 summary at top, suggestion grid in the middle, chat input as a collapsible footer
- Fix the Overview page's green color from `#00C389` to `#00C27C`
- Ensure all filter/toggle patterns use the same chip component
- Merge Pricing Tool and Pricing Agent into a single navigation destination

**Principle violated:** Consistency (Polaris principle — "be a cohesive ecosystem"). When each page feels like it was designed by a different person, users lose confidence in the product's reliability.

---

## Part 2: Marketing Site Design Assessment (NexusLanding.jsx)

### 2.1 Visual Narrative Flow

#### Current State

The page follows a clear top-to-bottom structure:

```
1. Hero (headline + CTA)
2. Pillars (Understand > Automate > Grow)
3. Agent Showcase (4 agents with alternating layout)
4. Compliance Section (3 cards)
5. Stats (6 platform metrics)
6. Testimonials (3 cards)
7. CTA (closing headline + button)
8. Privacy footer
```

This is a solid narrative arc: problem context (hero) -> solution framework (pillars) -> how it works (agents) -> trust and differentiation (compliance) -> scale proof (stats) -> social proof (testimonials) -> action (CTA).

**What works well:** The "Understand. Automate. Grow." framework in the pillars section creates a memorable three-act structure. The compliance section placed after agents is smart — it addresses the "but is it safe?" objection immediately after showing what the AI can do.

**What could be stronger:** The hero-to-pillars transition is abrupt. There's no visual bridge connecting the hero's promise to the pillars' specifics. The stats section feels like a separate page — it's the same grid layout as the pillars but with different content, creating visual monotony.

### 2.2 Product Visibility

#### Current State

**This is a significant weakness.** The Agent Showcase section displays each agent as a card with a large, faded icon and the agent name in the agent's brand color. There is no screenshot, no video, no interactive demo, no product UI visible anywhere on the page.

```jsx
// Current: abstract placeholder
<div className="relative flex items-center justify-center h-48">
  <Icon className="w-20 h-20 opacity-20" style={{ color: agent.color }} />
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl font-bold" style={{ color: agent.color }}>{agent.name.split(' ')[0]}</div>
      <div className="text-sm text-[#8B949E] mt-1">AI Agent</div>
    </div>
  </div>
</div>
```

A cannabis operator evaluating this product will see abstract icons and marketing copy, but no evidence that the product actually exists. The right side of each agent showcase is a decorative placeholder where a product screenshot should be.

#### Recommended State

Replace each agent's abstract icon placeholder with an actual screenshot or interactive preview of that agent's output:

- **Marketing Agent:** Show the CampaignPlan view with the Jeeter campaign — the compliance checkmarks, the SMS phone mockup, the revenue projections. This is visually rich content that already exists in the prototype.
- **Connect Agent:** Show the reorder view with the out-of-stock product cards, urgency badges, and the order summary.
- **Pricing Agent:** Show the scatter plot from the Pricing tile — it's distinctive and immediately communicates "market price comparison."
- **Customer Bridge:** Show the chat interface with a sample conversation and the knowledge base sidebar.

These don't need to be interactive — static screenshots with a subtle border glow in the agent's brand color would be powerful. The prototype has compelling UI; the marketing page should show it.

**Principle violated:** Product Visibility — "Is the actual product shown or just abstract icons?" Abstract graphics reduce buyer confidence. Showing real product UI at the point of interest (right next to the feature description) is a proven SaaS conversion pattern.

### 2.3 Trust Signal Placement

#### Current State

- **Stats** are placed after the compliance section, far from the hero CTA
- **Testimonials** are placed after stats, far from any CTA
- **The hero badge** ("Powering 6,500+ dispensaries across 40+ markets") is the only trust signal near the primary CTA

**Problem:** The final CTA section at the bottom has a headline, a subheadline, and a button — but no testimonial, no stat, no social proof. The decision moment (clicking "Book a Demo") happens in a trust vacuum.

#### Recommended State

- Move one testimonial (the strongest one, Sarah Chen's "6 hours to 15 minutes") directly above the final CTA section
- Add a row of 3 compact logos/stats between the final CTA headline and the button: `$19B processed | 6,500+ retailers | 40+ markets`
- Add "Trusted by multi-state operators" with 2-3 MSO logos near the hero CTA (below the primary button)

**Principle violated:** Trust Design — "Are trust signals placed at decision-friction points?" Stats and testimonials exist but are positioned for reading, not for decision support.

### 2.4 Scroll Dynamics

#### Current State

Every section uses the same `useInView` hook with `opacity-0 translate-y-8` -> `opacity-100 translate-y-0` animation (700ms). This means every single section fades up from below as it scrolls into view.

**Problem:** When everything animates the same way, nothing stands out. The animation doesn't draw attention to key content — it applies uniformly, making it decorative rather than purposeful. On slower connections or devices, users may see blank sections before the intersection observer triggers.

#### Recommended State

- **Hero:** No animation — content should be immediately visible on page load. Never animate above-the-fold content.
- **Pillars:** Staggered animation — each card fades in 100ms after the previous one, creating a left-to-right cascade
- **Agent Showcase:** Slide in from the side (left for odd, right for even) to match the alternating layout
- **Stats:** Counter animation (numbers tick up from 0 to their final value) instead of a fade — this is more engaging for numerical data
- **Testimonials:** Keep the current fade-up — it works for quotes
- **Final CTA:** No animation — CTAs should be immediately visible when scrolled to

**Principle violated:** Scroll Dynamics — "Are animations purposeful or decorative?" Currently decorative. Each section should have animation that reinforces its content type.

### 2.5 CTA Hierarchy

#### Current State

The hero has two buttons:
1. **Primary:** "Book a Demo" (green bg, white text) — correct
2. **Secondary:** "See It in Action" (border only, scrolls to #agents) — correct

The final CTA has one button:
1. **Primary:** "Book a Demo" (same green style) — correct

**This is well-executed.** There's a clear primary CTA and a clear secondary alternative. The only issue is that "See It in Action" scrolls to the agent showcase, which (as noted in 2.2) shows abstract icons, not the actual product. If the agent showcase showed real product UI, this secondary CTA would be much more effective.

**Additional note:** The hero CTA links to `"/"` (the NexusHome page). In a real marketing site, this would be a Calendly/HubSpot booking link. For the prototype, this is fine — it demonstrates that the CTA takes you into the product.

---

## Part 3: Agent-First Design Assessment

### 3.1 Task-Oriented vs Chat-First

#### Current State

All four agents use a chat-first pattern, but with varying degrees of task orientation:

**Marketing Campaigns** (`MarketingCampaigns.jsx`):
- Entry: 3 pre-built campaign cards (Jeeter, Win-Back, Birthday) displayed above a chat input
- Chat input has no suggestion pills visible initially
- Clicking a campaign card renders the full `CampaignPlan` view — this IS task-oriented
- The chat input allows typing free-form prompts to generate custom campaigns via Gemini AI
- **Assessment:** Hybrid — the campaign cards are task-first, the chat input is chat-first. The campaign cards do most of the work.

**Connect Agent** (`ConnectAgent.jsx`):
- Entry: Suggestion cards in a grid ("Reorder Out-of-Stock Items," "Explore New Products," "Smart Recommendations," etc.)
- Chat input below with suggestion pills
- Clicking suggestion cards renders rich views (ReorderView, ExploreView, RecommendationsView)
- **Assessment:** More task-first than chat-first. The suggestion cards are the primary interaction pattern.

**Pricing Agent** (`PricingAgent.jsx`):
- Entry: 6 suggestion cards in a 2x3 grid ("Market Price Comparison," "Price & Cost Overview," "Discount & Promo Review," "What-If Pricing," "Change Prices," "Create New Discount")
- Chat input below
- Each card renders a dedicated view component
- **Assessment:** The most task-oriented agent. The suggestion cards cover the full scope of pricing operations. Chat is genuinely a fallback.

**Customer Bridge** (`CustomerBridge.jsx`):
- Entry: Full chat interface with knowledge base sidebar
- Intent detection routes queries to specialized views (marketing campaigns, pricing analysis, connect reorder, sentiment dashboards, review feeds, reporting)
- **Assessment:** Appropriately chat-first for a support agent. The intent detection that routes to rich views is the right pattern — it's an orchestration layer, not a simple chatbot.

#### Recommended State

The Pricing Agent has the best pattern. Extend it to Marketing and Connect:

**For all task-oriented agents (Marketing, Connect, Pricing):**
1. **Top:** Layer 0/1 status summary (see section 1.3)
2. **Middle:** Task cards in a grid — these are the primary actions. Each card should show an icon, a label, a one-line description, and (critically) a notification badge if the agent has pending work in that domain.
3. **Bottom:** Chat input as a collapsible "Ask anything" bar — visible but not dominant. It expands to full chat when focused.

**For Customer Bridge (support):**
- Chat-first is correct. The intent detection routing is excellent.
- Add a "Common Questions" sidebar that shows the top 5 questions other operators are asking this week — this creates social proof and reduces the blank-screen problem.

**Principle reference:** Agent-First, Not Chat-First (persona principle #1) — "Chat is a fallback for edge cases, not the primary interaction pattern."

### 3.2 Confidence Signals

#### Current State

**No agent shows confidence signals on its recommendations.** This is a significant gap.

- Marketing Campaigns: Revenue projections show ranges ("$18,400 - $24,200") but no confidence level. Is the agent 90% confident or 50% confident?
- Connect Agent: Reorder quantities are shown as "recommended: 48" but no explanation of confidence. Is this based on 12 months of data or 2 weeks?
- Pricing Agent: Market comparison shows "raise/lower/keep" recommendations with no confidence grading. The gap percentage is shown, but not whether the comparison data is from 5 competitors or 500.
- Customer Bridge: Knowledge base articles are matched but relevance scores are internal — the user doesn't see them.

#### Recommended State

Add confidence signals using the "Confidence-Graded Styling" pattern from the persona:

```
HIGH CONFIDENCE (solid green border, no badge needed):
  "Market Price Comparison: Your Baby Jeeter is $2 above market avg"
  → Based on 147 dispensary prices in your region (updated today)

MEDIUM CONFIDENCE (amber outline, "Review suggested" badge):
  "Reorder recommendation: 48 units of Baby Jeeter Churros"
  → Based on 8 weeks of sales velocity. Confidence: Medium — holiday
    season may affect demand differently.

LOW CONFIDENCE (dashed border, "Needs review" badge):
  "Revenue projection: $18,400 - $24,200"
  → Based on similar campaigns at comparable dispensaries. Wide range
    reflects limited historical data for this specific audience segment.
```

Every AI recommendation should include: (1) the data basis ("based on X data points"), (2) a visual confidence indicator (green/amber/dashed-red), and (3) a one-line rationale accessible on hover or tap.

**Principle violated:** Named pattern "Confidence Signal" and "Explainable Rationale." Without confidence signals, operators cannot make informed decisions about whether to trust AI recommendations.

### 3.3 Intent Preview

#### Current State

**The Marketing Agent has the best intent preview in the product.** When a user selects a campaign, the full `CampaignPlan` view renders with:
- Audience size and segmentation
- Channel reach and costs
- Schedule and follow-up logic
- Content preview (SMS phone mockup, email preview)
- A/B test variants
- Compliance checklist
- Revenue projections

This is displayed BEFORE the user clicks "Launch Campaign." The user reviews the full plan before any action is taken. This is textbook Intent Preview pattern.

**The Pricing Agent partially implements Intent Preview.** The "What-If Pricing" view lets users model scenarios before applying them. However, the "Change Prices" view does not show projected impact before the price is changed — it jumps from "select products and new prices" to "apply."

**The Connect Agent does NOT implement Intent Preview.** The reorder view shows products and quantities, but when the user clicks to confirm a purchase order, there is no preview of what will happen: no delivery timeline, no impact on cash flow, no summary of what the METRC manifest will look like.

#### Recommended State

Every agent action must show a preview step before execution:

**Connect Agent — before PO submission:**
```
REVIEW YOUR ORDER
  5 products | 144 total units | $4,847.00 estimated cost

  Expected delivery: March 12-15
  Cash flow impact: -$4,847 this week
  METRC: Transfer manifest will be auto-generated
  Compliance: All vendors licensed in IL [green]

  [Cancel] [Submit Purchase Order]
```

**Pricing Agent — before price change:**
```
REVIEW PRICE CHANGES
  3 products changing price

  Baby Jeeter Churros: $35 -> $33 (match market avg)
    Projected weekly impact: -$124 revenue, +14 units sold
    Net impact: +$94/week

  [Cancel] [Apply Price Changes]
```

**Principle reference:** Named pattern "Intent Preview" — "Show the agent's plan before execution." This is critical for compliance in cannabis — every operator action may be audited.

### 3.4 Proactive Work Reporting

#### Current State

Agents do not proactively report their work. There is no activity feed, no notification system, and no "agent completed a task" pattern. The AI Insights boxes throughout the product (e.g., "Voice orders have 18% higher AOV than online orders") are static — they don't represent work the agent has done, just pre-written observations.

The closest pattern is the Campaign Plan view, which shows projected outcomes. But this is a plan, not a report of completed work.

#### Recommended State

Implement the "Work Reports" named pattern:

1. **Agent Activity Feed** (on NexusHome, see 1.2): chronological log of agent actions and findings
2. **Push Notifications** (simulated in prototype): "Marketing Agent completed Jeeter campaign analysis. 3 recommendations ready."
3. **Daily Digest** (email/Slack format): "Here's what your agents did today: Marketing drafted 1 campaign. Pricing found $4,200/mo in margin opportunity. Connect flagged 3 stockouts."
4. **In-context updates:** When an agent completes analysis, the relevant tile on NexusHome should animate a notification badge (e.g., Pricing tile shows "3 new" badge).

**Principle reference:** Named pattern "Work Reports" — "Results should appear in dashboards, Slack, email — not just in the agent's UI."

---

## Part 4: Specific Recommendations (Prioritized)

### P0 — Critical (blocks adoption)

#### R1: Merge Pricing Tool and Pricing Agent

**Current state:** Two separate navigation items (`/pricing` and `/agents/pricing`) for the same domain. The Pricing Tool appears to be an earlier version of the Pricing Agent's functionality.

**Recommended state:** Single route at `/pricing`. The landing view is the scatter plot + category overview (from current Pricing Tool). The suggestion cards (from current Pricing Agent) appear as action buttons. Chat is accessible via an expandable bar.

**Principle violated:** Information Architecture — split destinations for the same domain fragment the user's mental model.

#### R2: Add Layer 0/1 summaries to all agent pages

**Current state:** Agent pages open with action affordances (suggestion cards + chat) but no status information.

**Recommended state:** Every agent page opens with a compact status bar showing active items, pending approvals, and key metrics for that domain. See section 1.3 for specifics.

**Principle violated:** Progressive Complexity — users check status more often than they take action.

#### R3: Fix mobile readiness

**Current state:** Minimum 14 items that break on mobile (text sizes, touch targets, hover states, table layouts, grid density).

**Recommended state:** See section 1.4 for the full mobile remediation plan. The single highest-impact change: minimum 14px text, 44px touch targets.

**Principle violated:** Cannabis Operator Constraint #2 — mobile-first is not optional.

### P1 — High Impact (improves adoption and trust)

#### R4: Add Agent Status Panel to NexusHome

**Current state:** No unified view of agent activity.

**Recommended state:** Persistent bar at the top of NexusHome showing all 4 agents' status, last action, and pending items. See section 1.2.

**Principle violated:** Agent Visibility, Overview Panel pattern.

#### R5: Add compliance badges to Pricing and Connect agents

**Current state:** Marketing has compliance checks; Pricing and Connect do not.

**Recommended state:** Every agent action that touches regulated activity shows a compliance checklist. See section 1.5.

**Principle violated:** Cannabis Operator Constraint #4 — compliance anxiety.

#### R6: Add confidence signals to all AI recommendations

**Current state:** No confidence grading on any recommendation.

**Recommended state:** Confidence-graded styling (solid green / amber outline / dashed red) on every AI recommendation, with data basis explanation. See section 3.2.

**Principle violated:** Confidence Signal pattern, Explainable Rationale pattern.

#### R7: Replace abstract agent icons on landing page with product screenshots

**Current state:** Agent showcase shows `h-48` placeholder with faded icon and agent name text.

**Recommended state:** Static screenshots of actual agent UI (campaign plan, reorder view, pricing scatter, chat conversation). See section 2.2.

**Principle violated:** Product Visibility — abstract graphics reduce buyer confidence.

### P2 — Medium Impact (improves experience quality)

#### R8: Reorganize sidebar navigation by user mental model

**Current state:** Command Center / Agents / Analytics taxonomy.

**Recommended state:** My Stores / Customers / Operations / Help taxonomy. See section 1.1.

**Principle violated:** Information Architecture — navigation should match mental models.

#### R9: Reduce NexusHome to 6 primary tiles

**Current state:** 11 tiles competing for attention.

**Recommended state:** 4 always-visible tiles + 2 collapsed tiles + "Show all" expansion. See section 1.6.

**Principle violated:** Cognitive Load — Toast's scannable dashboard principle.

#### R10: Standardize agent page entry patterns with shared AgentShell component

**Current state:** Each agent has a different layout for the same interaction pattern.

**Recommended state:** Shared `AgentShell` component: status summary -> task grid -> collapsible chat. See section 3.1.

**Principle violated:** Consistency — Polaris "cohesive ecosystem" principle.

#### R11: Add Intent Preview to Connect Agent PO submission and Pricing Agent price changes

**Current state:** Marketing has full intent preview; Connect and Pricing do not.

**Recommended state:** Preview step before every agent action showing projected impact, compliance status, and undo pathway. See section 3.3.

**Principle violated:** Intent Preview pattern, Action Audit & Undo pattern.

### P3 — Polish (improves perception)

#### R12: Fix landing page animations

**Current state:** Every section uses identical fade-up animation.

**Recommended state:** Hero: no animation. Stats: counter tick-up. Agent showcase: slide from sides. CTA: no animation. See section 2.4.

#### R13: Add trust signals near final CTA on landing page

**Current state:** Final CTA section has no social proof.

**Recommended state:** One testimonial + compact stat row above the CTA button. See section 2.3.

#### R14: Fix Overview page color inconsistency

**Current state:** `#00C389` used in Overview's SectionHeader.

**Recommended state:** `#00C27C` (brand green) used everywhere.

#### R15: Add proactive work reporting (Agent Activity Feed)

**Current state:** Agents don't report completed work.

**Recommended state:** Activity feed on NexusHome, notification badges on tiles, daily digest format. See section 3.4.

---

## Part 5: What's Working (Keep)

These patterns are strong and should be preserved and extended:

### K1: The CampaignPlan component is a best-in-class agent output
The Marketing Campaign plan view is the single best piece of design in the prototype. It shows audience segmentation, channel strategy, content previews (phone mockup and email mockup), A/B tests, compliance checks, revenue projections, and location targeting — all in a scannable, collapsible layout. **This should be the template for all agent output.** When the Connect Agent generates a PO, it should be this rich. When the Pricing Agent proposes a price change, the output should be this detailed.

### K2: The Omnichannel Sentiment Pipeline is a genuine competitive moat visualization
The concept of merging first-party signals (SMS surveys, kiosk reactions, voice CSAT, QR captures) with third-party signals (Google, Leafly, Weedmaps, Reddit) into a unified score is powerful. The visual distinction between purple (first-party/proprietary) and blue (third-party/scraped) channels makes the value proposition immediately clear. The "Signal Divergences" section showing where first-party and third-party scores disagree is particularly insightful.

### K3: The NexusTile + TileHeader component pattern creates a consistent vocabulary
The consistent card pattern on NexusHome (rounded corners, border, icon header with action button) creates a learnable visual language. Users quickly understand that every tile is a self-contained domain with a "go deeper" action. This pattern should be carried to agent pages.

### K4: The Pricing scatter plot is an effective data visualization
The mini scatter plot comparing "Your Price" vs "Market Price" with color-coded dots (above/at/below market) is immediately comprehensible. It answers "am I priced right?" in a single glance — textbook Layer 0 design. The reference line (y=x) makes the comparison intuitive without labels.

### K5: The AI-generated landing page copy is a smart differentiator
Using Gemini to regenerate marketing copy on each page load (with sensible defaults that display instantly) demonstrates the AI capability directly. The system prompt enforces anti-hype tone, cannabis-specific language, and compliance-as-feature messaging. This is a clever "eat your own cooking" pattern — the marketing page itself is AI-powered.

### K6: The Customer Bridge intent detection is sophisticated
The intent detection system in CustomerBridge routes natural language queries to specialized views (marketing campaigns, pricing analysis, connect reorder, sentiment dashboards, review feeds, reporting). This is genuine orchestration — the Bridge acts as a router to the other three agents. The synonym awareness, stemming, and multi-signal scoring demonstrate real NLP thinking.

### K7: The dark theme is well-executed
The color palette (`#0D1117` bg, `#161B22` cards, `#30363D` borders, `#F0F6FC` text) creates a professional, high-information-density environment that's easy on the eyes during long sessions. The accent colors (green, purple, blue, gold, red) are well-differentiated and used consistently for semantic meaning (green = good/primary, red = alert, gold = warning, blue = informational, purple = AI/first-party).

---

## Part 6: Design Opportunities (Explore)

### O1: Role-Based Default Views (High Impact)

Drawing from ServiceTitan: implement role-based entry points where different users see different default content on NexusHome:

- **Budtender role:** Simplified view showing only their store's performance, today's promotions, and a quick link to Customer Bridge for product questions
- **Store Manager role:** Current NexusHome but filtered to their store, with inventory and staffing emphasis
- **Regional Director role:** Multi-store comparison view, with roll-up metrics across their region
- **VP/COO role:** Full NexusHome with all tiles, cross-market analytics, and strategic AI recommendations

This doesn't require building four separate pages — it's the same components with different default filters and tile visibility.

### O2: Autonomy Dial for Each Agent (Medium Impact)

Let operators set how independently each agent can act:

```
Marketing Agent:  [Suggest Only] ---- [Draft & Hold] ---- [Auto-Send]
Connect Agent:    [Suggest Only] ---- [Draft POs]    ---- [Auto-Order <$500]
Pricing Agent:    [Suggest Only] ---- [Draft Changes] ---- [Auto-Adjust <5%]
Customer Bridge:  [Human Always] ---- [AI First]     ---- [AI Handles All]
```

This addresses the trust spectrum: new users start with "Suggest Only" and graduate to more autonomy as they build confidence.

### O3: State Persistence / Task Resumption (Medium Impact)

Cannabis operators are interrupted every 3-4 minutes. The prototype should save in-progress state:

- If a user is halfway through reviewing a campaign plan and navigates away, the next time they open Marketing Campaigns, they should see "Continue reviewing Jeeter Campaign?" with a one-click resume
- If a user has modified quantities in a Connect Agent reorder but hasn't submitted, those modifications should persist
- URL state encoding: filter selections, tab states, and scroll positions should be reflected in the URL so that browser back/forward works

### O4: "What Just Happened" Daily Briefing (Lower Impact, High Delight)

A morning briefing card at the top of NexusHome:

```
GOOD MORNING — HERE'S YOUR TUESDAY BRIEFING

Yesterday across 39 stores:
  Revenue: $47,820 (+8% vs Monday)     [green]
  Sentiment: 71 (stable)               [neutral]
  3 items flagged for reorder           [amber]
  1 campaign performing above forecast  [green]

Your agents worked overnight:
  - Pricing Agent identified $2,400/mo margin opportunity on edibles
  - Marketing Agent drafted a win-back campaign targeting 4,312 customers
  - Connect Agent detected a STIIIZY supply chain delay (2-day impact)

[Review Agent Work] [Dismiss]
```

This single card replaces the need to scan 11 tiles. It's the ultimate Layer 0.

---

## Appendix: File Reference

| File | Path | Role |
|------|------|------|
| NexusLanding | `/root/workspace/sentiment-analysis/src/pages/NexusLanding.jsx` | Marketing landing page |
| NexusHome | `/root/workspace/sentiment-analysis/src/pages/NexusHome.jsx` | Command center / home dashboard |
| MarketingCampaigns | `/root/workspace/sentiment-analysis/src/pages/MarketingCampaigns.jsx` | Marketing agent |
| ConnectAgent | `/root/workspace/sentiment-analysis/src/pages/ConnectAgent.jsx` | Purchasing/inventory agent |
| PricingAgent | `/root/workspace/sentiment-analysis/src/pages/PricingAgent.jsx` | Pricing agent |
| CustomerBridge | `/root/workspace/sentiment-analysis/src/pages/CustomerBridge.jsx` | Support/orchestration agent |
| Sidebar | `/root/workspace/sentiment-analysis/src/components/layout/Sidebar.jsx` | Navigation sidebar |
| Overview | `/root/workspace/sentiment-analysis/src/pages/Overview.jsx` | Analytics overview |
| ReviewExplorer | `/root/workspace/sentiment-analysis/src/pages/ReviewExplorer.jsx` | Review browsing/filtering |

---

*This design study is a living document. As the prototype evolves, each recommendation should be re-evaluated against real user testing data from Ascend Wellness operators. The prioritization above reflects design judgment; actual sequencing should factor in engineering effort estimates from the Architecture team.*
