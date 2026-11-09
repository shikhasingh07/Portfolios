import { useEffect } from "react";

// Real refraction needs SVG filters inside backdrop-filter, which only
// Chromium supports. Everywhere else the element simply stays frosted glass.
export const supportsLiquid = () =>
  /Chrome\//.test(navigator.userAgent) && window.matchMedia("(pointer: fine)").matches;

// Paints a displacement map for a rounded rectangle: neutral grey in the
// middle, bending light inwards towards the edges like a thick glass bezel.
const buildMap = (w, h, radius, bezel) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  const img = g.createImageData(w, h);
  const hw = w / 2;
  const hh = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - radius);
      const qy = Math.abs(py) - (hh - radius);
      const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const dist = radius - (outside + Math.min(Math.max(qx, qy), 0));

      let nx = 0;
      let ny = 0;
      if (qx > 0 && qy > 0) {
        nx = qx / (outside || 1);
        ny = qy / (outside || 1);
      } else if (qx > qy) {
        nx = 1;
      } else {
        ny = 1;
      }
      nx *= Math.sign(px) || 1;
      ny *= Math.sign(py) || 1;

      const t = Math.min(1, Math.max(0, dist / bezel));
      const strength = dist < 0 ? 0 : (1 - t) * (1 - t);
      const i = (y * w + x) * 4;
      img.data[i] = 128 - 127 * nx * strength;
      img.data[i + 1] = 128 - 127 * ny * strength;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return canvas.toDataURL();
};

const SVG_NS = "http://www.w3.org/2000/svg";

const getHost = () => {
  let host = document.getElementById("liquid-filters");
  if (!host) {
    host = document.createElementNS(SVG_NS, "svg");
    host.id = "liquid-filters";
    host.setAttribute("width", "0");
    host.setAttribute("height", "0");
    host.setAttribute("aria-hidden", "true");
    host.style.position = "absolute";
    document.body.appendChild(host);
  }
  return host;
};

const writeFilter = (id, w, h, map, scale) => {
  const host = getHost();
  let filter = host.querySelector(`#${id}`);
  if (!filter) {
    filter = document.createElementNS(SVG_NS, "filter");
    filter.id = id;
    host.appendChild(filter);
  }
  const attrs = {
    filterUnits: "userSpaceOnUse",
    primitiveUnits: "userSpaceOnUse",
    x: 0,
    y: 0,
    width: w,
    height: h,
    "color-interpolation-filters": "sRGB",
  };
  Object.entries(attrs).forEach(([k, v]) => filter.setAttribute(k, v));
  filter.innerHTML = `<feImage href="${map}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>`;
};

export const useLiquid = (ref, { id, radius, bezel, scale, finish = "saturate(1.45)" }) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || !supportsLiquid()) return undefined;
    let last = "";

    const apply = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const size = `${w}x${h}`;
      if (!w || !h || size === last) return;
      last = size;
      writeFilter(id, w, h, buildMap(w, h, Math.min(radius, Math.min(w, h) / 2), bezel), scale);
      const value = `url(#${id}) ${finish}`;
      el.style.backdropFilter = value;
      el.style.webkitBackdropFilter = value;
      el.classList.add("is-liquid");
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.classList.remove("is-liquid");
      el.style.backdropFilter = "";
      el.style.webkitBackdropFilter = "";
      const filter = document.getElementById(id);
      if (filter) filter.remove();
    };
  }, [ref, id, radius, bezel, scale, finish]);
};
