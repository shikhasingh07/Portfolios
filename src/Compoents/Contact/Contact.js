/**
 * Contact.js
 *
 * REACT CONCEPTS USED:
 *   - motion.section     : scroll-triggered entrance animation
 *   - useScrollAnimation(): custom hook — triggers when section is in view
 *   - React.memo         : no changing props, prevents unnecessary re-renders
 *   - Static data outside: social links array defined at module level
 */
import React from "react";
import { motion } from "framer-motion";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "./style.css";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/shikhasingh07",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shikha-singh-b027a7179/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const Contact = () => {
  const [sectionRef, inView] = useScrollAnimation(0.2);

  return (
    <>
      <section className="section contact-section" id="contact" ref={sectionRef}>
        <motion.div
          className="contact-inner"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="contact-overline">05. What's Next?</p>
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-desc">
            Currently open to new opportunities. Whether you have a role in mind,
            a question, or simply want to connect — feel free to reach out.
          </p>

          <div className="contact-cta">
            <a
              href="mailto:shikha.thakur2295@gmail.com"
              className="btn-primary"
            >
              Say Hello ✉️
            </a>
            <a
              href="https://www.linkedin.com/in/shikha-singh-b027a7179/"
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              LinkedIn ↗
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-socials">
          {SOCIALS.map(({ label, href, icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="footer-icon">
              {icon}
            </a>
          ))}
        </div>
        <p className="footer-credit">
          Built with <span className="heart">♥</span> using{" "}
          <span className="gradient-text">React 18 + Three.js</span>
        </p>
        <p className="footer-name">Shikha Singh</p>
      </footer>
    </>
  );
};

export default React.memo(Contact);
