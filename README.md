# My Todo App — MERN Stack

A complete **CRUD** todo application: React 19 + Vite 7 frontend, Express 4 + Mongoose 8 backend,
MongoDB 8 database. Built as the **Module 7 capstone** for *BCA – V Semester, Option A: MERN Stack
Development* (7 modules / 30 hours).

```
React (5173)  ──axios / JSON──▶  Express (8001)  ──Mongoose──▶  MongoDB (27017)
```

---

## Quick start

**Prerequisites:** Node v22+, npm 10+, MongoDB 8 running on `127.0.0.1:27017`.

This is an **npm workspaces** project — one `package.json` at the root installs the dependencies of
both `backend/` and `frontend/` into a single shared `node_modules/`.

```bash
# once, at the repository root — installs BOTH packages
npm install

# terminal 1
npm run dev:backend        # → http://localhost:8001

# terminal 2
npm run dev:frontend       # → http://localhost:5173
```

Open **http://localhost:5173**.

| Command | What it does |
| ------- | ------------ |
| `npm install` | Installs both workspaces (one `node_modules`, one lockfile) |
| `npm run dev:backend` | `node --watch src/server.js` → http://localhost:8001 |
| `npm run dev:frontend` | `vite` → http://localhost:5173 |
| `npm run build` | Builds the frontend → `frontend/dist/` |
| `npm start` | Runs the backend in production mode (no file watcher) — what Render runs |
| `npm run lint` | ESLint over the frontend |

**What the UI does**

| Action | Behaviour |
| ------ | --------- |
| **Add** | Enter a Note and an optional Content, then `Add Todo`. The list shows the note plus a 2-line preview of the content. |
| **View** | Expands a panel showing the full Note and the full Content, with a `No content added for this todo.` message when content is empty. The button becomes `Hide`. |
| **Edit** | Expands an inline form with **both** fields pre-filled from that todo. Edit the Note and/or the Content, then `Save Changes` or `Cancel`. |
| **Delete** | Removes the todo and refreshes the list. |

The root `.env` holds the connection string:

```
MONGO_URI=mongodb://127.0.0.1:27017/todo
```

> It lives at the **project root**, one level above `backend/`. `config.js` loads it with
> `dotenv.config({ path: "../.env" })`.
>
> Use **`127.0.0.1`, not `localhost`** on Windows: `localhost` resolves to `::1` (IPv6) first,
> while the stock MongoDB install binds IPv4 only, so the connection hangs with
> `buffering timed out after 10000ms`.

### Using MongoDB Atlas (cloud)

Replace the same key with the SRV string Atlas gives you — nothing else changes:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todo
```

> **Percent-encode the password** if it contains `@ : / # ?` or `%` (`@` → `%40`, `:` → `%3A`,
> `/` → `%2F`, `#` → `%23`, `%` → `%25`), or the driver cuts the string short.

If the driver reports **`querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net`** while the
browser and `nslookup` resolve the same name fine, your machine's DNS is the problem, not Atlas:
Node's resolver is pointed at `127.0.0.1`, where a stub resolver (Windows Internet Connection
Sharing / mobile hotspot) closes the connection. Add one line to `.env`:

```
DNS_SERVERS=8.8.8.8,202.88.156.6
```

`config.js` calls `dns.setServers()` with it. Leave it unset on a normal machine and on
Render / Netlify — the code does nothing when the variable is absent.

---

## API reference

Base URL: `http://localhost:8001/todo`

| Method | Path        | Body                         | Success | Response                          |
| ------ | ----------- | ---------------------------- | ------- | --------------------------------- |
| GET    | `/health`   | —                            | 200     | `{"status":"ok","database":"connected"}` (503 if the DB is down) |
| GET    | `/todo`     | —                            | 200     | array of todos                    |
| GET    | `/todo/:id` | —                            | 200     | one todo                          |
| POST   | `/todo`     | `{"note":"...","content":"..."}` | 201  | the created document              |
| PUT    | `/todo/:id` | `{"note":"...","content":"..."}` | 200  | the updated document              |
| DELETE | `/todo/:id` | —                            | 200     | `{"message":"Deleted selected todo"}` |

Unknown id → `404 {"message":"Todo not found"}`.

> **The server waits for the database before it starts listening.** `await connectDB()` runs before
> `app.listen(8001)`, so a request can never arrive while Mongoose is still connecting — which is
> what produced `Operation 'todo.find()' buffering timed out after 10000ms`. Against a local
> MongoDB that window is milliseconds; against MongoDB Atlas it is several seconds. The connection
> also retries with a backoff before giving up.

**Data model**

