import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import router from "./routes.js";
import dotenv from "dotenv";
import { connectDB } from "./config.js";

dotenv.config({ path: "../.env" });
dotenv.config();

const app = express();

// CORS: the React app runs on http://localhost:5173 and the API on :8001.
// Without this, the browser blocks every fetch as a cross-origin request.
// (When the frontend and the API are served from the SAME origin - Strategy 2 -
// this is a no-op, because there is no cross-origin request to block.)
app.use(cors());

// Middleware: lets Express parse a JSON body (req.body) for POST/PUT.
app.use(express.json());

// The compiled React app, if it has been built.
//
// `npm run build` writes it to frontend/dist. When that folder exists we
// serve it from the same origin as the API, which means the browser never
// makes a cross-origin request: no CORS, and no VITE_API_URL to get wrong.
// This is what lets ONE Render service host the entire application.
//
// If the folder is not there - local development, where Vite serves the app
// instead, or a backend-only deploy - this simply does nothing.
const distPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../frontend/dist"
);

const hasBuiltFrontend = fs.existsSync(path.join(distPath, "index.html"));

if (hasBuiltFrontend) {
    app.use(express.static(distPath));
}

// A friendly root route.
//
// Without this, opening the deployed URL in a browser shows Express's bare
// "Cannot GET /" 404 page - which looks like a broken deployment even when
// the server is perfectly healthy. This route turns that moment into a
// confirmation, and it tells the visitor exactly where the API lives.
//
// When the built frontend is being served, the static handler above already
// answered "/" with index.html, so this JSON is the API-only answer.
app.get("/", (req, res) => {
    res.status(200).json({
        service: "todo-backend",
        status: "running",
        endpoints: {
            health: "/health",
            todos: "/todo",
        },
    });
});

/**
 * Connect to the database once, and reuse that promise.
 *
 * A normal server connects at startup and then stays connected for hours. A
 * serverless function has no startup at all: it is created for one request,
 * used, and thrown away. So the connection is made lazily, on the first
 * request, and the promise is cached - a warm instance reuses the connection
 * pool it already has instead of opening a new one for every request.
 */
let dbPromise = null;

const ensureDB = () => {
    if (!dbPromise) {
        // exitOnFailure: false - a function must be able to answer with a 503
        // rather than being killed mid-request.
        dbPromise = connectDB(5, { exitOnFailure: false });
    }
    return dbPromise;
};

// Make sure the database is connected before any route handler runs.
// It sits ABOVE /health on purpose: a health check that reports "disconnected"
// on a cold serverless instance would be reporting the cold start, not the
// truth. Here the first call waits for the connection and then reports it.
app.use(async (req, res, next) => {
    try {
        await ensureDB();
        next();
    } catch (error) {
        res.status(503).json({
            status: "degraded",
            database: "unreachable",
            error: error.message,
        });
    }
});

// Health check. The hosting platform (Render) polls this to decide whether
// the service is up. It also reports the database state, so a service that is
// running but disconnected is visible instead of silently failing requests.
const DB_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

app.get("/health", (req, res) => {
    const state = mongoose.connection.readyState;
    const ready = state === 1; // 1 === connected
    res.status(ready ? 200 : 503).json({
        status: ready ? "ok" : "degraded",
        database: DB_STATES[state] || "unknown",
    });
});

// Mount the router. Every route inside it is prefixed with /todo.
app.use("/todo", router);

// Single-page application fallback.
//
// Registered LAST, so it can only be reached by a path that is not an API
// route: the router above has already answered everything under /todo, and
// /health has already answered itself. Anything left is a client-side route,
// and the React app should handle it.
if (hasBuiltFrontend) {
    app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

/**
 * Start the server ONLY after the database is connected.
 *
 * This order matters. If we called app.listen() first, the server would accept
 * requests while Mongoose was still connecting, and every one of those
 * requests would fail with "buffering timed out after 10000ms". With a local
 * MongoDB the window is tiny; against MongoDB Atlas it is several seconds.
 */
const start = async () => {
    await ensureDB();

    app.listen(8001, () => {
        console.log("Server is running on port 8001");
    });
};

// Export the app so a serverless function can wrap it.
// See netlify/functions/api.js for the "everything on Netlify" strategy.
export { app, ensureDB };

// Run the server ONLY when this file is the entry point.
//
//   node src/server.js        -> entry point  -> start listening on 8001
//   a Netlify Function imports it -> not the entry point -> no listener,
//   because the function runtime supplies the HTTP request instead.
const isEntryPoint =
    process.argv[1] &&
    path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isEntryPoint) {
    start().catch((error) => {
        console.error("Failed to start the server:", error.message);
        process.exit(1);
    });
}
