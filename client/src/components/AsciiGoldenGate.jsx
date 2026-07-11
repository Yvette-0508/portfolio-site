import { useEffect, useMemo, useRef, useState } from "react";

// ------------------------------------------------------------
// Procedural ASCII Golden Gate Bridge at night, after the classic
// purple-dusk photo: orange towers and cables picked out by lamps,
// long light streaks shimmering in the bay below.
// Rendered as stacked <pre> layers so each element keeps its own
// color and glow. Lamps twinkle and the reflection re-rolls a few
// times a second (unless the user prefers reduced motion).
// ------------------------------------------------------------

const STARS = ["*", "+", "."];
const HILL_CHARS = ["^", "#", ":", "'"];
const STREAK_CHARS = ["|", ":", "!", "'"];

// Sailboat (one art per heading) and Jonathan the seagull's two
// wing-flap frames
const BOAT_RIGHT = ["  |\\", "  | \\", "  |__\\", "\\______/"];
const BOAT_LEFT = ["   /|", "  / |", " /__|", "\\______/"];
const GULL_FRAMES = [
  ["\\      /", " \\_,,_/"],
  [" _    _", "/ \\,,/ \\"],
];

const drawArt = (grid, art, topY, x) => {
  art.forEach((line, i) => {
    for (let dx = 0; dx < line.length; dx++)
      if (line[dx] !== " ") put(grid, topY + i, x + dx, line[dx]);
  });
};

const rand = (n) => Math.floor(Math.random() * n);
const chance = (p) => Math.random() < p;

const emptyGrid = (cols, rows) =>
  Array.from({ length: rows }, () => Array(cols).fill(" "));
const put = (grid, y, x, ch) => {
  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) grid[y][x] = ch;
};
const toText = (grid) => grid.map((row) => row.join("")).join("\n");

