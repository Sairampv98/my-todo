# Three deployment strategies for this MERN app

**Module 6 (Authentication, Security & Deployment) — the reading that answers
"why is the backend not on the same host as the frontend?"**

---

## The short answer

Yes: the current setup is **Netlify (frontend) + Render (backend) + MongoDB
Atlas (database)**. Three services, three dashboards, two environment
variables.

And yes — you *can* put more of it in one place. In fact you can put **all of
it** in one place, twice over. That is why this document exists: the same
codebase supports three genuinely different topologies, and each one teaches
something the other two cannot.

| | Strategy 1 | Strategy 2 | Strategy 3 |
| --- | --- | --- | --- |
| **Name** | Everything on Netlify | Everything on Render | Split across two hosts |
| **Frontend** | Netlify (static) | Render (served by Express) | Netlify (static) |
| **Backend** | Netlify **Function** (serverless) | Render (one web service) | Render (web service) |
| **Database** | MongoDB Atlas | MongoDB Atlas | MongoDB Atlas |
| **URLs** | 1 site, API on `/api` | 1 site, API on the same origin | 2 sites, API cross-origin |
| **CORS needed?** | No (same origin) | No (same origin) | **Yes** |
| **Build-time config** | `VITE_API_URL=/api` | none at all | `VITE_API_URL=https://<backend>.onrender.com` |
| **Where the DB password lives** | Netlify | Render | Render |
| **Backend model** | Serverless, 10 s limit | Always-on process | Always-on process |
| **Config file** | `netlify.toml` | `render-all.yaml` | `netlify.toml` + `render.yaml` |
| **Cost** | Free | Free | Free |
| **Hardest concept** | Serverless constraints | Same-origin, no CORS | Build-time configuration |

---

## Strategy 3 — Split across two hosts (the current setup)

**This is what is already deployed and working.** The frontend is static files
on a CDN; the API is a container that stays running; the database is a managed
cluster.

```
Netlify  ────────►  frontend/dist      (React, static, CDN-cached)
   │
   │  VITE_API_URL = https://todo-backend.onrender.com
   ▼
Render  ────────►  Express on :8001    (always-on process)
   │
   │  MONGO_URI = mongodb+srv://...
   ▼
MongoDB Atlas
```

**Why this shape?** Two different kinds of thing want two different kinds of
host. Static files want a CDN: cached at the edge, served from thousands of
locations, no process to keep alive. A stateful API wants a process that stays
up, with a warm connection pool to the database and an open port.

**The cost:** the two live in different places, so the browser makes a
cross-origin request. That is what `app.use(cors())` is for, and it is what
`VITE_API_URL` is for. Two services, two dashboards, two environment
variables — and one build-time variable that is silently wrong until you
rebuild. That last part is the single most common student failure in this
course, and it is a genuinely good lesson.

**Setup**

1. **Render** — Blueprint from the repo, `render.yaml`. Set `MONGO_URI`.
2. **Netlify** — import the repo. Set `VITE_API_URL` = the backend's URL
   (origin only, no `/todo`), scope *Builds, Functions, Runtime*. **Delete**
   `MONGO_URI` and `DNS_SERVERS` from Netlify — the database password does not
   belong in a frontend build environment.
3. Redeploy. Confirm the bundle hash changed.

**What it teaches:** build-time configuration. The variable is *inlined* into
the JavaScript at build time, so setting it after the build does nothing, and
getting it wrong fails silently until a user clicks the page.

---

## Strategy 2 — Everything on Render (one service, one origin)

**One Render web service serves both the React app and the API.** The build
compiles the frontend into `frontend/dist`; the Express server serves that
folder from the same origin as the API.

```
https://todo-backend.onrender.com/           → the React app
https://todo-backend.onrender.com/health     → the health check
https://todo-backend.onrender.com/todo       → the API
```

**There is no `VITE_API_URL` at all.** The frontend calls `/todo` — a relative
path — so the browser sends it to the same origin it loaded the page from. No
CORS, because there is no cross-origin request. No build-time variable to get
wrong.

**How the code supports it** (`backend/src/server.js`):

```js
const distPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../frontend/dist"
);

if (fs.existsSync(path.join(distPath, "index.html"))) {
    app.use(express.static(distPath));
}
```

The static handler is registered **before** the API routes, and the SPA
fallback (`app.get("*")`) is registered **after** them — so `/todo/<id>` still
returns JSON 404s, and only genuine client-side routes fall through to
`index.html`.

**Setup**

