import React, { useState, useEffect } from "react";
import "./hero.css";

const ROLES = ["UI Engineer", "React.js Developer", "Three.js Builder", "TypeScript Expert", "3D Web Specialist"];

const STATS = [
  { n: "5+",  l: "Years Exp"   },
  { n: "7K+", l: "Vendors"     },
  { n: "60%", l: "Faster"      },
  { n: "20d", l: "MVP"         },
];

const Hero = () => {
  const [roleIdx,   setRoleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing,    setTyping]    = useState(true);

  useEffect(() => {
    const cur = ROLES[roleIdx];
    if (typing) {
      if (displayed.length < cur.length) {
        const t = setTimeout(() => setDisplayed(cur.slice(0, displayed.length + 1)), 72);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), 2000);
      return () => clearTimeout(t);
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(t);
      }
      setRoleIdx((i) => (i + 1) % ROLES.length);
      setTyping(true);
    }
  }, [displayed, typing, roleIdx]);

  return (
    <section className="hero-section" id="data__mainScreen">
      {/* Centered content floating above the galaxy */}
      <div className="hero-center">

        {/* Availability badge */}
        <div className="hero-badge">
          <span className="badge-dot" />
          Open to opportunities · Delhi NCR
        </div>

        {/* Name */}
        <h1 className="hero-name">
          <span className="name-line-1">Shikha</span>
          <span className="name-line-2">Singh.</span>
        </h1>

        {/* Typewriter role */}
        <div className="hero-role">
          <span className="role-text">{displayed}</span>
          <span className="role-cursor">|</span>
        </div>

        {/* Description */}
        <p className="hero-desc">
          UI Engineer crafting <strong>high-performance 3D web experiences</strong>{" "}
          with React.js, TypeScript &amp; Three.js.
          Currently at{" "}
          <a href="https://india.target.com/" target="_blank" rel="noreferrer" className="hero-link">
            Target
          </a>
          , open to roles in Delhi NCR.
        </p>

        {/* CTAs */}
        <div className="hero-cta">
          <a
            href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
            target="_blank" rel="noreferrer"
            className="btn-primary"
          >
            View Resume
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
          <a href="#contact" className="btn-outline">Get In Touch</a>
          <a href="https://github.com/shikhasingh07" target="_blank" rel="noreferrer" className="hero-icon-link" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/shikha-singh-b027a7179/" target="_blank" rel="noreferrer" className="hero-icon-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {STATS.map(({ n, l }, i) => (
            <React.Fragment key={l}>
              {i > 0 && <div className="stat-div" />}
              <div className="stat-item">
                <span className="stat-n">{n}</span>
                <span className="stat-l">{l}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Drag hint */}
        <p className="drag-hint">✦ drag to explore the galaxy ✦</p>
      </div>
    </section>
  );
};

export default Hero;
