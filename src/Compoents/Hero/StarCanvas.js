/**
 * StarCanvas.js — Full-page animated night-sky starfield (fixed background)
 *
 * REACT CONCEPTS:
 *   - useRef    : mounts renderer into DOM without triggering re-renders
 *   - useEffect : Three.js lifecycle + cleanup (cancelAnimationFrame + dispose)
 *
 * Three.js technique:
 *   - Two separate Points layers at different speeds/sizes → depth illusion
 *   - Each star has a random "twinkle phase" stored in a Float32Array so we
 *     update opacity per-frame without touching React state
 *   - Mouse parallax: camera slowly drifts toward cursor for subtle parallax
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const StarCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x03061a, 1); // deep midnight navy
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.z = 1;

    // ── Helper: build a star layer ────────────────────────────
    const buildStars = (count, spread, size, color, opacity) => {
      const pos = new Float32Array(count * 3);
      const phases = new Float32Array(count); // twinkle phase offset
      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
        phases[i]       = Math.random() * Math.PI * 2;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, mat, phases };
    };

    // Far dim stars — cool white
    const far  = buildStars(1800, 400, 0.18, 0xd4e4ff, 0.55);
    // Mid stars — warm gold
    const mid  = buildStars(600,  200, 0.28, 0xfde68a, 0.70);
    // Close bright stars — pure white
    const near = buildStars(200,  120, 0.45, 0xffffff, 0.90);

    // ── Slow nebula fog (large coloured sprites) ──────────────
    const nebulaGeo = new THREE.BufferGeometry();
    const nPos = new Float32Array(12 * 3);
    for (let i = 0; i < 12 * 3; i++) nPos[i] = (Math.random() - 0.5) * 300;
    nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
    const nebulaMat = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: 8,
      transparent: true,
      opacity: 0.04,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(nebulaGeo, nebulaMat));

    // ── Mouse parallax ────────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Animation loop ────────────────────────────────────────
    let frameId;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.008;

      // Slow global drift — feels like floating in space
      far.points.rotation.y  += 0.00008;
      far.points.rotation.x  += 0.00004;
      mid.points.rotation.y  += 0.00015;
      near.points.rotation.y += 0.00025;
      near.points.rotation.x += 0.00010;

      // Twinkle — vary opacity sinusoidally per layer
      far.mat.opacity  = 0.45 + 0.12 * Math.sin(t * 0.9);
      mid.mat.opacity  = 0.60 + 0.12 * Math.sin(t * 1.3 + 1);
      near.mat.opacity = 0.80 + 0.12 * Math.sin(t * 1.7 + 2);

      // Camera parallax
      camera.position.x += (mouse.x - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default StarCanvas;
