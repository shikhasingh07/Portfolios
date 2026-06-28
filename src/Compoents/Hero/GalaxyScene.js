import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Full-viewport rotating galaxy — pink / purple / cyan stars
   Drag to tilt · auto-rotates · mouse parallax               */
const GalaxyScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.set(0, 6, 22);
    camera.lookAt(0, 0, 0);

    // ── Galaxy particles ──────────────────────────────────────
    const COUNT  = 10000;
    const ARMS   = 3;
    const pos    = new Float32Array(COUNT * 3);
    const col    = new Float32Array(COUNT * 3);
    const sizes  = new Float32Array(COUNT);

    // Colour palette: fuchsia, violet, cyan-white, rose
    const palette = [
      [0.94, 0.67, 0.99], // fuchsia  #f0abfc
      [0.51, 0.55, 0.97], // violet   #818cf8
      [0.40, 0.91, 0.98], // cyan     #67e8f9
      [0.98, 0.44, 0.52], // rose     #fb7185
      [1.00, 1.00, 1.00], // white core
    ];

    for (let i = 0; i < COUNT; i++) {
      const arm    = Math.floor(Math.random() * ARMS);
      const r      = Math.pow(Math.random(), 0.55) * 11; // non-linear dist
      const spin   = r * 0.75;
      const base   = arm * ((Math.PI * 2) / ARMS);
      const spread = (Math.random() - 0.5) * (0.6 + r * 0.08);
      const angle  = base + spin + spread;
      const y      = (Math.random() - 0.5) * 0.7 * (1 - r / 12);

      pos[i * 3]     = Math.cos(angle) * r + (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.5;

      // Color: inner = white/bright, outer = palette
      const t    = r / 11;
      const pick = t < 0.25 ? 4 : Math.floor(Math.random() * 4);
      const c    = palette[pick];
      col[i * 3]     = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];

      sizes[i] = t < 0.2 ? 2.5 + Math.random() * 2 : 0.8 + Math.random() * 1.8;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    geo.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (280.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = 1.0 - smoothstep(0.0, 1.0, d);
          a = pow(a, 1.6);
          if (a < 0.01) discard;
          gl_FragColor = vec4(vColor, a * 0.55);
        }
      `,
    });

    const galaxy = new THREE.Points(geo, mat);
    scene.add(galaxy);

    // ── Ambient fog dust ──────────────────────────────────────
    const dustGeo = new THREE.BufferGeometry();
    const dPos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000 * 3; i++) dPos[i] = (Math.random() - 0.5) * 40;
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: 0xd8b4fe, size: 0.03, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    // ── Mouse drag / parallax ─────────────────────────────────
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let rotX = 0.35;
    let velX = 0, velY = 0;
    let mouse = { x: 0, y: 0 };

    const onDown  = (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
    const onUp    = ()  => { isDragging = false; };
    const onMove  = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
      if (!isDragging) return;
      velY  += (e.clientX - lastX) * 0.003;
      velX  += (e.clientY - lastY) * 0.003;
      lastX  = e.clientX; lastY = e.clientY;
    };

    window.addEventListener("mousedown",  onDown, { passive: true });
    window.addEventListener("mouseup",    onUp,   { passive: true });
    window.addEventListener("mousemove",  onMove, { passive: true });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Animate ───────────────────────────────────────────────
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Auto-rotate + inertia
      if (!isDragging) {
        galaxy.rotation.y += 0.0018;
        velX *= 0.94; velY *= 0.94;
      }
      rotX += velX;
      galaxy.rotation.x = rotX;
      galaxy.rotation.y += velY;

      // Subtle camera parallax
      camera.position.x += (mouse.x * 2  - camera.position.x) * 0.025;
      camera.position.y += (-mouse.y * 1 + 4 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("resize",     onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "all" }}
    />
  );
};

export default GalaxyScene;