| Field     | Type     | Rules       |
| --------- | -------- | ----------- |
| `_id`     | ObjectId | auto        |
| `note`    | String   | **required** |
| `content` | String   | optional    |
| `__v`     | Number   | auto        |

Database `todo`, collection `todo`.

---

## Project structure

```
my-todo-app/
├── .env                        # MONGO_URI (root level)
├── .env.example                # the same key, no secrets — committed
├── .gitignore
├── package.json                # ROOT package — npm workspaces + scripts
├── package-lock.json           # ONE lockfile for both workspaces
├── netlify.toml                # Netlify build config (frontend)
├── render.yaml                 # Render blueprint (backend)
├── README.md                   # this file
├── RECREATE.md                 # step-by-step build guide (teaching document)
├── docs/
│   ├── INTERVIEW-PREP.md       # 153 Q&A — MERN + GenAI trainer interview
│   └── SYLLABUS-MAPPING.md     # module-by-module handout
├── node_modules/               # installed once, shared by both workspaces
├── backend/
│   └── src/
│       ├── config.js           # MongoDB connection (env var)
│       ├── controller.js       # request handlers
│       ├── routes.js           # URL → handler map
│       ├── server.js           # express app, middleware, port 8001
│       └── Todo.js             # Mongoose schema + model
└── frontend/
    ├── vercel.json             # Vercel build config
    ├── vite.config.js
    └── src/
        ├── App.jsx             # whole UI (useState, useEffect, axios)
        ├── App.css
        ├── index.css
        └── main.jsx
```

---

## Deployment

```
GitHub ──► Netlify (frontend/dist)  ──VITE_API_URL──►  Render (Express)  ──MONGO_URI──►  MongoDB Atlas
```

| Piece | Config file | Where it goes | What you must set |
| ----- | ----------- | ------------- | ----------------- |
| Frontend | `netlify.toml` (root) | Netlify — build `npm run build`, publish `dist` (relative to `base = "frontend"`) | `VITE_API_URL` = the backend **origin**, in Netlify's env vars with the **Builds** scope → then redeploy |
| Frontend (alt) | `frontend/vercel.json` | Vercel — Root Directory = `frontend` | `VITE_API_URL` = the backend origin |
| Backend | `render.yaml` (root) | Render — Root Directory `backend`, start `npm start` | `MONGO_URI` = your Atlas SRV string, in Render's dashboard (**not** in the repo) |
| Database | — | MongoDB Atlas (free M0) | user + password, network access `0.0.0.0/0` |

**Two variables, two different hosts — do not mix them up:**

| Variable | Host | Read by | Value |
| -------- | ---- | ------- | ----- |
| `MONGO_URI` | **Render** | `backend/src/config.js` | `mongodb+srv://...` |
| `VITE_API_URL` | **Netlify / Vercel** | `frontend/src/App.jsx` | `https://<backend>.onrender.com` — origin only, **no `/todo`** |

The frontend host never needs the database URI. Putting it there is useless at best, and it puts a
database password one careless `VITE_`-prefix mistake away from being published to the internet.

```bash
npm run build     # → frontend/dist/  (this is what Netlify publishes)
```

> `publish = "dist"` resolves **relative to `base = "frontend"`**, so Netlify publishes
> `frontend/dist`. Writing `publish = "frontend/dist"` there would fail with
> *publish directory not found*.

> **`VITE_API_URL` is baked in at BUILD time.** If the deployed site still calls
> `http://localhost:8001/todo`, the variable never reached the build. Set it with the **Builds**
> scope and trigger a **new deploy** — a restart is not enough. Verify with:
> `grep -o "localhost:8001\|onrender\.com" frontend/dist/assets/*.js | sort -u`
> — you should see only `onrender.com`.
>
> **The bundle filename is the proof.** Vite hashes the output, so the file name tells you whether
> the variable arrived: a build with no `VITE_API_URL` produces `assets/index-DypnbcgB.js`, and a
> build with it produces a different name. The Netlify build log prints that name — if it matches
> the "no variable" one, the variable never reached the build.
>
> **Netlify needs exactly one variable: `VITE_API_URL`.** `MONGO_URI` belongs on **Render** — the
> backend host. A database password in a frontend build environment is useless at best, and one
> careless `VITE_` prefix away from being published to the internet.
>
> **The app now fails loudly instead of quietly.** In a production build with no `VITE_API_URL`,
> the page shows a red banner naming the missing variable, and any API failure is shown in the
> page instead of an empty list. If you see "No todos yet", the request actually succeeded.

Full walkthrough with the Atlas steps and the deployment troubleshooting table:
[`RECREATE.md` → Part 11](RECREATE.md).

---

## Tech stack

