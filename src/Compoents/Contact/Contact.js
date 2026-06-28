import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? "99,102,241" : "6,182,212",
    }));

    let frameId;
    const draw = () => {
      frameId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="contact-particles" />;
};

const Contact = () => {
  return (
    <>
      <section className="section contact-section" id="contact">
        <FloatingParticles />
        <motion.div
          className="contact-inner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="contact-overline">
            <span className="overline-num">05.</span> What's Next?
          </span>
          <h2 className="contact-title">
            Let's Build{" "}
            <span className="gradient-text">Something Great</span>
          </h2>
          <p className="contact-desc">
            I'm actively looking for new opportunities. Whether you have a role in mind,
            a challenging project, or just want to connect — I'd love to hear from you.
          </p>

          <div className="contact-availability">
            <span className="avail-dot" />
            <span>Available for full-time roles</span>
          </div>

          <div className="contact-cta">
            <a href="mailto:shikha.thakur2295@gmail.com" className="btn-primary contact-email-btn">
              Say Hello ✉️
            </a>
            <a
              href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              Resume ↗
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

          {/* Decorative glow orbs */}
          <div className="contact-glow contact-glow-1" />
          <div className="contact-glow contact-glow-2" />
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-socials">
          {SOCIALS.map(({ label, href, icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="footer-icon">
              {icon}
            </a>
          ))}
        </div>
        <p className="footer-credit">
          Designed &amp; Built by{" "}
          <span className="gradient-text">Shikha Singh</span>
        </p>
        <p className="footer-stack">
          React 18 · Three.js · Framer Motion
        </p>
      </footer>
    </>
  );
};

export default React.memo(Contact);
