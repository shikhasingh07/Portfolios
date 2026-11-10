// The 3D world: one procedural lily that travels through the page as you scroll.
// Nothing is a downloaded model, so the whole scene costs only code.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const smooth = (t) => t * t * (3 - 2 * t);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ── Textures ─────────────────────────────────────────────── */

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function finishTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function petalTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 1024;
  const g = c.getContext("2d");
  const rand = seeded(4242);

  // Length: y=0 on the canvas is the tip, y=1024 is the throat.
  const along = g.createLinearGradient(0, 0, 0, 1024);
  along.addColorStop(0, "#f9edeb");
  along.addColorStop(0.35, "#efd6d8");
  along.addColorStop(0.72, "#c0808f");
  along.addColorStop(0.92, "#d8c4ac");
  along.addColorStop(1, "#b9b184");
  g.fillStyle = along;
  g.fillRect(0, 0, 512, 1024);

  // Pale margins with colour pooling along the centre.
  const across = g.createLinearGradient(0, 0, 512, 0);
  across.addColorStop(0, "rgba(249,237,235,.95)");
  across.addColorStop(0.3, "rgba(239,214,216,.2)");
  across.addColorStop(0.5, "rgba(139,79,100,.42)");
  across.addColorStop(0.7, "rgba(239,214,216,.2)");
  across.addColorStop(1, "rgba(249,237,235,.95)");
  g.fillStyle = across;
  g.fillRect(0, 0, 512, 1024);

  // Fine longitudinal veins.
  g.lineCap = "round";
  for (let i = 0; i < 44; i++) {
    const x = 20 + (i / 43) * 472;
    g.strokeStyle = `rgba(139,79,100,${0.05 + rand() * 0.1})`;
    g.lineWidth = 1 + rand() * 1.5;
    g.beginPath();
    g.moveTo(256 + (x - 256) * 0.12, 1024);
    g.quadraticCurveTo(x, 520, 256 + (x - 256) * 0.55, 30);
    g.stroke();
  }

  // Midrib.
  g.strokeStyle = "rgba(139,79,100,.65)";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(256, 1024);
  g.lineTo(256, 70);
  g.stroke();

  // The freckles that make it read as a stargazer lily.
  for (let i = 0; i < 300; i++) {
    const y = 250 + Math.pow(rand(), 0.7) * 650;
    const spread = 40 + ((y - 250) / 650) * 60 + rand() * 90;
    const x = 256 + (rand() - 0.5) * 2 * spread;
    const r = 1.6 + rand() * 5;
    g.fillStyle = `rgba(77,14,19,${0.45 + rand() * 0.5})`;
    g.beginPath();
    g.ellipse(x, y, r * 0.75, r * 1.5, rand() * 0.6 - 0.3, 0, Math.PI * 2);
    g.fill();
  }
  return finishTexture(c);
}

function leafTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 64, 0);
  grad.addColorStop(0, "#6f6e45");
  grad.addColorStop(0.5, "#9a9a6e");
  grad.addColorStop(1, "#6f6e45");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 256);
  g.fillStyle = "rgba(235,240,180,.5)";
  g.fillRect(30, 0, 4, 256);
  return finishTexture(c);
}

const CARDS = [
  { t: "Gargantua", s: "3D · 7K+ vendors", a: "#efd6d8", b: "#c995a1", ink: "#4d0e13" },
  { t: "React", s: "5+ years", a: "#c995a1", b: "#8b4f64", ink: "#f9edeb" },
  { t: "MentorHub", s: "built in 20 days", a: "#eee4da", b: "#d8c4ac", ink: "#4d0e13" },
  { t: "Three.js", s: "real-time 3D", a: "#8b4f64", b: "#4d0e13", ink: "#efd6d8" },
  { t: "AI Reports", s: "1K+ users", a: "#f9edeb", b: "#c8a49f", ink: "#4d0e13" },
  { t: "Memories", s: "full stack", a: "#efd6d8", b: "#d8c4ac", ink: "#4d0e13" },
];

