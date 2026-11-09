import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../smooth";

// A small flower that trails the (still visible) mouse pointer and
// turns into a label over anything you can drag or open.
const labelFor = (target) => {
  if (!target.closest) return "";
  if (target.closest(".dock")) return "";
  if (target.closest(".is-orbit .orbit") && !target.closest("a, button")) return "drag";
  if (target.closest(".win-toggle")) return "";
  if (target.closest(".win")) return "drag";
  if (target.closest('a[target="_blank"]')) return "open";
  return "";
};

const Cursor = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return undefined;
    const el = ref.current;
    const text = el.querySelector(".buddy-label");
    const toX = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let current = "";
    let seen = false;
    let lastX = 0;
    let lastY = 0;

    const setLabel = (target) => {
      const label = target ? labelFor(target) : "";
      if (label === current) return;
      current = label;
      if (label) text.textContent = label;
      el.classList.toggle("has-label", Boolean(label));
    };
    // Scrolling slides new things under a still mouse, so look again.
    const onScroll = () => {
      if (seen) setLabel(document.elementFromPoint(lastX, lastY));
    };

    const onMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!seen) {
        seen = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add("is-on");
      }
      toX(e.clientX);
      toY(e.clientY);
      setLabel(e.target);
    };
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="buddy" ref={ref} aria-hidden="true">
      <span className="buddy-flower">✿</span>
      <span className="buddy-label" />
    </div>
  );
};

export default Cursor;
