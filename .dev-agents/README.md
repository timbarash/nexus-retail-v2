# Dev Review Agents

Multi-agent system for reviewing and improving the Dutchie Nexus prototype. These agents run inside Claude Code sessions — they're development tools, not prototype features.

## Quick Start

### Full Review (Orchestrator dispatches all agents)
Ask Claude: "Run a full prototype review using the agents in `.dev-agents/`. Focus on [specific page/feature]."

### Single Agent Review
Ask Claude: "Review the NexusLanding page as the Dispensary Ops Manager from `.dev-agents/dispensary-ops-manager.md`."

### Targeted Review
Ask Claude: "Have the Compliance Expert from `.dev-agents/compliance-expert.md` review the marketing agent's AI-generated campaigns for state compliance issues."

## Agents

| File | Role | Focus |
|------|------|-------|
| `orchestrator.md` | Lead Orchestrator | Coordinates sub-agents, synthesizes findings, prioritizes action items |
| `architect.md` | Frontend Architect | Code quality, React patterns, performance, a11y, responsive design |
| `dispensary-ops-manager.md` | Jordan (Ops Manager) | Workflow relevance, data accuracy, real-world dispensary credibility |
| `cannabis-marketing-director.md` | Aaliyah (VP Marketing) | Campaign quality, brand voice, marketing metrics, strategic value |
| `compliance-expert.md` | David (Compliance Director) | State-by-state advertising rules, disclaimers, health claims, red flags |
| `executive.md` | Maria (COO) | Strategic value, ROI, scalability, demo credibility, competitive positioning |
| `product-marketing.md` | Product Marketing Agent | Landing page copy, positioning, social proof, conversion optimization, competitive messaging |
| `design-lead.md` | Ren (VP Design) | UI/UX, information architecture, agent-first AI patterns, progressive complexity, visual hierarchy |

## How It Works

1. You describe what to review
2. The orchestrator reads relevant source files and dispatches sub-agents
3. Each sub-agent evaluates from their expert perspective
4. Orchestrator synthesizes into prioritized recommendations: Critical > High-Impact > Quick Wins > Future
