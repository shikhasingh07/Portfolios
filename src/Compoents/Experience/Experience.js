/**
 * Experience.js — Work History Timeline
 *
 * REACT CONCEPTS USED:
 *   - useState         : tracks which timeline item is expanded (activeIndex)
 *   - AnimatePresence  : enables exit animations when the active item changes.
 *                        Without it, the outgoing item would disappear instantly.
 *   - motion.div       : declarative slide-in for the detail panel
 *   - useScrollAnimation(): custom hook for scroll-triggered entrance
 *   - Static data outside: EXPERIENCES array defined once, not recreated per render
 *
 * PATTERN: Controlled component — activeIndex state lives here and is passed
 * down to child markup as props/data. Single source of truth.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "./style.css";

// Experience data — defined outside component (stable reference)
const EXPERIENCES = [
  {
    role: "Software Engineer (SDE-I)",
    company: "Target",
    companyUrl: "https://india.target.com/",
    period: "Jan 2022 – Present",
    location: "Bengaluru",
    highlights: [
      "Spearheaded optimization of heavy 3D file handling — reduced package size by 35%, cutting UI load times and latency by 60%, and enabling multi-version rendering.",
      "Onboarded 7000+ external vendors/National Brands by streamlining feature creation requests and delivering key features in under 3 months.",
      "Optimized API latency by 55% using AI-powered asset size comparison and doubled transcoding speed via Web Workers.",
      "Built MentorHub (internal platform) in under 20 days — now deployed organization-wide. Received Target's Quarterly Excellence Award.",
      "Delivered Elevate App in 2 months, enabling 500+ users to manage sessions, attendance, food reservations, and mentorship.",
    ],
    tech: ["React.js", "TypeScript", "Three.js", "Web Workers", "Redux", "Tailwind CSS", "AWS", "Micro Frontend"],
  },
  {
    role: "Software Engineer (SDE-I)",
    company: "Capgemini",
    companyUrl: "#",
    period: "Nov 2020 – Jan 2022",
    location: "Gurugram",
    highlights: [
      "Developed a full application from scratch in React.js, architecting core features and workflows.",
      "Implemented a comprehensive testing suite achieving 99.9% code reliability.",
      "Spearheaded end-to-end development of the LIC project, driving core feature implementation with a successful launch within 4 months.",
      "Delivered solutions for real-time workflows serving 6,000+ workers, integrating a new React-based recommendation model.",
    ],
    tech: ["React.js", "Redux", "TypeScript", "Jest", "CI/CD"],
  },
  {
    role: "Intern — Java",
    company: "Altran (Capgemini)",
    companyUrl: "#",
    period: "Jan 2020 – Jun 2020",
    location: "Noida",
    highlights: [
      "Recruited through campus placements at Amity University.",
      "Completed Java assignments, bug fixes, code reviews, and documentation.",
      "Transitioned into a full-time Software Engineer role post-internship.",
    ],
    tech: ["Java", "Spring"],
  },
];

const Experience = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionRef, inView] = useScrollAnimation(0.1);

  return (
    <section className="section" id="Experience" ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">
          <span className="num">02.</span> Where I've Worked
        </h2>

        <div className="exp-layout">
          {/* ── Tab list ── */}
          <div className="exp-tabs" role="tablist">
            {EXPERIENCES.map(({ company }, i) => (
              <button
                key={company}
                role="tab"
                aria-selected={activeIndex === i}
                className={`exp-tab ${activeIndex === i ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              >
                {company}
              </button>
            ))}
            {/* Active indicator bar */}
            <div
              className="tab-indicator"
              style={{ transform: `translateY(${activeIndex * 48}px)` }}
            />
          </div>

          {/* ── Detail panel — AnimatePresence enables exit animation ── */}
          <div className="exp-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div className="exp-header">
                  <h3 className="exp-role">
                    {EXPERIENCES[activeIndex].role}{" "}
                    <a
                      href={EXPERIENCES[activeIndex].companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="exp-company"
                    >
                      @ {EXPERIENCES[activeIndex].company}
                    </a>
                  </h3>
                  <p className="exp-meta">
                    <span className="exp-period">{EXPERIENCES[activeIndex].period}</span>
                    <span className="exp-dot">·</span>
                    <span>{EXPERIENCES[activeIndex].location}</span>
                  </p>
                </div>

                <ul className="exp-highlights">
                  {EXPERIENCES[activeIndex].highlights.map((h, i) => (
                    <li key={i}>
                      <span className="exp-bullet">▹</span>
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="exp-tech-list">
                  {EXPERIENCES[activeIndex].tech.map((t) => (
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
