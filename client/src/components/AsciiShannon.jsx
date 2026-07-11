import { useEffect, useMemo, useRef, useState } from "react";
import { SHANNON_ART } from "./shannonArt.js";

// ------------------------------------------------------------
// Claude Shannon as an ASCII halftone portrait, centered, with
// faint binary rain falling in the margins — a nod to the father
// of information theory. The rain moves unless the user prefers
// reduced motion.
// ------------------------------------------------------------

const rand = (n) => Math.floor(Math.random() * n);
const chance = (p) => Math.random() < p;

const emptyGrid = (cols, rows) =>
  Array.from({ length: rows }, () => Array(cols).fill(" "));
const put = (grid, y, x, ch) => {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) grid[y][x] = ch;
};
const toText = (grid) => grid.map((row) => row.join("")).join("\n");

const ART_W = Math.max(...SHANNON_ART.map((l) => l.length));
const ART_H = SHANNON_ART.length;

function generateScene(cols, rows) {
  const portrait = emptyGrid(cols, rows);
  const rain = [];
  const scene = { cols, rows, portrait, rain };
  if (cols < 16) return scene;

  const left = Math.max(0, Math.round((cols - ART_W) / 2));
  const top = Math.max(0, Math.round((rows - ART_H) / 2));
  SHANNON_ART.forEach((line, y) => {
    for (let x = 0; x < line.length; x++)
      if (line[x] !== " ") put(portrait, top + y, left + x, line[x]);
  });

  // Binary rain columns, only in the margins beside the portrait
  for (let x = 1; x < cols; x += 3) {
    if (x >= left - 2 && x <= left + ART_W + 2) continue;
    if (chance(0.7)) rain.push({ x, speed: 1 + rand(2), phase: rand(rows * 2) });
  }
  return scene;
}

// Dynamic layer: 0s and 1s trickling down beside the portrait
function renderRain(scene, tick) {
  const grid = emptyGrid(scene.cols, scene.rows);
  const span = scene.rows + 8;
  for (const r of scene.rain) {
    const head = (tick * r.speed + r.phase) % span;
    for (let t = 0; t < 6; t++) {
      const y = head - t;
      if (y >= 0 && y < scene.rows && chance(0.85))
        put(grid, y, r.x, chance(0.5) ? "1" : "0");
    }
  }
  return grid;
}

export default function AsciiShannon({ rows = 54, charWidth = 6.6 }) {
  const containerRef = useRef(null);
  const [cols, setCols] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const measure = () =>
      setCols(Math.floor((containerRef.current?.offsetWidth || 0) / charWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [charWidth]);

  const scene = useMemo(() => (cols > 0 ? generateScene(cols, rows) : null), [cols, rows]);
  const rain = useMemo(() => (scene ? renderRain(scene, tick) : null), [scene, tick]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), 380);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={containerRef} className="ascii-wrap" aria-hidden="true">
      {scene && (
        <>
          <pre className="ascii-art gg-layer shannon-bits">{toText(rain)}</pre>
          <pre className="ascii-art gg-layer shannon-ink">{toText(scene.portrait)}</pre>
        </>
      )}
    </div>
  );
}
