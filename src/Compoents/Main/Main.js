import React from "react";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Experience from "../Experience/Experience";
import Projects from "../Projects/Projects";
import Skills from "../Skills/Skills";
import Contact from "../Contact/Contact";

const StarCanvas = React.lazy(() => import("../Hero/StarCanvas"));

const Main = () => {
  return (
    <>
      <React.Suspense fallback={null}>
        <StarCanvas />
      </React.Suspense>

      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
};

export default Main;
