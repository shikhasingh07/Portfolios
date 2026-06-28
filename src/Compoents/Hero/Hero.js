import React, { useState, useEffect, Suspense } from "react";
import "./hero.css";

const TechOrbit = React.lazy(() => import("./TechOrbit"));

const ROLES = [
  "UI Engineer",
  "React.js Developer",
  "Three.js Enthusiast",
  "TypeScript Expert",
  "3D Web Builder",
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/shikhasingh07",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shikha-singh-b027a7179/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:shikha.thakur2295@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

const Hero = () => {
  const [roleIdx, setRoleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping]       = useState(true);

  useEffect(() => {
    const current = ROLES[roleIdx];
    if (typing) {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), 1800);
      return () => clearTimeout(t);
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      }
      setRoleIdx((i) => (i + 1) % ROLES.length);
      setTyping(true);
    }
  }, [displayed, typing, roleIdx]);

  return (
    <>
      {/* ── Fixed social sidebar — left ───────────── */}
      <div className="social-sidebar">
        {SOCIAL_LINKS.map(({ label, href, icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-icon">
            {icon}
          </a>
        ))}
        <span className="social-line" />
      </div>

      {/* ── Fixed email sidebar — right ───────────── */}
      <div className="email-sidebar">
        <a href="mailto:shikha.thakur2295@gmail.com" className="email-sideways">
          shikha.thakur2295@gmail.com
        </a>
        <span className="social-line" />
      </div>

      {/* ── Hero Section ──────────────────────────── */}
      <section className="hero-section" id="data__mainScreen">
        {/* Left: Text */}
        <div className="hero-left">
          <p className="hero-greeting hero-anim hero-anim-1">
            <span className="greeting-dot" />
            Hi, my name is
          </p>

          <h1 className="hero-name hero-anim hero-anim-2">
            Shikha Singh.
          </h1>

          <h2 className="hero-tagline hero-anim hero-anim-3">
            <span className="typewriter-text">{displayed}</span>
            <span className="typewriter-cursor">|</span>
          </h2>

          <p className="hero-desc hero-anim hero-anim-4">
            UI Engineer with <strong>5+ years</strong> building scalable,
            high-performance web &amp; 3D applications with React.js, TypeScript,
            and Three.js. Currently crafting impactful products at{" "}
            <a href="https://india.target.com/" target="_blank" rel="noreferrer" className="highlight-link">
              Target
            </a>
            .
          </p>

          <div className="hero-badges hero-anim hero-anim-4">
            <span className="hero-badge badge-indigo">React.js</span>
            <span className="hero-badge badge-cyan">TypeScript</span>
            <span className="hero-badge badge-purple">Three.js</span>
            <span className="hero-badge badge-gold">AWS</span>
          </div>

          <div className="hero-cta hero-anim hero-anim-5">
            <a
              href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              View Resume ↗
            </a>
            <a href="mailto:shikha.thakur2295@gmail.com" className="btn-outline">
              Get In Touch
            </a>
          </div>
        </div>

        {/* Right: 3D Scene */}
        <div className="hero-right hero-anim hero-anim-2">
          <div className="orbit-container">
            <Suspense fallback={null}>
              <TechOrbit />
            </Suspense>
            <div className="orbit-ring-deco orbit-ring-1" />
            <div className="orbit-ring-deco orbit-ring-2" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
          <span className="scroll-label">scroll</span>
        </div>
      </section>
    </>
  );
};

export default Hero;
