import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes.js";
import dotenv from "dotenv";
import { connectDB } from "./config.js";

dotenv.config({ path: "../.env" });
dotenv.config();

const app = express();

// A friendly root route.
//
// Without this, opening the deployed URL in a browser shows Express's bare
// "Cannot GET /" 404 page - which looks like a broken deployment even when
// the server is perfectly healthy. This route turns that moment into a
// confirmation, and it tells the visitor exactly where the API lives.
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

// CORS: the React app runs on http://localhost:5173 and the API on :8001.
// Without this, the browser blocks every fetch as a cross-origin request.
app.use(cors());

// Middleware: lets Express parse a JSON body (req.body) for POST/PUT.
app.use(express.json());

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

/**
 * Start the server ONLY after the database is connected.
 *
 * This order matters. If we called app.listen() first, the server would accept
 * requests while Mongoose was still connecting, and every one of those
 * requests would fail with "buffering timed out after 10000ms". With a local
 * MongoDB the window is tiny; against MongoDB Atlas it is several seconds.
 */
const start = async () => {
    await connectDB();

    app.listen(8001, () => {
        console.log("Server is running on port 8001");
    });
};

start().catch((error) => {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
});
