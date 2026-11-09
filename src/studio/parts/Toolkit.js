import React, { useLayoutEffect } from "react";
import gsap from "gsap";
import { STACK } from "../content";
import { prefersReducedMotion } from "../smooth";
import Rise from "./Rise";

const Toolkit = () => {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      // Each row swings down into place like a split-flap board.
      gsap.from(".tool", {
        rotateX: -82,
        opacity: 0,
        transformOrigin: "50% 0%",
        duration: 0.85,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tools", start: "top 78%", toggleActions: "play none none reverse" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="stack" id="stack" data-bg="#EFD6D8">
      <header className="sec-head">
        <p className="script">what I reach for</p>
        <h2><Rise text="The toolkit" /></h2>
      </header>

      <ul className="tools">
        {STACK.map(({ name, used }, i) => (
          <li className="tool" key={name}>
            <div className="tool-in">
              <span className="tool-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="tool-name">{name}</span>
              <span className="tool-used">{used}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Toolkit;
