# Frontend — React + Vite

The React half of the MERN Todo app. This folder is an **npm workspace** of the parent project,
so its dependencies are installed by the root `package.json`.

```bash
# from the repository ROOT
npm install          # installs this workspace and the backend one
npm run dev:frontend # vite → http://localhost:5173
npm run build        # → frontend/dist/  (what Netlify/Vercel publish)
```

## What lives here

| File | Purpose |
| ---- | ------- |
| `src/App.jsx` | The entire UI — `useState`, `useEffect`, Axios calls, the list, the View panel and the inline Edit form |
| `src/App.css` | Component styles: the list preview clamp and the expanded View/Edit panel |
| `src/index.css` | Global styles: font, colours, background |
| `src/main.jsx` | React entry point (unchanged from the Vite scaffold) |
| `index.html` | The page shell; `<title>My Todo App</title>` |
| `vite.config.js` | Vite config — uses `@vitejs/plugin-react` |
| `vercel.json` | Vercel build settings (Root Directory = `frontend`) |

## Two notes worth knowing

**The build plugin is Babel, not SWC.** Vite offers `@vitejs/plugin-react` (Babel, pure JavaScript)
and `@vitejs/plugin-react-swc` (a native Rust binary). This project uses the Babel one on purpose:
`@swc/core` needs a platform-specific native module, and `@swc/core@1.16.x` cannot load at all on
Windows because it rejects the standard AppContainer permissions on `C:\`. A pure-JavaScript plugin
builds identically on Windows, macOS, Linux and on Netlify/Vercel's CI.

**The API URL is an environment variable.**

```javascript
const API = import.meta.env.VITE_API_URL || "http://localhost:8001/todo";
```

Locally it falls back to port 8001. In production, set `VITE_API_URL` in the Netlify/Vercel
environment settings. Vite inlines `VITE_`-prefixed variables into the bundle at build time, so
they are **public** — never put a secret in one.

---

Full documentation: [`../RECREATE.md`](../RECREATE.md) · [`../README.md`](../README.md)
