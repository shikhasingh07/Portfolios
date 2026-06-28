import { useEffect, useRef } from "react";
import * as THREE from "three";

const HeroScene = () => {
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.set(0, 0, 10);

    // ── Ambient ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // ── Rotating colored light group ──────────────────────────
    const lightGroup = new THREE.Group();
    const lightDefs = [
      { color: 0xf72585, i: 5, pos: [ 6,  3,  3] },   // hot pink
      { color: 0x7209b7, i: 4, pos: [-6, -2,  4] },   // violet
      { color: 0x4cc9f0, i: 3.5, pos: [ 0,  6, -3] }, // sky cyan
      { color: 0xfb923c, i: 3, pos: [ 0, -6,  2] },   // amber
      { color: 0xe040fb, i: 2.5, pos: [-4,  4,  2] }, // magenta
    ];
    lightDefs.forEach(({ color, i, pos }) => {
      const l = new THREE.PointLight(color, i, 22);
      l.position.set(...pos);
      lightGroup.add(l);
    });
    scene.add(lightGroup);

    // ── Crystal gem — iridescent ──────────────────────────────
    const crystalGeo = new THREE.IcosahedronGeometry(2.2, 4);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color:       0xffffff,
      metalness:   0.05,
      roughness:   0.02,
      iridescence: 1.0,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [80, 900],
      clearcoat:   1.0,
      clearcoatRoughness: 0.0,
      reflectivity: 1.0,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    scene.add(crystal);

    // ── Inner core — glowing emissive ─────────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(1.3, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xf72585,
      emissive: 0xf72585,
      emissiveIntensity: 0.6,
      metalness: 0.0,
      roughness: 0.1,
      transparent: true,
      opacity: 0.55,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ── Outer glow sphere ─────────────────────────────────────
    const outerGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xf72585, transparent: true, opacity: 0.04, side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(outerGeo, outerMat));

    // ── Floating ring ─────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(3.6, 0.022, 8, 160);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf72585, transparent: true, opacity: 0.3 });
    const ring    = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = 0.9;
    scene.add(ring);

    // ── Second ring (cyan) ────────────────────────────────────
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.015, 8, 160);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x4cc9f0, transparent: true, opacity: 0.2 });
    const ring2    = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = 0.4;
    ring2.rotation.z = 0.6;
    scene.add(ring2);

    // ── Particle cloud ────────────────────────────────────────
    const pCount = 300;
    const pPos   = new Float32Array(pCount * 3);
    const pCol   = new Float32Array(pCount * 3);
    const palette = [
      [0.97, 0.14, 0.52], // pink
      [0.44, 0.04, 0.72], // violet
      [0.30, 0.79, 0.94], // cyan
      [0.98, 0.57, 0.24], // amber
    ];
    for (let i = 0; i < pCount; i++) {
      const r  = 3.8 + Math.random() * 3;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      pPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
      pPos[i*3+2] = r * Math.cos(ph);
      const c = palette[Math.floor(Math.random() * palette.length)];
      pCol[i*3] = c[0]; pCol[i*3+1] = c[1]; pCol[i*3+2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(pCol, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.07, transparent: true, opacity: 0.65, vertexColors: true, sizeAttenuation: true,
    })));

    // ── Mouse ─────────────────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5);
      mouse.y = (e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth; const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Animation ─────────────────────────────────────────────
    let frameId, t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.01;

      // Rotate lights — creates color-cycling effect
      lightGroup.rotation.y += 0.012;
      lightGroup.rotation.x += 0.005;

      // Crystal gentle rotate + mouse tilt
      crystal.rotation.y += 0.006;
      crystal.rotation.x += 0.003;
      crystal.rotation.y += (mouse.x * 0.3 - crystal.rotation.y) * 0.02;
      crystal.rotation.x += (-mouse.y * 0.2 - crystal.rotation.x) * 0.02;

      // Inner core breathes
      core.rotation.y -= 0.008;
      const pulse = 1 + 0.06 * Math.sin(t * 2.5);
      core.scale.setScalar(pulse);
      coreMat.emissiveIntensity = 0.5 + 0.35 * Math.sin(t * 2);

      // Rings
      ring.rotation.z  += 0.005;
      ring2.rotation.z -= 0.003;

      // Emissive color cycle on core
      const r = 0.5 + 0.5 * Math.sin(t * 0.7);
      const g = 0.1 + 0.2 * Math.sin(t * 0.7 + 2);
      const b = 0.5 + 0.5 * Math.sin(t * 0.7 + 4);
      coreMat.color.setRGB(r, g, b);
      coreMat.emissive.setRGB(r * 0.5, g * 0.1, b * 0.5);

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

export default HeroScene;
