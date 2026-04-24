# I Built a Local AI News Dashboard That Replaces My Doomscrolling

I was spending 2+ hours every morning cycling through Hacker News, Reddit, Twitter, and a dozen RSS feeds trying to stay on top of AI news. Most of it was noise. So I built **Pulse AI** — a macOS desktop app that does it for me.

No API keys. No subscriptions. Everything runs on your Mac.

---

## ⚡ The 30-Second Pitch

> **200+ articles in → 15 curated articles out.**
>
> Pulse AI fetches from RSS, Reddit, Twitter/X, and GitHub. A local Llama 3.1 model scores every article 0-100, filters out the noise, then enriches the good stuff with summaries, tags, and a "why it matters" explanation.

---

## 🧠 The Two-Pass AI Pipeline

This is the heart of the system. Every article goes through two AI passes — entirely on your machine via Ollama:

**Pass 1** scores articles with a strict rubric:

```typescript
export const SCORING_SYSTEM_PROMPT = `You are an AI/tech news editor.
Score each article from 0 to 100 based on:
- Novelty (20 pts): Is this genuinely new information or a rehash?
- Technical Depth (25 pts): Does it have substance, or is it surface-level?
- Impact (25 pts): How many people does this affect? Industry-wide > niche.
- Relevance (30 pts): How relevant is this to AI, machine learning, and tech?

Be strict. Most articles should score 30-60.
Only truly exceptional content scores 80+.
Clickbait and press releases with no substance should score low.`;
```

**Pass 2** enriches the winners with structured analysis:

```typescript
export const ENRICHMENT_SYSTEM_PROMPT = `You are an AI news analyst.
Your response must be valid JSON with these exact fields:
- "summary": A concise 2-3 sentence summary of the key points
- "importanceRating": Integer 1-5 (1=minor, 5=groundbreaking)
- "whyItMatters": 1-2 sentences explaining the broader significance
- "tags": Array of 2-5 lowercase category tags`;
```

The result? Each article card shows a score badge, importance stars, AI summary, and tags — enough to decide in 2 seconds if it's worth reading.

---

## 🔌 One Interface, Two AI Backends

The AI provider is a simple abstraction. Swap between Ollama (free, local) and OpenAI (cloud) with one env var:

```typescript
export async function complete(
  prompt: string,
  systemPrompt: string,
  options: CompletionOptions = {}
): Promise<string> {
  const settings = await getAISettings();

  if (settings.provider === "ollama") {
    return completeOllama(prompt, systemPrompt, settings.model, options);
  }
  return completeOpenAI(prompt, systemPrompt, settings.model, options);
}
```

The Ollama path hits `localhost:11434` — no network, no latency, no bill:

```typescript
async function completeOllama(prompt, systemPrompt, model, options) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    stream: false,
    options: { temperature: 0.3, num_predict: 2000 },
  };

  if (options.responseFormat === "json") body.format = "json";

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data.message?.content || "";
}
```

---

## 🔄 The Ingestion Pipeline

The orchestrator is the most critical piece. It follows a resilient pattern — **articles are saved even if AI is unavailable**:

```
Fetch → Deduplicate → Store → Score → Enrich
  ↑                      ↑       ↑        ↑
  always runs         always   optional  optional
                      works    (AI may   (only for
                               be down)  high scores)
```

In code, that looks like this:

```typescript
export async function runIngestionPipeline() {
  // 1. Fetch from all enabled sources
  const enabledSources = await db.select().from(sources)
    .where(eq(sources.enabled, 1));

  let allFetched = [];
  for (const source of enabledSources) {
    switch (source.type) {
      case "rss":     fetched = await fetchRSS(source.url); break;
      case "reddit":  fetched = await fetchReddit(source.url); break;
      case "github":  fetched = await fetchGitHub(source.url); break;
      case "twitter": fetched = await fetchTwitter(source.url); break;
    }
    allFetched.push(...fetched.map(a => ({ ...a, sourceId: source.id })));
  }

  // 2. Deduplicate against existing DB entries
  const unique = await deduplicateArticles(allFetched);

  // 3. Insert (always works — no AI dependency)
  for (const article of unique) { /* insert into SQLite */ }

  // 4. Score with AI (gracefully skip if Ollama is down)
  try {
    const check = await fetch("http://localhost:11434/api/tags")
      .catch(() => null);
    if (!check?.ok) throw new Error("skip");

    const scores = await scoreArticles(insertedArticles);
    // 5. Enrich only high-scoring articles
    const toEnrich = scores.filter(s => s.score >= threshold);
    for (const article of toEnrich) {
      await enrichArticle(article.title, article.content);
    }
  } catch {
    console.log("AI unavailable — articles saved without scores");
  }
}
```

The key insight: the pipeline **degrades gracefully**. No Ollama? Articles still appear — just without AI scores and summaries.

---

## 📊 The Data Model

The schema tells the full story — raw content flows in, AI enrichment flows through, user ratings flow back:

```typescript
export const articles = sqliteTable("articles", {
  id:               text("id").primaryKey(),
  sourceId:         text("source_id").references(() => sources.id),
  title:            text("title").notNull(),
  rawContent:       text("raw_content"),
  publishedAt:      text("published_at").notNull(),

  // AI Pass 1: Scoring
  relevanceScore:   integer("relevance_score"),     // 0-100

  // AI Pass 2: Enrichment
  isEnriched:       integer("is_enriched").default(0),
  aiSummary:        text("ai_summary"),
  importanceRating: integer("importance_rating"),    // 1-5 stars
  whyItMatters:     text("why_it_matters"),
  tags:             text("tags"),                    // JSON array

  // User actions
  bookmarked:       integer("bookmarked").default(0),
});
```

