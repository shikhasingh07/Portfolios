import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../smooth";

const SHADE = "143, 29, 44";
const STROKE_LIFE = 2600;
const KISS_LIFE = 3200;
const SKIP = "a, button, input, .win, .orbit, .dock, .menubar, .pal, .compact";

const UPPER_LIP = new Path2D("M-24 0C-15-13-6-15 0-8C6-15 15-13 24 0C12-3-12-3-24 0Z");
const LOWER_LIP = new Path2D("M-24 1.5C-12 4.5 12 4.500 24 1.500C15 15-15 15-24 1.500Z");

// Drag the mouse to draw in lipstick, click to leave a kiss. Both fade away.
const Lipstick = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return undefined;
    const canvas = ref.current;
    const g = canvas.getContext("2d");
    let strokes = [];
    let kisses = [];
    let active = null;
    let down = null;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      raf = 0;
      const now = performance.now();
      g.clearRect(0, 0, window.innerWidth, window.innerHeight);
      g.lineCap = "round";
      g.lineJoin = "round";

      strokes = strokes.filter((s) => s === active || now - s.end < STROKE_LIFE);
      strokes.forEach((s) => {
        const age = s === active ? 0 : (now - s.end) / STROKE_LIFE;
        g.strokeStyle = `rgba(${SHADE}, ${0.82 * (1 - age * age)})`;
        g.lineWidth = 13;
        g.beginPath();
        s.points.forEach(([x, y], i) => {
          if (i === 0) g.moveTo(x, y);
          else {
            const [px, py] = s.points[i - 1];
            g.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
          }
        });
        g.stroke();
      });

      kisses = kisses.filter((k) => now - k.at < KISS_LIFE);
      kisses.forEach((k) => {
        const age = (now - k.at) / KISS_LIFE;
        const pop = Math.min(1, (now - k.at) / 140);
        g.save();
        g.translate(k.x, k.y);
        g.rotate(k.tilt);
        g.scale(k.size * (0.7 + 0.3 * pop), k.size * (0.7 + 0.3 * pop));
        g.fillStyle = `rgba(${SHADE}, ${0.8 * (1 - age * age)})`;
        g.fill(UPPER_LIP);
        g.fill(LOWER_LIP);
        g.restore();
      });

      if (strokes.length || kisses.length) raf = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onDown = (e) => {
      if (e.button !== 0 || e.pointerType !== "mouse") return;
      if (e.target.closest && e.target.closest(SKIP)) return;
      down = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!down) return;
      if (!active) {
        if (Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) return;
        active = { points: [[down.x, down.y]], end: 0 };
        strokes.push(active);
        document.documentElement.classList.add("is-painting");
      }
      active.points.push([e.clientX, e.clientY]);
      wake();
    };
    const onUp = (e) => {
      if (!down) return;
      if (active) {
        active.end = performance.now();
        active = null;
        document.documentElement.classList.remove("is-painting");
      } else {
        kisses.push({
          x: e.clientX,
          y: e.clientY,
          at: performance.now(),
          tilt: (Math.random() - 0.5) * 0.7,
          size: 1.1 + Math.random() * 0.5,
        });
      }
      down = null;
      wake();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("is-painting");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return <canvas ref={ref} className="lipstick" aria-hidden="true" />;
};

export default Lipstick;
