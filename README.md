# Rohail Ahmad — Personal Portfolio & Engineering Hub

Personal portfolio website and blog of **Rohail Ahmad**, Senior Android Engineer (8+ years shipping Kotlin & Jetpack Compose products used by 12M+ people across fintech, digital mail and energy).

**Live Site:** [**www.rrohaill.dev**](https://www.rrohaill.dev)

---

## 🎨 Theme & Design System: "Material You"

The site is styled after **Material 3 Expressive** (the design language of modern Android), built with plain CSS and no build step:

- **Dynamic color**: every color is a tone derived from a single seed hue (`--seed-h`), like Android wallpaper-based theming. Visitors can switch the seed (Android green, Ocean blue, Lavender, Coral) and light / dark / system mode from the palette button in the nav. The choice is saved in `localStorage` and applied before first paint so it never flashes.
- **Role tokens**: components only use Material roles (`--primary-container`, `--surface-container-*`, `--tertiary`, …) defined in [`assets/m3.css`](assets/m3.css), so re-tinting is automatic.
- **Typography**: [Google Sans Flex](https://fonts.google.com/specimen/Google+Sans+Flex) with the `ROND` axis for rounded, expressive headlines.
- **Expressive shapes & motion**: cookie / clover / flower / sunny shapes drawn as SVG polar curves, cards whose corners morph on hover, pill buttons that squish while pressed, ripple-like state layers, and a View Transitions cross-fade when the theme changes.

The redesign was prototyped in Lovable and ported back into this static site so it keeps working on GitHub Pages without a framework.

---

## 📁 Repository Structure

```
.
├── index.html              # Landing page (Hero, Recruiter guide, About, Skills, Career, Work, Labs, Books, Contact)
├── blog.html               # Single-page blog engine (list view & article view, hash routing)
├── books.html              # Books & Publications catalog with per-book detail views
├── blog/
│   ├── posts.json          # Blog metadata
│   └── *.md                # Articles (FitBrief, PixelSanitizer, Design System, Pulse AI, Clean Architecture)
├── assets/
│   ├── m3.css              # Shared design system: tokens, base styles, nav, buttons, chips, shapes
│   ├── m3.js               # Theme controls, icon set, shape renderer, navigation behaviour
│   ├── apps/               # Kivra & Meezan Bank app icons and screenshots (Selected work)
│   ├── fitbrief/           # FitBrief screenshots
│   ├── pixelsanitizer/     # PixelSanitizer screenshots & graphics
│   └── *.png               # Book covers and spreads
├── favicon.svg / favicon.png / apple-touch-icon.png
├── og-image.jpg            # Social share card (bump ?v= in the meta tags when it changes)
├── budgeting-app/          # Embedded React + TypeScript 50/30/20 Budgeting App
│   └── dist/               # Production build served at /budgeting-app/dist/index.html
└── PixelSanitizer/         # PixelSanitizer app landing page & privacy policy
```

---

## ✨ Features & Sections

- **Hero**: intro card plus an Android-style "home screen" of widgets — current role, and stats (8+ years, 20+ apps, 12M+ users, +25% payment completions) inside expressive shapes.
- **Hiring for something specific?**: a recruiter guide. Pick a focus (Payments & fintech, Jetpack Compose & UI, Design systems & a11y, White-label & scale, On-device AI, Privacy & security, Cross-platform) to get a tailored pitch and "Start here" picks that scroll to and spotlight the matching cards. `?for=<focus>` in the URL opens the guide on that focus so links can be shared.
- **Describe the role**: paste a job ad and a client-side keyword/synonym matcher (no AI, no API keys, nothing leaves the browser) lists what the role asks for that Rohail has done, and the best matching work.
- **About**: engineering philosophy ("Ownership, not just code") and off-the-clock interests.
- **Skills**: Languages, Architecture, Tooling, Quality.
- **Career**: Kivra, Eliq, UIZ GmbH, Inov8.
- **Selected Work**: Kivra and Meezan Bank with swipeable app screenshots, the Android Design System with a live component specimen, and Mölndal Energi.
- **Labs**: FitBrief (featured, on-device AI), PixelSanitizer, Pulse AI, Budgeting App, Android Design System.
- **Books & Publications**: spotlight card linking to the full catalog (Cracking the Android FAANG Interview, and the "Little hands first coloring book" series).
- **Blog**: lightweight markdown renderer (headings, code blocks, quotes, lists, tables, images), featured latest post, "On the portfolio" and "Read next" links, embedded fallback content for `file://` previews.
- **SEO**: canonical URLs, Open Graph / Twitter cards with a share image, and Person JSON-LD.

---

## 🚀 Tech Stack

- **HTML5**: semantic markup, skip link, ARIA on interactive widgets.
- **Vanilla CSS**: `oklch()` role tokens, `color-mix()`, CSS Grid, container-free responsive layout, `prefers-reduced-motion` support.
- **Vanilla JavaScript (ES2015+)**: theme persistence, `IntersectionObserver` nav highlighting, hash routing for blog and books, recruiter guide and role matcher.
- **Typography**: Google Fonts (Google Sans Flex).
- **Icons**: inline Lucide SVG paths, no icon library dependency.

---

## 🛠️ Local Development & Viewing

No build step. Open `index.html` directly, or serve the folder so the blog can fetch markdown and the budgeting app loads:

```sh
git clone https://github.com/rrohaill/rrohaill.github.io.git
cd rrohaill.github.io
python3 -m http.server 8000
# then open http://localhost:8000
```

Adding a blog post: drop a `.md` file in `blog/`, add its metadata to `blog/posts.json` and to the `postsData` array in `blog.html` (the embedded copy is what makes `file://` previews work), and add a `postExtras` entry if the post has a cover image or a linked homepage card.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
