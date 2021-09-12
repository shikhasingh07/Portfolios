import React from "react";
import Navbar from "../Navbar/Navbar";
import Experience from "../Experience/Experience";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";
import About from "../About/About";
import "./Main.css";
const Main = () => {
  return (
    <>

      <Navbar />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
};

export default Main;
