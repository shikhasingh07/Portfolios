import React, { useLayoutEffect } from "react";
import gsap from "gsap";
import { LINKS } from "../content";
import { scrollToId, prefersReducedMotion } from "../smooth";

const Word = ({ text, className }) => (
  <span className={`hero-word ${className}`} aria-hidden="true">
    {text.split("").map((c, i) => (
      <span className="ltr-mask" key={i}>
        <span className="ltr">{c}</span>
      </span>
    ))}
  </span>
);

// Sits beneath the WebGL canvas, so the lily blooms in front of the name.
export const HeroName = () => {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const scrub = { trigger: "#top", start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-word.one", { xPercent: -14, scrollTrigger: scrub });
      gsap.to(".hero-word.two", { xPercent: 14, scrollTrigger: scrub });
    });

    // The letters squish up towards the mouse like soft bubblegum.
    if (!window.matchMedia("(pointer: fine)").matches) return () => ctx.revert();
    const letters = gsap.utils.toArray(".ltr");
    const tween = { duration: 0.55, ease: "power3.out" };
    const setters = letters.map((el) => ({
      sx: gsap.quickTo(el, "scaleX", tween),
      sy: gsap.quickTo(el, "scaleY", tween),
      y: gsap.quickTo(el, "y", tween),
    }));
    const reach = () => window.innerWidth * 0.17;
    const onMove = (e) => {
      if (window.scrollY > window.innerHeight) return;
      letters.forEach((el, i) => {
        const r = el.parentElement.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        const f = Math.max(0, 1 - dist / reach());
        const pull = f * f * (3 - 2 * f);
        setters[i].sx(1 + pull * 0.13);
        setters[i].sy(1 + pull * 0.2);
        setters[i].y(-pull * 18);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <div className="hero-under">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <h1 className="hero-name" aria-label="Shikha Singh">
        <Word text="Shikha" className="one" />
        <Word text="Singh" className="two" />
      </h1>
    </div>
  );
};

const Squiggle = () => (
  <svg className="squiggle" viewBox="0 0 150 70" fill="none" aria-hidden="true">
    <path
      d="M4 12c22 34 44 44 66 28 12-9 8-26-4-22-14 5-6 42 74 42m0 0-13-11m13 11-15 7"
      stroke="currentColor"
      strokeWidth="2.200"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Hero = () => (
  <section className="hero" id="top" data-bg="#EEE4DA">
    <p className="hero-note left" data-hero-in>
      hi. glad you wandered in.
      <small>(click anywhere, petals happen)</small>
    </p>
    <p className="hero-note right" data-hero-in>
      stay a while, it blooms
      <Squiggle />
    </p>

    <div className="hero-foot">
      <div className="hero-intro" data-hero-in>
        <p className="hero-role">UI Engineer</p>
        <p className="hero-desc">
          Crafting high-performance 3D web experiences with React.js, TypeScript &amp; Three.js.
          Currently at{" "}
          <a href={LINKS.target} target="_blank" rel="noreferrer">
            Target
          </a>
          , open to roles in Delhi NCR.
        </p>
      </div>
      <div className="hero-cta" data-hero-in>
        <a className="pill solid" href={LINKS.resume} target="_blank" rel="noreferrer">
          View resume <span aria-hidden="true">↗</span>
        </a>
        <a
          className="pill ghost"
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("contact");
          }}
        >
          Get in touch
        </a>
      </div>
    </div>
  </section>
);