// Static parts of the scene: sky, headlands, and the bridge
// structure, plus the positions of every light source.
function generateScene(cols, bridgeRows, reflRows) {
  const total = bridgeRows + reflRows;
  const sky = emptyGrid(cols, total);
  const terrain = emptyGrid(cols, total);
  const bridge = emptyGrid(cols, total);
  const scene = {
    cols,
    bridgeRows,
    reflRows,
    sky,
    terrain,
    bridge,
    deckRow: 0,
    fogRow: 0,
    fog: [],
    sealZone: null,
    towers: [],
    lamps: [],
    cableDots: [],
    beacons: [],
    city: [],
  };
  if (cols < 16) return scene;

  const deckRow = bridgeRows - 8;
  const capRow = 1; // top of the tower caps
  const cableTop = 3; // row where the cables meet the towers
  const dipRow = deckRow - 1; // mid-span low point of the main cable
  const t1 = Math.round(cols * 0.28); // tower centers
  const t2 = Math.round(cols * 0.72);
  const mid = (t1 + t2) / 2;
  const halfSpan = (t2 - t1) / 2;
  scene.towers = [t1, t2];
  scene.deckRow = deckRow;

  // Cable height (float) at any column: backstays + main-span parabola
  const cableY = (x) => {
    if (x < t1) return cableTop + ((dipRow - cableTop) * (t1 - x)) / t1;
    if (x > t2) return cableTop + ((dipRow - cableTop) * (x - t2)) / (cols - 1 - t2);
    const u = (x - mid) / halfSpan;
    return dipRow + (cableTop - dipRow) * u * u;
  };

  // Sky: sparse stars up high; fog is a separate drifting layer,
  // stored as a repeating noise pattern that gets shifted per tick
  for (let y = 0; y < Math.floor(bridgeRows / 3); y++)
    for (let x = 0; x < cols; x++)
      if (chance(0.003)) sky[y][x] = STARS[rand(STARS.length)];
  scene.fogRow = 5 + rand(4);
  scene.fog = Array.from({ length: 3 }, () =>
    Array.from({ length: cols }, () => chance(0.05))
  );

  // Headlands sloping into the water at both ends
  const hillL = Math.max(5, Math.round(cols * 0.06));
  const hillR = Math.max(6, Math.round(cols * 0.09));
  for (let dx = 0; dx < Math.max(hillL, hillR); dx++) {
    const depthL = Math.round(((hillL - dx) / hillL) * (bridgeRows - 1 - deckRow));
    const depthR = Math.round(((hillR - dx) / hillR) * (bridgeRows - 1 - deckRow));
    if (dx < hillL)
      for (let y = deckRow + 1; y <= deckRow + depthL && y < bridgeRows; y++)
        if (chance(0.85)) terrain[y][dx] = HILL_CHARS[rand(HILL_CHARS.length)];
    if (dx < hillR)
      for (let y = deckRow + 1; y <= deckRow + depthR && y < bridgeRows; y++)
        if (chance(0.85)) terrain[y][cols - 1 - dx] = HILL_CHARS[rand(HILL_CHARS.length)];
  }

  // Deck: roadway with a truss underneath
  for (let x = 0; x < cols; x++) {
    bridge[deckRow][x] = "=";
    bridge[deckRow + 1][x] = x % 2 ? "\\" : "/";
  }

  // Suspender ropes hung from the cables down to the deck
  for (let x = 4; x < cols - 1; x += 4) {
    if (Math.abs(x - t1) <= 3 || Math.abs(x - t2) <= 3) continue;
    const top = Math.round(cableY(x));
    for (let y = top + 1; y < deckRow; y++)
      if (bridge[y][x] === " ") bridge[y][x] = "|";
  }

  // Main cables — glyph follows the local slope, steep gaps filled
  for (let x = 0; x < cols; x++) {
    const y0 = cableY(x);
    const y1 = cableY(Math.min(x + 1, cols - 1));
    const dy = y1 - y0;
    const ch = Math.abs(dy) < 0.3 ? "_" : dy > 0 ? "\\" : "/";
    const r0 = Math.round(y0);
    const r1 = Math.round(y1);
    put(bridge, r0, x, ch);
    for (let y = Math.min(r0, r1) + 1; y < Math.max(r0, r1); y++)
      if (bridge[y][x] === " ") bridge[y][x] = ch;
  }

  // Towers last, so they sit in front of cables and deck
  for (const tx of [t1, t2]) {
    for (let x = tx - 2; x <= tx + 2; x++) put(bridge, capRow, x, "=");
    for (let y = capRow + 1; y < bridgeRows; y++) {
      put(bridge, y, tx - 2, "[");
      put(bridge, y, tx - 1, "]");
      put(bridge, y, tx + 1, "[");
      put(bridge, y, tx + 2, "]");
      // portal struts between the legs
      if ((y - capRow) % 4 === 0 || y === deckRow) put(bridge, y, tx, "=");
    }
  }

  // Light sources: deck lamps, dots along the cables, tower
  // beacons, and a sprinkle of distant city lights on the horizon
  for (let x = 3; x < cols - 2; x += 6)
    if (Math.abs(x - t1) > 2 && Math.abs(x - t2) > 2)
      scene.lamps.push({ x, y: deckRow - 1 });
  for (let x = 2; x < cols - 1; x += 6) {
    if (Math.abs(x - t1) <= 2 || Math.abs(x - t2) <= 2) continue;
    scene.cableDots.push({ x, y: Math.round(cableY(x)) });
  }
  scene.beacons = [
    { x: t1, y: capRow - 1 },
    { x: t2, y: capRow - 1 },
  ];

  scene.hillR = hillR;

  for (let x = hillL + 2; x < cols - hillR - 2; x++)
    if (
      chance(0.05) &&
      Math.abs(x - t1) > 3 &&
      Math.abs(x - t2) > 3 &&
      !(scene.sealZone && x >= scene.sealZone.x0 - 2 && x <= scene.sealZone.x1 + 2)
    )
      scene.city.push({ x, y: bridgeRows - 2 });

  // Carve the light cells out of the structure so the glowing
  // layer doesn't double-print on top of it
  for (const { x, y } of [...scene.lamps, ...scene.cableDots, ...scene.beacons])
    put(bridge, y, x, " ");

  return scene;
}

