import React from "react";
import Navbar   from "../Navbar/Navbar";
import Background from "../Hero/Background";
import Hero     from "../Hero/Hero";
import Overview from "../Overview/Overview";
import Work     from "../Work/Work";
import Contact  from "../Contact/Contact";

const Main = () => (
  <>
    <Background />
    <Navbar />
    <Hero />
    <Overview />
    <Work />
    <Contact />
  </>
);

export default Main;