And here's the trick that makes AI scoring **personalized** — user thumbs up/down feed back into the scoring prompt:

```typescript
async function getCalibrationContext() {
  const recentRatings = await db
    .select({
      rating: userRatings.rating,
      title: articles.title,
      score: articles.relevanceScore,
    })
    .from(userRatings)
    .innerJoin(articles, eq(userRatings.articleId, articles.id))
    .orderBy(desc(userRatings.createdAt))
    .limit(20);

  const liked = recentRatings
    .filter(r => r.rating > 0)
    .map(r => `"${r.title}" (score: ${r.score}, user: liked)`);

  const disliked = recentRatings
    .filter(r => r.rating < 0)
    .map(r => `"${r.title}" (score: ${r.score}, user: disliked)`);

  return `Articles the user LIKED:\n${liked.join("\n")}
          \nArticles the user DISLIKED:\n${disliked.join("\n")}`;
}
```

Every thumbs-up/down becomes few-shot context for the next scoring batch. No fine-tuning, no training — just prompt engineering with your own feedback.

---

## 🎯 Dynamic Category Discovery

I didn't want to hardcode "AI & Tech" and "Politics" filter tabs. What if someone adds sports or science sources?

The solution: categories are **discovered at runtime** from whatever data exists:

```typescript
const { topicCategories, sourceCategories } = useMemo(() => {
  const topics = [{ key: "all", label: "All", icon: Layers }];
  const sources = [];

  for (const key of Object.keys(counts)) {
    if (sourceTypeKeys.has(key)) {
      // It's a source type (rss, reddit, github, twitter)
      if (counts[key] > 0) {
        const meta = SOURCE_META[key]; // pre-mapped icons
        sources.push({ key, label: meta?.label ?? capitalize(key), icon: meta?.icon ?? Rss });
      }
    } else if (counts[key] > 0) {
      // It's a topic category — discovered from article data
      const meta = TOPIC_META[key]; // known icons for common topics
      topics.push({ key, label: meta?.label ?? capitalize(key), icon: meta?.icon ?? Tag });
    }
  }

  topics.push({ key: "saved", label: "Saved", icon: Bookmark });
  return { topicCategories: topics, sourceCategories: sources };
}, [counts]);
```

Add a source with `category: "science"` and a Microscope icon tab appears automatically. No code changes.

---

## 🖥️ The Setup Wizard That Makes It Just Work

The hardest UX problem was onboarding. "Install Ollama, pull a 4.7GB model, configure env vars" is a non-starter.

So the Electron app has a first-run wizard. The most interesting part — streaming the model download with real-time GB progress:

```javascript
ipcMain.handle("pull-model", async (event, model) => {
  const postData = JSON.stringify({ name: model, stream: true });

  const req = http.request({
    hostname: "localhost", port: 11434,
    path: "/api/pull", method: "POST",
  }, (res) => {
    let buffer = "";

    res.on("data", (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // keep incomplete line

      for (const line of lines) {
        const data = JSON.parse(line);
        if (data.total && data.completed) {
          const percent = Math.round((data.completed / data.total) * 100);
          const gb = (data.completed / 1024 / 1024 / 1024).toFixed(2);
          const totalGb = (data.total / 1024 / 1024 / 1024).toFixed(2);

          event.sender.send("setup-progress", {
            stage: "pull",
            status: `${data.status} — ${gb}GB / ${totalGb}GB`,
            percent,
          });
        }
      }
    });
  });

  req.write(postData);
  req.end();
});
```

Ollama's pull API streams NDJSON — one JSON object per line. The `buffer` trick handles chunks that split mid-line. The user sees a smooth progress bar from 0% to 100% as 4.7GB downloads.

---

## 🏗️ Tech Stack At A Glance

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 16 | Server components + API routes in one project |
| **Database** | SQLite + Drizzle | Zero-config, single file, WAL mode for concurrency |
| **AI** | Ollama + Llama 3.1 | Free, local, no API keys, good enough for scoring |
| **Desktop** | Electron | Wrap the web app, add setup wizard, ship as .dmg |
| **Styling** | Tailwind CSS 4 | Dark theme that's easy on the eyes at 6am |

---

## 💡 What I Learned

**SQLite is underrated for desktop apps.** WAL mode, concurrent reads/writes, the entire DB is one portable file. No Postgres, no Docker, no config.

**Local LLMs are good enough for structured tasks.** Llama 3.1 isn't GPT-4, but for scoring articles 0-100 and writing 2-sentence summaries? More than good enough.

**The setup experience IS the product.** The wizard was 20% of the development effort. But it's what makes the difference between "cool GitHub project" and "tool I actually use."

**Graceful degradation is everything.** The app works without AI running. Articles still appear, you can still browse and bookmark. AI is an enhancement, not a requirement.

---

## 🚀 Try It

**Download the macOS app:**
1. Grab the `.dmg` from the [releases page](https://github.com/rrohaill/pulse-ai/releases/latest)
2. Drag to Applications
3. Launch — the wizard handles the rest

**Or run as a web app:**
```bash
git clone https://github.com/rrohaill/pulse-ai.git
cd pulse-ai && npm install && npm run dev
```

The repo is at [github.com/rrohaill/pulse-ai](https://github.com/rrohaill/pulse-ai). Stars and feedback welcome.
