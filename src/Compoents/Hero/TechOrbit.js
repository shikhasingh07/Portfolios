import { useEffect, useRef } from "react";
import * as THREE from "three";

const ORBITS = [
  { color: 0x61dafb, radius: 4.5, speed: 0.016, tilt: 0.4,  size: 0.28, phase: 0 },
  { color: 0x3178c6, radius: 6.5, speed: 0.011, tilt: 1.0,  size: 0.32, phase: 1.2 },
  { color: 0xa78bfa, radius: 8.5, speed: 0.007, tilt: 0.6,  size: 0.36, phase: 2.4 },
  { color: 0xf59e0b, radius: 10.5, speed: 0.005, tilt: 1.3, size: 0.30, phase: 3.6 },
  { color: 0x06b6d4, radius: 12.5, speed: 0.004, tilt: 0.2, size: 0.26, phase: 0.8 },
];

const TechOrbit = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth  || 500;
    const H = mount.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.set(0, 3, 22);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const core_light = new THREE.PointLight(0x8b5cf6, 4, 25);
    core_light.position.set(0, 0, 0);
    scene.add(core_light);
    const fill = new THREE.PointLight(0x06b6d4, 1.5, 30);
    fill.position.set(10, 8, 5);
    scene.add(fill);

    // Core sphere — glowing violet
    const coreGeo = new THREE.SphereGeometry(1.4, 48, 48);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.1,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Core outer glow (additive sprite-like sphere)
    const glowGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Orbital rings + satellite spheres
    const orbitals = ORBITS.map(({ color, radius, speed, tilt, size, phase }) => {
      // Ring
      const ringGeo = new THREE.TorusGeometry(radius, 0.018, 8, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tilt;
      scene.add(ring);

      // Satellite sphere
      const satGeo = new THREE.SphereGeometry(size, 20, 20);
      const satMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.9,
        metalness: 0.6,
        roughness: 0.2,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      scene.add(sat);

      // Tiny trailing glow
      const trailGeo = new THREE.SphereGeometry(size * 1.8, 12, 12);
      const trailMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 });
      const trail = new THREE.Mesh(trailGeo, trailMat);
      scene.add(trail);

      return { ring, sat, trail, radius, speed, tilt, angle: phase };
    });

    // Particle dust
    const pCount = 400;
    const pPos = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    const palette = [
      [0.55, 0.36, 0.96], // violet
      [0.02, 0.71, 0.83], // cyan
      [0.96, 0.25, 0.37], // rose
    ];
    for (let i = 0; i < pCount; i++) {
      const r = 8 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      pColors[i * 3] = c[0]; pColors[i * 3+1] = c[1]; pColors[i * 3+2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(pColors, 3));
    const dust = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.07, transparent: true, opacity: 0.6, vertexColors: true, sizeAttenuation: true,
    }));
    scene.add(dust);

    // Mouse tracking
    let mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let frameId;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.012;

      // Core pulse
      const pulse = 1 + 0.06 * Math.sin(t * 2.5);
      core.scale.setScalar(pulse);
      coreMat.emissiveIntensity = 1.0 + 0.4 * Math.sin(t * 2.5);
      core.rotation.y += 0.008;
      core.rotation.x += 0.003;

      // Orbital motion
      orbitals.forEach((o) => {
        o.angle += o.speed;
        const cosT = Math.cos(o.tilt);
        const sinT = Math.sin(o.tilt);
        const cosA = Math.cos(o.angle);
        const sinA = Math.sin(o.angle);
        const x = o.radius * cosA;
        const y = o.radius * sinA * sinT;
        const z = o.radius * sinA * cosT;
        o.sat.position.set(x, y, z);
        o.trail.position.set(x, y, z);
        o.ring.rotation.z += 0.0005;
      });

      dust.rotation.y += 0.0003;
      dust.rotation.x += 0.0001;

      // Camera parallax
      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.035;
      camera.position.y += (-mouse.y * 3 + 3 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

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

  return <div ref={mountRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }} />;
};

export default TechOrbit;
