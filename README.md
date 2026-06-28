# Shikha Singh — Portfolio

> UI Engineer · React.js · TypeScript · Three.js · Delhi NCR

Personal portfolio website built with React 18 and Three.js featuring an interactive 3D galaxy, anime-inspired design, and a compact 3-section layout.

**Live →** [shikhasingh.netlify.app](https://shikhasingh.netlify.app)

---

## ✨ Features

- **Interactive 3D Galaxy** — 10,000 particle galaxy rendered with Three.js custom shaders. Drag to tilt, auto-rotates, mouse parallax.
- **Anime / Neon Blossom theme** — Fuchsia · Violet · Cyan palette with Syne display font
- **Typewriter animation** — Cycles through roles with smooth type/delete effect
- **3D tilt cards** — CSS perspective tilt on hover for skill and project cards
- **Compact structure** — 3 sections only (Hero → Overview → Work → Contact), minimal scroll
- **SEO optimised** — Meta tags, Open Graph, Twitter Card, JSON-LD schema markup
- **Security headers** — CSP, X-Frame-Options, HSTS, Permissions-Policy via Netlify

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| 3D / WebGL | Three.js 0.183 |
| Animation | Framer Motion |
| Routing | React Router v5 (HashRouter) |
| Styling | CSS Modules + CSS Variables |
| Fonts | Syne · Inter · JetBrains Mono |
| Deploy | Netlify |
| Node | 18 |

---

## 📁 Project Structure

```
src/
├── App.js
├── index.css                  # Global design system (Neon Blossom palette)
└── Compoents/
    ├── Navbar/                # Sticky navigation
    ├── Hero/
    │   ├── Background.js      # Mounts galaxy + dark overlay
    │   ├── GalaxyScene.js     # Three.js 10K particle galaxy (draggable)
    │   ├── Hero.js            # Hero section — name, typewriter, CTAs, stats
    │   └── hero.css
    ├── Overview/              # Combined About + Skills + Experience
    ├── Work/                  # Project cards with CSS 3D tilt
    └── Contact/               # Minimal CTA + footer
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm start          # http://localhost:3000

# Production build
npm run build
```

---

## 🔒 Security

Security headers configured in `netlify.toml`:

- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `Permissions-Policy`

---

## 📬 Contact

**Shikha Singh** — UI Engineer open to roles in Delhi NCR

- Email: [shikha.thakur2295@gmail.com](mailto:shikha.thakur2295@gmail.com)
- LinkedIn: [linkedin.com/in/shikha-singh-b027a7179](https://www.linkedin.com/in/shikha-singh-b027a7179/)
- GitHub: [github.com/shikhasingh07](https://github.com/shikhasingh07)
