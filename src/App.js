import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { HashRouter } from "react-router-dom"
import { useState } from "react";
const Lazyprofile = React.lazy(() => import("./Compoents/Main/Main"));
function App() {
  const [light, setLight] = useState(false);
  return (

    <>
      <HashRouter>
        <div className={light === false ? "light" : "dark"} style={{ position: 'relative', overflow: "hidden" }}>
          <React.Suspense fallback={"Loading Please Wait"}>
            <Lazyprofile />
          </React.Suspense>
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
    </>

  );
}

export default App;
