import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../smooth";
import { supportsLiquid, useLiquid } from "./liquid";

const SIZE_RADIUS = 105;

// A drop of liquid glass that follows the mouse across the hero,
// bending your name and the lily as it passes over them.
const Lens = () => {
  const ref = useRef(null);
  useLiquid(ref, { id: "liquid-lens", radius: SIZE_RADIUS, bezel: 74, scale: 92, finish: "saturate(1.3) brightness(1.05)" });

  useEffect(() => {
    if (prefersReducedMotion() || !supportsLiquid()) return undefined;
    const el = ref.current;
    const toX = gsap.quickTo(el, "x", { duration: 0.42, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.42, ease: "power3.out" });
    let seen = false;
    let overControl = false;

    const update = () => {
      const on = seen && !overControl && window.scrollY < window.innerHeight * 0.55;
      el.classList.toggle("on", on);
      document.documentElement.classList.toggle("lens-on", on);
    };
    const onMove = (e) => {
      if (!seen) {
        seen = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
      }
      toX(e.clientX);
      toY(e.clientY);
      overControl = Boolean(e.target.closest && e.target.closest("a, button, .dock, .menubar"));
      update();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", update);
      document.documentElement.classList.remove("lens-on");
    };
  }, []);

  return <div className="lens" ref={ref} aria-hidden="true" />;
};

export default Lens;
