# AURUM Intelligence Platform

> Institutional-grade AI investment intelligence.

## Tech Stack
- **React 18** + **Vite** — frontend
- **Cloudflare Pages** — hosting + CDN
- **Cloudflare Pages Functions** — serverless API proxy (keeps your Anthropic key secret)
- **Anthropic Claude** — AI analysis engine

## Project Structure
```
aurum/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite build config
├── package.json
├── .gitignore
├── public/
│   ├── _headers                # Security headers
│   └── _redirects              # SPA routing
├── src/
│   ├── main.jsx                # React entry
│   └── App.jsx                 # Full platform UI
└── functions/
    └── api/
        └── analyze.js          # Cloudflare Pages Function (Anthropic proxy)
```

## Environment Variables (set in Cloudflare dashboard)
| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (sk-ant-...) |

## Local Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
# Output goes to /dist
```
