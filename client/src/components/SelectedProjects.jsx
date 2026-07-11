import { useEffect, useState } from "react";

export default function SelectedProjects({
  projects,
  onClose,
  title = "Selected Projects",
  subtitle = "A collection of things I've built",
  ctaLabel = "View Project ↗",
  showDescription = true,
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sp-root" role="dialog" aria-label={title}>
      <header className="sp-header">
        <button className="sp-close" onClick={onClose}>
          CLOSE
        </button>
        <h1 className="sp-title">{title}</h1>
        <div className="sp-subtitle">{subtitle}</div>
      </header>

      <div className="sp-columns">
        {projects.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.id ?? p.title}
              className={`sp-col${isActive ? " active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-expanded={isActive}
            >
              <span className="sp-num">{String(i + 1).padStart(2, "0")}</span>

              {isActive ? (
                <div className="sp-details">
                  <h2 className="sp-details-title">{p.title}</h2>
                  {showDescription && <p className="sp-desc">{p.description}</p>}
                  <div className="sp-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="sp-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.link && (
                    <a
                      className="sp-view"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {ctaLabel}
                    </a>
                  )}
                  <div className="sp-col-year">{p.year}</div>
                </div>
              ) : (
                <>
                  <h2 className="sp-col-title">{p.title}</h2>
                  <div className="sp-col-year">{p.year}</div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
