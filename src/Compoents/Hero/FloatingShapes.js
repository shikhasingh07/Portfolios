import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Elegant wireframe 3D shapes that drift slowly above the gradient blobs */
const FloatingShapes = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // fully transparent — blobs show through
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.z = 28;

    // ── Helper: wireframe mesh ────────────────────────────────
    const wire = (geo, color, opacity = 0.18) =>
      new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity }));

    // ── Shapes: violet / cyan / rose family ──────────────────
    const shapes = [
      { mesh: wire(new THREE.IcosahedronGeometry(3.5, 1),        0x8b5cf6, 0.15), pos: [-14,  5, -8],  rx: 0.004, ry: 0.007 },
      { mesh: wire(new THREE.TorusKnotGeometry(2, 0.55, 80, 12), 0x06b6d4, 0.12), pos: [ 16, -3, -12], rx: 0.005, ry: 0.004 },
      { mesh: wire(new THREE.OctahedronGeometry(2.8, 0),          0xa78bfa, 0.18), pos: [-18, -8, -5],  rx: 0.007, ry: 0.005 },
      { mesh: wire(new THREE.IcosahedronGeometry(1.8, 0),         0x38bdf8, 0.20), pos: [ 10,  9, -6],  rx: 0.006, ry: 0.008 },
      { mesh: wire(new THREE.TorusGeometry(2.2, 0.45, 12, 48),    0xc084fc, 0.13), pos: [  2, -12, -10], rx: 0.003, ry: 0.006 },
      { mesh: wire(new THREE.TetrahedronGeometry(2.2, 0),          0xf43f5e, 0.12), pos: [ 20,  8, -14], rx: 0.008, ry: 0.004 },
      { mesh: wire(new THREE.IcosahedronGeometry(1.2, 1),         0x7c3aed, 0.22), pos: [-6,  12, -4],  rx: 0.005, ry: 0.009 },
    ];

    shapes.forEach(({ mesh, pos }) => {
      mesh.position.set(...pos);
      scene.add(mesh);
    });

    // ── Floating particles ────────────────────────────────────
    const pCount = 250;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 80;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xa78bfa, size: 0.10, transparent: true, opacity: 0.35, sizeAttenuation: true,
    })));

    // ── Mouse parallax ────────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Animation loop ────────────────────────────────────────
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      shapes.forEach(({ mesh, rx, ry }) => {
        mesh.rotation.x += rx;
        mesh.rotation.y += ry;
      });

      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

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

export default FloatingShapes;
