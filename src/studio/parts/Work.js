import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import memoriesShot from "../../Image/pro2.JPG";
import { LINKS, PROJECTS } from "../content";
import { scrollToY } from "../smooth";

const Cube = () => (
  <div className="v v-cube">
    <div className="cube-stage">
      <div className="cube">
        {["f", "b", "l", "r", "t", "d"].map((s) => <i key={s} className={`face ${s}`} />)}
      </div>
    </div>
    <div className="v-rows">
      {[72, 48, 88].map((w) => <span key={w} style={{ width: `${w}%` }} />)}
    </div>
    <span className="v-chip">v.3 · loaded</span>
  </div>
);

const Report = () => (
  <div className="v v-report">
    <p className="v-doc-title">Weekly report</p>
    <div className="v-lines">
      {[96, 88, 92, 60, 94, 78].map((w, i) => (
        <span key={i} style={{ width: `${w}%`, animationDelay: `${i * 0.28}s` }} />
      ))}
    </div>
    <div className="v-bars">
      {[40, 72, 54, 90, 66].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
    </div>
    <span className="v-chip">✦ generated</span>
  </div>
);

const BOOKED = new Set([2, 6, 9, 11, 16, 19, 23]);

const Calendar = () => (
  <div className="v v-cal">
    <p className="v-doc-title">Mentor sessions</p>
    <div className="v-grid">
      {Array.from({ length: 28 }, (_, i) => (
        <i
          key={i}
          className={BOOKED.has(i) ? "on" : ""}
          style={BOOKED.has(i) ? { animationDelay: `${(i % 7) * 0.22}s` } : undefined}
        />
      ))}
    </div>
    <span className="v-chip">20 days · shipped</span>
  </div>
);

const Memories = () => (
  <div className="v v-shot">
    <div className="browser" aria-hidden="true"><i /><i /><i /></div>
    <img src={memoriesShot} alt="The Memories app showing a grid of travel posts" loading="lazy" />
  </div>
);

const VISUALS = { cube: Cube, report: Report, calendar: Calendar, memories: Memories };

const Card = React.forwardRef(({ project }, ref) => {
  const Visual = VISUALS[project.visual];
  return (
    <article className="card" ref={ref}>
      <div className="card-visual">
        <Visual />
      </div>
      <div className="card-info">
        <p className="card-tag">
          <span>{project.id}</span> {project.tag}
        </p>
        <h3 className="card-title">{project.title}</h3>
        <p className="card-sub">{project.subtitle}</p>
        <p className="card-desc">{project.desc}</p>
        <dl className="card-metrics">
          {project.metrics.map(({ n, l }) => (
            <div key={l}>
              <dt>{l}</dt>
              <dd>{n}</dd>
            </div>
          ))}
        </dl>
        <ul className="card-tech">
          {project.tech.map((t) => <li key={t}>{t}</li>)}
        </ul>
        {project.link && (
          <a className="card-link" href={project.link} target="_blank" rel="noreferrer">
            See the code <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
});

const Work = () => {
  const pin = useRef(null);
  const cards = useRef([]);
  const [index, setIndex] = useState(0);
  const orbitTrigger = useRef(null);
  const drag = useRef(null);
  const last = PROJECTS.length - 1;

  // The orbit is scroll-driven, so every control simply moves the page.
  const perCard = () => {
    const st = orbitTrigger.current;
    return st ? (st.end - st.start) / last : 1;
  };
  const liveIndex = () => {
    const st = orbitTrigger.current;
    return st ? Math.round((window.scrollY - st.start) / perCard()) : 0;
  };
  const goTo = (i) => {
    const st = orbitTrigger.current;
    if (!st) return;
    scrollToY(st.start + perCard() * Math.max(0, Math.min(last, i)));
  };

  const onPointerDown = (e) => {
    if (!orbitTrigger.current || e.button !== 0 || e.target.closest("a, button")) return;
    drag.current = { x: e.clientX, y0: window.scrollY, from: liveIndex(), moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.classList.add("is-dragging");
    }
    const st = orbitTrigger.current;
    // Dragging 40% of the screen moves exactly one card.
    const y = d.y0 - (dx / (window.innerWidth * 0.4)) * perCard();
    scrollToY(Math.max(st.start, Math.min(st.end, y)), { immediate: true });
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    e.currentTarget.classList.remove("is-dragging");
    if (d.moved) {
      const dx = e.clientX - d.x;
      const steps = Math.abs(dx) < 50 ? 0 : Math.max(1, Math.round(Math.abs(dx) / (window.innerWidth * 0.4)));
      goTo(d.from - Math.sign(dx) * steps);
    } else if (!e.target.closest(".card")) {
      // A click beside the front card brings that side's neighbour forward.
      goTo(d.from + (e.clientX < window.innerWidth / 2 ? -1 : 1));
    }
  };

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // The cards orbit only where there's room and motion is welcome.
    // Otherwise they stay a plain swipeable row.
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const el = pin.current;
      el.classList.add("is-orbit");

      const tilt = { x: 0, y: 0 };

      const place = (p) => {
        const cardW = Math.min(window.innerWidth * 0.58, 860);
        const R = cardW * 1.34;
        cards.current.forEach((card, i) => {
          if (!card) return; // React clears refs first when this section unmounts.
          const d = i - p;
          const a = d * 0.76;
          const dist = Math.abs(d);
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: Math.sin(a) * R,
            z: (Math.cos(a) - 1) * R,
            rotationY: gsap.utils.clamp(-80, 80, (a * 180) / Math.PI) + tilt.y * Math.max(0, 1 - dist),
            rotationX: tilt.x * Math.max(0, 1 - dist),
            autoAlpha: gsap.utils.clamp(0, 1, 2.1 - dist),
            zIndex: 100 - Math.round(dist * 10),
          });
          card.style.setProperty("--dim", Math.min(1, dist).toFixed(3));
          card.style.pointerEvents = dist < 0.5 ? "auto" : "none";
        });
      };
      place(0);

      const trigger = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          pin: true,
          start: "top top",
          end: () => `+=${window.innerHeight * last * 0.6}`,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      orbitTrigger.current = trigger.scrollTrigger;
      const state = { p: 0 };
      trigger.to(state, {
        p: last,
        ease: "none",
        duration: 1,
        onUpdate: () => {
          place(state.p);
          setIndex(Math.round(state.p));
        },
      });

      // The front card leans towards the mouse and catches the light.
      const lean = (x, y) =>
        gsap.to(tilt, { x, y, duration: 0.7, ease: "power3.out", overwrite: true, onUpdate: () => place(state.p) });
      const onTilt = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        lean(-ny * 7, nx * 10);
        el.style.setProperty("--gx", `${50 + nx * 55}%`);
        el.style.setProperty("--gy", `${50 + ny * 70}%`);
      };
      const onTiltEnd = () => lean(0, 0);
      el.addEventListener("pointermove", onTilt, { passive: true });
      el.addEventListener("pointerleave", onTiltEnd, { passive: true });

      return () => {
        el.removeEventListener("pointermove", onTilt);
        el.removeEventListener("pointerleave", onTiltEnd);
        gsap.killTweensOf(tilt);
        orbitTrigger.current = null;
        el.classList.remove("is-orbit");
        cards.current.forEach((c) => {
          if (!c) return;
          gsap.set(c, { clearProps: "all" });
          c.style.removeProperty("--dim");
        });
      };
    });

    return () => mm.revert();
  }, [last]);

  return (
    <section className="work" id="work" data-bg="#4D0E13">
      <div className="work-pin" ref={pin}>
        <header className="work-head">
          <p className="script">selected work</p>
          <p className="work-count" aria-hidden="true">
            <b>0{index + 1}</b> / 0{PROJECTS.length}
          </p>
        </header>
        <h2 className="sr-only">Selected work</h2>

        <div
          className="orbit"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {PROJECTS.map((p, i) => (
            <Card
              key={p.id}
              project={p}
              ref={(n) => {
                cards.current[i] = n;
              }}
            />
          ))}
        </div>

        <div className="work-foot">
          <div className="work-nav">
            <button type="button" className="work-arrow" aria-label="Previous project" disabled={index === 0} onClick={() => goTo(index - 1)}>←</button>
            <div className="pips">
              {PROJECTS.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  className={i === index ? "on" : ""}
                  aria-label={`Show ${p.title}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button type="button" className="work-arrow" aria-label="Next project" disabled={index === last} onClick={() => goTo(index + 1)}>→</button>
          </div>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            More on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Work;
