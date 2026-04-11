/**
 * Main.js — Root layout component
 *
 * REACT CONCEPTS USED:
 *   - Component composition : Main orchestrates all sections as a flat list.
 *                             Each section is self-contained (owns its state
 *                             and animations) — Main just renders them in order.
 *   - No prop drilling      : each section pulls data from its own static
 *                             arrays — nothing flows through Main.
 *   - React.lazy (indirect) : HeroCanvas inside <About> is already lazy-loaded,
 *                             so Main never waits for Three.js on first render.
 */
import React from "react";
import Navbar from "../Navbar/Navbar";
import About from "../About/About";
import Experience from "../Experience/Experience";
import Skills from "../Skills/Skills";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";

const Main = () => {
  return (
    <>
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
