/**
 * src/App.js
 *
 * REACT CONCEPTS USED:
 *   - React.lazy    : dynamically imports <Main /> so it's excluded from the
 *                     initial bundle. The browser only downloads it when needed.
 *   - React.Suspense: shows a fallback UI while the lazy component loads.
 *                     Without Suspense, React would throw an error on lazy load.
 *   - HashRouter    : client-side routing without a server — works perfectly
 *                     on static hosts (GitHub Pages, Netlify).
 */
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { HashRouter } from "react-router-dom";

// React.lazy — code-split Main so the initial JS bundle stays small
const Main = React.lazy(() => import("./Compoents/Main/Main"));

function App() {
  return (
    <HashRouter>
      {/* Suspense: render a skeleton while Main.js chunk is downloading */}
      <React.Suspense
        fallback={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#050510",
              color: "#6366f1",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "14px",
              letterSpacing: "0.1em",
            }}
          >
            Loading...
          </div>
        }
      >
        <Main />
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