function cardTexture({ t, s, a, b, ink }) {
  const c = document.createElement("canvas");
  c.width = 380;
  c.height = 480;
  const g = c.getContext("2d");
  g.fillStyle = "#f9edeb";
  g.fillRect(0, 0, 380, 480);
  const grad = g.createLinearGradient(0, 22, 340, 420);
  grad.addColorStop(0, a);
  grad.addColorStop(1, b);
  g.fillStyle = grad;
  g.fillRect(22, 22, 336, 372);

  // A soft orb for depth inside the print.
  const orb = g.createRadialGradient(250, 130, 8, 250, 130, 150);
  orb.addColorStop(0, "rgba(255,255,255,.34)");
  orb.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = orb;
  g.fillRect(22, 22, 336, 372);

  g.fillStyle = ink;
  g.textBaseline = "middle";
  g.textAlign = "center";
  let size = 74;
  do {
    size -= 2;
    g.font = `600 ${size}px "Bodoni Moda", serif`;
  } while (g.measureText(t).width > 300 && size > 20);
  g.fillText(t, 190, 208);

  g.fillStyle = "#4d0e13";
  g.font = '500 25px "DM Mono", monospace';
  g.fillText(s, 190, 438);
  return finishTexture(c);
}

/* ── Geometry ─────────────────────────────────────────────── */

function buildPetal({ L, W, seed, segU = 46, segV = 18, phi = [0.62, 2.95], bud = [0.16, -0.14] }) {
  const stride = segV + 1;
  const count = (segU + 1) * stride;
  const openPos = new Float32Array(count * 3);
  const budPos = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const index = [];

  const sculpt = (out, phi0, phi1, widthScale, cup) => {
    let r = 0;
    let h = 0;
    const du = 1 / segU;
    for (let iu = 0; iu <= segU; iu++) {
      const u = iu / segU;
      const p = phi0 + (phi1 - phi0) * Math.pow(u, 1.8);
      if (iu > 0) {
        r += Math.sin(p) * L * du;
        h += Math.cos(p) * L * du;
      }
      const inR = -Math.cos(p);
      const inH = Math.sin(p);
      const half = W * widthScale * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.78)), 0.85) + 0.012;
      for (let iv = 0; iv <= segV; iv++) {
        const v = -1 + (2 * iv) / segV;
        const ruffle = Math.sin(u * 21 + seed + v * 2.4) * 0.09 * v * v * half;
        const groove = -0.08 * Math.exp(-v * v * 26) * half;
        const d = cup * (v * v - 0.3) * half + groove + ruffle;
        const i = (iu * stride + iv) * 3;
        out[i] = r + inR * d;
        out[i + 1] = h + inH * d;
        out[i + 2] = v * half;
      }
    }
  };

  sculpt(openPos, phi[0], phi[1], 1, 0.34);
  sculpt(budPos, bud[0], bud[1], 0.72, 0.95);

  for (let iu = 0; iu <= segU; iu++) {
    for (let iv = 0; iv <= segV; iv++) {
      const k = (iu * stride + iv) * 2;
      uv[k] = iv / segV;
      uv[k + 1] = 1 - iu / segU;
      if (iu < segU && iv < segV) {
        const a = iu * stride + iv;
        const b = a + stride;
        index.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }

  const normalsFor = (pos) => {
    const tmp = new THREE.BufferGeometry();
    tmp.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    tmp.setIndex(index);
    tmp.computeVertexNormals();
    return tmp.getAttribute("normal").array;
  };

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(budPos, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(normalsFor(budPos), 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.morphAttributes.position = [new THREE.BufferAttribute(openPos, 3)];
  geo.morphAttributes.normal = [new THREE.BufferAttribute(normalsFor(openPos), 3)];
  return geo;
}

function roundedCardGeometry(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ShapeGeometry(s, 8);
  const uv = geo.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (uv.getX(i) - x) / w, (uv.getY(i) - y) / h);
  }
  return geo;
}

function makeHead(outerGeo, innerGeo, material) {
  const head = new THREE.Group();
  const petals = [];
  for (let i = 0; i < 6; i++) {
    const inner = i % 2 === 1;
    const mesh = new THREE.Mesh(inner ? innerGeo : outerGeo, material);
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / 6) * Math.PI * 2;
    pivot.position.y = inner ? 0.03 : 0;
    pivot.add(mesh);
    head.add(pivot);
    petals.push(mesh);
  }
  return { head, petals };
}