1. Render → **New → Blueprint** → the repo → set **Blueprint path** to
   `render-all.yaml` (Render defaults to `render.yaml`).
2. Set `MONGO_URI` when prompted. **Nothing else.**
3. Deploy. One URL. Done.

**What it teaches:** the same-origin idea, and it makes CORS *disappear*. Ask
students: "what did `app.use(cors())` protect against, and why is it not
needed here?" The answer — "the browser only blocks cross-origin requests, and
there are none" — is worth more than memorising the header name.

**Trade-off:** you give up the CDN. Every asset request hits your (free, sleep-
prone) container instead of an edge cache. For a class project that is a
non-issue; for a real product it is not.

---

## Strategy 1 — Everything on Netlify (serverless functions)

The API becomes a **Netlify Function**: the same Express app, wrapped so a
serverless runtime can invoke it.

```
https://your-site.netlify.app/          → the React app
https://your-site.netlify.app/api/todo   → the API (a Function)
```

Because the function is on the same site, the frontend calls `/api/todo` —
relative, same-origin, no CORS.

**How the code supports it.** Three changes in `backend/src/server.js`:

1. **The app is exported, not just started.**
   ```js
   export { app, ensureDB };

   const isEntryPoint =
       process.argv[1] &&
       path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

   if (isEntryPoint) {
       start().catch(/* ... */);
   }
   ```
   `node src/server.js` still listens on 8001. A function that *imports* the
   file gets the Express app without a port.

2. **The database connection is lazy and cached.**
   ```js
   let dbPromise = null;
   const ensureDB = () => {
       if (!dbPromise) dbPromise = connectDB(5, { exitOnFailure: false });
       return dbPromise;
   };
   ```
   A serverless instance has no startup, so the connection is made on the
   first request and reused while the instance stays warm.

3. **`connectDB` can fail without killing the process.** A normal server must
   exit rather than pretend to be healthy; a function must be able to answer
   with a `503`. Hence the `exitOnFailure` option.

The function itself is four lines (`frontend/netlify/functions/api.js`):

```js
import serverless from "serverless-http";
import { app } from "../../../backend/src/server.js";

export const handler = serverless(app);
```

`serverless-http` translates the function's event object into an ordinary
HTTP request, runs the Express app, and translates the response back.

**Setup**

1. Netlify → import the repo. The `netlify.toml` already contains the
   `[functions]` block and the redirect:
   ```toml
   [[redirects]]
   from = "/api/*"
   to = "/.netlify/functions/api/:splat"
   status = 200
   force = true
   ```
2. Set `VITE_API_URL` = `/api` (a **path**, not a URL).
3. Set `MONGO_URI` — the function needs it. This is the price of the strategy:
   **the database password now lives in the frontend host's environment.**
4. Deploy, then confirm: the deploy log should mention one function, and
   `https://your-site.netlify.app/api/health` should return
   `{"status":"ok","database":"connected"}`.

**What it teaches, and where it hurts.** A Netlify Function has a hard
**10-second execution limit** (26 s on paid plans), is created and destroyed
around each request, keeps no memory between requests, and scales to zero when
idle. Five things in an ordinary Express app break immediately:

1. **In-memory state** — a session store, a rate limiter, a cache in a
   module-level variable. The next request lands on a different instance.
2. **WebSockets and server-sent events** — a function answers a request and
   exits; it cannot hold a socket open.
3. **Long requests** — anything slower than the limit is killed mid-flight.
4. **Background work** — `setInterval`, a queue consumer. When the response
   is sent, the instance can be frozen or destroyed.
5. **Database connection pools** — and this one bites *this* app. Mongoose
   keeps a pool of sockets to Atlas. Every cold start opens a new pool; enough
   cold starts and you exhaust Atlas's connection limit. The fix is the Atlas
   **Serverless Driver** (`mongodb://` with `retryWrites=false`).

> **Netlify's own support guide** on running a server there: *"How do I run a
> server/database at Netlify? … the answer is: you can't!"* — with three ways
> out: adapt the code to serverless functions, host the back-end elsewhere and
> proxy to it, or host the whole application elsewhere. Strategy 1 is the first
> of those; Strategy 3 is the second; Strategy 2 is the third.

---

## Which one should you teach, and when?

