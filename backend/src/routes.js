import express from "express";
import {
    createTodo,
    deleteTodo,
    getAllTodo,
    getTodoById,
    updateTodo,
} from "./controller.js";

const router = express.Router();

// CRUD routes for the Todo collection.
// The router is mounted at /todo inside server.js, so:
//   GET    /todo        -> list all todos
//   GET    /todo/:id    -> fetch one todo
//   POST   /todo        -> create a todo
//   PUT    /todo/:id    -> update a todo
//   DELETE /todo/:id    -> delete a todo
router.get("/", getAllTodo);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
