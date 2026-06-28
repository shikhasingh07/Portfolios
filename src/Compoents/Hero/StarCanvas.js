import { useEffect, useRef } from "react";
import * as THREE from "three";

const StarCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x060010, 1); // deep violet-black
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.z = 1;

    // ── Aurora orbs — large translucent blobs far back ────────
    const auroraData = [
      { color: 0x7c3aed, x: -100, y:  80, z: -300, size: 60, speed: 0.0003 },
      { color: 0x0e7490, x:  120, y: -60, z: -280, size: 50, speed: 0.0004 },
      { color: 0x831843, x:   20, y:  30, z: -320, size: 45, speed: 0.0002 },
      { color: 0x4c1d95, x: -80, y: -90, z: -300, size: 55, speed: 0.0003 },
    ];

    const auroraObjects = auroraData.map(({ color, x, y, z, size }) => {
      const count = 80;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = Math.random() * size;
        const a = Math.random() * Math.PI * 2;
        const b = Math.random() * Math.PI;
        pos[i * 3]     = x + r * Math.sin(b) * Math.cos(a);
        pos[i * 3 + 1] = y + r * Math.sin(b) * Math.sin(a);
        pos[i * 3 + 2] = z + r * Math.cos(b);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size: 8,
        transparent: true,
        opacity: 0.045,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      return pts;
    });

    // ── Stars ─────────────────────────────────────────────────
    const buildStars = (count, spread, size, color, opacity) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, mat };
    };

    const far  = buildStars(2000, 400, 0.14, 0xddd6fe, 0.40); // violet-tinted far stars
    const mid  = buildStars(700,  200, 0.22, 0xe0f2fe, 0.58);
    const near = buildStars(250,  120, 0.38, 0xffffff, 0.80);

    // ── Shooting stars ────────────────────────────────────────
    const MAX_SHOOTERS = 4;
    const shooters = [];
    const makeShooter = () => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const mat = new THREE.LineBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      return { line, geo, mat, active: false, t: 0 };
    };
    for (let i = 0; i < MAX_SHOOTERS; i++) shooters.push(makeShooter());

    const spawnShooter = (s) => {
      s.active = true; s.t = 0;
      s.x  = (Math.random() - 0.2) * 200;
      s.y  = (Math.random() * 0.5 + 0.3) * 100;
      s.z  = (Math.random() - 0.5) * 50;
      s.dx = -(Math.random() * 3 + 2);
      s.dy = -(Math.random() * 1.5 + 0.5);
      s.len = Math.random() * 14 + 7;
      s.mat.opacity = 0;
    };

    let mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.22;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.22;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize, { passive: true });

    let frameId, t = 0, nextShoot = 80;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.006;

      // Slow aurora drift
      auroraObjects.forEach((o, i) => {
        o.rotation.y += auroraData[i].speed;
        o.rotation.z += auroraData[i].speed * 0.7;
      });

      // Stars
      far.points.rotation.y  += 0.00005;
      far.points.rotation.x  += 0.00002;
      mid.points.rotation.y  += 0.00010;
      near.points.rotation.y += 0.00018;

      far.mat.opacity  = 0.33 + 0.09 * Math.sin(t * 0.7);
      mid.mat.opacity  = 0.48 + 0.10 * Math.sin(t * 1.1 + 1);
      near.mat.opacity = 0.70 + 0.10 * Math.sin(t * 1.5 + 2);

      // Shooting stars
      nextShoot--;
      if (nextShoot <= 0) {
        nextShoot = Math.floor(Math.random() * 220 + 140);
        const s = shooters.find((s) => !s.active);
        if (s) spawnShooter(s);
      }
      shooters.forEach((s) => {
        if (!s.active) return;
        s.t++;
        const prog = s.t / 60;
        if (prog >= 1) { s.active = false; s.mat.opacity = 0; return; }
        const fade = prog < 0.2 ? prog / 0.2 : prog > 0.7 ? (1 - prog) / 0.3 : 1;
        s.mat.opacity = fade * 0.85;
        const hx = s.x + s.dx * s.t; const hy = s.y + s.dy * s.t;
        const pos = s.geo.attributes.position.array;
        pos[0] = hx - s.dx * s.len * 0.3; pos[1] = hy - s.dy * s.len * 0.3; pos[2] = s.z;
        pos[3] = hx; pos[4] = hy; pos[5] = s.z;
        s.geo.attributes.position.needsUpdate = true;
      });

      camera.position.x += (mouse.x - camera.position.x) * 0.016;
      camera.position.y += (-mouse.y - camera.position.y) * 0.016;
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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
};

export default StarCanvas;
