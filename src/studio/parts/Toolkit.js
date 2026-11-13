import React, { useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { STACK } from "../content";
import { prefersReducedMotion } from "../smooth";
import Rise from "./Rise";

const SMEAR = "M22 46C70 18 118 70 170 40S268 22 318 44";

// The stack as an eyeshadow palette: every tool is a shade you can swatch.
const Toolkit = () => {
  const [picked, setPicked] = useState(0);
  const shade = STACK[picked];

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".compact", {
        rotateX: -38,
        y: 60,
        opacity: 0,
        transformOrigin: "50% 100%",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".compact", start: "top 82%", toggleActions: "play none none reverse" },
      });
      gsap.from(".pan-slot", {
        scale: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".compact", start: "top 72%", toggleActions: "play none none reverse" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="stack" id="stack" data-folio="The toolkit — p. 04" data-bg="#EFD6D8">
      <header className="sec-head">
        <p className="script">what I reach for</p>
        <h2><Rise text="The toolkit" /></h2>
        <blockquote className="pull">
          “I care how it looks, <em>and</em> how fast it loads.”
        </blockquote>
      </header>

      <div className="compact-wrap">
        <div className="compact">
          <ul className="pans" aria-label="Tools, shown as palette shades">
            {STACK.map((s, i) => (
              <li className="pan-slot" key={s.name}>
                <button
                  type="button"
                  className={`pan ${s.finish} ${i === picked ? "on" : ""}`}
                  style={{ "--shade": s.hex }}
                  aria-pressed={i === picked}
                  aria-label={`${s.name}, shade ${s.shade}`}
                  onMouseEnter={() => setPicked(i)}
                  onFocus={() => setPicked(i)}
                  onClick={() => setPicked(i)}
                />
                <span className="pan-name" aria-hidden="true">{s.name}</span>
              </li>
            ))}
          </ul>

          <div className="swatch" aria-live="polite">
            <svg className="smear" viewBox="0 0 340 86" aria-hidden="true">
              <motion.path
                key={shade.name}
                d={SMEAR}
                fill="none"
                stroke={shade.hex}
                strokeWidth="40"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: [0.3, 0.8, 0.4, 1] }}
              />
            </svg>
            <p className="swatch-no">
              Shade {String(picked + 1).padStart(2, "0")} · {shade.finish}
            </p>
            <p className="swatch-shade">{shade.shade}</p>
            <p className="swatch-name">{shade.name}</p>
            <p className="swatch-used">
              <span>Worn on</span> {shade.used}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Toolkit;
