/**
 * Main.js — Root layout component
 *
 * REACT CONCEPTS USED:
 *   - React.lazy + Suspense : StarCanvas (Three.js) is lazy-loaded so the
 *                             starfield doesn't block the initial page paint.
 *                             The rest of the page renders immediately while
 *                             Three.js loads in the background.
 *   - Component composition : Main is a thin shell — each section owns its
 *                             own state, animations, and data.
 *   - No prop drilling      : nothing flows through Main; each child is self-contained.
 */
import React from "react";
import Navbar from "../Navbar/Navbar";
import About from "../About/About";
import Experience from "../Experience/Experience";
import Skills from "../Skills/Skills";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";

// Lazy-load the Three.js starfield so it never blocks first paint
const StarCanvas = React.lazy(() => import("../Hero/StarCanvas"));

const Main = () => {
  return (
    <>
      {/* Fixed night-sky starfield — renders behind everything via z-index 0 */}
      <React.Suspense fallback={null}>
        <StarCanvas />
      </React.Suspense>

      <Navbar />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
};

export default Main;
