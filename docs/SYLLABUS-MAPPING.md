# SYLLABUS-MAPPING.md — BCA-V, Option A: MERN Stack Development

**Course:** 7 modules · 30 hours · ₹500/hour · Outcome: Certificate + Project
**Built on:** the MERN Todo app in this repository

This is the handout version of `RECREATE.md` → Part 8. Where that part is a table, this file is the
lesson plan: for each module, the learning outcomes straight from the syllabus, the exact files in
this codebase that demonstrate them, the demo to run, the lab exercise, and how to assess it.

---

## At a glance

| # | Module | Hrs | Demo | Lab | Assessment |
| - | ------ | --- | ---- | --- | ---------- |
| 1 | Web Development Fundamentals Recap | 3h | `controller.js`, `App.jsx` | Fix the 11 defects | Short quiz + fix-the-bug lab |
| 2 | React.js — Components, Hooks & State | 6h | `App.jsx` | Controlled form + list | Code walkthrough viva |
| 3 | Node.js & Express.js Backend | 6h | `server.js` | Rebuild the router | Explain the middleware pipeline |
| 4 | MongoDB — CRUD & Mongoose ODM | 5h | `Todo.js` | Write the model + queries | Schema design task |
| 5 | REST API Integration & Data Flow | 4h | Postman collection | Wire the UI to the API | Postman + CORS diagnosis task |
| 6 | Authentication, Security & Deployment | 3h | JWT middleware | Add login + protect routes | Security checklist review |
| 7 | Full Stack Capstone Project | 3h | The whole app | Ship an extension | Demo + viva + repo review |

---

## Module 1 — Web Development Fundamentals Recap (3h)

**Syllabus outcomes:** HTML and CSS3 essentials; responsive design principles; JavaScript core
concepts and ES6+ review; Git fundamentals and branching strategy; setting up the MERN development
environment.

**Where it lives in this repo**

| Concept | File | Line-level example |
| ------- | ---- | ------------------ |
| `let` / `const` | `backend/src/controller.js` | `const { note, content } = req.body` |
| Destructuring | `backend/src/controller.js` | same line |
| Arrow functions | `backend/src/controller.js` | `export const createTodo = async (req, res) => {...}` |
| `async` / `await` | `backend/src/controller.js` | `await Todo.find()` |
| `try...catch` | `backend/src/controller.js` | every handler wraps its work |
| Array methods | `frontend/src/App.jsx` | `todos.map(todo => ...)` |
| Modules | all | `import` / `export default` |
| Git | repo root | one commit per step of `RECREATE.md` |
| **MERN environment setup** | root `package.json` | `"workspaces": ["backend", "frontend"]` — one `npm install` for both |

> **The environment-setup outcome is where the workspace layout pays off.** Students run
> `npm install` **once at the root** and get both halves of the stack. Show them the difference:
> before workspaces, two folders meant two installs, two lockfiles that could drift apart, and a
> "works on my machine" bug whenever the versions disagreed. One lockfile removes an entire
> category of classroom problems.

**Demo (45 min).** Open `backend/src/controller.js` and read `getAllTodo` line by line. Every line
is Module 1 content: destructuring, `await`, `try/catch`, an arrow function.

**Lab (2h).** Give students the broken version of this app (eleven defects listed in
`RECREATE.md` → Part 4) and have them find all eleven, write down the symptom each produced, and fix
them. This is the single highest-value 2 hours in the course — it exercises reading, debugging and
the JS core all at once.

**Assessment.** 10-question quiz (closure, `==` vs `===`, spread vs rest, `null` vs `undefined`,
event loop) plus the fix-the-bug lab marked on the *explanation*, not just the fix.

---

## Module 2 — React.js — Components, Hooks & State (6h)

**Syllabus outcomes:** React fundamentals — JSX, components, props; class vs functional components;
`useState` and `useEffect`; React Router for client-side routing; Context API for state management;
custom hooks; conditional rendering and lists.

**Where it lives in this repo**

| Outcome | Where |
| ------- | ----- |
| Components & JSX | `App.jsx` — one functional component |
| Props | `startEdit(todo)` passing the whole record down |
| `useState` | `todos`, `newTodo`, `content`, `viewingId`, `editingId`, `editNote`, `editContent` — one hook per value |
| `useEffect` | `useEffect(() => { fetchTodos(); }, [])` — fetch on mount |
| Conditional rendering | `{todo.content && <p>...}`, `{todos.length === 0 && <li>...}`, `{isViewing && (...)}`, `{isEditing && (...)}` |
| Lists + keys | `todos.map(todo => <li key={todo._id}>` |
| Controlled inputs | `value={newTodo} onChange={...}` **and** the edit form's `value={editNote}` / `value={editContent}` |
| Derived state | `const isViewing = viewingId === todo._id` — one flag per list item |

