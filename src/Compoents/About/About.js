import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./about.css";

const STATS = [
  { value: 5,  suffix: "+",  label: "Years Exp.",        color: "#8b5cf6" },
  { value: 7,  suffix: "K+", label: "Vendors Onboarded", color: "#06b6d4" },
  { value: 60, suffix: "%",  label: "Latency Reduced",   color: "#f43f5e" },
  { value: 20, suffix: "d",  label: "MVP Delivered",     color: "#f59e0b" },
];

const TECH = [
  "React.js", "TypeScript", "Three.js", "Redux",
  "Tailwind CSS", "Web Workers", "AWS", "Micro Frontend",
  "Flutter", "Generative AI", "Jest", "Cypress",
];

const HIGHLIGHTS = [
  { label: "UI Engineer @ Target", since: "Jan 2022 – Present" },
  { label: "B.Tech CS · Amity University", since: "2020" },
  { label: "React · TypeScript · Three.js", since: "Core Stack" },
  { label: "Delhi NCR · Open to work", since: "Actively hiring" },
];

const Counter = ({ value, suffix, inView }) => {
  const [count, setCount] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!inView || ran.current) return;
    ran.current = true;
    const steps = 50;
    const ms    = 1400 / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCount(Math.round(ease * value));
      if (step >= steps) { setCount(value); clearInterval(t); }
    }, ms);
    return () => clearInterval(t);
  }, [inView, value]);

  return <>{count}{suffix}</>;
};

const About = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section about-section" id="main__about" ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="section-heading">
          <span className="num">01.</span> About Me
        </h2>

        {/* ── Main two-column layout ───────────────── */}
        <div className="about-layout">

          {/* Left — stylised profile card (no photo) */}
          <div className="about-card-col">
            <div className="profile-card">
              {/* Gradient orb */}
              <div className="card-orb card-orb-1" />
              <div className="card-orb card-orb-2" />

              {/* Initials avatar */}
              <div className="card-avatar">
                <span className="avatar-initials">SS</span>
                <div className="avatar-ring" />
              </div>

              <div className="card-name">Shikha Singh</div>
              <div className="card-role">UI Engineer</div>

              <div className="card-avail">
                <span className="avail-dot" />
                <span>Available · Delhi NCR</span>
              </div>

              {/* Highlight list */}
              <ul className="card-highlights">
                {HIGHLIGHTS.map(({ label, since }) => (
                  <li key={label}>
                    <span className="hl-label">{label}</span>
                    <span className="hl-since">{since}</span>
                  </li>
                ))}
              </ul>

              {/* CTA row */}
              <div className="card-links">
                <a
                  href="https://github.com/shikhasingh07"
                  target="_blank"
                  rel="noreferrer"
                  className="card-link-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/shikha-singh-b027a7179/"
                  target="_blank"
                  rel="noreferrer"
                  className="card-link-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div className="about-content-col">
            <p className="about-statement">
              I craft <span className="stmt-highlight">high-performance 3D&nbsp;web
              experiences</span> that scale to millions.
            </p>

            <p className="about-body">
              UI Engineer with <strong>5+ years</strong> building at the intersection of
              engineering and design. At{" "}
              <a href="https://india.target.com/" target="_blank" rel="noreferrer"
                 className="inline-link">Target</a>{" "}
              I've shipped 3D asset platforms serving 7,000+ vendors, an AI-powered
              reporting tool used by 1,000+ teammates, and built MentorHub —
              an org-wide platform — in under 20 days.
            </p>

            <p className="about-body">
              Currently looking for <strong>frontend / UI engineering roles in Delhi NCR</strong>{" "}
              where my Three.js, React, and performance expertise can drive real impact.
            </p>

            {/* Stat row */}
            <div className="about-stats-row">
              {STATS.map(({ value, suffix, label, color }) => (
                <div key={label} className="about-stat" style={{ "--c": color }}>
                  <span className="astat-num">
                    <Counter value={value} suffix={suffix} inView={inView} />
                  </span>
                  <span className="astat-lbl">{label}</span>
                </div>
              ))}
            </div>

            {/* Tech */}
            <div className="about-tech-label">Things I work with —</div>
            <div className="tech-pills">
              {TECH.map((t) => (
                <span key={t} className="tech-pill">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Achievement strip ─────────────────────────────── */}
        <div className="achievement-strip">
          <div className="ach-card">
            <span className="ach-icon">🏆</span>
            <div>
              <div className="ach-title">Quarterly Excellence Award</div>
              <div className="ach-sub">Target — MentorHub in 20 days</div>
            </div>
          </div>
          <div className="strip-divider" />
          <div className="ach-card">
            <span className="ach-icon">🤖</span>
            <div>
              <div className="ach-title">AI-Powered Reporting Platform</div>
              <div className="ach-sub">1,000+ users · 10–15 reports/week</div>
            </div>
          </div>
          <div className="strip-divider" />
          <div className="ach-card">
            <span className="ach-icon">🌐</span>
            <div>
              <div className="ach-title">3D Performance Lead</div>
              <div className="ach-sub">35% package ↓ · 60% latency ↓</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
