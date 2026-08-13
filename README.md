# Rohail Ahmad — Personal Portfolio & Engineering Hub

Personal portfolio website and blog of **Rohail Ahmad**, Senior Android Engineer (8+ years of experience, shipping Kotlin & Jetpack Compose products serving millions of users across fintech, digital mail, and energy).

**Live Site:** [**rrohaill.dev**](https://rrohaill.github.io/)

---

## 🎨 Theme & Design System: "Midnight Indigo"

The site features a **Midnight Indigo** dark-mode design system built from scratch with modern web standards:

- **Color Palette**: Deep navy canvas (`oklch(0.14 0.045 280)`), electric indigo primary (`oklch(0.58 0.22 285)`), and `oklch` color spaces.
- **Typography**: [Sora](https://fonts.google.com/specimen/Sora) for bold display headings and [Manrope](https://fonts.google.com/specimen/Manrope) for clean body prose.
- **Layout Architecture**: Bento-grid layout with elevated cards, gradient surfaces, radial hero glow, and hover-triggered indigo glowing borders.
- **Micro-Interactions**: Frosted-glass fixed navbar with blur on scroll, scroll-triggered entrance animations via `IntersectionObserver`, and interactive chip badges.

---

## 📁 Repository Structure

```
.
├── index.html              # Main portfolio landing page (Hero, About, Skills, Career, Work, Labs, Contact)
├── blog.html               # Custom single-page blog engine (List view & Article view)
├── blog/
│   ├── posts.json          # Blog metadata repository
│   ├── building-pixelsanitizer.md         # Article: PixelSanitizer Android App build story
│   ├── building-pulse-ai.md               # Article: Pulse AI macOS App build story
│   └── building-scalable-android-apps.md  # Article: Clean Architecture in Android
├── assets/
│   ├── pixelsanitizer/     # PixelSanitizer app screenshots & graphics
│   ├── hero-glow.jpg       # Hero visual bento tile background image
│   └── screenshot.png      # Site preview screenshot
├── budgeting-app/          # Embedded React + TypeScript 50/30/20 Budgeting App
│   └── dist/               # Production build served at /budgeting-app/dist/index.html
└── PixelSanitizer/         # PixelSanitizer app landing page & privacy policy
```

---

## ✨ Features & Sections

- **Hero Bento Grid**: Interactive intro card, stats counter (8+ years, 20+ apps, 5M+ users, +25% payment conversions), Compose UI craft tile, and quick CV download.
- **About Me**: Engineering philosophy ("Ownership, not just code"), impact metrics, and personal interests.
- **Skills Matrix**: 4-column breakdown covering Languages (Kotlin, Java, TypeScript), Architecture (Compose, MVVM/MVI, Room, Retrofit), Tooling, and Testing/Quality.
- **Career Journey**: Timeline highlighting senior roles at Kivra, Eliq, UIZ GmbH, and Inov8.
- **Selected Work**: High-impact production applications (Kivra, Mölndal Energi, Meezan Bank).
- **Labs & Side Projects**: PixelSanitizer (Android photo EXIF privacy stripper), Pulse AI (Local LLM macOS news dashboard), Android Design System (Jetpack Compose tokens & UI library), and Budgeting App (React + TS 50/30/20 rule calculator).
- **Built-in Blog Engine**: Lightweight JS markdown parser supporting code blocks, quotes, tags, deep-linking via hashes (`#slug`), and fallback rendering for `file://` local previewing.

---

## 🚀 Tech Stack

- **HTML5**: Semantic markup, accessible structure.
- **Vanilla CSS3**: Design system tokens (`:root` variables), `oklch()` color function, CSS Grid (Bento layout), Flexbox, radial/linear gradients, `backdrop-filter`.
- **Vanilla JavaScript (ES6+)**: `IntersectionObserver` scroll animations, hash-based client routing for blog articles, responsive navigation toggle.
- **Typography**: Google Fonts (Sora & Manrope).
- **SVG & Icons**: Inline SVG vectors for zero external library dependencies.

---

## 🛠️ Local Development & Viewing

You can view the site locally without any build step or server setup:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/rrohaill/rrohaill.github.io.git
   cd rrohaill.github.io
   ```

2. **Open in browser:**
   - Simply double-click `index.html` or open it in your browser.
   - For testing the React `budgeting-app`, run a quick local HTTP server:
     ```sh
     npx serve .
     # or
     python3 -m http.server 8000
     ```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
