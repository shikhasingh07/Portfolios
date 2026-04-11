/**
 * Skills.js — Tech Stack Section (NEW COMPONENT)
 *
 * REACT CONCEPTS USED:
 *   - useScrollAnimation()  : custom hook — IntersectionObserver triggers
 *                             animation when section scrolls into view
 *   - motion.div (framer)   : `variants` + `staggerChildren` cascade each
 *                             card in one after the other automatically
 *   - Static data outside   : SKILLS array defined outside component so it
 *                             is created once, not on every render
 *   - React.memo            : wraps export — this component has no props that
 *                             change, so memo prevents any re-renders
 */
import React from "react";
import { motion } from "framer-motion";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "./skills.css";

// Static data — defined outside component (stable reference, never re-created)
const SKILLS = [
  { name: "React.js",      icon: "⚛️",  color: "#61dafb" },
  { name: "TypeScript",    icon: "📘",  color: "#3178c6" },
  { name: "JavaScript",    icon: "⚡",  color: "#f7df1e" },
  { name: "Three.js",      icon: "🎯",  color: "#a78bfa" },
  { name: "Redux",         icon: "🔄",  color: "#764abc" },
  { name: "Tailwind CSS",  icon: "🌊",  color: "#06b6d4" },
  { name: "Web Workers",   icon: "⚙️",  color: "#10b981" },
  { name: "AWS",           icon: "☁️",  color: "#ff9900" },
  { name: "Jest",          icon: "🧪",  color: "#c21325" },
  { name: "Cypress",       icon: "🌲",  color: "#17202c" },
  { name: "Flutter",       icon: "📱",  color: "#54c5f8" },
  { name: "Micro Frontend",icon: "🧩",  color: "#6366f1" },
];

// framer-motion variants — outside component (stable)
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const Skills = () => {
  // Custom hook: ref attaches to the section; inView flips true when visible
  const [sectionRef, inView] = useScrollAnimation(0.1);

  return (
    <section className="section" id="skills" ref={sectionRef}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <h2 className="section-heading">
          <span className="num">04.</span> Skills &amp; Technologies
        </h2>

        <div className="skills-grid">
          {SKILLS.map(({ name, icon, color }) => (
            // whileHover on individual cards for interactive lift
            <motion.div
              key={name}
              className="skill-card glass-card"
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.2 } }}
              style={{ "--skill-color": color }}
            >
              <span className="skill-icon">{icon}</span>
              <span className="skill-name">{name}</span>
              <div className="skill-glow" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Skills);
