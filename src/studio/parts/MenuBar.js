import React, { useEffect, useState } from "react";

const formatTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

const MenuBar = () => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="menubar">
      <a href="#top" className="menubar-brand">
        <span aria-hidden="true">✿</span> shikha.singh
      </a>
      <div className="menubar-right">
        <span className="menubar-status">
          <i aria-hidden="true" /> open to work
        </span>
        <button
          type="button"
          className="menubar-k"
          aria-label="Open command menu"
          onClick={() => window.dispatchEvent(new CustomEvent("studio:palette"))}
        >
          ⌘K
        </button>
        <span className="menubar-extra">Delhi NCR</span>
        <span className="menubar-extra">{time} IST</span>
      </div>
    </header>
  );
};

export default MenuBar;
