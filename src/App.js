import Main from './Compoents/Main/Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import Particles from 'react-particles-js';
import particlesConfig from './Particles';
import React from "react";
import { HashRouter } from "react-router-dom"
// const Lazyprofile = React.lazy(() => import("../About/About"));
function App() {
  return (
    // <React.Suspense fallback={logo}>
    <HashRouter>
      <div className="App" style={{ position: 'relative', overflow: "hidden" }}>
        <div style={{ position: 'fixed' }}>
          <Particles height="100vh" width="100vw" params={particlesConfig} />
        </div>
        <Main />
      </div>
    </HashRouter>
    // </React.Suspense>
  );
}

export default App;