// Traffic crossing the deck: headlights ">" eastbound, "<" westbound
const CARS = [
  { speed: 3, phase: 0, dir: 1 },
  { speed: 5, phase: 47, dir: 1 },
  { speed: 4, phase: 21, dir: -1 },
  { speed: 3, phase: 68, dir: -1 },
  { speed: 5, phase: 90, dir: -1 },
];

// Dynamic layer: every light re-rolls its glyph so the bridge twinkles
function renderLights(scene, tick) {
  const grid = emptyGrid(scene.cols, scene.bridgeRows + scene.reflRows);
  for (const { x, y } of scene.lamps) {
    const r = Math.random();
    put(grid, y, x, r < 0.08 ? "." : r < 0.3 ? "*" : "o");
  }
  for (const { x, y } of scene.cableDots) {
    const r = Math.random();
    put(grid, y, x, r < 0.08 ? "." : r < 0.35 ? "+" : "*");
  }
  for (const { x, y } of scene.beacons) put(grid, y, x, chance(0.5) ? "*" : "+");
  for (const { x, y } of scene.city) if (chance(0.8)) put(grid, y, x, ".");
  for (const car of CARS) {
    const span = scene.cols + 24; // off-screen run-up on both sides
    const p = ((tick * car.speed + car.phase) % span) - 12;
    const x = car.dir > 0 ? p : scene.cols - 1 - p;
    // cars pass behind the tower legs
    if (scene.towers.every((t) => Math.abs(x - t) > 2))
      put(grid, scene.deckRow - 1, x, car.dir > 0 ? ">" : "<");
  }
  return grid;
}

// Dynamic layer: the fog bank drifts sideways, wrapping around
function renderFog(scene, tick) {
  const grid = emptyGrid(scene.cols, scene.bridgeRows + scene.reflRows);
  for (let r = 0; r < scene.fog.length; r++)
    for (let x = 0; x < scene.cols; x++) {
      const src = (((x - tick - r * 5) % scene.cols) + scene.cols) % scene.cols;
      if (scene.fog[r][src]) grid[scene.fogRow + r][x] = "~";
    }
  return grid;
}

