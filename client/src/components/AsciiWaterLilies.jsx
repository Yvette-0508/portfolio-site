import { useEffect, useMemo, useRef, useState } from "react";

// ------------------------------------------------------------
// Monet's early "Water Lilies" as quiet ASCII: large filled pads
// drifting on calm blue water, each an ellipse with the classic
// notch cut toward its edge, and three blossoms resting on their
// pads. Layered <pre>s; the water moves gently unless the user
// prefers reduced motion.
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

// Pads (by PAD_LAYOUT index) that carry a blossom: upper-center,
// lower-left, center-right — like the painting
const FLOWER_PADS = [5, 11, 9];

// Filled ellipse pad with a thin notch cut toward the right edge.
// Returns the pad's half-height so callers can find its rim.
function drawPad(grid, cx, cy, w) {
  const h = Math.max(1, Math.round(w / 8)); // half-height; chars are ~2x tall
  const halfW = Math.round(w / 2);
  for (let dy = -h; dy <= h; dy++) {
    const t = dy / (h + 0.5);
    const rowHalf = Math.round(halfW * Math.sqrt(Math.max(0, 1 - t * t)));
    if (rowHalf < 1) continue;
    for (let dx = -rowHalf; dx <= rowHalf; dx++) {
      if (dy === 0 && dx > rowHalf * 0.5) continue; // the notch
      let ch = "=";
      if (Math.abs(dx) === rowHalf) ch = dx < 0 ? "(" : ")";
      else if (dy === -h || dy === h) ch = "-";
      put(grid, cy + dy, cx + dx, ch);
    }
  }
  return h;
}

const FLOWER_ART = [
  "  \\  |  /  ",
  " '.\\\\|//.' ",
  "--==(@)==--",
  " .'//|\\\\'. ",
];

// Blossom nested in the middle of its pad: a clean pocket is cleared
// in the pad texture row by row (first glyph to last), so the leaf
// keeps its shape around the flower. Petals go to the flowers layer,
// the (@) heart to its own gold layer.
function drawFlower(flowers, hearts, pads, cx, cy) {
  const artW = Math.max(...FLOWER_ART.map((l) => l.length));
  const x0 = cx - Math.floor(artW / 2);
  const y0 = cy - 2;
  FLOWER_ART.forEach((line, i) => {
    const first = line.search(/\S/);
    const last = line.length - 1 - [...line].reverse().join("").search(/\S/);
    for (let dx = first; dx <= last; dx++) {
      put(pads, y0 + i, x0 + dx, " ");
      const ch = line[dx];
      if (ch === " ") continue;
      if (ch === "@" || ch === "(" || ch === ")") put(hearts, y0 + i, x0 + dx, ch);
      else put(flowers, y0 + i, x0 + dx, ch);
    }
  });
}

function generateScene(cols, rows) {
  const pads = emptyGrid(cols, rows);
  const flowers = emptyGrid(cols, rows);
  const hearts = emptyGrid(cols, rows);
  const padDefs = []; // kept for the reflections layer {cx, cy, w, h}
  const scene = { cols, rows, pads, flowers, hearts, padDefs };
  if (cols < 16) return scene;

  PAD_LAYOUT.forEach((p, i) => {
    const w = Math.max(7, Math.round(cols * p.w * 0.8) + rand(3));
    const cx = Math.round(cols * p.x + rand(5) - 2) + Math.round(w / 2);
    const cy = Math.round(rows * p.y + rand(3) - 1);
    const h = drawPad(pads, cx, cy, w);
    padDefs.push({ cx, cy, w, h });
  });

  for (const i of FLOWER_PADS) {
    const p = padDefs[i];
    drawFlower(flowers, hearts, pads, p.cx, p.cy);
  }

  return scene;
}

// Dynamic layer: a soft reflection breathing under each pad
function renderReflections(scene, tick) {
  const grid = emptyGrid(scene.cols, scene.rows);
  for (const p of scene.padDefs) {
    if (!chance(0.75)) continue;
    const len = Math.max(3, Math.round(p.w * 0.6));
    const off = p.cx - Math.round(len / 2) + rand(3) - 1;
    for (let dx = 0; dx < len; dx++)
      if (chance(0.6)) put(grid, p.cy + p.h + 1, off + dx, chance(0.5) ? "~" : "-");
  }
  return grid;
}

// Dynamic layer: sparse, calm brush-strokes on the open water
function renderWater(scene, tick) {
  const { cols, rows } = scene;
  const grid = emptyGrid(cols, rows);
  const dabs = Math.round(cols * rows * 0.002);
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
          <pre className="ascii-art gg-layer lily-hearts">{toText(scene.hearts)}</pre>
        </>
      )}
    </div>
  );
}
