import { useEffect, useMemo, useRef, useState } from "react";

// ------------------------------------------------------------
// Monet's early "Water Lilies" as quiet ASCII: a handful of large
// pads drifting on calm blue water, two white blossoms, and soft
// reflections breathing under the pads. Layered <pre>s; the water
// moves gently unless the user prefers reduced motion.
// ------------------------------------------------------------

const rand = (n) => Math.floor(Math.random() * n);
const chance = (p) => Math.random() < p;

const emptyGrid = (cols, rows) =>
  Array.from({ length: rows }, () => Array(cols).fill(" "));
const put = (grid, y, x, ch) => {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) grid[y][x] = ch;
};
const toText = (grid) => grid.map((row) => row.join("")).join("\n");

// Pad layout echoing the painting's composition (fractions of the
// canvas), jittered slightly on each mount
const PAD_LAYOUT = [
  { x: 0.08, y: 0.1, w: 0.1 },
  { x: 0.3, y: 0.06, w: 0.12 },
  { x: 0.56, y: 0.09, w: 0.11 },
  { x: 0.78, y: 0.16, w: 0.09 },
  { x: 0.14, y: 0.28, w: 0.12 },
  { x: 0.4, y: 0.25, w: 0.1 },
  { x: 0.68, y: 0.31, w: 0.12 },
  { x: 0.05, y: 0.46, w: 0.09 },
  { x: 0.27, y: 0.5, w: 0.13 },
  { x: 0.56, y: 0.47, w: 0.11 },
  { x: 0.82, y: 0.54, w: 0.1 },
  { x: 0.12, y: 0.67, w: 0.12 },
  { x: 0.42, y: 0.7, w: 0.13 },
  { x: 0.7, y: 0.76, w: 0.11 },
  { x: 0.24, y: 0.88, w: 0.12 },
  { x: 0.56, y: 0.91, w: 0.1 },
];

// Two blossoms, like the painting: one upper-center, one bottom-left
const FLOWER_ART = [" \\|/", "-=@=-"];
const FLOWERS = [
  { x: 0.44, y: 0.15 },
  { x: 0.09, y: 0.9 },
];

function generateScene(cols, rows) {
  const pads = emptyGrid(cols, rows);
  const flowers = emptyGrid(cols, rows);
  const padDefs = []; // kept for the reflections layer {x, y, w}
  const scene = { cols, rows, pads, flowers, padDefs };
  if (cols < 16) return scene;

  for (const p of PAD_LAYOUT) {
    const w = Math.max(5, Math.round(cols * p.w * 0.55) + rand(3));
    const x = Math.round(cols * p.x + rand(5) - 2);
    const y = Math.round(rows * p.y + rand(3) - 1);
    if (w >= 9) {
      // big pad: two-row ellipse
      put(pads, y, x + 1, ",");
      for (let dx = 2; dx < w - 1; dx++) put(pads, y, x + dx, "-");
      put(pads, y, x + w - 1, ".");
      put(pads, y + 1, x, "(");
      for (let dx = 1; dx < w; dx++) put(pads, y + 1, x + dx, "_");
      put(pads, y + 1, x + w, ")");
      padDefs.push({ x, y: y + 1, w });
    } else {
      put(pads, y, x, "(");
      for (let dx = 1; dx < w; dx++) put(pads, y, x + dx, "_");
      put(pads, y, x + w, ")");
      padDefs.push({ x, y, w });
    }
  }

  for (const f of FLOWERS) {
    const fx = Math.round(cols * f.x);
    const fy = Math.round(rows * f.y);
    FLOWER_ART.forEach((line, i) => {
      for (let dx = 0; dx < line.length; dx++)
        if (line[dx] !== " ") put(flowers, fy + i, fx + dx, line[dx]);
    });
  }

  return scene;
}

// Dynamic layer: a soft reflection breathing under each pad
function renderReflections(scene, tick) {
  const grid = emptyGrid(scene.cols, scene.rows);
  for (const p of scene.padDefs) {
    if (!chance(0.75)) continue;
    const len = Math.max(3, Math.round(p.w * 0.6));
    const off = p.x + 1 + rand(Math.max(1, p.w - len));
    for (let dx = 0; dx < len; dx++)
      if (chance(0.6)) put(grid, p.y + 1, off + dx, chance(0.5) ? "~" : "-");
  }
  return grid;
}

// Dynamic layer: sparse, calm brush-strokes on the open water
function renderWater(scene, tick) {
  const { cols, rows } = scene;
  const grid = emptyGrid(cols, rows);
  const dabs = Math.round(cols * rows * 0.003);
  for (let i = 0; i < dabs; i++) {
    const y = rand(rows);
    const x = rand(cols);
    const len = 2 + rand(4);
    const ch = chance(0.7) ? "~" : "-";
    for (let dx = 0; dx < len; dx++) put(grid, y, x + dx, ch);
  }
  return grid;
}

export default function AsciiWaterLilies({ rows = 54, charWidth = 6.6 }) {
  const containerRef = useRef(null);
  const [cols, setCols] = useState(0);
  const [tick, setTick] = useState(0);

  // Measure available width → number of character columns
  useEffect(() => {
    const measure = () =>
      setCols(Math.floor((containerRef.current?.offsetWidth || 0) / charWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [charWidth]);

  const scene = useMemo(() => (cols > 0 ? generateScene(cols, rows) : null), [cols, rows]);
  const refl = useMemo(() => (scene ? renderReflections(scene, tick) : null), [scene, tick]);
  const water = useMemo(() => (scene ? renderWater(scene, tick) : null), [scene, tick]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={containerRef} className="ascii-wrap" aria-hidden="true">
      {scene && (
        <>
          <pre className="ascii-art gg-layer lily-water">{toText(water)}</pre>
          <pre className="ascii-art gg-layer lily-strands">{toText(refl)}</pre>
          <pre className="ascii-art gg-layer lily-pads">{toText(scene.pads)}</pre>
          <pre className="ascii-art gg-layer lily-flowers">{toText(scene.flowers)}</pre>
        </>
      )}
    </div>
  );
}