| If the session is about… | Teach | Because |
| ----------------------- | ----- | ------- |
| REST APIs, CORS, `fetch` vs `axios` | **Strategy 3** | Two origins make CORS visible and worth explaining |
| Build pipelines, environment variables | **Strategy 3** | `VITE_API_URL` inlined at build time is a real, reproducible trap |
| Serverless, cloud constraints, "what breaks?" | **Strategy 1** | The five breakages are the lesson |
| Clean architecture, minimal config | **Strategy 2** | One origin, no CORS, no variables — the simplest correct deployment |
| A capstone demo in one afternoon | **Strategy 2** | One service, one URL, one variable to set |

**A good 30-minute comparison exercise.** Deploy the same repo three ways and
have students answer:

1. Which one needs `cors()`? Why? *(2 and 1 do not; 3 does)*
2. Which one has the database password in the frontend host? *(1)*
3. Which one fails if the laptop of the person who built it goes to sleep? *(none — but Strategy 1 fails whenever the instance scales to zero, which you can demonstrate)*
4. Which one breaks if you paste a 30-second request into it? *(1)*
5. Which one needs a rebuild when you change the API address? *(1 and 3 — 2 does not, because it has no API address)*

**And the honest conclusion to leave them with:** none of these three is "the
correct one". They are three points on a trade-off axis — *how much state does
the backend hold, and who is willing to hold it for you*. Production teams pick
from that axis every time, and the reason they can is that they understand
what each choice costs.

---

## Verifying a deployment — the same checks for all three

```bash
# 1. Is the API alive, and is the database reachable?
curl https://<your-backend>/health
# {"status":"ok","database":"connected"}

# 2. Does a full CRUD cycle work end to end?
curl -X POST https://<your-backend>/todo \
     -H "Content-Type: application/json" \
     -d '{"note":"check","content":"one round trip"}'

# 3. Does the frontend point at the right place?
#    Open the Network tab, click the request, and read
#    Headers -> Request URL. It must NOT be http://localhost:8001/todo.

# 4. Did the variable reach the build? (Strategies 1 and 3)
grep -o "localhost:8001\|onrender\.com" frontend/dist/assets/*.js | sort -u
# Strategy 3 -> onrender.com     Strategy 1 -> nothing, because the value
#                                  is the relative path /api
```

**A `404` on the root URL is not a failure.** Express answers `Cannot GET /`
for a path with no route, and the router is mounted at `/todo`. Open
`/health`. (This build now also serves a small JSON at `/` so the root URL
confirms itself.)

**On the free tiers, the first request after an idle period can take 30–50
seconds** while the instance spins up. That is the free tier, not a hang.

---

## What is verified, and what is not

| Claim | Status |
| ----- | ------ |
| The Express app works as a Netlify Function (full CRUD through the real handler, against the real Atlas cluster) | **Verified locally** — `tools/function-smoke-test.mjs` |
| Importing `server.js` does not open a port (so a function does not leak a listener) | **Verified locally** |
| The lazy database connection and the cached promise work in a cold instance | **Verified locally** |
| Strategy 2 serves the React app and the API from one origin, with no CORS | **Verified locally** — `/` returned `index.html` and `/todo` returned `200` |
| The frontend build succeeds and the bundle inlines the variable | **Verified locally**, and by a real Netlify build log |
| Strategy 3 on Render, against the real Atlas cluster | **Verified live** — full CRUD against `todo-backend-1bri.onrender.com` |
| Netlify's esbuild bundling of the function, and the `/api/*` redirect, in a real deploy | **Not verified** — the Netlify CLI could not start on this machine (it cannot spawn a child process to run the dev server). Confirm with the two checks below after your first deploy |

**Confirming Strategy 1 after your first deploy:**

1. The deploy log must mention **one function** being deployed. Zero functions
   means the functions directory was not found — check that the base directory
   is the repository root and that the function is at
   `frontend/netlify/functions/api.js`.
2. `https://your-site.netlify.app/api/health` must return
   `{"status":"ok","database":"connected"}`. If it 404s, the redirect rule is
   missing or is below the SPA rule; if it 502s, the function failed to start
   (check the function's log in the Netlify dashboard).

---

## Related reading in this kit

| Topic | Where |
| ----- | ----- |
| The 10 original defects | `RECREATE.md` → Part 4 |
| Troubleshooting table (26 rows) | `RECREATE.md` → Part 7 |
| Deployment walkthrough, step by step | `RECREATE.md` → Part 11 |
| Why the backend needs its own host | `RECREATE.md` → Part 11, Step 11.2 |
| 153 interview questions | `docs/INTERVIEW-PREP.md` |
| Module-by-module teaching plan | `docs/SYLLABUS-MAPPING.md` |
