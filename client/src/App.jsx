import { useEffect, useState } from "react";
import Landing from "./components/Landing.jsx";
import SelectedProjects from "./components/SelectedProjects.jsx";
import { FALLBACK_PROFILE, FALLBACK_PROJECTS, FALLBACK_WRITINGS } from "./data.js";

export default function App() {
  const [showProjects, setShowProjects] = useState(false);
  const [showWritings, setShowWritings] = useState(false);
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [writings, setWritings] = useState(FALLBACK_WRITINGS);

  // Pull content from the backend; if it isn't running (e.g. a
  // static-only deployment), the bundled fallback data is used.
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProfile)
      .catch(() => {});
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProjects)
      .catch(() => {});
    fetch("/api/writings")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setWritings)
      .catch(() => {});
  }, []);

  return (
    <>
      <Landing
        profile={profile}
        onOpenProjects={() => setShowProjects(true)}
        onOpenWritings={() => setShowWritings(true)}
      />
      {showProjects && (
        <div className="overlay">
          <SelectedProjects
            projects={projects}
            showDescription={false}
            onClose={() => setShowProjects(false)}
          />
        </div>
      )}
      {showWritings && (
        <div className="overlay">
          <SelectedProjects
            title="Human Written"
            subtitle="Essays and notes, written by me"
            ctaLabel="Read ↗"
            projects={writings}
            onClose={() => setShowWritings(false)}
          />
        </div>
      )}
    </>
  );
}
