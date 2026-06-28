import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./style.css";

const EXPERIENCES = [
  {
    role: "Software Engineer (SDE-I)",
    company: "Target",
    companyUrl: "https://india.target.com/",
    period: "Jan 2022 – Present",
    location: "Bengaluru, India",
    type: "Full-time",
    color: "#cc0000",
    highlights: [
      "Spearheaded optimization of heavy 3D file handling — reduced package size by 35%, cutting UI load times by 60%, enabling multi-version rendering.",
      "Onboarded 7,000+ external vendors / National Brands by streamlining feature creation and delivering key features in under 3 months.",
      "Built Artist Availability Dashboard — tracks real-time bandwidth across 500+ artists, saving 100+ hours/month in scheduling.",
      "Developed AI-powered Reporting Platform used by 1,000+ team members generating 10–15 reports/week, eliminating manual reporting.",
      "Optimized API latency by 55% with AI-powered asset comparison; doubled transcoding speed via Web Workers.",
      "Built MentorHub in under 20 days — org-wide mentorship platform. Earned Target's Quarterly Excellence Award.",
      "Delivered Elevate mobile app in 2 months — adopted by 500+ users for sessions, attendance, and team engagement.",
    ],
    tech: ["React.js", "TypeScript", "Three.js", "Web Workers", "Redux", "Tailwind CSS", "AWS", "Micro Frontend"],
  },
  {
    role: "Software Engineer (SDE-I)",
    company: "Capgemini Engineering",
    companyUrl: "#",
    period: "Nov 2020 – Jan 2022",
    location: "Gurugram, India",
    type: "Full-time",
    color: "#0070ad",
    highlights: [
      "Built Logistka from scratch — architecting the dashboard, attendance tracker, and login system.",
      "Implemented comprehensive test coverage using Jest, achieving 99.9% code reliability.",
      "Led end-to-end development of the LIC project, driving core feature implementation within 4 months.",
      "Delivered real-time workflow solutions serving 6,000+ workers with a React-based recommendation model.",
    ],
    tech: ["React.js", "Redux", "TypeScript", "Jest", "CI/CD"],
  },
  {
    role: "Engineer Intern",
    company: "Altran (Capgemini)",
    companyUrl: "#",
    period: "Feb 2020 – Jun 2020",
    location: "Gurugram, India",
    type: "Internship",
    color: "#6366f1",
    highlights: [
      "Built frontend components using React.js as part of a 5-month engineering internship.",
      "Completed Java assignments, bug fixes, code reviews, and documentation.",
      "Transitioned into a full-time Software Engineer role post-internship.",
    ],
    tech: ["React.js", "Java", "Spring"],
  },
];

const Experience = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="section" id="Experience">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="section-heading">
          <span className="num">02.</span> Where I've Worked
        </h2>

        <div className="exp-layout">
          {/* ── Tab list ────────────────────────────── */}
          <div className="exp-tabs" role="tablist">
            {EXPERIENCES.map(({ company, color }, i) => (
              <button
                key={company}
                role="tab"
                aria-selected={active === i}
                className={`exp-tab ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
                style={{ "--tab-color": color }}
              >
                <span className="tab-dot" style={{ background: active === i ? color : undefined }} />
                {company}
              </button>
            ))}
            <div
              className="tab-indicator"
              style={{ transform: `translateY(${active * 52}px)` }}
            />
          </div>

          {/* ── Detail panel ────────────────────────── */}
          <div className="exp-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <div className="exp-header">
                  <div className="exp-title-row">
                    <h3 className="exp-role">
                      {EXPERIENCES[active].role}{" "}
                      <a
                        href={EXPERIENCES[active].companyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="exp-company"
                        style={{ color: EXPERIENCES[active].color }}
                      >
                        @ {EXPERIENCES[active].company}
                      </a>
                    </h3>
                    <span className="exp-type-badge">{EXPERIENCES[active].type}</span>
                  </div>
                  <p className="exp-meta">
                    <span className="meta-icon">📅</span>
                    {EXPERIENCES[active].period}
                    <span className="meta-sep">·</span>
                    <span className="meta-icon">📍</span>
                    {EXPERIENCES[active].location}
                  </p>
                </div>

                <ul className="exp-highlights">
                  {EXPERIENCES[active].highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <span className="exp-bullet" style={{ color: EXPERIENCES[active].color }}>▹</span>
                      {h}
                    </motion.li>
                  ))}
                </ul>

                <div className="exp-tech-list">
                  {EXPERIENCES[active].tech.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;
