import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { HashRouter } from "react-router-dom";

const Main = React.lazy(() => import("./Compoents/Main/Main"));

function App() {
  return (
    <HashRouter>
      <React.Suspense
        fallback={
          <div style={{
            minHeight: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#03060f", color: "#00f5ff",
            fontFamily: "JetBrains Mono, monospace", fontSize: "12px",
            letterSpacing: "0.2em",
          }}>
            LOADING...
          </div>
        }
      >
        <Main />
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
