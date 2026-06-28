import React, { useRef } from "react";
import { motion } from "framer-motion";
import "./style.css";

const PROJECTS = [
  {
    title: "AssetHub / GGA Platform",
    label: "Target · Internal",
    summary:
      "3D asset management platform serving 7,000+ external vendors and national brands. Handles heavy 3D file rendering with multi-version support. Reduced UI load latency by 60% and optimized API response by 55% using AI-powered asset comparison and Web Workers.",
    tech: ["React.js", "Three.js", "TypeScript", "Web Workers", "Redux", "AWS"],
    link: null,
    featured: true,
    accent: "#6366f1",
    icon: "🎨",
  },
  {
    title: "AI-Powered Reporting Platform",
    label: "Target · Internal",
    summary:
      "Used by 1,000+ team members to instantly generate project reports covering TCIN status, artist assignments, launch/production dates, and production phases. Generates 10–15 reports/week, eliminating manual report creation across teams.",
    tech: ["React.js", "TypeScript", "Generative AI", "LLM Integration", "Redux"],
    link: null,
    featured: true,
    accent: "#06b6d4",
    icon: "🤖",
  },
  {
    title: "Artist Availability Dashboard",
    label: "Target · Internal",
    summary:
      "Full-featured internal tool enabling 3D managers to track real-time UI artist bandwidth across 500+ artists. Saved 100+ hours/month in manual scheduling coordination.",
    tech: ["React.js", "TypeScript", "Tailwind CSS", "Real-time Dashboards"],
    link: null,
    featured: false,
    accent: "#a78bfa",
    icon: "📊",
  },
  {
    title: "MentorHub",
    label: "Target · Internal",
    summary:
      "Full-scale internal mentorship platform for scheduling sessions, tracking attendance, and managing team engagement. Delivered MVP in 20 days — deployed org-wide. Earned Target's Quarterly Excellence Award.",
    tech: ["React.js", "TypeScript", "Redux", "Tailwind CSS"],
    link: null,
    featured: false,
    accent: "#f59e0b",
    icon: "🚀",
  },
  {
    title: "Elevate App",
    label: "Target · Mobile",
    summary:
      "Mobile application enabling 500+ users to manage team sessions, food reservations, attendance, and mentorship. Delivered end-to-end in 2 months using Flutter.",
    tech: ["Flutter", "React.js", "TypeScript"],
    link: null,
    featured: false,
    accent: "#34d399",
    icon: "📱",
  },
  {
    title: "Memories",
    label: "Personal Project",
    summary:
      "Social media application for sharing memorable life events. Features JWT authentication, Google OAuth, and full CRUD. Full-stack with Node.js + MongoDB.",
    tech: ["React.js", "Redux", "Node.js", "Express.js", "MongoDB", "JWT", "OAuth"],
    link: "https://github.com/shikhasingh07/memories",
    featured: false,
    accent: "#ec4899",
    icon: "💾",
  },
];

const SpotlightCard = ({ project }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mx", `${x}px`);
    cardRef.current.style.setProperty("--my", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`project-card glass-card ${project.featured ? "project-featured" : ""}`}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{ "--accent": project.accent }}
    >
      <div className="spotlight-layer" />

      <div className="project-top">
        <span className="project-icon">{project.icon}</span>
        <div className="project-links">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="project-link-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          )}
        </div>
      </div>

      <span className="project-label">{project.label}</span>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.summary}</p>

      <ul className="project-tech">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {project.featured && <div className="featured-badge">Featured</div>}
    </motion.div>
  );
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Projects = () => {
  return (
    <section className="section" id="Build">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="section-heading">
          <span className="num">03.</span> What I've Built
        </h2>

        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <motion.div key={p.title} variants={cardVariants}>
              <SpotlightCard project={p} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Projects);
