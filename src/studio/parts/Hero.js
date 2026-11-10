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
      gsap.to(".hero-word.one", { yPercent: -24, scrollTrigger: scrub });
      gsap.to(".hero-word.two", { xPercent: 12, scrollTrigger: scrub });
    });

    // The masthead letters swell towards the mouse.
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
        <span className="hero-word two" aria-hidden="true">
          <span className="hero-sign" data-hero-in>Singh</span>
        </span>
      </h1>
    </div>
  );
};

// Bar widths for the cover barcode. Decorative only.
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];

const Barcode = () => {
  let x = 0;
  return (
    <svg className="barcode" viewBox="0 0 96 34" aria-hidden="true">
      {BARS.map((w, i) => {
        const bar = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="34" fill="currentColor" /> : null;
        x += w + 0.4;
        return bar;
      })}
    </svg>
  );
};

export const Hero = () => (
  <section className="hero" id="top" data-bg="#EEE4DA">
    <p className="cover-strip" data-hero-in aria-hidden="true">
      <span>Issue N°05</span>
      <span className="cover-strip-mid">The UI Engineer Edition</span>
      <span>Delhi NCR · 2026</span>
    </p>

    <div className="cover-lines left" data-hero-in>
      <p className="cover-kicker">Cover story</p>
      <p className="cover-big">
        Pretty, <em>and</em> 60% faster
      </p>
      <p className="cover-small">The load-time glow-up at Target</p>
      <p className="cover-hand">(click anywhere, petals happen)</p>
    </div>

    <div className="cover-lines right" data-hero-in>
      <p className="cover-kicker">Inside</p>
      <p className="cover-big">7,000+ vendors</p>
      <p className="cover-small">one 3D platform: meet Gargantua</p>
      <p className="cover-big second">20 days</p>
      <p className="cover-small">idea to MVP, the MentorHub story</p>
    </div>

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
      <div className="hero-side" data-hero-in>
        <div className="cover-code" aria-hidden="true">
          <Barcode />
          <span>shikhasingh.netlify.app</span>
        </div>
        <div className="hero-cta">
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
    </div>
  </section>
);
