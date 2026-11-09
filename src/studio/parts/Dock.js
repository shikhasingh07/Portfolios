import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LINKS } from "../content";
import { scrollToId } from "../smooth";
import { useLiquid } from "./liquid";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };

const G = {
  top: <path {...stroke} d="M12 21v-8m0 0c-4 0-6-2-6-5 3 0 4.5.6 6 2.5C13.5 8.600 15 8 18 8c0 3-2 5-6 5Zm0-3V4" />,
  experience: <><rect {...stroke} x="3" y="5" width="18" height="14" rx="3" /><path {...stroke} d="M3 9.500h18M6.500 7.200h.01M9.500 7.200h.01" /></>,
  work: <><rect {...stroke} x="4" y="7" width="13" height="13" rx="2.500" /><path {...stroke} d="M8 3.500h9.500A3 3 0 0 1 20.500 6.500V16" /></>,
  stack: <><circle {...stroke} cx="5" cy="12" r="2.600" /><circle {...stroke} cx="12" cy="12" r="2.600" /><circle {...stroke} cx="19" cy="12" r="2.600" /></>,
  contact: <><rect {...stroke} x="3" y="5.500" width="18" height="13" rx="2.500" /><path {...stroke} d="m3.500 7 8.500 6.500L20.500 7" /></>,
  github: <path {...stroke} d="M9 19c-4.500 1.500-4.500-2.500-6.500-3m13 5v-3.500c0-1 .1-1.400-.5-2 2.800-.3 5.500-1.400 5.500-6a4.700 4.700 0 0 0-1.300-3.200 4.400 4.400 0 0 0-.1-3.200s-1-.3-3.400 1.300a11.700 11.700 0 0 0-6.200 0C7.100 2.800 6.100 3.100 6.100 3.100a4.400 4.400 0 0 0-.1 3.200 4.700 4.700 0 0 0-1.300 3.200c0 4.600 2.700 5.700 5.500 6-.6.600-.6 1.200-.5 2V21" />,
  linkedin: <><path {...stroke} d="M8 10.500V17M12 17v-3.800c0-1.600 1.100-2.700 2.500-2.700s2.500 1 2.500 2.700V17M12 10.500V17" /><path {...stroke} d="M8 7.300h.01" /><rect {...stroke} x="3" y="3" width="18" height="18" rx="4" /></>,
  resume: <><path {...stroke} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path {...stroke} d="M14 3v5h5M9 13h6M9 17h4" /></>,
};

const NAV = [
  { id: "top", label: "Home", tone: "t-cream" },
  { id: "experience", label: "Experience", tone: "t-sky" },
  { id: "work", label: "Work", tone: "t-wine" },
  { id: "stack", label: "Stack", tone: "t-olive" },
  { id: "contact", label: "Contact", tone: "t-hot" },
];

const OUT = [
  { key: "github", label: "GitHub", href: LINKS.github, tone: "t-ink" },
  { key: "linkedin", label: "LinkedIn", href: LINKS.linkedin, tone: "t-blue" },
  { key: "resume", label: "Resume", href: LINKS.resume, tone: "t-paper" },
];

const DockItem = ({ mouseX, label, tone, href, external, onClick, isActive, children }) => {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current ? ref.current.getBoundingClientRect() : { left: 0, width: 0 };
    return x - box.left - box.width / 2;
  });
  const lift = useTransform(distance, [-130, 0, 130], [1, 1.5, 1]);
  const scale = useSpring(lift, { stiffness: 320, damping: 22, mass: 0.2 });

  return (
    <a
      ref={ref}
      className="dock-item"
      href={href}
      aria-label={label}
      aria-current={isActive ? "true" : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
    >
      <span className="dock-tip" aria-hidden="true">{label}</span>
      <motion.span className={`dock-icon ${tone}`} style={{ scale }}>
        <svg viewBox="0 0 24 24" width="58%" height="58%" aria-hidden="true">{children}</svg>
      </motion.span>
      <i className={`dock-dot ${isActive ? "on" : ""}`} aria-hidden="true" />
    </a>
  );
};

const Dock = ({ active }) => {
  const mouseX = useMotionValue(-9999);
  const glass = useRef(null);
  useLiquid(glass, { id: "liquid-dock", radius: 24, bezel: 18, scale: 44, finish: "saturate(1.5) brightness(1.04)" });

  return (
    <nav
      ref={glass}
      className="dock"
      aria-label="Primary"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(-9999)}
    >
      {NAV.map(({ id, label, tone }) => (
        <DockItem
          key={id}
          mouseX={mouseX}
          label={label}
          tone={tone}
          href={`#${id}`}
          isActive={active === id}
          onClick={(e) => {
            e.preventDefault();
            scrollToId(id);
          }}
        >
          {G[id]}
        </DockItem>
      ))}
      <span className="dock-sep" aria-hidden="true" />
      {OUT.map(({ key, label, href, tone }) => (
        <DockItem key={key} mouseX={mouseX} label={label} tone={tone} href={href} external>
          {G[key]}
        </DockItem>
      ))}
    </nav>
  );
};

export default Dock;
