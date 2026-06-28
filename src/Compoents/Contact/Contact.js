import React from "react";
import "./style.css";

const Contact = () => (
  <>
    <section className="section contact-wrap" id="contact">
      {/* HUD decoration */}
      <div className="contact-hud-line" />

      <div className="contact-inner">
        <div className="contact-label">
          <span className="num">03 //</span> WHAT'S NEXT
        </div>

        <h2 className="contact-title">
          Let's <span className="gradient-text">Connect.</span>
        </h2>

        <p className="contact-sub">
          Open to <strong>frontend / UI engineering roles in Delhi NCR</strong>.
          React.js · TypeScript · Three.js · 5+ years shipping at scale.
        </p>

        <div className="contact-avail">
          <span className="avail-dot" />
          <span>Available immediately</span>
        </div>

        <div className="contact-links">
          <a href="mailto:shikha.thakur2295@gmail.com" className="btn-primary" data-cursor>
            SEND EMAIL ↗
          </a>
          <a
            href="https://www.linkedin.com/in/shikha-singh-b027a7179/"
            target="_blank" rel="noreferrer"
            className="btn-outline" data-cursor
          >
            LINKEDIN ↗
          </a>
          <a
            href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
            target="_blank" rel="noreferrer"
            className="btn-outline" data-cursor
          >
            RESUME ↗
          </a>
        </div>
      </div>
    </section>

    <footer className="site-footer">
      <div className="footer-row">
        <span className="footer-logo">〈 SS /〉</span>
        <div className="footer-socials">
          <a href="https://github.com/shikhasingh07" target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/shikha-singh-b027a7179/" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
        <span className="footer-copy">Built by Shikha Singh · 2026</span>
      </div>
    </footer>
  </>
);

export default Contact;
