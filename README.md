# Curaleaf Consumer Sentiment Dashboard — Powered by Dutchie Insights

A prototype web application that demonstrates consumer sentiment intelligence for cannabis dispensary operators. Built as a B2B sales demo showcasing how Dutchie can help dispensary chains understand customer feedback across multiple channels.

---

## Features

- **Real-time sentiment analysis dashboard** with overall metrics and KPIs
- **Sentiment breakdown by source** — Reddit, Google Reviews, Leafly, Weedmaps
- **Brand-level analysis** — Select, Grassroots, Curaleaf, Find, Bloom
- **Location-level insights** across 15 dispensary locations
- **Interactive review explorer** with filtering and search
- **Competitive landscape comparison** across key market players
- **Trend analysis** over 12 months of historical data
- **Word cloud visualization** of common themes and keywords
- **Fully responsive design** optimized for both mobile and desktop
- **No external API dependencies** — all data is bundled with the application

---

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build for Production

```bash
npm run build
npm run preview
```

The `preview` command serves the production build locally for verification before deployment.

---

## Deploy

The `dist/` folder produced by `npm run build` can be deployed to any static hosting provider:

| Provider       | Command / Method                          |
|----------------|-------------------------------------------|
| **Vercel**     | `npx vercel`                              |
| **Netlify**    | Drag and drop the `dist/` folder          |
| **GitHub Pages** | Push `dist/` contents to a `gh-pages` branch |

---

## Tech Stack

| Technology         | Purpose                        |
|--------------------|--------------------------------|
| React 18           | UI framework                   |
| Vite               | Build tooling and dev server   |
| Tailwind CSS       | Utility-first styling          |
| Recharts           | Data visualization and charts  |
| Lucide React       | Icon library                   |
| React Router DOM   | Client-side routing            |

---

## Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── data/                # Bundled mock data and constants
│   ├── pages/               # Route-level page components
│   ├── App.jsx              # Root application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and Tailwind directives
├── index.html               # HTML entry point
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite build configuration
├── package.json             # Dependencies and scripts
└── README.md
```

---

## Screenshots

> Screenshots coming soon.

---

## Data

This application includes **550+ realistic mock reviews** generated to simulate real consumer feedback across multiple review platforms and dispensary locations. The data covers a 12-month period and includes varied sentiment, ratings, and source attribution.

In a production environment, this dashboard would connect to **Dutchie's data pipeline**, ingesting and analyzing reviews in real time from:

- Reddit
- Google Reviews
- Leafly
- Weedmaps
- Additional review and social media sources

---

## License

Proprietary - Dutchie, Inc. All rights reserved.
