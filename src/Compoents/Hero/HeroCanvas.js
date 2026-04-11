/**
 * HeroCanvas.js — Three.js 3D Background
 *
 * REACT CONCEPTS USED:
 *   - useRef    : mounts the renderer canvas into a DOM div without
 *                 triggering re-renders. Three.js manages its own RAF loop.
 *   - useEffect : entire Three.js lifecycle lives here.
 *                 Cleanup fn cancels the animation frame + disposes renderer
 *                 to prevent GPU memory leaks on unmount.
 *
 * WHY NO useState?
 *   Three.js has its own internal render loop (requestAnimationFrame).
 *   Storing scene state in React state would cause unnecessary re-renders
 *   and fight with Three.js. useRef is the right tool here.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const HeroCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // ── Scene setup ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Wireframe materials — night sky palette ───────────────
    const mat1 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.30 }); // gold
    const mat2 = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.25 }); // moonlight blue
    const mat3 = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.20 }); // nebula purple

    // ── Geometric shapes ──────────────────────────────────────
    const shapes = [];

    const addShape = (geo, mat, pos, rotation) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      shapes.push({ mesh, ...rotation });
    };

    addShape(new THREE.IcosahedronGeometry(4, 1),       mat1, [10, 2, -5],   { rx: 0.003, ry: 0.005 });
    addShape(new THREE.TorusKnotGeometry(2.5, 0.6, 80, 12), mat2, [-10, 4, -8], { rx: 0.004, ry: 0.003 });
    addShape(new THREE.OctahedronGeometry(2.5, 0),      mat3, [8, -6, -4],   { rx: 0.006, ry: 0.004 });
    addShape(new THREE.IcosahedronGeometry(1.5, 0),     mat2, [-8, -5, -2],  { rx: 0.007, ry: 0.005 });
    addShape(new THREE.TorusGeometry(2, 0.4, 16, 50),   mat1, [5, 7, -10],   { rx: 0.002, ry: 0.006 });

    // ── Particle field ────────────────────────────────────────
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150 * 3; i++) positions[i] = (Math.random() - 0.5) * 70;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0xfde68a, size: 0.10, transparent: true, opacity: 0.35 })
    );
    scene.add(particles);

    // ── Mouse parallax ────────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize handler ────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      shapes.forEach(({ mesh, rx, ry }) => {
        mesh.rotation.x += rx;
        mesh.rotation.y += ry;
      });
      particles.rotation.y += 0.0004;
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup (runs on unmount) ─────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []); // empty deps → run once on mount only

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
};

export default HeroCanvas;
