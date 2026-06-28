import React, { Suspense } from "react";
import "./background.css";

const GalaxyScene = React.lazy(() => import("./GalaxyScene"));

/* Galaxy fills the whole viewport, dark overlay on top */
const Background = () => (
  <>
    <div className="bg-dark-base" aria-hidden="true" />
    <Suspense fallback={null}>
      <GalaxyScene />
    </Suspense>
    <div className="bg-overlay" aria-hidden="true" />
  </>
);

export default Background;
