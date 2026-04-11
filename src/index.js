/**
 * src/index.js — React 18 Entry Point
 *
 * REACT CONCEPT: createRoot (React 18)
 *   Previously (React 16): ReactDOM.render(<App />, document.getElementById('root'))
 *   Now (React 18):        createRoot(el).render(<App />)
 *
 *   createRoot opts the entire app into Concurrent Mode, which enables:
 *     • Interruptible rendering (React can pause heavy renders)
 *     • useTransition / useDeferredValue hooks
 *     • Automatic batching of state updates (even inside setTimeout/Promises)
 *     • Streaming SSR with Suspense
 *
 * REACT CONCEPT: React.StrictMode
 *   Wrapping in <StrictMode> makes React intentionally double-invoke
 *   renders and effects in development to help catch side-effects and
 *   deprecated API usage early. Has zero cost in production builds.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
