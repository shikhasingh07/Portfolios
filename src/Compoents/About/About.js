import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./about.css";

const STATS = [
  { value: 5,    suffix: "+",  label: "Years Experience",    color: "var(--accent-indigo)" },
  { value: 7000, suffix: "+",  label: "Vendors Onboarded",   color: "var(--accent-cyan)"   },
  { value: 60,   suffix: "%",  label: "Latency Reduced",     color: "var(--accent-purple)" },
  { value: 20,   suffix: "d",  label: "MentorHub Delivered", color: "var(--accent-gold)"   },
];

const StatCounter = ({ value, suffix, label, color, inView }) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const duration = 1400;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (step >= steps) { setCount(value); clearInterval(timer); }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, value]);

  const display = count >= 1000 ? `${(count / 1000).toFixed(count >= 1000 ? 0 : 1)}k` : count;

  return (
    <div className="stat-card glass-card" style={{ "--stat-color": color }}>
      <span className="stat-value" style={{ color }}>
        {display}{suffix}
      </span>
      <span className="stat-label">{label}</span>
      <div className="stat-glow" style={{ background: color }} />
    </div>
  );
};

const About = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="main__about" ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="section-heading">
          <span className="num">01.</span> About Me
        </h2>

        {/* ── Bento grid ─────────────────────────────── */}
        <div className="bento-grid">

          {/* ── Bio card (large) ───────────────────── */}
          <div className="bento-bio glass-card">
            <div className="bio-content">
              <p>
                I'm a <strong>UI Engineer</strong> passionate about building products at the
                intersection of design and engineering. With 5+ years of experience, I've
                shipped high-performance 3D UIs, real-time dashboards, and scalable
                micro-frontend architectures.
              </p>
              <p>
                At{" "}
                <a href="https://india.target.com/" target="_blank" rel="noreferrer" className="highlight-link">
                  Target
                </a>
                , I've built tools used by <strong>7,000+ external vendors</strong>, reduced
                3D rendering latency by <strong>60%</strong>, and launched MentorHub in{" "}
                <strong>20 days</strong> — now deployed org-wide. Recognized with Target's{" "}
                <strong>Quarterly Excellence Award</strong>.
              </p>
              <p className="bio-tech-intro">Things I work with:</p>
              <div className="bio-pills">
                {["JavaScript (ES6+)", "TypeScript", "React.js", "Three.js", "Redux", "Tailwind CSS", "Web Workers", "AWS", "Micro Frontends", "Flutter"].map((s) => (
                  <span key={s} className="bio-pill">
                    <span className="pill-dot" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Photo card ─────────────────────────── */}
          <div className="bento-photo">
            <div className="photo-frame glass-card">
              <img
                src={require("../../Image/profile.jpeg")}
                alt="Shikha Singh"
                className="about-photo"
              />
              <div className="photo-overlay" />
              <div className="photo-badge">
                <span className="badge-dot" />
                Open to work
              </div>
            </div>
          </div>

          {/* ── Stat cards ─────────────────────────── */}
          {STATS.map((s) => (
            <StatCounter key={s.label} {...s} inView={inView} />
          ))}

          {/* ── Fun fact card ───────────────────────── */}
          <div className="bento-fact glass-card">
            <span className="fact-icon">🚀</span>
            <p className="fact-text">
              Built &amp; shipped <strong>MentorHub</strong> — a full-scale internal
              platform — in under <strong>20 days</strong>, earning Target's Quarterly
              Excellence Award.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
