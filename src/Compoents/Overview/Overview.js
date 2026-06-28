import React from "react";
import { motion } from "framer-motion";
import "./overview.css";

const SKILLS = [
  { name: "React.js",     level: 95, color: "#61dafb" },
  { name: "TypeScript",   level: 90, color: "#3178c6" },
  { name: "Three.js",     level: 85, color: "#bf00ff" },
  { name: "Redux",        level: 88, color: "#764abc" },
  { name: "Tailwind CSS", level: 87, color: "#00f5ff" },
  { name: "Web Workers",  level: 83, color: "#00ff9f" },
  { name: "AWS",          level: 74, color: "#ff9900" },
  { name: "Flutter",      level: 71, color: "#54c5f8" },
];

const EXP = [
  {
    role: "Software Engineer (SDE-I)",
    company: "Target",
    period: "Jan 2022 – Present",
    color: "#ff2d78",
    bullets: [
      "Reduced 3D package size 35%, UI load time 60%",
      "Onboarded 7,000+ vendors; AI reporting for 1,000+ users",
      "MentorHub in 20 days — Quarterly Excellence Award",
    ],
  },
  {
    role: "Software Engineer (SDE-I)",
    company: "Capgemini Engineering",
    period: "Nov 2020 – Jan 2022",
    color: "#00f5ff",
    bullets: [
      "Built Logistka from scratch — React, Redux, TypeScript",
      "99.9% code reliability via Jest; 6,000+ worker workflows",
    ],
  },
];

const TiltCard = ({ name, level, color }) => {
  const ref = React.useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    ref.current.style.transform = `perspective(500px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(6px)`;
  };
  const leave = () => { ref.current.style.transform = ""; };

  return (
    <div ref={ref} className="skill-tile glass-card" style={{ "--c": color }}
         onMouseMove={move} onMouseLeave={leave}>
      <div className="skill-tile-name">{name}</div>
      <div className="skill-bar-bg">
        <motion.div className="skill-bar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ background: color }}
        />
      </div>
      <div className="skill-tile-pct">{level}%</div>
    </div>
  );
};

const Overview = () => (
  <section className="section" id="main__about">
    <h2 className="section-heading"><span className="num">01 //</span> OVERVIEW</h2>

    <div className="overview-grid">
      {/* ── Left: Bio + Experience ─── */}
      <div className="overview-left">
        <p className="bio-text">
          UI Engineer with <span className="accent-cyan">5+ years</span> building
          scalable, high-performance web &amp; 3D applications. Currently at{" "}
          <span className="accent-pink">Target, Bengaluru</span> — shipping
          platforms used by thousands. Open to <span className="accent-cyan">
          frontend roles in Delhi NCR</span>.
        </p>

        <div className="exp-list">
          {EXP.map(({ role, company, period, color, bullets }) => (
            <motion.div key={company} className="exp-item glass-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ "--border": color }}
            >
              <div className="exp-top">
                <div>
                  <div className="exp-role">{role}</div>
                  <div className="exp-co" style={{ color }}>{company}</div>
                </div>
                <span className="neon-tag">{period}</span>
              </div>
              <ul className="exp-bullets">
                {bullets.map((b) => (
                  <li key={b}><span className="bul-dot" style={{ background: color }} />{b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right: Skills ─────────── */}
      <div className="overview-right">
        <div className="skills-label">TECH STACK</div>
        <div className="skills-tiles">
          {SKILLS.map((s) => <TiltCard key={s.name} {...s} />)}
        </div>
      </div>
    </div>
  </section>
);

export default Overview;
