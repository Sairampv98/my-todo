import express from "express";
import cors from "cors";
import router from "./routes.js";
import dotenv from "dotenv";
import { connectDB } from "./config.js";

dotenv.config({ path: "../.env" });
dotenv.config();

const app = express();

// Open the MongoDB connection before the server starts accepting requests.
connectDB();

// CORS: the React app runs on http://localhost:5173 and the API on :8001.
// Without this, the browser blocks every fetch as a cross-origin request.
app.use(cors());

// Middleware: lets Express parse a JSON body (req.body) for POST/PUT.
app.use(express.json());

// Mount the router. Every route inside it is prefixed with /todo.
app.use("/todo", router);

app.listen(8001, () => {
    console.log("Server is running on port 8001");
});
