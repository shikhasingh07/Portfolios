import React, { useRef } from "react";
import { motion } from "framer-motion";
import "./work.css";

const PROJECTS = [
  {
    id: "01",
    title: "AssetHub / GGA Platform",
    tag: "Target · Enterprise",
    desc: "3D asset management platform for 7,000+ external vendors. 60% load time reduction, 55% API latency cut using AI-powered comparisons & Web Workers.",
    tech: ["React.js", "Three.js", "TypeScript", "Web Workers", "AWS"],
    accent: "#00f5ff",
    link: null,
  },
  {
    id: "02",
    title: "AI Reporting Platform",
    tag: "Target · Internal",
    desc: "Generates project reports instantly for 1,000+ team members. 10–15 reports/week, eliminated manual work entirely.",
    tech: ["React.js", "TypeScript", "Gen AI", "LLM Integration"],
    accent: "#ff2d78",
    link: null,
  },
  {
    id: "03",
    title: "MentorHub",
    tag: "Target · Internal",
    desc: "Full-scale mentorship scheduling platform. Delivered in 20 days, deployed org-wide. Earned Quarterly Excellence Award.",
    tech: ["React.js", "TypeScript", "Redux", "Tailwind CSS"],
    accent: "#bf00ff",
    link: null,
  },
  {
    id: "04",
    title: "Memories — Social App",
    tag: "Personal Project",
    desc: "Full-stack social media app with JWT auth, Google OAuth, and CRUD. React + Node.js + MongoDB.",
    tech: ["React.js", "Node.js", "MongoDB", "JWT", "OAuth"],
    accent: "#00ff9f",
    link: "https://github.com/shikhasingh07/memories",
  },
];

const ProjectCard = ({ project }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 18;
    ref.current.style.setProperty("--rx", `${-y}deg`);
    ref.current.style.setProperty("--ry", `${x}deg`);
    ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty("--my", `${((e.clientY - r.top)  / r.height) * 100}%`);
    ref.current.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(8px)`;
  };

  const onLeave = () => {
    ref.current.style.transform = "";
  };

  return (
    <motion.div
      ref={ref}
      className="proj-card glass-card"
      style={{ "--accent": project.accent }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Spotlight hover */}
      <div className="proj-spotlight" />

      <div className="proj-top">
        <span className="proj-id">{project.id}</span>
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className="proj-gh" data-cursor>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        )}
      </div>

      <div className="proj-tag">{project.tag}</div>
      <h3 className="proj-title">{project.title}</h3>
      <p className="proj-desc">{project.desc}</p>

      <div className="proj-tech">
        {project.tech.map((t) => (
          <span key={t} className="proj-tag-item">{t}</span>
        ))}
      </div>
    </motion.div>
  );
};

const Work = () => (
  <section className="section" id="Build">
    <h2 className="section-heading"><span className="num">02 //</span> WORK</h2>
    <div className="work-grid">
      {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  </section>
);

export default Work;