// Dynamic layers: long vertical light streaks on the water, like the
// lamp and tower reflections in the photo, re-rolled for shimmer,
// plus a small sailboat drifting across the bay
function generateReflection(scene, tick) {
  const { cols, bridgeRows, reflRows } = scene;
  const total = bridgeRows + reflRows;
  const warm = emptyGrid(cols, total);
  const cool = emptyGrid(cols, total);
  if (cols < 16) return { warm, cool };

  const streak = (x, len, keep) => {
    for (let i = 0; i < len; i++) {
      const y = bridgeRows + 1 + i;
      if (y >= total) break;
      const fade = keep * (1 - (0.45 * i) / len); // dims with depth
      if (chance(fade)) {
        const jx = Math.max(0, Math.min(cols - 1, x + rand(3) - 1)); // ripple jitter
        warm[y][jx] = STREAK_CHARS[rand(STREAK_CHARS.length)];
      }
    }
  };

  // Towers throw wide, deep reflections; each lamp a thin wavering one
  for (const tx of scene.towers)
    for (let dx = -2; dx <= 2; dx++)
      streak(tx + dx, Math.round(reflRows * (0.85 + Math.random() * 0.15)), 0.85);
  for (const l of scene.lamps) streak(l.x, 8 + rand(reflRows - 8), 0.7);

  // Faint broken mirror of the deck across the waterline
  const deckDepth = Math.round((bridgeRows - scene.deckRow) / 1.4);
  for (let x = 0; x < cols; x++) {
    if (chance(0.16)) warm[bridgeRows + deckDepth][x] = "-";
    if (chance(0.07)) warm[bridgeRows + deckDepth + 1][x] = "~";
  }

  // Ambient water: waterline shimmer + sparse strokes
  const inSealZone = (x) =>
    scene.sealZone && x >= scene.sealZone.x0 && x <= scene.sealZone.x1;
  for (let x = 0; x < cols; x++)
    if (chance(0.18) && !inSealZone(x)) cool[bridgeRows][x] = "~";
  for (let y = bridgeRows + 1; y < total; y++)
    for (let x = 0; x < cols; x++)
      if (chance(0.02)) cool[y][x] = chance(0.5) ? "~" : "-";

  // The sailboat tacks back and forth across the right half of the
  // bay, one cell every few ticks, turning around at each end
  const wl = bridgeRows; // hull sits on the waterline
  const boatW = 8;
  const bx0 = Math.max(
    Math.round(cols * 0.58),
    scene.sealZone ? scene.sealZone.x1 + 3 : 0
  );
  const bx1 = cols - (scene.hillR || 0) - boatW - 2;
  const range = bx1 - bx0;
  if (range >= 8) {
    const step = Math.floor(tick / 3) % (2 * range);
    const heading = step < range ? 1 : -1;
    const bx = bx0 + (heading > 0 ? step : 2 * range - step);
    // sails behind the tower legs rather than printing through them
    const occluded = (x) => scene.towers.some((t) => Math.abs(x - t) <= 2);
    const boatArt = heading > 0 ? BOAT_RIGHT : BOAT_LEFT;
    boatArt.forEach((line, i) => {
      for (let dx = 0; dx < line.length; dx++)
        if (line[dx] !== " " && !occluded(bx + dx))
          put(warm, wl - 3 + i, bx + dx, line[dx]);
    });
    const wx = heading > 0 ? bx - 2 : bx + boatW + 1;
    if (!occluded(wx)) put(cool, wl, wx, "~"); // wake
  }

  // Jonathan the seagull works the left side of the bay, flapping
  // and drifting a few columns back and forth
  if (cols >= 64) {
    const gt = Math.floor(tick / 2) % 16;
    const gx = Math.round(cols * 0.15) + (gt < 8 ? gt : 16 - gt) - 4;
    drawArt(warm, GULL_FRAMES[tick % 2], wl - 4, gx);
  }

  // Seal heads bobbing in the shallows on the left: up for a few
  // seconds, sinking to eye level, then dipping under with a ripple
  if (cols >= 64) {
    const heads = [Math.round(cols * 0.09), Math.round(cols * 0.23)];
    heads.forEach((hx, i) => {
      const ph = (tick + i * 7) % 14;
      if (ph < 8) drawArt(warm, [" .-.", "(o.o)"], wl - 1, hx);
      else if (ph < 11) drawArt(warm, [".-."], wl, hx + 1);
      else put(cool, wl, hx + 2, "~");
    });
  }

  return { warm, cool };
}

export default function AsciiGoldenGate({ bridgeRows = 34, reflRows = 20, charWidth = 6.6 }) {
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

  // Structure is generated once per width; lights + reflection
  // re-roll on each tick for the twinkle/shimmer effect
  const scene = useMemo(
    () => (cols > 0 ? generateScene(cols, bridgeRows, reflRows) : null),
    [cols, bridgeRows, reflRows]
  );
  const lights = useMemo(() => (scene ? renderLights(scene, tick) : null), [scene, tick]);
  const fog = useMemo(() => (scene ? renderFog(scene, tick) : null), [scene, tick]);
  const refl = useMemo(() => (scene ? generateReflection(scene, tick) : null), [scene, tick]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), 380);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={containerRef} className="ascii-wrap gg-scene" aria-hidden="true">
      {scene && (
        <>
          <pre className="ascii-art gg-layer gg-sky">{toText(scene.sky)}</pre>
          <pre className="ascii-art gg-layer gg-terrain">{toText(scene.terrain)}</pre>
          <pre className="ascii-art gg-layer gg-refl-cool">{toText(refl.cool)}</pre>
          <pre className="ascii-art gg-layer gg-refl-warm">{toText(refl.warm)}</pre>
          <pre className="ascii-art gg-layer gg-bridge">{toText(scene.bridge)}</pre>
          <pre className="ascii-art gg-layer gg-fog">{toText(fog)}</pre>
          <pre className="ascii-art gg-layer gg-lights">{toText(lights)}</pre>
        </>
      )}
    </div>
  );
}
