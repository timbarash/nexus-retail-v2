# Architecture Overview

This document describes the high-level architecture of the Sentiment Analysis dashboard, covering the full request lifecycle from DNS to rendered page and the CI/CD pipeline that deploys it.

---

## Request Lifecycle

```
                          ┌─────────────────────┐
  Browser                 │  sa-demo.dutchie.dev │
  ───────────────────────►│       (DNS)          │
                          └──────────┬──────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │   Load Balancer /    │
                          │   Ingress (EKS)      │
                          └──────────┬──────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │   nginx :8080        │
                          │   (container)        │
                          └──────────┬──────────┘
                                     │
                        ┌────────────┼────────────┐
                        │            │            │
                        ▼            ▼            ▼
                  /assets/*     /healthz      /* (SPA)
                  (static,     (200 "ok")    (index.html
                   1y cache)                  fallback)
```

All traffic to the application is routed through `sa-demo.dutchie.dev`. DNS for that hostname points at the Kubernetes ingress/load balancer, which forwards requests to the nginx container listening on port 8080. There is no separate application server — nginx serves the pre-built static assets directly.

---

## Nginx Layer

The nginx configuration (`nginx.conf`) is the single entry point for all HTTP traffic and handles three concerns:

| Route | Behavior |
|---|---|
| `/assets/*` | Serves Vite-hashed static files with `Cache-Control: public, immutable` and a 1-year expiry. |
| `/healthz` | Returns `200 "ok"` with no access logging. Used by Kubernetes liveness/readiness probes. |
| `/*` (everything else) | SPA fallback — `try_files $uri $uri/ /index.html` so React Router can handle client-side routes. |

Additional features:
- *Gzip compression* enabled for text, JS, CSS, JSON, XML, and SVG (level 6, min 256 bytes)
- `sendfile`, `tcp_nopush`, `tcp_nodelay` for efficient static file delivery
- PID written to `/tmp/nginx.pid` (non-root compatible)

---

## Application Layer

The app is a *client-side React 18 SPA* built with Vite. There is no server-side rendering or backend API — all data is bundled at build time.

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tooling, dev server, asset hashing |
| Tailwind CSS | Utility-first styling |
| Recharts | Data visualization / charts |
| React Router DOM | Client-side routing |
| Lucide React | Icons |

### Routes

| Path | Page Component | Description |
|---|---|---|
| `/` | `Overview` | Top-level KPIs and sentiment summary |
| `/brands` | `BrandAnalysis` | Per-brand sentiment breakdown |
| `/locations` | `LocationInsights` | Per-location sentiment analysis |
| `/reviews` | `ReviewExplorer` | Filterable review table/explorer |
| `/competitive` | `CompetitiveInsights` | Competitive landscape comparison |

### Project Structure

```
src/
├── components/
│   ├── charts/       # Recharts-based visualization components
│   ├── common/       # Shared UI primitives
│   └── layout/       # Header, Sidebar, Footer
├── data/
│   └── mockData.js   # Bundled review dataset (~550 reviews)
├── pages/            # Route-level page components (listed above)
├── utils/
│   └── helpers.js    # Filtering and data transformation utilities
├── App.jsx           # Root component, routing, filter state
├── main.jsx          # Entry point, mounts React to DOM
└── index.css         # Tailwind directives and global styles
```

---

## Build & Docker

The `Dockerfile` uses a two-stage build:

1. *Build stage* (`node:20-alpine`) — `npm ci` + `npm run build` produces the `dist/` directory
2. *Production stage* (`nginx:alpine`) — copies `nginx.conf` and `dist/` into a minimal nginx image

The final image exposes port `8080` and runs `nginx -g 'daemon off;'`.

---

## CI/CD Pipeline

```
  Push to main
       │
       ▼
  ┌──────────────────────────────────────┐
  │  sentiment-analysis-build.yaml       │
  │  • Docker build                      │
  │  • Push to ECR (tag = short SHA)     │
  │    146979574599.dkr.ecr...           │
  └──────────────┬───────────────────────┘
                 │ workflow_run trigger
                 ▼
  ┌──────────────────────────────────────┐
  │  sentiment-analysis-deploy-dev.yaml  │
  │  • Checkout argocd-manifests         │
  │  • Update dev overlay image tag      │
  │  • ArgoCD sync-by-label (dev/wide)   │
  └──────────────────────────────────────┘
       │
       ▼
  App live at sa-demo.dutchie.dev
```

| Step | Detail |
|---|---|
| *Build & Push* | On push to `main`, builds the Docker image and pushes to ECR at `146979574599.dkr.ecr.us-east-1.amazonaws.com/sentiment-analysis:<short-sha>`. Uses OIDC role `sentiment-analysis-ecr-push`. |
| *Deploy (dev)* | Triggered automatically after a successful build (or manually via `workflow_dispatch`). Checks out `GetDutchie/argocd-manifests`, updates the image tag in `dutchie/envs/dev/cells/global/sentiment-analysis/overlay.yaml`, then triggers an ArgoCD sync (`label-app=sentiment-analysis`, `label-env=dev`, `label-wave=wide`). |

---

## Key Takeaways

- *All traffic flows through nginx.* There is no separate backend — nginx serves the SPA and handles health checks, caching, and compression.
- *DNS (`sa-demo.dutchie.dev`) must point at the EKS ingress* that routes to this nginx container.
- *Client-side routing* means nginx must return `index.html` for any non-asset path (the SPA fallback rule).
- *Deploys are fully automated* on merge to `main`: build → ECR → ArgoCD → live.
