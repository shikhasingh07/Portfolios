import { useEffect, useRef } from "react";
import "./cursor.css";

const CustomCursor = () => {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let frameId;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Dot snaps instantly; ring follows with lag
    const tick = () => {
      cx += (mx - cx) * 0.13;
      cy += (my - cy) * 0.13;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    // Scale ring on hover of interactive elements
    const grow   = () => ringRef.current?.classList.add("cursor-grow");
    const shrink = () => ringRef.current?.classList.remove("cursor-grow");
    const els = document.querySelectorAll("a, button, [data-cursor]");
    els.forEach((el) => { el.addEventListener("mouseenter", grow); el.addEventListener("mouseleave", shrink); });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMove);
      els.forEach((el) => { el.removeEventListener("mouseenter", grow); el.removeEventListener("mouseleave", shrink); });
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef}  className="cursor-dot"  />
    </>
  );
};

export default CustomCursor;
