# Portfolio Modernization — React Notes

> Tracks every file changed, what was updated, and which React concept/pattern was applied.

---

## React Version Upgrade

| Before | After |
|--------|-------|
| React 16 | **React 18.3.1** |
| `ReactDOM.render()` | **`createRoot()` API** |
| framer-motion 6 | **framer-motion 10** |
| No Three.js | **three (latest)** |

---

## `src/index.js`
**What changed:** Switched from legacy `ReactDOM.render()` to React 18's `createRoot` API.

**React concept:** `createRoot` enables **Concurrent Mode** — React 18's new rendering engine that makes apps more responsive by allowing React to interrupt, pause, and resume renders. It also unlocks `useTransition`, `useDeferredValue`, and `Suspense` streaming.

```js
// OLD (React 16 — legacy blocking render)
ReactDOM.render(<App />, document.getElementById('root'));

// NEW (React 18 — concurrent root)
const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
```

---

## `src/App.js`
**What changed:** Simplified to a clean dark-mode-only layout. Removed the broken light/dark toggle state.

**React concepts:**
- `useState` — controls mobile menu open/close state
- `React.lazy` + `React.Suspense` — lazy loads `<Main />` so the initial bundle is smaller; shows a skeleton loader while the component loads

---

## `src/hooks/useScrollAnimation.js` *(new file)*
**What it does:** Custom hook that returns a `ref` + `inView` boolean, using `IntersectionObserver` to detect when an element enters the viewport.

**React concepts:**
- **Custom Hook** — encapsulates reusable observer logic; any component can call `useScrollAnimation()` and get scroll-triggered entry state
- `useRef` — attaches to the DOM element being observed
- `useEffect` — sets up the `IntersectionObserver` and cleans it up on unmount (avoids memory leaks)
- `useState` — tracks the `inView` boolean

```js
const [ref, inView] = useScrollAnimation();
```

---

## `src/hooks/useMousePosition.js` *(new file)*
**What it does:** Tracks normalized mouse coordinates (-1 to 1) across the viewport.

**React concepts:**
- **Custom Hook** — single source of truth for mouse position; used by HeroCanvas and other components
- `useEffect` — attaches `mousemove` listener on mount, removes it on unmount (proper cleanup)
- `useState` — stores `{ x, y }` coordinates

---

## `src/Compoents/Hero/HeroCanvas.js` *(new file)*
**What it does:** Renders an interactive 3D scene (floating geometric shapes + particle field) using vanilla Three.js.

**React concepts:**
- `useRef` — mounts the Three.js renderer canvas into a DOM node without triggering re-renders
- `useEffect` — entire Three.js lifecycle (scene creation, animation loop, event listeners) lives here; cleanup function cancels animation frame and disposes the renderer to prevent GPU memory leaks
- **No state** — deliberate; Three.js manages its own render loop; React state would cause unnecessary re-renders

**Three.js elements:**
- `IcosahedronGeometry`, `TorusKnotGeometry`, `OctahedronGeometry`, `TorusGeometry` — wireframe 3D shapes
- `Points` with `BufferGeometry` — particle field (120 floating dots)
- Mouse parallax — camera position lerps toward mouse direction on each frame

---

## `src/Compoents/Navbar/Navbar.js`
**What changed:** Complete rewrite with glassmorphism styling and scroll-aware behavior.

**React concepts:**
- `useState` — tracks `scrolled` (for backdrop blur intensification) and `menuOpen` (mobile hamburger toggle)
- `useEffect` — attaches `scroll` event listener; cleans up on unmount
- `useCallback` — wraps the scroll handler so it isn't recreated on every render (performance optimization)
- `React.memo` — wraps the whole component so it doesn't re-render when parent state changes unrelated to nav

---

## `src/Compoents/About/About.js`
**What changed:** Full rewrite — hero section now has the 3D canvas behind it, a CSS typing animation, and framer-motion entrance animations.