function tube(points, radius, material, segments = 40) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8), material);
}

/* ── Scene ────────────────────────────────────────────────── */

// x and y are fractions of the visible half-width and half-height,
// so each pose holds its place on any screen shape.

// Burns any material away along a noise pattern as `melt` rises from 0 to 1.
const makeMeltable = (material, melt) => {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uMelt = melt;
    shader.vertexShader = `varying vec3 vMeltPos;\n${shader.vertexShader}`.replace(
      "#include <project_vertex>",
      "vMeltPos = transformed;\n#include <project_vertex>"
    );
    shader.fragmentShader = `
      uniform float uMelt;
      varying vec3 vMeltPos;
      float mHash(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float mNoise(vec3 x) {
        vec3 i = floor(x), f = fract(x);
        f = f * f * (3. - 2. * f);
        return mix(
          mix(mix(mHash(i), mHash(i + vec3(1,0,0)), f.x), mix(mHash(i + vec3(0,1,0)), mHash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(mHash(i + vec3(0,0,1)), mHash(i + vec3(1,0,1)), f.x), mix(mHash(i + vec3(0,1,1)), mHash(i + vec3(1,1,1)), f.x), f.y),
          f.z);
      }
      float mFbm(vec3 p) { return mNoise(p) * .6 + mNoise(p * 2.1) * .3 + mNoise(p * 4.3) * .1; }
      ${shader.fragmentShader}`
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        float meltN = mFbm(vMeltPos * 2.6);
        float meltT = uMelt * 1.25 - .12;
        if (meltN < meltT) discard;
        float meltEdge = uMelt > .001 ? smoothstep(meltT + .07, meltT, meltN) : 0.;`
      )
      .replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(.98, .9, .87), meltEdge);"
      );
  };
  return material;
};

const isSmallScreen = () => window.innerWidth < 800;

export function createLilyScene(canvas, { reduced = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (err) {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0, 11);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.62;

  scene.add(new THREE.HemisphereLight(0xfff0f4, 0xd9c7b0, 1.25));
  const key = new THREE.DirectionalLight(0xfff4ea, 2.3);
  key.position.set(3, 5, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc995a1, 1.5);
  rim.position.set(-5, 1, -3);
  scene.add(rim);

  const disposables = [envRT, pmrem];
  const track = (o) => {
    disposables.push(o);
    return o;
  };

  const petalMap = track(petalTexture());
  const petalMat = track(
    new THREE.MeshPhysicalMaterial({
      map: petalMap,
      roughness: 0.58,
      side: THREE.DoubleSide,
      sheen: 1,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color("#efd6d8"),
      clearcoat: 0.18,
      clearcoatRoughness: 0.6,
    })
  );
  const fallMat = track(petalMat.clone());
  const melt = { value: 0 };
  makeMeltable(petalMat, melt);
  const greenMat = track(new THREE.MeshStandardMaterial({ map: track(leafTexture()), roughness: 0.55, side: THREE.DoubleSide }));
  const stemMat = track(new THREE.MeshStandardMaterial({ color: "#8b8a5a", roughness: 0.5 }));
  const filamentMat = track(new THREE.MeshStandardMaterial({ color: "#ddd1c6", roughness: 0.5 }));
  const antherMat = track(new THREE.MeshStandardMaterial({ color: "#4d0e13", roughness: 0.75 }));

  [greenMat, stemMat, filamentMat, antherMat].forEach((m) => makeMeltable(m, melt));

  const outerGeo = track(buildPetal({ L: 2.2, W: 0.56, seed: 1.2 }));
  const innerGeo = track(buildPetal({ L: 2.05, W: 0.72, seed: 3.7, phi: [0.74, 2.8] }));

  const rig = new THREE.Group();
  scene.add(rig);

  const { head, petals } = makeHead(outerGeo, innerGeo, petalMat);
  const HEAD_TILT = 1.02;
  head.rotation.x = HEAD_TILT;
  rig.add(head);

  // Stamens and pistil.
  const stamens = new THREE.Group();
  const antherGeo = track(new THREE.SphereGeometry(1, 14, 10));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.5;
    const r = 0.5;
    const tip = [Math.cos(a) * r, 1.32, Math.sin(a) * r];
    const t = tube([[0, 0, 0], [tip[0] * 0.3, 0.7, tip[2] * 0.3], tip], 0.016, filamentMat, 16);
    track(t.geometry);
    stamens.add(t);
    const anther = new THREE.Mesh(antherGeo, antherMat);
    anther.position.set(tip[0], tip[1] + 0.02, tip[2]);
    anther.scale.set(0.2, 0.05, 0.065);
    anther.rotation.y = -a + 0.7;
    stamens.add(anther);
  }
  const pistil = tube([[0, 0, 0], [0.05, 0.8, 0], [0.02, 1.5, 0.04]], 0.024, filamentMat, 16);
  track(pistil.geometry);
  stamens.add(pistil);
  const stigma = new THREE.Mesh(antherGeo, stemMat);
  stigma.position.set(0.02, 1.53, 0.04);
  stigma.scale.setScalar(0.08);
  stamens.add(stigma);
  head.add(stamens);

  // Stem, leaves and one bud still deciding whether to open.
  const stem = tube([[0, 0, 0], [0, -0.45, -0.55], [0.05, -1.6, -0.9], [-0.12, -3.5, -0.7], [-0.4, -8, -0.4]], 0.052, stemMat, 60);
  track(stem.geometry);
  rig.add(stem);

  const leafGeo = track(buildPetal({ L: 2.5, W: 0.2, seed: 2, segU: 24, segV: 6, phi: [0.8, 2.2] }));
  [[-1.5, -0.9, 0.5, 0.2], [-2.4, -0.85, 3.5, 0.3], [-3.3, -0.75, 1.4, -0.1]].forEach(([y, z, ry, rz]) => {
    const leaf = new THREE.Mesh(leafGeo, greenMat);
    leaf.position.set(0, y, z);
    leaf.rotation.set(0, ry, rz);
    leaf.morphTargetInfluences[0] = 1;
    rig.add(leaf);
  });

  const branch = tube([[0.04, -1.9, -0.88], [0.5, -1.45, -0.8], [1.02, -1.28, -0.7]], 0.028, stemMat, 20);
  track(branch.geometry);
  rig.add(branch);
  const { head: bud, petals: budPetals } = makeHead(outerGeo, innerGeo, petalMat);
  budPetals.forEach((m) => {
    m.morphTargetInfluences = [0.05];
  });
  bud.position.set(1.02, -1.28, -0.7);
  bud.rotation.set(0.5, 0, -0.7);
  bud.scale.setScalar(0.42);
  rig.add(bud);

  // Embers released while the flower burns away.
  const dustCount = isSmallScreen() ? 260 : 620;
  const dustPos = new Float32Array(dustCount * 3);
  const dustRand = seeded(903);
  for (let i = 0; i < dustCount; i++) {
    const a = dustRand() * Math.PI * 2;
    const b = Math.acos(2 * dustRand() - 1);
    const r = 0.5 + dustRand() * 2.2;
    dustPos[i * 3] = Math.sin(b) * Math.cos(a) * r;
    dustPos[i * 3 + 1] = Math.sin(b) * Math.sin(a) * r;
    dustPos[i * 3 + 2] = Math.cos(b) * r;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = track(new THREE.PointsMaterial({ color: "#c995a1", size: 0.045, transparent: true, depthWrite: false, opacity: 0 }));
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  rig.add(dust);

  // Project prints blooming out of the flower in an arc.
  const arcGroup = new THREE.Group();
  rig.add(arcGroup);
  const cardGeo = track(roundedCardGeometry(0.92, 1.16, 0.06));
  const cards = CARDS.map((c, i) => {
    const mat = track(
      new THREE.MeshPhysicalMaterial({
        map: track(cardTexture(c)),
        roughness: 0.62,
        clearcoat: 0.12,
        clearcoatRoughness: 0.5,
        side: THREE.DoubleSide,
      })
    );
    const mesh = new THREE.Mesh(cardGeo, mat);
    const f = i / (CARDS.length - 1);
    const angle = lerp(-0.42, 3.3, f);
    mesh.userData = { angle, phase: i * 1.3, delay: f * 0.45 };
    arcGroup.add(mesh);
    return mesh;
  });

  // Pearls.
  const isSmall = isSmallScreen;
  const pearlCount = isSmall() ? 9 : 18;
  const pearlGeo = track(new THREE.SphereGeometry(1, 32, 24));
  const pearlMat = track(
    new THREE.MeshPhysicalMaterial({
      color: "#f9edeb",
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 1,
      iridescenceIOR: 1.45,
      iridescenceThicknessRange: [180, 520],
      sheen: 0.6,
      sheenColor: new THREE.Color("#efd6d8"),
    })
  );
  const pearls = new THREE.InstancedMesh(pearlGeo, pearlMat, pearlCount);
  pearls.frustumCulled = false;
  rig.add(pearls);
  const rand = seeded(77);
  const pearlData = Array.from({ length: pearlCount }, () => {
    const a = rand() * Math.PI * 2;
    const r = 2.2 + rand() * 2.1;
    return {
      x: Math.cos(a) * r * 1.25,
      y: Math.sin(a) * r * 0.85,
      z: -1.5 + rand() * 3,
      s: 0.05 + rand() * rand() * 0.2,
      p: rand() * 10,
    };
  });

  // Loose petals drifting across the darker chapters.
  const fallGeoSrc = track(buildPetal({ L: 0.42, W: 0.13, seed: 5, segU: 10, segV: 4, phi: [1.1, 2.2] }));
  const fallGeo = track(new THREE.BufferGeometry());
  fallGeo.setAttribute("position", fallGeoSrc.morphAttributes.position[0]);
  fallGeo.setAttribute("normal", fallGeoSrc.morphAttributes.normal[0]);
  fallGeo.setAttribute("uv", fallGeoSrc.getAttribute("uv"));
  fallGeo.setIndex(fallGeoSrc.getIndex());
  const fallCount = isSmall() ? 18 : 42;
  const fall = new THREE.InstancedMesh(fallGeo, fallMat, fallCount);
  fall.frustumCulled = false;
  scene.add(fall);
  const fallData = Array.from({ length: fallCount }, () => ({
    x: (rand() - 0.5) * 2,
    y: rand(),
    z: -3 + rand() * 5,
    s: 0.6 + rand() * 1,
    speed: 0.03 + rand() * 0.05,
    p: rand() * 10,
    spin: 0.4 + rand(),
  }));

  // Petals thrown from wherever you click.
  const burstCount = isSmall() ? 36 : 72;
  const burstMesh = new THREE.InstancedMesh(fallGeo, fallMat, burstCount);
  burstMesh.frustumCulled = false;
  burstMesh.visible = false;
  scene.add(burstMesh);
  const burstData = Array.from({ length: burstCount }, () => ({
    life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s: 1, spin: 1, p: 0,
  }));
  let burstHead = 0;
  let burstLive = false;

  /* ── Scroll choreography ── */

  let keys = [];
  const current = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, open: 1, arc: 1, rain: 0, melt: 0 };
  const fields = Object.keys(current);
  const intro = { value: reduced ? 1 : 0 };
  let halfH = 1;
  let halfW = 1;
  let first = true;

  const measure = () => {
    const vh = window.innerHeight;
    const y = window.scrollY;
    const box = (id) => {
      const el = document.getElementById(id);
      if (!el) return { top: 0, bottom: 0 };
      const r = el.getBoundingClientRect();
      return { top: r.top + y, bottom: r.bottom + y };
    };
    const exp = box("experience");
    const work = box("work");
    const contact = box("contact");
    const narrow = window.innerWidth < 800;
    const k = narrow ? 0.62 : 1;

    const hero = { x: 0, y: narrow ? 0.14 : 0.06, z: 0, rx: 0, ry: 0, rz: 0, s: k * 0.86, open: 1, arc: 0, rain: 0, melt: 0 };
    const stage = { x: 0, y: 0.1, z: -3.4, rx: -0.12, ry: 0.5, rz: 0, s: 1.3 * k, open: 1, arc: 0, rain: 1, melt: 0 };
    const stageEnd = { ...stage, ry: 2.2, open: 0.74 };
    const farewell = { x: narrow ? 0.55 : -0.56, y: narrow ? -0.4 : 0.02, z: 0, rx: 0.05, ry: 0.35, rz: 0.1, s: 0.95 * k, open: 1, arc: 0, rain: 0.8, melt: 0 };

    keys = [
      [0, hero],
      [Math.max(vh * 0.2, exp.top - vh * 0.25), { ...hero, y: hero.y + 0.22, s: hero.s * 1.08, arc: 0, melt: 1 }],
      [work.top - vh * 0.5, { ...stage, melt: 1 }],
      [work.top, stage],
      [work.bottom - vh, stageEnd],
      [work.bottom - vh * 0.3, { ...stageEnd, rain: 0, melt: 1 }],
      [contact.top - vh * 0.6, { ...farewell, melt: 1 }],
      [contact.top, farewell],
    ];
    keys.sort((a, b) => a[0] - b[0]);
  };

  const sample = (scroll, out) => {
    let a = keys[0];
    let b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) {
      if (scroll >= keys[i][0] && scroll <= keys[i + 1][0]) {
        a = keys[i];
        b = keys[i + 1];
        break;
      }
    }
    if (scroll > b[0]) a = b;
    const span = b[0] - a[0];
    const t = span > 0 ? smooth(clamp((scroll - a[0]) / span)) : 0;
    fields.forEach((f) => {
      out[f] = lerp(a[1][f], b[1][f], t);
    });
  };

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 800 ? 1.5 : 1.8));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(15)) * camera.position.z;
    halfW = halfH * camera.aspect;
    measure();
  };

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("resize", resize);
  resize();

  const target = { ...current };
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const startedAt = performance.now();
  let lastFrame = startedAt;
  let prevScroll = window.scrollY;
  let gust = 0;
  let fallClock = 0;
  let raf = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const time = reduced ? 2 : (now - startedAt) / 1000;
    // Time-based easing, so the lily glides at the same speed on any refresh rate.
    const dt = Math.min(0.25, (now - lastFrame) / 1000);
    lastFrame = now;
    sample(window.scrollY, target);

    const ease = first || reduced ? 1 : 1 - Math.exp(-dt * 5.5);
    fields.forEach((f) => {
      current[f] += (target[f] - current[f]) * ease;
    });
    first = false;
    const follow = 1 - Math.exp(-dt * 3.2);
    mouse.x += (mouse.tx - mouse.x) * follow;
    mouse.y += (mouse.ty - mouse.y) * follow;

    // Fast scrolling blows the loose petals along with the page.
    const velocity = dt > 0 ? (window.scrollY - prevScroll) / dt : 0;
    prevScroll = window.scrollY;
    gust += (clamp(velocity / 1500, -3, 3) - gust) * (1 - Math.exp(-dt * 6));
    fallClock += dt * (1 - gust * 7);

    if (burstLive) {
      burstLive = false;
      burstData.forEach((d, i) => {
        if (d.life > 0) {
          burstLive = true;
          d.life -= dt * 0.62;
          d.vy -= dt * 3.4;
          const drag = 1 - Math.min(1, dt * 1.2);
          d.vx *= drag;
          d.vy *= drag;
          d.vz *= drag;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.z += d.vz * dt;
          const s = Math.max(1e-4, d.s * smooth(clamp(d.life * 3.5)));
          pos.set(d.x, d.y, d.z);
          euler.set(time * d.spin + d.p, time * d.spin * 0.7, d.p);
          q.setFromEuler(euler);
          scl.set(s, s, s);
          m4.compose(pos, q, scl);
        } else {
          m4.makeScale(1e-4, 1e-4, 1e-4);
        }
        burstMesh.setMatrixAt(i, m4);
      });
      burstMesh.instanceMatrix.needsUpdate = true;
    }
    burstMesh.visible = burstLive;

    const onStage = current.melt < 0.995;
    rig.visible = onStage;
    fall.visible = current.rain > 0.01;
    if (!onStage && !fall.visible && !burstLive) {
      renderer.clear();
      return;
    }

    melt.value = current.melt;
    const embers = Math.sin(Math.PI * clamp(current.melt));
    dust.visible = embers > 0.01;
    if (dust.visible) {
      dustMat.opacity = embers * 0.9;
      dust.scale.setScalar(0.6 + current.melt * 1.5);
      dust.rotation.y = time * 0.25;
      dust.position.y = current.melt * 0.8;
    }

    const bloom = intro.value;
    rig.position.set(current.x * halfW, current.y * halfH, current.z);
    rig.rotation.set(current.rx, current.ry + mouse.x * 0.14, current.rz + gust * 0.05);
    const grow = lerp(0.72, 1, bloom);
    rig.scale.setScalar(current.s * grow);

    const open = clamp(current.open * bloom);
    petals.forEach((p) => {
      p.morphTargetInfluences[0] = open;
    });
    stamens.scale.setScalar(lerp(0.45, 1, open));

    head.rotation.x = HEAD_TILT + mouse.y * 0.16 + Math.sin(time * 0.55) * 0.025;
    head.rotation.y = window.scrollY * 0.0009;
    head.rotation.z = -mouse.x * 0.1 + Math.sin(time * 0.4) * 0.03;

    const arcAmount = current.arc * bloom;
    arcGroup.visible = arcAmount > 0.01;
    arcGroup.rotation.z = Math.sin(time * 0.18) * 0.05;
    const R = 3.2;
    cards.forEach((card) => {
      const { angle, phase, delay } = card.userData;
      const e = smooth(clamp((arcAmount - delay) / (1 - delay + 0.0001)));
      const a = lerp(angle - 0.9, angle, e);
      const r = lerp(0.2, R, e);
      card.position.set(Math.cos(a) * r * 1.2, Math.sin(a) * r * 0.86, 0.35 + Math.sin(time * 0.6 + phase) * 0.1);
      card.rotation.set(Math.sin(time * 0.5 + phase) * 0.1, Math.cos(a) * -0.42, -Math.cos(a) * 0.3 + Math.sin(phase) * 0.08);
      card.scale.setScalar(Math.max(0.0001, e * 0.8));
    });

    pearlData.forEach((d, i) => {
      pos.set(d.x, d.y + Math.sin(time * 0.7 + d.p) * 0.14, d.z);
      m4.makeScale(d.s * bloom + 1e-4, d.s * bloom + 1e-4, d.s * bloom + 1e-4).setPosition(pos);
      pearls.setMatrixAt(i, m4);
    });
    pearls.instanceMatrix.needsUpdate = true;

    if (fall.visible) {
      fallData.forEach((d, i) => {
        const span = halfH * 2.6;
        const clock = reduced ? time : fallClock;
        const y = ((((d.y - clock * d.speed) % 1) + 1) % 1) * span - span / 2;
        pos.set(d.x * halfW * 1.4 + Math.sin(time * 0.6 + d.p) * 0.4, y, d.z);
        euler.set(time * d.spin * 0.5 + d.p, time * d.spin * 0.3, d.p);
        q.setFromEuler(euler);
        const s = d.s * current.rain + 1e-4;
        scl.set(s, s, s);
        m4.compose(pos, q, scl);
        fall.setMatrixAt(i, m4);
      });
      fall.instanceMatrix.needsUpdate = true;
    }

    camera.position.x = mouse.x * 0.3;
    camera.position.y = -mouse.y * 0.2;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  frame();

  return {
    intro,
    refresh: measure,
    burst(clientX, clientY) {
      const x = (clientX / window.innerWidth) * 2 * halfW - halfW;
      const y = halfH - (clientY / window.innerHeight) * 2 * halfH;
      for (let i = 0; i < 16; i++) {
        const d = burstData[burstHead];
        burstHead = (burstHead + 1) % burstCount;
        const a = Math.random() * Math.PI * 2;
        const speed = 1.6 + Math.random() * 4.2;
        Object.assign(d, {
          life: 1,
          x,
          y,
          z: 0.5,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed + 2,
          vz: (Math.random() - 0.5) * 3,
          s: 0.7 + Math.random() * 1.1,
          spin: 1.5 + Math.random() * 3,
          p: Math.random() * 10,
        });
      }
      burstLive = true;
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      pearls.dispose();
      burstMesh.dispose();
      fall.dispose();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
}