**Demo (1h).** Start from `useState` alone: type into the input and watch `newTodo` change, then
delete the `value`/`onChange` pair and ask the class what breaks. Then add `useEffect` and watch the
network tab fire.

**Lab (3h).**
1. Add a `completed` boolean to the todo model and render it as a badge.
2. Add a `loading` state — the list shows "Loading..." until the first fetch resolves (this is Q150
   in `INTERVIEW-PREP.md`, so it doubles as interview practice).
3. Add an `error` state and display a friendly message when the backend is down.

**Teaching note — the edit form is the best Module-2 exercise in the app.** The original draft used
`window.prompt`, which returns a single string, so it could only ever edit one field — and it
silently wiped the `content` on every save. The fix (defect #7 in `RECREATE.md` → Part 4) is a
proper inline form with two controlled inputs, prefilled from the selected todo. It teaches
`useState` for one record, per-item derived state, conditional rendering, and why "the form edits
the record, not one field of it".

**Teaching note on StrictMode.** React deliberately runs `useEffect` twice in development. Tell the
class before they discover it, or you will lose twenty minutes to a "bug" that is not one.

**Assessment.** Each student explains `App.jsx` line by line and answers the `useState` / `useEffect`
questions from `INTERVIEW-PREP.md` Q20, Q21, Q22, Q23.

---

## Module 3 — Node.js & Express.js Backend (6h)

**Syllabus outcomes:** Node.js architecture and event-driven model; Express.js REST API design;
middleware pipeline; input validation; error handling strategies; environment variables and config;
MVC pattern implementation.

**Where it lives in this repo**

| Outcome | Where |
| ------- | ----- |
| Event-driven, async | every `async` controller, the `await` calls |
| REST design | `backend/src/routes.js` — five routes, one method each |
| Middleware pipeline | `backend/src/server.js` — `cors()` → `express.json()` → `/health` → router |
| `req` / `res` / `next` | `backend/src/controller.js` |
| Error handling | `try/catch` per handler, `res.status(500)` with a generic message |
| Environment variables | `backend/src/config.js` — `process.env.MONGO_URI` |
| **Config & connection strategy** | `backend/src/config.js` — retry with backoff, explicit timeouts, `process.exit(1)` |
| **Startup sequencing** | `backend/src/server.js` — `await connectDB()` **before** `app.listen()` |
| **Environment & DNS resolution** | `backend/src/config.js` — `process.env.MONGO_URI`, optional `DNS_SERVERS` + `dns.setServers()` |
| MVC | Model = `Todo.js`, Controller = `controller.js`, View/Routes = `routes.js` |

**Teaching note — the startup order is the best Module-3 lesson in this app.** The original draft
called `connectDB()` without `await`, so `app.listen()` ran immediately and the server accepted
requests before the database was connected. Locally you never notice (the local database connects in
milliseconds). Against MongoDB Atlas — which needs an SRV lookup, a TLS handshake and replica-set
discovery — every request in that window died with `buffering timed out after 10000ms`.

That is a complete Module-3 story in one bug: it covers `async`/`await` (what does `await` actually
guarantee?), error handling (what happens when the dependency is unavailable?), configuration
(the connection string is config, not code), and process lifecycle (a server that cannot reach its
database should exit, not pretend). It is defect #10 in `RECREATE.md` → Part 4.

**Lab (1h of the 3h).** Point `MONGO_URI` at a dead port and watch the retry ladder, then confirm
that `curl http://localhost:8001/todo` is refused rather than answered with a 500.

**Lab (1h of the 3h) — the DNS that worked in the browser and failed in the app.** Point
`MONGO_URI` at a MongoDB Atlas SRV string on a machine whose Node resolver is broken, and let
students diagnose `querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net`. Run the two
commands side by side:

```
nslookup _mongodb._tcp.<cluster>.mongodb.net
node -e "require('node:dns').resolveSrv('_mongodb._tcp.<cluster>.mongodb.net', console.log)"
```

The first succeeds, the second fails. That is the whole lesson: **Node's DNS client (c-ares) and
the Windows DNS client are different resolvers**, and they can disagree on the same machine at the
same moment. Students then fix it with `DNS_SERVERS` in `.env` and `dns.setServers()` in
`config.js`. This is defect #11 in `RECREATE.md` → Part 4 and troubleshooting row T22.

**Demo (1h).** Trace one request end to end: `POST /todo` → `express.json()` parses the body →
`router.post("/")` matches → `createTodo` runs → `res.status(201).json(savedTodo)` → React updates.
Draw it on the board; students copy the diagram.

**Lab (3h).**
1. Rebuild `routes.js` and `controller.js` from an empty file against a written spec.
2. Add a `GET /todo/count` endpoint that returns the number of todos.
3. Add centralised error-handling middleware (the pattern in Q49) and move the `try/catch` bodies
   into it.

**Assessment.** Students answer: what does `express.json()` do, what happens if you remove it, what
is the difference between `req.params`, `req.query` and `req.body`, and why is the connection string
in `.env` rather than in the source.

---

## Module 4 — MongoDB — CRUD & Mongoose ODM (5h)

**Syllabus outcomes:** MongoDB data modelling and schema design; Mongoose models, validation and
virtuals; CRUD operations; aggregation pipelines; indexing for performance; relationships —
embedding vs referencing.

**Where it lives in this repo**

| Outcome | Where |
| ------- | ----- |
| Schema design | `backend/src/Todo.js` — `note` required, `content` optional |
| Model vs collection | `mongoose.model("Todo", todoSchema, "todo")` — note the explicit collection name |
| Validation | `required: true` on `note` |
| Create | `new Todo({...}).save()` |
| Read | `Todo.find()`, `Todo.findById()` |
| Update | `Todo.findByIdAndUpdate(..., { new: true, runValidators: true })` |
| Delete | `Todo.findByIdAndDelete()` |

**Demo (1h).** Open MongoDB Compass alongside the running app. Add a todo in the browser, watch the
document appear in the `todo.todo` collection. Show the `_id` that the frontend uses as its `key`.

**Lab (2h).**
1. Extend the schema: `note` gets `minlength: 3` and `maxlength: 100`; `content` gets `trim: true`.
   Add a `completed` boolean with `default: false`.
2. Add an index on `note` and explain what it costs.
3. Write an aggregation pipeline that groups todos by `completed` and counts them — expose it as
   `GET /todo/stats`.

**Teaching note.** Two MongoDB-specific traps are already baked into this project's history:
the `//todo` double slash (database literally named `/todo`) and `localhost` resolving to `::1` on
Windows. Both are in the troubleshooting table in `RECREATE.md` → Part 7 and both make excellent viva
questions.

**Assessment.** Schema design task — students write the schema for a `Student` collection with
validation and explain every option they chose.

---

## Module 5 — REST API Integration & Data Flow (4h)

**Syllabus outcomes:** Axios and Fetch for HTTP requests; connecting React frontend to Express
backend; CORS handling; loading states and error UI; RESTful best practices; API versioning; testing
APIs with Postman.

**Where it lives in this repo**

| Outcome | Where |
| ------- | ----- |
| Axios | `frontend/src/App.jsx` — `axios.get/post/put/delete` |
| Base URL constant | `const API = "http://localhost:8001/todo"` |
| CORS | `backend/src/server.js` — `app.use(cors())` |
| Data flow | `fetchTodos()` after every write |
| RESTful verbs | `routes.js` — GET/POST/PUT/DELETE on one resource |
| Postman | Part 2.7 of `RECREATE.md` gives the exact curl calls to reproduce in Postman |

**Demo (1h).** Open the browser's Network tab. Perform one create. Show the request URL, method,
headers, body, and the JSON response. Then show the same request in Postman — identical, because
the browser adds nothing but cookies and headers.

**Lab (2h).**
1. Rebuild a Postman collection for all five endpoints with a saved example for each.
2. Add API versioning: mount the router at `/api/v1/todo` and keep `/todo` working. Update the
   `API` constant in `App.jsx` and confirm the app still works.
3. Introduce the loading and error UI states from Module 2's lab.

**The CORS exercise (essential).** Remove `app.use(cors())` and reload the page. Students see the
browser block the request while Postman still succeeds. Then restore it. This single 10-minute
exercise teaches more about the browser's security model than any slide.

**Assessment.** Diagnose and fix three broken configurations: missing CORS, missing `express.json()`,
and a typo in a model name. Each with a written root-cause analysis.

---

## Module 6 — Authentication, Security & Deployment (3h)

**Syllabus outcomes:** JWT-based authentication flow; bcrypt password hashing; protected routes;
role-based access control; securing API endpoints; deploying the backend on Render; deploying React
on Vercel; environment configuration.

**Where it lives** — extensions, not in the base app:

| Outcome | Extension |
| ------- | --------- |
| JWT flow | `POST /api/auth/register` + `/api/auth/login`, `jsonwebtoken` |
| bcrypt | `bcrypt.hash(password, 10)` / `bcrypt.compare()` |
| Protected routes | an `authenticate` middleware (Q151) |
| RBAC / ownership | store `userId` on every todo; query `{ _id: id, userId: req.user.id }` |
| Securing endpoints | field allowlists, rate limiting, no stack traces in responses |
| Environment configuration | `.env` locally, `MONGO_URI` on Render, `VITE_API_URL` on Netlify/Vercel |
| Deploying the backend on Render | `render.yaml` — rootDir `backend`, `npm start`, `MONGO_URI` via `sync: false`, health check on `/health` |
| Deploying React on Netlify | `netlify.toml` — base `frontend`, `npm run build`, publish `dist` |
| Deploying React on Vercel | `frontend/vercel.json` — framework `vite`, output `dist` |
| Health checks | `GET /health` → 200 when the DB is connected, 503 when it is not |

**The rule that causes the most damage, teach it early:** there are **two hosts and two
variables**, and they do not cross over.

| Variable | Host | Read by |
| -------- | ---- | ------- |
| `MONGO_URI` | **Render** (backend) | `backend/src/config.js` |
| `VITE_API_URL` | **Netlify / Vercel** (frontend) | `frontend/src/App.jsx` |

Putting the database URI on the frontend host is the classic mistake — it is useless there, and
it puts a database password one careless `VITE_`-prefix away from being published. (Only
`VITE_`-prefixed variables reach the browser bundle, so the *name* is the only thing standing
between a secret and the public internet. That is worth five minutes of class time.)

**Also teach `VITE_API_URL` is baked in at build time.** A student who sets the variable and sees
no change will not understand why until you show them that Vite substitutes it *during the build*,
so the site has to be **rebuilt**, not restarted. The demonstration is two commands:

```bash
VITE_API_URL=https://todo-backend.onrender.com npm run build
grep -o "localhost:8001\|onrender\.com" frontend/dist/assets/*.js | sort -u
```

The habit this builds is the transferable one: **verify the build output, not the source you
wrote.**

**Three Atlas traps worth demonstrating live (5 minutes each):**

1. **The password must be URL-encoded.** `@` → `%40`, `:` → `%3A`, `/` → `%2F`, `#` → `%23`,
   `?` → `%3F`. Get it wrong and Atlas answers `Authentication failed` for a password that is
   demonstrably correct.
2. **The IP Access List.** Atlas drops connections from addresses that are not on the list. The
   symptom is a *timeout*, not an auth error — which sends students hunting in the wrong place.
3. **Check `/health` before the browser.** If it reports `degraded`, the problem is the database,
   not the frontend. This one habit prevents most of the wasted deployment time.

**Also worth showing:** `import.meta.env.VITE_API_URL`. Vite inlines `VITE_`-prefixed variables into
the bundle at build time, which is exactly why the API URL can differ between your laptop and
production — and exactly why **no secret can ever go in a `VITE_` variable** (it ends up in the
browser's JavaScript).

**Demo (1h).** Deploy the backend to Render with `MONGO_URI` set in the platform's environment
variables — never in the repo. Deploy the frontend to Netlify or Vercel. Then show the `.gitignore`
entry that keeps `.env` out of version control, and the `.env.example` that ships the *shape* of the
variable without the secret.

**Two live demonstrations that teach more than a slide:**

1. **Build output.** Run `npm run build` and open `frontend/dist/`. Show that the JS is minified, the
   filenames carry a content hash, and that `dist/` is in `.gitignore` — the platform rebuilds it.
2. **The `publish` trap.** Change `publish = "dist"` to `publish = "frontend/dist"` in
   `netlify.toml` and show the build failing with *publish directory not found*. Netlify resolves
   `publish` **relative to `base`**. One word of path, one failed deployment.

**Also worth showing:** `import.meta.env.VITE_API_URL`. Vite inlines `VITE_`-prefixed variables into
the bundle at build time, which is exactly why the API URL can differ between your laptop and
production — and exactly why **no secret can ever go in a `VITE_` variable** (it ends up in the
browser's JavaScript).

**Lab (1h).** Add register + login, protect `POST /todo`, and confirm that a request without a
token gets `401` while a request with a valid token succeeds.

**Assessment.** Security checklist review — students audit their own app against the list in Q127
and find the gaps.

---

## Module 7 — Full Stack Capstone Project (3h)

**Syllabus outcomes:** build a complete MERN application (Task Manager / E-commerce dashboard);
GitHub repo with a README; code review session; demo presentation and viva; suggestions for further
learning.

**This project IS the capstone.** The Todo app is a Task Manager.

| Deliverable | Where it is |
| ----------- | ----------- |
| Complete MERN application | this repository |
| GitHub repo with a README | `README.md` |
| Build documentation | `RECREATE.md` |
| Code review material | the eleven defects in `RECREATE.md` → Part 4 |
| Demo script | `INTERVIEW-PREP.md` → Part 16 |
| Viva questions | `RECREATE.md` → Part 10 (10 questions) |
| Further learning | `RECREATE.md` → Part 9 (8 graded extensions) |

**Milestones (4 weeks, per Q138).**

| Week | Deliverable |
| ---- | ----------- |
| 1 | Requirements, wireframes, data model and API design |
| 2 | Core React UI, backend endpoints and database integration ← *this repo reaches here* |
| 3 | Validation, authentication, testing and optional GenAI feature |
| 4 | Bug fixes, deployment, documentation and individual demonstrations |

**Assessment rubric (from Q109, adapted).**

| Criterion | Weight | What earns full marks |
| --------- | ------ | --------------------- |
| Functionality | 25% | All five CRUD operations work end to end |
| API correctness | 15% | Correct verbs, status codes, meaningful error responses |
| Database design | 15% | Sensible schema, validation, at least one justified index |
| Code quality | 15% | Consistent structure, no dead code, readable names |
| Error handling | 10% | Every route handles failure; no stack traces leak |
| UI and state handling | 10% | Loading, error and empty states present |
| Explanation | 10% | Student can explain every decision without notes |

> Reward reasoning over polish. A student who can explain *why* `app.use(cors())` sits above the
> router should score higher than one who has a better-looking UI and cannot say why it works.

**Suggested grading bands:** beginner / intermediate / advanced, with differentiated extension
tasks from `RECREATE.md` → Part 9. Advanced students get JWT + aggregation + pagination; beginners
get the guided rebuild from `RECREATE.md` with the Postman collection already written for them.

---

## The 11-session timetable

| Session | Hours | Module | Focus | Lab |
| ------- | ----- | ------ | ----- | --- |
| 1 | 3 | 1 | JS/ES6 recap, Git, environment setup | One root `npm install` works on every machine |
| 2 | 3 | 2 | Components, JSX, props, `useState` | Static form with local state |
| 3 | 3 | 2 | `useEffect`, lists, keys, conditional rendering | Todos render from a hardcoded array |
| 4 | 3 | 3 | Node, the event loop, `async/await` | Explain the async flow in `controller.js` |
| 5 | 3 | 3 | Express routing and the middleware pipeline | Rebuild `routes.js` from a spec |
| 6 | 3 | 4 | Mongoose schemas, validation, CRUD | Write the model and all five queries |
| 7 | 3 | 4 + 5 | Connect the layers; CORS; Axios | Full CRUD working in the browser |
| 8 | 3 | 5 | Error handling, validation, Postman | A documented API collection |
| 9 | 3 | 6 | JWT auth and protected routes | Logged-in users only |
| 10 | 3 | 6 | Deployment: Render + Netlify/Vercel | A live URL |
| 11 | 3 | 7 | Capstone extensions, README, demo, viva | Ship one graded extension |

Total: **33 hours of session time for a 30-hour course** — trim sessions 4 and 10 by 1.5h each, or
run session 1 and 4 as a combined 4h workshop. Keep session 11 intact; the demo and viva are the
outcomes the whole course is assessed against.

---

## A note on the GenAI module

The companion *Prompt Engineering & Generative AI* course (7 modules, 30h) pairs naturally with
this one. The bridge is one endpoint:

```
POST /todo/ask  →  Express calls the LLM with the user's todos  →  returns a daily plan
```

That single endpoint touches five syllabus lines of the GenAI course: prompt construction (Module
2), API integration (Module 4), API-key security (Module 4), cost control (Module 6) and
responsible AI (Module 6). Build it as the capstone stretch task and you have a demoable answer to
"show me an AI feature inside a MERN application" — which is the single most likely practical
question in the interview pack (see `INTERVIEW-PREP.md`, Q143).

---

*Cross-referenced with `RECREATE.md` (build guide), `INTERVIEW-PREP.md` (153 Q&A) and the BCA-V
MERN Stack Development syllabus (7 modules / 30 hours).*
