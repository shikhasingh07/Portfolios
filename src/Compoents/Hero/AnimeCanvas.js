import { useEffect, useRef } from "react";

/*  Anime Radar HUD — Ghost in the Shell / Evangelion style
    - Concentric cyan grid rings
    - Rotating sonar sweep with gradient tail
    - Random data blips that appear & fade
    - Corner data readouts
    - Responds subtly to mouse position
*/
const AnimeCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W, H, cx, cy, radius;
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      cx = W / 2;
      cy = H / 2;
      radius = Math.min(W, H) * 0.40;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Blips (radar contacts) ────────────────────────────────
    const MAX_BLIPS = 14;
    const blips = [];
    const spawnBlip = () => {
      const angle = Math.random() * Math.PI * 2;
      const r     = radius * (0.15 + Math.random() * 0.78);
      blips.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        alpha: 0,
        maxA: 0.5 + Math.random() * 0.5,
        life: 0,
        maxLife: 120 + Math.floor(Math.random() * 180),
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.25 ? "#00f5ff" : "#ff2d78",
      });
    };
    // Pre-populate
    for (let i = 0; i < 10; i++) spawnBlip();

    // ── Mouse ─────────────────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left - W / 2) / W;
      mouse.y = (e.clientY - rect.top  - H / 2) / H;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Data strings shown in corners ─────────────────────────
    const DATA_LINES = [
      ["SYS", "ONLINE"], ["LAT", "0.03ms"],
      ["PKT", "7K+"],    ["EFF", "60%↑"],
    ];

    let frameId, sweep = 0, tick = 0;

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      tick++;
      sweep += 0.022;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(cx + mouse.x * 12, cy + mouse.y * 12);

      // ── Background dark disc ──────────────────────────────
      ctx.beginPath();
      ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,10,20,0.60)";
      ctx.fill();

      // ── Concentric rings ──────────────────────────────────
      const RINGS = 5;
      for (let i = 1; i <= RINGS; i++) {
        const r = (radius / RINGS) * i;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,245,255,${0.06 + (i === RINGS ? 0.08 : 0)})`;
        ctx.lineWidth = i === RINGS ? 1.5 : 0.8;
        ctx.stroke();
      }

      // ── Crosshair lines ───────────────────────────────────
      ctx.strokeStyle = "rgba(0,245,255,0.07)";
      ctx.lineWidth = 0.8;
      const SPOKES = 12;
      for (let i = 0; i < SPOKES; i++) {
        const a = (i / SPOKES) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
        ctx.stroke();
      }

      // ── Sonar sweep ───────────────────────────────────────
      // Gradient tail: 120° arc fading out behind the sweep line
      const TAIL = (Math.PI * 2) / 3;
      const sweepGrad = ctx.createConicalGradient
        ? null  // conical not supported in canvas 2d
        : null;

      // Draw sweep tail as stacked arcs
      const STEPS = 32;
      for (let s = 0; s < STEPS; s++) {
        const a0 = sweep - TAIL * (s / STEPS);
        const a1 = sweep - TAIL * ((s + 1) / STEPS);
        const alpha = (1 - s / STEPS) * 0.18;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, a0, a1, true);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,245,255,${alpha})`;
        ctx.fill();
      }

      // Leading edge — bright line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(sweep) * radius, Math.sin(sweep) * radius);
      ctx.strokeStyle = "rgba(0,245,255,0.85)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── Blips ─────────────────────────────────────────────
      if (tick % 60 === 0 && blips.length < MAX_BLIPS) spawnBlip();

      for (let i = blips.length - 1; i >= 0; i--) {
        const b = blips[i];
        b.life++;
        // Fade in / out
        const half = b.maxLife / 2;
        b.alpha = b.life < half
          ? (b.life / half) * b.maxA
          : ((b.maxLife - b.life) / half) * b.maxA;

        // Reveal when sweep passes over it
        const blipAngle = Math.atan2(b.y, b.x);
        const diff = ((sweep - blipAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const visible = diff < TAIL + 0.3;

        if (visible && b.alpha > 0) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = b.alpha;
          ctx.shadowColor = b.color;
          ctx.shadowBlur  = 12;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur  = 0;
        }

        if (b.life >= b.maxLife) {
          blips.splice(i, 1);
          spawnBlip();
        }
      }

      // ── Center cross ──────────────────────────────────────
      const CS = 8;
      ctx.strokeStyle = "rgba(0,245,255,0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-CS, 0); ctx.lineTo(CS, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -CS); ctx.lineTo(0, CS); ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00f5ff";
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur  = 14;
      ctx.fill();
      ctx.shadowBlur  = 0;

      ctx.restore();

      // ── Corner data readouts ──────────────────────────────
      const PAD = 14;
      const corners = [
        { x: PAD,     y: PAD,     ax: "left",  ay: "top"    },
        { x: W - PAD, y: PAD,     ax: "right", ay: "top"    },
        { x: PAD,     y: H - PAD, ax: "left",  ay: "bottom" },
        { x: W - PAD, y: H - PAD, ax: "right", ay: "bottom" },
      ];

      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      corners.forEach(({ x, y, ax, ay }, i) => {
        const [key, val] = DATA_LINES[i];
        ctx.textAlign = ax;
        const yOff = ay === "top" ? 0 : -12;
        ctx.fillStyle = "rgba(0,245,255,0.25)";
        ctx.fillText(key, x, y + yOff);
        ctx.fillStyle = "rgba(0,245,255,0.70)";
        ctx.fillText(val, x, y + yOff + 13);
      });

      // ── Outer ring label ──────────────────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(0,245,255,0.20)";
      ctx.textAlign = "center";
      ctx.fillText("SCANNING...", 0, -radius - 10);
      ctx.restore();
    };

    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouse);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default AnimeCanvas;
