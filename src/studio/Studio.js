import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createLilyScene } from "./lily/LilyScene";
import { setLenis, prefersReducedMotion } from "./smooth";
import MenuBar from "./parts/MenuBar";
import Cursor from "./parts/Cursor";
import Ribbon from "./parts/Ribbon";
import Lens from "./parts/Lens";
import Palette from "./parts/Palette";
import Dock from "./parts/Dock";
import { HeroName, Hero } from "./parts/Hero";
import Desktop from "./parts/Desktop";
import Work from "./parts/Work";
import Toolkit from "./parts/Toolkit";
import Letter from "./parts/Letter";
import "./studio.css";

gsap.registerPlugin(ScrollTrigger);

const whenFontsReady = () => {
  const wanted = ['40px "Bagel Fat One"', '500 20px "DM Mono"'];
  const loads = document.fonts
    ? Promise.all(wanted.map((f) => document.fonts.load(f))).then(() => document.fonts.ready)
    : Promise.resolve();
  // A slow font CDN should never hold the whole site hostage.
  const timeout = new Promise((resolve) => setTimeout(resolve, 2500));
  return Promise.race([loads, timeout]);
};

// A six-petal silhouette, drawn once and used for the full-screen bloom.
const BLOOM_PATH = (() => {
  const pts = [];
  for (let i = 0; i < 240; i++) {
    const a = (i / 240) * Math.PI * 2;
    const r = 62 + 38 * Math.pow(Math.abs(Math.cos(3 * a)), 1.3);
    pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

const Studio = () => {
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let cancelled = false;
    let scene = null;
    let lenis = null;
    let tick = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Each chapter owns a background colour, cross-faded as it arrives.
    // Derived from scroll position rather than enter/leave events, so a resize
    // or layout refresh can never strand the page on the wrong colour.
    let currentId = null;
    // The bloom paints the dark chapter, so the page beneath can already be
    // the next colour and be revealed as the flower closes.
    const workSection = document.getElementById("work");
    const colorOf = (s) => (!reduced && s.id === "work" ? "#EFD6D8" : s.dataset.bg);
    const syncChapter = () => {
      const line = window.innerHeight * 0.55;
      const sections = gsap.utils.toArray("[data-bg]");
      const section = sections.find((s) => s.getBoundingClientRect().bottom > line) || sections[sections.length - 1];
      if (!section || section.id === currentId) return;
      currentId = section.id;
      gsap.to("body", { backgroundColor: colorOf(section), duration: 0.8, ease: "power2.out", overwrite: "auto" });
      setActive(section.id);
    };
    // Computed straight from scroll position: however fast you jump,
    // the flower can only ever be in the one state that position implies.
    const clamp01 = gsap.utils.clamp(0, 1);
    const hotBloom = document.querySelector(".bloom.hot");
    const deepBloom = document.querySelector(".bloom.deep");
    const paintBloom = (el, grow, close, [r0, r1, r2]) => {
      gsap.set(el, {
        scale: 4.6 * grow * grow * (1 - close) * (1 - close),
        rotate: r0 + (r1 - r0) * grow + (r2 - r1) * close,
      });
    };
    const syncBloom = () => {
      const stackEl = document.getElementById("stack");
      if (reduced || !workSection || !stackEl) return;
      const vh = window.innerHeight;
      const opening = clamp01(1 - workSection.getBoundingClientRect().top / vh);
      const closing = clamp01((vh - stackEl.getBoundingClientRect().top) / (vh * 0.8));
      paintBloom(hotBloom, clamp01(opening / 0.86), clamp01((closing - 0.14) / 0.86), [-70, 25, 130]);
      paintBloom(deepBloom, clamp01((opening - 0.14) / 0.86), clamp01(closing / 0.86), [-50, 45, 150]);
    };

    // Checked every frame rather than on scroll events, so a resize, reload
    // or live update can never leave the page in a stale state.
    const syncAll = () => {
      syncChapter();
      syncBloom();
    };
    gsap.ticker.add(syncAll);

    const ctx = gsap.context(() => {

      if (reduced) return;
      gsap.utils.toArray(".sec-head").forEach((head) => {
        gsap.from(head.querySelectorAll(".rise"), {
          y: 70,
          opacity: 0,
          rotate: () => gsap.utils.random(-16, 16),
          duration: 0.8,
          stagger: 0.03,
          ease: "back.out(2)",
          scrollTrigger: { trigger: head, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
    });

    const onRefresh = () => {
      if (scene) scene.refresh();
      syncChapter();
      syncBloom();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const letters = gsap.utils.toArray(".ltr");
    const reveal = gsap.utils.toArray("[data-hero-in]");
    if (!reduced) {
      gsap.set(letters, { yPercent: 115, rotate: () => gsap.utils.random(-14, 14) });
      gsap.set(reveal, { y: 26, opacity: 0 });
    }

    whenFontsReady().then(() => {
      if (cancelled) return;
      scene = canvasRef.current ? createLilyScene(canvasRef.current, { reduced }) : null;
      ScrollTrigger.refresh();

      if (reduced) {
        if (introRef.current) introRef.current.style.display = "none";
        return;
      }
      const tl = gsap.timeline();
      tl.to(".intro-count", { innerText: 100, snap: { innerText: 1 }, duration: 0.75, ease: "power1.inOut" })
        .to(".intro-panel.up", { yPercent: -101, duration: 0.95, ease: "expo.inOut" }, "+=0.05")
        .to(".intro-panel.down", { yPercent: 101, duration: 0.95, ease: "expo.inOut" }, "<")
        .to(".intro-mark", { opacity: 0, duration: 0.25 }, "<")
        .set(introRef.current, { display: "none" })
        .call(() => {
          const name = document.querySelector(".hero-name");
          if (name) name.classList.add("is-live");
        }, null, "+=1.1")
        .to(letters, { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.045, ease: "back.out(1.6)" }, "-=0.55")
        .to(reveal, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power3.out" }, "-=0.7");
      if (scene) tl.to(scene.intro, { value: 1, duration: 2.1, ease: "power2.out" }, 0.75);
    });

    // Late-arriving images change section heights, so remeasure once they land.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    const onBurst = (e) => {
      if (reduced || !scene || e.button !== 0) return;
      if (e.target.closest && e.target.closest("a, button, .win, .orbit, .dock, .menubar")) return;
      scene.burst(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onBurst, { passive: true });
    const onPetals = () => {
      if (!scene) return;
      [0.2, 0.4, 0.6, 0.8].forEach((x, i) => {
        setTimeout(() => {
          if (scene) scene.burst(window.innerWidth * x, window.innerHeight * 0.3);
        }, i * 120);
      });
    };
    window.addEventListener("studio:petals", onPetals);
    // Rapid clicking for petals shouldn't highlight the text underneath.
    const onRepeatClick = (e) => {
      if (e.detail > 1) e.preventDefault();
    };
    window.addEventListener("mousedown", onRepeatClick);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pointerdown", onBurst);
      window.removeEventListener("studio:petals", onPetals);
      window.removeEventListener("mousedown", onRepeatClick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(syncAll);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      if (lenis) lenis.destroy();
      setLenis(null);
      if (scene) scene.dispose();
    };
  }, []);

  return (
    <div className="studio">
      <div className="intro" ref={introRef} aria-hidden="true">
        <div className="intro-panel up" />
        <div className="intro-panel down" />
        <div className="intro-mark">
          <span className="intro-word">blooming</span>
          <span className="intro-num">
            <span className="intro-count">0</span>%
          </span>
        </div>
      </div>

      <div className="bloom-layer" aria-hidden="true">
        <svg className="bloom hot" viewBox="-100 -100 200 200"><path d={BLOOM_PATH} /></svg>
        <svg className="bloom deep" viewBox="-100 -100 200 200"><path d={BLOOM_PATH} /></svg>
      </div>
      <HeroName />
      <canvas ref={canvasRef} className="lily-canvas" aria-hidden="true" />
      <MenuBar />

      <main className="stage">
        <Hero />
        <Ribbon />
        <Desktop />
        <Work />
        <Toolkit />
        <Letter />
      </main>

      <Dock active={active} />
      <Cursor />
      <Lens />
      <Palette />
      <div className="grain" aria-hidden="true" />
    </div>
  );
};

export default Studio;
