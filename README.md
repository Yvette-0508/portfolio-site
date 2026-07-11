# Portfolio Site — Full Stack

A minimal portfolio site with an animated ASCII Golden Gate Bridge hero and
expanding-column accordion sections ("Selected Projects" and "Human Written").
React (Vite) frontend + Express backend.

```
portfolio-site/
├── client/                 # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js      # dev server proxies /api → :3001
│   └── src/
│       ├── main.jsx
│       ├── App.jsx         # fetches content from API, falls back to data.js
│       ├── data.js         # bundled fallback content
│       ├── index.css       # all styles
│       └── components/
│           ├── Landing.jsx
│           ├── AsciiGoldenGate.jsx # animated night-scene hero
│           └── SelectedProjects.jsx # reused for both accordion sections
└── server/                 # Express backend
    ├── index.js            # API routes + serves client build in production
    └── package.json
```

## Run locally (development)

Two terminals:

```bash
# Terminal 1 — backend on :3001
cd server
npm install
npm run dev

# Terminal 2 — frontend on :5173
cd client
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api/*` to the backend.

## Run in production mode

```bash
cd client && npm install && npm run build   # outputs client/dist
cd ../server && npm install && npm start    # serves API + client/dist on :3001
```

Open http://localhost:3001 — one process serves everything.

## Editing content

- **With backend:** edit `profile`, `projects`, and `writings` in `server/index.js`.
- **Static-only:** edit `client/src/data.js` (used automatically whenever the
  API isn't reachable, so the site also works deployed as pure static files).

## API

| Method | Route               | Description                       |
| ------ | ------------------- | --------------------------------- |
| GET    | `/api/profile`      | Name, role, bio, links, status    |
| GET    | `/api/projects`     | All projects                      |
| GET    | `/api/projects/:id` | One project                       |
| GET    | `/api/writings`     | "Human Written" entries           |
| POST   | `/api/contact`      | `{ name, email, message }` — logs it; wire up an email service to actually send |

## Deploying

- **Static (simplest, like the original site):** deploy only `client/` to
  Vercel/Netlify (`npm run build`, publish `dist/`). The fallback data ships
  with the bundle, so no backend is needed.
- **Full stack:** deploy `server/` to Render/Railway/Fly (run the client build
  first so `client/dist` exists), or deploy the client to Vercel and the API
  separately, pointing a rewrite from `/api/*` to your API host.

## Notes

- Only project 01 ("Evalyn") has a real description; the rest are placeholders
  marked in the data files — replace them with your own projects.
- The accordion expands on hover (desktop) and tap (mobile); on narrow screens
  it becomes a vertical list. Escape closes the overlay.
