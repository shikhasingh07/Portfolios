/**
 * About.js — Hero Section
 *
 * REACT CONCEPTS USED:
 *   - React.lazy + Suspense : HeroCanvas lazy-loaded (doesn't block first paint)
 *   - Static data outside   : SOCIAL_LINKS array at module level — never re-created
 *   - CSS animations        : hero entrance uses pure CSS @keyframes (more reliable
 *                             than framer-motion for initial load — no hydration race)
 *   - motion.div            : used only for the About Me scroll section (whileInView)
 */
import React from "react";
import { motion } from "framer-motion";
import "./about.css";

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

const About = () => {
  return (
    <>
      {/* ── Fixed social sidebar — left ───────────────────── */}
      <div className="social-sidebar">
        {SOCIAL_LINKS.map(({ label, href, icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-icon">
            {icon}
          </a>
        ))}
        <span className="social-line" />
      </div>

      {/* ── Fixed email sidebar — right ───────────────────── */}
      <div className="email-sidebar">
        <a href="mailto:shikha.thakur2295@gmail.com" className="email-sideways">
          shikha.thakur2295@gmail.com
        </a>
        <span className="social-line" />
      </div>

      {/* ── Hero section ─────────────────────────────────── */}
      <section className="hero-section" id="data__mainScreen">
        <div className="hero-content">
          {/* CSS animations — staggered via animation-delay, no JS dependency */}
          <p className="hero-greeting hero-anim hero-anim-1">
            Hi, my name is
          </p>

          <h1 className="hero-name hero-anim hero-anim-2">
            Shikha Singh.
          </h1>

          <h2 className="hero-tagline hero-anim hero-anim-3">
            I build high-performance{" "}
            <span className="gradient-text">3D web experiences.</span>
          </h2>

          <p className="hero-desc hero-anim hero-anim-4">
            UI Engineer with <strong>5+ years</strong> of experience crafting scalable
            web &amp; mobile solutions using React.js, TypeScript, and Three.js.
            Currently building impactful products at{" "}
            <a href="https://india.target.com/" target="_blank" rel="noreferrer" className="highlight-link">
              Target
            </a>
            .
          </p>

          <div className="hero-cta hero-anim hero-anim-5">
            <a
              href="https://drive.google.com/file/d/1mgQwCrwJktTW_24LPme-w1fg2x4_QKgI/view?usp=sharing"
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

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      {/* ── About Me section ─────────────────────────────── */}
      <section className="section" id="main__about">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="section-heading">
            <span className="num">01.</span> About Me
          </h2>

          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm a UI Engineer passionate about building products at the intersection
                of design and engineering. With 5+ years of experience, I've
                delivered high-performance 3D UIs, real-time dashboards, and
                scalable micro-frontend architectures.
              </p>
              <p>
                At{" "}
                <a href="https://india.target.com/" target="_blank" rel="noreferrer" className="highlight-link">
                  Target
                </a>
                , I built tools adopted by <strong>7,000+ external vendors</strong>,
                reduced 3D rendering latency by <strong>60%</strong>, and launched
                MentorHub in <strong>20 days</strong> — now deployed organization-wide.
                Recognized with Target's <strong>Quarterly Excellence Award</strong>.
              </p>
              <p>Technologies I work with:</p>
              <ul className="skills-pill-list">
                {["JavaScript (ES6+)", "TypeScript", "React.js", "Three.js", "Redux", "Tailwind CSS", "Web Workers", "AWS"].map((s) => (
                  <li key={s}><span className="pill-arrow">▹</span>{s}</li>
                ))}
              </ul>
            </div>

            <div className="about-image-wrap">
              <div className="about-image-frame">
                <img src={require("../../Image/profile.jpeg")} alt="Shikha Singh" className="about-photo" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default About;
