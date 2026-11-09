// Shared handle to the smooth scroller, so the dock can drive it.
let lenis = null;

export const setLenis = (instance) => {
  lenis = instance;
};

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.5 });
  else el.scrollIntoView();
};

// Moves the page to an exact position. `immediate` follows a finger or mouse 1:1.
export const scrollToY = (y, { immediate = false, duration = 0.9 } = {}) => {
  if (lenis) lenis.scrollTo(y, { immediate, duration, force: true });
  else window.scrollTo(0, y);
};

// Holds the page still while an overlay is open.
export const setScrollLock = (locked) => {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
};

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
