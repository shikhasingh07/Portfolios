import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LINKS } from "../content";
import { scrollToId, setScrollLock } from "../smooth";

const EMAIL = LINKS.email.replace("mailto:", "");

const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

const COMMANDS = [
  { id: "top", group: "Go to", label: "Home", run: () => scrollToId("top") },
  { id: "experience", group: "Go to", label: "Experience", run: () => scrollToId("experience") },
  { id: "work", group: "Go to", label: "Selected work", run: () => scrollToId("work") },
  { id: "stack", group: "Go to", label: "The toolkit", run: () => scrollToId("stack") },
  { id: "contact", group: "Go to", label: "Contact", run: () => scrollToId("contact") },
  { id: "resume", group: "Open", label: "Resume", run: () => open(LINKS.resume) },
  { id: "github", group: "Open", label: "GitHub", run: () => open(LINKS.github) },
  { id: "linkedin", group: "Open", label: "LinkedIn", run: () => open(LINKS.linkedin) },
  {
    id: "copy",
    group: "Do",
    label: "Copy my email",
    done: "Copied",
    run: () => navigator.clipboard.writeText(EMAIL),
  },
  {
    id: "petals",
    group: "Do",
    label: "Make it rain petals",
    run: () => window.dispatchEvent(new CustomEvent("studio:petals")),
  },
];

const Palette = () => {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [doneId, setDoneId] = useState(null);
  const returnFocus = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COMMANDS.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q)) : COMMANDS;
  }, [query]);

  const close = () => {
    setOpen(false);
    if (returnFocus.current && returnFocus.current.focus) returnFocus.current.focus({ preventScroll: true });
  };

  useEffect(() => {
    const toggle = () => {
      setOpen((was) => {
        if (!was) returnFocus.current = document.activeElement;
        return !was;
      });
      setQuery("");
      setActive(0);
      setDoneId(null);
    };
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("studio:palette", toggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("studio:palette", toggle);
    };
  }, []);

  useEffect(() => {
    setScrollLock(isOpen);
    return () => setScrollLock(false);
  }, [isOpen]);

  const execute = (command) => {
    if (!command) return;
    // The page must be unlocked before a command can scroll it.
    setScrollLock(false);
    Promise.resolve(command.run()).catch(() => {});
    if (command.done) {
      setDoneId(command.id);
      setTimeout(() => setOpen(false), 650);
    } else {
      close();
    }
  };

  const onInputKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      execute(results[active]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pal-veil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            className="pal"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <input
              className="pal-input"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={query}
              placeholder="Where to?"
              aria-label="Search commands"
              aria-controls="pal-list"
              aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
            />
            <ul className="pal-list" id="pal-list" role="listbox" aria-label="Commands">
              {results.map((c, i) => (
                <li
                  key={c.id}
                  id={`pal-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  className={`pal-item ${i === active ? "on" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => execute(c)}
                >
                  <span>{doneId === c.id ? c.done : c.label}</span>
                  <small>{c.group}</small>
                </li>
              ))}
              {results.length === 0 && <li className="pal-empty">Nothing here, try "work"</li>}
            </ul>
            <p className="pal-foot" aria-hidden="true">↑↓ move · enter open · esc close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Palette;
