# I Built a Local AI News Dashboard That Replaces My Doomscrolling

I was spending 2+ hours every morning cycling through Hacker News, Reddit, Twitter, and a dozen RSS feeds trying to stay on top of AI and tech news. Most of what I read was noise. So I built **Pulse AI** — a desktop app that aggregates hundreds of articles, scores them with a local AI model, and surfaces only what matters.

No API keys. No subscriptions. Everything runs on your Mac.

## The Problem

Information overload is real. On any given day, there are hundreds of AI-related articles, Reddit threads, and GitHub releases. The signal-to-noise ratio is terrible. I needed something that could:

- Pull from all my sources automatically (RSS, Reddit, Twitter/X, GitHub)
- Score articles by relevance so I see the important stuff first
- Summarize articles so I know if they're worth reading
- Run locally — no sending my reading habits to some cloud service

## How It Works

Pulse AI runs a two-pass AI pipeline using Ollama with Llama 3.1, entirely on your machine:

**Pass 1 — Scoring.** Every fetched article gets a relevance score from 0-100 based on novelty, depth, impact, and relevance to your interests. Articles below the threshold get filtered out.

**Pass 2 — Enrichment.** Articles that pass scoring get an AI-generated summary, importance rating (1-5 stars), tags, and a "why it matters" explanation.

The whole pipeline runs in under a minute for ~200 articles on an M1 MacBook.

## The Tech Stack

I went with a stack optimized for local-first, zero-config deployment:

- **Next.js 16** (App Router) — Server components for fast initial loads, API routes for the ingestion pipeline
- **SQLite + Drizzle ORM** — No database server to manage. The entire DB is a single file
- **Ollama + Llama 3.1** — Local inference, no API keys, free forever
- **Electron** — Wraps the web app into a native macOS desktop app
- **Tailwind CSS 4** — Dark theme that's easy on the eyes at 6am

## The Setup Wizard

The hardest UX problem wasn't the dashboard — it was onboarding. Asking users to install Ollama, pull a 4.7GB model, and configure environment variables is a non-starter.

So I built a first-run setup wizard directly into the Electron app. On first launch, it:

1. Detects if Ollama is already installed
2. Downloads and installs Ollama automatically if missing
3. Pulls the Llama 3.1 model with a real-time progress bar
4. Launches straight into the dashboard

The entire setup takes about 5 minutes (mostly waiting for the model download), and the user clicks exactly one button.

## Multi-Source Ingestion

Pulse AI pulls from four source types:

**RSS Feeds** — The backbone. I have feeds from OpenAI's blog, Anthropic, Google AI, MIT Tech Review, Ars Technica, The Verge, and a bunch more. Adding a new source is just pasting a URL.

**Reddit** — Pulls from r/MachineLearning, r/LocalLLaMA, r/artificial, and r/worldnews using Reddit's public JSON API. No auth needed.

**Twitter/X** — Uses RSSHub as a bridge to convert any Twitter profile into an RSS feed. Follow researchers, companies, or journalists.

**GitHub** — Tracks trending repositories and releases in the AI/ML space.

All sources have a `category` field (ai, politics, tech, etc.), and the dashboard generates filter pills dynamically based on what categories exist. Add a source with a new category, and it appears automatically.

## Dynamic Category Switching

One feature I'm particularly happy with is the category switcher. Instead of hardcoding "AI & Tech" and "Politics" tabs, the dashboard discovers categories from the data at runtime.

The topic pills, source type pills, and their counts are all computed from whatever articles exist in the database. If you add sources with a `science` or `gaming` category, they show up as filterable tabs with the right icon — no code changes needed.

## Bookmarks and Saved Articles

Sometimes you find an article at 7am but don't have time to read it until lunch. The bookmark system saves articles with a single click, and there's a dedicated Saved page with search. Simple, but essential.

## What I Learned

**SQLite is underrated for desktop apps.** WAL mode gives you concurrent reads and writes, the entire database is a single portable file, and performance is excellent for this scale. No Postgres, no Docker, no config.

**Electron gets a bad rap but it works.** Yes, the bundle is 196MB. But for a personal productivity tool that runs locally, the convenience of wrapping a Next.js app is hard to beat. The alternative was rewriting everything in Swift.

**Local LLMs are good enough for structured tasks.** Llama 3.1 handles article scoring and summarization surprisingly well. The summaries aren't GPT-4 quality, but they're more than good enough to decide if an article is worth reading.

**The setup experience IS the product.** Nobody cares how elegant your AI pipeline is if they can't get the app running. The setup wizard was probably 20% of the total development effort, but it's what makes the difference between "cool GitHub project" and "tool I actually use."

## Try It

Pulse AI is open source and free. If you're on a Mac with Apple Silicon:

1. Download the `.dmg` from the [releases page](https://github.com/rrohaill/pulse-ai/releases/latest)
2. Drag to Applications
3. Launch and let the setup wizard do its thing

Or clone the repo and run it as a web app:

```bash
git clone https://github.com/rrohaill/pulse-ai.git
cd pulse-ai && npm install && npm run dev
```

The repo is at [github.com/rrohaill/pulse-ai](https://github.com/rrohaill/pulse-ai). Stars and feedback welcome.

---

*This project was built in a weekend with the help of Claude. The entire codebase — ingestion pipeline, AI scoring, dashboard UI, Electron wrapper, and setup wizard — is about 4,000 lines of TypeScript.*
