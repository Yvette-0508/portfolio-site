import { useEffect, useState } from "react";
import AsciiCarousel from "./AsciiCarousel.jsx";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  const offsetMin = -now.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "\u2212";
  const offsetH = Math.abs(offsetMin) / 60;
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} UTC${sign}${offsetH}`;
}

export default function Landing({ profile, onOpenProjects, onOpenWritings }) {
  const clock = useClock();

  return (
    <div className="ld-root">
      <nav className="ld-nav">
        <button className="ld-nav-btn" onClick={onOpenProjects}>
          PORTFOLIO
        </button>
        <button className="ld-nav-btn" onClick={onOpenWritings}>
          HUMAN WRITTEN
        </button>
      </nav>

      {/* Hero: ASCII scene carousel with name overlaid */}
      <section className="ld-hero">
        <AsciiCarousel />
        <div className="ld-hero-id">
          <h1 className="ld-name">{profile.name}</h1>
          <div className="ld-role">{profile.role}</div>
        </div>
      </section>

      {/* Footer info band */}
      <footer className="ld-footer">
        <div className="ld-ft-grid">
          <div className="ld-ft-left">
            <div className="ld-clock">{clock}</div>
            <p className="ld-bio">{profile.bio}</p>
          </div>
          <nav className="ld-links" aria-label="Contact links">
            {profile.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="ld-link"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span className="ld-copy">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="ld-status">{profile.status}</div>
      </footer>
    </div>
  );
}
