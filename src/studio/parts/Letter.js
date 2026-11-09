import React, { useLayoutEffect } from "react";
import gsap from "gsap";
import { LINKS } from "../content";
import { prefersReducedMotion } from "../smooth";

const Letter = () => {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#contact", start: "top 88%", end: "top 8%", scrub: 0.8 },
      });
      tl.fromTo(".flap", { rotateX: 0, transformPerspective: 1100 }, { rotateX: 180, duration: 0.42, ease: "power1.inOut" })
        .set(".flap", { zIndex: 1 }, 0.21)
        .fromTo(".paper", { yPercent: 40, rotate: -1.5 }, { yPercent: -44, rotate: 1, duration: 0.42, ease: "power1.out" }, 0.34)
        .set(".paper", { zIndex: 7 }, 0.76)
        .to(".seal", { autoAlpha: 0, duration: 0.05 }, 0.72)
        .to(".paper", { yPercent: -16, rotate: -0.8, duration: 0.24, ease: "power2.inOut" }, 0.76);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" data-bg="#EEE4DA">
      <div className="env-zone">
        <div className="env">
          <div className="env-back" aria-hidden="true" />
          <div className="flap" aria-hidden="true" />

          <div className="paper">
            <p className="paper-date" aria-hidden="true">Delhi NCR · available immediately</p>
            <h2 className="script paper-hello">Dear future team,</h2>
            <p className="paper-body">
              I'm looking for <b>frontend and UI engineering roles in Delhi NCR</b>. React.js,
              TypeScript, Three.js, and 5+ years of shipping at scale. If you're building something
              that should feel as good as it works, I'd love to hear about it.
            </p>
            <p className="paper-sign">yours in clean commits,<br />Shikha</p>
            <div className="paper-links">
              <a className="pill solid" href={LINKS.email}>Send an email <span aria-hidden="true">↗</span></a>
              <a className="pill ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              <a className="pill ghost" href={LINKS.resume} target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="env-front" aria-hidden="true">
            <i className="pocket l" /><i className="pocket r" /><i className="pocket b" />
          </div>
          <span className="seal" aria-hidden="true">✿</span>
        </div>
      </div>

      <footer className="foot">
        <span>Built by Shikha Singh · 2026</span>
        <span>React, Three.js and a lily made entirely of math</span>
      </footer>
    </section>
  );
};

export default Letter;
