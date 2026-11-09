import React, { useLayoutEffect } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../smooth";

const ITEMS = ["open to work", "React.js", "TypeScript", "Three.js", "Delhi NCR", "5+ years shipping"];

const Run = () => (
  <>
    {ITEMS.map((t, i) => (
      <React.Fragment key={t}>
        <span>{t}</span>
        <i>{i % 2 ? "✦" : "✿"}</i>
      </React.Fragment>
    ))}
  </>
);

const Ribbon = () => {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ribbon-track",
        { xPercent: -6 },
        {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: ".ribbon", start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    });

    // The words lean into the scroll: the faster you go, the harder they tilt.
    const toSkew = gsap.quickTo(".ribbon-track", "skewX", { duration: 0.35, ease: "power3.out" });
    let last = window.scrollY;
    const lean = () => {
      const delta = window.scrollY - last;
      last = window.scrollY;
      toSkew(gsap.utils.clamp(-20, 20, delta * -0.7));
    };
    gsap.ticker.add(lean);
    return () => {
      gsap.ticker.remove(lean);
      ctx.revert();
    };
  }, []);

  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-band">
        <div className="ribbon-track">
          <Run /><Run /><Run /><Run />
        </div>
      </div>
    </div>
  );
};

export default Ribbon;
