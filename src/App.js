import Main from './Compoents/Main/Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import Particles from 'react-particles-js';
import particlesConfig from './Particles';
import React from "react";
import { HashRouter } from "react-router-dom"
import { useState } from "react";
// const Lazyprofile = React.lazy(() => import("../About/About"));
function App() {
  const [light, setLight] = useState(false);
  return (
    // <React.Suspense fallback={logo}>
    <>
      <HashRouter>
        <div className={light === false ? "light" : "dark"} style={{ position: 'relative', overflow: "hidden" }}>
          <div style={{ position: 'fixed' }}>
            <Particles height="100vh" width="100vw" params={particlesConfig} />
          </div>
          <Main />
        </div>
      </HashRouter>
      <div
        orientation="right"
        className=" jSIwrL"
      >
        <div className=" jJFfEJ fade-enter-done">
          <a href="mailto:shikha.thankur2295@gmail.com">
            shikha.thankur2295@gmail.com
          </a>
        </div>
      </div>
      <div orientation="right" className="light__bowl" onClick={() => setLight(!light)}>
        {light === false ? <div className="light__text jJFfEJ fade-enter-done">
          on
        </div> : <div className="dark__text jJFfEJ fade-enter-done">
          Off
        </div>}
      </div>
      {/* // </React.Suspense> */}
    </>
  );
}

export default App;
