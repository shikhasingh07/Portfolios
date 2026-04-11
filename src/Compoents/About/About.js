/**
 * About.js — Hero Section
 *
 * REACT CONCEPTS USED:
 *   - React.lazy + Suspense : HeroCanvas (Three.js) is lazy-loaded so the
 *                             3D bundle doesn't block the initial page paint
 *   - framer-motion         : motion.div/h1/p for declarative entrance animations
 *                             using `initial`, `animate`, `transition` props
 *   - useEffect             : drives the CSS typing animation trigger on mount
 *   - Static data outside   : social links array defined outside component —
 *                             avoids re-creating on every render
 */
import React from "react";
import { motion } from "framer-motion";
import "./about.css";

// Lazy-load the heavy Three.js canvas — keeps initial bundle lean
const HeroCanvas = React.lazy(() => import("../Hero/HeroCanvas"));

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

// framer-motion variants — defined outside component (stable reference)
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const About = () => {
  return (
    <>
      {/* ── Fixed social sidebar ─────────────────────────── */}
      <div className="social-sidebar">
        {SOCIAL_LINKS.map(({ label, href, icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-icon">
            {icon}
          </a>
        ))}
        <span className="social-line" />
      </div>

      {/* ── Fixed email sidebar ──────────────────────────── */}
      <div className="email-sidebar">
        <a href="mailto:shikha.thakur2295@gmail.com" className="email-sideways">
          shikha.thakur2295@gmail.com
        </a>
        <span className="social-line" />
      </div>

      {/* ── Hero section ─────────────────────────────────── */}
      <section className="hero-section" id="data__mainScreen">
        {/* Three.js canvas — lazy loaded, shown after JS bundle loads */}
        <React.Suspense fallback={null}>
          <HeroCanvas />
        </React.Suspense>

        {/* Content — framer-motion staggered entrance */}
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="hero-greeting" variants={itemVariants}>
            Hi, my name is
          </motion.p>

          <motion.h1 className="hero-name" variants={itemVariants}>
            Shikha Singh.
          </motion.h1>

          <motion.h2 className="hero-tagline" variants={itemVariants}>
            I build high-performance
            <span className="typing-wrap">
              <span className="typing-text"> 3D web experiences.</span>
            </span>
          </motion.h2>

          <motion.p className="hero-desc" variants={itemVariants}>
            UI Engineer with <strong>5+ years</strong> of experience crafting scalable web & mobile solutions
            using React.js, TypeScript, and Three.js. Currently building impactful products at{" "}
            <a href="https://india.target.com/" target="_blank" rel="noreferrer" className="highlight-link">
              Target
            </a>
            .
          </motion.p>

          <motion.div className="hero-cta" variants={itemVariants}>
            <a
              href="https://drive.google.com/file/d/1rwG4ZgRDbhcZhMLnHZlHi41JN01BTEWC/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              View Resume ↗
            </a>
            <a href="mailto:shikha.thakur2295@gmail.com" className="btn-outline">
              Get In Touch
            </a>
          </motion.div>
        </motion.div>

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
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading">
            <span className="num">01.</span> About Me
          </h2>

          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm a UI Engineer who loves building products that live at the intersection of design and technology.
                With 5+ years of experience, I've delivered high-performance 3D UIs, real-time dashboards,
                and scalable micro-frontend architectures.
              </p>
              <p>
                At <a href="https://india.target.com/" target="_blank" rel="noreferrer" className="highlight-link">Target</a>,
                I've shipped tools used by <strong>7000+ external vendors</strong>, reduced 3D rendering latency
                by <strong>60%</strong>, and delivered the MentorHub internal platform in <strong>20 days</strong> —
                now used across the entire org. I was recognized with Target's Quarterly Excellence Award for it.
              </p>
              <p>Here are a few technologies I've been working with recently:</p>
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
