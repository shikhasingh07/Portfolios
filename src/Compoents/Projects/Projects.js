/**
 * Projects.js — Featured Work
 *
 * REACT CONCEPTS USED:
 *   - React.memo      : component has no changing props — memo prevents
 *                       unnecessary re-renders triggered by parent
 *   - motion.div      : `whileHover` for 3D lift without any JS event handlers.
 *                       framer-motion handles all the animation logic internally.
 *   - useScrollAnimation(): scroll-triggered stagger reveal via custom hook
 *   - Static data outside: PROJECTS array is module-level — one allocation,
 *                          never re-created during re-renders
 *   - key prop        : using projectTitle as key — stable, unique strings
 *                       are better keys than array indices (avoids reconciliation bugs)
 */
import React from "react";
import { motion } from "framer-motion";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "./style.css";

const PROJECTS = [
  {
    projectTitle: "AssetHub / GGA Platform",
    label: "Target — Internal",
    projectSummary:
      "3D asset management platform serving 7000+ external vendors and national brands. Handles heavy 3D file rendering with multi-version support. Reduced UI load latency by 60% and optimized API response by 55% using AI-powered asset comparison and Web Workers.",
    tech: ["React.js", "Three.js", "TypeScript", "Web Workers", "Redux", "AWS"],
    link: null,
  },
  {
    projectTitle: "MentorHub",
    label: "Target — Internal",
    projectSummary:
      "Full-scale internal learning platform for scheduling mentorship sessions, tracking attendance, and managing team engagement. Delivered MVP in 20 days. Now used organization-wide across Target. Earned Quarterly Excellence Award for the delivery speed.",
    tech: ["React.js", "TypeScript", "Redux", "Tailwind CSS"],
    link: null,
  },
  {
    projectTitle: "Elevate App",
    label: "Target — Mobile",
    projectSummary:
      "Mobile application for Target's Elevate team enabling 500+ users to manage sessions, food reservations, attendance, and mentorship activities. Delivered end-to-end in 2 months using Flutter.",
    tech: ["Flutter", "React.js", "TypeScript"],
    link: null,
  },
  {
    projectTitle: "Memories",
    label: "Personal Project",
    projectSummary:
      "Social media app where users post and share memorable events from their lives. Full-stack with JWT authentication, Google OAuth, and CRUD operations.",
    tech: ["React.js", "Redux", "Material UI", "Node.js", "Express.js", "MongoDB", "JWT", "OAuth"],
    link: "https://github.com/shikhasingh07/memories",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Projects = () => {
  const [sectionRef, inView] = useScrollAnimation(0.1);

  return (
    <section className="section" id="Build" ref={sectionRef}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <h2 className="section-heading">
          <span className="num">03.</span> What I've Built
        </h2>

        <div className="projects-grid">
          {PROJECTS.map(({ projectTitle, label, projectSummary, tech, link }) => (
            <motion.div
              key={projectTitle}
              className="project-card glass-card"
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="project-card-top">
                <div className="project-folder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                {link && (
                  <a href={link} target="_blank" rel="noreferrer" className="project-external" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                )}
              </div>

              <p className="project-label">{label}</p>
              <h3 className="project-title">{projectTitle}</h3>
              <p className="project-desc">{projectSummary}</p>

              <ul className="project-tech">
                {tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Projects);