| Layer     | Package                                   | Version |
| --------- | ----------------------------------------- | ------- |
| Frontend  | react / react-dom                         | ^19.2.0 |
| Frontend  | vite + @vitejs/plugin-react               | ^7.3.1, ^5.2.0 |
| Frontend  | axios, bootstrap                          | ^1.7.9, ^5.3.3 |
| Backend   | express                                   | ^4.18.2 |
| Backend   | mongoose                                  | ^8.14.3 |
| Backend   | cors, dotenv                              | ^2.8.5, ^16.5.0 |
| Database  | MongoDB Community                         | 8.x     |

> The dev server is Node's built-in `node --watch` (set in `backend/package.json`) — no `nodemon`
> dependency, so `npm install` reports **0 vulnerabilities** and the same script works on Windows,
> macOS, Linux and Render.

---

## Documents

| Document | What it is for |
| -------- | -------------- |
| [`RECREATE.md`](RECREATE.md) | **Start here to teach.** Full build-from-zero guide: architecture, every file's exact code, the 11 defects in the original draft (with the symptom each one caused), a 30-hour session plan, module mapping, troubleshooting table, deployment walkthrough and viva questions. |
| [`docs/INTERVIEW-PREP.md`](docs/INTERVIEW-PREP.md) | 153 interview questions with model answers — MERN fundamentals, React, MongoDB, Express, GenAI, RAG, teaching methodology, live coding, deployment and HR. |
| [`docs/SYLLABUS-MAPPING.md`](docs/SYLLABUS-MAPPING.md) | The 7 course modules mapped hour-by-hour onto this codebase. |

---

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `buffering timed out after 10000ms` | Windows resolves `localhost` → `::1` (IPv6) but the stock MongoDB `mongod.cfg` binds only `127.0.0.1`. Use `mongodb://127.0.0.1:27017/todo` in `.env`, or change `net: bindIp:` in `mongod.cfg` and restart the service |
| `EADDRINUSE :::8001` | Port 8001 is taken — stop the other process |
| `Failed to resolve import "axios"` | `npm install axios bootstrap` in `frontend/` |
| Browser shows a CORS error | `app.use(cors())` must be present in `server.js` |
| UI stays empty but `curl` works | The controller must send the data: `res.status(200).json(todos)` |
| `node_modules` vanished after `git clean -xdf` | `node_modules/` is gitignored, so `git clean -xdf` deletes it. Re-run `npm install` **at the repository root** |
| `'vite' is not recognized` / `Cannot find package 'vite'` | The root `node_modules` was removed — `npm install` at the repository root, then `npm run build` |
| Deployed site calls `http://localhost:8001/todo` | `VITE_API_URL` was not set at **build** time. Set it in Netlify (Builds scope) and redeploy |
| `npm error ERESOLVE ... peer vite@"^8.0.0"` | `@vitejs/plugin-react@6` needs Vite 8; this project is on Vite 7. Install `@vitejs/plugin-react@^5` |
| `querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net` | Node's DNS client is pointed at `127.0.0.1`, where a stub resolver (Windows Internet Connection Sharing / mobile hotspot) closes the query — while the browser resolves the same name fine. Add `DNS_SERVERS=8.8.8.8,202.88.156.6` to `.env` |
| Deployed site: `(failed) net::ERR_CONNECTION_REFUSED` on a request to `http://localhost:8001/todo` | The built bundle still has the localhost fallback — the browser is calling the visitor's own machine. `VITE_API_URL` never reached the Netlify build. Set it with the **Builds** scope and redeploy |
| `vite: not recognized` right after pushing to GitHub | `git clean -xdf` deleted the gitignored `node_modules/`. Run `npm install` **at the repository root** |

Full troubleshooting table with 23 rows: [`RECREATE.md` → Part 7](RECREATE.md). Deployment
troubleshooting (wrong host, wrong variable name, build-time inlining): [`RECREATE.md` → Part 11](RECREATE.md).

---

## Verified working

Checked against a live MongoDB 8.2 instance, against a **real MongoDB Atlas cluster**, and against
a production Vite build:

```
GET    /todo       → []
POST   /todo       → {"note":"Buy groceries","content":"Milk, bread, eggs","_id":"...","__v":0}
GET    /todo       → [{"_id":"...","note":"Buy groceries",...}]
PUT    /todo/:id   → {"note":"Buy groceries and vegetables",...}
DELETE /todo/:id   → {"message":"Deleted selected todo"}
GET    /todo/:id   → 404 after delete
GET    /health     → {"status":"ok","database":"connected"}
npm run build      → ✓ built in 2.88s
```

Atlas run (SRV + TLS + replica-set discovery, `DNS_SERVERS` override active): connected, and the
full create → read → update → delete cycle succeeded against the cloud cluster.
