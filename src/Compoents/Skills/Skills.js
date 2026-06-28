import React from "react";
import { motion } from "framer-motion";
import "./skills.css";

const SKILL_GROUPS = [
  {
    category: "Frontend",
    color: "#6366f1",
    skills: [
      { name: "React.js",     icon: "⚛️",  level: 95 },
      { name: "TypeScript",   icon: "📘",  level: 90 },
      { name: "JavaScript",   icon: "⚡",  level: 92 },
      { name: "Three.js",     icon: "🌐",  level: 85 },
      { name: "Tailwind CSS", icon: "🌊",  level: 88 },
      { name: "Redux",        icon: "🔄",  level: 87 },
    ],
  },
  {
    category: "Platform & Tools",
    color: "#06b6d4",
    skills: [
      { name: "Web Workers",    icon: "⚙️",  level: 85 },
      { name: "AWS",            icon: "☁️",  level: 75 },
      { name: "Micro Frontend", icon: "🧩",  level: 82 },
      { name: "Flutter",        icon: "📱",  level: 72 },
      { name: "Git / CI/CD",    icon: "🔧",  level: 88 },
      { name: "MySQL",          icon: "🗄️",  level: 70 },
    ],
  },
  {
    category: "Testing & AI",
    color: "#a78bfa",
    skills: [
      { name: "Jest",         icon: "🧪",  level: 88 },
      { name: "Cypress",      icon: "🌲",  level: 75 },
      { name: "Gen AI / LLM", icon: "🤖",  level: 78 },
      { name: "Prompt Eng.",  icon: "💬",  level: 80 },
    ],
  },
];

const TiltCard = ({ name, icon, level, color }) => {
  const cardRef = React.useRef(null);

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(600px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) translateZ(8px)`;
    cardRef.current.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    cardRef.current.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      className="skill-card glass-card"
      style={{ "--skill-color": color }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="skill-shine" />
      <span className="skill-icon">{icon}</span>
      <span className="skill-name">{name}</span>
      <div className="skill-bar-wrap">
        <div className="skill-bar-fill" style={{ width: `${level}%`, background: color }} />
      </div>
      <div className="skill-glow-dot" style={{ background: color }} />
    </div>
  );
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

const Skills = () => {
  return (
    <section className="section" id="skills">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="section-heading">
          <span className="num">04.</span> Skills &amp; Technologies
        </h2>

        <div className="skills-groups">
          {SKILL_GROUPS.map(({ category, color, skills }) => (
            <div key={category} className="skills-group">
              <div className="group-header">
                <div className="group-dot" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
                <h3 className="group-title" style={{ color }}>{category}</h3>
              </div>

              <motion.div
                className="skills-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {skills.map(({ name, icon, level }) => (
                  <motion.div key={name} variants={itemVariants}>
                    <TiltCard name={name} icon={icon} level={level} color={color} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Skills);
