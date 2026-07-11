import { useState } from "react";
import AsciiGoldenGate from "./AsciiGoldenGate.jsx";
import AsciiWaterLilies from "./AsciiWaterLilies.jsx";
import AsciiShannon from "./AsciiShannon.jsx";

// Hero scene carousel — to add a scene, drop a component in SLIDES
const SLIDES = [
  { key: "bridge", label: "Golden Gate", Scene: AsciiGoldenGate },
  { key: "lilies", label: "Water Lilies", Scene: AsciiWaterLilies, caption: "For Claude Monet" },
  { key: "shannon", label: "Claude Shannon", Scene: AsciiShannon, caption: "For Claude Shannon" },
];

export default function AsciiCarousel() {
  const [idx, setIdx] = useState(0);
  const { Scene, caption } = SLIDES[idx];

  return (
    <>
      <Scene />
      {caption && <div className="ld-scene-caption">{caption}</div>}
      <nav className="ld-scene-nav" aria-label="Hero scenes">
        <button
          className="ld-scene-arrow"
          onClick={() => setIdx((idx + SLIDES.length - 1) % SLIDES.length)}
          aria-label="Previous scene"
        >
          &lt;
        </button>
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            className={`ld-scene-dot${i === idx ? " active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={s.label}
            title={s.label}
          >
            {i === idx ? "●" : "○"}
          </button>
        ))}
        <button
          className="ld-scene-arrow"
          onClick={() => setIdx((idx + 1) % SLIDES.length)}
          aria-label="Next scene"
        >
          &gt;
        </button>
      </nav>
    </>
  );
}
