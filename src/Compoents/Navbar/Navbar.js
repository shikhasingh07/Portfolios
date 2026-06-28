import React, { useState, useEffect, useCallback } from "react";
import { HashLink } from "react-router-hash-link";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Overview", to: "/path#main__about" },
  { label: "Work",     to: "/path#Build"       },
  { label: "Contact",  to: "/path#contact"     },
];

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 60), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (el) => { el.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <header className={`navbar-header ${scrolled ? "navbar-scrolled" : ""}`}>
      <nav className="navbar-inner">
        <HashLink to="/path#data__mainScreen" scroll={scrollTo} className="navbar-logo" data-cursor>
          <span className="logo-bracket">[</span>
          <span className="logo-text">SS</span>
          <span className="logo-bracket">/]</span>
        </HashLink>

        <ul className="navbar-links">
          {NAV_LINKS.map(({ label, to }, i) => (
            <li key={label}>
              <HashLink to={to} scroll={scrollTo} className="nav-link" data-cursor>
                <span className="nav-num">0{i + 1}_</span>{label}
              </HashLink>
            </li>
          ))}
          <li>
            <a
              className="btn-outline nav-resume"
              href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
              target="_blank" rel="noreferrer" data-cursor
            >
              RESUME ↗
            </a>
          </li>
        </ul>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu" data-cursor
        >
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ label, to }, i) => (
            <HashLink key={label} to={to} scroll={scrollTo} className="mobile-link" data-cursor>
              <span className="nav-num">0{i + 1}_</span> {label}
            </HashLink>
          ))}
          <a
            className="btn-outline mobile-resume"
            href="https://drive.google.com/file/d/1dY0zZUBNGQGdB0ANqAWW5H-VrRJY0BYZ/view?usp=sharing"
            target="_blank" rel="noreferrer" data-cursor
          >
            RESUME ↗
          </a>
        </div>
      )}
    </header>
  );
};

export default React.memo(Navbar);
