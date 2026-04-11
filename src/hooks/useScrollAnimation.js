/**
 * useScrollAnimation — Custom Hook
 *
 * REACT CONCEPTS USED:
 *   - useRef    : attaches to the DOM element being observed (doesn't cause re-render)
 *   - useState  : tracks whether element has entered the viewport
 *   - useEffect : sets up IntersectionObserver on mount, cleans up on unmount
 *
 * WHY A CUSTOM HOOK?
 *   Reusable across every section. Any component can call this one hook
 *   instead of duplicating IntersectionObserver setup in each file.
 *
 * USAGE:
 *   const [ref, inView] = useScrollAnimation();
 *   <div ref={ref} style={{ opacity: inView ? 1 : 0 }}>...</div>
 */
import { useRef, useState, useEffect } from "react";

const useScrollAnimation = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Once visible, stop observing — no need to toggle off
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    // Cleanup: disconnect observer if component unmounts before element is visible
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

export default useScrollAnimation;