**React concepts:**
- `motion.div`, `motion.h3`, `motion.p` (framer-motion) — declarative entrance animations with `initial`, `animate`, `transition` props
- `HeroCanvas` lazy-loaded via `React.lazy` + `Suspense`
- Social links extracted into a stable array (`useMemo` not needed here — static data)

**Typing animation:** Pure CSS `@keyframes` — no library needed, zero JS overhead.

---

## `src/Compoents/Skills/Skills.js` *(new file)*
**What it does:** Displays tech stack in an animated grid of glassmorphism cards with icons.

**React concepts:**
- `useRef` + `IntersectionObserver` via `useScrollAnimation()` custom hook — cards animate in when they scroll into view
- `motion.div` (framer-motion) with `variants` and `staggerChildren` — each card staggers its entrance for a smooth cascade effect
- Static `SKILLS` array defined outside the component — keeps the component pure and avoids re-creating the array on every render

---

## `src/Compoents/Experience/Experience.js`
**What changed:** Replaced tab-click UI with a vertical animated timeline.

**React concepts:**
- `useState` — tracks `activeIndex` for expanded timeline item
- `useScrollAnimation()` custom hook — whole section animates in on scroll
- `motion.div` with `AnimatePresence` — content panel fades/slides in and out when switching jobs; `AnimatePresence` enables exit animations
- Experience data array defined outside component (stable reference)

---

## `src/Compoents/Projects/Projects.js`
**What changed:** Updated with real resume projects (AssetHub, MentorHub, Elevate App, Memories) in glassmorphism cards with hover lift effect.

**React concepts:**
- `motion.div` with `whileHover` — 3D lift transform on card hover (no JS event handlers needed)
- `useScrollAnimation()` — stagger animate cards into view
- `React.memo` — wraps component to prevent unnecessary re-renders
- Project data array defined outside component

---

## `src/Compoents/Contact/Contact.js`
**What changed:** Modern centered layout with animated entrance.

**React concepts:**
- `motion.section` with scroll-triggered `variants`
- `useScrollAnimation()` for intersection detection

---

## Design System (CSS Variables in `index.css`)
```
--bg-primary: #050510
--bg-secondary: #0d0d1a
--accent-indigo: #6366f1
--accent-cyan: #06b6d4
--accent-purple: #a78bfa
--text-primary: #f1f5f9
--text-secondary: #94a3b8
--glass-bg: rgba(255,255,255,0.03)
--glass-border: rgba(255,255,255,0.08)
```

---

## File Map

```
src/
├── index.js                          ← createRoot (React 18)
├── index.css                         ← Global design system + CSS variables
├── App.js                            ← React.lazy + Suspense, useState
├── hooks/
│   ├── useScrollAnimation.js         ← Custom hook: IntersectionObserver
│   └── useMousePosition.js           ← Custom hook: mouse tracking
└── Compoents/
    ├── Hero/
    │   └── HeroCanvas.js             ← Three.js 3D scene (useRef, useEffect)
    ├── Navbar/
    │   ├── Navbar.js                 ← useState, useEffect, useCallback, memo
    │   └── Navbar.css                ← Glassmorphism navbar
    ├── About/
    │   ├── About.js                  ← framer-motion, HeroCanvas, typing CSS
    │   └── about.css                 ← Hero section styles
    ├── Skills/
    │   ├── Skills.js                 ← Custom hook, framer-motion stagger  ← NEW
    │   └── skills.css                ← Skills grid styles                  ← NEW
    ├── Experience/
    │   ├── Experience.js             ← useState, AnimatePresence, timeline
    │   └── style.css                 ← Timeline styles
    ├── Projects/
    │   ├── Projects.js               ← React.memo, whileHover, stagger
    │   └── style.css                 ← Card styles
    ├── Contact/
    │   ├── Contact.js                ← motion.section, scroll animation
    │   └── style.css                 ← Contact styles
    └── Main/
        └── Main.js                   ← Composes all sections
```
