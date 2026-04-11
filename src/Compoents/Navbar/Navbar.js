/**
 * Navbar.js
 *
 * REACT CONCEPTS USED:
 *   - useState     : tracks `scrolled` (adds blur/shadow on scroll) and
 *                    `menuOpen` (mobile hamburger toggle)
 *   - useEffect    : attaches 'scroll' event listener; cleanup removes it
 *                    on unmount to prevent memory leaks
 *   - useCallback  : memoizes the scroll handler so it isn't recreated
 *                    every render — important because it's passed to
 *                    addEventListener which would otherwise get a new
 *                    reference each time, making cleanup unreliable
 *   - React.memo   : wraps the export so Navbar only re-renders when its
 *                    own state changes, not on every App-level re-render
 */
import React, { useState, useEffect, useCallback } from "react";
import { HashLink } from "react-router-hash-link";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "About", to: "/path#main__about" },
  { label: "Experience", to: "/path#Experience" },
  { label: "Work", to: "/path#Build" },
  { label: "Skills", to: "/path#skills" },
  { label: "Contact", to: "/path#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // useCallback: stable reference — safe to add/remove from addEventListener
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (el) => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <header className={`navbar-header ${scrolled ? "navbar-scrolled" : ""}`}>
      <nav className="navbar-inner">
        {/* Logo */}
        <HashLink to="/path#data__mainScreen" scroll={scrollTo} className="navbar-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">SS</span>
          <span className="logo-bracket">/&gt;</span>
        </HashLink>

        {/* Desktop Links */}
        <ul className="navbar-links">
          {NAV_LINKS.map(({ label, to }, i) => (
            <li key={label}>
              <HashLink to={to} scroll={scrollTo} className="nav-link">
                <span className="nav-num">0{i + 1}.</span>
                {label}
              </HashLink>
            </li>
          ))}
          <li>
            <a
              className="btn-outline nav-resume"
              href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Resume ↗
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ label, to }, i) => (
            <HashLink key={label} to={to} scroll={scrollTo} className="mobile-link">
              <span className="nav-num">0{i + 1}.</span> {label}
            </HashLink>
          ))}
          <a
            className="btn-outline mobile-resume"
            href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            Resume ↗
          </a>
        </div>
      )}
    </header>
  );
};

// React.memo: skip re-render if props haven't changed
export default React.memo(Navbar);
