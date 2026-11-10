import React, { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { EXPERIENCE } from "../content";
import { prefersReducedMotion } from "../smooth";
import Rise from "./Rise";

const Window = ({ title, slot, bounds, canDrag, onFocus, z, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={`win-slot ${slot}`} style={{ zIndex: z }}>
      <motion.div
        className="win"
        drag={canDrag}
        dragConstraints={bounds}
        dragElastic={0.06}
        dragMomentum={false}
        whileDrag={{ scale: 1.02, rotate: -1.2, cursor: "grabbing" }}
        onPointerDown={onFocus}
      >
        <div className="win-bar">
          <button
            type="button"
            className="win-toggle"
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setOpen((o) => !o)}
          >
            <i className="l1" /><i className="l2" /><i className="l3" />
          </button>
          <span className="win-title">{title}</span>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className="win-clip"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.3, 1, 0.4, 1] }}
            >
              <div className="win-body">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const BUBBLES = [
  { text: "can you make it faster?", me: false },
  { text: "60% faster.", me: true },
  { text: "and prettier?", me: false },
  { text: "obviously.", me: true },
];

const Desktop = () => {
  const bounds = useRef(null);
  const zCounter = useRef(10);
  const [order, setOrder] = useState({});
  const canDrag = typeof window !== "undefined" && window.matchMedia("(min-width: 900px) and (pointer: fine)").matches;

  const focus = (id) => {
    zCounter.current += 1;
    setOrder((o) => ({ ...o, [id]: zCounter.current }));
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".screen", {
        // Hinged at the top edge, so the screen never drifts away from its heading.
        rotateX: -14,
        scale: 0.93,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: { trigger: ".screen", start: "top 100%", end: "top 40%", scrub: 1 },
      });
      gsap.from(".win-slot", {
        y: 70,
        opacity: 0,
        scale: 0.92,
        duration: 0.8,
        stagger: 0.12,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: ".screen", start: "top 58%", toggleActions: "play none none reverse" },
      });
      gsap.from(".bubble", {
        scale: 0.3,
        opacity: 0,
        duration: 0.5,
        stagger: 0.32,
        ease: "back.out(2.2)",
        scrollTrigger: { trigger: ".screen", start: "top 34%", toggleActions: "play none none reverse" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="experience" id="experience" data-folio="The career — p. 02" data-bg="#DDD1C6">
      <header className="sec-head">
        <p className="script">where I've been</p>
        <h2><Rise text="Experience" /></h2>
      </header>

      <div className="screen-persp">
        <div className="screen" ref={bounds}>
          <div className="wall" aria-hidden="true">
            <i className="w-c1" /><i className="w-c2" /><i className="w-c3" /><i className="w-c4" />
            <b className="w-l1" /><b className="w-l2" />
          </div>
          <p className="wall-type" aria-hidden="true">these days</p>
          {canDrag && <p className="drag-hint" aria-hidden="true">psst, the windows move</p>}

          {EXPERIENCE.map((job, i) => (
            <Window
              key={job.id}
              title={job.file}
              slot={`slot-${job.id}`}
              bounds={bounds}
              canDrag={canDrag}
              onFocus={() => focus(job.id)}
              z={order[job.id] || 3 + i}
            >
              <p className="job-period">{job.period}</p>
              <h3 className="job-company">{job.company}</h3>
              <p className="job-role">{job.role}</p>
              <ul className="job-list">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Window>
          ))}

          <Window
            title="trophy.png"
            slot="slot-award"
            bounds={bounds}
            canDrag={canDrag}
            onFocus={() => focus("award")}
            z={order.award || 6}
          >
            <div className="award">
              <span className="award-star" aria-hidden="true">✦</span>
              <p>Quarterly Excellence Award</p>
              <small>Target · for MentorHub</small>
            </div>
          </Window>

          <div className="bubbles" aria-hidden="true">
            {BUBBLES.map(({ text, me }) => (
              <span className={`bubble ${me ? "me" : ""}`} key={text}>{text}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Desktop;
